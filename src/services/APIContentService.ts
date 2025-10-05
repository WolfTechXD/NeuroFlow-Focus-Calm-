/**
 * API Service for External Content Integration
 * Handles Freesound, Pixabay, and other external API integrations
 */

import { Sound, SoundCategory } from '../types/sounds';

// API Configuration
interface APIConfig {
    freesound?: {
        apiKey: string;
        baseUrl: string;
    };
    pixabay?: {
        apiKey: string;
        baseUrl: string;
    };
    unsplash?: {
        apiKey: string;
        baseUrl: string;
    };
}

// API Response Types
interface FreesoundResponse {
    count: number;
    results: Array<{
        id: number;
        name: string;
        description: string;
        tags: string[];
        duration: number;
        previews: {
            'preview-hq-mp3': string;
            'preview-lq-mp3': string;
        };
        license: string;
    }>;
}

interface PixabayMusicResponse {
    total: number;
    hits: Array<{
        id: number;
        tags: string;
        duration: number;
        previewURL: string;
    }>;
}

interface UnsplashResponse {
    results: Array<{
        id: string;
        description: string;
        urls: {
            small: string;
            regular: string;
            full: string;
        };
        user: {
            name: string;
        };
    }>;
}

// Cache interface
interface CacheEntry<T> {
    data: T;
    timestamp: number;
    expiresIn: number;
}

class APIContentService {
    private static instance: APIContentService;
    private config: APIConfig;
    private cache: Map<string, CacheEntry<any>> = new Map();
    private rateLimiters: Map<string, { requests: number; resetTime: number }> = new Map();
    
    // Demo mode - simulates API responses
    private isDemoMode: boolean = true;
    
    private constructor() {
        this.config = this.loadConfig();
    }

    public static getInstance(): APIContentService {
        if (!APIContentService.instance) {
            APIContentService.instance = new APIContentService();
        }
        return APIContentService.instance;
    }

    private loadConfig(): APIConfig {
        // In production, these would be loaded from environment variables
        return {
            freesound: {
                apiKey: process.env.VITE_FREESOUND_API_KEY || 'demo',
                baseUrl: 'https://freesound.org/apiv2'
            },
            pixabay: {
                apiKey: process.env.VITE_PIXABAY_API_KEY || 'demo',
                baseUrl: 'https://pixabay.com/api'
            },
            unsplash: {
                apiKey: process.env.VITE_UNSPLASH_API_KEY || 'demo',
                baseUrl: 'https://api.unsplash.com'
            }
        };
    }

    /**
     * Set API configuration
     */
    public setConfig(config: Partial<APIConfig>): void {
        this.config = { ...this.config, ...config };
        this.isDemoMode = false;
    }

    /**
     * Enable/disable demo mode
     */
    public setDemoMode(enabled: boolean): void {
        this.isDemoMode = enabled;
    }

    /**
     * Check if we're in demo mode
     */
    public isInDemoMode(): boolean {
        return this.isDemoMode;
    }

    /**
     * Generic cache management
     */
    private getCachedData<T>(key: string): T | null {
        const entry = this.cache.get(key);
        if (!entry) return null;
        
        if (Date.now() > entry.timestamp + entry.expiresIn) {
            this.cache.delete(key);
            return null;
        }
        
        return entry.data;
    }

    private setCachedData<T>(key: string, data: T, expiresInMs: number = 3600000): void {
        this.cache.set(key, {
            data,
            timestamp: Date.now(),
            expiresIn: expiresInMs
        });
    }

    /**
     * Rate limiting check
     */
    private checkRateLimit(service: string, maxRequests: number = 100, windowMs: number = 3600000): boolean {
        const now = Date.now();
        const limiter = this.rateLimiters.get(service);
        
        if (!limiter || now > limiter.resetTime) {
            this.rateLimiters.set(service, { requests: 1, resetTime: now + windowMs });
            return true;
        }
        
        if (limiter.requests >= maxRequests) {
            return false;
        }
        
        limiter.requests++;
        return true;
    }

    /**
     * Fetch sounds from Freesound API
     */
    public async fetchFreesounds(query: string, category?: string, limit: number = 20): Promise<Sound[]> {
        if (this.isDemoMode) {
            return this.generateDemoSounds('freesound', query, category, limit);
        }

        const cacheKey = `freesound_${query}_${category}_${limit}`;
        const cached = this.getCachedData<Sound[]>(cacheKey);
        if (cached) return cached;

        if (!this.checkRateLimit('freesound')) {
            throw new Error('Freesound API rate limit exceeded');
        }

        try {
            const params = new URLSearchParams({
                token: this.config.freesound!.apiKey,
                query,
                page_size: limit.toString(),
                fields: 'id,name,description,tags,duration,previews,license'
            });

            const response = await fetch(`${this.config.freesound!.baseUrl}/search/text/?${params}`);
            
            if (!response.ok) {
                throw new Error(`Freesound API error: ${response.status}`);
            }

            const data: FreesoundResponse = await response.json();
            const sounds = this.convertFreesoundToSounds(data.results, category);
            
            this.setCachedData(cacheKey, sounds);
            return sounds;
        } catch (error) {
            console.error('Freesound API error:', error);
            return this.generateDemoSounds('freesound', query, category, limit);
        }
    }

