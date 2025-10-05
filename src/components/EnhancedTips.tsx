import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UpgradeButton from './ThemedUpgradeButton';
import { useTheme } from '../context/ThemeContext';

interface TipSection {
    scientificBackground: string;
    stepByStepGuide: string[];
    expertTips: string[];
    relatedResources: string[];
}

interface EnhancedTip {
    id: string;
    title: string;
    category: string;
    emoji: string;
    preview: string;
    isPremium: boolean;
    content: TipSection;
}

const enhancedTips: EnhancedTip[] = [
    {
        id: 'focus-techniques',
        title: 'Advanced Focus Techniques for ADHD',
        category: 'Focus',
        emoji: '🎯',
        preview: 'Evidence-based strategies to improve concentration and reduce distractions.',
        isPremium: false,
        content: {
            scientificBackground: 'Research shows that people with ADHD have differences in dopamine and norepinephrine regulation, affecting attention and focus. The prefrontal cortex, responsible for executive function, requires specific strategies to optimize performance.',
            stepByStepGuide: [
                'Set up a distraction-free environment by removing visual and auditory distractions',
                'Use the Pomodoro Technique: 25 minutes focused work, 5-minute break',
                'Create a "focus ritual" - same time, same place, same preparation routine',
                'Practice mindful breathing for 2 minutes before starting tasks',
                'Use body doubling - work alongside others (virtually or in-person)'
            ],
            expertTips: [
                'Match your most challenging tasks to your peak energy hours (usually morning)',
                'Use fidget tools or background music if it helps you concentrate',
                'Break large tasks into smaller, specific action steps',
                'Reward yourself immediately after completing focused work sessions'
            ],
            relatedResources: [
                'Book: "The ADHD Effect on Marriage" by Melissa Orlov',
                'App: Forest - for Pomodoro technique with gamification',
                'Research: "Executive Function and ADHD" - Journal of Clinical Psychology'
            ]
        }
    },
    {
        id: 'emotional-regulation',
        title: 'Emotional Regulation Strategies',
        category: 'Emotional Wellness',
        emoji: '💆‍♀️',
        preview: 'Learn to manage overwhelming emotions and develop emotional resilience.',
        isPremium: true,
        content: {
            scientificBackground: 'ADHD affects the limbic system, making emotional regulation more challenging. The amygdala can become hyperactive while the prefrontal cortex struggles to provide top-down control over emotional responses.',
            stepByStepGuide: [
                'Identify your emotional triggers using a daily mood tracking journal',
                'Practice the STOP technique: Stop, Take a breath, Observe feelings, Proceed mindfully',
                'Use grounding techniques: 5-4-3-2-1 sensory method',
                'Develop a personalized calm-down toolkit (music, textures, scents)',
                'Create emotional check-in routines throughout the day'
            ],
            expertTips: [
                'Label emotions specifically ("frustrated" vs "angry") to activate prefrontal cortex',
                'Use physical movement to regulate emotions - even 30 seconds of stretching helps',
                'Practice self-compassion - treat yourself as you would a good friend',
                'Identify your emotional warning signs before reaching overwhelm'
            ],
            relatedResources: [
                'Book: "The Mindful Way Through Depression" by Williams, Teasdale, Segal, Kabat-Zinn',
                'App: Headspace - guided meditations for emotional regulation',
                'Research: "Emotion Regulation in ADHD" - Clinical Psychology Review'
            ]
        }
    },
    {
        id: 'time-management',
        title: 'Time Management for Neurodivergent Minds',
        category: 'Productivity',
        emoji: '⏰',
        preview: 'Master time perception and create systems that work with your ADHD brain.',
        isPremium: true,
        content: {
            scientificBackground: 'ADHD affects time perception and executive function, making it difficult to estimate time accurately. The brain\'s internal clock runs differently, leading to challenges with planning and punctuality.',
            stepByStepGuide: [
                'Use external time cues: timers, alarms, and visual countdown tools',
                'Time-block your calendar with buffer time between activities',
                'Create transition rituals between tasks to help your brain switch gears',
                'Use the "Swiss Cheese" method for large projects - work on random parts',
                'Implement the 2-minute rule: if something takes less than 2 minutes, do it now'
            ],
            expertTips: [
                'Set alarms 15 minutes before you need to leave anywhere',
                'Use visual schedules and calendars rather than relying on memory',
                'Batch similar tasks together to reduce mental switching costs',
                'Plan for hyperfocus - set "emerge from hyperfocus" alarms'
            ],
            relatedResources: [
                'Book: "Taking Charge of Adult ADHD" by Russell Barkley',
                'App: Toggl - for time tracking and awareness',
                'Research: "Time Perception in ADHD" - Neuropsychology Review'
            ]
        }
    },
    {
        id: 'organization-systems',
        title: 'ADHD-Friendly Organization Systems',
        category: 'Organization',
        emoji: '📋',
        preview: 'Create sustainable organization systems that work with your neurodivergent brain.',
        isPremium: true,
        content: {
            scientificBackground: 'Traditional organization systems often fail for ADHD brains because they require sustained executive function and working memory. Successful systems leverage visual cues, reduce cognitive load, and accommodate variable attention spans.',
            stepByStepGuide: [
                'Use the "one-touch rule" - handle papers and emails only once when possible',
                'Create designated homes for frequently used items',
                'Implement the "daily dump" - one place for items to land when you come home',
                'Use clear storage containers and label everything with pictures and words',
                'Set up automatic systems for bills, subscriptions, and recurring tasks'
            ],
            expertTips: [
                'Start with organizing just one small area completely before moving on',
                'Use the "good enough" principle - 80% organized is better than 0%',
                'Create visual reminders and checklists for multi-step processes',
                'Schedule regular "reset" times for your organized spaces'
            ],
            relatedResources: [
                'Book: "Organizing Solutions for People with ADHD" by Susan Pinsky',
                'App: Todoist - for task organization with natural language processing',
                'Research: "Executive Function and Organization" - Applied Neuropsychology'
            ]
        }
    }
];

