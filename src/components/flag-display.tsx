import Image, { StaticImageData } from "next/image";

interface FlagDisplayProps {
    flagUrl: StaticImageData;
    gameState: 'playing' | 'feedback';
}

const FlagDisplay = ({ flagUrl, gameState }: FlagDisplayProps) => {
    return (
        <div className="flex justify-center">
            <div className="relative group">
                <div className="absolute -inset-4 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-500" />
                <div className="relative bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20 hover:border-white/40 transition-all duration-300">
                    <div className="w-80 h-52 rounded-xl overflow-hidden shadow-2xl">
                        <Image
                            src={flagUrl}
                            alt="Flag to guess"
                            width={100}
                            height={80}
                            className={`w-full h-full object-cover transition-all duration-500 ${gameState === 'playing'
                                    ? 'hover:scale-105 animate-fade-in'
                                    : 'scale-105 brightness-110'
                                }`}
                        />
                    </div>
                    <div className="absolute top-4 right-4 bg-slate-900/50 backdrop-blur-sm px-3 py-1 rounded-full">
                        <span className="text-white text-sm font-medium">Guess the Country</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FlagDisplay;