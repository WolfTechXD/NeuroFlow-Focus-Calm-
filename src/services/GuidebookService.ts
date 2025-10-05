/**
 * Interactive Guidebook Service
 * Manages guidebook content, progress tracking, and multimedia integration
 */

import { apiContentService } from './APIContentService';
import { ttsService } from '../utils/textToSpeech';

// Guidebook types
export interface GuidebookChapter {
    id: string;
    title: string;
    description: string;
    content: GuidebookSection[];
    estimatedReadTime: number; // in minutes
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    tags: string[];
    prerequisiteChapters?: string[];
    isPremium: boolean;
    thumbnailUrl?: string;
}

export interface GuidebookSection {
    id: string;
    type: 'text' | 'interactive' | 'audio' | 'video' | 'exercise' | 'checklist' | 'quiz';
    title?: string;
    content: string | InteractiveContent;
    metadata?: {
        imageUrl?: string;
        audioUrl?: string;
        videoUrl?: string;
        ttsEnabled?: boolean;
        duration?: number;
    };
}

export interface InteractiveContent {
    type: 'checklist' | 'breathing-exercise' | 'mood-tracker' | 'goal-setting' | 'quiz';
    data: any;
    interactions: InteractionElement[];
}

export interface InteractionElement {
    id: string;
    type: 'button' | 'slider' | 'checkbox' | 'text-input' | 'timer';
    label: string;
    action?: string;
    validation?: any;
}

export interface UserProgress {
    userId: string;
    chapterId: string;
    sectionsCompleted: string[];
    totalSections: number;
    completionPercentage: number;
    lastAccessed: Date;
    timeSpent: number; // in minutes
    notes: string[];
    bookmarks: string[];
}

export interface GuidebookCategory {
    id: string;
    name: string;
    description: string;
    icon: string;
    color: string;
    chapters: string[]; // chapter IDs
    isPremium: boolean;
}

class GuidebookService {
    private static instance: GuidebookService;
    private chapters: Map<string, GuidebookChapter> = new Map();
    private categories: GuidebookCategory[] = [];
    private userProgress: Map<string, UserProgress> = new Map();
    private currentChapter: GuidebookChapter | null = null;
    private isInitialized = false;

    private constructor() {
        this.initializeContent();
    }

    public static getInstance(): GuidebookService {
        if (!GuidebookService.instance) {
            GuidebookService.instance = new GuidebookService();
        }
        return GuidebookService.instance;
    }

    /**
     * Initialize guidebook content
     */
    private async initializeContent(): Promise<void> {
        try {
            // Load categories
            this.categories = this.getDefaultCategories();
            
            // Load chapters
            const chapters = await this.getDefaultChapters();
            chapters.forEach(chapter => {
                this.chapters.set(chapter.id, chapter);
            });

            // Load user progress from localStorage
            this.loadUserProgress();
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to initialize guidebook content:', error);
            this.isInitialized = true; // Still mark as initialized to prevent infinite loops
        }
    }

    /**
     * Get default categories
     */
    private getDefaultCategories(): GuidebookCategory[] {
        return [
            {
                id: 'adhd-basics',
                name: 'ADHD Fundamentals',
                description: 'Understanding ADHD and building foundational strategies',
                icon: '🧠',
                color: 'from-blue-400 to-cyan-500',
                chapters: ['adhd-understanding', 'self-awareness', 'daily-routines'],
                isPremium: false
            },
            {
                id: 'focus-productivity',
                name: 'Focus & Productivity',
                description: 'Techniques for improving concentration and getting things done',
                icon: '🎯',
                color: 'from-green-400 to-emerald-500',
                chapters: ['focus-techniques', 'time-management', 'task-prioritization'],
                isPremium: false
            },
            {
                id: 'emotional-regulation',
                name: 'Emotional Wellness',
                description: 'Managing emotions, stress, and building resilience',
                icon: '💚',
                color: 'from-pink-400 to-rose-500',
                chapters: ['emotional-awareness', 'stress-management', 'mindfulness'],
                isPremium: true
            },
            {
                id: 'social-skills',
                name: 'Social & Communication',
                description: 'Improving relationships and communication skills',
                icon: '🤝',
                color: 'from-purple-400 to-indigo-500',
                chapters: ['communication', 'relationships', 'workplace-skills'],
                isPremium: true
            },
            {
                id: 'advanced-strategies',
                name: 'Advanced Techniques',
                description: 'Sophisticated approaches for long-term success',
                icon: '🚀',
                color: 'from-yellow-400 to-orange-500',
                chapters: ['habit-formation', 'goal-achievement', 'life-optimization'],
                isPremium: true
            }
        ];
    }

