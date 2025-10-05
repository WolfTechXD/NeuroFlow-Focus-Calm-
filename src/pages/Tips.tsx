import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState } from '../types/index';
import { Tip } from '../types/tips';
import { lifeTips, tipCategories, getFreeTips, getPremiumTips } from '../utils/tipsLibrary';
import TTSPlayer from '../components/TTSPlayer';

// Simple icon components
const Heart = () => <span>❤️</span>;
const HeartFilled = () => <span>💖</span>;
const Clock = () => <span>🕐</span>;
const ChevronDown = () => <span>⬇️</span>;
const ChevronUp = () => <span>⬆️</span>;
const CheckCircle = () => <span>✅</span>;

interface TipsProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const Tips: React.FC<TipsProps> = ({ appState, onUpdateState }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [searchQuery, setSearchQuery] = useState('');
    const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
    const [helpfulTips, setHelpfulTips] = useState<Set<string>>(new Set());

    const availableTips = appState.user.subscription.isPremium
        ? lifeTips
        : getFreeTips();

    const filteredTips = availableTips.filter(tip => {
        const matchesCategory = selectedCategory === 'all' || tip.category.id === selectedCategory;
        const matchesSearch = tip.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tip.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
            tip.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));

        return matchesCategory && matchesSearch;
    });

    const toggleTipExpansion = (tipId: string) => {
        setExpandedTips(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tipId)) {
                newSet.delete(tipId);
            } else {
                newSet.add(tipId);
            }
            return newSet;
        });
    };

    const markAsHelpful = (tipId: string) => {
        setHelpfulTips(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tipId)) {
                newSet.delete(tipId);
            } else {
                newSet.add(tipId);
            }
            return newSet;
        });
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'bg-blue-100 text-blue-800';
            case 'intermediate': return 'bg-pink-100 text-pink-800';
            case 'advanced': return 'bg-blue-200 text-blue-900';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getDifficultyIcon = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return '🌱';
            case 'intermediate': return '🌿';
            case 'advanced': return '🌳';
            default: return '📖';
        }
    };

    const formatTipContent = (content: string) => {
        const lines = content.split('\n').filter(line => line.trim());
        return lines.map((line, index) => {
            if (/^[\d\-\*•]/.test(line.trim()) || line.includes(':')) {
                const parts = line.split(':');
                if (parts.length > 1) {
                    return (
                        <p key={index} className="mb-2">
                            <strong className="text-purple-700">{parts[0]}:</strong>
                            <span className="ml-1">{parts.slice(1).join(':')}</span>
                        </p>
                    );
                }
            }
            return <p key={index} className="mb-2">{line}</p>;
        });
    };

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        💡 Evidence-Based Life Hacks
                    </h1>
                    <p className="text-secondary">
                        {appState.user.subscription.isPremium
                            ? 'Complete guide with research-backed strategies and premium features'
                            : `${getFreeTips().length} essential tips available - unlock ${getPremiumTips().length} more with premium!`
                        }
                    </p>
                </motion.div>

                {/* Demo Banner */}
                {!appState.user.subscription.isPremium && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card bg-gradient-to-r from-purple-400 to-pink-500 text-white mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-1">🚀 Unlock Advanced Strategies</h3>
                                <p className="text-sm opacity-90">
                                    Get access to {getPremiumTips().length} evidence-based tips, interactive guides, premium TTS voices, and comprehensive ADHD/Autism strategies!
                                </p>
                            </div>
                            <button className="btn-secondary bg-white text-purple-600 hover:bg-gray-100">
                                Upgrade Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="card mb-6">
                    <div className="flex flex-wrap items-center gap-4">
                        {/* Search */}
                        <div className="flex-1 min-w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full px-4 py-2 border border-themed rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                placeholder="Search evidence-based tips..."
                            />
                        </div>
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2 mt-4">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === 'all'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            🌈 All Categories
                        </button>
                        {tipCategories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'
                                    }`}
                            >
                                {category.icon} {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Tips Grid */}
                <div className="space-y-6">
                    {filteredTips.map((tip, index) => {
                        const isExpanded = expandedTips.has(tip.id);
                        const isHelpful = helpfulTips.has(tip.id);

                        return (
                            <motion.div
                                key={tip.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.1 }}
                                className="card hover:shadow-xl transition-all duration-300"
                            >
                                {/* Tip Header */}
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-2">
                                            <span className="text-2xl">{tip.category.icon}</span>
                                            <div>
                                                <h3 className="text-xl font-bold text-primary">{tip.title}</h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(tip.difficulty)}`}>
                                                        {getDifficultyIcon(tip.difficulty)} {tip.difficulty}
                                                    </span>
                                                    <span className="text-sm text-gray-500 flex items-center gap-1">
                                                        <Clock /> {tip.timeToRead} min read
                                                    </span>
                                                    {tip.isPremium && (
                                                        <span className="px-2 py-1 bg-gradient-to-r from-gold-400 to-yellow-500 text-white rounded-full text-xs font-medium">
                                                            ⭐ Premium
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => toggleTipExpansion(tip.id)}
                                        className="p-2 rounded-full hover:bg-gray-100 transition-colors"
                                    >
                                        {isExpanded ? <ChevronUp /> : <ChevronDown />}
                                    </button>
                                </div>

                                {/* Tip Content */}
                                <div className="text-gray-700 mb-4">
                                    {isExpanded ? (
                                        <div>
                                            {formatTipContent(tip.content)}
                                        </div>
                                    ) : (
                                        <p>{tip.content.slice(0, 200)}...</p>
                                    )}
                                </div>

                                {/* TTS Player */}
                                {isExpanded && tip.hasAudio && (
                                    <div className="mb-4">
                                        <TTSPlayer
                                            text={`${tip.title}. ${tip.content}`}
                                            title="Listen to this tip"
                                            isPremium={appState.user.subscription.isPremium}
                                            showSettings={false}
                                            className="bg-blue-50"
                                        />
                                    </div>
                                )}

                                {/* Tags */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {tip.tags.map(tag => (
                                        <span
                                            key={tag}
                                            className="px-2 py-1 bg-gray-100 text-gray-600 rounded-full text-xs"
                                        >
                                            #{tag}
                                        </span>
                                    ))}
                                </div>

                                {/* Actions */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <button
                                        onClick={() => markAsHelpful(tip.id)}
                                        className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${isHelpful
                                            ? 'bg-pink-100 text-pink-600'
                                            : 'bg-gray-100 text-gray-600 hover:bg-pink-50 hover:text-pink-600'
                                            }`}
                                    >
                                        {isHelpful ? <HeartFilled /> : <Heart />}
                                        {isHelpful ? 'Helpful!' : 'Mark as helpful'}
                                    </button>

                                    <div className="text-sm text-gray-500">
                                        {tip.helpful || 0} people found this helpful
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* No Results */}
                {filteredTips.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-16"
                    >
                        <div className="text-6xl mb-4">🔍</div>
                        <h3 className="text-xl font-semibold text-gray-600 mb-2">No tips found</h3>
                        <p className="text-gray-500">Try adjusting your search or category filter</p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Tips;