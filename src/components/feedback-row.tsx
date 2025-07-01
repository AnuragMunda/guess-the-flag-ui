interface FeedbackRowProps {
    feedback: {
        type: string;
        message: string;
        score: number;
    } | null;
}

const FeedbackRow = ({ feedback }: FeedbackRowProps) => {
    if (!feedback) {
        return null;
    }

    const getTypeStyles = () => {
        switch (feedback.type) {
            case 'correct':
                return {
                    bg: 'bg-emerald-500/80 border-emerald-500/50',
                    text: 'text-white',
                    icon: '🎉'
                };
            case 'wrong':
                return {
                    bg: 'bg-red-500/80 border-red-500/50',
                    text: 'text-white',
                    icon: '❌'
                };
            case 'timeup':
                return {
                    bg: 'bg-yellow-500/80 border-yellow-500/50',
                    text: 'text-white',
                    icon: '⏰'
                };
            default:
                return {
                    bg: 'bg-slate-500/80 border-slate-500/50',
                    text: 'text-white',
                    icon: '❓'
                };
        }
    };

    const styles = getTypeStyles();

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
            <div className={`${styles.bg} backdrop-blur-sm rounded-xl px-8 py-4 border-2 animate-scale-in pointer-events-auto`}>
                <div className="flex items-center gap-4">
                    <span className="text-2xl animate-bounce">{styles.icon}</span>
                    <div>
                        <p className={`${styles.text} font-bold text-lg`}>{feedback.message}</p>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-white text-sm">Score</span>
                            <span className={`font-bold text-lg ${feedback.score > 0 ? 'text-emerald-100' :
                                feedback.score < 0 ? 'text-red-100' : 'text-slate-100'
                                }`}>
                                {feedback.score > 0 ? '+' : ''}{feedback.score}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackRow;