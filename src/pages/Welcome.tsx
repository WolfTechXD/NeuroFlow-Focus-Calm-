import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const Welcome: React.FC = () => {
    const navigate = useNavigate();

    const features = [
        {
            icon: '🎯',
            title: 'Focus Mode',
            description: 'Pomodoro timer and task management designed for neurodivergent minds'
        },
        {
            icon: '🧘',
            title: 'Zen Mode',
            description: 'Guided breathing exercises and calming meditation sounds'
        },
        {
            icon: '🔊',
            title: 'Sound Library',
            description: 'Curated ambient sounds to help you focus and relax'
        },
        {
            icon: '💡',
            title: 'ADHD & Autism Tips',
            description: 'Evidence-based strategies and life hacks for daily challenges'
        },
        {
            icon: '🏆',
            title: 'Gamification',
            description: 'Earn XP, level up, and unlock achievements as you progress'
        },
        {
            icon: '🎨',
            title: 'Beautiful Themes',
            description: 'Choose from light, dark, or colorful modes to match your mood'
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl w-full"
            >
                <div className="text-center mb-12">
                    <motion.div
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="flex justify-center mb-6"
                    >
                        <Logo size="large" animated={true} />
                    </motion.div>

                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
                    >
                        NeuroFlow
                    </motion.h1>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="text-2xl text-gray-700 mb-2"
                    >
                        Focus & Calm Companion
                    </motion.p>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-lg text-gray-600 max-w-2xl mx-auto"
                    >
                        A dopamine-friendly app designed for neurodivergent minds.
                        Build better habits, stay focused, and find your calm.
                    </motion.p>
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12"
                >
                    {features.map((feature, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7 + index * 0.1 }}
                            className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105"
                        >
                            <div className="text-4xl mb-3">{feature.icon}</div>
                            <h3 className="text-xl font-bold text-gray-800 mb-2">
                                {feature.title}
                            </h3>
                            <p className="text-gray-600">
                                {feature.description}
                            </p>
                        </motion.div>
                    ))}
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.3 }}
                    className="text-center"
                >
                    <button
                        onClick={() => navigate('/get-started')}
                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xl font-bold px-12 py-4 rounded-full shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all"
                    >
                        Get Started
                    </button>

                    <p className="mt-4 text-gray-600">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-purple-600 font-semibold hover:underline"
                        >
                            Sign In
                        </button>
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default Welcome;