    /**
     * Fetch music from Pixabay API
     */
    public async fetchPixabayMusic(query: string, category?: string, limit: number = 20): Promise<Sound[]> {
        if (this.isDemoMode) {
            return this.generateDemoSounds('pixabay', query, category, limit);
        }

        const cacheKey = `pixabay_${query}_${category}_${limit}`;
        const cached = this.getCachedData<Sound[]>(cacheKey);
        if (cached) return cached;

        if (!this.checkRateLimit('pixabay')) {
            throw new Error('Pixabay API rate limit exceeded');
        }

        try {
            const params = new URLSearchParams({
                key: this.config.pixabay!.apiKey,
                q: query,
                audio_type: 'music',
                per_page: limit.toString()
            });

            const response = await fetch(`${this.config.pixabay!.baseUrl}/music/?${params}`);
            
            if (!response.ok) {
                throw new Error(`Pixabay API error: ${response.status}`);
            }

            const data: PixabayMusicResponse = await response.json();
            const sounds = this.convertPixabayToSounds(data.hits, category);
            
            this.setCachedData(cacheKey, sounds);
            return sounds;
        } catch (error) {
            console.error('Pixabay API error:', error);
            return this.generateDemoSounds('pixabay', query, category, limit);
        }
    }

    /**
     * Fetch images from Unsplash API for guidebook content
     */
    public async fetchUnsplashImages(query: string, limit: number = 10): Promise<Array<{id: string, url: string, description: string, author: string}>> {
        if (this.isDemoMode) {
            return this.generateDemoImages(query, limit);
        }

        const cacheKey = `unsplash_${query}_${limit}`;
        const cached = this.getCachedData<any[]>(cacheKey);
        if (cached) return cached;

        if (!this.checkRateLimit('unsplash', 50)) {
            throw new Error('Unsplash API rate limit exceeded');
        }

        try {
            const params = new URLSearchParams({
                query,
                per_page: limit.toString(),
                client_id: this.config.unsplash!.apiKey
            });

            const response = await fetch(`${this.config.unsplash!.baseUrl}/search/photos?${params}`);
            
            if (!response.ok) {
                throw new Error(`Unsplash API error: ${response.status}`);
            }

            const data: UnsplashResponse = await response.json();
            const images = data.results.map(img => ({
                id: img.id,
                url: img.urls.regular,
                description: img.description || query,
                author: img.user.name
            }));
            
            this.setCachedData(cacheKey, images);
            return images;
        } catch (error) {
            console.error('Unsplash API error:', error);
            return this.generateDemoImages(query, limit);
        }
    }

    /**
     * Get expanded sound library combining local and API content
     */
    public async getExpandedSoundLibrary(isPremium: boolean = false): Promise<Sound[]> {
        const localSounds = await import('../utils/soundLibrary');
        const baseSounds = isPremium ? localSounds.soundLibrary : localSounds.getFreeSounds();
        
        if (!isPremium) {
            return baseSounds;
        }

        try {
            // Fetch additional sounds from APIs for premium users
            const [natureSounds, ambientSounds, focusSounds] = await Promise.all([
                this.fetchFreesounds('nature forest ocean rain', 'nature', 15),
                this.fetchFreesounds('ambient drone meditation', 'ambient', 10),
                this.fetchPixabayMusic('focus concentration study', 'focus', 10)
            ]);

            return [
                ...baseSounds,
                ...natureSounds,
                ...ambientSounds,
                ...focusSounds
            ];
        } catch (error) {
            console.error('Failed to fetch expanded sound library:', error);
            return baseSounds;
        }
    }

    /**
     * Search across all sound sources
     */
    public async searchAllSources(query: string, category?: string, limit: number = 30): Promise<Sound[]> {
        try {
            const [freesounds, pixabaySounds] = await Promise.all([
                this.fetchFreesounds(query, category, Math.floor(limit / 2)),
                this.fetchPixabayMusic(query, category, Math.floor(limit / 2))
            ]);

            return [...freesounds, ...pixabaySounds];
        } catch (error) {
            console.error('Search across all sources failed:', error);
            return this.generateDemoSounds('mixed', query, category, limit);
        }
    }

    /**
     * Convert Freesound API responses to our Sound format
     */
    private convertFreesoundToSounds(apiResults: any[], categoryId?: string): Sound[] {
        const soundCategories = require('../utils/soundLibrary').soundCategories;
        const defaultCategory = soundCategories.find((c: SoundCategory) => c.id === (categoryId || 'nature')) || soundCategories[0];

        return apiResults.map(result => ({
            id: `freesound_${result.id}`,
            name: result.name,
            category: defaultCategory,
            description: result.description || 'From Freesound community',
            duration: Math.round(result.duration / 60), // Convert to minutes
            audioUrl: result.previews['preview-hq-mp3'] || result.previews['preview-lq-mp3'],
            isPremium: true,
            tags: result.tags.slice(0, 5), // Limit tags
            volume: 0.6,
            isFavorite: false
        }));
    }

