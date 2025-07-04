'use client';

import { useAbly } from '@/context/ably-provider';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trophy, Coins, Play, Users, XCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import WalletConnectButton from '@/components/wallet-connect-button';
import { useWallet } from '@solana/wallet-adapter-react';

const MATCH_TIMEOUT_MS = 30_000;

export default function StartMenu() {
  const { ably } = useAbly();
  const { publicKey } = useWallet();
  const router = useRouter();

  const [isMatchmaking, setIsMatchmaking] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [matchFound, setMatchFound] = useState(false);

  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const cancelRef = useRef(false);

  const handleCancelMatchmaking = async () => {
    if (!ably) return;
    cancelRef.current = true;

    const lobby = ably.channels.get('lobby');
    await lobby.unsubscribe();
    await lobby.presence.leave();

    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setIsMatchmaking(false);
    setFeedback('Matchmaking cancelled.');
  };

  const handleFindMatch = async () => {
    if (!ably) return;
    setFeedback(null);
    setIsMatchmaking(true);
    cancelRef.current = false;

    const selfId =
      ably.auth.clientId ||
      ably.connection.id ||
      (await new Promise<string>((res) =>
        ably.connection.once('connected', () => res(ably.connection.id!))
      ));

    const walletId = publicKey?.toString() || `guest-${selfId}`;
    const lobby = ably.channels.get('lobby');

    await lobby.attach();
    await lobby.presence.enter({ wallet: walletId, status: 'waiting' });

    const members = await lobby.presence.get({ waitForSync: true });
    const opponent = members.find(
      (m) => m.clientId !== selfId && m.data?.status === 'waiting'
    );

    const imInitiator = (oppId: string) => selfId < oppId;

    const startMatch = async (oppId: string) => {
      const roomId = ['match', selfId, oppId].sort().join('-');
      const matchChannel = ably.channels.get(roomId);

      await lobby.publish('match:start', { roomId, seed: Date.now(), players: [selfId, oppId] });
      await matchChannel.publish('match:start', { roomId, seed: Date.now(), players: [selfId, oppId] });

      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      await lobby.presence.leave();

      if (!cancelRef.current) {
        setMatchFound(true);
        setTimeout(() => router.replace(`/main?roomId=${roomId}`), 2000);
      }
    };

    if (opponent && imInitiator(opponent.clientId!)) {
      await startMatch(opponent.clientId!);
      return;
    }

    const onMatchStart = (msg: any) => {
      const { roomId, players } = msg.data;
      if (!players.includes(selfId)) return;

      lobby.unsubscribe('match:start', onMatchStart);
      lobby.presence.leave();
      if (timeoutRef.current) clearTimeout(timeoutRef.current);

      if (!cancelRef.current) {
        setMatchFound(true);
        setTimeout(() => router.replace(`/main?roomId=${roomId}`), 2000);
      }
    };

    lobby.subscribe('match:start', onMatchStart);

    timeoutRef.current = setTimeout(() => {
      lobby.unsubscribe('match:start', onMatchStart);
      lobby.presence.leave();
      if (!cancelRef.current) {
        setIsMatchmaking(false);
        setFeedback('No match found. Please try again.');
      }
    }, MATCH_TIMEOUT_MS);
  };

  if (matchFound) {
    return (
      <div className="h-screen flex items-center justify-center bg-black text-white text-xl animate-pulse">
        ✅ Match Found! Redirecting…
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-4">
            <Trophy className="w-8 h-8 text-yellow-500" />
            <h1 className="text-3xl font-bold text-white">Guess The Flag</h1>
          </div>
          <WalletConnectButton />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Play className="w-6 h-6 text-blue-400" />
                Quick Match
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="text-sm text-slate-400 space-y-1">
                <li>• 5 Flag Rounds</li>
                <li>• 2 Players</li>
                <li>• 15 seconds per round</li>
                <li>• Entry fee: 1 $GOR</li>
              </ul>

              <div className="flex gap-2">
                <Button
                  onClick={handleFindMatch}
                  disabled={isMatchmaking}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:opacity-50"
                >
                  {isMatchmaking ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Finding Match...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Find Match
                    </span>
                  )}
                </Button>

                {isMatchmaking && (
                  <Button
                    onClick={handleCancelMatchmaking}
                    variant="outline"
                    className="flex items-center gap-1 text-red-400 border-red-500 hover:bg-red-900/30"
                  >
                    <XCircle className="w-4 h-4" />
                    Cancel
                  </Button>
                )}
              </div>

              {feedback && (
                <p className="text-center text-sm text-yellow-400 mt-2">{feedback}</p>
              )}
            </CardContent>
          </Card>

          <Card className="bg-white/10 backdrop-blur-sm border-white/20 text-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Coins className="w-6 h-6 text-yellow-500" />
                Vault
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-300">Manage your $GOR tokens</p>
              <div className="bg-slate-800/50 rounded-lg p-3">
                <div className="text-2xl font-bold text-yellow-400">--</div>
                <div className="text-sm text-slate-400">Vault Balance</div>
              </div>
              <Button
                className="w-full border-yellow-500 text-yellow-400 mt-2"
                variant="outline"
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
                  <li>• Correct (First answer): +10 points</li>
                  <li>• Correct (Second answer): +7 points</li>
                  <li>• Wrong answer: 0 points</li>
                  <li>• Time up: 0 points</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
