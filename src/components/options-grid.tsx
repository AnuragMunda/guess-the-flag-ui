interface OptionsGridProps {
    options: string[];
    onAnswer: (answer: string) => void;
    gameState: 'playing' | 'feedback' | 'finished';
    correctAnswer: string;
}

const OptionsGrid = ({ options, onAnswer, gameState, correctAnswer }: OptionsGridProps) => {
    return (
        <div className="grid grid-cols-2 gap-4 max-w-2xl mx-auto w-full">
            {options.map((option, index) => {
                const isCorrect = option === correctAnswer;
                const showResult = gameState === 'feedback';

                return (
                    <button
                        key={index}
                        onClick={() => onAnswer(option)}
                        disabled={gameState === 'feedback'}
                        className={`
              p-6 rounded-xl font-semibold text-lg transition-all duration-300 transform
              border-2 backdrop-blur-sm relative overflow-hidden group
              ${gameState === 'playing'
                                ? 'bg-white/10 border-white/20 text-white hover:bg-white/20 hover:border-white/40 hover:scale-105 active:scale-95'
                                : showResult && isCorrect
                                    ? 'bg-emerald-500/30 border-emerald-400 text-emerald-100 scale-105'
                                    : 'bg-white/5 border-white/10 text-slate-400'
                            }
              ${gameState === 'playing' ? 'cursor-pointer' : 'cursor-default'}
            `}
                    >
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700" />
                        <span className="relative z-10">{option}</span>
                        {showResult && isCorrect && (
                            <div className="absolute top-2 right-2 text-emerald-400 animate-bounce">
                                ✓
                            </div>
                        )}
                    </button>
                );
            })}
        </div>
    );
};

export default OptionsGrid;