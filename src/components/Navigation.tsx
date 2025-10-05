import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate, useLocation } from 'react-router-dom';
// Simple icon components to replace lucide-react
const Home = () => <span>🏠</span>;
const Target = () => <span>🎯</span>;
const Heart = () => <span>❤️</span>;
const User = () => <span>👤</span>;
const Music = () => <span>🎵</span>;
const Book = () => <span>💡</span>;
const Guides = () => <span>📚</span>;
const Settings = () => <span>⚙️</span>;

interface NavigationProps {
    // Remove currentPage and onPageChange props since we'll use React Router
}

const Navigation: React.FC<NavigationProps> = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const navItems = [
        { id: 'dashboard', label: 'Home', icon: Home, path: '/' },
        { id: 'tasks', label: 'Quests', icon: Target, path: '/tasks' },
        { id: 'zen', label: 'Zen', icon: Heart, path: '/zen' },
        { id: 'sounds', label: 'Sounds', icon: Music, path: '/sounds' },
        { id: 'tips', label: 'Tips', icon: Book, path: '/tips' },
        { id: 'guides', label: 'Guides', icon: Guides, path: '/guides' },
        { id: 'settings', label: 'Settings', icon: Settings, path: '/settings' },
        { id: 'profile', label: 'Profile', icon: User, path: '/profile' }
    ];

    return (
        <nav className="bg-white border-t border-gray-200 px-2 py-2 overflow-x-auto">
            <div className="flex justify-start gap-1 min-w-max">
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path;

                    return (
                        <motion.button
                            key={item.id}
                            onClick={() => {
                                navigate(item.path);
                            }}
                            className={`flex flex-col items-center p-2 rounded-lg transition-all min-w-16 ${isActive
                                ? 'text-blue-500 bg-blue-50'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            <item.icon />
                            <span className="text-xs font-medium">{item.label}</span>

                            {isActive && (
                                <motion.div
                                    layoutId="activeTab"
                                    className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-500 rounded-full"
                                    initial={false}
                                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                />
                            )}
                        </motion.button>
                    );
                })}
            </div>
        </nav>
    );
};

export default Navigation;