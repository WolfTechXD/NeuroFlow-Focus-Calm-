import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import UpgradeButton from './ThemedUpgradeButton';
import { useTheme } from '../context/ThemeContext';
import AudioManager from '../utils/AudioManager';

export interface Sound {
    id: string;
    name: string;
    category: string;
    emoji: string;
    isPremium: boolean;
    description: string;
    src: string;
}

const soundLibrary: Sound[] = [
    // Nature Sounds
    { id: 'rain-gentle', name: 'Gentle Rain', category: 'nature', emoji: '🌧️', isPremium: false, description: 'Soft rainfall for focus' },
    { id: 'ocean-waves', name: 'Ocean Waves', category: 'nature', emoji: '🌊', isPremium: false, description: 'Rhythmic wave sounds' },
    { id: 'forest-birds', name: 'Forest Birds', category: 'nature', emoji: '🌲', isPremium: false, description: 'Peaceful bird songs' },
    { id: 'thunderstorm', name: 'Thunderstorm', category: 'nature', emoji: '⚡', isPremium: true, description: 'Dramatic storm sounds' },
    { id: 'wind-trees', name: 'Wind in Trees', category: 'nature', emoji: '🍃', isPremium: false, description: 'Gentle rustling leaves' },
    { id: 'fire-crackling', name: 'Crackling Fire', category: 'nature', emoji: '🔥', isPremium: true, description: 'Cozy fireplace sounds' },

    // Ambient Sounds
    { id: 'white-noise', name: 'White Noise', category: 'ambient', emoji: '📻', isPremium: false, description: 'Classic focus noise' },
    { id: 'pink-noise', name: 'Pink Noise', category: 'ambient', emoji: '🎵', isPremium: true, description: 'Deeper frequency noise' },
    { id: 'space-ambient', name: 'Space Ambience', category: 'ambient', emoji: '🌌', isPremium: true, description: 'Cosmic soundscape' },
    { id: 'crystal-tones', name: 'Crystal Tones', category: 'ambient', emoji: '💎', isPremium: true, description: 'Healing crystal sounds' },

    // Focus Sounds
    { id: 'binaural-40hz', name: '40Hz Binaural', category: 'focus', emoji: '🧠', isPremium: true, description: 'Gamma wave focus' },
    { id: 'focus-bells', name: 'Tibetan Bells', category: 'focus', emoji: '🔔', isPremium: false, description: 'Meditation bell sounds' },
    { id: 'typing-sounds', name: 'Keyboard Typing', category: 'focus', emoji: '⌨️', isPremium: false, description: 'Productive typing rhythm' },
    { id: 'metronome', name: 'Metronome', category: 'focus', emoji: '📏', isPremium: false, description: 'Rhythmic timing' },

    // Meditation Sounds
    { id: 'singing-bowls', name: 'Singing Bowls', category: 'meditation', emoji: '🎵', isPremium: false, description: 'Tibetan singing bowls' },
    { id: 'om-chanting', name: 'Om Chanting', category: 'meditation', emoji: '🧘', isPremium: true, description: 'Sacred mantra sounds' },
    { id: 'flute-meditation', name: 'Meditation Flute', category: 'meditation', emoji: '🪈', isPremium: true, description: 'Peaceful flute melodies' },
    { id: 'zen-garden', name: 'Zen Garden', category: 'meditation', emoji: '🪨', isPremium: true, description: 'Peaceful garden sounds' },

    // Urban Sounds
    { id: 'coffee-shop', name: 'Coffee Shop', category: 'urban', emoji: '☕', isPremium: false, description: 'Cozy cafe atmosphere' },
    { id: 'library-quiet', name: 'Quiet Library', category: 'urban', emoji: '📚', isPremium: false, description: 'Studious atmosphere' },
    { id: 'train-journey', name: 'Train Journey', category: 'urban', emoji: '🚆', isPremium: true, description: 'Rhythmic train sounds' },
    { id: 'city-rain', name: 'City in Rain', category: 'urban', emoji: '🏙️', isPremium: true, description: 'Urban rain ambience' },
];

interface PlayingSound {
    id: string;
    name: string;
    category: string;
    volume: number;
}

interface WorkingSoundLibraryProps {
    onUpgrade?: (plan: 'basic' | 'premium') => void;
    userSubscription?: {
        isPremium: boolean;
        plan: string;
    };
}

