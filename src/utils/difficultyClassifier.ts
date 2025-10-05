/**
 * Difficulty Classifier Utility
 * Automatically classifies task difficulty based on content analysis
 * and provides XP rewards based on difficulty level
 */

export type TaskDifficulty = 'easy' | 'medium' | 'hard';

interface DifficultyAnalysis {
    difficulty: TaskDifficulty;
    confidence: number;
    reasons: string[];
    suggestedXP: number;
    suggestedTime: number; // in minutes
}

// Keywords that indicate different difficulty levels
const DIFFICULTY_KEYWORDS = {
    easy: [
        // Simple actions
        'check', 'read', 'look', 'see', 'find', 'get', 'take', 'pick', 'choose', 'select',
        'call', 'text', 'email', 'message', 'reply', 'respond',
        'buy', 'purchase', 'order', 'book', 'schedule',
        'clean', 'organize', 'tidy', 'sort',
        // Common daily tasks
        'water', 'feed', 'brush', 'shower', 'exercise', 'walk',
        'reminder', 'remember', 'note', 'write down', 'jot',
        // Quick tasks
        'quick', 'fast', 'simple', 'easy', 'brief', 'short'
    ],
    medium: [
        // Planning and thinking
        'plan', 'prepare', 'design', 'create', 'make', 'build', 'develop',
        'research', 'study', 'learn', 'practice', 'review', 'analyze',
        'write', 'draft', 'compose', 'edit', 'revise',
        'meeting', 'appointment', 'presentation', 'report',
        'project', 'assignment', 'homework', 'task',
        // Time indicators
        'hour', 'hours', 'morning', 'afternoon', 'evening',
        'today', 'tomorrow', 'week', 'weekend'
    ],
    hard: [
        // Complex activities
        'implement', 'deploy', 'launch', 'complete', 'finish', 'finalize',
        'solve', 'fix', 'debug', 'troubleshoot', 'repair',
        'negotiate', 'discuss', 'present', 'convince', 'persuade',
        'manage', 'lead', 'coordinate', 'organize', 'supervise',
        'strategic', 'complex', 'challenging', 'difficult', 'advanced',
        // Long-term indicators
        'month', 'months', 'year', 'long-term', 'ongoing',
        'comprehensive', 'thorough', 'detailed', 'extensive',
        // Work/career terms
        'career', 'job', 'interview', 'resume', 'application',
        'exam', 'test', 'certification', 'qualification'
    ]
};

// Time-based keywords
const TIME_KEYWORDS = {
    short: ['minute', 'minutes', 'quick', 'fast', 'brief', 'short', 'now', 'asap'],
    medium: ['hour', 'hours', 'morning', 'afternoon', 'evening', 'today', 'tomorrow'],
    long: ['day', 'days', 'week', 'weeks', 'month', 'months', 'year', 'long-term']
};

// Context keywords that modify difficulty
const CONTEXT_MODIFIERS = {
    increase: ['first time', 'never', 'complex', 'difficult', 'challenging', 'advanced', 'professional'],
    decrease: ['again', 'repeat', 'routine', 'usual', 'simple', 'basic', 'familiar']
};

/**
 * Automatically classify task difficulty based on title content
 */
