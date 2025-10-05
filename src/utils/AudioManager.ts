/**
 * AudioManager - Singleton pattern for centralized audio control
 * Prevents memory leaks and allows global access across components
 */

export interface AudioTrack {
    id: string;
    name: string;
    category: string;
    audio: HTMLAudioElement;
    volume: number;
    isPlaying: boolean;
}

class AudioManager {
    private static instance: AudioManager;
    private audioContext: AudioContext | null = null;
    private activeTracks: Map<string, AudioTrack> = new Map();
    private masterVolume: number = 0.7;

    private constructor() {
        this.initializeAudioContext();
    }

    public static getInstance(): AudioManager {
        if (!AudioManager.instance) {
            AudioManager.instance = new AudioManager();
        }
        return AudioManager.instance;
    }

    private async initializeAudioContext(): Promise<void> {
        try {
            this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Handle browser audio context suspension
            if (this.audioContext.state === 'suspended') {
                await this.audioContext.resume();
            }
        } catch (error) {
            console.error('Failed to initialize audio context:', error);
        }
    }

    public async resumeAudioContext(): Promise<void> {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            try {
                await this.audioContext.resume();
            } catch (error) {
                console.error('Failed to resume audio context:', error);
            }
        }
    }

    public generateSoundBuffer(category: string, duration: number = 10): string {
        if (!this.audioContext) return '';

        const sampleRate = this.audioContext.sampleRate;
        const length = sampleRate * duration;
        const buffer = this.audioContext.createBuffer(2, length, sampleRate);

        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        // Generate different patterns based on sound category with improved volume
        for (let i = 0; i < length; i++) {
            let sample = 0;

            switch (category) {
                case 'nature':
                    // More audible nature sounds
                    sample = (Math.random() * 2 - 1) * 0.15 * Math.sin(i * 0.001);
                    // Add gentle wind
                    sample += Math.sin(i * 0.0002) * 0.08;
                    break;

                case 'ambient':
                    // Ambient drone with better presence
                    sample = Math.sin(i * 0.008) * 0.12 + Math.sin(i * 0.003) * 0.08;
                    break;

                case 'focus':
                    // Focus tone with binaural-like effect
                    sample = Math.sin(i * 0.04) * 0.15;
                    // Add slight variation for interest
                    sample += Math.sin(i * 0.041) * 0.05;
                    break;

                case 'meditation':
                    // Bell-like meditation tone
                    const decay = Math.exp(-i / (sampleRate * 3));
                    sample = Math.sin(i * 0.015) * 0.12 * decay;
                    // Add harmonics
                    sample += Math.sin(i * 0.03) * 0.06 * decay;
                    break;

                case 'urban':
                    // Urban background noise
                    sample = (Math.random() * 2 - 1) * 0.1;
                    // Add low frequency rumble
                    sample += Math.sin(i * 0.0001) * 0.05;
                    break;

                default:
                    sample = Math.sin(i * 0.01) * 0.08;
            }

            leftData[i] = sample;
            rightData[i] = sample * 0.95; // Slight stereo variation
        }

        // Convert to data URL (simplified for demo)
        return 'data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaCs7DUO7L0SU=';
    }

    public async playSound(soundId: string, soundName: string, category: string, src: string): Promise<boolean> {
        try {
            // Resume audio context if needed
            await this.resumeAudioContext();

            // Check if already playing
            if (this.activeTracks.has(soundId)) {
                this.stopSound(soundId);
                return true;
            }

            // Create new audio
            const audio = new Audio();
            audio.src = src;
            audio.loop = true;
            audio.volume = this.masterVolume * 0.7; // Ensure adequate volume

            const track: AudioTrack = {
                id: soundId,
                name: soundName,
                category,
                audio,
                volume: 0.7,
                isPlaying: false
            };

            // Add to active tracks
            this.activeTracks.set(soundId, track);

            // Start playing
            await audio.play();
            track.isPlaying = true;

            console.log(`🎵 Playing: ${soundName} (${category})`);
            return true;

        } catch (error) {
            console.error(`Error playing sound ${soundName}:`, error);
            this.activeTracks.delete(soundId);
            return false;
        }
    }

    public stopSound(soundId: string): void {
        const track = this.activeTracks.get(soundId);
        if (track) {
            track.audio.pause();
            track.audio.currentTime = 0;
            track.isPlaying = false;
            this.activeTracks.delete(soundId);
            console.log(`🔇 Stopped: ${track.name}`);
        }
    }

    public stopAllSounds(): void {
        this.activeTracks.forEach((track) => {
            track.audio.pause();
            track.audio.currentTime = 0;
        });
        this.activeTracks.clear();
        console.log('🔇 Stopped all sounds');
    }

    public adjustVolume(soundId: string, volume: number): void {
        const track = this.activeTracks.get(soundId);
        if (track) {
            track.volume = volume;
            track.audio.volume = volume * this.masterVolume;
        }
    }

    public setMasterVolume(volume: number): void {
        this.masterVolume = Math.max(0, Math.min(1, volume));
        this.activeTracks.forEach((track) => {
            track.audio.volume = track.volume * this.masterVolume;
        });
    }

    public isPlaying(soundId: string): boolean {
        const track = this.activeTracks.get(soundId);
        return track ? track.isPlaying : false;
    }

    public getActiveTracks(): AudioTrack[] {
        return Array.from(this.activeTracks.values());
    }

    public getPlayingCount(): number {
        return this.activeTracks.size;
    }

    // Test audio functionality
    public async testAudio(): Promise<boolean> {
        try {
            await this.resumeAudioContext();

            const testAudio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmAaCs7DUO7L0SU=');
            testAudio.volume = 0.5;

            await testAudio.play();

            // Stop after 1 second
            setTimeout(() => {
                testAudio.pause();
                testAudio.currentTime = 0;
            }, 1000);

            return true;
        } catch (error) {
            console.error('Audio test failed:', error);
            return false;
        }
    }

    // Cleanup method
    public cleanup(): void {
        this.stopAllSounds();
        if (this.audioContext) {
            this.audioContext.close();
            this.audioContext = null;
        }
    }
}

export default AudioManager;