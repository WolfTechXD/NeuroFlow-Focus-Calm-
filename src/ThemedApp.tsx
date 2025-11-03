import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Brain, Palette } from 'lucide-react';
import React, { useState, useEffect } from 'react';
import ZenMode from './pages/ZenMode';
import WorkingSoundLibrary from './components/WorkingSoundLibrary';
import EnhancedTips from './components/EnhancedTips';
import UpgradeButton from './components/ThemedUpgradeButton';
import ThemeSelector from './components/ThemeSelector';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import LoadingScreen from './components/LoadingScreen';
import PomodoroTimer from './components/PomodoroTimer';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { AppState, Task, TaskDifficulty } from './types/index';
import { defaultCategories } from './utils/gameUtils';
import {
    classifyTaskDifficulty,
    getDifficultyXP,
    getDifficultyTime,
    getDifficultyEmoji,
    getDifficultyColor,
    getDifficultyDescription
} from './utils/difficultyClassifier';

const ThemedAppContent: React.FC = () => {
    const { getBackgroundStyle, colors, theme } = useTheme();

    // Authentication state
    const [authView, setAuthView] = useState<'landing' | 'signin' | 'signup' | 'app'>('landing');
    const [isLoading, setIsLoading] = useState(false);

    // App state
    const [currentPage, setCurrentPage] = useState<'dashboard' | 'zen' | 'sounds' | 'tips' | 'themes'>('dashboard');
    const [showTaskModal, setShowTaskModal] = useState(false);
    const [newTaskTitle, setNewTaskTitle] = useState('');
    const [newTaskDescription, setNewTaskDescription] = useState('');
    const [selectedDifficulty, setSelectedDifficulty] = useState<TaskDifficulty | null>(null);
    const [autoClassification, setAutoClassification] = useState<ReturnType<typeof classifyTaskDifficulty> | null>(null);

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
                difficulty: 'easy',
                completed: false,
                xpReward: 50,
                createdAt: new Date()
            },
            {
                id: '2',
                title: 'Listen to calming nature sounds',
                category: 'Sounds',
                priority: 'low',
                difficulty: 'easy',
                completed: false,
                xpReward: 30,
                createdAt: new Date()
            }
        ],
        categories: defaultCategories,
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

    // Handle subscription upgrades
    const handleUpgrade = (plan: 'basic' | 'premium') => {
        const updatedUser = {
            ...appState.user,
            isGuest: false,
            subscription: {
                isPremium: plan === 'premium',
                plan: plan === 'basic' ? 'base' as const : 'full' as const,
                purchaseDate: new Date(),
                expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year from now
            }
        };

        setAppState(prev => ({
            ...prev,
            user: updatedUser
        }));

        // Show success message
        const planName = plan === 'basic' ? 'Basic' : 'Premium';
        const price = plan === 'basic' ? '$4.99' : '$9.99';
        alert(`🎉 Welcome to ${planName} Plan!

Thank you for upgrading to ${planName} for ${price}!

${plan === 'basic'
                ? '🌱 You now have:\n• 5 tasks maximum\n• 5-minute zen sessions\n• 10 basic nature sounds\n• Essential ADHD tips'
                : '⭐ You now have UNLIMITED access to:\n• Unlimited tasks\n• Unlimited zen sessions\n• 50+ premium sounds\n• 4 expert guides\n• Advanced AI coaching'
            }\n\nEnjoy your enhanced NeuroFlow experience! 🧠💜`);
    };

    // Auto-classify difficulty when task title or description changes
    React.useEffect(() => {
        if (newTaskTitle.trim()) {
            const classification = classifyTaskDifficulty(newTaskTitle, newTaskDescription);
            setAutoClassification(classification);
        } else {
            setAutoClassification(null);
        }
    }, [newTaskTitle, newTaskDescription]);

    const addTask = () => {
        if (!newTaskTitle.trim()) return;

        if (appState.user.subscription.plan === 'demo' && appState.tasks.length >= 5) {
            alert('🌱 Basic Plan Limitation: Maximum 5 tasks allowed.\n\n🌱 Basic Plan ($4.99): 5 tasks maximum, basic features\n⭐ Premium Plan ($9.99): Unlimited tasks, advanced features, AI coaching\n\nUpgrade to Premium for unlimited tasks!');
            return;
        }

        // Get difficulty from manual selection or automatic classification
        const classification = autoClassification || classifyTaskDifficulty(newTaskTitle, newTaskDescription);
        const finalDifficulty = selectedDifficulty || classification.difficulty;

        // Basic plan users get limited difficulty analysis features
        if (appState.user.subscription.plan === 'demo' && selectedDifficulty && classification.confidence < 0.7) {
            if (!confirm('🤖 Enhanced AI Classification Available!\n\n🌱 Basic Plan ($4.99): Basic difficulty detection\n⭐ Premium Plan ($9.99): Advanced AI task classification with detailed analysis\n\nYour manual selection will be used. Continue?')) {
                return;
            }
        }

        const newTask: Task = {
            id: Date.now().toString(),
            title: newTaskTitle,
            description: newTaskDescription || undefined,
            category: 'Personal',
            priority: 'medium',
            difficulty: finalDifficulty,
            completed: false,
            xpReward: getDifficultyXP(finalDifficulty),
            estimatedTime: getDifficultyTime(finalDifficulty),
            createdAt: new Date()
        };

        setAppState(prev => ({
            ...prev,
            tasks: [...prev.tasks, newTask]
        }));

        // Reset form
        setNewTaskTitle('');
        setNewTaskDescription('');
        setSelectedDifficulty(null);
        setAutoClassification(null);
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
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center mb-8 px-2"
        >
            <div
                className="backdrop-blur-sm rounded-full p-1.5 flex gap-1 shadow-lg scrollbar-hide"
                style={{
                    background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(147, 197, 253) 100%)',
                    border: `2px solid rgba(255,255,255,0.3)`,
                    maxWidth: '95vw',
                    overflowX: 'auto'
                }}
            >
                {[
                    { id: 'dashboard', icon: '🏠', label: 'Home' },
                    { id: 'zen', icon: '🧘', label: 'Zen' },
                    { id: 'sounds', icon: '🎵', label: 'Sounds' },
                    { id: 'tips', icon: '💡', label: 'Tips' },
                    { id: 'themes', icon: '🎨', label: 'Themes' }
                ].map(nav => (
                    <motion.button
                        key={nav.id}
                        onClick={() => setCurrentPage(nav.id as any)}
                        className={`px-3 py-2 sm:px-4 sm:py-2.5 rounded-full transition-all font-medium text-xs sm:text-sm flex items-center gap-1.5 whitespace-nowrap flex-shrink-0 ${currentPage === nav.id
                            ? 'bg-white text-blue-600 shadow-lg'
                            : 'hover:bg-white/20 text-white'
                            }`}
                        style={{
                            minWidth: '64px',
                            minHeight: '32px',
                            textShadow: currentPage === nav.id ? 'none' : '0 1px 2px rgba(0,0,0,0.3)'
                        }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    >
                        <span className="text-sm">{nav.icon}</span>
                        <span className="text-xs sm:text-sm">{nav.label}</span>
                    </motion.button>
                ))}
            </div>
        </motion.div>
    );

    const renderDashboard = () => (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
                style={{ color: colors.textPrimary }}
            >
                <div className="flex items-center justify-center gap-2 mb-2">
                    <Brain className="w-8 h-8" style={{ color: colors.accent }} />
                    <h1 className="text-3xl font-bold">NeuroFlow</h1>
                </div>
                <p className="text-lg" style={{ color: colors.textSecondary }}>
                    Hello, {appState.user.name}! 👋 Level {appState.user.level} • {appState.user.xp} XP
                    {appState.user.subscription.isPremium && <span className="ml-2">⭐ Premium</span>}
                    {appState.user.subscription.plan === 'base' && <span className="ml-2">🌱 Basic</span>}
                    {appState.user.subscription.plan === 'demo' && <span className="ml-2">🆓 Demo</span>}
                </p>
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
                        className="backdrop-blur-sm rounded-xl p-4 text-center"
                        style={{
                            backgroundColor: colors.cardBackground,
                            border: `1px solid ${colors.border}`,
                            color: colors.textPrimary
                        }}
                    >
                        <div className="text-2xl mb-1">{stat.icon}</div>
                        <div className="text-xl font-bold">{stat.value}</div>
                        <div className="text-sm" style={{ color: colors.textSecondary }}>{stat.label}</div>
                    </motion.div>
                ))}
            </div>

            {/* Pomodoro Timer */}
            <PomodoroTimer onSessionComplete={() => {
                setAppState(prev => ({
                    ...prev,
                    user: {
                        ...prev.user,
                        xp: prev.user.xp + 25
                    }
                }));
            }} />

            {/* Active Quests */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm rounded-xl p-6"
                style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`
                }}
            >
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-xl font-bold flex items-center gap-2" style={{ color: colors.textPrimary }}>
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
                            className={`p-4 rounded-lg border transition-all ${task.completed ? 'bg-green-500/20 border-green-400' : 'hover:bg-white/5'
                                }`}
                            style={{
                                backgroundColor: task.completed ? undefined : colors.cardBackground,
                                borderColor: task.completed ? '#4ade80' : colors.border,
                                color: task.completed ? '#bbf7d0' : colors.textPrimary
                            }}
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
                                            {getDifficultyEmoji(task.difficulty)} {task.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-sm" style={{ color: colors.textSecondary }}>
                                            <span>{task.category}</span>
                                            <span>•</span>
                                            <span style={{ color: getDifficultyColor(task.difficulty) }}>
                                                {getDifficultyDescription(task.difficulty)}
                                            </span>
                                            <span>•</span>
                                            <span>+{task.xpReward} XP</span>
                                            {task.estimatedTime && (
                                                <>
                                                    <span>•</span>
                                                    <span>~{task.estimatedTime}min</span>
                                                </>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <span className={`px-2 py-1 rounded text-xs font-semibold ${task.priority === 'high' ? 'bg-red-500/20 text-red-600' :
                                    task.priority === 'medium' ? 'bg-orange-500/20 text-orange-600' :
                                        'bg-green-500/20 text-green-600'
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
                        gradient: colors.buttonPrimary
                    },
                    {
                        title: 'Sound Library',
                        description: 'Focus sounds and nature ambience',
                        icon: '🎵',
                        action: () => setCurrentPage('sounds'),
                        gradient: colors.buttonSecondary
                    },
                    {
                        title: 'Tips & Guides',
                        description: 'ADHD management strategies',
                        icon: '💡',
                        action: () => setCurrentPage('tips'),
                        gradient: colors.buttonPrimary
                    }
                ].map((feature, index) => (
                    <motion.div
                        key={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        onClick={feature.action}
                        className="backdrop-blur-sm rounded-xl p-6 cursor-pointer hover:scale-105 transition-all"
                        style={{
                            background: feature.gradient,
                            border: `1px solid ${colors.border}`,
                            color: colors.textPrimary
                        }}
                    >
                        <div className="text-3xl mb-3">{feature.icon}</div>
                        <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                        <p style={{ color: colors.textSecondary }}>{feature.description}</p>
                    </motion.div>
                ))}
            </div>

            {/* Upgrade Section */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center"
            >
                <UpgradeButton variant="primary" context="dashboard" onUpgrade={handleUpgrade} />
            </motion.div>
        </div>
    );

    const renderThemes = () => (
        <div className="max-w-4xl mx-auto">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="backdrop-blur-sm rounded-xl p-6"
                style={{
                    backgroundColor: colors.cardBackground,
                    border: `1px solid ${colors.border}`,
                    color: colors.textPrimary
                }}
            >
                <ThemeSelector />

                <div className="mt-6 p-4 rounded-lg" style={{ backgroundColor: colors.cardBackground }}>
                    <h4 className="font-semibold mb-2">Current Theme: {theme}</h4>
                    <p className="text-sm" style={{ color: colors.textSecondary }}>
                        ✨ All themes use beautiful pink-to-blue gradients for a calming, neurodivergent-friendly experience.
                        Your choice will be applied across the entire application and saved automatically.
                    </p>
                </div>
            </motion.div>
        </div>
    );

    return (
        <div
            className="min-h-screen p-4"
            style={getBackgroundStyle()}
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
                            <WorkingSoundLibrary onUpgrade={handleUpgrade} userSubscription={appState.user.subscription} />
                        </motion.div>
                    )}

                    {currentPage === 'tips' && (
                        <motion.div
                            key="tips"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <EnhancedTips onUpgrade={handleUpgrade} />
                        </motion.div>
                    )}

                    {currentPage === 'themes' && (
                        <motion.div
                            key="themes"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            {renderThemes()}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>

            {/* Enhanced Add Task Modal */}
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
                            className="bg-white rounded-xl p-6 w-full max-w-lg"
                            style={{ maxHeight: '90vh', overflowY: 'auto' }}
                        >
                            <h3 className="text-xl font-bold text-gray-800 mb-4">🎯 Add New Quest</h3>

                            {/* Task Title */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quest Title *
                                </label>
                                <input
                                    type="text"
                                    value={newTaskTitle}
                                    onChange={(e) => setNewTaskTitle(e.target.value)}
                                    placeholder="What do you want to accomplish?"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && addTask()}
                                    autoFocus
                                />
                            </div>

                            {/* Task Description */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description (Optional)
                                </label>
                                <textarea
                                    value={newTaskDescription}
                                    onChange={(e) => setNewTaskDescription(e.target.value)}
                                    placeholder="Add more details to help with difficulty classification..."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                                    rows={2}
                                />
                            </div>

                            {/* Auto Classification Display */}
                            {autoClassification && (
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-200"
                                >
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-blue-800">🤖 AI Classification:</span>
                                        <span className="text-lg">{getDifficultyEmoji(autoClassification.difficulty)}</span>
                                        <span className="text-sm font-medium" style={{ color: getDifficultyColor(autoClassification.difficulty) }}>
                                            {getDifficultyDescription(autoClassification.difficulty)}
                                        </span>
                                        <span className="text-xs text-blue-600">
                                            ({Math.round(autoClassification.confidence * 100)}% confidence)
                                        </span>
                                    </div>
                                    <div className="text-xs text-blue-700">
                                        🎁 {autoClassification.suggestedXP} XP • ⏱️ ~{autoClassification.suggestedTime}min
                                    </div>
                                    {autoClassification.reasons.length > 0 && (
                                        <div className="text-xs text-blue-600 mt-1">
                                            Detected: {autoClassification.reasons.slice(0, 2).join(', ')}
                                        </div>
                                    )}
                                </motion.div>
                            )}

                            {/* Manual Difficulty Override */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-3">
                                    ⚙️ Override Difficulty (Optional)
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {(['easy', 'medium', 'hard'] as const).map((difficulty) => (
                                        <motion.button
                                            key={difficulty}
                                            type="button"
                                            onClick={() => setSelectedDifficulty(
                                                selectedDifficulty === difficulty ? null : difficulty
                                            )}
                                            className={`p-3 rounded-lg border-2 transition-all ${selectedDifficulty === difficulty
                                                ? 'border-blue-500 shadow-md'
                                                : 'border-gray-200 hover:border-gray-300'
                                                }`}
                                            style={{
                                                backgroundColor: selectedDifficulty === difficulty
                                                    ? `${getDifficultyColor(difficulty)}20`
                                                    : 'transparent'
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <div className="text-center">
                                                <div className="text-2xl mb-1">{getDifficultyEmoji(difficulty)}</div>
                                                <div className="text-sm font-medium capitalize">{difficulty}</div>
                                                <div className="text-xs text-gray-500">
                                                    {getDifficultyXP(difficulty)} XP
                                                </div>
                                            </div>
                                        </motion.button>
                                    ))}
                                </div>
                                {selectedDifficulty && (
                                    <div className="mt-2 text-xs text-gray-600">
                                        ℹ️ Manual override active - AI suggestion will be ignored
                                    </div>
                                )}
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={addTask}
                                    disabled={!newTaskTitle.trim()}
                                    className="flex-1 bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                                >
                                    <Plus className="w-4 h-4" />
                                    Create Quest
                                </button>
                                <button
                                    onClick={() => {
                                        setShowTaskModal(false);
                                        setNewTaskTitle('');
                                        setNewTaskDescription('');
                                        setSelectedDifficulty(null);
                                        setAutoClassification(null);
                                    }}
                                    className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-3 px-4 rounded-lg font-medium transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>

                            {/* Help Text */}
                            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                                <p className="text-xs text-gray-600">
                                    💡 <strong>Pro Tip:</strong> Our AI analyzes your task description to suggest the right difficulty.
                                    More detailed descriptions lead to better classifications!
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ThemedApp: React.FC = () => {
    return (
        <ThemeProvider>
            <ThemedAppContent />
        </ThemeProvider>
    );
};

export default ThemedApp;