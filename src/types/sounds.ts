export interface Sound {
    id: string;
    name: string;
    category: SoundCategory;
    description: string;
    duration?: number; // in minutes, optional for looping sounds
    audioUrl: string;
    isPremium: boolean;
    tags: string[];
    volume: number; // 0-1
    isFavorite?: boolean;
}

export interface SoundCategory {
    id: string;
    name: string;
    icon: string;
    color: string;
    description: string;
}

export interface CustomSoundMix {
    id: string;
    name: string;
    sounds: Array<{
        soundId: string;
        volume: number;
    }>;
    createdAt: Date;
    isPremium: boolean;
}

export interface TTSVoice {
    id: string;
    name: string;
    language: string;
    gender: 'male' | 'female' | 'neutral';
    accent?: string;
    isPremium: boolean;
    voiceURI: string;
    provider?: string; // e.g., 'Azure Cognitive Services', 'Google Cloud TTS'
    isAvailable?: boolean; // Whether the voice is currently available
}

export interface TTSSettings {
    voice: TTSVoice;
    rate: number; // 0.5 - 2.0
    pitch: number; // 0 - 2
    volume: number; // 0 - 1
}