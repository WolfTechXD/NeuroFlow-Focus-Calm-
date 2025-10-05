import { TTSVoice, TTSSettings } from '../types/sounds';

// Enhanced voice detection and availability checker
export class VoiceAvailabilityChecker {
    private static instance: VoiceAvailabilityChecker;
    private checkedVoices: Map<string, boolean> = new Map();
    private loadingPromise: Promise<void> | null = null;

    private constructor() {}

    public static getInstance(): VoiceAvailabilityChecker {
        if (!VoiceAvailabilityChecker.instance) {
            VoiceAvailabilityChecker.instance = new VoiceAvailabilityChecker();
        }
        return VoiceAvailabilityChecker.instance;
    }

    public async ensureVoicesLoaded(): Promise<void> {
        if (this.loadingPromise) {
            return this.loadingPromise;
        }

        this.loadingPromise = new Promise<void>((resolve) => {
            const synthesis = window.speechSynthesis;
            
            // Check if voices are already loaded
            if (synthesis.getVoices().length > 0) {
                resolve();
                return;
            }

            // Wait for voices to load
            const onVoicesChanged = () => {
                if (synthesis.getVoices().length > 0) {
                    synthesis.removeEventListener('voiceschanged', onVoicesChanged);
                    resolve();
                }
            };

            synthesis.addEventListener('voiceschanged', onVoicesChanged);
            
            // Fallback timeout
            setTimeout(() => {
                synthesis.removeEventListener('voiceschanged', onVoicesChanged);
                resolve();
            }, 3000);
        });

        return this.loadingPromise;
    }

    public async testVoiceAvailability(voice: TTSVoice): Promise<boolean> {
        const cacheKey = `${voice.id}_${voice.voiceURI}`;
        
        if (this.checkedVoices.has(cacheKey)) {
            return this.checkedVoices.get(cacheKey)!;
        }

        try {
            await this.ensureVoicesLoaded();
            
            const synthesis = window.speechSynthesis;
            const systemVoices = synthesis.getVoices();
            
            // Check if voice exists in system voices
            const systemVoice = systemVoices.find(v => 
                v.voiceURI === voice.voiceURI || v.name === voice.name
            );
            
            if (systemVoice && !voice.isPremium) {
                this.checkedVoices.set(cacheKey, true);
                return true;
            }
            
            // For premium voices, check if API is available
            if (voice.isPremium) {
                const isAvailable = await this.checkPremiumVoiceAPI(voice);
                this.checkedVoices.set(cacheKey, isAvailable);
                return isAvailable;
            }
            
            this.checkedVoices.set(cacheKey, false);
            return false;
        } catch (error) {
            console.error('Voice availability test failed:', error);
            this.checkedVoices.set(cacheKey, false);
            return false;
        }
    }

    private async checkPremiumVoiceAPI(voice: TTSVoice): Promise<boolean> {
        // In a real implementation, this would check API availability
        // For now, simulate premium voice availability based on voice type
        return voice.name.includes('Premium') || voice.name.includes('Neural');
    }
}

export class TextToSpeechService {
    private synthesis: SpeechSynthesis;
    private voices: SpeechSynthesisVoice[] = [];
    private isInitialized = false;
    private voiceChecker: VoiceAvailabilityChecker;
    private currentUtterance: SpeechSynthesisUtterance | null = null;
    private fallbackVoices: TTSVoice[];

    constructor() {
        this.synthesis = window.speechSynthesis;
        this.voiceChecker = VoiceAvailabilityChecker.getInstance();
        this.fallbackVoices = this.createFallbackVoices();
        this.loadVoices();
    }

    private createFallbackVoices(): TTSVoice[] {
        return [
            {
                id: 'fallback-default',
                name: 'System Default',
                language: 'en-US',
                gender: 'neutral',
                isPremium: false,
                voiceURI: 'default',
                isAvailable: true
            },
            {
                id: 'fallback-female',
                name: 'System Female',
                language: 'en-US',
                gender: 'female',
                isPremium: false,
                voiceURI: 'female',
                isAvailable: true
            }
        ];
    }

    private async loadVoices(): Promise<void> {
        try {
            await this.voiceChecker.ensureVoicesLoaded();
            this.voices = this.synthesis.getVoices();
            this.isInitialized = true;
        } catch (error) {
            console.error('Failed to load voices:', error);
            this.isInitialized = false;
        }
    }