    /**
     * Get default chapters with content
     */
    private async getDefaultChapters(): Promise<GuidebookChapter[]> {
        return [
            {
                id: 'adhd-understanding',
                title: 'Understanding ADHD',
                description: 'Learn about ADHD brain differences and how they affect daily life',
                estimatedReadTime: 15,
                difficulty: 'beginner',
                tags: ['adhd', 'neuroscience', 'basics'],
                isPremium: false,
                content: [
                    {
                        id: 'intro',
                        type: 'text',
                        title: 'What is ADHD?',
                        content: `ADHD (Attention Deficit Hyperactivity Disorder) is a neurodevelopmental condition that affects how the brain processes information and regulates attention, hyperactivity, and impulsivity.\n\nContrary to common misconceptions, ADHD is not about lacking intelligence or being lazy. It's about having a brain that works differently, with unique strengths and challenges.`,
                        metadata: { ttsEnabled: true }
                    },
                    {
                        id: 'brain-differences',
                        type: 'interactive',
                        title: 'ADHD Brain Differences',
                        content: {
                            type: 'checklist',
                            data: {
                                title: 'Common ADHD Traits - Check what applies to you:',
                                items: [
                                    'Difficulty focusing on boring tasks',
                                    'Hyperfocus on interesting activities',
                                    'Challenges with time management',
                                    'Creative problem-solving abilities',
                                    'High energy and enthusiasm',
                                    'Difficulty with organization',
                                    'Strong empathy and emotional sensitivity',
                                    'Innovative thinking patterns'
                                ]
                            },
                            interactions: [
                                {
                                    id: 'self-assessment',
                                    type: 'checkbox',
                                    label: 'Select traits that apply to you',
                                    action: 'save-assessment'
                                }
                            ]
                        }
                    },
                    {
                        id: 'strength-focus',
                        type: 'text',
                        title: 'ADHD Strengths',
                        content: `People with ADHD often possess remarkable strengths:

• **Creativity**: Unique perspectives and innovative solutions
• **Hyperfocus**: Intense concentration on engaging tasks
• **Resilience**: Adaptability developed through overcoming challenges
• **Empathy**: Deep emotional understanding of others
• **Energy**: High enthusiasm for meaningful projects`,
                        metadata: {
                            ttsEnabled: true,
                            imageUrl: 'adhd-strengths.jpg'
                        }
                    }
                ]
            },
            {
                id: 'focus-techniques',
                title: 'Focus Enhancement Techniques',
                description: 'Practical strategies to improve concentration and attention',
                estimatedReadTime: 20,
                difficulty: 'beginner',
                tags: ['focus', 'concentration', 'techniques'],
                isPremium: false,
                prerequisiteChapters: ['adhd-understanding'],
                content: [
                    {
                        id: 'pomodoro-intro',
                        type: 'text',
                        title: 'The Pomodoro Technique',
                        content: `The Pomodoro Technique is particularly effective for ADHD brains because it works with natural attention cycles rather than against them.\n\nThe basic principle: Work for 25 minutes, then take a 5-minute break. After 4 cycles, take a longer 15-30 minute break.`,
                        metadata: { ttsEnabled: true }
                    },
                    {
                        id: 'pomodoro-practice',
                        type: 'interactive',
                        title: 'Try a Pomodoro Session',
                        content: {
                            type: 'breathing-exercise',
                            data: {
                                title: 'Focus Preparation Exercise',
                                duration: 120, // 2 minutes
                                instructions: [
                                    'Find a comfortable position',
                                    'Close your eyes or soften your gaze',
                                    'Take deep breaths to center yourself',
                                    'Set intention for focused work',
                                    'Begin your Pomodoro session'
                                ]
                            },
                            interactions: [
                                {
                                    id: 'timer',
                                    type: 'timer',
                                    label: 'Start Focus Timer',
                                    action: 'start-pomodoro'
                                }
                            ]
                        }
                    }
                ]
            },
            {
                id: 'emotional-awareness',
                title: 'Emotional Awareness & Regulation',
                description: 'Understanding and managing emotional intensity',
                estimatedReadTime: 25,
                difficulty: 'intermediate',
                tags: ['emotions', 'regulation', 'mindfulness'],
                isPremium: true,
                content: [
                    {
                        id: 'emotional-intensity',
                        type: 'text',
                        title: 'ADHD and Emotional Intensity',
                        content: `ADHD often comes with heightened emotional sensitivity. This isn't a weakness - it's a sign of a deeply feeling, empathetic brain.

Emotional regulation challenges in ADHD include:
• Intense reactions to stimuli
• Difficulty \"bouncing back\" from setbacks
• Overwhelming feelings in social situations
• Rejection sensitive dysphoria (RSD)`,
                        metadata: {
                            ttsEnabled: true,
                            imageUrl: 'emotional-brain.jpg'
                        }
                    },
                    {
                        id: 'mood-tracker',
                        type: 'interactive',
                        title: 'Mood Check-In',
                        content: {
                            type: 'mood-tracker',
                            data: {
                                title: 'How are you feeling right now?',
                                emotions: [
                                    { name: 'Happy', emoji: '😊', color: '#22c55e' },
                                    { name: 'Anxious', emoji: '😰', color: '#f59e0b' },
                                    { name: 'Frustrated', emoji: '😤', color: '#ef4444' },
                                    { name: 'Calm', emoji: '😌', color: '#3b82f6' },
                                    { name: 'Excited', emoji: '🤩', color: '#8b5cf6' },
                                    { name: 'Overwhelmed', emoji: '🤯', color: '#f97316' }
                                ]
                            },
                            interactions: [
                                {
                                    id: 'mood-select',
                                    type: 'button',
                                    label: 'Select your current mood',
                                    action: 'log-mood'
                                }
                            ]
                        }
                    }
                ]
            }
        ];
    }

