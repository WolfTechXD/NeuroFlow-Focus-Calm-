import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from '../types/index';
import { guidebookService, GuidebookChapter, GuidebookCategory, UserProgress } from '../services/GuidebookService';
import TTSPlayer from '../components/TTSPlayer';

interface InteractiveGuidesProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const InteractiveGuides: React.FC<InteractiveGuidesProps> = ({ appState, onUpdateState }) => {
    const [categories, setCategories] = useState<GuidebookCategory[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedChapter, setSelectedChapter] = useState<GuidebookChapter | null>(null);
    const [chapters, setChapters] = useState<GuidebookChapter[]>([]);
    const [userProgress, setUserProgress] = useState<Map<string, UserProgress>>(new Map());
    const [searchQuery, setSearchQuery] = useState('');
    const [isLoading, setIsLoading] = useState(true);
    const [currentSection, setCurrentSection] = useState(0);

    const isPremium = appState.user.subscription.isPremium;
    const userId = appState.user.id;

    // Load guidebook data
    useEffect(() => {
        const loadGuidebookData = async () => {
            setIsLoading(true);
            try {
                // Wait for service initialization
                while (!guidebookService.isServiceInitialized()) {
                    await new Promise(resolve => setTimeout(resolve, 100));
                }

                const loadedCategories = guidebookService.getCategories(isPremium);
                setCategories(loadedCategories);

                // Load user progress for all chapters
                const progressMap = new Map<string, UserProgress>();
                loadedCategories.forEach(category => {
                    category.chapters.forEach(chapterId => {
                        const progress = guidebookService.getUserProgress(userId, chapterId);
                        if (progress) {
                            progressMap.set(chapterId, progress);
                        }
                    });
                });
                setUserProgress(progressMap);

                // Auto-select first category if none selected
                if (!selectedCategory && loadedCategories.length > 0) {
                    setSelectedCategory(loadedCategories[0].id);
                }
            } catch (error) {
                console.error('Failed to load guidebook data:', error);
            } finally {
                setIsLoading(false);
            }
        };

        loadGuidebookData();
    }, [isPremium, userId, selectedCategory]);

    // Load chapters when category changes
    useEffect(() => {
        if (selectedCategory) {
            const categoryChapters = guidebookService.getChaptersByCategory(selectedCategory, isPremium);
            setChapters(categoryChapters);
        }
    }, [selectedCategory, isPremium]);

    // Search functionality
    const searchResults = React.useMemo(() => {
        if (!searchQuery.trim()) return [];
        return guidebookService.searchChapters(searchQuery, isPremium);
    }, [searchQuery, isPremium]);

    const handleSectionComplete = (chapterId: string, sectionId: string) => {
        guidebookService.updateProgress(userId, chapterId, sectionId, 2); // 2 minutes average

        // Refresh progress
        const updatedProgress = guidebookService.getUserProgress(userId, chapterId);
        if (updatedProgress) {
            setUserProgress(prev => new Map(prev.set(chapterId, updatedProgress)));
        }
    };

    const getChapterProgress = (chapterId: string): number => {
        const progress = userProgress.get(chapterId);
        return progress?.completionPercentage || 0;
    };

