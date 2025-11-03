import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, Task } from '../types/index';
import { getTodayStats, calculateLevel, getXPProgress } from '../utils/gameUtils';
import { useTheme } from '../context/ThemeContext';
import PomodoroTimer from '../components/PomodoroTimer';
import { getPriorityColor, getPriorityIcon } from '../utils/priorityColors';

// Simple icon components to replace lucide-react
const CheckCircle = () => <span>✅</span>;
const Clock = () => <span>🕐</span>;
const Target = () => <span>🎯</span>;
const Star = () => <span>⭐</span>;
const Zap = () => <span>⚡</span>;
const Trophy = () => <span>🏆</span>;

interface DashboardProps {
    appState: AppState;
    onCompleteTask: (taskId: string) => void;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ appState, onCompleteTask, onUpdateState }) => {
    const [selectedTask, setSelectedTask] = useState<string | null>(null);

    const todayStats = getTodayStats(appState.dailyStats);
    const incompleteTasks = appState.tasks.filter(task => !task.completed).slice(0, 5);
    const userLevel = calculateLevel(appState.user.xp);
    const xpProgress = getXPProgress(appState.user.xp);

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

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {/* Welcome Header */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center space-y-2"
            >
                <div className="text-4xl">{appState.user.avatar}</div>
                <h1 className="text-2xl font-bold text-primary">
                    Welcome back, {appState.user.name}!
                </h1>
                <p className="text-secondary">Ready to conquer some quests today? 🎯</p>
            </motion.div>

            {/* Pomodoro Timer */}
            <PomodoroTimer onSessionComplete={() => {
                onUpdateState({
                    user: {
                        ...appState.user,
                        xp: appState.user.xp + 25
                    }
                });
            }} />

            {/* User Stats Card */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="card bg-gradient-to-r from-pink-400 to-blue-500 text-white"
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
                    className="card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Target />
                        <h2 className="text-xl font-semibold">Your Active Quests</h2>
                    </div>

                    {incompleteTasks.length === 0 ? (
                        <div className="text-center py-8 text-gray-500">
                            <div className="text-4xl mb-2">🎉</div>
                            <p>All caught up! Time to add some new quests.</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {incompleteTasks.map((task) => (
                                <motion.div
                                    key={task.id}
                                    id={`task-${task.id}`}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                                    whileHover={{ scale: 1.02 }}
                                    onClick={() => handleTaskComplete(task.id)}
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-6 h-6 border-2 border-gray-300 rounded-full flex items-center justify-center hover:border-green-500 transition-colors">
                                            <span className="text-transparent hover:text-green-500">✅</span>
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-800">{task.title}</p>
                                            <p className="text-sm text-gray-500">
                                                {task.category} • +{task.xpReward} XP
                                            </p>
                                        </div>
                                    </div>
                                    <div className="text-2xl">
                                        {appState.categories.find(c => c.name === task.category)?.icon || '📝'}
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
                    className="card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Zap />
                        <h2 className="text-xl font-semibold">Quick Wins</h2>
                    </div>

                    <div className="space-y-3">
                        {quickTasks.map((task, index) => (
                            <motion.div
                                key={index}
                                className="flex items-center justify-between p-3 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg hover:from-yellow-100 hover:to-orange-100 transition-colors cursor-pointer"
                                whileHover={{ scale: 1.02 }}
                                onClick={() => {
                                    // Add as a new task
                                    const newTask = {
                                        title: task.title,
                                        category: task.category,
                                        priority: 'low' as const,
                                        estimatedTime: 5,
                                        xpReward: task.xp,
                                        completed: false
                                    };
                                    onUpdateState({
                                        tasks: [...appState.tasks, {
                                            ...newTask,
                                            id: Date.now().toString(),
                                            createdAt: new Date()
                                        }]
                                    });
                                }}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="text-2xl">{task.icon}</div>
                                    <div>
                                        <p className="font-medium text-gray-800">{task.title}</p>
                                        <p className="text-sm text-gray-500">+{task.xp} XP</p>
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
                    className="card"
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Trophy />
                        <h2 className="text-xl font-semibold">Recent Achievements</h2>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {appState.user.achievements.slice(-4).map((achievement) => (
                            <div key={achievement.id} className="text-center p-3 bg-yellow-50 rounded-lg">
                                <div className="text-3xl mb-2">{achievement.icon}</div>
                                <p className="font-semibold text-sm text-gray-800">{achievement.title}</p>
                                <p className="text-xs text-gray-600">+{achievement.xpReward} XP</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            )}

            {/* Motivation Quote */}
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="card bg-gradient-to-r from-pink-100 to-purple-100 text-center"
            >
                <div className="text-3xl mb-2">✨</div>
                <p className="text-lg font-medium text-gray-800 mb-2">
                    "Progress, not perfection. Every small step counts! 🌟"
                </p>
                <p className="text-sm text-gray-600">
                    Remember: Your neurodivergent brain is unique and powerful. Take breaks when you need them! 💜
                </p>
            </motion.div>
        </div>
    );
};

export default Dashboard;