    /**
     * Get all categories
     */
    public getCategories(isPremium: boolean = false): GuidebookCategory[] {
        return this.categories.filter(cat => isPremium || !cat.isPremium);
    }

    /**
     * Get chapters by category
     */
    public getChaptersByCategory(categoryId: string, isPremium: boolean = false): GuidebookChapter[] {
        const category = this.categories.find(cat => cat.id === categoryId);
        if (!category) return [];

        return category.chapters
            .map(chapterId => this.chapters.get(chapterId))
            .filter((chapter): chapter is GuidebookChapter => 
                chapter !== undefined && (isPremium || !chapter.isPremium)
            );
    }

    /**
     * Get chapter by ID
     */
    public getChapter(chapterId: string): GuidebookChapter | null {
        return this.chapters.get(chapterId) || null;
    }

    /**
     * Get user progress for a chapter
     */
    public getUserProgress(userId: string, chapterId: string): UserProgress | null {
        const key = `${userId}_${chapterId}`;
        return this.userProgress.get(key) || null;
    }

    /**
     * Update user progress
     */
    public updateProgress(userId: string, chapterId: string, sectionId: string, timeSpent: number = 0): void {
        const key = `${userId}_${chapterId}`;
        const chapter = this.chapters.get(chapterId);
        if (!chapter) return;

        let progress = this.userProgress.get(key);
        if (!progress) {
            progress = {
                userId,
                chapterId,
                sectionsCompleted: [],
                totalSections: chapter.content.length,
                completionPercentage: 0,
                lastAccessed: new Date(),
                timeSpent: 0,
                notes: [],
                bookmarks: []
            };
        }

        // Add section to completed if not already there
        if (!progress.sectionsCompleted.includes(sectionId)) {
            progress.sectionsCompleted.push(sectionId);
        }

        // Update progress data
        progress.completionPercentage = (progress.sectionsCompleted.length / progress.totalSections) * 100;
        progress.lastAccessed = new Date();
        progress.timeSpent += timeSpent;

        this.userProgress.set(key, progress);
        this.saveUserProgress();
    }

