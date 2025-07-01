interface Player {
  id: number;
  name: string;
  score: number;
  avatar: string;
}

interface PlayerBarProps {
  players: Player[];
  timeLeft: number;
  currentPlayer: number;
  currentRound?: number;
  totalRounds?: number;
}

const PlayerBar = ({ players, timeLeft, currentPlayer, currentRound = 1, totalRounds = 5 }: PlayerBarProps) => {
  const formatTime = (seconds: number) => {
    return seconds.toString().padStart(2, '0');
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-4 border border-white/20">
      <div className="flex items-center justify-between">
        {/* Player 1 */}
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${currentPlayer === 1
            ? 'bg-blue-500/30 border-2 border-blue-400 scale-105'
            : 'bg-white/5'
          }`}>
          <div className="text-2xl">{players[0].avatar}</div>
          <div>
            <div className="font-semibold text-white">{players[0].name}</div>
            <div className="text-blue-400 font-bold">{players[0].score} pts</div>
          </div>
          {currentPlayer === 1 && (
            <div className="text-blue-400 animate-pulse">●</div>
          )}
        </div>

        {/* Timer and Round */}
        <div className="text-center">
          <div className="text-white/60 text-sm mb-1">
            Round {currentRound}/{totalRounds}
          </div>
          <div className={`text-4xl font-bold transition-colors duration-300 ${timeLeft <= 5 ? 'text-red-400 animate-pulse' : 'text-white'
            }`}>
            {formatTime(timeLeft)}
          </div>
          <div className="text-white/60 text-sm">seconds</div>
        </div>

        {/* Player 2 */}
        <div className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${currentPlayer === 2
            ? 'bg-red-500/30 border-2 border-red-400 scale-105'
            : 'bg-white/5'
          }`}>
          {currentPlayer === 2 && (
            <div className="text-red-400 animate-pulse">●</div>
          )}
          <div className="text-right">
            <div className="font-semibold text-white">{players[1].name}</div>
            <div className="text-red-400 font-bold">{players[1].score} pts</div>
          </div>
          <div className="text-2xl">{players[1].avatar}</div>
        </div>
      </div>
    </div>
  );
};

export default PlayerBar;