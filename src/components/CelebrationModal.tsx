import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';
import { Achievement } from '../types/index';
// Emoji icon components
const X = () => <span>❌</span>;
const Star = () => <span>⭐</span>;
const Trophy = () => <span>🏆</span>;

interface CelebrationModalProps {
    title: string;
    message: string;
    xp: number;
    achievement?: Achievement;
    onClose: () => void;
}

const CelebrationModal: React.FC<CelebrationModalProps> = ({
    title,
    message,
    xp,
    achievement,
    onClose
}) => {
    const [showConfetti, setShowConfetti] = React.useState(true);

    useEffect(() => {
        // Auto-close after 5 seconds
        const timer = setTimeout(() => {
            onClose();
        }, 5000);

        // Stop confetti after 3 seconds
        const confettiTimer = setTimeout(() => {
            setShowConfetti(false);
        }, 3000);

        return () => {
            clearTimeout(timer);
            clearTimeout(confettiTimer);
        };
    }, [onClose]);

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                onClick={onClose}
            >
                {showConfetti && (
                    <Confetti
                        width={window.innerWidth}
                        height={window.innerHeight}
                        recycle={false}
                        numberOfPieces={200}
                        gravity={0.3}
                    />
                )}

                <motion.div
                    initial={{ scale: 0.8, opacity: 0, y: 50 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0, y: 50 }}
                    transition={{
                        type: "spring",
                        duration: 0.5,
                        bounce: 0.3
                    }}
                    className="bg-white rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
                    onClick={(e) => e.stopPropagation()}
                >
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                        <X />
                    </button>

                    {/* Celebration Animation */}
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="text-6xl mb-4"
                    >
                        🎉
                    </motion.div>

                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="text-2xl font-bold text-gray-800 mb-2"
                    >
                        {title}
                    </motion.h2>

                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-gray-600 mb-6"
                    >
                        {message}
                    </motion.p>

                    {/* XP Reward */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.4 }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg p-4 mb-6"
                    >
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <Star />
                            <span className="font-semibold">XP Gained!</span>
                        </div>
                        <div className="text-3xl font-bold">+{xp}</div>
                    </motion.div>

                    {/* Achievement Unlock */}
                    {achievement && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 0.5 }}
                            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg p-4 mb-6"
                        >
                            <div className="flex items-center justify-center gap-2 mb-2">
                                <Trophy />
                                <span className="font-semibold">Achievement Unlocked!</span>
                            </div>
                            <div className="text-2xl mb-2">{achievement.icon}</div>
                            <div className="font-bold">{achievement.title}</div>
                            <div className="text-sm opacity-90">{achievement.description}</div>
                        </motion.div>
                    )}

                    {/* Motivational Message */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="text-sm text-gray-500"
                    >
                        ✨ Every small step is progress! Keep up the amazing work! ✨
                    </motion.div>

                    {/* Auto-close indicator */}
                    <motion.div
                        initial={{ width: "100%" }}
                        animate={{ width: "0%" }}
                        transition={{ duration: 5, ease: "linear" }}
                        className="h-1 bg-blue-500 rounded-full mt-4 mx-auto"
                    />
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default CelebrationModal;