    /**
     * Add bookmark
     */
    public addBookmark(userId: string, chapterId: string, sectionId: string): void {
        const key = `${userId}_${chapterId}`;
        const progress = this.userProgress.get(key);
        if (progress && !progress.bookmarks.includes(sectionId)) {
            progress.bookmarks.push(sectionId);
            this.saveUserProgress();
        }
    }

    /**
     * Add note
     */
    public addNote(userId: string, chapterId: string, note: string): void {
        const key = `${userId}_${chapterId}`;
        const progress = this.userProgress.get(key);
        if (progress) {
            progress.notes.push(note);
            this.saveUserProgress();
        }
    }

    /**
     * Search chapters
     */
    public searchChapters(query: string, isPremium: boolean = false): GuidebookChapter[] {
        const lowerQuery = query.toLowerCase();
        return Array.from(this.chapters.values())
            .filter(chapter => {
                const matchesQuery = 
                    chapter.title.toLowerCase().includes(lowerQuery) ||
                    chapter.description.toLowerCase().includes(lowerQuery) ||
                    chapter.tags.some(tag => tag.toLowerCase().includes(lowerQuery));
                
                const hasAccess = isPremium || !chapter.isPremium;
                
                return matchesQuery && hasAccess;
            });
    }

    /**
     * Get recommended chapters based on user progress
     */
    public getRecommendedChapters(userId: string, isPremium: boolean = false): GuidebookChapter[] {
        const userProgressEntries = Array.from(this.userProgress.values())
            .filter(p => p.userId === userId);
        
        // Find chapters user hasn't completed
        const completedChapterIds = userProgressEntries
            .filter(p => p.completionPercentage >= 80)
            .map(p => p.chapterId);
        
        const availableChapters = Array.from(this.chapters.values())
            .filter(chapter => {
                const hasAccess = isPremium || !chapter.isPremium;
                const notCompleted = !completedChapterIds.includes(chapter.id);
                const hasPrerequisites = !chapter.prerequisiteChapters || 
                    chapter.prerequisiteChapters.every(id => completedChapterIds.includes(id));
                
                return hasAccess && notCompleted && hasPrerequisites;
            });
        
        // Sort by difficulty and user progress
        return availableChapters
            .sort((a, b) => {
                const difficultyOrder = { beginner: 0, intermediate: 1, advanced: 2 };
                return difficultyOrder[a.difficulty] - difficultyOrder[b.difficulty];
            })
            .slice(0, 5);
    }

    /**
     * Generate images for chapter content
     */
    public async generateChapterImages(chapterId: string): Promise<void> {
        const chapter = this.chapters.get(chapterId);
        if (!chapter) return;

        try {
            // Generate images for sections that need them
            for (const section of chapter.content) {
                if (section.metadata?.imageUrl && !section.metadata.imageUrl.startsWith('http')) {
                    const query = `${chapter.title} ${section.title || ''} adhd neurodivergent`;
                    const images = await apiContentService.fetchUnsplashImages(query, 1);
                    if (images.length > 0) {
                        section.metadata.imageUrl = images[0].url;
                    }
                }
            }

            // Save updated chapter
            this.chapters.set(chapterId, chapter);
        } catch (error) {
            console.error('Failed to generate chapter images:', error);
        }
    }

