import { ZenActivity } from '../types/index';

export const zenActivities: ZenActivity[] = [
    // Breathing Activities
    {
        id: 'box-breathing',
        name: '4-4-4-4 Box Breathing',
        description: 'Calm your nervous system with this balanced breathing technique',
        type: 'breathing',
        duration: 5,
        instructions: [
            'Breathe in for 4 counts',
            'Hold your breath for 4 counts',
            'Breathe out for 4 counts',
            'Hold empty for 4 counts',
            'Repeat this cycle'
        ]
    },
    {
        id: '4-7-8-breathing',
        name: '4-7-8 Breathing',
        description: 'Perfect for reducing anxiety and promoting sleep',
        type: 'breathing',
        duration: 5,
        instructions: [
            'Breathe in for 4 counts',
            'Hold your breath for 7 counts',
            'Breathe out slowly for 8 counts',
            'This activates your relaxation response'
        ]
    },
    {
        id: 'coherent-breathing',
        name: '6-2-6-2 Coherent Breathing',
        description: 'Synchronize your heart and mind for optimal focus',
        type: 'breathing',
        duration: 10,
        instructions: [
            'Breathe in for 6 counts',
            'Brief pause for 2 counts',
            'Breathe out for 6 counts',
            'Brief pause for 2 counts',
            'Focus on the rhythm'
        ]
    },

    // Meditation Activities
    {
        id: 'mindful-awareness',
        name: 'Mindful Awareness',
        description: 'Gentle mindfulness practice for present moment awareness',
        type: 'meditation',
        duration: 10,
        instructions: [
            'Sit comfortably with eyes closed',
            'Notice your breathing naturally',
            'When thoughts arise, gently return to breath',
            'Be kind to yourself throughout'
        ]
    },
    {
        id: 'body-scan',
        name: 'Progressive Body Scan',
        description: 'Release tension by mindfully scanning your body',
        type: 'meditation',
        duration: 15,
        instructions: [
            'Start with your toes and move upward',
            'Notice each part of your body',
            'Release any tension you find',
            'End at the top of your head'
        ]
    },
    {
        id: 'loving-kindness',
        name: 'Loving Kindness Meditation',
        description: 'Cultivate compassion for yourself and others',
        type: 'meditation',
        duration: 12,
        instructions: [
            'Send loving wishes to yourself first',
            'Extend kindness to loved ones',
            'Include neutral people',
            'Finally, include difficult people'
        ]
    },

    // Sound-based Activities
    {
        id: 'forest-ambience',
        name: 'Forest Ambience',
        description: 'Immerse yourself in calming nature sounds',
        type: 'sounds',
        duration: 20,
        audioUrl: 'forest-sounds',
        instructions: [
            'Close your eyes and listen',
            'Imagine yourself in a peaceful forest',
            'Let the sounds wash over you',
            'Breathe naturally and deeply'
        ]
    },
    {
        id: 'rain-meditation',
        name: 'Rain Meditation',
        description: 'Let gentle rain sounds calm your mind',
        type: 'sounds',
        duration: 15,
        audioUrl: 'rain-sounds',
        instructions: [
            'Listen to the rhythm of the rain',
            'Feel the freshness it brings',
            'Let worries wash away',
            'Stay present with the sounds'
        ]
    },
    {
        id: 'ocean-waves',
        name: 'Ocean Waves',
        description: 'Find peace with rhythmic wave sounds',
        type: 'sounds',
        duration: 25,
        audioUrl: 'ocean-sounds',
        instructions: [
            'Follow the natural rhythm of waves',
            'Breathe in with the incoming wave',
            'Breathe out as the wave recedes',
            'Feel the ocean\'s endless calm'
        ]
    },

    // Mindfulness Activities
    {
        id: '5-4-3-2-1-grounding',
        name: '5-4-3-2-1 Grounding',
        description: 'Ground yourself using your five senses',
        type: 'mindfulness',
        duration: 5,
        instructions: [
            'Notice 5 things you can see',
            'Notice 4 things you can touch',
            'Notice 3 things you can hear',
            'Notice 2 things you can smell',
            'Notice 1 thing you can taste'
        ]
    },
    {
        id: 'gratitude-moment',
        name: 'Gratitude Moment',
        description: 'Shift your mindset with appreciation practice',
        type: 'mindfulness',
        duration: 7,
        instructions: [
            'Think of 3 things you\'re grateful for today',
            'Feel the appreciation in your body',
            'Notice how gratitude affects your mood',
            'Carry this feeling with you'
        ]
    },
    {
        id: 'mindful-breathing',
        name: 'Mindful Breathing',
        description: 'Simple awareness of your natural breath',
        type: 'mindfulness',
        duration: 8,
        instructions: [
            'Breathe naturally, don\'t control it',
            'Simply observe each breath',
            'Notice the pause between breaths',
            'Return when your mind wanders'
        ]
    }
];

export const getZenActivitiesByType = (type: 'breathing' | 'meditation' | 'sounds' | 'mindfulness'): ZenActivity[] => {
    return zenActivities.filter(activity => activity.type === type);
};

export const getZenActivityById = (id: string): ZenActivity | undefined => {
    return zenActivities.find(activity => activity.id === id);
};

export const getRandomZenActivity = (type?: 'breathing' | 'meditation' | 'sounds' | 'mindfulness'): ZenActivity => {
    const activities = type ? getZenActivitiesByType(type) : zenActivities;
    return activities[Math.floor(Math.random() * activities.length)];
};