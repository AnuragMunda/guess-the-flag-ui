"use client";

import FeedbackRow from '@/components/feedback-row';
import FlagDisplay from '@/components/flag-display';
import OptionsGrid from '@/components/options-grid';
import PlayerBar from '@/components/player-bar'
import React, { useEffect, useState } from 'react'
import BrazilFlag from "@/assets/brazil-flag.png"
import { StaticImageData } from 'next/image';
import { useRouter } from 'next/navigation';

interface Player {
    id: number;
    name: string;
    score: number;
    avatar: string;
}

interface GameQuestion {
    flagUrl: StaticImageData;
    correctAnswer: string;
    options: string[];
}

const sampleQuestions: GameQuestion[] = [
    {
        flagUrl: BrazilFlag,
        correctAnswer: "France",
        options: ["France", "Italy", "Belgium", "Netherlands"]
    },
    {
        flagUrl: BrazilFlag,
        correctAnswer: "Japan",
        options: ["Japan", "South Korea", "China", "Thailand"]
    },
    {
        flagUrl: BrazilFlag,
        correctAnswer: "Brazil",
        options: ["Brazil", "Portugal", "Argentina", "Colombia"]
    },
    {
        flagUrl: BrazilFlag,
        correctAnswer: "Brazil",
        options: ["Brazil", "Portugal", "Argentina", "Colombia"]
    },
    {
        flagUrl: BrazilFlag,
        correctAnswer: "Brazil",
        options: ["Brazil", "Portugal", "Argentina", "Colombia"]
    }
];

const GTFMainPage = () => {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([
        { id: 1, name: "Player 1", score: 0, avatar: "👤" },
        { id: 2, name: "Player 2", score: 0, avatar: "👥" }
    ]);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [timeLeft, setTimeLeft] = useState(15);
    const [gameState, setGameState] = useState<'playing' | 'feedback'>('playing');
    const [feedback, setFeedback] = useState<{ type: string; message: string; score: number } | null>(null);
    const [currentPlayer, setCurrentPlayer] = useState(1);
    const [answerAttempts, setAnswerAttempts] = useState(0);

    const nextQuestion = React.useCallback(() => {
        if (currentQuestion >= 4) {
            // Game completed - navigate to results
            router.replace('/results');
            return;
        }

        setCurrentQuestion((prev) => prev + 1);
        setTimeLeft(15);
        setGameState('playing');
        setFeedback(null);
        setCurrentPlayer(prev => prev === 1 ? 2 : 1);
        setAnswerAttempts(0);
    }, [currentQuestion, router]);

    const handleTimeUp = React.useCallback(() => {
        setFeedback({ type: 'timeup', message: 'Time Up!', score: 0 });
        setGameState('feedback');
        setTimeout(nextQuestion, 2500);
    }, [nextQuestion]);

    useEffect(() => {
        if (timeLeft > 0 && gameState === 'playing') {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else if (timeLeft === 0 && gameState === 'playing') {
            handleTimeUp();
        }
    }, [timeLeft, gameState, handleTimeUp]);

    const handleAnswer = (selectedAnswer: string) => {
        if (gameState !== 'playing') return;

        const isCorrect = selectedAnswer === sampleQuestions[currentQuestion].correctAnswer;
        const attempts = answerAttempts + 1;

        if (isCorrect) {
            const score = attempts === 1 ? 10 : 7;
            setFeedback({
                type: 'correct',
                message: attempts === 1 ? 'Correct (First try)!' : 'Correct (Second try)!',
                score
            });

            setPlayers(prev => prev.map(p =>
                p.id === currentPlayer ? { ...p, score: p.score + score } : p
            ));

            setGameState('feedback');
            setTimeout(nextQuestion, 2500);
        } else {
            if (attempts === 1) {
                setAnswerAttempts(1);
                setFeedback({ type: 'wrong', message: 'Wrong! Try again...', score: -5 });

                setPlayers(prev => prev.map(p =>
                    p.id === currentPlayer ? { ...p, score: Math.max(0, p.score - 5) } : p
                ));

                setTimeout(() => setFeedback(null), 1500);
            } else {
                setFeedback({ type: 'wrong', message: 'Wrong! Next player...', score: -5 });

                setPlayers(prev => prev.map(p =>
                    p.id === currentPlayer ? { ...p, score: Math.max(0, p.score - 5) } : p
                ));

                setGameState('feedback');
                setTimeout(nextQuestion, 2500);
            }
        }
    };

    return (
        <div className="h-screen flex flex-col p-4 overflow-hidden relative bg-black">
            <div className="max-w-4xl mx-auto w-full flex-1 flex flex-col gap-6">
                <PlayerBar
                    players={players}
                    timeLeft={timeLeft}
                    currentPlayer={currentPlayer}
                    currentRound={currentQuestion + 1}
                    totalRounds={5}
                />

                <FlagDisplay
                    flagUrl={sampleQuestions[currentQuestion].flagUrl}
                    gameState={gameState}
                />

                <OptionsGrid
                    options={sampleQuestions[currentQuestion].options}
                    onAnswer={handleAnswer}
                    gameState={gameState}
                    correctAnswer={sampleQuestions[currentQuestion].correctAnswer}
                />

            </div>
            <FeedbackRow feedback={feedback} />
        </div >
    )
}

export default GTFMainPage