    /**
     * Read section content with TTS
     */
    public async readSection(section: GuidebookSection, settings?: any): Promise<void> {
        if (section.type !== 'text' || !section.metadata?.ttsEnabled) {
            return;
        }

        try {
            const textContent = typeof section.content === 'string' ? section.content : '';
            const cleanText = textContent.replace(/[*#•]/g, '').replace(/\n\n/g, '. ');
            
            await ttsService.speak(cleanText, settings);
        } catch (error) {
            console.error('TTS playback failed:', error);
        }
    }

    /**
     * Get overall user statistics
     */
    public getUserStatistics(userId: string): {
        totalChaptersStarted: number;
        totalChaptersCompleted: number;
        totalTimeSpent: number;
        averageCompletion: number;
        favoriteCategory: string;
    } {
        const userProgressEntries = Array.from(this.userProgress.values())
            .filter(p => p.userId === userId);
        
        const completedChapters = userProgressEntries.filter(p => p.completionPercentage >= 80);
        const totalTime = userProgressEntries.reduce((sum, p) => sum + p.timeSpent, 0);
        const avgCompletion = userProgressEntries.length > 0 
            ? userProgressEntries.reduce((sum, p) => sum + p.completionPercentage, 0) / userProgressEntries.length
            : 0;
        
        // Find favorite category based on completed chapters
        const categoryStats = new Map<string, number>();
        completedChapters.forEach(progress => {
            const chapter = this.chapters.get(progress.chapterId);
            if (chapter) {
                const category = this.categories.find(cat => cat.chapters.includes(chapter.id));
                if (category) {
                    categoryStats.set(category.id, (categoryStats.get(category.id) || 0) + 1);
                }
            }
        });
        
        const favoriteCategory = categoryStats.size > 0 
            ? Array.from(categoryStats.entries()).sort((a, b) => b[1] - a[1])[0][0]
            : 'adhd-basics';
        
        return {
            totalChaptersStarted: userProgressEntries.length,
            totalChaptersCompleted: completedChapters.length,
            totalTimeSpent: totalTime,
            averageCompletion: avgCompletion,
            favoriteCategory
        };
    }

    /**
     * Save user progress to localStorage
     */
    private saveUserProgress(): void {
        const progressData = Array.from(this.userProgress.entries()).map(([key, progress]) => [key, {
            ...progress,
            lastAccessed: progress.lastAccessed.toISOString()
        }]);
        
        localStorage.setItem('neuroflow-guidebook-progress', JSON.stringify(progressData));
    }

    /**
     * Load user progress from localStorage
     */
    private loadUserProgress(): void {
        try {
            const saved = localStorage.getItem('neuroflow-guidebook-progress');
            if (saved) {
                const progressData = JSON.parse(saved);
                progressData.forEach(([key, progress]: [string, any]) => {
                    this.userProgress.set(key, {
                        ...progress,
                        lastAccessed: new Date(progress.lastAccessed)
                    });
                });
            }
        } catch (error) {
            console.error('Failed to load user progress:', error);
        }
    }

    /**
     * Export user progress
     */
    public exportUserData(userId: string): any {
        const userProgressEntries = Array.from(this.userProgress.entries())
            .filter(([key]) => key.startsWith(userId))
            .map(([key, progress]) => [key, progress]);
        
        return {
            progress: userProgressEntries,
            statistics: this.getUserStatistics(userId),
            exportDate: new Date().toISOString()
        };
    }

    /**
     * Check if service is initialized
     */
    public isServiceInitialized(): boolean {
        return this.isInitialized;
    }
}

// Export singleton instance
export const guidebookService = GuidebookService.getInstance();