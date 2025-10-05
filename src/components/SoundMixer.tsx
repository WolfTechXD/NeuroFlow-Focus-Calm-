import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { soundLibrary, soundCategories, getExpandedSoundLibrary, searchSounds } from '../utils/soundLibrary';
import { Sound } from '../types/sounds';
import { audioManager } from '../services/AudioManager';

// Simple icon components
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const Volume2 = () => <span>🔊</span>;
const VolumeX = () => <span>🔇</span>;
const Plus = () => <span>➕</span>;
const Minus = () => <span>➖</span>;
const Sliders = () => <span>🎛️</span>;
const Save = () => <span>💾</span>;
const Shuffle = () => <span>🔀</span>;

interface SoundMixerProps {
    isOpen: boolean;
    onClose: () => void;
    isPremium: boolean;
}

interface PlayingSound {
    sound: Sound;
    instanceId: string | null;
    volume: number;
    isPlaying: boolean;
    isSolo: boolean;
    isMuted: boolean;
}

interface SavedMix {
    id: string;
    name: string;
    sounds: Array<{
        soundId: string;
        volume: number;
        isSolo: boolean;
        isMuted: boolean;
    }>;
    masterVolume: number;
    createdAt: Date;
    tags: string[];
}

const SoundMixer: React.FC<SoundMixerProps> = ({ isOpen, onClose, isPremium }) => {
    const [playingSounds, setPlayingSounds] = useState<PlayingSound[]>([]);
    const [availableSounds, setAvailableSounds] = useState<Sound[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [masterVolume, setMasterVolume] = useState(0.7);
    const [savedMixes, setSavedMixes] = useState<SavedMix[]>([]);
    const [mixName, setMixName] = useState('');
    const [mixTags, setMixTags] = useState('');
    const [isInitialized, setIsInitialized] = useState(false);
    const [isLoadingSounds, setIsLoadingSounds] = useState(true);
    const [searchQuery, setSearchQuery] = useState('');
    const [crossfadeTime, setCrossfadeTime] = useState(2); // seconds
    const [currentPreset, setCurrentPreset] = useState<SavedMix | null>(null);

    // Initialize audio manager
    useEffect(() => {
        if (isOpen && !isInitialized) {
            audioManager.initialize().then(() => {
                setIsInitialized(true);
                // Set initial master volume
                audioManager.setMasterVolume(masterVolume);
            });
        }
        
        return () => {
            if (isOpen) {
                audioManager.stopAllAudio();
            }
        };
    }, [isOpen, isInitialized, masterVolume]);

    // Filter sounds by category and search
    const filteredSounds = React.useMemo(() => {
        let filtered = availableSounds;
        
        if (selectedCategory !== 'all') {
            filtered = filtered.filter(s => s.category.id === selectedCategory);
        }
        
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(s => 
                s.name.toLowerCase().includes(query) ||
                s.description.toLowerCase().includes(query) ||
                s.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }
        
        return filtered;
    }, [availableSounds, selectedCategory, searchQuery]);

    // Add sound to mixer with enhanced features
    const addSound = async (sound: Sound) => {
        if (playingSounds.find(ps => ps.sound.id === sound.id)) {
            return; // Already added
        }

        if (playingSounds.length >= 8) {
            alert('🎵 Maximum 8 sounds can be mixed simultaneously in premium mode');
            return;
        }

        try {
            await audioManager.initialize();
            await audioManager.resume();

            const playingSound: PlayingSound = {
                sound,
                instanceId: null,
                volume: sound.volume,
                isPlaying: false,
                isSolo: false,
                isMuted: false
            };

            setPlayingSounds(prev => [...prev, playingSound]);
        } catch (error) {
            console.error('Error adding sound:', error);
            alert('🚫 Unable to load this sound. Please try another one.');
        }
    };

    // This function is no longer needed as AudioManager handles sound generation

    // Toggle sound playback with crossfade support
    const toggleSound = async (soundId: string) => {
        setPlayingSounds(prev => prev.map(ps => {
            if (ps.sound.id === soundId) {
                if (ps.isPlaying && ps.instanceId) {
                    // Stop with crossfade
                    audioManager.stopAudio(ps.instanceId);
                    return { ...ps, isPlaying: false, instanceId: null };
                } else if (!ps.isMuted) {
                    // Start with crossfade
                    audioManager.playGeneratedAudio(ps.sound, getEffectiveVolume(ps), true)
                        .then(instanceId => {
                            if (instanceId) {
                                setPlayingSounds(current => current.map(sound => 
                                    sound.sound.id === soundId 
                                        ? { ...sound, isPlaying: true, instanceId }
                                        : sound
                                ));
                            }
                        })
                        .catch(console.error);
                    return ps;
                }
            }
            return ps;
        }));
    };

    // Calculate effective volume considering solo and mute states
    const getEffectiveVolume = (ps: PlayingSound): number => {
        if (ps.isMuted) return 0;
        
        const hasSolo = playingSounds.some(sound => sound.isSolo);
        if (hasSolo && !ps.isSolo) return 0;
        
        return ps.volume;
    };

    // Toggle solo state
    const toggleSolo = (soundId: string) => {
        setPlayingSounds(prev => prev.map(ps => {
            if (ps.sound.id === soundId) {
                const newSolo = !ps.isSolo;
                // Update audio volume
                if (ps.instanceId) {
                    const newVolume = newSolo ? ps.volume : (prev.some(s => s.isSolo && s.sound.id !== soundId) ? 0 : ps.volume);
                    audioManager.setAudioVolume(ps.instanceId, newVolume);
                }
                return { ...ps, isSolo: newSolo };
            } else {
                // Update other sounds based on new solo state
                if (ps.instanceId) {
                    const newVolume = getEffectiveVolume(ps);
                    audioManager.setAudioVolume(ps.instanceId, newVolume);
                }
                return ps;
            }
        }));
    };

    // Toggle mute state
    const toggleMute = (soundId: string) => {
        setPlayingSounds(prev => prev.map(ps => {
            if (ps.sound.id === soundId) {
                const newMuted = !ps.isMuted;
                if (ps.instanceId) {
                    const newVolume = newMuted ? 0 : getEffectiveVolume(ps);
                    audioManager.setAudioVolume(ps.instanceId, newVolume);
                }
                return { ...ps, isMuted: newMuted };
            }
            return ps;
        }));
    };

    // Remove sound from mixer
    const removeSound = (soundId: string) => {
        setPlayingSounds(prev => {
            const sound = prev.find(ps => ps.sound.id === soundId);
            if (sound && sound.instanceId) {
                audioManager.stopAudio(sound.instanceId);
            }
            return prev.filter(ps => ps.sound.id !== soundId);
        });
    };

    // Adjust individual sound volume with real-time feedback
    const adjustSoundVolume = (soundId: string, volume: number) => {
        setPlayingSounds(prev => prev.map(ps => {
            if (ps.sound.id === soundId) {
                if (ps.instanceId) {
                    const effectiveVolume = ps.isMuted ? 0 : volume;
                    audioManager.setAudioVolume(ps.instanceId, effectiveVolume);
                }
                return { ...ps, volume };
            }
            return ps;
        }));
    };

    // Adjust master volume
    const adjustMasterVolume = (volume: number) => {
        setMasterVolume(volume);
        audioManager.setMasterVolume(volume);
    };

    // Enhanced save mix functionality
    const saveMix = () => {
        if (!mixName.trim()) {
            alert('📝 Please enter a name for your mix');
            return;
        }

        if (playingSounds.length === 0) {
            alert('🎵 Add some sounds to your mix before saving');
            return;
        }

        const mix: SavedMix = {
            id: Date.now().toString(),
            name: mixName.trim(),
            sounds: playingSounds.map(ps => ({
                soundId: ps.sound.id,
                volume: ps.volume,
                isSolo: ps.isSolo,
                isMuted: ps.isMuted
            })),
            masterVolume,
            createdAt: new Date(),
            tags: mixTags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        };

        const newMixes = [...savedMixes, mix];
        setSavedMixes(newMixes);
        localStorage.setItem('neuroflow-sound-mixes', JSON.stringify(newMixes));
        setCurrentPreset(mix);
        setMixName('');
        setMixTags('');
        alert('💾 Mix saved successfully!');
    };

    // Enhanced load mix with crossfade
    const loadMix = async (mix: SavedMix) => {
        // Clear current sounds with crossfade
        audioManager.stopAllAudio();
        setPlayingSounds([]);
        setCurrentPreset(mix);

        // Load mix sounds
        for (const mixSound of mix.sounds) {
            const sound = availableSounds.find(s => s.id === mixSound.soundId);
            if (sound) {
                const playingSound: PlayingSound = {
                    sound,
                    instanceId: null,
                    volume: mixSound.volume,
                    isPlaying: false,
                    isSolo: mixSound.isSolo || false,
                    isMuted: mixSound.isMuted || false
                };
                
                setPlayingSounds(prev => [...prev, playingSound]);
            }
        }

        setMasterVolume(mix.masterVolume);
        adjustMasterVolume(mix.masterVolume);
        alert(`🎵 Loaded mix: ${mix.name}`);
    };

    // Load saved mixes on component mount
    useEffect(() => {
        const saved = localStorage.getItem('neuroflow-sound-mixes');
        if (saved) {
            try {
                const mixes = JSON.parse(saved);
                setSavedMixes(mixes.map((mix: any) => ({
                    ...mix,
                    createdAt: new Date(mix.createdAt),
                    tags: mix.tags || []
                })));
            } catch (error) {
                console.error('Error loading saved mixes:', error);
            }
        }
    }, []);

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            audioManager.stopAllAudio();
        };
    }, []);

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0.9, opacity: 0 }}
                    className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Header */}
                    <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Sliders />
                                <h2 className="text-2xl font-bold">Sound Mixer</h2>
                                {!isPremium && (
                                    <span className="bg-yellow-400 text-black px-2 py-1 rounded-full text-xs font-medium">
                                        Demo Mode
                                    </span>
                                )}
                                {!isInitialized && (
                                    <span className="bg-blue-400 text-white px-2 py-1 rounded-full text-xs font-medium">
                                        Initializing Audio...
                                    </span>
                                )}
                            </div>
                            <button
                                onClick={onClose}
                                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors"
                            >
                                ✕
                            </button>
                        </div>
                    </div>

                    <div className="p-6 max-h-[calc(90vh-120px)] overflow-y-auto">
                        {/* Master Controls */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-6">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">Master Controls</h3>
                                <div className="flex items-center gap-2">
                                    <VolumeX />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.1"
                                        value={masterVolume}
                                        onChange={(e) => adjustMasterVolume(parseFloat(e.target.value))}
                                        className="w-32"
                                    />
                                    <Volume2 />
                                    <span className="text-sm font-medium w-12">
                                        {Math.round(masterVolume * 100)}%
                                    </span>
                                </div>
                            </div>

                            {/* Save Mix */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Mix name..."
                                    value={mixName}
                                    onChange={(e) => setMixName(e.target.value)}
                                    className="flex-1 px-3 py-2 border rounded-lg"
                                />
                                <button
                                    onClick={saveMix}
                                    disabled={playingSounds.length === 0}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <Save /> Save Mix
                                </button>
                            </div>
                        </div>

                        {/* Current Mix */}
                        {playingSounds.length > 0 && (
                            <div className="bg-blue-50 rounded-xl p-4 mb-6">
                                <h3 className="text-lg font-semibold mb-4">Current Mix ({playingSounds.length}/6)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {playingSounds.map(ps => (
                                        <div key={ps.sound.id} className="bg-white rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleSound(ps.sound.id)}
                                                        className={`p-1 rounded transition-colors ${ps.isPlaying ? 'bg-green-100 text-green-600' : 'bg-gray-100'
                                                            }`}
                                                    >
                                                        {ps.isPlaying ? <Pause /> : <Play />}
                                                    </button>
                                                    <span className="font-medium text-sm">{ps.sound.name}</span>
                                                </div>
                                                <button
                                                    onClick={() => removeSound(ps.sound.id)}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded"
                                                >
                                                    <Minus />
                                                </button>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <VolumeX />
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={ps.volume}
                                                    onChange={(e) => adjustSoundVolume(ps.sound.id, parseFloat(e.target.value))}
                                                    className="flex-1"
                                                />
                                                <Volume2 />
                                                <span className="text-xs w-8">{Math.round(ps.volume * 100)}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Sound Categories */}
                        <div className="flex flex-wrap gap-2 mb-4">
                            <button
                                onClick={() => setSelectedCategory('all')}
                                className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === 'all' ? 'bg-purple-500 text-white' : 'bg-gray-200'
                                    }`}
                            >
                                🌈 All
                            </button>
                            {soundCategories.map(category => (
                                <button
                                    key={category.id}
                                    onClick={() => setSelectedCategory(category.id)}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === category.id ? 'bg-purple-500 text-white' : 'bg-gray-200'
                                        }`}
                                >
                                    {category.icon} {category.name}
                                </button>
                            ))}\n                        </div>

                        {/* Available Sounds */}
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                            {filteredSounds.map(sound => {
                                const isAdded = playingSounds.some(ps => ps.sound.id === sound.id);
                                const isLocked = sound.isPremium && !isPremium;

                                return (
                                    <motion.button
                                        key={sound.id}
                                        onClick={() => !isLocked && !isAdded && addSound(sound)}
                                        disabled={isAdded || isLocked}
                                        className={`p-3 rounded-lg text-left transition-all ${isAdded
                                                ? 'bg-green-100 border-2 border-green-500'
                                                : isLocked
                                                    ? 'bg-gray-100 opacity-50 cursor-not-allowed'
                                                    : 'bg-white border-2 border-gray-200 hover:border-purple-300 hover:shadow-md'
                                            }`}
                                        whileHover={!isAdded && !isLocked ? { scale: 1.02 } : {}}
                                        whileTap={!isAdded && !isLocked ? { scale: 0.98 } : {}}
                                    >
                                        <div className="flex items-center justify-between mb-1">
                                            <span className="text-sm font-medium truncate">{sound.name}</span>
                                            {isLocked && <span className="text-xs">🔒</span>}
                                            {isAdded && <span className="text-green-600">✓</span>}
                                        </div>
                                        <p className="text-xs text-gray-600 mb-2 line-clamp-2">{sound.description}</p>
                                        <div className="flex items-center justify-between">
                                            <div className="text-xs text-gray-500">
                                                {sound.category.icon}
                                            </div>
                                            {!isAdded && !isLocked && (
                                                <Plus />
                                            )}
                                        </div>
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* Saved Mixes */}
                        {savedMixes.length > 0 && (
                            <div className="mt-6 bg-gray-50 rounded-xl p-4">
                                <h3 className="text-lg font-semibold mb-3">Saved Mixes</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                    {savedMixes.map(mix => (
                                        <div key={mix.id} className="bg-white rounded-lg p-3 shadow-sm">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="font-medium text-sm">{mix.name}</span>
                                                <button
                                                    onClick={() => {
                                                        const newMixes = savedMixes.filter(m => m.id !== mix.id);
                                                        setSavedMixes(newMixes);
                                                        localStorage.setItem('neuroflow-sound-mixes', JSON.stringify(newMixes));
                                                    }}
                                                    className="text-red-500 hover:bg-red-50 p-1 rounded text-xs"
                                                >
                                                    🗑️
                                                </button>
                                            </div>
                                            <p className="text-xs text-gray-600 mb-2">
                                                {mix.sounds.length} sounds • {Math.round(mix.masterVolume * 100)}% volume
                                            </p>
                                            <button
                                                onClick={() => loadMix(mix)}
                                                className="w-full py-1 bg-purple-500 text-white rounded text-xs hover:bg-purple-600 transition-colors"
                                            >
                                                Load Mix
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Premium Upgrade Notice */}
                        {!isPremium && (
                            <div className="mt-6 bg-gradient-to-r from-yellow-400 to-orange-400 text-white rounded-xl p-4 text-center">
                                <h3 className="font-bold mb-2">🌟 Unlock Full Sound Library</h3>
                                <p className="text-sm mb-3">
                                    Get access to 40+ premium sounds, unlimited mixes, and exclusive ambient soundscapes!
                                </p>
                                <p className="text-xs opacity-90">
                                    Upgrade to NeuroFlow Full for just $5
                                </p>
                            </div>
                        )}
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default SoundMixer;