    /**
     * Convert Pixabay API responses to our Sound format
     */
    private convertPixabayToSounds(apiResults: any[], categoryId?: string): Sound[] {
        const soundCategories = require('../utils/soundLibrary').soundCategories;
        const defaultCategory = soundCategories.find((c: SoundCategory) => c.id === (categoryId || 'ambient')) || soundCategories[1];

        return apiResults.map(result => ({
            id: `pixabay_${result.id}`,
            name: `Pixabay Track ${result.id}`,
            category: defaultCategory,
            description: 'Premium music from Pixabay',
            duration: Math.round(result.duration / 60),
            audioUrl: result.previewURL,
            isPremium: true,
            tags: result.tags.split(', ').slice(0, 5),
            volume: 0.7,
            isFavorite: false
        }));
    }

    /**
     * Generate demo sounds for when APIs are unavailable
     */
    private generateDemoSounds(source: string, query: string, category?: string, limit: number = 20): Sound[] {
        const soundCategories = require('../utils/soundLibrary').soundCategories;
        const demoSounds: Sound[] = [];
        
        const demoNames = [
            'Deep Forest Meditation', 'Ocean Wave Therapy', 'Rain on Window', 'Crackling Fireplace',
            'Mountain Stream', 'Night Cricket Symphony', 'Gentle Thunder', 'Wind Through Trees',
            'Cosmic Ambience', 'Underwater Bubbles', 'Arctic Wind', 'Jungle Sounds',
            'White Noise Comfort', 'Brown Noise Focus', 'Pink Noise Study', 'Binaural Beat Alpha',
            'Singing Bowl Healing', 'Temple Bell Peace', 'Tibetan Chant', 'Zen Garden Water'
        ];

        const selectedCategory = soundCategories.find((c: SoundCategory) => c.id === category) || soundCategories[0];
        
        for (let i = 0; i < Math.min(limit, demoNames.length); i++) {
            demoSounds.push({
                id: `${source}_demo_${i + 1}`,
                name: demoNames[i],
                category: selectedCategory,
                description: `Demo sound from ${source} - Premium quality audio`,
                duration: Math.floor(Math.random() * 30) + 10, // 10-40 minutes
                audioUrl: '/audio/demo-sound.mp3', // Placeholder
                isPremium: true,
                tags: [query, selectedCategory.name.toLowerCase(), 'premium', 'demo'],
                volume: 0.5 + Math.random() * 0.3, // 0.5-0.8
                isFavorite: false
            });
        }
        
        return demoSounds;
    }

    /**
     * Generate demo images for Unsplash fallback
     */
    private generateDemoImages(query: string, limit: number = 10): Array<{id: string, url: string, description: string, author: string}> {
        const demoImages = [];
        
        for (let i = 0; i < limit; i++) {
            demoImages.push({
                id: `demo_img_${i + 1}`,
                url: `https://picsum.photos/800/600?random=${i + 1}`,
                description: `Beautiful ${query} image for your content`,
                author: 'Demo Author'
            });
        }
        
        return demoImages;
    }

    /**
     * Clear all cached data
     */
    public clearCache(): void {
        this.cache.clear();
    }

    /**
     * Get cache statistics
     */
    public getCacheStats(): { size: number; entries: string[] } {
        return {
            size: this.cache.size,
            entries: Array.from(this.cache.keys())
        };
    }

    /**
     * Check API health
     */
    public async checkAPIHealth(): Promise<{ [key: string]: boolean }> {
        const health = {
            freesound: false,
            pixabay: false,
            unsplash: false
        };

        if (this.isDemoMode) {
            // In demo mode, all APIs are \"healthy\"
            return { freesound: true, pixabay: true, unsplash: true };
        }

        // Check each API with a simple request
        const checks = await Promise.allSettled([
            fetch(`${this.config.freesound?.baseUrl}/search/text/?token=${this.config.freesound?.apiKey}&query=test&page_size=1`),
            fetch(`${this.config.pixabay?.baseUrl}/music/?key=${this.config.pixabay?.apiKey}&q=test&per_page=1`),
            fetch(`${this.config.unsplash?.baseUrl}/search/photos?query=test&per_page=1&client_id=${this.config.unsplash?.apiKey}`)
        ]);

        health.freesound = checks[0].status === 'fulfilled' && (checks[0].value as Response).ok;
        health.pixabay = checks[1].status === 'fulfilled' && (checks[1].value as Response).ok;
        health.unsplash = checks[2].status === 'fulfilled' && (checks[2].value as Response).ok;

        return health;
    }
}

// Export singleton instance
export const apiContentService = APIContentService.getInstance();