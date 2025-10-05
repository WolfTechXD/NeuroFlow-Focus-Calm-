import React from 'react';
import { motion } from 'framer-motion';
import { useTheme, ThemeType } from '../context/ThemeContext';

interface ThemeSelectorProps {
    className?: string;
}

const ThemeSelector: React.FC<ThemeSelectorProps> = ({ className = '' }) => {
    const { theme, setTheme } = useTheme();

    const themeOptions: Array<{
        id: ThemeType;
        name: string;
        description: string;
        emoji: string;
        previewGradient: string;
    }> = [
            {
                id: 'light',
                name: 'Light',
                description: 'Soft pink to blue',
                emoji: '☀️',
                previewGradient: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #dbeafe 75%, #bfdbfe 100%)'
            },
            {
                id: 'dark',
                name: 'Dark',
                description: 'Deep blue tones',
                emoji: '🌙',
                previewGradient: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)'
            },
            {
                id: 'colorful',
                name: 'Colorful',
                description: 'Vibrant pink to blue',
                emoji: '🌈',
                previewGradient: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 25%, rgb(147, 197, 253) 75%, rgb(59, 130, 246) 100%)'
            }
        ];

    return (
        <div className={`${className}`}>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                🎨 Theme Selection
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {themeOptions.map((option) => (
                    <motion.button
                        key={option.id}
                        onClick={() => setTheme(option.id)}
                        className={`relative p-4 rounded-xl border-2 transition-all ${theme === option.id
                                ? 'border-white shadow-lg scale-105'
                                : 'border-white/20 hover:border-white/40'
                            }`}
                        style={{ background: option.previewGradient }}
                        whileHover={{ scale: theme === option.id ? 1.05 : 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        {/* Selection Ring */}
                        {theme === option.id && (
                            <motion.div
                                className="absolute inset-0 rounded-xl border-4 border-white"
                                initial={{ scale: 0.8, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                            />
                        )}

                        <div className="relative z-10">
                            <div className="text-3xl mb-2">{option.emoji}</div>
                            <div className={`font-bold text-lg mb-1 ${option.id === 'dark' ? 'text-white' :
                                    option.id === 'light' ? 'text-gray-800' : 'text-white'
                                }`}>
                                {option.name}
                            </div>
                            <div className={`text-sm ${option.id === 'dark' ? 'text-gray-200' :
                                    option.id === 'light' ? 'text-gray-600' : 'text-white/80'
                                }`}>
                                {option.description}
                            </div>
                        </div>

                        {/* Active indicator */}
                        {theme === option.id && (
                            <motion.div
                                className="absolute top-2 right-2 w-6 h-6 bg-white rounded-full flex items-center justify-center"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.1 }}
                            >
                                <span className="text-green-500 text-sm">✓</span>
                            </motion.div>
                        )}
                    </motion.button>
                ))}
            </div>

            <div className="mt-4 p-3 bg-white/10 rounded-lg backdrop-blur-sm">
                <p className="text-sm opacity-75">
                    💡 Your theme preference is automatically saved and will apply to all pages of the app.
                </p>
            </div>
        </div>
    );
};

export default ThemeSelector;