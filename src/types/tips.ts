export interface Tip {
    id: string;
    title: string;
    content: string;
    category: TipCategory;
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    timeToRead: number; // in minutes
    isPremium: boolean;
    tags: string[];
    rating?: number;
    helpful: number;
    hasAudio: boolean;
}

export interface TipCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
    targetCondition: 'adhd' | 'autism' | 'both';
}

export interface InteractiveGuide {
    id: string;
    title: string;
    description: string;
    chapters: Chapter[];
    estimatedTime: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    isPremium: boolean;
}

export interface Chapter {
    id: string;
    title: string;
    content: string;
    exercises?: Exercise[];
    hasAudio: boolean;
    estimatedTime: number;
    order: number;
}

export interface Exercise {
    id: string;
    title: string;
    description: string;
    type: 'reflection' | 'practice' | 'quiz' | 'interactive';
    content: string;
    completed?: boolean;
}