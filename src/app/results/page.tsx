'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trophy, Medal, Home } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAbly } from '@/context/ably-provider';

interface Player {
    id: string;
    name: string;
    score: number;
    avatar: string;
}

const GameResults = () => {
    const router = useRouter();
    const [players, setPlayers] = useState<Player[]>([]);
    const { ably } = useAbly();

    useEffect(() => {
        const getClientId = async () => {
            if (!ably) return null;
            if (ably.auth.clientId) return ably.auth.clientId;
            if (ably.connection.id) return ably.connection.id;
            return new Promise<string>((res) =>
                ably.connection.once('connected', () => res(ably.connection.id!))
            );
        };

        (async () => {
            const me = await getClientId();                             // my id
            const stored = localStorage.getItem('gtf:results');
            if (!stored) {
                router.replace('/');
                return;
            }

            const raw: Player[] = JSON.parse(stored);

            /** rename players: exactly one "You" (the current browser) */
            const fixed = raw.map((p, idx) => {
                if (p.id === me) return { ...p, name: 'You' };
                // if some other record is already "You", rename it back:
                if (p.name === 'You') return { ...p, name: `Player ${idx + 1}` };
                return p;
            });

            setPlayers(fixed);
        })();
    }, [ably, router]);

    if (players.length < 2) {
        return <div className="text-white text-center p-8">Loading Results...</div>;
    }

    const winner = players.reduce((top, p) => (p.score > top.score ? p : top), players[0]);


    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <Trophy className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                    <h1 className="text-4xl font-bold text-white mb-2">Match Complete!</h1>
                    <p className="text-slate-400">5 rounds finished</p>
                </div>

                {/* Results */}
                <Card className="mb-6 bg-white/10 backdrop-blur-sm border-white/20 text-white">
                    <CardHeader>
                        <CardTitle className="text-center text-2xl">Final Results</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {/* Winner */}
                            <div className="text-center p-4 bg-yellow-500/20 rounded-lg border border-yellow-500/50">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    <Medal className="w-6 h-6 text-yellow-500" />
                                    <span className="text-xl font-bold text-yellow-400">Winner!</span>
                                </div>
                                <div className="text-2xl font-bold">{winner.name}</div>
                                <div className="text-4xl">{winner.avatar}</div>
                            </div>

                            {/* All Players */}
                            <div className="grid grid-cols-2 gap-4">
                                {players.map((p) => (
                                    <div
                                        key={p.id}
                                        className={`p-4 rounded-lg text-center ${p.id === winner.id
                                            ? 'bg-emerald-500/20 border border-emerald-500/50'
                                            : 'bg-slate-700/50'
                                            }`}
                                    >
                                        <div className="text-3xl mb-2">{p.avatar}</div>
                                        <div className={`font-semibold ${p.name === 'You' ? 'text-blue-300' : ''}`}>
                                            {p.name}
                                        </div>
                                        <div className="text-2xl font-bold text-blue-400">{p.score}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="flex justify-center">
                    <Button
                        onClick={() => router.replace('/')}
                        variant="outline"
                        className="bg-blue-600 text-white hover:bg-blue-700"
                    >
                        <Home className="w-4 h-4 mr-2" />
                        Main Menu
                    </Button>
                </div>

                {/* Match Stats */}
                <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10 text-white">
                    <CardHeader>
                        <CardTitle className="text-lg">Match Statistics</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <div className="text-slate-400">Total Rounds</div>
                                <div className="font-semibold">5</div>
                            </div>
                            <div>
                                <div className="text-slate-400">Match Duration</div>
                                <div className="font-semibold">~2 min</div>
                            </div>
                            <div>
                                <div className="text-slate-400">Entry Fee</div>
                                <div className="font-semibold">1 $GOR</div>
                            </div>
                            <div>
                                <div className="text-slate-400">Winner Reward</div>
                                <div className="font-semibold text-emerald-400">1.8 $GOR</div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default GameResults;
