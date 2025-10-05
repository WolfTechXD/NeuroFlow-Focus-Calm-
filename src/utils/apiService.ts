// API Service for external audio, image, and TTS resources
import axios from 'axios';

// Environment variables should be set in production
const FREESOUND_TOKEN = process.env.REACT_APP_FREESOUND_TOKEN || 'demo-token';
const PIXABAY_KEY = process.env.REACT_APP_PIXABAY_KEY || 'demo-key';
const UNSPLASH_KEY = process.env.REACT_APP_UNSPLASH_KEY || 'demo-key';
const PEXELS_KEY = process.env.REACT_APP_PEXELS_KEY || 'demo-key';

export interface ApiSound {
    id: string | number;
    name: string;
    preview: string;
    description?: string;
    tags?: string[];
    duration?: number;
    license?: string;
}

export interface ApiImage {
    id: string | number;
    url: string;
    thumbnail: string;
    alt?: string;
    author?: string;
    license?: string;
}

// Freesound API Service
export const freesoundService = {
    async searchSounds(query: string, pageSize: number = 20): Promise<ApiSound[]> {
        try {
            // For demo purposes, return mock data instead of making real API calls
            return generateMockSounds(query, pageSize);
        } catch (error) {
            console.error('Freesound API error:', error);
            return generateMockSounds(query, pageSize);
        }
    }
};

// Pixabay API Service
export const pixabayService = {
    async searchMusic(query: string, perPage: number = 20): Promise<ApiSound[]> {
        try {
            // Mock data for demo
            return generateMockMusic(query, perPage);
        } catch (error) {
            console.error('Pixabay Music API error:', error);
            return generateMockMusic(query, perPage);
        }
    },

    async searchImages(query: string, perPage: number = 30): Promise<ApiImage[]> {
        try {
            // Mock data for demo
            return generateMockImages(query, perPage);
        } catch (error) {
            console.error('Pixabay Image API error:', error);
            return generateMockImages(query, perPage);
        }
    }
};

// Unsplash API Service
export const unsplashService = {
    async searchPhotos(query: string, perPage: number = 30): Promise<ApiImage[]> {
        try {
            // Mock data for demo
            return generateMockUnsplashImages(query, perPage);
        } catch (error) {
            console.error('Unsplash API error:', error);
            return generateMockUnsplashImages(query, perPage);
        }
    },

    async getRandomPhoto(query: string): Promise<ApiImage | null> {
        try {
            const photos = await this.searchPhotos(query, 1);
            return photos[0] || null;
        } catch (error) {
            console.error('Unsplash random photo error:', error);
            return null;
        }
    }
};

// Pexels API Service
export const pexelsService = {
    async searchPhotos(query: string, perPage: number = 30): Promise<ApiImage[]> {
        try {
            // Mock data for demo
            return generateMockPexelsImages(query, perPage);
        } catch (error) {
            console.error('Pexels API error:', error);
            return generateMockPexelsImages(query, perPage);
        }
    }
};

// Mock data generators for demo purposes
function generateMockSounds(query: string, count: number): ApiSound[] {
    const soundTypes = [
        { name: 'Forest Ambience', tags: ['forest', 'nature', 'birds'] },
        { name: 'Ocean Waves', tags: ['ocean', 'waves', 'beach'] },
        { name: 'Rainfall', tags: ['rain', 'storm', 'weather'] },
        { name: 'Thunder', tags: ['thunder', 'storm', 'dramatic'] },
        { name: 'Wind', tags: ['wind', 'nature', 'calm'] },
        { name: 'River Stream', tags: ['water', 'stream', 'peaceful'] },
        { name: 'Fireplace', tags: ['fire', 'crackling', 'cozy'] },
        { name: 'Birds Chirping', tags: ['birds', 'morning', 'nature'] },
        { name: 'Cafe Ambience', tags: ['cafe', 'chatter', 'urban'] },
        { name: 'Library Quiet', tags: ['library', 'quiet', 'studying'] }
    ];

    return Array.from({ length: Math.min(count, soundTypes.length) }, (_, i) => ({
        id: `mock-sound-${i}`,
        name: `${soundTypes[i].name} (${query})`,
        preview: `/api/mock-audio/${query}-${i}.mp3`,
        description: `High-quality ${soundTypes[i].name.toLowerCase()} sound for relaxation`,
        tags: soundTypes[i].tags,
        duration: 120 + Math.random() * 480, // 2-10 minutes
        license: 'CC0'
    }));
}

function generateMockMusic(query: string, count: number): ApiSound[] {
    const musicTypes = [
        { name: 'Ambient Piano', tags: ['piano', 'ambient', 'peaceful'] },
        { name: 'Meditation Bells', tags: ['bells', 'meditation', 'zen'] },
        { name: 'Nature Soundscape', tags: ['nature', 'ambient', 'relaxing'] },
        { name: 'Binaural Beats', tags: ['binaural', 'focus', 'brainwaves'] },
        { name: 'Flute Melody', tags: ['flute', 'melody', 'serene'] }
    ];

    return Array.from({ length: Math.min(count, musicTypes.length) }, (_, i) => ({
        id: `mock-music-${i}`,
        name: `${musicTypes[i].name} (${query})`,
        preview: `/api/mock-music/${query}-${i}.mp3`,
        description: `Relaxing ${musicTypes[i].name.toLowerCase()} for meditation and focus`,
        tags: musicTypes[i].tags,
        duration: 300 + Math.random() * 600, // 5-15 minutes
        license: 'Royalty Free'
    }));
}

