import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { ttsService, defaultTTSSettings } from '../utils/textToSpeech';
import { TTSVoice, TTSSettings } from '../types/sounds';

// Icon components
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const Stop = () => <span>⏹️</span>;
const Volume = () => <span>🔊</span>;
const Settings = () => <span>⚙️</span>;
const Mic = () => <span>🎤</span>;

interface TTSPlayerProps {
    text: string;
    title?: string;
    isPremium?: boolean;
    showSettings?: boolean;
    className?: string;
}

const TTSPlayer: React.FC<TTSPlayerProps> = ({
    text,
    title,
    isPremium = false,
    showSettings = true,
    className = ''
}) => {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [showAdvancedSettings, setShowAdvancedSettings] = useState(false);
    const [settings, setSettings] = useState<TTSSettings>({
        ...defaultTTSSettings,
        voice: isPremium ? {
            id: 'premium-female-1',
            name: 'Sarah - Premium Female',
            language: 'en-US',
            gender: 'female',
            accent: 'American',
            isPremium: true,
            voiceURI: 'premium-sarah'
        } : defaultTTSSettings.voice
    });
    const [availableVoices, setAvailableVoices] = useState<TTSVoice[]>([]);
    const [isLoadingVoices, setIsLoadingVoices] = useState(true);
    const playbackRef = useRef<Promise<void> | null>(null);

    const handlePlay = async () => {
        if (isPaused) {
            ttsService.resume();
            setIsPaused(false);
            setIsPlaying(true);
            return;
        }

        if (isPlaying) {
            ttsService.pause();
            setIsPaused(true);
            setIsPlaying(false);
            return;
        }

        // Check if voice is premium and user doesn't have access
        if (settings.voice.isPremium && !isPremium) {
            alert('🌟 Premium voices are available in the full version! Upgrade to access high-quality TTS voices.');
            return;
        }

        try {
            setIsPlaying(true);
            setIsPaused(false);

            playbackRef.current = ttsService.speak(
                text,
                settings,
                () => {
                    console.log('TTS started');
                },
                () => {
                    setIsPlaying(false);
                    setIsPaused(false);
                    playbackRef.current = null;
                },
                (error) => {
                    console.error('TTS error:', error);
                    setIsPlaying(false);
                    setIsPaused(false);
                    alert('🚫 Text-to-speech error. Please try again.');
                }
            );

            await playbackRef.current;
        } catch (error) {
            console.error('TTS playback failed:', error);
            setIsPlaying(false);
            setIsPaused(false);
        }
    };

    const handleStop = () => {
        ttsService.stop();
        setIsPlaying(false);
        setIsPaused(false);
        playbackRef.current = null;
    };

    const updateSetting = <K extends keyof TTSSettings>(key: K, value: TTSSettings[K]) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const getVoiceDisplayName = (voice: TTSVoice) => {
        let displayName = voice.name;

        if (voice.isPremium && !isPremium) {
            displayName += ' (Premium)';
        }

        if (voice.provider) {
            displayName += ` • ${voice.provider}`;
        }

        if (voice.isAvailable === false) {
            displayName += ' (Unavailable)';
        }

        return displayName;
    };

    return (
        <div className={`bg-white rounded-lg shadow-sm border p-4 ${className}`}>
            {title && (
                <h4 className="font-medium text-gray-800 mb-3 flex items-center gap-2">
                    <Mic /> {title}
                </h4>
            )}

            <div className="flex items-center gap-3 mb-4">
                <motion.button
                    onClick={handlePlay}
                    disabled={!text.trim()}
                    className={`flex items-center justify-center w-12 h-12 rounded-full transition-all ${isPlaying
                            ? 'bg-orange-100 text-orange-600 hover:bg-orange-200'
                            : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                        } disabled:opacity-50 disabled:cursor-not-allowed`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    {isPlaying ? (isPaused ? <Play /> : <Pause />) : <Play />}
                </motion.button>

                <motion.button
                    onClick={handleStop}
                    disabled={!isPlaying && !isPaused}
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    <Stop />
                </motion.button>

                <div className="flex-1">
                    <div className="text-sm text-gray-600">
                        Voice: <span className="font-medium">{getVoiceDisplayName(settings.voice)}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                        {settings.rate}x speed • {Math.round(settings.volume * 100)}% volume
                    </div>
                </div>

                {showSettings && (
                    <motion.button
                        onClick={() => setShowAdvancedSettings(!showAdvancedSettings)}
                        className="p-2 rounded-full bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Settings />
                    </motion.button>
                )}
            </div>

            {showSettings && showAdvancedSettings && (
                <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="border-t pt-4 space-y-4"
                >
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Voice
                        </label>
                        <select
                            value={settings.voice.id}
                            onChange={(e) => {
                                const voice = availableVoices.find(v => v.id === e.target.value);
                                if (voice) updateSetting('voice', voice);
                            }}
                            disabled={isLoadingVoices}
                            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50"
                        >
                            {isLoadingVoices ? (
                                <option>Loading voices...</option>
                            ) : (
                                availableVoices.map(voice => (
                                    <option
                                        key={voice.id}
                                        value={voice.id}
                                        disabled={voice.isPremium && !isPremium || voice.isAvailable === false}
                                    >
                                        {getVoiceDisplayName(voice)}
                                    </option>
                                ))
                            )}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Speed: {settings.rate.toFixed(1)}x
                        </label>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={settings.rate}
                            onChange={(e) => updateSetting('rate', parseFloat(e.target.value))}
                            className="w-full"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Volume: {Math.round(settings.volume * 100)}%
                        </label>
                        <div className="flex items-center gap-2">
                            <span className="text-gray-400">🔇</span>
                            <input
                                type="range"
                                min="0"
                                max="1"
                                step="0.1"
                                value={settings.volume}
                                onChange={(e) => updateSetting('volume', parseFloat(e.target.value))}
                                className="flex-1"
                            />
                            <Volume />
                        </div>
                    </div>

                    <button
                        onClick={() => {
                            const testText = "Hello! This is a test of your selected voice settings. The quick brown fox jumps over the lazy dog.";
                            ttsService.speak(testText, settings)
                                .catch(error => {
                                    alert(`Voice test failed: ${error.message}`);
                                });
                        }}
                        disabled={isLoadingVoices || !settings.voice.isAvailable}
                        className="w-full py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoadingVoices ? '⏳ Loading...' : '🎤 Test Voice Settings'}
                    </button>
                </motion.div>
            )}

            {!isPremium && (
                <div className="mt-4 p-3 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-center gap-2 text-yellow-800">
                        <span>🌟</span>
                        <div>
                            <div className="font-medium text-sm">Unlock Premium Voices</div>
                            <div className="text-xs">Get access to high-quality neural voices!</div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default TTSPlayer;