    const formatEstimatedTime = (minutes: number): string => {
        if (minutes < 60) {
            return `${minutes} min`;
        }
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;
        return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-app flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin text-4xl mb-4">📚</div>
                    <p className="text-secondary">Loading interactive guides...</p>
                </div>
            </div>
        );
    }

    // Show premium upgrade notice for non-premium users
    if (!isPremium) {
        return (
            <div className="min-h-screen bg-app p-4">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="text-8xl mb-6">📚</div>
                    <h1 className="text-4xl font-bold text-primary mb-4">Interactive Life Guides</h1>
                    <motion.div className="card bg-gradient-to-r from-purple-400 to-pink-500 text-white">
                        <h2 className="text-2xl font-bold mb-4">🔓 Unlock Interactive Guides</h2>
                        <p className="mb-6">Get comprehensive guides covering ADHD mastery, emotional regulation, and productivity strategies!</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">🧠 ADHD Fundamentals</h3>
                                <p className="text-sm">Understanding your brain and building foundational strategies</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">💚 Emotional Wellness</h3>
                                <p className="text-sm">Managing emotions, stress, and building resilience</p>
                            </div>
                            <div className="bg-white/10 p-4 rounded-lg">
                                <h3 className="font-semibold mb-2">🚀 Advanced Techniques</h3>
                                <p className="text-sm">Sophisticated approaches for long-term success</p>
                            </div>
                        </div>
                        <button className="btn-secondary bg-white text-purple-600 hover:bg-gray-100">
                            Upgrade to Premium - $5
                        </button>
                    </motion.div>
                </div>
            </div>
        );
    }

    // Main guides overview
    const displayChapters = searchQuery.trim() ? searchResults : chapters;

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">📚 Interactive Life Guides</h1>
                    <p className="text-secondary">Comprehensive guides designed specifically for neurodivergent minds</p>
                </div>

                {/* Search bar */}
                <div className="max-w-md mx-auto mb-8">
                    <input
                        type="text"
                        placeholder="Search guides..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                </div>

                {/* Categories */}
                {!searchQuery.trim() && (
                    <div className="flex flex-wrap justify-center gap-3 mb-8">
                        {categories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-gradient-to-r ' + category.color + ' text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                    }`}
                            >
                                {category.icon} {category.name}
                            </button>
                        ))}
                    </div>
                )}

                {/* Chapters grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {displayChapters.map((chapter, index) => {
                        const progress = getChapterProgress(chapter.id);

                        return (
                            <motion.div
                                key={chapter.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-lg transition-all cursor-pointer interactive"
                                onClick={() => {
                                    setSelectedChapter(chapter);
                                    setCurrentSection(0);
                                }}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-bold text-primary">{chapter.title}</h3>
                                    {chapter.isPremium && (
                                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded-full">
                                            Premium
                                        </span>
                                    )}
                                </div>

                                <p className="text-secondary text-sm mb-4 line-clamp-3">
                                    {chapter.description}
                                </p>

                                <div className="flex items-center gap-4 text-xs text-muted mb-4">
                                    <span>⏱️ {formatEstimatedTime(chapter.estimatedReadTime)}</span>
                                    <span>📖 {chapter.content.length} sections</span>
                                    <span className={`px-2 py-1 rounded-full ${chapter.difficulty === 'beginner' ? 'bg-green-100 text-green-800' :
                                        chapter.difficulty === 'intermediate' ? 'bg-yellow-100 text-yellow-800' :
                                            'bg-red-100 text-red-800'
                                        }`}>
                                        {chapter.difficulty}
                                    </span>
                                </div>

                                {/* Progress bar */}
                                {progress > 0 && (
                                    <div className="mb-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-xs text-secondary">Progress</span>
                                            <span className="text-xs text-secondary">{Math.round(progress)}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5">
                                            <div
                                                className="bg-gradient-to-r from-green-400 to-blue-500 h-1.5 rounded-full transition-all"
                                                style={{ width: `${progress}%` }}
                                            />
                                        </div>
                                    </div>
                                )}

                                <button className="w-full btn-primary text-sm">
                                    {progress > 0 ? 'Continue Reading' : 'Start Chapter'}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>

                {displayChapters.length === 0 && (
                    <div className="text-center py-12">
                        <div className="text-4xl mb-4">🔍</div>
                        <h3 className="text-lg font-semibold text-secondary mb-2">No guides found</h3>
                        <p className="text-muted">
                            {searchQuery.trim()
                                ? 'Try adjusting your search terms'
                                : 'Select a category to view available guides'
                            }
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default InteractiveGuides;