const WorkingSoundLibrary: React.FC<WorkingSoundLibraryProps> = ({ onUpgrade, userSubscription }) => {
    const { getBackgroundStyle, colors } = useTheme();
    const [selectedCategory, setSelectedCategory] = useState<string>('all');
    const [playingSounds, setPlayingSounds] = useState<PlayingSound[]>([]);
    const [isGuestMode] = useState(userSubscription?.plan === 'demo' || false);
    const audioManager = useRef(AudioManager.getInstance());

    const categories = ['all', 'nature', 'ambient', 'focus', 'meditation', 'urban'];

    const filteredSounds = selectedCategory === 'all'
        ? soundLibrary
        : soundLibrary.filter(sound => sound.category === selectedCategory);

    // Update playing sounds state from AudioManager
    useEffect(() => {
        const updatePlayingSounds = () => {
            const activeTracks = audioManager.current.getActiveTracks();
            const updatedSounds = activeTracks.map(track => ({
                id: track.id,
                name: track.name,
                category: track.category,
                volume: track.volume
            }));
            setPlayingSounds(updatedSounds);
        };

        // Update every second
        const interval = setInterval(updatePlayingSounds, 1000);
        updatePlayingSounds(); // Initial update

        return () => {
            clearInterval(interval);
            audioManager.current.cleanup();
        };
    }, []);

    const playSound = async (sound: Sound) => {
        // Check premium access
        if (sound.isPremium && isGuestMode) {
            alert(`🔒 Premium Sound

"${sound.name}" is a premium sound!

🌱 Basic Plan ($4.99): 10 basic nature sounds
⭐ Premium Plan ($9.99): 50+ premium sounds including binaural beats, meditation tones, and exclusive ambient compositions

Upgrade to Premium to unlock this sound!`);
            return;
        }

        try {
            // Generate audio buffer source for this sound
            const audioSrc = audioManager.current.generateSoundBuffer(sound.category, 10);
            const success = await audioManager.current.playSound(sound.id, sound.name, sound.category, audioSrc);
            if (!success) {
                alert(`🚫 Unable to play ${sound.name}. Please check your browser's audio settings and try again.\n\nTip: Some browsers require you to interact with the page first before playing audio.`);
            }
        } catch (error) {
            console.error('Error playing sound:', error);
            alert(`🚫 Audio Error: Unable to play ${sound.name}.\n\nYour browser may have blocked audio playback. Try clicking anywhere on the page first, then try again.`);
        }
    };

    const adjustVolume = (soundId: string, volume: number) => {
        audioManager.current.adjustVolume(soundId, volume);
        // Update local state
        setPlayingSounds(prev => prev.map(ps =>
            ps.id === soundId ? { ...ps, volume } : ps
        ));
    };

    const stopAllSounds = () => {
        audioManager.current.stopAllSounds();
        setPlayingSounds([]);
    };

    const isPlaying = (soundId: string) => audioManager.current.isPlaying(soundId);

    const testAudio = async () => {
        const success = await audioManager.current.testAudio();
        if (!success) {
            alert('🚫 Audio test failed. Please enable audio in your browser settings.');
        } else {
            alert('✅ Audio test successful! Your audio is working properly.');
        }
    };

    const getCategoryColor = (category: string) => {
        const colors = {
            nature: 'rgb(34, 197, 94)',
            ambient: 'rgb(139, 92, 246)',
            focus: 'rgb(236, 72, 153)',
            meditation: 'rgb(168, 85, 247)',
            urban: 'rgb(245, 158, 11)'
        };
        return colors[category as keyof typeof colors] || 'rgb(236, 72, 153)';
    };

    return (
        <div style={{
            ...getBackgroundStyle(),
            padding: '20px'
        }}>
            <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ textAlign: 'center', marginBottom: '40px' }}
                >
                    <h1 style={{
                        color: colors.textPrimary,
                        fontSize: '2.5rem',
                        fontWeight: 'bold',
                        marginBottom: '10px'
                    }}>
                        🎵 Sound Library
                        {playingSounds.length > 0 && (
                            <span style={{
                                background: 'rgba(255,255,255,0.2)',
                                color: 'white',
                                fontSize: '0.8rem',
                                padding: '4px 12px',
                                borderRadius: '20px',
                                marginLeft: '15px'
                            }}>
                                {playingSounds.length} playing
                            </span>
                        )}
                    </h1>
                    <p style={{
                        color: colors.textSecondary,
                        fontSize: '1.1rem',
                        maxWidth: '600px',
                        margin: '0 auto'
                    }}>
                        50+ ambient sounds for focus, relaxation, and productivity
                    </p>
                </motion.div>

                {/* Audio Controls */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '15px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    <motion.button
                        onClick={testAudio}
                        style={{
                            padding: '10px 20px',
                            background: 'rgba(255,255,255,0.2)',
                            color: colors.textPrimary,
                            border: '1px solid rgba(255,255,255,0.3)',
                            borderRadius: '8px',
                            fontWeight: '600',
                            cursor: 'pointer',
                            backdropFilter: 'blur(10px)'
                        }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        🔊 Test Audio
                    </motion.button>

                    {playingSounds.length > 0 && (
                        <motion.button
                            onClick={stopAllSounds}
                            style={{
                                padding: '10px 20px',
                                background: 'rgb(239, 68, 68)',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            ⏹️ Stop All
                        </motion.button>
                    )}
                </div>

                {/* Category Filter */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '10px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    {categories.map(category => (
                        <motion.button
                            key={category}
                            onClick={() => setSelectedCategory(category)}
                            style={{
                                padding: '8px 16px',
                                borderRadius: '20px',
                                border: 'none',
                                fontWeight: '600',
                                cursor: 'pointer',
                                background: selectedCategory === category
                                    ? 'white'
                                    : 'rgba(255,255,255,0.2)',
                                color: selectedCategory === category
                                    ? getCategoryColor(category)
                                    : colors.textPrimary,
                                backdropFilter: 'blur(10px)',
                                transition: 'all 0.2s ease'
                            }}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            {category === 'all' ? '🌈 All' :
                                category === 'nature' ? '🌿 Nature' :
                                    category === 'ambient' ? '🌌 Ambient' :
                                        category === 'focus' ? '🎯 Focus' :
                                            category === 'meditation' ? '🧘 Meditation' :
                                                '🏙️ Urban'}
                        </motion.button>
                    ))}
                </div>

                {/* Sound Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '20px',
                    marginBottom: '40px'
                }}>
                    {filteredSounds.map((sound, index) => {
                        const playing = isPlaying(sound.id);
                        const playingSound = playingSounds.find(ps => ps.id === sound.id);

                        return (
                            <motion.div
                                key={sound.id}
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: index * 0.05 }}
                                style={{
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: '15px',
                                    padding: '20px',
                                    boxShadow: playing
                                        ? `0 0 25px ${getCategoryColor(sound.category)}80, 0 0 50px ${getCategoryColor(sound.category)}40`
                                        : '0 8px 32px rgba(0,0,0,0.1)',
                                    backdropFilter: 'blur(10px)',
                                    border: playing
                                        ? `3px solid ${getCategoryColor(sound.category)}`
                                        : '1px solid rgba(255,255,255,0.3)',
                                    transition: 'all 0.3s ease',
                                    transform: playing ? 'scale(1.02)' : 'scale(1)'
                                }}
                            >
                                {/* Sound Header */}
                                <div style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    marginBottom: '15px'
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <motion.span
                                            style={{
                                                fontSize: '2rem',
                                                filter: playing ? 'none' : 'grayscale(30%)',
                                                textShadow: playing ? `0 0 10px ${getCategoryColor(sound.category)}80` : 'none'
                                            }}
                                            animate={playing ? {
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 8, -8, 0],
                                                textShadow: [
                                                    `0 0 10px ${getCategoryColor(sound.category)}80`,
                                                    `0 0 20px ${getCategoryColor(sound.category)}`,
                                                    `0 0 10px ${getCategoryColor(sound.category)}80`
                                                ]
                                            } : {}}
                                            transition={{
                                                duration: 2,
                                                repeat: playing ? Infinity : 0,
                                                ease: "easeInOut"
                                            }}
                                        >
                                            {sound.emoji}
                                        </motion.span>
                                        <div>
                                            <h3 style={{
                                                margin: 0,
                                                color: 'rgb(64, 64, 64)',
                                                fontSize: '1.1rem',
                                                fontWeight: 'bold'
                                            }}>
                                                {sound.name}
                                                {sound.isPremium && <span style={{ marginLeft: '5px' }}>💎</span>}
                                            </h3>
                                            <p style={{
                                                margin: '2px 0 0 0',
                                                color: 'rgb(117, 117, 117)',
                                                fontSize: '0.85rem'
                                            }}>
                                                {sound.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>

                                {/* Volume Control */}
                                {playing && playingSound && (
                                    <motion.div
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: 'auto' }}
                                        style={{ marginBottom: '15px' }}
                                    >
                                        <label style={{
                                            fontSize: '0.8rem',
                                            color: 'rgb(117, 117, 117)',
                                            display: 'block',
                                            marginBottom: '5px'
                                        }}>
                                            Volume: {Math.round(playingSound.volume * 100)}%
                                        </label>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={playingSound.volume}
                                            onChange={(e) => adjustVolume(sound.id, parseFloat(e.target.value))}
                                            style={{
                                                width: '100%',
                                                accentColor: getCategoryColor(sound.category)
                                            }}
                                        />
                                    </motion.div>
                                )}

                                {/* Play Button */}
                                <motion.button
                                    onClick={() => playSound(sound)}
                                    style={{
                                        width: '100%',
                                        padding: '12px',
                                        background: playing
                                            ? 'rgb(239, 68, 68)'
                                            : getCategoryColor(sound.category),
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        fontWeight: 'bold',
                                        cursor: 'pointer',
                                        fontSize: '0.9rem'
                                    }}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    disabled={sound.isPremium && isGuestMode && !playing}
                                >
                                    {playing ? '⏹️ Stop' : '▶️ Play'}
                                    {sound.isPremium && isGuestMode && ' (Premium)'}
                                </motion.button>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Currently Playing Panel */}
                <AnimatePresence>
                    {playingSounds.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 50 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 50 }}
                            style={{
                                position: 'fixed',
                                bottom: '20px',
                                left: '20px',
                                right: '20px',
                                maxWidth: '400px',
                                margin: '0 auto',
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '15px',
                                padding: '20px',
                                boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
                                backdropFilter: 'blur(10px)',
                                border: '1px solid rgba(255,255,255,0.3)',
                                zIndex: 1000
                            }}
                        >
                            <h4 style={{
                                margin: '0 0 15px 0',
                                color: 'rgb(190, 24, 93)',
                                fontSize: '1.1rem',
                                fontWeight: 'bold'
                            }}>
                                🎛️ Sound Mixer ({playingSounds.length} active)
                            </h4>

                            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
                                {playingSounds.map(playingSound => {
                                    const sound = soundLibrary.find(s => s.id === playingSound.id);
                                    return sound ? (
                                        <div key={sound.id} style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            marginBottom: '10px',
                                            padding: '8px',
                                            background: `${getCategoryColor(sound.category)}15`,
                                            borderRadius: '8px',
                                            gap: '10px',
                                            border: `1px solid ${getCategoryColor(sound.category)}30`
                                        }}>
                                            <motion.span
                                                style={{ fontSize: '1.2rem' }}
                                                animate={{
                                                    scale: [1, 1.1, 1],
                                                    rotate: [0, 5, -5, 0]
                                                }}
                                                transition={{
                                                    duration: 2,
                                                    repeat: Infinity,
                                                    ease: "easeInOut"
                                                }}
                                            >
                                                {sound.emoji}
                                            </motion.span>
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '0.9rem',
                                                    fontWeight: '600',
                                                    color: 'rgb(64, 64, 64)',
                                                    marginBottom: '2px'
                                                }}>
                                                    {sound.name}
                                                </div>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={playingSound.volume}
                                                    onChange={(e) => adjustVolume(sound.id, parseFloat(e.target.value))}
                                                    style={{
                                                        width: '100%',
                                                        accentColor: getCategoryColor(sound.category)
                                                    }}
                                                />
                                            </div>
                                            <button
                                                onClick={() => playSound(sound)}
                                                style={{
                                                    background: 'rgb(239, 68, 68)',
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '4px',
                                                    padding: '4px 8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.7rem'
                                                }}
                                            >
                                                ×
                                            </button>
                                        </div>
                                    ) : null;
                                })}
                            </div>

                            <div style={{ display: 'flex', gap: '8px', marginTop: '15px' }}>
                                <button
                                    onClick={stopAllSounds}
                                    style={{
                                        flex: 1,
                                        padding: '10px',
                                        background: 'rgb(239, 68, 68)',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem'
                                    }}
                                >
                                    ⏹️ Stop All
                                </button>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Upgrade CTA */}
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                    style={{
                        marginTop: '40px',
                        padding: '30px',
                        background: 'rgba(255,255,255,0.95)',
                        borderRadius: '15px',
                        textAlign: 'center',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255,255,255,0.3)'
                    }}
                >
                    <h3 style={{ color: 'rgb(190, 24, 93)', marginBottom: '15px' }}>
                        🎵 Unlock Premium Sound Library
                    </h3>
                    <p style={{ color: 'rgb(117, 117, 117)', marginBottom: '20px' }}>
                        Get access to 50+ premium sounds including binaural beats, nature recordings,
                        and exclusive ambient compositions designed for neurodivergent minds.
                    </p>
                    <UpgradeButton variant="primary" context="sound-library" onUpgrade={onUpgrade} />
                </motion.div>
            </div>
        </div>
    );
};

export default WorkingSoundLibrary;