import { Sound, SoundCategory } from '../types/sounds';
import { apiContentService } from '../services/APIContentService';

export const soundCategories: SoundCategory[] = [
    {
        id: 'nature',
        name: 'Nature',
        icon: '🌿',
        color: 'from-green-400 to-emerald-500',
        description: 'Natural sounds from forests, oceans, and weather'
    },
    {
        id: 'ambient',
        name: 'Ambient',
        icon: '🌌',
        color: 'from-purple-400 to-indigo-500',
        description: 'Atmospheric and space-like soundscapes'
    },
    {
        id: 'focus',
        name: 'Focus',
        icon: '🎯',
        color: 'from-blue-400 to-cyan-500',
        description: 'Sounds designed to enhance concentration'
    },
    {
        id: 'meditation',
        name: 'Meditation',
        icon: '🧘',
        color: 'from-pink-400 to-rose-500',
        description: 'Calming sounds for mindfulness and relaxation'
    },
    {
        id: 'urban',
        name: 'Urban',
        icon: '🏙️',
        color: 'from-gray-400 to-slate-500',
        description: 'City sounds and everyday environments'
    },
    {
        id: 'instruments',
        name: 'Instruments',
        icon: '🎼',
        color: 'from-yellow-400 to-orange-500',
        description: 'Musical instruments and harmonious tones'
    }
];

