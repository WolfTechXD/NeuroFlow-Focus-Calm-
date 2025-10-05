import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, Task } from '../types/index';
import { useTheme } from '../context/ThemeContext';

// Simple icon components to replace lucide-react
const CheckCircle = () => <span>✅</span>;
const Clock = () => <span>🕐</span>;
const Target = () => <span>🎯</span>;
const Star = () => <span>⭐</span>;
const Zap = () => <span>⚡</span>;
const Trophy = () => <span>🏆</span>;

interface ThemedDashboardProps {
    appState: AppState;
    onCompleteTask: (taskId: string) => void;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const ThemedDashboard: React.FC<ThemedDashboardProps> = ({ appState, onCompleteTask, onUpdateState }) => {
    const { getBackgroundStyle, colors, getCardStyle } = useTheme();
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    // Get today's stats
    const today = new Date().toISOString().split('T')[0];
    const todayStats = appState.dailyStats.find(s => s.date === today) || {
        date: today,
        tasksCompleted: 0,
        focusMinutes: 0,
        zenMinutes: 0,
        xpEarned: 0,
        streakDay: false
    };

    const incompleteTasks = appState.tasks.filter(task => !task.completed).slice(0, 5);
    const userLevel = Math.floor(appState.user.xp / 100) + 1;
    const xpProgress = (appState.user.xp % 100);

    const handleTaskComplete = (taskId: string) => {
        onCompleteTask(taskId);
        setSelectedTask(null);

        // Add celebration animation
        const taskElement = document.getElementById(`task-${taskId}`);
        if (taskElement) {
            taskElement.classList.add('celebration-animation');
        }
    };

    const quickTasks = [
        { title: "Drink a glass of water", category: "Self-Care", xp: 10, icon: "💧" },
        { title: "Take 5 deep breaths", category: "Zen", xp: 15, icon: "🌬️" },
        { title: "Tidy desk for 2 minutes", category: "Home", xp: 20, icon: "🗂️" },
        { title: "Send that text you've been putting off", category: "Social", xp: 25, icon: "📱" },
    ];

    // Category icons mapping
    const getCategoryIcon = (category: string) => {
        const categoryIcons: { [key: string]: string } = {
            'Demo': '🎮',
            'Sounds': '🎵',
            'Self-Care': '💧',
            'Zen': '🧘',
            'Home': '🏠',
            'Social': '👥',
            'Work': '💼',
            'Personal': '👤',
            'Health': '💪',
            'Learning': '📚'
        };
        return categoryIcons[category] || '📝';
    };

    return (
        <div style={getBackgroundStyle()}>
            <div className="p-4 space-y-6 max-w-4xl mx-auto">
                {/* Welcome Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <div className="text-4xl">{appState.user.avatar}</div>
                    <h1 className="text-2xl font-bold" style={{ color: colors.textPrimary }}>
                        Welcome back, {appState.user.name}!
                    </h1>
                    <p style={{ color: colors.textSecondary }}>Ready to conquer some quests today? 🎯</p>
                </motion.div>

                {/* User Stats Card */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`${getCardStyle()} p-6 text-white`}
                    style={{
                        background: colors.buttonPrimary,
                        color: colors.textPrimary
                    }}
                >
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        <div className="text-center">
                            <div className="text-2xl font-bold">{userLevel}</div>
                            <div className="text-sm opacity-90">Level</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{appState.user.totalPoints.toLocaleString()}</div>
                            <div className="text-sm opacity-90">Total XP</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{appState.user.streak}</div>
                            <div className="text-sm opacity-90">Day Streak</div>
                        </div>
                        <div className="text-center">
                            <div className="text-2xl font-bold">{todayStats.tasksCompleted}</div>
                            <div className="text-sm opacity-90">Today's Quests</div>
                        </div>
                    </div>

                    {/* XP Progress Bar */}
                    <div className="mt-4">
                        <div className="flex justify-between text-sm mb-2">
                            <span>Progress to Level {userLevel + 1}</span>
                            <span>{Math.round(xpProgress)}%</span>
                        </div>
                        <div className="w-full bg-white/20 rounded-full h-3">
                            <motion.div
                                className="bg-white rounded-full h-3"
                                initial={{ width: 0 }}
                                animate={{ width: `${xpProgress}%` }}
                                transition={{ duration: 1, ease: "easeOut" }}
                            />
                        </div>
                    </div>
                </motion.div>

                {/* Today's Focus */}
                <div className="grid md:grid-cols-2 gap-6">
                    {/* Current Tasks */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${getCardStyle()} p-6`}
                        style={{
                            backgroundColor: colors.cardBackground,
                            border: `1px solid ${colors.border}`,
                            color: colors.textPrimary
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Target />
                            <h2 className="text-xl font-semibold">Your Active Quests</h2>
                        </div>

                        {incompleteTasks.length === 0 ? (
                            <div className="text-center py-8" style={{ color: colors.textSecondary }}>
                                <div className="text-4xl mb-2">🎉</div>
                                <p>All caught up! Time to add some new quests.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {incompleteTasks.map((task) => (
                                    <motion.div
                                        key={task.id}
                                        id={`task-${task.id}`}
                                        className="flex items-center justify-between p-3 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                                        style={{
                                            backgroundColor: colors.cardBackground,
                                            border: `1px solid ${colors.border}`
                                        }}
                                        whileHover={{ scale: 1.02 }}
                                        onClick={() => handleTaskComplete(task.id)}
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="w-6 h-6 border-2 rounded-full flex items-center justify-center hover:border-green-500 transition-colors"
                                                style={{ borderColor: colors.border }}
                                            >
                                                <span className="text-transparent hover:text-green-500">✅</span>
                                            </div>
                                            <div>
                                                <p className="font-medium" style={{ color: colors.textPrimary }}>
                                                    {task.title}
                                                </p>
                                                <p className="text-sm" style={{ color: colors.textSecondary }}>
                                                    {task.category} • +{task.xpReward} XP
                                                </p>
                                            </div>
                                        </div>
                                        <div className="text-2xl">
                                            {getCategoryIcon(task.category)}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </motion.div>

                    {/* Quick Wins */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className={`${getCardStyle()} p-6`}
                        style={{
                            backgroundColor: colors.cardBackground,
                            border: `1px solid ${colors.border}`,
                            color: colors.textPrimary
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Zap />
                            <h2 className="text-xl font-semibold">Quick Wins</h2>
                        </div>

                        <div className="space-y-3">
                            {quickTasks.map((task, index) => (
                                <motion.div
                                    key={index}
                                    className="flex items-center justify-between p-3 rounded-lg hover:opacity-80 transition-all cursor-pointer"
                                    style={{
                                        background: colors.buttonSecondary,
                                        border: `1px solid ${colors.border}`
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => {
                                        // Add as a new task
                                        const newTask: Task = {
                                            id: Date.now().toString(),
                                            title: task.title,
                                            category: task.category,
                                            priority: 'low' as const,
                                            xpReward: task.xp,
                                            completed: false,
                                            createdAt: new Date()
                                        };
                                        onUpdateState({
                                            tasks: [...appState.tasks, newTask]
                                        });
                                    }}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="text-2xl">{task.icon}</div>
                                        <div>
                                            <p className="font-medium" style={{ color: colors.textPrimary }}>
                                                {task.title}
                                            </p>
                                            <p className="text-sm" style={{ color: colors.textSecondary }}>
                                                +{task.xp} XP
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-green-600 font-semibold">+</div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Recent Achievements */}
                {appState.user.achievements.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className={`${getCardStyle()} p-6`}
                        style={{
                            backgroundColor: colors.cardBackground,
                            border: `1px solid ${colors.border}`,
                            color: colors.textPrimary
                        }}
                    >
                        <div className="flex items-center gap-2 mb-4">
                            <Trophy />
                            <h2 className="text-xl font-semibold">Recent Achievements</h2>
                        </div>

                        <div className="grid md:grid-cols-2 gap-3">
                            {appState.user.achievements.slice(0, 4).map((achievement, index) => (
                                <motion.div
                                    key={achievement.id}
                                    className="flex items-center gap-3 p-3 rounded-lg"
                                    style={{
                                        backgroundColor: colors.cardBackground,
                                        border: `1px solid ${colors.border}`
                                    }}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="text-2xl">{achievement.icon}</div>
                                    <div>
                                        <p className="font-medium" style={{ color: colors.textPrimary }}>
                                            {achievement.title}
                                        </p>
                                        <p className="text-sm" style={{ color: colors.textSecondary }}>
                                            +{achievement.xpReward} XP
                                        </p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default ThemedDashboard;