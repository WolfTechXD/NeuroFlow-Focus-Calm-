import { User, Task, Achievement, TaskCategory, DailyStats, SubscriptionStatus } from '../types/index';

export const defaultCategories: TaskCategory[] = [
    { id: '1', name: 'Work/Study', color: '#3B82F6', icon: '📚' },
    { id: '2', name: 'Self-Care', color: '#10B981', icon: '🌿' },
    { id: '3', name: 'Exercise', color: '#F59E0B', icon: '🏃' },
    { id: '4', name: 'Home', color: '#8B5CF6', icon: '🏠' },
    { id: '5', name: 'Social', color: '#EF4444', icon: '👥' },
    { id: '6', name: 'Creative', color: '#EC4899', icon: '🎨' },
];

export const defaultAchievements: Achievement[] = [
    {
        id: 'first-task',
        title: 'First Quest Complete!',
        description: 'Complete your very first task',
        icon: '🎯',
        xpReward: 50,
        type: 'tasks'
    },
    {
        id: 'streak-3',
        title: 'Momentum Builder',
        description: 'Complete tasks for 3 days in a row',
        icon: '🔥',
        xpReward: 100,
        type: 'streak'
    },
    {
        id: 'streak-7',
        title: 'Week Warrior',
        description: 'Maintain a 7-day streak',
        icon: '⚡',
        xpReward: 250,
        type: 'streak'
    },
    {
        id: 'focus-master',
        title: 'Focus Master',
        description: 'Complete 10 focus sessions',
        icon: '🧠',
        xpReward: 200,
        type: 'focus'
    },
    {
        id: 'zen-seeker',
        title: 'Zen Seeker',
        description: 'Complete 5 zen activities',
        icon: '🧘',
        xpReward: 150,
        type: 'zen'
    },
    {
        id: 'task-crusher',
        title: 'Task Crusher',
        description: 'Complete 50 tasks',
        icon: '💪',
        xpReward: 500,
        type: 'tasks'
    }
];

export const createDefaultUser = (isGuest: boolean = true): User => ({
    id: isGuest ? 'guest-user' : 'user-1',
    name: isGuest ? 'Demo User' : 'Neurodivergent Hero',
    email: isGuest ? undefined : undefined,
    avatar: '🦸',
    level: 1,
    xp: 0,
    streak: 0,
    totalPoints: 0,
    preferences: {
        theme: 'colorful',
        soundEnabled: true,
        animationsEnabled: true,
        notificationsEnabled: true,
        difficultyLevel: 'medium',
        focusSessionLength: 25,
        breakLength: 5,
    },
    achievements: [],
    subscription: {
        isPremium: false,
        plan: 'demo'
    },
    isGuest
});

export const calculateLevel = (xp: number): number => {
    return Math.floor(xp / 1000) + 1;
};

export const calculateXPForNextLevel = (currentXP: number): number => {
    const currentLevel = calculateLevel(currentXP);
    return currentLevel * 1000;
};

export const getXPProgress = (currentXP: number): number => {
    const currentLevel = calculateLevel(currentXP);
    const previousLevelXP = (currentLevel - 1) * 1000;
    const nextLevelXP = currentLevel * 1000;
    return ((currentXP - previousLevelXP) / (nextLevelXP - previousLevelXP)) * 100;
};

export const generateId = (): string => {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

export const formatTime = (minutes: number): string => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
        return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
};

export const getTodayStats = (dailyStats: DailyStats[]): DailyStats => {
    const today = new Date().toISOString().split('T')[0];
    return dailyStats.find(stat => stat.date === today) || {
        date: today,
        tasksCompleted: 0,
        focusMinutes: 0,
        zenMinutes: 0,
        xpEarned: 0,
        streakDay: false
    };
};