export const soundLibrary: Sound[] = [
    // Nature Sounds - 15 sounds
    {
        id: 'forest-ambiance',
        name: 'Forest Ambiance',
        category: soundCategories[0],
        description: 'Gentle wind through trees with subtle nature sounds',
        audioUrl: '/audio/forest.mp3',
        isPremium: false,
        tags: ['wind', 'trees', 'peaceful'],
        volume: 0.6
    },
    {
        id: 'tropical-rainforest',
        name: 'Tropical Rainforest',
        category: soundCategories[0],
        description: 'Dense jungle sounds with exotic birds and insects',
        audioUrl: '/audio/tropical-forest.mp3',
        isPremium: true,
        tags: ['jungle', 'birds', 'insects', 'tropical'],
        volume: 0.7
    },
    {
        id: 'ocean-waves',
        name: 'Ocean Waves',
        category: soundCategories[0],
        description: 'Rhythmic waves washing against the shore',
        audioUrl: '/audio/ocean.mp3',
        isPremium: false,
        tags: ['waves', 'beach', 'rhythmic'],
        volume: 0.6
    },
    {
        id: 'mountain-stream',
        name: 'Mountain Stream',
        category: soundCategories[0],
        description: 'Gentle flowing water over rocks',
        audioUrl: '/audio/stream.mp3',
        isPremium: true,
        tags: ['water', 'flowing', 'peaceful'],
        volume: 0.5
    },
    {
        id: 'gentle-rain',
        name: 'Gentle Rain',
        category: soundCategories[0],
        description: 'Soft rain with distant thunder',
        audioUrl: '/audio/rain.mp3',
        isPremium: false,
        tags: ['rain', 'thunder', 'cozy'],
        volume: 0.6
    },
    {
        id: 'thunderstorm',
        name: 'Thunderstorm',
        category: soundCategories[0],
        description: 'Intense rain with powerful thunder',
        audioUrl: '/audio/thunderstorm.mp3',
        isPremium: true,
        tags: ['storm', 'intense', 'dramatic'],
        volume: 0.8
    },
    {
        id: 'crackling-fire',
        name: 'Crackling Fire',
        category: soundCategories[0],
        description: 'Warm campfire with gentle crackling',
        audioUrl: '/audio/fire.mp3',
        isPremium: true,
        tags: ['fire', 'warm', 'cozy'],
        volume: 0.5
    },
    {
        id: 'wind-chimes',
        name: 'Wind Chimes',
        category: soundCategories[0],
        description: 'Melodic bamboo wind chimes in gentle breeze',
        audioUrl: '/audio/wind-chimes.mp3',
        isPremium: true,
        tags: ['chimes', 'wind', 'melodic'],
        volume: 0.4
    },
    {
        id: 'night-crickets',
        name: 'Night Crickets',
        category: soundCategories[0],
        description: 'Peaceful cricket symphony on summer night',
        audioUrl: '/audio/crickets.mp3',
        isPremium: false,
        tags: ['crickets', 'night', 'summer'],
        volume: 0.5
    },
    {
        id: 'waterfall',
        name: 'Waterfall',
        category: soundCategories[0],
        description: 'Majestic waterfall cascading over rocks',
        audioUrl: '/audio/waterfall.mp3',
        isPremium: true,
        tags: ['waterfall', 'cascade', 'power'],
        volume: 0.7
    },
    {
        id: 'desert-wind',
        name: 'Desert Wind',
        category: soundCategories[0],
        description: 'Vast desert winds across sandy dunes',
        audioUrl: '/audio/desert-wind.mp3',
        isPremium: true,
        tags: ['desert', 'wind', 'vast'],
        volume: 0.5
    },
    {
        id: 'morning-birds',
        name: 'Morning Birds',
        category: soundCategories[0],
        description: 'Dawn chorus of songbirds greeting the day',
        audioUrl: '/audio/morning-birds.mp3',
        isPremium: false,
        tags: ['birds', 'dawn', 'morning'],
        volume: 0.6
    },
    {
        id: 'autumn-leaves',
        name: 'Autumn Leaves',
        category: soundCategories[0],
        description: 'Rustling leaves falling in autumn breeze',
        audioUrl: '/audio/autumn-leaves.mp3',
        isPremium: true,
        tags: ['leaves', 'autumn', 'rustling'],
        volume: 0.4
    },
    {
        id: 'lake-water',
        name: 'Lake Water',
        category: soundCategories[0],
        description: 'Gentle lapping of water against lake shore',
        audioUrl: '/audio/lake-water.mp3',
        isPremium: true,
        tags: ['lake', 'lapping', 'shore'],
        volume: 0.5
    },
    {
        id: 'snow-falling',
        name: 'Snow Falling',
        category: soundCategories[0],
        description: 'Serene silence of falling snow',
        audioUrl: '/audio/snow-falling.mp3',
        isPremium: true,
        tags: ['snow', 'winter', 'serene'],
        volume: 0.3
    },

    // Ambient Sounds - 12 sounds
    {
        id: 'space-ambience',
        name: 'Space Ambience',
        category: soundCategories[1],
        description: 'Deep space atmosphere with ethereal tones',
        audioUrl: '/audio/space.mp3',
        isPremium: true,
        tags: ['space', 'ethereal', 'cosmic'],
        volume: 0.4
    },
    {
        id: 'underwater',
        name: 'Underwater',
        category: soundCategories[1],
        description: 'Submerged sounds with bubbles and echoes',
        audioUrl: '/audio/underwater.mp3',
        isPremium: true,
        tags: ['underwater', 'bubbles', 'mysterious'],
        volume: 0.5
    },
    {
        id: 'crystal-cave',
        name: 'Crystal Cave',
        category: soundCategories[1],
        description: 'Mystical cave with water drops and echoes',
        audioUrl: '/audio/cave.mp3',
        isPremium: true,
        tags: ['cave', 'echoes', 'mystical'],
        volume: 0.6
    },
    {
        id: 'ethereal-drone',
        name: 'Ethereal Drone',
        category: soundCategories[1],
        description: 'Atmospheric drone for deep meditation',
        audioUrl: '/audio/ethereal-drone.mp3',
        isPremium: true,
        tags: ['drone', 'atmospheric', 'deep'],
        volume: 0.3
    },
    {
        id: 'cosmic-wind',
        name: 'Cosmic Wind',
        category: soundCategories[1],
        description: 'Otherworldly winds from distant planets',
        audioUrl: '/audio/cosmic-wind.mp3',
        isPremium: true,
        tags: ['cosmic', 'otherworldly', 'planets'],
        volume: 0.4
    },
    {
        id: 'void-ambience',
        name: 'Void Ambience',
        category: soundCategories[1],
        description: 'Infinite space with subtle resonance',
        audioUrl: '/audio/void-ambience.mp3',
        isPremium: true,
        tags: ['void', 'infinite', 'resonance'],
        volume: 0.2
    },
    {
        id: 'aurora-sounds',
        name: 'Aurora Sounds',
        category: soundCategories[1],
        description: 'Mystical northern lights audio phenomenon',
        audioUrl: '/audio/aurora-sounds.mp3',
        isPremium: true,
        tags: ['aurora', 'mystical', 'phenomenon'],
        volume: 0.5
    },
    {
        id: 'nebula-whispers',
        name: 'Nebula Whispers',
        category: soundCategories[1],
        description: 'Soft whispers from stellar nurseries',
        audioUrl: '/audio/nebula-whispers.mp3',
        isPremium: true,
        tags: ['nebula', 'whispers', 'stellar'],
        volume: 0.3
    },
    {
        id: 'time-dilation',
        name: 'Time Dilation',
        category: soundCategories[1],
        description: 'Warped time soundscape for deep focus',
        audioUrl: '/audio/time-dilation.mp3',
        isPremium: true,
        tags: ['time', 'warped', 'focus'],
        volume: 0.4
    },
    {
        id: 'quantum-field',
        name: 'Quantum Field',
        category: soundCategories[1],
        description: 'Subatomic particle interactions as sound',
        audioUrl: '/audio/quantum-field.mp3',
        isPremium: true,
        tags: ['quantum', 'subatomic', 'particles'],
        volume: 0.3
    },
    {
        id: 'stellar-winds',
        name: 'Stellar Winds',
        category: soundCategories[1],
        description: 'Solar winds across the cosmos',
        audioUrl: '/audio/stellar-winds.mp3',
        isPremium: true,
        tags: ['stellar', 'solar', 'cosmos'],
        volume: 0.4
    },
    {
        id: 'dark-matter',
        name: 'Dark Matter',
        category: soundCategories[1],
        description: 'Mysterious sounds from invisible universe',
        audioUrl: '/audio/dark-matter.mp3',
        isPremium: true,
        tags: ['dark-matter', 'mysterious', 'invisible'],
        volume: 0.2
    },

    // Focus Sounds - 8 sounds
    {
        id: 'brown-noise',
        name: 'Brown Noise',
        category: soundCategories[2],
        description: 'Deep, low-frequency noise for concentration',
        audioUrl: '/audio/brown-noise.mp3',
        isPremium: false,
        tags: ['noise', 'concentration', 'deep'],
        volume: 0.5
    },
    {
        id: 'white-noise',
        name: 'White Noise',
        category: soundCategories[2],
        description: 'Classic white noise for blocking distractions',
        audioUrl: '/audio/white-noise.mp3',
        isPremium: false,
        tags: ['noise', 'blocking', 'classic'],
        volume: 0.5
    },
    {
        id: 'pink-noise',
        name: 'Pink Noise',
        category: soundCategories[2],
        description: 'Balanced frequency noise for better focus',
        audioUrl: '/audio/pink-noise.mp3',
        isPremium: true,
        tags: ['noise', 'balanced', 'focus'],
        volume: 0.5
    },
    {
        id: 'binaural-beats',
        name: 'Binaural Beats',
        category: soundCategories[2],
        description: 'Alpha waves for enhanced concentration',
        audioUrl: '/audio/binaural.mp3',
        isPremium: true,
        tags: ['binaural', 'alpha', 'brainwaves'],
        volume: 0.4
    },
    {
        id: 'theta-waves',
        name: 'Theta Waves',
        category: soundCategories[2],
        description: 'Deep meditation and creativity enhancement',
        audioUrl: '/audio/theta-waves.mp3',
        isPremium: true,
        tags: ['theta', 'meditation', 'creativity'],
        volume: 0.4
    },
    {
        id: 'gamma-frequency',
        name: 'Gamma Frequency',
        category: soundCategories[2],
        description: 'High-frequency waves for peak focus',
        audioUrl: '/audio/gamma-frequency.mp3',
        isPremium: true,
        tags: ['gamma', 'peak-focus', 'high-frequency'],
        volume: 0.3
    },
    {
        id: 'beta-waves',
        name: 'Beta Waves',
        category: soundCategories[2],
        description: 'Alert consciousness and problem solving',
        audioUrl: '/audio/beta-waves.mp3',
        isPremium: true,
        tags: ['beta', 'alert', 'problem-solving'],
        volume: 0.4
    },
    {
        id: 'delta-sleep',
        name: 'Delta Sleep',
        category: soundCategories[2],
        description: 'Deep sleep induction frequencies',
        audioUrl: '/audio/delta-sleep.mp3',
        isPremium: true,
        tags: ['delta', 'sleep', 'deep'],
        volume: 0.3
    },

    // Meditation Sounds
    {
        id: 'singing-bowls',
        name: 'Singing Bowls',
        category: soundCategories[3],
        description: 'Tibetan singing bowls for deep meditation',
        audioUrl: '/audio/singing-bowls.mp3',
        isPremium: true,
        tags: ['tibetan', 'bowls', 'meditation'],
        volume: 0.6
    },
    {
        id: 'temple-bells',
        name: 'Temple Bells',
        category: soundCategories[3],
        description: 'Gentle temple bells with peaceful ambience',
        audioUrl: '/audio/temple-bells.mp3',
        isPremium: true,
        tags: ['bells', 'temple', 'peaceful'],
        volume: 0.5
    },
    {
        id: 'zen-garden',
        name: 'Zen Garden',
        category: soundCategories[3],
        description: 'Peaceful Japanese garden with water features',
        audioUrl: '/audio/zen-garden.mp3',
        isPremium: true,
        tags: ['zen', 'japanese', 'garden'],
        volume: 0.4
    },

    // Urban Sounds
    {
        id: 'coffee-shop',
        name: 'Coffee Shop',
        category: soundCategories[4],
        description: 'Bustling café with gentle chatter and coffee machines',
        audioUrl: '/audio/coffee-shop.mp3',
        isPremium: true,
        tags: ['café', 'chatter', 'bustling'],
        volume: 0.6
    },
    {
        id: 'library',
        name: 'Library',
        category: soundCategories[4],
        description: 'Quiet library with subtle page turning and whispers',
        audioUrl: '/audio/library.mp3',
        isPremium: true,
        tags: ['quiet', 'library', 'studying'],
        volume: 0.3
    },
    {
        id: 'train-journey',
        name: 'Train Journey',
        category: soundCategories[4],
        description: 'Rhythmic train sounds for relaxation',
        audioUrl: '/audio/train.mp3',
        isPremium: true,
        tags: ['train', 'rhythmic', 'journey'],
        volume: 0.7
    },

    // Instruments
    {
        id: 'piano-meditation',
        name: 'Piano Meditation',
        category: soundCategories[5],
        description: 'Soft piano melodies for relaxation',
        audioUrl: '/audio/piano.mp3',
        isPremium: true,
        tags: ['piano', 'melody', 'soft'],
        volume: 0.5
    },
    {
        id: 'flute-serenity',
        name: 'Flute Serenity',
        category: soundCategories[5],
        description: 'Peaceful flute music with nature sounds',
        audioUrl: '/audio/flute.mp3',
        isPremium: true,
        tags: ['flute', 'peaceful', 'nature'],
        volume: 0.6
    },
    {
        id: 'guitar-ambience',
        name: 'Guitar Ambience',
        category: soundCategories[5],
        description: 'Ambient guitar with reverb and delay',
        audioUrl: '/audio/guitar.mp3',
        isPremium: true,
        tags: ['guitar', 'ambient', 'reverb'],
        volume: 0.5
    }
];

