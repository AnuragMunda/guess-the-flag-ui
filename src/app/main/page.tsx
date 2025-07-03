'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAbly } from '@/context/ably-provider';
import countries from '@/assets/countries.json';
import FeedbackRow from '@/components/feedback-row';
import FlagDisplay from '@/components/flag-display';
import OptionsGrid from '@/components/options-grid';
import PlayerBar from '@/components/player-bar';

/* ─────────── Types ─────────── */
interface PlayerInfo {
    id: string;
    name: string;
    score: number;
    avatar: string;
}

interface GameQuestion {
    code: string;
    correctAnswer: string;
    options: string[];
}

interface FeedbackData {
    type: 'correct' | 'wrong' | 'info';
    message: string;
    score: number;
}

/* ─────────── Constants ─────────── */
const TOTAL_ROUNDS = 5;
const ROUND_TIME = 15;

/* RNG helpers */
const rngFactory = (seed: number) => () => {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const pickRandomSeeded = <T,>(arr: T[], n: number, rnd: () => number): T[] => {
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(rnd() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy.slice(0, n);
};

/* ─────────── Component ─────────── */
export default function GTFMainPage() {
    const { ably } = useAbly();
    const search = useSearchParams();
    const roomId = search.get('roomId');
    const router = useRouter();

    /* ----- Refs & State ----- */
    const [players, setPlayers] = useState<PlayerInfo[]>([]);
    const playersRef = useRef(players);
    const [questions, setQuestions] = useState<GameQuestion[]>([]);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(ROUND_TIME);
    const [gameState, setGameState] =
        useState<'waiting' | 'playing' | 'finished'>('waiting');
    const [answerSent, setAnswerSent] = useState(false);
    const [feedback, setFeedback] = useState<FeedbackData | null>(null);

    /* per‑round refs */
    const leaderRef = useRef<string | null>(null);
    const firstCorrectRef = useRef<string | null>(null);
    const scoredThisRound = useRef<Set<string>>(new Set());
    const nextSentRef = useRef(false);
    const finishedPublished = useRef(false);

    /* helper */
    const isLeader = useCallback(() => ably?.auth.clientId === leaderRef.current, [ably]);

    /* keep players ref in sync */
    useEffect(() => {
        playersRef.current = players;
    }, [players]);

    /* ----- Send an answer ----- */
    const sendAnswer = useCallback(
        (ans: string | null) => {
            if (answerSent || gameState !== 'playing' || !ably || !roomId) return;
            setAnswerSent(true);

            ably.channels.get(roomId).publish('answer', {
                playerId: ably.auth.clientId,
                questionIndex: currentQuestion,
                answer: ans,
                ts: Date.now(),
            });
        },
        [answerSent, gameState, ably, roomId, currentQuestion]
    );

    /* ----- Initialise match ----- */
    useEffect(() => {
        if (!ably || !roomId) return;
        const channel = ably.channels.get(roomId);

        const buildQuestions = (seed: number) => {
            const rnd = rngFactory(seed);
            return pickRandomSeeded(countries, TOTAL_ROUNDS, rnd).map((c) => {
                const distractors = pickRandomSeeded(
                    countries.filter((x) => x.code !== c.code).map((x) => x.name),
                    3,
                    rnd
                );
                const opts = pickRandomSeeded([c.name, ...distractors], 4, rnd);
                return { code: c.code, correctAnswer: c.name, options: opts };
            });
        };

        const initGame = (data: any) => {
            const { players: ids, seed } = data;
            setPlayers(
                ids.map((id: string, idx: number) => ({
                    id,
                    name: id === ably.auth.clientId ? 'You' : `Player ${idx + 1}`,
                    avatar: id === ably.auth.clientId ? '🧒🏽' : '🧔🏽',
                    score: 0,
                }))
            );
            setQuestions(buildQuestions(seed));
            setGameState('playing');
            leaderRef.current = [...ids].sort()[0];
        };

        (async () => {
            await channel.attach();
            const hist = await channel.history({ limit: 10, direction: 'backwards' });
            const startMsg = hist.items.find((m) => m.name === 'match:start');
            if (startMsg) initGame(startMsg.data);
            else channel.subscribe((m) => m.name === 'match:start' && initGame(m.data));
        })();
    }, [ably, roomId]);

    /* ----- Ably event handlers ----- */
    useEffect(() => {
        if (!ably || !roomId) return;
        const channel = ably.channels.get(roomId);

        /* 1. score:update – always mutate locally */
        const onScoreUpdate = (msg: any) => {
            const { playerId, delta } = msg.data;
            setPlayers((prev) =>
                prev.map((p) =>
                    p.id === playerId ? { ...p, score: Math.max(0, p.score + delta) } : p
                )
            );

            /* show feedback only for local player */
            if (playerId === ably.auth.clientId) {
                let fb: FeedbackData;
                if (delta === 10) fb = { type: 'correct', message: "Awesome!", score: 10 };
                else if (delta === 7) fb = { type: 'correct', message: 'Correct Answer', score: 7 };
                else if (delta === 0) fb = { type: 'wrong', message: 'Wrong Answer', score: 0 };
                else fb = { type: 'info', message: "⏰ Time's up!", score: 0 };

                setFeedback(fb);
                setTimeout(() => setFeedback(null), 2000);
            }
        };

        /* 2. answer – leader decides delta & broadcasts score:update */
        const onAnswer = (msg: any) => {
            const { playerId, questionIndex, answer } = msg.data;
            if (questionIndex !== currentQuestion) return;

            const currentQ = questions[questionIndex];
            const correct = answer === currentQ.correctAnswer;

            /* Only leader awards points */
            if (!isLeader()) return;

            if (scoredThisRound.current.has(playerId)) return; // already done

            let delta = 0;
            if (correct) {
                if (firstCorrectRef.current === null) {
                    firstCorrectRef.current = playerId;
                    delta = 10;
                } else delta = 7;
            } else if (answer !== null) delta = 0;

            scoredThisRound.current.add(playerId);
            channel.publish('score:update', { playerId, delta });

            /* check if all answered */
            const answered = scoredThisRound.current.size;
            if (answered === playersRef.current.length) {
                setTimeout(() => {
                    if (currentQuestion === TOTAL_ROUNDS - 1 && !finishedPublished.current) {
                        finishedPublished.current = true;
                        const final = { players: playersRef.current };
                        channel.publish('match:finished', final);
                        localStorage.setItem('gtf:results', JSON.stringify(final.players));
                    } else if (!nextSentRef.current) {
                        nextSentRef.current = true;
                        channel.publish('match:next', { questionIndex: currentQuestion });
                    }
                }, 1500);
            }
        };

        /* 3. match:next */
        const onNext = (msg: any) => {
            if (msg.data?.questionIndex !== currentQuestion) return;
            if (currentQuestion >= TOTAL_ROUNDS - 1) return;
            nextSentRef.current = false;
            setCurrentQuestion((q) => q + 1);
            setTimeLeft(ROUND_TIME);
            setAnswerSent(false);
            scoredThisRound.current.clear();
            firstCorrectRef.current = null;
        };

        /* 4. match:finished */
        const onFinished = (msg: any) => {
            const finalPlayers = msg.data.players ?? playersRef.current;
            setPlayers(finalPlayers);
            localStorage.setItem('gtf:results', JSON.stringify(finalPlayers));
            setGameState('finished');
            setTimeout(() => router.replace('/results'), 2000);
        };

        /* subscribe */
        channel.subscribe('score:update', onScoreUpdate);
        channel.subscribe('answer', onAnswer);
        channel.subscribe('match:next', onNext);
        channel.subscribe('match:finished', onFinished);

        /* cleanup */
        return () => {
            channel.unsubscribe('score:update', onScoreUpdate);
            channel.unsubscribe('answer', onAnswer);
            channel.unsubscribe('match:next', onNext);
            channel.unsubscribe('match:finished', onFinished);
        };
    }, [ably, roomId, currentQuestion, questions, router, isLeader]);

    /* ----- timer ----- */
    useEffect(() => {
        if (gameState !== 'playing') return;
        if (timeLeft === 0) {
            sendAnswer(null); // time‑up = 0 points
            return;
        }
        const id = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
        return () => clearTimeout(id);
    }, [timeLeft, gameState, sendAnswer]);

    /* ----- guards ----- */
    if (!roomId || !ably)
        return <div className="h-screen flex items-center justify-center text-white">Connecting…</div>;

    if (gameState === 'waiting' || !questions.length)
        return <div className="h-screen flex items-center justify-center text-white">Waiting for players…</div>;

    if (gameState === 'finished')
        return <div className="h-screen flex items-center justify-center text-white">Game Over. Redirecting…</div>;

    const { code, options, correctAnswer } = questions[currentQuestion];
    const flagSrc = `/flags/${code.toLowerCase()}.svg`;

    /* ----- render ----- */
    return (
        <div className="h-screen flex flex-col p-4 overflow-hidden bg-black text-white">
            <div className="max-w-4xl mx-auto flex-1 flex flex-col gap-6">
                <PlayerBar
                    players={players}
                    timeLeft={timeLeft}
                    currentRound={currentQuestion + 1}
                    totalRounds={TOTAL_ROUNDS}
                />
                <FlagDisplay flagUrl={flagSrc} gameState={gameState} />
                <OptionsGrid
                    options={options}
                    onAnswer={sendAnswer}
                    gameState={gameState}
                    correctAnswer={correctAnswer}
                />
            </div>
            {feedback && <FeedbackRow feedback={feedback} />}
        </div>
    );
}