function generateMockImages(query: string, count: number): ApiImage[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `mock-pixabay-${i}`,
        url: `https://images.unsplash.com/photo-151234567${i}?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-151234567${i}?w=300&q=80`,
        alt: `${query} image ${i + 1}`,
        author: 'Pixabay User',
        license: 'Pixabay License'
    }));
}

function generateMockUnsplashImages(query: string, count: number): ApiImage[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `mock-unsplash-${i}`,
        url: `https://images.unsplash.com/photo-160234567${i}?w=800&q=80`,
        thumbnail: `https://images.unsplash.com/photo-160234567${i}?w=300&q=80`,
        alt: `${query} photo ${i + 1}`,
        author: 'Unsplash Photographer',
        license: 'Unsplash License'
    }));
}

function generateMockPexelsImages(query: string, count: number): ApiImage[] {
    return Array.from({ length: count }, (_, i) => ({
        id: `mock-pexels-${i}`,
        url: `https://images.pexels.com/photos/123456${i}/pexels-photo-123456${i}.jpeg?w=800&q=80`,
        thumbnail: `https://images.pexels.com/photos/123456${i}/pexels-photo-123456${i}.jpeg?w=300&q=80`,
        alt: `${query} image ${i + 1}`,
        author: 'Pexels Photographer',
        license: 'Pexels License'
    }));
}

// Enhanced TTS Service with multiple providers
export interface TTSVoice {
    id: string;
    name: string;
    language: string;
    provider: 'browser' | 'google' | 'azure' | 'piper';
    isPremium: boolean;
    quality: 'standard' | 'premium' | 'neural';
}

export const ttsService = {
    // Get available voices from browser and premium providers
    getAvailableVoices(): TTSVoice[] {
        const browserVoices = speechSynthesis.getVoices().map(voice => ({
            id: voice.name,
            name: voice.name,
            language: voice.lang,
            provider: 'browser' as const,
            isPremium: false,
            quality: 'standard' as const
        }));

        // Add premium voices (would be available with API keys)
        const premiumVoices: TTSVoice[] = [
            {
                id: 'google-neural-en-US-Studio-O',
                name: 'Google Neural Studio (Premium)',
                language: 'en-US',
                provider: 'google',
                isPremium: true,
                quality: 'neural'
            },
            {
                id: 'azure-neural-en-US-JennyNeural',
                name: 'Azure Jenny Neural (Premium)',
                language: 'en-US',
                provider: 'azure',
                isPremium: true,
                quality: 'neural'
            },
            {
                id: 'piper-en-US-lessac-medium',
                name: 'Piper Lessac (Offline)',
                language: 'en-US',
                provider: 'piper',
                isPremium: false,
                quality: 'premium'
            }
        ];

        return [...browserVoices.slice(0, 5), ...premiumVoices];
    },

    // Speak text using selected voice
    async speak(text: string, settings: any): Promise<void> {
        if (settings.voice.provider === 'browser') {
            return this.speakBrowser(text, settings);
        } else if (settings.voice.provider === 'google') {
            return this.speakGoogle(text, settings);
        } else if (settings.voice.provider === 'azure') {
            return this.speakAzure(text, settings);
        } else if (settings.voice.provider === 'piper') {
            return this.speakPiper(text, settings);
        }
    },

    // Browser Speech Synthesis
    speakBrowser(text: string, settings: any): Promise<void> {
        return new Promise((resolve, reject) => {
            if (!('speechSynthesis' in window)) {
                reject(new Error('Speech synthesis not supported'));
                return;
            }

            const utterance = new SpeechSynthesisUtterance(text);
            const voices = speechSynthesis.getVoices();
            const voice = voices.find(v => v.name === settings.voice.id);

            if (voice) utterance.voice = voice;
            utterance.rate = settings.rate;
            utterance.pitch = settings.pitch;
            utterance.volume = settings.volume;

            utterance.onend = () => resolve();
            utterance.onerror = (error) => reject(error);

            speechSynthesis.speak(utterance);
        });
    },

    // Google Cloud TTS (would require API key)
    async speakGoogle(text: string, settings: any): Promise<void> {
        // Mock implementation - in production would call Google Cloud TTS API
        console.log('Google TTS would speak:', text);
        return new Promise(resolve => setTimeout(resolve, 1000));
    },

    // Azure TTS (would require API key)
    async speakAzure(text: string, settings: any): Promise<void> {
        // Mock implementation - in production would call Azure TTS API  
        console.log('Azure TTS would speak:', text);
        return new Promise(resolve => setTimeout(resolve, 1000));
    },

    // Piper TTS (local/offline)
    async speakPiper(text: string, settings: any): Promise<void> {
        // Mock implementation - in production would use Piper TTS locally
        console.log('Piper TTS would speak:', text);
        return new Promise(resolve => setTimeout(resolve, 1000));
    }
};