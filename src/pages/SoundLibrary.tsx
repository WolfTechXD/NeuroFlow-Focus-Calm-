import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState } from '../types/index';
import { Sound, SoundCategory, CustomSoundMix } from '../types/sounds';
import { soundLibrary, soundCategories, getFreeSounds, getPremiumSounds, getSoundsByCategory } from '../utils/soundLibrary';
import SoundMixer from '../components/SoundMixer';

// Simple icon components
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const Stop = () => <span>⏹️</span>;
const Heart = () => <span>❤️</span>;
const HeartFilled = () => <span>💖</span>;
const Volume = () => <span>🔊</span>;
const Mix = () => <span>🎛️</span>;
const Save = () => <span>💾</span>;
const Filter = () => <span>🔍</span>;
const Star = () => <span>⭐</span>;

interface SoundLibraryProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const SoundLibrary: React.FC<SoundLibraryProps> = ({ appState, onUpdateState }) => {
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [playingSounds, setPlayingSounds] = useState<string[]>([]);
    const [soundVolumes, setSoundVolumes] = useState<Record<string, number>>({});
    const [searchQuery, setSearchQuery] = useState('');
    const [showOnlyFavorites, setShowOnlyFavorites] = useState(false);
    const [isCreatingMix, setIsCreatingMix] = useState(false);
    const [mixName, setMixName] = useState('');
    const [currentMix, setCurrentMix] = useState<CustomSoundMix | null>(null);
    const [showSoundMixer, setShowSoundMixer] = useState(false);
    const audioRefs = useRef<Record<string, AudioBufferSourceNode>>({});

    const availableSounds = appState.user.subscription.isPremium
        ? soundLibrary
        : getFreeSounds();

    const filteredSounds = availableSounds.filter(sound => {
        const matchesCategory = selectedCategory === 'all' || sound.category.id === selectedCategory;
        const matchesSearch = sound.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sound.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesFavorites = !showOnlyFavorites || sound.isFavorite;

        return matchesCategory && matchesSearch && matchesFavorites;
    });

    const generateAudioForSound = async (sound: Sound): Promise<AudioBufferSourceNode> => {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

        if (audioContext.state === 'suspended') {
            await audioContext.resume();
        }

        // Generate different audio based on sound type
        let buffer: AudioBuffer;

        if (sound.audioUrl.includes('forest') || sound.id.includes('forest')) {
            buffer = generateForestAudio(audioContext);
        } else if (sound.audioUrl.includes('ocean') || sound.id.includes('ocean')) {
            buffer = generateOceanAudio(audioContext);
        } else if (sound.audioUrl.includes('rain') || sound.id.includes('rain')) {
            buffer = generateRainAudio(audioContext);
        } else if (sound.audioUrl.includes('white-noise') || sound.id.includes('white')) {
            buffer = generateWhiteNoise(audioContext);
        } else if (sound.audioUrl.includes('brown-noise') || sound.id.includes('brown')) {
            buffer = generateBrownNoise(audioContext);
        } else if (sound.audioUrl.includes('fire') || sound.id.includes('fire')) {
            buffer = generateFireAudio(audioContext);
        } else {
            // Default ambient sound
            buffer = generateAmbientAudio(audioContext);
        }

        const source = audioContext.createBufferSource();
        const gainNode = audioContext.createGain();

        source.buffer = buffer;
        source.loop = true;

        // Apply volume
        const volume = soundVolumes[sound.id] ?? sound.volume;
        gainNode.gain.value = volume;

        source.connect(gainNode);
        gainNode.connect(audioContext.destination);

        return source;
    };

    const generateForestAudio = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 10;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            const windBase = (Math.random() * 2 - 1) * 0.15;
            const rustling = Math.sin(i * 0.0003) * 0.08 * (Math.random() * 0.4 + 0.8);
            const windVariation = Math.sin(i * 0.0001) * 0.06;
            const ambientPresence = Math.sin(i * 0.00005) * 0.03;

            let birdChirp = 0;
            if (Math.random() < 0.000005) {
                const chirpFreq = 0.015 + Math.random() * 0.01;
                birdChirp = Math.sin(i * chirpFreq) * 0.015 * Math.exp(-(i % 2000) / 400);
            }

