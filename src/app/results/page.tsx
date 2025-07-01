'use client';

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Medal, RotateCcw, Home } from "lucide-react";
import { useRouter } from "next/navigation";

const GameResults = () => {
    const router = useRouter();

    // Mock results data - in real app this would come from game state
    const results = {
        player1: { name: "Player 1", score: 42, avatar: "👤" },
        player2: { name: "Player 2", score: 35, avatar: "👥" },
        winner: "Player 1"
    };

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
                                <div className="text-2xl font-bold">{results.winner}</div>
                                <div className="text-4xl">{results.player1.avatar}</div>
                            </div>

                            {/* Scores */}
                            <div className="grid grid-cols-2 gap-4">
                                <div className={`p-4 rounded-lg text-center ${results.player1.name === results.winner
                                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                                    : 'bg-slate-700/50'
                                    }`}>
                                    <div className="text-3xl mb-2">{results.player1.avatar}</div>
                                    <div className="font-semibold">{results.player1.name}</div>
                                    <div className="text-2xl font-bold text-blue-400">{results.player1.score}</div>
                                </div>

                                <div className={`p-4 rounded-lg text-center ${results.player2.name === results.winner
                                    ? 'bg-emerald-500/20 border border-emerald-500/50'
                                    : 'bg-slate-700/50'
                                    }`}>
                                    <div className="text-3xl mb-2">{results.player2.avatar}</div>
                                    <div className="font-semibold">{results.player2.name}</div>
                                    <div className="text-2xl font-bold text-red-400">{results.player2.score}</div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button
                        onClick={() => router.replace('/')}
                        className="bg-blue-600 hover:bg-blue-700"
                    >
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Play Again
                    </Button>

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
                                <div className="font-semibold">2:45</div>
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