    async getAvailableVoices(): Promise<TTSVoice[]> {
        await this.loadVoices();
        
        if (!this.isInitialized || this.voices.length === 0) {
            return [...this.getDefaultVoices(), ...this.fallbackVoices];
        }

        const systemVoices = await Promise.all(
            this.voices.map(async (voice, index) => {
                const ttsVoice: TTSVoice = {
                    id: `voice-${index}`,
                    name: voice.name,
                    language: voice.lang,
                    gender: this.inferGender(voice.name),
                    accent: this.inferAccent(voice.name, voice.lang),
                    isPremium: this.isPremiumVoice(voice.name),
                    voiceURI: voice.voiceURI,
                    isAvailable: true // System voices are available by default
                };
                
                return ttsVoice;
            })
        );

        const defaultVoices = await Promise.all(
            this.getDefaultVoices().map(async (voice) => {
                const isAvailable = await this.voiceChecker.testVoiceAvailability(voice);
                return { ...voice, isAvailable };
            })
        );

        return [...systemVoices, ...defaultVoices, ...this.fallbackVoices];
    }

    private getDefaultVoices(): TTSVoice[] {
        return [
            {
                id: 'default-female',
                name: 'Natural Female Voice',
                language: 'en-US',
                gender: 'female',
                isPremium: false,
                voiceURI: 'default',
                isAvailable: true
            },
            {
                id: 'default-male',
                name: 'Natural Male Voice',
                language: 'en-US',
                gender: 'male',
                isPremium: false,
                voiceURI: 'default',
                isAvailable: true
            },
            {
                id: 'premium-neural-female-1',
                name: 'Aria - Neural Female',
                language: 'en-US',
                gender: 'female',
                accent: 'American',
                isPremium: true,
                voiceURI: 'neural-aria',
                provider: 'Azure Cognitive Services',
                isAvailable: false // Will be checked async
            },
            {
                id: 'premium-neural-male-1',
                name: 'Davis - Neural Male',
                language: 'en-US',
                gender: 'male',
                accent: 'American',
                isPremium: true,
                voiceURI: 'neural-davis',
                provider: 'Azure Cognitive Services',
                isAvailable: false
            },
            {
                id: 'premium-wavenet-female-1',
                name: 'Wavenet Female A',
                language: 'en-US',
                gender: 'female',
                accent: 'American',
                isPremium: true,
                voiceURI: 'wavenet-female-a',
                provider: 'Google Cloud TTS',
                isAvailable: false
            },
            {
                id: 'premium-wavenet-male-1',
                name: 'Wavenet Male B',
                language: 'en-US',
                gender: 'male',
                accent: 'American',
                isPremium: true,
                voiceURI: 'wavenet-male-b',
                provider: 'Google Cloud TTS',
                isAvailable: false
            },
            {
                id: 'premium-british-female',
                name: 'Emma - British Neural',
                language: 'en-GB',
                gender: 'female',
                accent: 'British',
                isPremium: true,
                voiceURI: 'neural-emma',
                provider: 'Azure Cognitive Services',
                isAvailable: false
            },
            {
                id: 'premium-british-male',
                name: 'Ryan - British Neural',
                language: 'en-GB',
                gender: 'male',
                accent: 'British',
                isPremium: true,
                voiceURI: 'neural-ryan',
                provider: 'Azure Cognitive Services',
                isAvailable: false
            }
        ];
    }

    private inferGender(voiceName: string): 'male' | 'female' | 'neutral' {
        const femaleIndicators = ['female', 'woman', 'girl', 'zira', 'hazel', 'susan', 'karen', 'samantha', 'sara', 'emma', 'sophie'];
        const maleIndicators = ['male', 'man', 'boy', 'david', 'mark', 'daniel', 'alex', 'tom', 'james'];

        const lowerName = voiceName.toLowerCase();

        if (femaleIndicators.some(indicator => lowerName.includes(indicator))) {
            return 'female';
        }
        if (maleIndicators.some(indicator => lowerName.includes(indicator))) {
            return 'male';
        }

        return 'neutral';
    }

    private inferAccent(voiceName: string, lang: string): string | undefined {
        if (lang.includes('en-GB') || voiceName.toLowerCase().includes('british')) return 'British';
        if (lang.includes('en-AU') || voiceName.toLowerCase().includes('australian')) return 'Australian';
        if (lang.includes('en-CA') || voiceName.toLowerCase().includes('canadian')) return 'Canadian';
        if (lang.includes('en-IN') || voiceName.toLowerCase().includes('indian')) return 'Indian';
        if (lang.includes('en-US')) return 'American';
        return undefined;
    }