export function classifyTaskDifficulty(title: string, description?: string): DifficultyAnalysis {
    const text = `${title} ${description || ''}`.toLowerCase();
    const words = text.split(/\s+/);

    let easyScore = 0;
    let mediumScore = 0;
    let hardScore = 0;
    const reasons: string[] = [];

    // Score based on keyword matches
    words.forEach(word => {
        if (DIFFICULTY_KEYWORDS.easy.some(keyword => word.includes(keyword))) {
            easyScore += 1;
        }
        if (DIFFICULTY_KEYWORDS.medium.some(keyword => word.includes(keyword))) {
            mediumScore += 1;
        }
        if (DIFFICULTY_KEYWORDS.hard.some(keyword => word.includes(keyword))) {
            hardScore += 1;
        }
    });

    // Time-based analysis
    let timeScore = 0;
    if (TIME_KEYWORDS.short.some(keyword => text.includes(keyword))) {
        easyScore += 0.5;
        timeScore = 15; // 15 minutes
        reasons.push('Quick time indicator detected');
    } else if (TIME_KEYWORDS.medium.some(keyword => text.includes(keyword))) {
        mediumScore += 0.5;
        timeScore = 60; // 1 hour
        reasons.push('Medium time indicator detected');
    } else if (TIME_KEYWORDS.long.some(keyword => text.includes(keyword))) {
        hardScore += 0.5;
        timeScore = 180; // 3 hours
        reasons.push('Long-term indicator detected');
    }

    // Context modifiers
    if (CONTEXT_MODIFIERS.increase.some(mod => text.includes(mod))) {
        hardScore += 0.5;
        reasons.push('Complexity modifier detected');
    }
    if (CONTEXT_MODIFIERS.decrease.some(mod => text.includes(mod))) {
        easyScore += 0.5;
        reasons.push('Familiarity modifier detected');
    }

    // Length-based heuristics
    if (title.length < 20) {
        easyScore += 0.3;
        reasons.push('Short task title');
    } else if (title.length > 50) {
        mediumScore += 0.3;
        reasons.push('Detailed task description');
    }

    // Word count analysis
    if (words.length <= 3) {
        easyScore += 0.5;
        reasons.push('Simple task structure');
    } else if (words.length > 8) {
        hardScore += 0.3;
        reasons.push('Complex task structure');
    }

    // Determine final difficulty
    const scores = { easy: easyScore, medium: mediumScore, hard: hardScore };
    const maxScore = Math.max(easyScore, mediumScore, hardScore);

    let difficulty: TaskDifficulty;
    let confidence: number;

    if (maxScore === 0) {
        // No clear indicators, default to medium
        difficulty = 'medium';
        confidence = 0.5;
        reasons.push('Default classification (no clear indicators)');
    } else {
        if (easyScore === maxScore) {
            difficulty = 'easy';
        } else if (hardScore === maxScore) {
            difficulty = 'hard';
        } else {
            difficulty = 'medium';
        }

        confidence = Math.min(maxScore / (easyScore + mediumScore + hardScore), 1);
    }

    // Adjust for ties - prefer medium difficulty for ambiguous cases
    if (confidence < 0.6 && difficulty !== 'medium') {
        difficulty = 'medium';
        reasons.push('Ambiguous classification, defaulted to medium');
    }

    return {
        difficulty,
        confidence,
        reasons,
        suggestedXP: getDifficultyXP(difficulty),
        suggestedTime: timeScore || getDifficultyTime(difficulty)
    };
}

/**
 * Get XP reward based on difficulty
 */
export function getDifficultyXP(difficulty: TaskDifficulty): number {
    switch (difficulty) {
        case 'easy': return 25;
        case 'medium': return 50;
        case 'hard': return 100;
        default: return 50;
    }
}

/**
 * Get estimated time based on difficulty (in minutes)
 */
export function getDifficultyTime(difficulty: TaskDifficulty): number {
    switch (difficulty) {
        case 'easy': return 15;
        case 'medium': return 45;
        case 'hard': return 120;
        default: return 45;
    }
}

/**
 * Get difficulty emoji
 */
export function getDifficultyEmoji(difficulty: TaskDifficulty): string {
    switch (difficulty) {
        case 'easy': return '🔵'; // blue circle
        case 'medium': return '🩷'; // light pink circle
        case 'hard': return '🔹'; // small blue diamond
        default: return '🩷';
    }
}

/**
 * Get difficulty color
 */
export function getDifficultyColor(difficulty: TaskDifficulty): string {
    switch (difficulty) {
        case 'easy': return 'rgb(147, 197, 253)'; // light blue
        case 'medium': return 'rgb(252, 165, 165)'; // medium pink
        case 'hard': return 'rgb(59, 130, 246)'; // medium blue
        default: return 'rgb(252, 165, 165)';
    }
}

/**
 * Get difficulty description for UI
 */
export function getDifficultyDescription(difficulty: TaskDifficulty): string {
    switch (difficulty) {
        case 'easy': return 'Quick & Simple';
        case 'medium': return 'Moderate Effort';
        case 'hard': return 'Challenging';
        default: return 'Moderate Effort';
    }
}