interface EnhancedTipsProps {
    onUpgrade?: (plan: 'basic' | 'premium') => void;
}

const EnhancedTips: React.FC<EnhancedTipsProps> = ({ onUpgrade }) => {
    const { getBackgroundStyle, colors, getCardStyle } = useTheme();
    const [expandedTip, setExpandedTip] = useState<string | null>(null);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');

    const categories = ['all', 'Focus', 'Emotional Wellness', 'Productivity', 'Organization'];

    const filteredTips = selectedCategory === 'all'
        ? enhancedTips
        : enhancedTips.filter(tip => tip.category === selectedCategory);

    const toggleTip = (tipId: string) => {
        setExpandedTip(expandedTip === tipId ? null : tipId);
    };

    return (
        <div style={{
            ...getBackgroundStyle(),
            padding: '20px'
        }}>
            <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <h1 style={{
                        color: 'white',
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
                        marginBottom: '10px'
                    }}>
                        📚 Expert Tips & Guides
                    </h1>
                    <p style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        Evidence-based strategies designed specifically for neurodivergent minds
                    </p>
                </motion.div>

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    {categories.map(category => (
                        <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: selectedCategory === category
                                    ? 'white'
                                    : 'rgba(255,255,255,0.2)',
                                color: selectedCategory === category
                                    ? 'rgb(190, 24, 93)'
                                    : 'white',
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s ease'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category === 'all' ? '🌈 All' : category}
                        </motion.button>
                    ))}
                </div>

                {/* Tips Grid */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                    {filteredTips.map((tip, index) => (
                        <motion.div
                            key={tip.id}
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            style={{
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '15px',
                                overflow: 'hidden',
                                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)'
                            }}
                        >
                            {/* Tip Header */}
                            <div
                                onClick={() => toggleTip(tip.id)}
                                style={{
                                    padding: '20px',
                                    cursor: 'pointer',
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    background: tip.isPremium
                                        ? 'linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)'
                                        : 'linear-gradient(135deg, rgb(252, 165, 165) 0%, rgb(147, 197, 253) 100%)',
                                    color: 'white'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                                    <span style={{ fontSize: '2rem' }}>{tip.emoji}</span>
                                    <div>
                                        <h3 style={{ margin: 0, fontSize: '1.3rem', fontWeight: 'bold' }}>
                                            {tip.title}
                                            {tip.isPremium && <span style={{ marginLeft: '8px' }}>💎</span>}
                                        </h3>
                                        <p style={{ margin: '5px 0 0 0', opacity: 0.9, fontSize: '0.9rem' }}>
                                            {tip.preview}
                                        </p>
                                    </div>
                                </div>
                                <motion.div
                                    animate={{ rotate: expandedTip === tip.id ? 180 : 0 }}
                                    style={{ fontSize: '1.5rem' }}
                                >
                                    ⬇️
                                </motion.div>
                            </div>

                            {/* Expanded Content */}
                            <AnimatePresence>
                                {expandedTip === tip.id && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: 'auto', opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        style={{ overflow: 'hidden' }}
                                    >
                                        {tip.isPremium ? (
                                            <div style={{
                                                padding: '30px',
                                                textAlign: 'center',
                                                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)'
                                            }}>
                                                <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🔒</div>
                                                <h3 style={{ color: 'rgb(190, 24, 93)', marginBottom: '15px' }}>
                                                    Premium Content
                                                </h3>
                                                <p style={{ color: 'rgb(117, 117, 117)', marginBottom: '20px' }}>
                                                    This comprehensive guide includes detailed scientific background,
                                                    step-by-step instructions, expert tips, and curated resources.

                                                    🌱 Basic Plan ($4.99): Essential ADHD tips and strategies
                                                    ⭐ Premium Plan ($9.99): 4 comprehensive expert guides with detailed research
                                                </p>
                                                <UpgradeButton variant="primary" context="tips" onUpgrade={onUpgrade} />
                                            </div>
                                        ) : (
                                            <div style={{ padding: '30px' }}>
                                                {/* Scientific Background */}
                                                <div style={{ marginBottom: '25px' }}>
                                                    <h4 style={{
                                                        color: 'rgb(190, 24, 93)',
                                                        marginBottom: '10px',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        🧠 Scientific Background
                                                    </h4>
                                                    <p style={{
                                                        lineHeight: '1.6',
                                                        color: 'rgb(64, 64, 64)',
                                                        background: 'rgba(236, 72, 153, 0.05)',
                                                        padding: '15px',
                                                        borderRadius: '8px',
                                                        borderLeft: '4px solid rgb(236, 72, 153)'
                                                    }}>
                                                        {tip.content.scientificBackground}
                                                    </p>
                                                </div>

                                                {/* Step-by-Step Guide */}
                                                <div style={{ marginBottom: '25px' }}>
                                                    <h4 style={{
                                                        color: 'rgb(190, 24, 93)',
                                                        marginBottom: '15px',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        📋 Step-by-Step Guide
                                                    </h4>
                                                    <ol style={{ paddingLeft: '20px', lineHeight: '1.8' }}>
                                                        {tip.content.stepByStepGuide.map((step, idx) => (
                                                            <li key={idx} style={{
                                                                marginBottom: '8px',
                                                                color: 'rgb(64, 64, 64)'
                                                            }}>
                                                                {step}
                                                            </li>
                                                        ))}
                                                    </ol>
                                                </div>

                                                {/* Expert Tips */}
                                                <div style={{ marginBottom: '25px' }}>
                                                    <h4 style={{
                                                        color: 'rgb(190, 24, 93)',
                                                        marginBottom: '15px',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        💡 Expert Tips
                                                    </h4>
                                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                                        {tip.content.expertTips.map((expertTip, idx) => (
                                                            <li key={idx} style={{
                                                                marginBottom: '10px',
                                                                padding: '10px',
                                                                background: 'rgba(244, 114, 182, 0.1)',
                                                                borderRadius: '8px',
                                                                color: 'rgb(64, 64, 64)',
                                                                display: 'flex',
                                                                alignItems: 'flex-start',
                                                                gap: '10px'
                                                            }}>
                                                                <span style={{ color: 'rgb(236, 72, 153)', fontWeight: 'bold' }}>💎</span>
                                                                {expertTip}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>

                                                {/* Related Resources */}
                                                <div>
                                                    <h4 style={{
                                                        color: 'rgb(190, 24, 93)',
                                                        marginBottom: '15px',
                                                        fontSize: '1.1rem',
                                                        fontWeight: 'bold'
                                                    }}>
                                                        📚 Related Resources
                                                    </h4>
                                                    <ul style={{ listStyle: 'none', padding: 0 }}>
                                                        {tip.content.relatedResources.map((resource, idx) => (
                                                            <li key={idx} style={{
                                                                marginBottom: '8px',
                                                                color: 'rgb(64, 64, 64)',
                                                                display: 'flex',
                                                                alignItems: 'center',
                                                                gap: '10px'
                                                            }}>
                                                                <span style={{ color: 'rgb(236, 72, 153)' }}>🔗</span>
                                                                {resource}
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    ))}
                </div>

                {/* Upgrade CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        marginTop: '40px',
                        padding: '30px',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '15px',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                >
                    <h3 style={{ color: 'rgb(190, 24, 93)', marginBottom: '15px' }}>
                        🚀 Get Full Access to Expert Guidance
                    </h3>
                    <p style={{ color: 'rgb(117, 117, 117)', marginBottom: '20px' }}>
                        🌱 Basic Plan ($4.99): Essential ADHD tips and daily strategies
                        ⭐ Premium Plan ($9.99): 4 comprehensive expert guides with scientific backing, detailed worksheets,
                        and expert video content designed specifically for neurodivergent minds.
                    </p>
                    <UpgradeButton variant="primary" context="tips-page" onUpgrade={onUpgrade} />
                </motion.div>
            </div>
        </div>
    );
};

export default EnhancedTips;