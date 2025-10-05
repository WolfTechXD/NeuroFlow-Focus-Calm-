import { Sound } from '../types/sounds';

export interface AudioInstance {
    id: string;
    audio: HTMLAudioElement;
    sound: Sound;
    volume: number;
    isLooping: boolean;
    isPlaying: boolean;
}

export interface GeneratedAudioInstance {
    id: string;
    oscillator: OscillatorNode | null;
    gainNode: GainNode | null;
    sound: Sound;
    volume: number;
    isPlaying: boolean;
}

/**
 * Singleton AudioManager service to handle all audio operations
 * Fixes memory leaks, provides proper cleanup, and manages AudioContext lifecycle
 */
export class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext | null = null;
    private audioInstances: Map<string, AudioInstance> = new Map();
    private generatedAudioInstances: Map<string, GeneratedAudioInstance> = new Map();
    private masterVolume: number = 1.0;
    private isInitialized: boolean = false;
    private isEnabled: boolean = true;

    private constructor() {
        // Bind methods to maintain context
        this.cleanup = this.cleanup.bind(this);
        this.suspend = this.suspend.bind(this);
        this.resume = this.resume.bind(this);
        
        // Setup cleanup on page unload
        window.addEventListener('beforeunload', this.cleanup);
        window.addEventListener('pagehide', this.cleanup);
        
        // Handle visibility changes for performance
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.suspend();
            } else {
                this.resume();
            }
        });
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    /**
     * Initialize AudioContext with user gesture requirement handling
     */
    public async initialize(): Promise<boolean> {
        if (this.isInitialized) return true;

        try {
            // Create AudioContext
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            
            // Handle browser autoplay policies
            if (this.audioContext.state === 'suspended') {
                // Will be resumed on first user interaction
                console.log('AudioContext suspended - waiting for user interaction');
            }

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize AudioContext:', error);
            return false;
        }
    }

    /**
     * Resume AudioContext (required for browser autoplay policies)
     */
    public async resume(): Promise<void> {
        if (!this.audioContext) return;
        
        if (this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
                console.log('AudioContext resumed');
            } catch (error) {
                console.error('Failed to resume AudioContext:', error);
            }
        }
    }

    /**
     * Suspend AudioContext for performance
     */
    public async suspend(): Promise<void> {
        if (!this.audioContext) return;
        
        if (this.audioContext.state === 'running') {
            try {
                await this.audioContext.suspend();
                console.log('AudioContext suspended');
            } catch (error) {
                console.error('Failed to suspend AudioContext:', error);
            }
        }
    }

    /**
     * Play audio file with proper resource management
     */
    public async playAudioFile(sound: Sound, volume: number = 1.0, loop: boolean = true): Promise<string | null> {
        if (!this.isEnabled) return null;

        try {
            await this.initialize();
            await this.resume();

            const instanceId = `audio_${sound.id}_${Date.now()}`;
            
            // Create HTML5 Audio element (fallback for file playback)
            const audio = new Audio();
            audio.volume = volume * this.masterVolume * sound.volume;
            audio.loop = loop;
            
            // Handle audio loading and errors
            const loadPromise = new Promise<void>((resolve, reject) => {
                const onLoad = () => {
                    audio.removeEventListener('canplaythrough', onLoad);
                    audio.removeEventListener('error', onError);
                    resolve();
                };
                
                const onError = (error: any) => {
                    audio.removeEventListener('canplaythrough', onLoad);
                    audio.removeEventListener('error', onError);
                    reject(error);
                };
                
                audio.addEventListener('canplaythrough', onLoad);
                audio.addEventListener('error', onError);
            });

            // Set audio source (fallback to generated audio for demo)
            audio.src = sound.audioUrl || this.generateDataUrl(sound);
            
            try {
                await loadPromise;
                await audio.play();
                
                const instance: AudioInstance = {
                    id: instanceId,
                    audio,
                    sound,
                    volume,
                    isLooping: loop,
                    isPlaying: true
                };
                
                this.audioInstances.set(instanceId, instance);
                
                // Setup cleanup when audio ends
                audio.addEventListener('ended', () => {
                    this.stopAudio(instanceId);
                });
                
                return instanceId;
            } catch (playError) {
                console.warn('Audio file playback failed, falling back to generated audio:', playError);
                return this.playGeneratedAudio(sound, volume, loop);
            }
        } catch (error) {
            console.error('Failed to play audio file:', error);
            return this.playGeneratedAudio(sound, volume, loop);
        }
    }

    /**
     * Generate synthetic audio for demo purposes
     */
    public async playGeneratedAudio(sound: Sound, volume: number = 1.0, loop: boolean = true): Promise<string | null> {
        if (!this.isEnabled) return null;

        try {
            await this.initialize();
            await this.resume();

            if (!this.audioContext) return null;

            const instanceId = `generated_${sound.id}_${Date.now()}`;
            
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            // Configure oscillator based on sound type
            this.configureOscillatorForSound(oscillator, gainNode, sound);
            
            // Set volume
            gainNode.gain.setValueAtTime(volume * this.masterVolume * sound.volume, this.audioContext.currentTime);
            
            // Connect nodes
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Start oscillator
            oscillator.start();
            
            const instance: GeneratedAudioInstance = {
                id: instanceId,
                oscillator,
                gainNode,
                sound,
                volume,
                isPlaying: true
            };
            
            this.generatedAudioInstances.set(instanceId, instance);
            
            // Handle looping for generated audio
            if (loop) {
                oscillator.addEventListener('ended', () => {
                    if (this.generatedAudioInstances.has(instanceId)) {
                        // Restart oscillator for looping
                        this.restartGeneratedAudio(instanceId);
                    }
                });
            } else {
                oscillator.addEventListener('ended', () => {
                    this.stopGeneratedAudio(instanceId);
                });
            }
            
            return instanceId;
        } catch (error) {
            console.error('Failed to play generated audio:', error);
            return null;
        }
    }

    /**
     * Configure oscillator parameters based on sound characteristics
     */
    private configureOscillatorForSound(oscillator: OscillatorNode, gainNode: GainNode, sound: Sound): void {
        const currentTime = this.audioContext!.currentTime;
        
        if (sound.tags.includes('rain') || sound.tags.includes('storm')) {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(80, currentTime);
            // Add frequency modulation for rain effect
            oscillator.frequency.exponentialRampToValueAtTime(120, currentTime + 2);
            oscillator.frequency.exponentialRampToValueAtTime(80, currentTime + 4);
            gainNode.gain.setValueAtTime(0.05, currentTime);
        } else if (sound.tags.includes('ocean') || sound.tags.includes('water')) {
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(60, currentTime);
            // Simulate wave rhythm
            gainNode.gain.setValueAtTime(0.1, currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.2, currentTime + 3);
            gainNode.gain.exponentialRampToValueAtTime(0.1, currentTime + 6);
        } else if (sound.tags.includes('forest') || sound.tags.includes('nature')) {
            oscillator.type = 'triangle';
            oscillator.frequency.setValueAtTime(200, currentTime);
            gainNode.gain.setValueAtTime(0.03, currentTime);
        } else if (sound.tags.includes('fire')) {
            oscillator.type = 'sawtooth';
            oscillator.frequency.setValueAtTime(150, currentTime);
            // Crackling effect
            oscillator.frequency.exponentialRampToValueAtTime(200, currentTime + 0.5);
            oscillator.frequency.exponentialRampToValueAtTime(100, currentTime + 1);
            gainNode.gain.setValueAtTime(0.08, currentTime);
        } else if (sound.tags.includes('noise')) {
            // Noise generation
            oscillator.type = 'sawtooth';
            if (sound.name.toLowerCase().includes('white')) {
                oscillator.frequency.setValueAtTime(440, currentTime);
            } else if (sound.name.toLowerCase().includes('brown')) {
                oscillator.frequency.setValueAtTime(220, currentTime);
            } else if (sound.name.toLowerCase().includes('pink')) {
                oscillator.frequency.setValueAtTime(330, currentTime);
            }
            gainNode.gain.setValueAtTime(0.1, currentTime);
        } else {
            // Default ambient sound
            oscillator.type = 'sine';
            oscillator.frequency.setValueAtTime(220, currentTime);
            gainNode.gain.setValueAtTime(0.05, currentTime);
        }
    }

    /**
     * Restart generated audio for looping
     */
    private async restartGeneratedAudio(instanceId: string): Promise<void> {
        const instance = this.generatedAudioInstances.get(instanceId);
        if (!instance || !this.audioContext) return;

        try {
            // Create new oscillator (can't restart stopped oscillators)
            const newOscillator = this.audioContext.createOscillator();
            const newGainNode = this.audioContext.createGain();
            
            this.configureOscillatorForSound(newOscillator, newGainNode, instance.sound);
            newGainNode.gain.setValueAtTime(instance.volume * this.masterVolume * instance.sound.volume, this.audioContext.currentTime);
            
            newOscillator.connect(newGainNode);
            newGainNode.connect(this.audioContext.destination);
            
            newOscillator.start();
            
            // Update instance
            instance.oscillator = newOscillator;
            instance.gainNode = newGainNode;
            
            // Setup next restart
            newOscillator.addEventListener('ended', () => {
                if (this.generatedAudioInstances.has(instanceId)) {
                    this.restartGeneratedAudio(instanceId);
                }
            });
        } catch (error) {
            console.error('Failed to restart generated audio:', error);
            this.stopGeneratedAudio(instanceId);
        }
    }

    /**
     * Stop specific audio instance
     */
    public stopAudio(instanceId: string): void {
        const audioInstance = this.audioInstances.get(instanceId);
        if (audioInstance) {
            audioInstance.audio.pause();
            audioInstance.audio.src = '';
            audioInstance.audio.remove();
            this.audioInstances.delete(instanceId);
        }
        
        this.stopGeneratedAudio(instanceId);
    }

    /**
     * Stop generated audio instance
     */
    public stopGeneratedAudio(instanceId: string): void {
        const instance = this.generatedAudioInstances.get(instanceId);
        if (instance) {
            if (instance.oscillator) {
                try {
                    instance.oscillator.stop();
                    instance.oscillator.disconnect();
                } catch (error) {
                    // Oscillator may already be stopped
                }
            }
            if (instance.gainNode) {
                instance.gainNode.disconnect();
            }
            this.generatedAudioInstances.delete(instanceId);
        }
    }

    /**
     * Stop all audio
     */
    public stopAllAudio(): void {
        // Stop all HTML5 audio instances
        for (const [id, instance] of this.audioInstances) {
            instance.audio.pause();
            instance.audio.src = '';
            instance.audio.remove();
        }
        this.audioInstances.clear();
        
        // Stop all generated audio instances
        for (const [id, instance] of this.generatedAudioInstances) {
            if (instance.oscillator) {
                try {
                    instance.oscillator.stop();
                    instance.oscillator.disconnect();
                } catch (error) {
                    // Oscillator may already be stopped
                }
            }
            if (instance.gainNode) {
                instance.gainNode.disconnect();
            }
        }
        this.generatedAudioInstances.clear();
    }

    /**
     * Set volume for specific audio instance
     */
    public setAudioVolume(instanceId: string, volume: number): void {
        const audioInstance = this.audioInstances.get(instanceId);
        if (audioInstance) {
            audioInstance.volume = volume;
            audioInstance.audio.volume = volume * this.masterVolume * audioInstance.sound.volume;
        }
        
        const generatedInstance = this.generatedAudioInstances.get(instanceId);
        if (generatedInstance && generatedInstance.gainNode && this.audioContext) {
            generatedInstance.volume = volume;
            generatedInstance.gainNode.gain.setValueAtTime(
                volume * this.masterVolume * generatedInstance.sound.volume,
                this.audioContext.currentTime
            );
        }
    }

    /**
     * Set master volume for all audio
     */
    public setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        
        // Update all existing audio instances
        for (const [id, instance] of this.audioInstances) {
            instance.audio.volume = instance.volume * this.masterVolume * instance.sound.volume;
        }
        
        for (const [id, instance] of this.generatedAudioInstances) {
            if (instance.gainNode && this.audioContext) {
                instance.gainNode.gain.setValueAtTime(
                    instance.volume * this.masterVolume * instance.sound.volume,
                    this.audioContext.currentTime
                );
            }
        }
    }

    /**
     * Get master volume
     */
    public getMasterVolume(): number {
        return this.masterVolume;
    }

    /**
     * Enable/disable audio globally
     */
    public setEnabled(enabled: boolean): void {
        this.isEnabled = enabled;
        if (!enabled) {
            this.stopAllAudio();
        }
    }

    /**
     * Check if audio is enabled
     */
    public isAudioEnabled(): boolean {
        return this.isEnabled && this.isInitialized;
    }

    /**
     * Get currently playing audio instances
     */
    public getActiveInstances(): { audio: AudioInstance[], generated: GeneratedAudioInstance[] } {
        return {
            audio: Array.from(this.audioInstances.values()),
            generated: Array.from(this.generatedAudioInstances.values())
        };
    }

    /**
     * Generate a data URL for fallback audio (very basic tone)
     */
    private generateDataUrl(sound: Sound): string {
        // Create a very basic audio data URL for fallback
        // In a real implementation, this would generate appropriate audio data
        return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaCs7DUO7L0SU=';
    }

    /**
     * Comprehensive cleanup - removes all audio instances and contexts
     */
    public cleanup(): void {
        this.stopAllAudio();
        
        if (this.audioContext) {
            try {
                this.audioContext.close();
            } catch (error) {
                console.error('Error closing AudioContext:', error);
            }
            this.audioContext = null;
        }
        
        this.isInitialized = false;
        
        // Remove event listeners
        window.removeEventListener('beforeunload', this.cleanup);
        window.removeEventListener('pagehide', this.cleanup);
    }
}

// Export singleton instance
export const audioManager = AudioManager.getInstance();