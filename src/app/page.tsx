'use client';

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Coins, Play, Trophy, Users } from "lucide-react";
import { useRouter } from "next/navigation";
import WalletConnectButton from "@/components/wallet-connect-button";
import { useWallet } from "@/context/wallet-context";

const StartMenu = () => {
  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const { isConnected, vaultBalance } = useWallet();
  const router = useRouter();

  const handleFindMatch = async () => {
    if (!isConnected) {
      alert('Please connect your wallet first!');
      return;
    }

    if (vaultBalance < 1) {
      alert('Insufficient funds! You need at least 1 $GOR to play. Visit the Vault to deposit.');
      return;
    }

    setIsMatchmaking(true);
    // Simulate matchmaking
    await new Promise(resolve => setTimeout(resolve, 3000));
    setIsMatchmaking(false);
    router.replace('/game');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Flag Tastic Faceoff</h1>
          </div>
          <div className="flex items-center gap-4">
            {isConnected && (
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2 border border-white/20">
                <div className="flex items-center gap-2">
                  <Coins className="w-4 h-4 text-yellow-500" />
                  <span className="text-white font-semibold">{vaultBalance} $GOR</span>
                </div>
              </div>
            )}
            <WalletConnectButton />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Main Game Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-6 h-6 text-blue-400" />
                Quick Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-slate-300">Match Format:</p>
                <ul className="text-sm space-y-1 text-slate-400">
                  <li>• 5 Flag Rounds</li>
                  <li>• 2 Players</li>
                  <li>• 15 seconds per round</li>
                  <li>• Entry fee: 1 $GOR</li>
                </ul>
              </div>

              <Button
                onClick={handleFindMatch}
                disabled={isMatchmaking || !isConnected || vaultBalance < 1}
                className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
              >
                {isMatchmaking ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Finding Match...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Find Match
                  </div>
                )}
              </Button>

              {!isConnected && (
                <p className="text-yellow-400 text-sm text-center">
                  Connect your wallet to play
                </p>
              )}

              {isConnected && vaultBalance < 1 && (
                <p className="text-red-400 text-sm text-center">
                  Insufficient funds. Visit Vault to deposit.
                </p>
              )}
            </CardContent>
          </Card>

          {/* Vault Card */}
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                Vault
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <p className="text-slate-300">Manage your $GOR tokens</p>
                <div className="bg-slate-800/50 rounded-lg p-3">
                  <div className="text-2xl font-bold text-yellow-400">
                    {isConnected ? `${vaultBalance} $GOR` : '--'}
                  </div>
                  <div className="text-sm text-slate-400">Vault Balance</div>
                </div>
              </div>

              <Button
                onClick={() => router.replace('/vault')}
                variant="outline"
                className="w-full border-yellow-500/50 text-yellow-400 hover:bg-yellow-500/20"
              >
                Manage Vault
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Game Rules */}
        <Card className="mt-6 bg-white/5 backdrop-blur-sm border-white/10 text-white">
          <CardHeader>
            <CardTitle>How to Play</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h4 className="font-semibold text-blue-400 mb-2">Scoring</h4>
                <ul className="space-y-1 text-slate-400">
                  <li>• Correct (First try): +10 points</li>
                  <li>• Correct (Second try): +7 points</li>
                  <li>• Wrong answer: -5 points</li>
                  <li>• Time up: 0 points</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-emerald-400 mb-2">Match Flow</h4>
                <ul className="space-y-1 text-slate-400">
                  <li>• Players alternate turns</li>
                  <li>• 15 seconds per turn</li>
                  <li>• 2 attempts per turn max</li>
                  <li>• Highest score after 5 rounds wins</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StartMenu;