export const getFreeSounds = () => soundLibrary.filter(sound => !sound.isPremium);
export const getPremiumSounds = () => soundLibrary.filter(sound => sound.isPremium);
export const getSoundsByCategory = (categoryId: string) =>
    soundLibrary.filter(sound => sound.category.id === categoryId);
export const getFavoriteSounds = () => soundLibrary.filter(sound => sound.isFavorite);

/**
 * Get expanded sound library with API integration
 */
export const getExpandedSoundLibrary = async (isPremium: boolean = false): Promise<Sound[]> => {
    try {
        return await apiContentService.getExpandedSoundLibrary(isPremium);
    } catch (error) {
        console.error('Failed to get expanded sound library:', error);
        return isPremium ? soundLibrary : getFreeSounds();
    }
};

/**
 * Search sounds across all sources
 */
export const searchSounds = async (query: string, category?: string, isPremium: boolean = false): Promise<Sound[]> => {
    try {
        // Search local sounds first
        const localResults = soundLibrary.filter(sound => {
            const matchesQuery = sound.name.toLowerCase().includes(query.toLowerCase()) ||
                               sound.description.toLowerCase().includes(query.toLowerCase()) ||
                               sound.tags.some(tag => tag.toLowerCase().includes(query.toLowerCase()));
            const matchesCategory = !category || sound.category.id === category;
            const matchesPremium = isPremium || !sound.isPremium;
            
            return matchesQuery && matchesCategory && matchesPremium;
        });

        // If premium user, also search API sources
        if (isPremium && query.length > 2) {
            const apiResults = await apiContentService.searchAllSources(query, category, 20);
            return [...localResults, ...apiResults];
        }

        return localResults;
    } catch (error) {
        console.error('Sound search failed:', error);
        return soundLibrary.filter(sound => 
            sound.name.toLowerCase().includes(query.toLowerCase()) && 
            (!category || sound.category.id === category) &&
            (isPremium || !sound.isPremium)
        );
    }
};

/**
 * Get recommended sounds based on user preferences and usage
 */
export const getRecommendedSounds = async (userPreferences: any, isPremium: boolean = false): Promise<Sound[]> => {
    try {
        // Simple recommendation logic based on category preferences
        const preferredCategories = userPreferences?.favoriteCategories || ['nature', 'ambient'];
        const recommendedSounds: Sound[] = [];

        for (const categoryId of preferredCategories) {
            const categorySounds = await searchSounds('', categoryId, isPremium);
            recommendedSounds.push(...categorySounds.slice(0, 5)); // Top 5 per category
        }

        // Add some popular sounds if we don't have enough
        if (recommendedSounds.length < 10) {
            const popularSounds = soundLibrary
                .filter(sound => isPremium || !sound.isPremium)
                .slice(0, 10 - recommendedSounds.length);
            recommendedSounds.push(...popularSounds);
        }

        return recommendedSounds;
    } catch (error) {
        console.error('Failed to get recommended sounds:', error);
        return soundLibrary.slice(0, 10);
    }
};