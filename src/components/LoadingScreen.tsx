import React from 'react';
import { motion } from 'framer-motion';

const LoadingScreen: React.FC = () => {
    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-blue-50 flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center space-y-6"
            >
                {/* Animated Logo */}
                <motion.div
                    animate={{
                        rotate: [0, 10, -10, 0],
                        scale: [1, 1.1, 1]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                    className="text-8xl"
                >
                    🧠
                </motion.div>

                {/* App Name */}
                <motion.h1
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="text-4xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-blue-500 bg-clip-text text-transparent"
                >
                    NeuroFlow
                </motion.h1>

                {/* Loading Text */}
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="text-gray-600 text-lg"
                >
                    Preparing your personalized journey...
                </motion.p>

                {/* Loading Dots */}
                <div className="flex justify-center space-x-2">
                    {[0, 1, 2].map((i) => (
                        <motion.div
                            key={i}
                            animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0.3, 1, 0.3]
                            }}
                            transition={{
                                duration: 1.5,
                                repeat: Infinity,
                                delay: i * 0.2
                            }}
                            className="w-3 h-3 bg-blue-500 rounded-full"
                        />
                    ))}
                </div>

                {/* Motivational Quote */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                    className="max-w-md mx-auto text-center"
                >
                    <p className="text-gray-500 italic">
                        "Your neurodivergent brain is uniquely powerful. Let's unlock its potential together! ✨"
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default LoadingScreen;