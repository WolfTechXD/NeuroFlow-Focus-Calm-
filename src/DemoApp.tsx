import React, { useState } from 'react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Brain, Headphones, BookOpen, Settings, Palette } from 'lucide-react';
import ZenMode from './pages/ZenMode';
import WorkingSoundLibrary from './components/WorkingSoundLibrary';
import EnhancedTips from './components/EnhancedTips';
import UpgradeButton from './components/ThemedUpgradeButton';
import ThemeSelector from './components/ThemeSelector';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppState, Task, User, Achievement, DailyStats, Sound, ActiveSound } from './types/index';



const DemoAppContent: React.FC = () => {
    const { getBackgroundStyle, colors, theme } = useTheme();
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'zen' | 'sounds' | 'tips' | 'themes'>('dashboard');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');

    const [appState, setAppState] = useState<AppState>({
        user: {
            name: 'Guest User',
            email: 'guest@neuroflow.com',
            level: 1,
            xp: 25,
            totalPoints: 150,
            isGuest: true,
            avatar: '🧠',
            streak: 0,
            achievements: [],
            preferences: {
                theme: 'colorful',
                soundEnabled: true,
                animationsEnabled: true,
                notificationsEnabled: true,
                difficultyLevel: 'medium',
                focusSessionLength: 25,
                breakLength: 5
            },
            subscription: {
                isPremium: false,
                plan: 'demo'
            }
        },
        tasks: [
            {
                id: '1',
                title: 'Welcome to NeuroFlow Demo!',
                category: 'Demo',
                priority: 'medium',
                completed: false,
                xpReward: 50,
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'Listen to calming nature sounds',
                category: 'Sounds',
                priority: 'low',
                completed: false,
                xpReward: 30,
                createdAt: new Date()
            }
        ],
        currentPage: 'dashboard',
        soundLibrary: [],
        activeSounds: [],
        achievements: [],
        dailyStats: [{
            date: new Date().toISOString().split('T')[0],
            tasksCompleted: 0,
            focusMinutes: 0,
            zenMinutes: 0,
            xpEarned: 0,
            streakDay: false
        }]
    });

    const updateAppState = (newState: Partial<AppState>) => {
        setAppState(prev => ({ ...prev, ...newState }));
    };

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        if (appState.user.isGuest && appState.tasks.length >= 5) {
            alert('🌱 Demo Limitation: Only 5 tasks allowed in demo mode. Upgrade for unlimited tasks!');
            return;
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            category: 'Personal',
            priority: 'medium',
            completed: false,
            xpReward: 25,
            createdAt: new Date()
        };

        setAppState(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));

        setNewTaskTitle('');
        setShowTaskModal(false);
    };

    const toggleTask = (taskId: string) => {
        setAppState(prev => ({
            ...prev,
            tasks: prev.tasks.map(task =>
                task.id === taskId
                    ? { ...task, completed: !task.completed }
                    : task
            ),
            user: {
                ...prev.user,
                xp: prev.user.xp + (prev.tasks.find(t => t.id === taskId && !t.completed)?.xpReward || 0)
            }
        }));
    };

    const renderNavigation = () => (
        <div className="flex justify-center mb-6">
            <div className="bg-white/20 backdrop-blur-sm rounded-full p-1 flex gap-1">
                {[
                    { id: 'dashboard', icon: '🏠', label: 'Dashboard' },
                    { id: 'zen', icon: '🧘', label: 'Zen Mode' },
                    { id: 'sounds', icon: '🎵', label: 'Sounds' },
                    { id: 'tips', icon: '💡', label: 'Tips' }
                ].map(nav => (
                    <button
                        key={nav.id}
                        onClick={() => setCurrentPage(nav.id as any)}
                        className={`px-4 py-2 rounded-full transition-all font-medium ${currentPage === nav.id
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'text-white hover:bg-white/10'
                            }`}
                    >
                        {nav.icon} {nav.label}
                    </button>
                ))}
            </div>
        </div>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center text-white"
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-8 h-8 text-pink-200" />
                    <h1 className="text-3xl font-bold">NeuroFlow</h1>
                </div>
                <p className="text-lg opacity-90">Hello, {appState.user.name}! 👋 Level {appState.user.level} • {appState.user.xp} XP</p>
            </motion.div>

            {/* Quick Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                    { label: 'Tasks Today', value: appState.tasks.filter(t => t.completed).length, icon: '✅' },
                    { label: 'Focus Minutes', value: appState.dailyStats[0]?.focusMinutes || 0, icon: '🎯' },
                    { label: 'Zen Minutes', value: appState.dailyStats[0]?.zenMinutes || 0, icon: '🧘' },
                    { label: 'Total XP', value: appState.user.totalPoints, icon: '⭐' }
                ].map((stat, index) => (
                    <motion.div
                        key={stat.label}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center text-white"
                    >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-sm opacity-75">{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Active Quests */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/10 backdrop-blur-sm rounded-xl p-6"
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        🎯 Active Quests
                        <button
                            onClick={() => setShowTaskModal(true)}
                            className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-lg text-sm transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-4 h-4" /> Add New
                        </button>
                    </h2>
                </div>

                <div className="space-y-3">
                    {appState.tasks.map(task => (
                        <motion.div
                            key={task.id}
                            layout
                            className={`p-4 rounded-lg border transition-all ${task.completed
                                ? 'bg-green-500/20 border-green-400 text-green-100'
                                : 'bg-white/5 border-white/20 text-white hover:bg-white/10'
                                }`}
                        >
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        onChange={() => toggleTask(task.id)}
                                        className="w-5 h-5 rounded text-green-500 focus:ring-green-400"
                                    />
                                    <div>
                                        <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                                            {task.title}
                                        </h3>
                                        <p className="text-sm opacity-75">{task.category} • +{task.xpReward} XP</p>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs ${task.priority === 'high' ? 'bg-red-500/20 text-red-300' :
                                    task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300' :
                                        'bg-blue-500/20 text-blue-300'
                                    }`}>
                                    {task.priority}
                                </span>
                            </div>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Feature Cards */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[
                    {
                        title: 'Zen Mode',
                        description: 'Breathing exercises and mindfulness',
                        icon: '🧘',
                        action: () => setCurrentPage('zen'),
                        gradient: 'from-pink-400/20 to-blue-400/20'
                    },
                    {
                        title: 'Sound Library',
                        description: 'Focus sounds and nature ambience',
                        icon: '🎵',
                        action: () => setCurrentPage('sounds'),
                        gradient: 'from-blue-400/20 to-pink-400/20'
                    },
                    {
                        title: 'Tips & Guides',
                        description: 'ADHD management strategies',
                        icon: '💡',
                        action: () => setCurrentPage('tips'),
                        gradient: 'from-pink-300/20 to-blue-300/20'
                    }
                ].map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={feature.action}
                        className={`bg-gradient-to-br ${feature.gradient} backdrop-blur-sm border border-white/20 rounded-xl p-6 cursor-pointer hover:scale-105 transition-all`}
                    >
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                        <p className="text-white/80">{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Upgrade Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <UpgradeButton variant="primary" context="dashboard" />
            </motion.div>
        </div>
    );

    return (
        <div
            className="min-h-screen p-4"
            style={{
                background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 30%, rgb(147, 197, 253) 60%, rgb(59, 130, 246) 100%)'
            }}
        >
            <div className="max-w-6xl mx-auto">
                {renderNavigation()}

                <AnimatePresence mode="wait">
                    {currentPage === 'dashboard' && (
                        <motion.div
                            key="dashboard"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {renderDashboard()}
                        </motion.div>
                    )}

                    {currentPage === 'zen' && (
                        <motion.div
                            key="zen"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <ZenMode appState={appState} onUpdateState={updateAppState} />
                        </motion.div>
                    )}

                    {currentPage === 'sounds' && (
                        <motion.div
                            key="sounds"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <WorkingSoundLibrary />
                        </motion.div>
                    )}

                    {currentPage === 'tips' && (
                        <motion.div
                            key="tips"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <EnhancedTips />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Add Task Modal */}
            <AnimatePresence>
                {showTaskModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50"
                        onClick={() => setShowTaskModal(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={e => e.stopPropagation()}
                            className="bg-white rounded-xl p-6 w-full max-w-md"
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">Add New Task</h3>
                            <input
                                type="text"
                                value={newTaskTitle}
                                onChange={(e) => setNewTaskTitle(e.target.value)}
                                placeholder="Enter task title..."
                                className="w-full p-3 border border-gray-300 rounded-lg mb-4 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                onKeyPress={(e) => e.key === 'Enter' && addTask()}
                                autoFocus
                            />
                            <div className="flex gap-3">
                                <button
                                    onClick={addTask}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Add Task
                                </button>
                                <button
                                    onClick={() => setShowTaskModal(false)}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default DemoApp;