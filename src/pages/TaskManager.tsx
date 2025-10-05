import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, Task } from '../types/index';

// Simple icon components to replace lucide-react
const Plus = () => <span>➕</span>;
const Filter = () => <span>💿</span>;
const CheckCircle = () => <span>✅</span>;
const Clock = () => <span>🕐</span>;
const Star = () => <span>⭐</span>;
const Zap = () => <span>⚡</span>;
const Target = () => <span>🎯</span>;
const Edit3 = () => <span>✏️</span>;
const Trash2 = () => <span>🗑️</span>;

interface TaskManagerProps {
    appState: AppState;
    onAddTask: (task: Omit<Task, 'id' | 'createdAt'>) => void;
    onCompleteTask: (taskId: string) => void;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const TaskManager: React.FC<TaskManagerProps> = ({
    appState,
    onAddTask,
    onCompleteTask,
    onUpdateState
}) => {
    const [showAddTask, setShowAddTask] = useState(false);
    const [filter, setFilter] = useState<'all' | 'active' | 'completed'>('active');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const [newTask, setNewTask] = useState({
        title: '',
        description: '',
        category: 'Work/Study',
        priority: 'medium' as const,
        estimatedTime: 25,
        xpReward: 50
    });

    const filteredTasks = appState.tasks.filter(task => {
        const statusMatch = filter === 'all' ||
            (filter === 'active' && !task.completed) ||
            (filter === 'completed' && task.completed);

        const categoryMatch = categoryFilter === 'all' || task.category === categoryFilter;

        return statusMatch && categoryMatch;
    });

    const handleAddTask = () => {
        if (!newTask.title.trim()) return;

        // Demo limitation - max 3 active tasks
        const activeTasks = appState.tasks.filter(t => !t.completed);
        if (appState.user.isGuest && activeTasks.length >= 3) {
            alert('🚀 Demo Limit Reached! You can only have 3 active tasks in demo mode. Complete some tasks or upgrade to the full version for unlimited tasks!');
            return;
        }

        onAddTask({
            ...newTask,
            completed: false,
            difficulty: 'medium'
        });

        setNewTask({
            title: '',
            description: '',
            category: 'Work/Study',
            priority: 'medium',
            estimatedTime: 25,
            xpReward: 50
        });

        setShowAddTask(false);
    };

    const priorityColors = {
        low: 'bg-blue-100 text-blue-800 border-blue-200',
        medium: 'bg-pink-100 text-pink-800 border-pink-200',
        high: 'bg-blue-200 text-blue-900 border-blue-300'
    };

    const priorityIcons = {
        low: '🔵',
        medium: '🩷',
        high: '🔹'
    };

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="space-y-6 max-w-6xl mx-auto">
                {/* Header */}
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-800">Quest Manager 🎯</h1>
                        <p className="text-gray-600">Transform your tasks into exciting adventures!</p>
                    </div>

                    <motion.button
                        onClick={() => setShowAddTask(true)}
                        className="btn-primary flex items-center gap-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Plus />
                        New Quest
                    </motion.button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-md">
                    <div className="flex gap-2">
                        <button
                            onClick={() => setFilter('all')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            All ({appState.tasks.length})
                        </button>
                        <button
                            onClick={() => setFilter('active')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'active'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Active ({appState.tasks.filter(t => !t.completed).length})
                        </button>
                        <button
                            onClick={() => setFilter('completed')}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${filter === 'completed'
                                ? 'bg-blue-500 text-white'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Completed ({appState.tasks.filter(t => t.completed).length})
                        </button>
                    </div>

                    <select
                        value={categoryFilter}
                        onChange={(e) => setCategoryFilter(e.target.value)}
                        className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                        <option value="all">All Categories</option>
                        {appState.categories.map(category => (
                            <option key={category.id} value={category.name}>
                                {category.icon} {category.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Task List */}
                <div className="space-y-4">
                    <AnimatePresence>
                        {filteredTasks.map((task) => (
                            <motion.div
                                key={task.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                className={`card hover:shadow-xl transition-all ${task.completed ? 'opacity-75 bg-green-50 border-l-4 border-green-500' : ''
                                    }`}
                            >
                                <div className="flex items-start gap-4">
                                    <motion.button
                                        onClick={() => !task.completed && onCompleteTask(task.id)}
                                        className={`w-8 h-8 rounded-full border-2 flex items-center justify-center transition-all ${task.completed
                                            ? 'bg-green-500 border-green-500 text-white'
                                            : 'border-gray-300 hover:border-green-500 hover:bg-green-50'
                                            }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        disabled={task.completed}
                                    >
                                        {task.completed && <CheckCircle />}
                                    </motion.button>

                                    <div className="flex-1">
                                        <div className="flex items-start justify-between">
                                            <div>
                                                <h3 className={`text-lg font-semibold ${task.completed ? 'line-through text-gray-500' : 'text-gray-800'
                                                    }`}>
                                                    {task.title}
                                                </h3>
                                                {task.description && (
                                                    <p className="text-gray-600 text-sm mt-1">{task.description}</p>
                                                )}
                                            </div>

                                            <div className="text-right">
                                                <div className="text-2xl mb-2">
                                                    {appState.categories.find(c => c.name === task.category)?.icon || '📝'}
                                                </div>
                                                <div className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs border ${priorityColors[task.priority]
                                                    }`}>
                                                    <span>{priorityIcons[task.priority]}</span>
                                                    {task.priority}
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-4 mt-3 text-sm text-gray-500">
                                            <div className="flex items-center gap-1">
                                                <Clock />
                                                {task.estimatedTime}m
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star />
                                                +{task.xpReward} XP
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Target />
                                                {task.category}
                                            </div>
                                            {task.completed && task.completedAt && (
                                                <div className="text-green-600">
                                                    ✅ {new Date(task.completedAt).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>

                    {filteredTasks.length === 0 && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-12"
                        >
                            <div className="text-6xl mb-4">
                                {filter === 'completed' ? '🎉' : '🎯'}
                            </div>
                            <h3 className="text-xl font-semibold text-gray-800 mb-2">
                                {filter === 'completed'
                                    ? 'No completed quests yet'
                                    : 'No active quests'}
                            </h3>
                            <p className="text-gray-600">
                                {filter === 'completed'
                                    ? 'Complete some tasks to see your achievements here!'
                                    : 'Add your first quest to get started on your journey!'}
                            </p>
                        </motion.div>
                    )}
                </div>

                {/* Add Task Modal */}
                <AnimatePresence>
                    {showAddTask && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setShowAddTask(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.9, opacity: 0 }}
                                className="bg-white rounded-2xl p-6 w-full max-w-md"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h2 className="text-2xl font-bold text-gray-800 mb-6">Create New Quest 🎯</h2>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Quest Title *
                                        </label>
                                        <input
                                            type="text"
                                            value={newTask.title}
                                            onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                                            placeholder="What needs to be conquered?"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Description (Optional)
                                        </label>
                                        <textarea
                                            value={newTask.description}
                                            onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                                            placeholder="Add more details..."
                                            rows={3}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Category
                                            </label>
                                            <select
                                                value={newTask.category}
                                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {appState.categories.map(category => (
                                                    <option key={category.id} value={category.name}>
                                                        {category.icon} {category.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Priority
                                            </label>
                                            <select
                                                value={newTask.priority}
                                                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                <option value="low">🟢 Low</option>
                                                <option value="medium">🟡 Medium</option>
                                                <option value="high">🔴 High</option>
                                            </select>
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Estimated Time (minutes)
                                            </label>
                                            <input
                                                type="number"
                                                value={newTask.estimatedTime}
                                                onChange={(e) => setNewTask({ ...newTask, estimatedTime: parseInt(e.target.value) })}
                                                min="5"
                                                max="240"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                XP Reward
                                            </label>
                                            <input
                                                type="number"
                                                value={newTask.xpReward}
                                                onChange={(e) => setNewTask({ ...newTask, xpReward: parseInt(e.target.value) })}
                                                min="10"
                                                max="500"
                                                step="10"
                                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            />
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-3 mt-6">
                                    <button
                                        onClick={() => setShowAddTask(false)}
                                        className="flex-1 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleAddTask}
                                        disabled={!newTask.title.trim()}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Create Quest
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default TaskManager;