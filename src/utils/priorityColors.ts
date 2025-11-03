export type Priority = 'low' | 'medium' | 'high';
export type Difficulty = 'easy' | 'medium' | 'hard';

export const getPriorityColor = (priority: Priority): string => {
    switch (priority) {
        case 'low':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'medium':
            return 'bg-yellow-100 text-yellow-800 border-yellow-200';
        case 'high':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getPriorityBadgeColor = (priority: Priority): string => {
    switch (priority) {
        case 'low':
            return 'bg-green-500 text-white';
        case 'medium':
            return 'bg-yellow-500 text-white';
        case 'high':
            return 'bg-red-500 text-white';
        default:
            return 'bg-gray-500 text-white';
    }
};

export const getDifficultyColor = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'easy':
            return 'bg-green-100 text-green-800 border-green-200';
        case 'medium':
            return 'bg-orange-100 text-orange-800 border-orange-200';
        case 'hard':
            return 'bg-red-100 text-red-800 border-red-200';
        default:
            return 'bg-gray-100 text-gray-800 border-gray-200';
    }
};

export const getDifficultyIcon = (difficulty: Difficulty): string => {
    switch (difficulty) {
        case 'easy':
            return '🌱';
        case 'medium':
            return '🌿';
        case 'hard':
            return '🌳';
        default:
            return '📖';
    }
};

export const getPriorityIcon = (priority: Priority): string => {
    switch (priority) {
        case 'low':
            return '✓';
        case 'medium':
            return '⚡';
        case 'high':
            return '🔥';
        default:
            return '📌';
    }
};