            const forestSound = windBase + rustling + windVariation + ambientPresence + birdChirp;
            leftData[i] = forestSound;
            rightData[i] = forestSound * 0.95 + rustling * 1.1 + windVariation * 0.9;
        }

        return buffer;
    };

    const generateOceanAudio = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 8;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            const wave1 = Math.sin(i * 0.0008) * 0.3;
            const wave2 = Math.sin(i * 0.0003) * 0.2;
            const foam = (Math.random() * 2 - 1) * 0.1;
            const deepRumble = Math.sin(i * 0.0001) * 0.15;

            const waveSound = wave1 + wave2 + foam + deepRumble;
            leftData[i] = waveSound;
            rightData[i] = waveSound * 0.9 + foam * 1.2;
        }

        return buffer;
    };

    const generateRainAudio = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 6;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            const rainBase = (Math.random() * 2 - 1) * 0.12;
            const thunderRumble = Math.sin(i * 0.0001) * 0.05 * Math.sin(i * 0.00003);
            const patter = Math.sin(i * 0.01) * 0.03;

            const rainSound = rainBase + thunderRumble + patter;
            leftData[i] = rainSound;
            rightData[i] = rainSound * 0.9 + patter * 1.1;
        }

        return buffer;
    };

    const generateWhiteNoise = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 4;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            data[i] = (Math.random() * 2 - 1) * 0.3;
        }

        return buffer;
    };

    const generateBrownNoise = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 4;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        let lastOut = 0;
        for (let i = 0; i < bufferSize; i++) {
            const white = (Math.random() * 2 - 1) * 0.1;
            data[i] = (lastOut + (0.02 * white)) / 1.02;
            lastOut = data[i];
            data[i] *= 3.5; // Amplify
        }

        return buffer;
    };

    const generateFireAudio = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 6;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            const crackle = Math.random() < 0.001 ? (Math.random() * 2 - 1) * 0.4 : 0;
            const baseFlame = (Math.random() * 2 - 1) * 0.08;
            const lowRumble = Math.sin(i * 0.0002) * 0.05;

            const fireSound = crackle + baseFlame + lowRumble;
            leftData[i] = fireSound;
            rightData[i] = fireSound * 0.95 + crackle * 1.1;
        }

        return buffer;
    };

    const generateAmbientAudio = (audioContext: AudioContext): AudioBuffer => {
        const bufferSize = audioContext.sampleRate * 8;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            const tone1 = Math.sin(i * 0.0004) * 0.1;
            const tone2 = Math.sin(i * 0.0006) * 0.08;
            const noise = (Math.random() * 2 - 1) * 0.03;

            const ambientSound = tone1 + tone2 + noise;
            leftData[i] = ambientSound;
            rightData[i] = ambientSound * 0.9;
        }

        return buffer;
    };

    const playSound = async (sound: Sound) => {
        try {
            // Stop the sound if it's already playing
            if (playingSounds.includes(sound.id)) {
                stopSound(sound.id);
                return;
            }

            const audioSource = await generateAudioForSound(sound);
            audioRefs.current[sound.id] = audioSource;

            audioSource.start();
            setPlayingSounds(prev => [...prev, sound.id]);

            // Handle when the audio ends (shouldn't happen with looped audio, but just in case)
            audioSource.onended = () => {
                setPlayingSounds(prev => prev.filter(id => id !== sound.id));
                delete audioRefs.current[sound.id];
            };
        } catch (error) {
            console.error('Error playing sound:', error);
        }
    };

    const stopSound = (soundId: string) => {
        if (audioRefs.current[soundId]) {
            audioRefs.current[soundId].stop();
            delete audioRefs.current[soundId];
        }
        setPlayingSounds(prev => prev.filter(id => id !== soundId));
    };

    const stopAllSounds = () => {
        Object.keys(audioRefs.current).forEach(soundId => {
            audioRefs.current[soundId].stop();
            delete audioRefs.current[soundId];
        });
        setPlayingSounds([]);
    };

    const toggleFavorite = (soundId: string) => {
        // In a real app, this would update the user's favorites
        console.log('Toggle favorite:', soundId);
    };

    const adjustVolume = (soundId: string, volume: number) => {
        setSoundVolumes(prev => ({ ...prev, [soundId]: volume }));

        // If the sound is currently playing, adjust its volume
        if (audioRefs.current[soundId]) {
            // Note: We'd need to recreate the audio source with new gain to change volume
            // For now, we'll just store the volume for when it's next played
        }
    };

    const saveMix = () => {
        if (!mixName.trim() || playingSounds.length === 0) return;

        const newMix: CustomSoundMix = {
            id: `mix-${Date.now()}`,
            name: mixName.trim(),
            sounds: playingSounds.map(soundId => ({
                soundId,
                volume: soundVolumes[soundId] ?? 0.6
            })),
            createdAt: new Date(),
            isPremium: appState.user.subscription.isPremium
        };

        // In a real app, you'd save this to user's profile
        console.log('Saving mix:', newMix);
        setMixName('');
        setIsCreatingMix(false);
    };

    // Cleanup audio on unmount
    useEffect(() => {
        return () => {
            stopAllSounds();
        };
    }, []);

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="max-w-6xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        🎵 Sound Library
                    </h1>
                    <p className="text-secondary">
                        {appState.user.subscription.isPremium
                            ? 'Full library with premium sounds and mixing capabilities'
                            : 'Demo library - upgrade for full access to all sounds'
                        }
                    </p>
                </motion.div>

                {/* Demo Banner */}
                {!appState.user.subscription.isPremium && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card bg-gradient-to-r from-yellow-400 to-orange-500 text-white mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="font-bold text-lg mb-1">🚀 Unlock Full Sound Library</h3>
                                <p className="text-sm opacity-90">
                                    Get access to {getPremiumSounds().length} premium sounds, custom mixing, and unlimited combinations!
                                </p>
                            </div>
                            <button className="btn-secondary bg-white text-orange-600 hover:bg-gray-100">
                                Upgrade Now
                            </button>
                        </div>
                    </motion.div>
                )}

                {/* Controls */}
                <div className="card mb-6">
                    <div className="flex flex-wrap items-center gap-4 mb-4">
                        {/* Search */}
                        <div className="flex-1 min-w-64">
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Filter />
                                </div>
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-themed rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    placeholder="Search sounds..."
                                />
                            </div>
                        </div>

                        {/* Favorites Filter */}
                        <button
                            onClick={() => setShowOnlyFavorites(!showOnlyFavorites)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${showOnlyFavorites
                                ? 'bg-pink-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-pink-50'
                                }`}
                        >
                            <Heart /> Favorites
                        </button>

                        {/* Mix Controls */}
                        <button
                            onClick={() => setShowSoundMixer(true)}
                            className="px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 font-medium"
                        >
                            <Mix /> Sound Mixer
                        </button>

                        {playingSounds.length > 0 && (
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => setIsCreatingMix(true)}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                                >
                                    <Save /> Save Mix
                                </button>
                                <button
                                    onClick={stopAllSounds}
                                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                                >
                                    <Stop /> Stop All
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Category Filters */}
                    <div className="flex flex-wrap gap-2">
                        <button
                            onClick={() => setSelectedCategory('all')}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === 'all'
                                ? 'bg-purple-500 text-white'
                                : 'bg-white text-gray-700 hover:bg-purple-50'
                                }`}
                        >
                            🌈 All Categories
                        </button>
                        {soundCategories.map(category => (
                            <button
                                key={category.id}
                                onClick={() => setSelectedCategory(category.id)}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category.id
                                    ? 'bg-purple-500 text-white'
                                    : 'bg-white text-gray-700 hover:bg-purple-50'
                                    }`}
                            >
                                {category.icon} {category.name}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Currently Playing */}
                {playingSounds.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card mb-6 bg-gradient-to-r from-blue-50 to-purple-50"
                    >
                        <h3 className="font-bold text-lg mb-4 text-primary">
                            🎵 Currently Playing ({playingSounds.length})
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {playingSounds.map(soundId => {
                                const sound = availableSounds.find(s => s.id === soundId);
                                if (!sound) return null;

                                return (
                                    <div key={soundId} className="bg-white rounded-lg p-4 shadow-sm">
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-medium">{sound.name}</span>
                                            <button
                                                onClick={() => stopSound(soundId)}
                                                className="text-red-500 hover:text-red-700"
                                            >
                                                <Stop />
                                            </button>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Volume />
                                            <input
                                                type="range"
                                                min="0"
                                                max="1"
                                                step="0.1"
                                                value={soundVolumes[soundId] ?? sound.volume}
                                                onChange={(e) => adjustVolume(soundId, parseFloat(e.target.value))}
                                                className="flex-1"
                                            />
                                            <span className="text-sm text-gray-500">
                                                {Math.round((soundVolumes[soundId] ?? sound.volume) * 100)}%
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Sound Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredSounds.map((sound, index) => (
                        <motion.div
                            key={sound.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.05 }}
                            className={`card hover:shadow-lg transition-all cursor-pointer relative ${playingSounds.includes(sound.id) ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                                }`}
                            onClick={() => playSound(sound)}
                        >
                            {/* Premium Badge */}
                            {sound.isPremium && !appState.user.subscription.isPremium && (
                                <div className="absolute top-2 right-2 bg-yellow-500 text-white px-2 py-1 rounded-full text-xs font-bold">
                                    <Star /> PREMIUM
                                </div>
                            )}

                            {/* Sound Icon */}
                            <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${sound.category.color} flex items-center justify-center text-2xl`}>
                                {sound.category.icon}
                            </div>

                            {/* Sound Info */}
                            <h3 className="font-bold text-lg mb-2 text-center text-primary">
                                {sound.name}
                            </h3>
                            <p className="text-sm text-secondary text-center mb-4">
                                {sound.description}
                            </p>

                            {/* Tags */}
                            <div className="flex flex-wrap gap-1 mb-4">
                                {sound.tags.slice(0, 3).map(tag => (
                                    <span
                                        key={tag}
                                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                                    >
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Controls */}
                            <div className="flex items-center justify-between">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        playSound(sound);
                                    }}
                                    className={`px-4 py-2 rounded-lg font-medium transition-colors ${playingSounds.includes(sound.id)
                                        ? 'bg-red-500 text-white hover:bg-red-600'
                                        : 'bg-blue-500 text-white hover:bg-blue-600'
                                        }`}
                                    disabled={sound.isPremium && !appState.user.subscription.isPremium}
                                >
                                    {playingSounds.includes(sound.id) ? <Stop /> : <Play />}
                                    {playingSounds.includes(sound.id) ? ' Stop' : ' Play'}
                                </button>

                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        toggleFavorite(sound.id);
                                    }}
                                    className="p-2 text-gray-400 hover:text-pink-500 transition-colors"
                                >
                                    {sound.isFavorite ? <HeartFilled /> : <Heart />}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Save Mix Modal */}
                <AnimatePresence>
                    {isCreatingMix && (
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                            onClick={() => setIsCreatingMix(false)}
                        >
                            <motion.div
                                initial={{ scale: 0.95, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.95, opacity: 0 }}
                                className="card max-w-md w-full"
                                onClick={(e) => e.stopPropagation()}
                            >
                                <h3 className="font-bold text-xl mb-4 text-primary">
                                    <Mix /> Save Sound Mix
                                </h3>
                                <p className="text-secondary mb-4">
                                    Save your current combination of {playingSounds.length} sounds as a custom mix.
                                </p>
                                <input
                                    type="text"
                                    value={mixName}
                                    onChange={(e) => setMixName(e.target.value)}
                                    className="w-full p-3 border border-themed rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-4"
                                    placeholder="Enter mix name..."
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button
                                        onClick={saveMix}
                                        disabled={!mixName.trim() || playingSounds.length === 0}
                                        className="flex-1 btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        <Save /> Save Mix
                                    </button>
                                    <button
                                        onClick={() => setIsCreatingMix(false)}
                                        className="px-6 btn-secondary"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Sound Mixer Component */}
                <SoundMixer
                    isOpen={showSoundMixer}
                    onClose={() => setShowSoundMixer(false)}
                    isPremium={appState.user.subscription.isPremium}
                />
            </div>
        </div>
    );
};

export default SoundLibrary;