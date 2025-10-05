export type TaskDifficulty = 'easy' | 'medium' | 'hard';

export interface TaskCategory {
    id: string;
    name: string;
    color: string;
    icon: string;
}

export interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    xpReward: number;
    category: string;
    priority: 'low' | 'medium' | 'high';
    difficulty: 'easy' | 'medium' | 'hard';
    createdAt: Date;
    completedAt?: Date;
    estimatedTime?: number;
}

export interface User {
    name: string;
    email?: string;
    xp: number;
    level: number;
    isGuest: boolean;
    avatar: string;
    streak: number;
    totalPoints: number;
    achievements: Achievement[];
    preferences: UserPreferences;
    subscription: SubscriptionStatus;
}

export interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    xpReward: number;
    type: 'streak' | 'tasks' | 'focus' | 'zen' | 'special';
}

export interface UserPreferences {
    theme: 'light' | 'dark' | 'colorful';
    soundEnabled: boolean;
    animationsEnabled: boolean;
    notificationsEnabled: boolean;
    difficultyLevel: 'easy' | 'medium' | 'hard';
    focusSessionLength: number;
    breakLength: number;
}

export interface SubscriptionStatus {
    isPremium: boolean;
    plan: 'demo' | 'base' | 'full';
    purchaseDate?: Date;
    expiryDate?: Date;
}

export interface DailyStats {
    date: string;
    tasksCompleted: number;
    focusMinutes: number;
    zenMinutes: number;
    xpEarned: number;
    streakDay: boolean;
}

export interface AppState {
    user: User;
    tasks: Task[];
    categories: TaskCategory[];
    currentPage: 'dashboard' | 'tasks' | 'zen' | 'sounds' | 'tips' | 'guides' | 'profile' | 'settings';
    soundLibrary: Sound[];
    activeSounds: ActiveSound[];
    zenSession?: ZenSession;
    achievements: Achievement[];
    dailyStats: DailyStats[];
}

export interface Sound {
    id: string;
    name: string;
    category: 'nature' | 'ambient' | 'focus' | 'meditation' | 'urban';
    emoji: string;
    isPremium: boolean;
    audioUrl?: string;
    duration?: number;
    description?: string;
}

export interface ActiveSound {
    soundId: string;
    volume: number;
    isPlaying: boolean;
    audioContext?: AudioContext;
    source?: OscillatorNode | AudioBufferSourceNode;
    gainNode?: GainNode;
    stopFunction?: () => void;
    lfo?: OscillatorNode;
    lfoGain?: GainNode;
}

export interface ZenSession {
    type: 'breathing' | 'meditation' | 'mindfulness';
    duration: number;
    startTime: Date;
    isActive: boolean;
    currentPhase?: string;
}

export interface ZenActivity {
    id: string;
    name: string;
    description: string;
    type: 'breathing' | 'meditation' | 'sounds' | 'mindfulness';
    duration: number; // in minutes
    instructions?: string[];
    audioUrl?: string;
}