    private isPremiumVoice(voiceName: string): boolean {
        // In a real implementation, you'd determine this based on actual premium voice providers
        const premiumVoices = ['premium', 'neural', 'wavenet', 'enhanced', 'natural'];
        return premiumVoices.some(premium => voiceName.toLowerCase().includes(premium));
    }

    async speak(text: string, settings: TTSSettings, onStart?: () => void, onEnd?: () => void, onError?: (error: string) => void): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                // Stop any current speech
                this.stop();

                // Check voice availability
                const isVoiceAvailable = await this.voiceChecker.testVoiceAvailability(settings.voice);
                
                if (settings.voice.isPremium && isVoiceAvailable) {
                    // Use premium TTS service
                    await this.speakWithPremiumService(text, settings, onStart, onEnd, onError);
                    resolve();
                    return;
                } else if (settings.voice.isPremium && !isVoiceAvailable) {
                    // Fallback to enhanced system voice for premium users
                    console.warn('Premium voice unavailable, falling back to enhanced system voice');
                    await this.speakWithEnhancedVoice(text, settings, onStart, onEnd, onError);
                    resolve();
                    return;
                }

                // Use system voice with fallback handling
                await this.speakWithSystemVoice(text, settings, onStart, onEnd, onError);
                resolve();
            } catch (error) {
                const errorMessage = `TTS Error: ${error instanceof Error ? error.message : 'Unknown error'}`;
                onError?.(errorMessage);
                reject(new Error(errorMessage));
            }
        });
    }

    private async speakWithEnhancedVoice(text: string, settings: TTSSettings, onStart?: () => void, onEnd?: () => void, onError?: (error: string) => void): Promise<void> {
        // Enhanced voice processing with better naturalness
        try {
            onStart?.();

            // Process text for more natural speech
            const processedText = this.preprocessTextForNaturalSpeech(text);
            
            // Split into smaller chunks for more natural delivery
            const chunks = this.splitTextIntoChunks(processedText);
            
            for (let i = 0; i < chunks.length; i++) {
                const chunk = chunks[i];
                const isLastChunk = i === chunks.length - 1;
                
                await new Promise<void>((resolve, reject) => {
                    const utterance = new SpeechSynthesisUtterance(chunk);
                    
                    // Enhanced settings for more natural speech
                    utterance.rate = settings.rate * 0.95; // Slightly slower for premium feel
                    utterance.pitch = settings.pitch;
                    utterance.volume = settings.volume;
                    
                    // Try to use the best available voice
                    const bestVoice = this.selectBestAvailableVoice(settings.voice);
                    if (bestVoice) {
                        utterance.voice = bestVoice;
                    }
                    
                    utterance.onend = () => {
                        if (isLastChunk) {
                            onEnd?.();
                        }
                        resolve();
                    };
                    
                    utterance.onerror = (event) => {
                        onError?.(`Enhanced speech error: ${event.error}`);
                        reject(new Error(event.error));
                    };
                    
                    this.synthesis.speak(utterance);
                });
                
                // Add natural pause between chunks
                if (!isLastChunk) {
                    await new Promise(resolve => setTimeout(resolve, 150));
                }
            }
        } catch (error) {
            console.error('Enhanced voice processing failed:', error);
            // Ultimate fallback to simple system voice
            await this.speakWithSystemVoice(text, settings, onStart, onEnd, onError);
        }
    }

    stop(): void {
        this.synthesis.cancel();
        this.currentUtterance = null;
    }

    pause(): void {
        this.synthesis.pause();
    }

    resume(): void {
        this.synthesis.resume();
    }

    isSpeaking(): boolean {
        return this.synthesis.speaking || this.currentUtterance !== null;
    }

    isPaused(): boolean {
        return this.synthesis.paused;
    }
}

export const ttsService = new TextToSpeechService();

// Default TTS settings with enhanced voice
export const defaultTTSSettings: TTSSettings = {
    voice: {
        id: 'default-female',
        name: 'Natural Female Voice',
        language: 'en-US',
        gender: 'female',
        isPremium: false,
        voiceURI: 'default',
        isAvailable: true
    },
    rate: 1.0,
    pitch: 1.0,
    volume: 0.8
};