import React, { useState, useEffect } from 'react';
import ZenMode from './pages/ZenMode';

// Debug logging for blank screen troubleshooting
console.log('🔍 App.tsx: Starting module load...');

// TTS Voice Loading for better quality voices
let availableVoices: SpeechSynthesisVoice[] = [];
let voicesLoaded = false;

const loadVoices = () => {
    if ('speechSynthesis' in window) {
        const updateVoices = () => {
            availableVoices = speechSynthesis.getVoices();
            voicesLoaded = true;
            console.log('🎤 Available TTS voices loaded:', availableVoices.length);

            // Log premium/high-quality voices found
            const premiumVoices = availableVoices.filter(voice =>
                voice.name.includes('Google') ||
                voice.name.includes('Microsoft') ||
                voice.name.includes('Natural') ||
                voice.name.includes('Premium') ||
                voice.voiceURI.includes('premium')
            );
            console.log('🎆 Premium voices found:', premiumVoices.map(v => v.name));
        };

        // Load voices immediately if available
        updateVoices();

        // Also listen for the voiceschanged event (Chrome requirement)
        speechSynthesis.onvoiceschanged = updateVoices;
    }
};

// Load voices immediately
loadVoices();

// Enhanced TTS function with voice selection
const speakText = (text: string, options: { title?: string; premium?: boolean } = {}) => {
    if (!('speechSynthesis' in window)) {
        console.warn('⚠️ TTS not supported in this browser');
        return false;
    }

    // Stop any current speech
    speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);

    // Enhanced voice selection
    if (voicesLoaded && availableVoices.length > 0) {
        // Prefer high-quality voices
        const premiumVoices = availableVoices.filter(voice =>
            voice.name.includes('Google') ||
            voice.name.includes('Microsoft') ||
            voice.name.includes('Natural') ||
            voice.name.includes('Premium')
        );

        // Try to find English voices
        const englishVoices = availableVoices.filter(voice =>
            voice.lang.startsWith('en-')
        );

        let selectedVoice = null;

        if (options.premium && premiumVoices.length > 0) {
            selectedVoice = premiumVoices[0];
        } else if (englishVoices.length > 0) {
            selectedVoice = englishVoices[0];
        } else {
            selectedVoice = availableVoices[0];
        }

        utterance.voice = selectedVoice;
        console.log('🎤 Selected voice:', selectedVoice?.name);
    }

    // Enhanced speech parameters
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 0.8;

    // Event listeners
    utterance.onstart = () => {
        console.log('🗣️ Started speaking:', options.title || 'text');
    };
    utterance.onend = () => {
        console.log('✅ Finished speaking:', options.title || 'text');
    };
    utterance.onerror = (event) => {
        console.error('❌ TTS Error:', event.error);
    };

    speechSynthesis.speak(utterance);
    return true;
};

// Progressive import testing
try {
    console.log('🔍 Testing React import...', React);
} catch (e) {
    console.error('❌ React import failed:', e);
}

// Test Framer Motion import
let motion: any, AnimatePresence: any;
try {
    const framerMotion = require('framer-motion');
    motion = framerMotion.motion;
    AnimatePresence = framerMotion.AnimatePresence;
    console.log('✅ Framer Motion imported successfully');
} catch (e) {
    console.error('❌ Framer Motion import failed:', e);
    // Fallback to basic div elements
    motion = {
        div: 'div',
        button: 'button'
    };
    AnimatePresence = ({ children }: any) => children;
    console.log('🔄 Using fallback motion components');
}

// Enhanced Types for Full Functionality
interface Task {
    id: string;
    title: string;
    description?: string;
    completed: boolean;
    xpReward: number;
    category: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: Date;
    completedAt?: Date;
    estimatedTime?: number;
}

interface User {
    name: string;
    email?: string;
    xp: number;
    level: number;
    isGuest: boolean;
    avatar: string;
    streak: number;
    totalPoints: number;
    achievements: Achievement[];
    preferences: UserPreferences;
    subscription: SubscriptionStatus;
}

interface Achievement {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt: Date;
    xpReward: number;
    type: 'streak' | 'tasks' | 'focus' | 'zen' | 'special';
}

interface UserPreferences {
    theme: 'light' | 'dark' | 'colorful';
    soundEnabled: boolean;
    animationsEnabled: boolean;
    notificationsEnabled: boolean;
    difficultyLevel: 'easy' | 'medium' | 'hard';
    focusSessionLength: number;
    breakLength: number;
}

interface SubscriptionStatus {
    isPremium: boolean;
    plan: 'demo' | 'base' | 'full';
    purchaseDate?: Date;
    expiryDate?: Date;
}

interface AppState {
    user: User;
    tasks: Task[];
    currentPage: 'dashboard' | 'tasks' | 'zen' | 'sounds' | 'tips' | 'guides' | 'profile' | 'settings';
    soundLibrary: Sound[];
    activeSounds: ActiveSound[];
    zenSession?: ZenSession;
    achievements: Achievement[];
    dailyStats: DailyStats[];
}

interface DailyStats {
    date: string;
    tasksCompleted: number;
    focusMinutes: number;
    zenMinutes: number;
    xpEarned: number;
    streakDay: boolean;
}

interface Sound {
    id: string;
    name: string;
    category: 'nature' | 'ambient' | 'focus' | 'meditation' | 'urban';
    emoji: string;
    isPremium: boolean;
    audioUrl?: string;
    duration?: number;
    description?: string;
}

interface ActiveSound {
    soundId: string;
    volume: number;
    isPlaying: boolean;
    audioContext?: AudioContext;
    source?: OscillatorNode | AudioBufferSourceNode;
    gainNode?: GainNode;
    stopFunction?: () => void;
    lfo?: OscillatorNode;
    lfoGain?: GainNode;
}

interface ZenSession {
    type: 'breathing' | 'meditation' | 'mindfulness';
    duration: number;
    startTime: Date;
    isActive: boolean;
    currentPhase?: string;
}

// Enhanced NeuroFlow App with Progressive Loading and Debug Feedback
function App() {
    console.log('🔍 App component: Starting initialization...');

    // Basic state initialization with error handling
    const [currentView, setCurrentView] = useState<'landing' | 'signin' | 'app'>('landing');
    const [appState, setAppState] = useState<AppState | null>(null);
    const [isDebugMode, setIsDebugMode] = useState(false); // Debug mode disabled for production
    const [loadingStage, setLoadingStage] = useState('initializing'); // Start with debugging

    // Progressive initialization for debugging
    useEffect(() => {
        console.log('🔍 App useEffect: Starting progressive initialization...');

        // Stage 1: Basic verification
        setTimeout(() => {
            setLoadingStage('dom-ready');
            console.log('✅ Stage 1: DOM Ready');

            // Stage 2: Component test
            setTimeout(() => {
                setLoadingStage('components-ready');
                console.log('✅ Stage 2: Components Ready');

                // Stage 3: Load saved theme
                const savedTheme = localStorage.getItem('neuroflow-theme') as 'light' | 'dark' | 'colorful';
                if (savedTheme) {
                    setCurrentTheme(savedTheme);
                    console.log('🎨 Loaded saved theme:', savedTheme);
                }

                // Stage 4: Ready (auto-continue to app)
                setTimeout(() => {
                    setLoadingStage('ready');
                    console.log('✅ Stage 4: App Fully Ready');
                    // Don't auto-disable debug, let user choose
                }, 2000);
            }, 1000);
        }, 1000);
    }, []);

    const [currentTheme, setCurrentTheme] = useState<'light' | 'dark' | 'colorful'>('colorful');

    // Theme change handler
    const changeTheme = (theme: 'light' | 'dark' | 'colorful') => {
        setCurrentTheme(theme);
        localStorage.setItem('neuroflow-theme', theme);
        console.log('🎨 Theme changed to:', theme);
    };

    // Get theme-based background gradient with enhanced pink themes per memory specification
    const getThemeBackground = () => {
        switch (currentTheme) {
            case 'dark':
                // Deep pink/purple gradient for dark theme
                return 'linear-gradient(135deg, #1a0b1e 0%, #2d1b3d 30%, #4c1d3d 60%, #2d1b3d 100%)';
            case 'light':
                // Soft pink gradient for light theme
                return 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 30%, #fbcfe8 60%, #fae8ff 100%)';
            case 'colorful':
            default:
                // Vibrant pink gradient for colorful theme
                return 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 30%, rgb(147, 197, 253) 60%, rgb(59, 130, 246) 100%)';
        }
    };

    const getThemeTextColor = () => {
        switch (currentTheme) {
            case 'dark':
                return '#a855f7'; // Purple text for dark theme
            case 'light':
                return '#1e40af'; // Blue text for light theme
            case 'colorful':
            default:
                return '#0c4a6e'; // Deep blue text for colorful theme
        }
    };

    const getThemeCardBackground = () => {
        switch (currentTheme) {
            case 'dark':
                return 'linear-gradient(145deg, #1e293b 0%, #3b0764 100%)';
            case 'light':
                return 'linear-gradient(145deg, #ffffff 0%, #f0f9ff 100%)';
            case 'colorful':
            default:
                return 'linear-gradient(145deg, rgba(255, 255, 255, 0.95) 0%, rgba(240, 249, 255, 0.9) 100%)';
        }
    };

    // State management with error boundaries
    let audioManager: any;
    try {
        const [audioManagerInstance] = useState(() => createAudioManager());
        audioManager = audioManagerInstance;
        console.log('✅ AudioManager initialized successfully');
    } catch (e) {
        console.error('❌ AudioManager initialization failed:', e);
        audioManager = {
            playSound: () => console.log('AudioManager fallback: playSound'),
            stopSound: () => console.log('AudioManager fallback: stopSound'),
            stopAllSounds: () => console.log('AudioManager fallback: stopAllSounds'),
            getActiveSounds: () => []
        };
    }

    const [showModal, setShowModal] = useState<{
        type: 'achievement' | 'levelup' | 'task-complete' | 'sound-info' | 'settings' | null;
        data?: any;
    }>({ type: null });
    const [isLoading, setIsLoading] = useState(false);

    console.log('🔍 Current view:', currentView, 'App state:', !!appState, 'Loading stage:', loadingStage);

    // Early return for debug visualization
    if (isDebugMode) {
        return (
            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 30%, rgb(147, 197, 253) 60%, rgb(59, 130, 246) 100%)',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: 'Arial, sans-serif',
                padding: '20px',
                textAlign: 'center'
            }}>
                <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠✨</div>
                <h1 style={{ color: '#3b82f6', marginBottom: '20px' }}>NeuroFlow Debug Mode</h1>
                <div style={{
                    background: 'white',
                    padding: '30px',
                    borderRadius: '15px',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                    maxWidth: '500px',
                    width: '100%'
                }}>
                    <h3 style={{ color: '#1e293b', marginBottom: '15px' }}>Progressive Loading Status</h3>
                    <div style={{ textAlign: 'left', marginBottom: '20px' }}>
                        <div style={{
                            color: loadingStage === 'initializing' ? '#f59e0b' : '#10b981',
                            marginBottom: '5px'
                        }}>
                            {loadingStage === 'initializing' ? '🔄' : '✅'} Stage 1: Initializing
                        </div>
                        <div style={{
                            color: ['initializing'].includes(loadingStage) ? '#94a3b8' :
                                loadingStage === 'dom-ready' ? '#f59e0b' : '#10b981',
                            marginBottom: '5px'
                        }}>
                            {['initializing'].includes(loadingStage) ? '⏳' :
                                loadingStage === 'dom-ready' ? '🔄' : '✅'} Stage 2: DOM Ready
                        </div>
                        <div style={{
                            color: ['initializing', 'dom-ready'].includes(loadingStage) ? '#94a3b8' :
                                loadingStage === 'components-ready' ? '#f59e0b' : '#10b981',
                            marginBottom: '5px'
                        }}>
                            {['initializing', 'dom-ready'].includes(loadingStage) ? '⏳' :
                                loadingStage === 'components-ready' ? '🔄' : '✅'} Stage 3: Components Ready
                        </div>
                        <div style={{
                            color: loadingStage === 'ready' ? '#10b981' : '#94a3b8'
                        }}>
                            {loadingStage === 'ready' ? '✅' : '⏳'} Stage 4: App Ready
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            setIsDebugMode(false);
                            console.log('🚀 Manual override: Skipping to full app');
                        }}
                        style={{
                            padding: '10px 20px',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            fontWeight: 'bold'
                        }}
                    >
                        🚀 Skip to App
                    </button>
                </div>
            </div>
        );
    }

    // Enhanced Sound Library (50+ sounds as per design document)
    const createSoundLibrary = (): Sound[] => [
        // Nature Sounds (15 sounds)
        { id: 'rain-gentle', name: 'Gentle Rain', category: 'nature', emoji: '🌧️', isPremium: false, description: 'Soft rainfall for focus' },
        { id: 'rain-heavy', name: 'Heavy Rain', category: 'nature', emoji: '⛈️', isPremium: true, description: 'Intense rainfall ambience' },
        { id: 'ocean-waves', name: 'Ocean Waves', category: 'nature', emoji: '🌊', isPremium: false, description: 'Rhythmic wave sounds' },
        { id: 'forest-birds', name: 'Forest Birds', category: 'nature', emoji: '🌲', isPremium: false, description: 'Peaceful bird songs' },
        { id: 'thunderstorm', name: 'Thunderstorm', category: 'nature', emoji: '⚡', isPremium: true, description: 'Dramatic storm sounds' },
        { id: 'wind-trees', name: 'Wind in Trees', category: 'nature', emoji: '🍃', isPremium: false, description: 'Gentle rustling leaves' },
        { id: 'stream-water', name: 'Mountain Stream', category: 'nature', emoji: '🏔️', isPremium: true, description: 'Babbling brook sounds' },
        { id: 'crickets', name: 'Night Crickets', category: 'nature', emoji: '🦗', isPremium: false, description: 'Evening cricket chorus' },
        { id: 'fire-crackling', name: 'Crackling Fire', category: 'nature', emoji: '🔥', isPremium: true, description: 'Cozy fireplace sounds' },
        { id: 'wind-cave', name: 'Cave Wind', category: 'nature', emoji: '🌬️', isPremium: true, description: 'Mysterious cave ambience' },
        { id: 'beach-waves', name: 'Beach Waves', category: 'nature', emoji: '🏖️', isPremium: false, description: 'Tropical beach sounds' },
        { id: 'jungle-sounds', name: 'Jungle Ambience', category: 'nature', emoji: '🌴', isPremium: true, description: 'Tropical rainforest' },
        { id: 'winter-wind', name: 'Winter Wind', category: 'nature', emoji: '❄️', isPremium: true, description: 'Cold mountain winds' },
        { id: 'desert-night', name: 'Desert Night', category: 'nature', emoji: '🌵', isPremium: true, description: 'Quiet desert evening' },
        { id: 'meadow-breeze', name: 'Meadow Breeze', category: 'nature', emoji: '🌾', isPremium: false, description: 'Peaceful grass fields' },

        // Ambient Sounds (12 sounds)
        { id: 'white-noise', name: 'White Noise', category: 'ambient', emoji: '📻', isPremium: false, description: 'Classic focus noise' },
        { id: 'pink-noise', name: 'Pink Noise', category: 'ambient', emoji: '🎵', isPremium: true, description: 'Deeper frequency noise' },
        { id: 'brown-noise', name: 'Brown Noise', category: 'ambient', emoji: '🎼', isPremium: true, description: 'Deep rumbling noise' },
        { id: 'space-ambient', name: 'Space Ambience', category: 'ambient', emoji: '🌌', isPremium: true, description: 'Cosmic soundscape' },
        { id: 'drone-deep', name: 'Deep Drone', category: 'ambient', emoji: '🔊', isPremium: true, description: 'Meditative drone sounds' },
        { id: 'ethereal-pad', name: 'Ethereal Pad', category: 'ambient', emoji: '✨', isPremium: true, description: 'Floating ambient pad' },
        { id: 'crystal-tones', name: 'Crystal Tones', category: 'ambient', emoji: '💎', isPremium: true, description: 'Healing crystal sounds' },
        { id: 'cosmic-wind', name: 'Cosmic Wind', category: 'ambient', emoji: '🌠', isPremium: true, description: 'Interstellar atmosphere' },
        { id: 'void-sounds', name: 'Void Ambience', category: 'ambient', emoji: '🕳️', isPremium: true, description: 'Deep space silence' },
        { id: 'energy-flow', name: 'Energy Flow', category: 'ambient', emoji: '⚡', isPremium: true, description: 'Flowing energy sounds' },
        { id: 'harmonic-drone', name: 'Harmonic Drone', category: 'ambient', emoji: '🎯', isPremium: false, description: 'Balanced frequencies' },
        { id: 'ambient-bells', name: 'Ambient Bells', category: 'ambient', emoji: '🔔', isPremium: false, description: 'Floating bell tones' },

        // Focus Sounds (8 sounds)
        { id: 'binaural-40hz', name: '40Hz Binaural', category: 'focus', emoji: '🧠', isPremium: true, description: 'Gamma wave focus' },
        { id: 'binaural-10hz', name: '10Hz Alpha Waves', category: 'focus', emoji: '💫', isPremium: true, description: 'Relaxed alertness' },
        { id: 'focus-bells', name: 'Tibetan Bells', category: 'focus', emoji: '🔔', isPremium: false, description: 'Meditation bell sounds' },
        { id: 'typing-sounds', name: 'Keyboard Typing', category: 'focus', emoji: '⌨️', isPremium: false, description: 'Productive typing rhythm' },
        { id: 'clock-ticking', name: 'Clock Ticking', category: 'focus', emoji: '⏰', isPremium: false, description: 'Steady time keeping' },
        { id: 'metronome', name: 'Metronome', category: 'focus', emoji: '📏', isPremium: false, description: 'Rhythmic timing' },
        { id: 'brain-waves', name: 'Brain Waves', category: 'focus', emoji: '🌊', isPremium: true, description: 'Cognitive enhancement' },
        { id: 'study-ambience', name: 'Study Ambience', category: 'focus', emoji: '📚', isPremium: true, description: 'Productive atmosphere' },

        // Meditation Sounds (10 sounds)
        { id: 'singing-bowls', name: 'Singing Bowls', category: 'meditation', emoji: '🎵', isPremium: false, description: 'Tibetan singing bowls' },
        { id: 'temple-bells', name: 'Temple Bells', category: 'meditation', emoji: '🎯', isPremium: true, description: 'Sacred temple sounds' },
        { id: 'om-chanting', name: 'Om Chanting', category: 'meditation', emoji: '🧘', isPremium: true, description: 'Sacred mantra sounds' },
        { id: 'flute-meditation', name: 'Meditation Flute', category: 'meditation', emoji: '🪈', isPremium: true, description: 'Peaceful flute melodies' },
        { id: 'gong-sounds', name: 'Meditation Gong', category: 'meditation', emoji: '🥇', isPremium: true, description: 'Deep gong resonance' },
        { id: 'zen-garden', name: 'Zen Garden', category: 'meditation', emoji: '🪨', isPremium: true, description: 'Peaceful garden sounds' },
        { id: 'prayer-bells', name: 'Prayer Bells', category: 'meditation', emoji: '🛎️', isPremium: false, description: 'Spiritual bell tones' },
        { id: 'bamboo-chimes', name: 'Bamboo Chimes', category: 'meditation', emoji: '🎋', isPremium: false, description: 'Gentle wind chimes' },
        { id: 'meditation-drone', name: 'Meditation Drone', category: 'meditation', emoji: '🕉️', isPremium: true, description: 'Deep meditation tone' },
        { id: 'chakra-tones', name: 'Chakra Tones', category: 'meditation', emoji: '🌈', isPremium: true, description: 'Healing frequencies' },

        // Urban Sounds (5 sounds)
        { id: 'coffee-shop', name: 'Coffee Shop', category: 'urban', emoji: '☕', isPremium: false, description: 'Cozy cafe atmosphere' },
        { id: 'library-quiet', name: 'Quiet Library', category: 'urban', emoji: '📚', isPremium: false, description: 'Studious atmosphere' },
        { id: 'train-journey', name: 'Train Journey', category: 'urban', emoji: '🚆', isPremium: true, description: 'Rhythmic train sounds' },
        { id: 'city-rain', name: 'City in Rain', category: 'urban', emoji: '🏙️', isPremium: true, description: 'Urban rain ambience' },
        { id: 'office-ambient', name: 'Busy Office', category: 'urban', emoji: '🏢', isPremium: true, description: 'Productive office sounds' }
    ];

    // Enhanced Audio Management System (Singleton Pattern)
    const createAudioManager = () => {
        let audioContext: AudioContext | null = null;
        let activeSounds: Map<string, ActiveSound> = new Map();

        const getAudioContext = () => {
            if (!audioContext) {
                audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
                // Resume context if needed
                if (audioContext.state === 'suspended') {
                    audioContext.resume();
                }
            }
            return audioContext;
        };

        const playSound = (soundId: string, volume: number = 0.5) => {
            // Stop existing sound if playing
            stopSound(soundId);

            const context = getAudioContext();

            // Ensure context is resumed (browser requirement)
            if (context.state === 'suspended') {
                context.resume();
            }

            const oscillator = context.createOscillator();
            const gainNode = context.createGain();
            const filterNode = context.createBiquadFilter();

            // Connect audio chain: oscillator -> filter -> gain -> destination
            oscillator.connect(filterNode);
            filterNode.connect(gainNode);
            gainNode.connect(context.destination);

            // Enhanced frequency mapping for different sound types
            const soundSettings: Record<string, { freq: number; type: OscillatorType; filter?: number; modulation?: boolean }> = {
                'rain-gentle': { freq: 200, type: 'sine', filter: 1000, modulation: true },
                'rain-heavy': { freq: 180, type: 'sawtooth', filter: 800, modulation: true },
                'ocean-waves': { freq: 150, type: 'sine', filter: 600, modulation: true },
                'forest-birds': { freq: 800, type: 'square', filter: 2000 },
                'white-noise': { freq: 440, type: 'sawtooth', filter: 4000 },
                'pink-noise': { freq: 220, type: 'sawtooth', filter: 2000 },
                'brown-noise': { freq: 110, type: 'sawtooth', filter: 1000 },
                'singing-bowls': { freq: 256, type: 'sine', filter: 800 },
                'coffee-shop': { freq: 300, type: 'triangle', filter: 1500, modulation: true },
                'binaural-40hz': { freq: 440, type: 'sine', filter: 1000 },
                'meditation-drone': { freq: 128, type: 'sine', filter: 500 }
            };

            const settings = soundSettings[soundId] || { freq: 220, type: 'sine' as OscillatorType, filter: 1000 };

            // Set oscillator properties
            oscillator.frequency.setValueAtTime(settings.freq, context.currentTime);
            oscillator.type = settings.type;

            // Set filter properties for better sound quality
            if (settings.filter) {
                filterNode.type = 'lowpass';
                filterNode.frequency.setValueAtTime(settings.filter, context.currentTime);
                filterNode.Q.setValueAtTime(1, context.currentTime);
            }

            // Set volume with proper scaling (0.3 max to prevent harsh sounds)
            const safeVolume = Math.min(volume * 0.3, 0.3);
            gainNode.gain.setValueAtTime(safeVolume, context.currentTime);

            // Add subtle modulation for nature sounds
            if (settings.modulation) {
                const lfo = context.createOscillator();
                const lfoGain = context.createGain();
                lfo.frequency.setValueAtTime(0.5, context.currentTime);
                lfo.type = 'sine';
                lfoGain.gain.setValueAtTime(settings.freq * 0.02, context.currentTime); // 2% modulation
                lfo.connect(lfoGain);
                lfoGain.connect(oscillator.frequency);
                lfo.start();

                // Store LFO reference for cleanup
                activeSounds.set(soundId, {
                    ...activeSounds.get(soundId),
                    lfo,
                    lfoGain
                });
            }

            oscillator.start();

            const activeSound: ActiveSound = {
                soundId,
                volume,
                isPlaying: true,
                audioContext: context,
                source: oscillator,
                gainNode,
                stopFunction: () => {
                    try {
                        oscillator.stop();
                        // Clean up modulation if it exists
                        const sound = activeSounds.get(soundId);
                        if (sound?.lfo) {
                            sound.lfo.stop();
                        }
                    } catch (e) {
                        // Oscillator already stopped
                    }
                    activeSounds.delete(soundId);
                }
            };

            activeSounds.set(soundId, activeSound);

            console.log(`🎵 Successfully started sound: ${soundId} at volume ${safeVolume}`);
            return activeSound.stopFunction;
        };

        const stopSound = (soundId: string) => {
            const activeSound = activeSounds.get(soundId);
            if (activeSound && activeSound.stopFunction) {
                activeSound.stopFunction();
            }
        };

        const adjustVolume = (soundId: string, volume: number) => {
            const activeSound = activeSounds.get(soundId);
            if (activeSound && activeSound.gainNode) {
                activeSound.gainNode.gain.setValueAtTime(volume * 0.15, activeSound.audioContext!.currentTime);
                activeSound.volume = volume;
            }
        };

        const stopAllSounds = () => {
            activeSounds.forEach((activeSound) => {
                if (activeSound.stopFunction) {
                    activeSound.stopFunction();
                }
            });
            activeSounds.clear();
        };

        const getActiveSounds = () => Array.from(activeSounds.values());

        return { playSound, stopSound, adjustVolume, stopAllSounds, getActiveSounds };
    };

    // Calculate user level from XP
    const calculateLevel = (xp: number): number => {
        return Math.floor(xp / 1000) + 1;
    };

    // Handle sign in with enhanced app state and error handling
    const handleSignIn = (email: string) => {
        console.log('✅ handleSignIn called with:', email);

        try {
            setIsLoading(true);

            const newUser: User = {
                name: email.split('@')[0] || 'User',
                email,
                xp: 150,
                level: 1,
                isGuest: false,
                avatar: '🧠',
                streak: 0,
                totalPoints: 150,
                achievements: [],
                preferences: {
                    theme: 'colorful',
                    soundEnabled: true,
                    animationsEnabled: true,
                    notificationsEnabled: true,
                    difficultyLevel: 'medium',
                    focusSessionLength: 25,
                    breakLength: 5
                },
                subscription: {
                    isPremium: false,
                    plan: 'demo'
                }
            };

            const newAppState: AppState = {
                user: newUser,
                tasks: [
                    {
                        id: '1',
                        title: 'Complete your first task',
                        completed: false,
                        xpReward: 50,
                        category: 'Getting Started',
                        priority: 'medium',
                        createdAt: new Date()
                    },
                    {
                        id: '2',
                        title: 'Try the breathing exercise',
                        completed: false,
                        xpReward: 25,
                        category: 'Wellness',
                        priority: 'low',
                        createdAt: new Date()
                    },
                    {
                        id: '3',
                        title: 'Listen to focus sounds for 5 minutes',
                        completed: false,
                        xpReward: 30,
                        category: 'Focus',
                        priority: 'low',
                        createdAt: new Date()
                    }
                ],
                currentPage: 'dashboard',
                soundLibrary: createSoundLibrary(),
                activeSounds: [],
                achievements: [],
                dailyStats: []
            };

            console.log('📦 Created app state for user:', newUser.name);

            // Simulate brief loading
            setTimeout(() => {
                setAppState(newAppState);
                setCurrentView('app');
                setIsLoading(false);
                console.log('🚀 Successfully navigated to app');
            }, 800);

        } catch (error) {
            console.error('❌ handleSignIn error:', error);
            setIsLoading(false);
            alert('Sign in failed. Please try again.');
        }
    };

    // Handle guest mode with demo tasks and error handling
    const handleGuestMode = () => {
        console.log('👤 handleGuestMode called');

        try {
            setIsLoading(true);

            const guestUser: User = {
                name: 'Guest User',
                xp: 0,
                level: 1,
                isGuest: true,
                avatar: '👤',
                streak: 0,
                totalPoints: 0,
                achievements: [],
                preferences: {
                    theme: 'colorful',
                    soundEnabled: true,
                    animationsEnabled: true,
                    notificationsEnabled: true,
                    difficultyLevel: 'medium',
                    focusSessionLength: 25,
                    breakLength: 5
                },
                subscription: {
                    isPremium: false,
                    plan: 'demo'
                }
            };

            const guestAppState: AppState = {
                user: guestUser,
                tasks: [
                    {
                        id: '1',
                        title: 'Welcome to NeuroFlow Demo!',
                        completed: false,
                        xpReward: 50,
                        category: 'Demo',
                        priority: 'high',
                        createdAt: new Date()
                    },
                    {
                        id: '2',
                        title: 'Try a quick breathing exercise',
                        completed: false,
                        xpReward: 25,
                        category: 'Zen',
                        priority: 'medium',
                        createdAt: new Date()
                    },
                    {
                        id: '3',
                        title: 'Listen to calming nature sounds',
                        completed: false,
                        xpReward: 30,
                        category: 'Sounds',
                        priority: 'low',
                        createdAt: new Date()
                    }
                ],
                currentPage: 'dashboard',
                soundLibrary: createSoundLibrary(),
                activeSounds: [],
                achievements: [],
                dailyStats: []
            };

            console.log('📦 Created guest app state');

            // Simulate brief loading
            setTimeout(() => {
                setAppState(guestAppState);
                setCurrentView('app');
                setIsLoading(false);
                console.log('🚀 Successfully navigated to guest app');
            }, 800);

        } catch (error) {
            console.error('❌ handleGuestMode error:', error);
            setIsLoading(false);
            alert('Failed to start demo mode. Please try again.');
        }
    };

    // Complete a task with enhanced celebration modal
    const completeTask = (taskId: string) => {
        if (!appState) return;

        const task = appState.tasks.find(t => t.id === taskId);
        if (!task || task.completed) return;

        setIsLoading(true);

        // Simulate brief loading for better UX
        setTimeout(() => {
            const updatedTasks = appState.tasks.map(t =>
                t.id === taskId ? { ...t, completed: true, completedAt: new Date() } : t
            );

            const newXP = appState.user.xp + task.xpReward;
            const newLevel = calculateLevel(newXP);
            const leveledUp = newLevel > appState.user.level;

            // Check for new achievements
            const newAchievements: Achievement[] = [];
            if (task.id === '1' && !appState.achievements.find(a => a.id === 'first-task')) {
                newAchievements.push({
                    id: 'first-task',
                    title: 'First Quest Complete!',
                    description: 'You completed your very first task',
                    icon: '🎯',
                    unlockedAt: new Date(),
                    xpReward: 25,
                    type: 'tasks'
                });
            }

            setAppState({
                ...appState,
                tasks: updatedTasks,
                user: {
                    ...appState.user,
                    xp: newXP,
                    level: newLevel,
                    totalPoints: appState.user.totalPoints + task.xpReward
                },
                achievements: [...appState.achievements, ...newAchievements]
            });

            setIsLoading(false);

            // Show enhanced modal instead of simple alert
            if (leveledUp) {
                setShowModal({
                    type: 'levelup',
                    data: {
                        newLevel,
                        task,
                        xpGained: task.xpReward,
                        totalXP: newXP
                    }
                });
            } else if (newAchievements.length > 0) {
                setShowModal({
                    type: 'achievement',
                    data: {
                        achievement: newAchievements[0],
                        task,
                        totalXP: newXP
                    }
                });
            } else {
                setShowModal({
                    type: 'task-complete',
                    data: {
                        task,
                        xpGained: task.xpReward,
                        totalXP: newXP,
                        level: newLevel
                    }
                });
            }
        }, 800);
    };

    // Add new task with enhanced modal and demo limitations
    const addNewTask = () => {
        if (!appState) return;

        // Demo mode limitation check
        if (appState.user.isGuest) {
            const activeTasks = appState.tasks.filter(t => !t.completed);
            if (activeTasks.length >= 3) {
                alert('🚀 Demo Limit Reached!\n\nYou can only have 3 active tasks in demo mode.\nComplete some tasks or upgrade to the full version for unlimited tasks!');
                return;
            }
        }

        const taskTitle = prompt('🎯 Enter your new task:');
        if (!taskTitle || !taskTitle.trim()) return;

        const categories = ['Personal', 'Work', 'Health', 'Learning', 'Creative'];
        const randomCategory = categories[Math.floor(Math.random() * categories.length)];
        const priorities: ('low' | 'medium' | 'high')[] = ['low', 'medium', 'high'];
        const randomPriority = priorities[Math.floor(Math.random() * priorities.length)];

        const newTask: Task = {
            id: Date.now().toString(),
            title: taskTitle.trim(),
            completed: false,
            xpReward: appState.user.isGuest ? 25 : Math.floor(Math.random() * 50) + 25, // Fixed XP for demo
            category: randomCategory,
            priority: randomPriority,
            createdAt: new Date()
        };

        setAppState({
            ...appState,
            tasks: [...appState.tasks, newTask]
        });

        // Enhanced success feedback with demo awareness
        setShowModal({
            type: 'task-complete',
            data: {
                task: {
                    title: `New quest "${taskTitle}" added!${appState.user.isGuest ? ' (Demo Mode)' : ''}`,
                    xpReward: 0
                },
                xpGained: 0,
                totalXP: appState.user.xp,
                level: appState.user.level,
                isNewTask: true
            }
        });
    };

    // Navigate to different pages with smooth transitions and demo checks
    const navigateToPage = (page: 'dashboard' | 'tasks' | 'zen' | 'sounds' | 'tips') => {
        if (!appState) return;

        // Demo mode check for premium features
        if (appState.user.isGuest && page === 'tips') {
            // Allow access but show demo notice in tips page
            console.log(`📚 Demo user accessing ${page} with limitations`);
        }

        console.log(`🧩 Navigating to ${page}`);
        setIsLoading(true);

        // Brief loading animation for smooth transitions
        setTimeout(() => {
            setAppState({
                ...appState,
                currentPage: page
            });
            setIsLoading(false);
        }, 300);
    };

    // Enhanced sound playing with visual feedback and demo limitations
    const playSound = (soundId: string, soundName: string) => {
        console.log(`🎵 Playing sound: ${soundName}`);

        // Demo mode limitation - check for premium sounds
        const sound = appState?.soundLibrary.find(s => s.id === soundId);
        if (sound?.isPremium && appState?.user.isGuest) {
            alert('🔒 Premium Sound\n\nThis is a premium sound available with our $5 upgrade!\n\nDemo users can access all basic sounds. Upgrade now to unlock the full sound library!');
            return;
        }

        audioManager.playSound(soundId, 0.5);

        // Show sound info modal
        if (sound) {
            setShowModal({
                type: 'sound-info',
                data: { sound, isPlaying: true }
            });
        }
    };

    // Handle upgrade button functionality
    const handleUpgrade = () => {
        alert('💳 Upgrade to Premium\n\nUnlock all premium guides for just $5!\n\nIncludes:\n• 4 comprehensive guides with detailed modules\n• Downloadable worksheets and templates\n• 60+ minutes of expert video content\n• Scientific references and citations\n• Lifetime access to all content\n\nPayment integration coming soon!');
    };

    // Stop sound with feedback
    const stopSound = (soundId: string) => {
        audioManager.stopSound(soundId);
        setShowModal({ type: null });
    };

    // Modal Component for rich interactions
    const Modal = ({ children, onClose }: { children: React.ReactNode; onClose: () => void }) => (
        <AnimatePresence>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 1000,
                    padding: '20px'
                }}
                onClick={onClose}
            >
                <motion.div
                    initial={{ scale: 0.8, y: 50, opacity: 0 }}
                    animate={{ scale: 1, y: 0, opacity: 1 }}
                    exit={{ scale: 0.8, y: 50, opacity: 0 }}
                    transition={{ type: 'spring', damping: 20, stiffness: 300 }}
                    style={{
                        background: 'white',
                        borderRadius: '20px',
                        maxWidth: '500px',
                        width: '100%',
                        maxHeight: '80vh',
                        overflow: 'auto',
                        position: 'relative'
                    }}
                    onClick={(e) => e.stopPropagation()}
                >
                    {children}
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );

    // Render modal content based on type
    const renderModal = () => {
        if (!showModal.type) return null;

        const closeModal = () => setShowModal({ type: null });

        switch (showModal.type) {
            case 'levelup':
                return (
                    <Modal onClose={closeModal}>
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: 1, rotate: 360 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 10 }}
                                style={{ fontSize: '4rem', marginBottom: '20px' }}
                            >
                                🎉
                            </motion.div>
                            <h2 style={{ color: '#3b82f6', marginBottom: '15px' }}>LEVEL UP!</h2>
                            <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                                You're now <strong>Level {showModal.data.newLevel}</strong>!
                            </p>
                            <div style={{ background: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                <p><strong>Quest:</strong> "{showModal.data.task.title}"</p>
                                <p><strong>XP Gained:</strong> +{showModal.data.xpGained}</p>
                                <p><strong>Total XP:</strong> {showModal.data.totalXP}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '12px 24px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✨ Continue Journey
                            </button>
                        </div>
                    </Modal>
                );

            case 'achievement':
                return (
                    <Modal onClose={closeModal}>
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <motion.div
                                initial={{ scale: 0, rotate: -180 }}
                                animate={{ scale: 1, rotate: 0 }}
                                transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                                style={{ fontSize: '4rem', marginBottom: '20px' }}
                            >
                                🏆
                            </motion.div>
                            <h2 style={{ color: '#f59e0b', marginBottom: '15px' }}>NEW ACHIEVEMENT!</h2>
                            <h3 style={{ color: '#1e293b', marginBottom: '10px' }}>
                                {showModal.data.achievement.icon} {showModal.data.achievement.title}
                            </h3>
                            <p style={{ color: '#64748b', marginBottom: '20px' }}>
                                {showModal.data.achievement.description}
                            </p>
                            <div style={{ background: '#fef3c7', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                <p><strong>Quest:</strong> "{showModal.data.task.title}"</p>
                                <p><strong>Achievement Bonus:</strong> +{showModal.data.achievement.xpReward} XP</p>
                                <p><strong>Total XP:</strong> {showModal.data.totalXP}</p>
                            </div>
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '12px 24px',
                                    background: '#f59e0b',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                🏆 Awesome!
                            </button>
                        </div>
                    </Modal>
                );

            case 'task-complete':
                return (
                    <Modal onClose={closeModal}>
                        <div style={{ padding: '40px', textAlign: 'center' }}>
                            <motion.div
                                initial={{ scale: 0 }}
                                animate={{ scale: [0, 1.2, 1] }}
                                transition={{ delay: 0.1, duration: 0.6 }}
                                style={{ fontSize: '3rem', marginBottom: '20px' }}
                            >
                                {showModal.data.isNewTask ? '✨' : '✅'}
                            </motion.div>
                            <h2 style={{ color: '#10b981', marginBottom: '15px' }}>
                                {showModal.data.isNewTask ? 'Task Added!' : 'Quest Complete!'}
                            </h2>
                            <p style={{ fontSize: '1.1rem', marginBottom: '20px' }}>
                                "{showModal.data.task.title}"
                            </p>
                            {!showModal.data.isNewTask && (
                                <div style={{ background: '#f0fdf4', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
                                    <p><strong>XP Gained:</strong> +{showModal.data.xpGained}</p>
                                    <p><strong>Total XP:</strong> {showModal.data.totalXP} (Level {showModal.data.level})</p>
                                </div>
                            )}
                            <button
                                onClick={closeModal}
                                style={{
                                    padding: '12px 24px',
                                    background: '#10b981',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    fontSize: '16px',
                                    fontWeight: 'bold'
                                }}
                            >
                                {showModal.data.isNewTask ? '🚀 Let\'s Go!' : '🎆 Continue!'}
                            </button>
                        </div>
                    </Modal>
                );

            case 'sound-info':
                return (
                    <Modal onClose={closeModal}>
                        <div style={{ padding: '30px', textAlign: 'center' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '15px' }}>
                                {showModal.data.sound.emoji}
                            </div>
                            <h2 style={{ color: '#1e293b', marginBottom: '10px' }}>
                                {showModal.data.sound.name}
                            </h2>
                            <p style={{ color: '#64748b', marginBottom: '15px' }}>
                                {showModal.data.sound.description}
                            </p>
                            <div style={{
                                background: showModal.data.sound.isPremium ? '#fef3c7' : '#f0f9ff',
                                padding: '15px',
                                borderRadius: '10px',
                                marginBottom: '20px'
                            }}>
                                <p><strong>Category:</strong> {showModal.data.sound.category}</p>
                                {showModal.data.sound.isPremium && (
                                    <p style={{ color: '#d97706' }}><strong>🔒 Premium Sound</strong></p>
                                )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => stopSound(showModal.data.sound.id)}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ⏹️ Stop
                                </button>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#3b82f6',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🎵 Keep Playing
                                </button>
                            </div>
                        </div>
                    </Modal>
                );

            case 'settings':
                return (
                    <Modal onClose={closeModal}>
                        <div style={{ padding: '30px' }}>
                            <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                                <div style={{ fontSize: '3rem', marginBottom: '15px' }}>⚙️</div>
                                <h2 style={{ color: getThemeTextColor(), marginBottom: '10px' }}>Settings</h2>
                                <p style={{ color: '#64748b' }}>Customize your NeuroFlow experience</p>
                            </div>

                            {/* Theme Selection */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: getThemeTextColor(), marginBottom: '15px' }}>🎨 Theme Appearance</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                                    {(['light', 'dark', 'colorful'] as const).map((theme) => (
                                        <button
                                            key={theme}
                                            onClick={() => changeTheme(theme)}
                                            style={{
                                                padding: '15px',
                                                background: currentTheme === theme ? '#3b82f6' : '#f1f5f9',
                                                color: currentTheme === theme ? 'white' : '#64748b',
                                                border: currentTheme === theme ? '2px solid #4f46e5' : '2px solid #e2e8f0',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                textAlign: 'center',
                                                fontWeight: 'bold',
                                                textTransform: 'capitalize'
                                            }}
                                        >
                                            {theme === 'light' ? '🌸' : theme === 'dark' ? '🌙' : '🌈'}
                                            <br />
                                            {theme}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* User Preferences */}
                            <div style={{ marginBottom: '25px' }}>
                                <h3 style={{ color: getThemeTextColor(), marginBottom: '15px' }}>🎛️ Preferences</h3>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ color: getThemeTextColor() }}>🔊 Sound Effects</span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={appState?.user.preferences.soundEnabled}
                                            style={{ transform: 'scale(1.2)' }}
                                        />
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ color: getThemeTextColor() }}>✨ Animations</span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={appState?.user.preferences.animationsEnabled}
                                            style={{ transform: 'scale(1.2)' }}
                                        />
                                    </label>
                                    <label style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <span style={{ color: getThemeTextColor() }}>🔔 Notifications</span>
                                        <input
                                            type="checkbox"
                                            defaultChecked={appState?.user.preferences.notificationsEnabled}
                                            style={{ transform: 'scale(1.2)' }}
                                        />
                                    </label>
                                </div>
                            </div>

                            {/* Account Info */}
                            {appState && (
                                <div style={{ marginBottom: '25px' }}>
                                    <h3 style={{ color: getThemeTextColor(), marginBottom: '15px' }}>👤 Account</h3>
                                    <div style={{
                                        background: getThemeCardBackground(),
                                        padding: '15px',
                                        borderRadius: '10px',
                                        border: currentTheme === 'dark' ? '1px solid #374151' : '1px solid #e5e7eb'
                                    }}>
                                        <p style={{ color: getThemeTextColor(), marginBottom: '5px' }}>
                                            <strong>Name:</strong> {appState.user.name}
                                        </p>
                                        <p style={{ color: getThemeTextColor(), marginBottom: '5px' }}>
                                            <strong>Level:</strong> {appState.user.level}
                                        </p>
                                        <p style={{ color: getThemeTextColor(), marginBottom: '5px' }}>
                                            <strong>XP:</strong> {appState.user.xp}
                                        </p>
                                        <p style={{ color: getThemeTextColor() }}>
                                            <strong>Plan:</strong> {appState.user.subscription.plan}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                <button
                                    onClick={() => {
                                        localStorage.clear();
                                        alert('Settings reset! Page will reload.');
                                        window.location.reload();
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🔄 Reset
                                </button>
                                <button
                                    onClick={closeModal}
                                    style={{
                                        padding: '10px 20px',
                                        background: '#10b981',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold'
                                    }}
                                >
                                    ✅ Save Changes
                                </button>
                            </div>
                        </div>
                    </Modal>
                );

            default:
                return null;
        }
    };

    // Landing page with enhanced animations and fallback support
    if (currentView === 'landing') {
        console.log('🏠 Rendering landing page...');

        // Safe motion component wrapper
        const MotionDiv = motion?.div || 'div';
        const MotionH1 = motion?.h1 || 'h1';
        const MotionP = motion?.p || 'p';
        const MotionButton = motion?.button || 'button';

        const commonMotionProps = motion?.div ? {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            transition: { duration: 0.8 }
        } : {};

        try {
            return (
                <MotionDiv
                    {...commonMotionProps}
                    style={{
                        minHeight: '100vh',
                        background: getThemeBackground(),
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Arial, sans-serif',
                        textAlign: 'center',
                        color: getThemeTextColor(),
                        position: 'relative'
                    }}
                >
                    {/* Theme Selector */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '20px',
                        display: 'flex',
                        gap: '10px',
                        background: getThemeCardBackground(),
                        padding: '10px',
                        borderRadius: '25px',
                        boxShadow: currentTheme === 'dark' ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 20px rgba(0,0,0,0.1)'
                    }}>
                        {(['light', 'dark', 'colorful'] as const).map((theme) => (
                            <button
                                key={theme}
                                onClick={() => changeTheme(theme)}
                                style={{
                                    padding: '8px 12px',
                                    border: currentTheme === theme ? '2px solid #3b82f6' : '2px solid transparent',
                                    borderRadius: '15px',
                                    background: currentTheme === theme ? '#3b82f620' : 'transparent',
                                    cursor: 'pointer',
                                    fontSize: '12px',
                                    fontWeight: 'bold',
                                    color: getThemeTextColor(),
                                    transition: 'all 0.3s ease'
                                }}
                            >
                                {theme === 'light' ? '☀️ Light' :
                                    theme === 'dark' ? '🌙 Dark' :
                                        '🌈 Colorful'}
                            </button>
                        ))}
                    </div>
                    <div style={{ maxWidth: '600px', padding: '40px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>
                            🧠✨
                        </div>
                        <h1 style={{
                            fontSize: '3.5rem',
                            marginBottom: '20px',
                            color: currentTheme === 'dark' ? '#a78bfa' : '#3b82f6',
                            fontWeight: 'bold'
                        }}>
                            NeuroFlow
                        </h1>
                        <p style={{
                            fontSize: '1.3rem',
                            marginBottom: '15px',
                            color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                            fontWeight: '500'
                        }}>
                            Focus & Calm Companion
                        </p>
                        <p style={{
                            fontSize: '1.1rem',
                            marginBottom: '40px',
                            color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                            lineHeight: '1.6'
                        }}>
                            Turn daily tasks into rewarding quests while finding calm and focus.<br />
                            Designed specifically for ADHD, autism, and anxiety 🌈
                        </p>

                        <button
                            onClick={() => {
                                console.log('🚀 Start Journey clicked');
                                setCurrentView('signin');
                            }}
                            style={{
                                background: currentTheme === 'dark' ? 'linear-gradient(135deg, #7c3aed 0%, #a855f7 100%)' : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                color: 'white',
                                border: 'none',
                                padding: '18px 36px',
                                borderRadius: '12px',
                                fontSize: '1.2rem',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                boxShadow: currentTheme === 'dark' ? '0 8px 20px rgba(124, 58, 237, 0.4)' : '0 8px 20px rgba(99, 102, 241, 0.3)',
                                marginBottom: '20px',
                                transition: 'transform 0.2s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
                        >
                            🚀 Start Your Journey
                        </button>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'center',
                            gap: '30px',
                            fontSize: '0.9rem',
                            color: '#64748b',
                            marginTop: '30px',
                            flexWrap: 'wrap'
                        }}>
                            <div>⭐ Science-backed</div>
                            <div>👥 Built by neurodivergent devs</div>
                            <div>❤️ Free & accessible</div>
                        </div>
                    </div>
                </MotionDiv>
            );
        } catch (error) {
            console.error('❌ Landing page render error:', error);
            // Fallback to basic HTML if motion fails
            return (
                <div style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 30%, #8b5cf6 60%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Arial, sans-serif',
                    textAlign: 'center',
                    color: '#1e293b'
                }}>
                    <div style={{ maxWidth: '600px', padding: '40px' }}>
                        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🧠✨</div>
                        <h1 style={{ fontSize: '3.5rem', marginBottom: '20px', color: '#3b82f6', fontWeight: 'bold' }}>NeuroFlow</h1>
                        <p style={{ fontSize: '1.3rem', marginBottom: '15px', color: '#64748b', fontWeight: '500' }}>Focus & Calm Companion</p>
                        <p style={{ fontSize: '1.1rem', marginBottom: '40px', color: '#64748b', lineHeight: '1.6' }}>
                            Turn daily tasks into rewarding quests while finding calm and focus.<br />
                            Designed specifically for ADHD, autism, and anxiety 🌈
                        </p>
                        <button
                            onClick={() => setCurrentView('signin')}
                            style={{
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                color: 'white', border: 'none', padding: '18px 36px', borderRadius: '12px',
                                fontSize: '1.2rem', cursor: 'pointer', fontWeight: 'bold',
                                boxShadow: '0 8px 20px rgba(99, 102, 241, 0.3)', marginBottom: '20px'
                            }}
                        >
                            🚀 Start Your Journey
                        </button>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: '30px', fontSize: '0.9rem', color: '#64748b', marginTop: '30px', flexWrap: 'wrap' }}>
                            <div>⭐ Science-backed</div>
                            <div>👥 Built by neurodivergent devs</div>
                            <div>❤️ Free & accessible</div>
                        </div>
                    </div>
                </div>
            );
        }
    }

    // Sign in page with enhanced animations and fallback support
    if (currentView === 'signin') {
        console.log('🔐 Rendering signin page...');

        // Safe motion component wrapper with fallbacks
        const MotionDiv = motion?.div || 'div';
        const MotionButton = motion?.button || 'button';

        const commonMotionProps = motion?.div ? {
            initial: { opacity: 0, y: 50 },
            animate: { opacity: 1, y: 0 },
            exit: { opacity: 0, y: -50 },
            transition: { duration: 0.6 }
        } : {};

        const buttonHoverProps = motion?.button ? {
            whileHover: { scale: 1.02 },
            whileTap: { scale: 0.98 }
        } : {};

        try {
            return (
                <MotionDiv
                    {...commonMotionProps}
                    style={{
                        minHeight: '100vh',
                        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 30%, #8b5cf6 60%, #3b82f6 100%)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontFamily: 'Arial, sans-serif',
                        padding: '20px'
                    }}
                >
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '40px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧠✨</div>
                        <h1 style={{
                            color: '#1e293b',
                            marginBottom: '10px',
                            fontSize: '2rem'
                        }}>Welcome Back!</h1>
                        <p style={{
                            color: '#64748b',
                            marginBottom: '30px',
                            fontSize: '1.1rem'
                        }}>Sign in to continue your neurodivergent journey</p>

                        <div style={{ marginBottom: '20px' }}>
                            <input
                                type="email"
                                placeholder="Enter your email"
                                id="email-input"
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    border: '2px solid #e2e8f0',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    marginBottom: '15px',
                                    outline: 'none',
                                    boxSizing: 'border-box',
                                    transition: 'border-color 0.3s'
                                }}
                                onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                                onBlur={(e) => e.target.style.borderColor = '#e2e8f0'}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        const email = (e.target as HTMLInputElement).value;
                                        console.log('📧 Email sign in:', email);
                                        handleSignIn(email);
                                    }
                                }}
                            />
                            <MotionButton
                                {...buttonHoverProps}
                                onClick={() => {
                                    const email = (document.getElementById('email-input') as HTMLInputElement)?.value;
                                    console.log('📧 Sign in button clicked:', email);
                                    handleSignIn(email || 'user@example.com');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginBottom: '15px'
                                }}
                            >
                                Sign In
                            </MotionButton>

                            {/* Google Sign In with direct handler */}
                            <MotionButton
                                {...buttonHoverProps}
                                onClick={() => {
                                    console.log('🌐 Google sign in clicked');
                                    handleSignIn('google.user@gmail.com');
                                }}
                                style={{
                                    width: '100%',
                                    padding: '15px',
                                    background: 'white',
                                    color: '#374151',
                                    border: '2px solid #e5e7eb',
                                    borderRadius: '10px',
                                    fontSize: '16px',
                                    fontWeight: 'bold',
                                    cursor: 'pointer',
                                    marginBottom: '15px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '8px'
                                }}
                            >
                                🌐 Continue with Google
                            </MotionButton>
                        </div>

                        <div style={{ margin: '20px 0', color: '#94a3b8' }}>or</div>

                        <MotionButton
                            {...buttonHoverProps}
                            onClick={() => {
                                console.log('👤 Guest mode clicked');
                                handleGuestMode();
                            }}
                            style={{
                                width: '100%',
                                padding: '15px',
                                background: '#f1f5f9',
                                color: '#334155',
                                border: '2px solid #e2e8f0',
                                borderRadius: '10px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                cursor: 'pointer',
                                marginBottom: '15px'
                            }}
                        >
                            👤 Try Demo Mode (No Account Needed)
                        </MotionButton>

                        <button
                            onClick={() => {
                                console.log('⬅️ Back to home clicked');
                                setCurrentView('landing');
                            }}
                            style={{
                                background: 'none',
                                border: 'none',
                                color: '#3b82f6',
                                cursor: 'pointer',
                                fontSize: '14px',
                                textDecoration: 'underline'
                            }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </MotionDiv>
            );
        } catch (error) {
            console.error('❌ Signin page render error:', error);
            // Fallback signin page
            return (
                <div style={{
                    minHeight: '100vh',
                    background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 30%, #8b5cf6 60%, #3b82f6 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontFamily: 'Arial, sans-serif',
                    padding: '20px'
                }}>
                    <div style={{
                        background: 'white',
                        borderRadius: '20px',
                        padding: '40px',
                        maxWidth: '400px',
                        width: '100%',
                        textAlign: 'center',
                        boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '20px' }}>🧠✨</div>
                        <h1 style={{ color: '#1e293b', marginBottom: '10px', fontSize: '2rem' }}>Welcome Back!</h1>
                        <p style={{ color: '#64748b', marginBottom: '30px', fontSize: '1.1rem' }}>Sign in to continue your neurodivergent journey</p>

                        <input
                            type="email"
                            placeholder="Enter your email"
                            id="email-input-fallback"
                            style={{
                                width: '100%', padding: '15px', border: '2px solid #e2e8f0',
                                borderRadius: '10px', fontSize: '16px', marginBottom: '15px',
                                outline: 'none', boxSizing: 'border-box'
                            }}
                        />

                        <button
                            onClick={() => {
                                const email = (document.getElementById('email-input-fallback') as HTMLInputElement)?.value;
                                handleSignIn(email || 'user@example.com');
                            }}
                            style={{
                                width: '100%', padding: '15px',
                                background: 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
                                color: 'white', border: 'none', borderRadius: '10px',
                                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px'
                            }}
                        >
                            Sign In
                        </button>

                        <button
                            onClick={handleGuestMode}
                            style={{
                                width: '100%', padding: '15px', background: '#f1f5f9',
                                color: '#334155', border: '2px solid #e2e8f0', borderRadius: '10px',
                                fontSize: '16px', fontWeight: 'bold', cursor: 'pointer', marginBottom: '15px'
                            }}
                        >
                            👤 Try Demo Mode (No Account Needed)
                        </button>

                        <button
                            onClick={() => setCurrentView('landing')}
                            style={{
                                background: 'none', border: 'none', color: '#3b82f6',
                                cursor: 'pointer', fontSize: '14px', textDecoration: 'underline'
                            }}
                        >
                            ← Back to Home
                        </button>
                    </div>
                </div>
            );
        }
    }

    // Main app dashboard with full functionality
    if (!appState) {
        return <div>Loading...</div>;
    }

    console.log('🟠 Rendering dashboard for user:', appState.user.name);

    // Render specific pages based on currentPage
    if (appState.currentPage === 'tasks') {
        return (
            <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 30%, #8b5cf6 60%, #3b82f6 100%)', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
                <button onClick={() => navigateToPage('dashboard')} style={{ marginBottom: '20px', padding: '10px 20px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>← Back to Dashboard</button>
                <h1 style={{ color: '#1e293b' }}>🎯 Task Manager</h1>
                <p style={{ color: '#64748b', marginBottom: '20px' }}>Full task management with categories, priorities, and gamification!</p>
                <button onClick={addNewTask} style={{ padding: '10px 20px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer', marginBottom: '20px' }}>+ Add New Task</button>

                <div>
                    {appState.tasks.map((task: Task) => (
                        <div key={task.id} style={{
                            padding: '15px',
                            margin: '10px 0',
                            background: task.completed ? '#f0f9ff' : 'white',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                        }}>
                            <div>
                                <h3 style={{ margin: 0, textDecoration: task.completed ? 'line-through' : 'none' }}>{task.title}</h3>
                                <p style={{ margin: '5px 0', color: '#64748b' }}>{task.category} • +{task.xpReward} XP</p>
                            </div>
                            {!task.completed && (
                                <button onClick={() => completeTask(task.id)} style={{ padding: '8px 16px', background: '#22c55e', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' }}>✅ Complete</button>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    if (appState.currentPage === 'zen') {
        return (
            <ZenMode
                appState={appState}
                onUpdateState={(updates) => {
                    setAppState(prevState => ({
                        ...prevState,
                        ...updates
                    }));
                }}
            />
        );
    }

    if (appState.currentPage === 'sounds') {
        const activeSounds = audioManager.getActiveSounds();
        const soundCategories = ['nature', 'ambient', 'focus', 'meditation', 'urban'] as const;

        return (
            <motion.div
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                style={{
                    minHeight: '100vh',
                    background: getThemeBackground(),
                    padding: '20px',
                    fontFamily: 'Arial, sans-serif',
                    color: getThemeTextColor()
                }}
            >
                <motion.button
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    whileHover={{ scale: 1.05 }}
                    onClick={() => navigateToPage('dashboard')}
                    style={{
                        marginBottom: '20px',
                        padding: '10px 20px',
                        background: '#ec4899',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    ← Back to Dashboard
                </motion.button>

                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.3 }}
                >
                    <h1 style={{
                        color: getThemeTextColor(),
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        fontWeight: 'bold',
                        fontSize: '2.5rem',
                        marginBottom: '10px'
                    }}>
                        🎵 Sound Library
                        {activeSounds.length > 0 && (
                            <span style={{
                                background: '#ec4899',
                                color: 'white',
                                fontSize: '0.8rem',
                                padding: '4px 12px',
                                borderRadius: '20px'
                            }}>
                                {activeSounds.length} playing
                            </span>
                        )}
                    </h1>
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    marginBottom: '10px'
                    }}>
                    🎵 Sound Library
                    {activeSounds.length > 0 && (
                        <span style={{
                            background: '#10b981',
                            color: 'white',
                            fontSize: '0.8rem',
                            padding: '4px 12px',
                            borderRadius: '20px'
                        }}>
                            {activeSounds.length} playing
                        </span>
                    )}
                </h1>
                <p style={{
                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                    marginBottom: '20px',
                    fontSize: '1.1rem'
                }}>
                    Enjoy soothing and motivational sounds.
                </p>

                {/* Sound Categories */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    {soundCategories.map((category, index) => (
                        <SoundCategory key={index} category={category} audioManager={audioManager} />
                    ))}
                </div>
            </motion.div>
            </motion.div >
        );
    } else if (appState.currentPage === 'zen') {
        const { duration } = useNavigateZenSettings();

        const [zenSession, setZenSession] = useRecoilState(zenSessionState);

        useEffect(() => {
            let timer;

            if (zenSession.isActive) {
                timer = setInterval(() => {
                    setZenSession(prev => {
                        if (prev.time > 0) {
                            return { ...prev, time: prev.time - 1 };
                        }
                        switch (prev.type) {
                            case 'focus':
                            case 'relax':
                            case 'meditate':
                                return {
                                    ...prev,
                                    time: duration[prev.type],
                                    isActive: true
                                };
                            default:
                                return prev;
                        }
                    }

                    return prev;
                });
            }, 1000);

        return () => clearInterval(timer);
    }, [zenSession.isActive, zenSession.type]);

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                background: getThemeBackground(),
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                color: getThemeTextColor()
            }}
        >
            <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigateToPage('dashboard')}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                ← Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
                style={{ textAlign: 'center', marginBottom: '40px' }}
            >
                <h1 style={{
                    color: getThemeTextColor(),
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    marginBottom: '10px'
                }}>
                    🧘 Zen Mode
                </h1>
                <p style={{
                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                    marginBottom: '20px',
                    fontSize: '1.1rem'
                }}>
                    Breathing exercises and mindfulness activities for focus and calm.
                </p>

                {/* Sound Controls */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '20px',
                    marginBottom: '30px',
                    flexWrap: 'wrap'
                }}>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: getThemeTextColor(),
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={zenSounds.breathing}
                            onChange={(e) => {
                                setZenSounds(prev => ({ ...prev, breathing: e.target.checked }));
                                if (e.target.checked) {
                                    audioManager.playSound('meditation-drone', 0.2);
                                } else {
                                    audioManager.stopSound('meditation-drone');
                                }
                            }}
                            style={{ transform: 'scale(1.2)' }}
                        />
                        🎵 Breathing Sounds
                    </label>
                    <label style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: getThemeTextColor(),
                        cursor: 'pointer'
                    }}>
                        <input
                            type="checkbox"
                            checked={zenSounds.backgroundMusic}
                            onChange={(e) => {
                                setZenSounds(prev => ({ ...prev, backgroundMusic: e.target.checked }));
                                if (e.target.checked) {
                                    audioManager.playSound('singing-bowls', 0.3);
                                } else {
                                    audioManager.stopSound('singing-bowls');
                                }
                            }}
                            style={{ transform: 'scale(1.2)' }}
                        />
                        🔔 Meditation Bells
                    </label>
                </div>
            </motion.div>

            {/* Breathing Circle Animation */}
            {zenSession.isActive && (
                <motion.div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        marginBottom: '40px'
                    }}
                >
                    <motion.div
                        animate={{
                            scale: zenSession.phase === 'inhale' ? 1.5 :
                                zenSession.phase === 'hold' ? 1.5 :
                                    1,
                            opacity: zenSession.phase === 'exhale' ? 0.6 : 1
                        }}
                        transition={{
                            duration: zenSession.timeLeft,
                            ease: "easeInOut"
                        }}
                        style={{
                            width: '200px',
                            height: '200px',
                            borderRadius: '50%',
                            background: zenSession.phase === 'inhale' ?
                                'linear-gradient(135deg, #10b981, #3b82f6)' :
                                zenSession.phase === 'hold' ?
                                    'linear-gradient(135deg, #f59e0b, #ef4444)' :
                                    'linear-gradient(135deg, #8b5cf6, #a78bfa)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.3)',
                            marginBottom: '20px'
                        }}
                    >
                        <div style={{
                            color: 'white',
                            textAlign: 'center',
                            fontWeight: 'bold'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
                                {zenSession.phase === 'inhale' ? '↗️' :
                                    zenSession.phase === 'hold' ? '⏸️' :
                                        zenSession.phase === 'exhale' ? '↘️' : '⏹️'}
                            </div>
                            <div style={{ fontSize: '1.2rem' }}>
                                {zenSession.phase.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '2rem' }}>
                                {zenSession.timeLeft}
                            </div>
                        </div>
                    </motion.div>

                    <div style={{
                        textAlign: 'center',
                        color: getThemeTextColor(),
                        fontSize: '1.1rem'
                    }}>
                        <div style={{ marginBottom: '10px' }}>
                            <strong>{zenSession.type?.toUpperCase()} Breathing</strong>
                        </div>
                        <div>
                            Cycle {zenSession.currentCycle} of {zenSession.totalCycles}
                        </div>
                    </div>
                </motion.div>
            )}

            {/* Breathing Exercise Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '25px',
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {[
                    {
                        id: '4-7-8',
                        title: '4-7-8 Breathing',
                        desc: 'Inhale 4s, hold 7s, exhale 8s. Perfect for reducing anxiety and promoting sleep.',
                        duration: '5 cycles',
                        color: '#10b981',
                        icon: '🌙'
                    },
                    {
                        id: 'box',
                        title: 'Box Breathing',
                        desc: 'Equal 4-second intervals: inhale, hold, exhale, pause. Great for focus and concentration.',
                        duration: '5 cycles',
                        color: '#3b82f6',
                        icon: '📦'
                    },
                    {
                        id: 'meditation',
                        title: 'Meditation Breathing',
                        desc: 'Simple 6-second inhale and exhale cycles. Builds mindfulness and presence.',
                        duration: '10 cycles',
                        color: '#8b5cf6',
                        icon: '🧘'
                    }
                ].map((exercise, index) => (
                    <motion.div
                        key={exercise.id}
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.5 + index * 0.1 }}
                        whileHover={{ scale: 1.03, y: -5 }}
                        style={{
                            background: getThemeCardBackground(),
                            padding: '25px',
                            borderRadius: '15px',
                            boxShadow: currentTheme === 'dark' ? '0 4px 20px rgba(255,255,255,0.1)' : '0 6px 20px rgba(0,0,0,0.15)',
                            textAlign: 'center',
                            border: zenSession.isActive && zenSession.type === exercise.id ?
                                `3px solid ${exercise.color}` :
                                (currentTheme === 'dark' ? '1px solid #374151' : 'none'),
                            position: 'relative'
                        }}
                    >
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '15px',
                            filter: zenSession.isActive && zenSession.type !== exercise.id ? 'grayscale(70%)' : 'none'
                        }}>
                            {exercise.icon}
                        </div>

                        <h3 style={{
                            color: getThemeTextColor(),
                            marginBottom: '12px',
                            fontWeight: 'bold',
                            fontSize: '1.3rem'
                        }}>
                            {exercise.title}
                        </h3>

                        <p style={{
                            color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                            marginBottom: '15px',
                            lineHeight: '1.5',
                            fontSize: '0.95rem'
                        }}>
                            {exercise.desc}
                        </p>

                        <div style={{
                            color: exercise.color,
                            fontWeight: 'bold',
                            marginBottom: '20px',
                            fontSize: '0.9rem'
                        }}>
                            Duration: {exercise.duration}
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => {
                                if (zenSession.isActive) {
                                    stopBreathingExercise();
                                } else {
                                    startBreathingExercise(exercise.id as '4-7-8' | 'box' | 'meditation');
                                }
                            }}
                            disabled={zenSession.isActive && zenSession.type !== exercise.id}
                            style={{
                                padding: '12px 24px',
                                background: zenSession.isActive && zenSession.type === exercise.id ?
                                    '#ef4444' : exercise.color,
                                color: 'white',
                                border: 'none',
                                borderRadius: '10px',
                                cursor: zenSession.isActive && zenSession.type !== exercise.id ? 'not-allowed' : 'pointer',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                opacity: zenSession.isActive && zenSession.type !== exercise.id ? 0.5 : 1,
                                width: '100%'
                            }}
                        >
                            {zenSession.isActive && zenSession.type === exercise.id ?
                                '⏹️ Stop Session' :
                                '▶️ Start Session'}
                        </motion.button>
                    </motion.div>
                ))}
            </div>

            {/* Zen Tips */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
                style={{
                    marginTop: '50px',
                    padding: '25px',
                    background: currentTheme === 'dark' ?
                        'linear-gradient(135deg, #1e293b, #374151)' :
                        'linear-gradient(135deg, #f0f9ff, #e0f2fe)',
                    borderRadius: '15px',
                    textAlign: 'center',
                    maxWidth: '600px',
                    margin: '50px auto 0'
                }}
            >
                <h3 style={{
                    color: getThemeTextColor(),
                    marginBottom: '15px',
                    fontWeight: 'bold'
                }}>
                    💡 Zen Tips
                </h3>
                <ul style={{
                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                    textAlign: 'left',
                    lineHeight: '1.6',
                    paddingLeft: '20px'
                }}>
                    <li>📱 Enable vibration for breathing cues on mobile devices</li>
                    <li>🎵 Use breathing sounds to stay focused during exercises</li>
                    <li>🔔 Meditation bells help mark transitions between phases</li>
                    <li>🧘 Practice regularly for best results - even 5 minutes helps</li>
                    <li>🌙 4-7-8 breathing is excellent before bedtime</li>
                </ul>
            </motion.div>
        </motion.div>
    );
}

if (appState.currentPage === 'sounds') {
    const activeSounds = audioManager.getActiveSounds();
    const soundCategories = ['nature', 'ambient', 'focus', 'meditation', 'urban'] as const;

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                background: getThemeBackground(),
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                color: getThemeTextColor()
            }}
        >
            <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigateToPage('dashboard')}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                ← Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h1 style={{
                    color: getThemeTextColor(),
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    fontWeight: 'bold',
                    fontSize: '2.5rem',
                    marginBottom: '10px'
                }}>
                    🎵 Sound Library
                    {activeSounds.length > 0 && (
                        <span style={{
                            background: '#10b981',
                            color: 'white',
                            fontSize: '0.8rem',
                            padding: '4px 12px',
                            borderRadius: '20px'
                        }}>
                            {activeSounds.length} playing
                        </span>
                    )}
                </h1>
                <p style={{
                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                    marginBottom: '20px',
                    fontSize: '1.1rem'
                }}>
                    50+ ambient sounds for focus, relaxation, and productivity. Mix and match to create your perfect soundscape!
                </p>

                {/* Audio Test and Controls */}
                <div style={{ textAlign: 'center', marginBottom: '30px' }}>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            try {
                                // Test basic audio functionality
                                audioManager.playSound('test-audio', 0.3);
                                console.log('🎵 Audio test: Basic tone playing');
                            } catch (error) {
                                console.error('❌ Audio test failed:', error);
                                alert('❌ Audio test failed. Please check your browser audio settings.');
                            }
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            marginRight: '10px'
                        }}
                    >
                        🔊 Test Audio
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                            audioManager.stopAllSounds();
                            console.log('⏹️ All sounds stopped');
                        }}
                        style={{
                            padding: '8px 16px',
                            background: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            cursor: 'pointer'
                        }}
                    >
                        ⏹️ Stop All
                    </motion.button>
                </div>
            </motion.div>

            {/* Sound Categories */}
            {soundCategories.map((category, categoryIndex) => {
                const categorySounds = appState.soundLibrary.filter(sound => sound.category === category);
                const categoryColors = {
                    nature: '#10b981',
                    ambient: '#3b82f6',
                    focus: '#f59e0b',
                    meditation: '#8b5cf6',
                    urban: '#ef4444'
                };

                return (
                    <motion.div
                        key={category}
                        initial={{ y: 50, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ delay: 0.4 + categoryIndex * 0.1 }}
                        style={{ marginBottom: '50px' }}
                    >
                        <h2 style={{
                            color: categoryColors[category],
                            textTransform: 'capitalize',
                            marginBottom: '25px',
                            fontSize: '1.8rem',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '10px'
                        }}>
                            {category === 'nature' ? '🌿' :
                                category === 'ambient' ? '🌌' :
                                    category === 'focus' ? '🧠' :
                                        category === 'meditation' ? '🧘' : '🏢'}
                            {category.charAt(0).toUpperCase() + category.slice(1)} Sounds
                        </h2>

                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                            gap: '20px'
                        }}>
                            {categorySounds.map((sound, soundIndex) => {
                                const isPlaying = activeSounds.some(active => active.soundId === sound.id);
                                const activeSound = activeSounds.find(active => active.soundId === sound.id);
                                const currentVolume = activeSound?.volume || 0.5;

                                return (
                                    <motion.div
                                        key={sound.id}
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: 1, opacity: 1 }}
                                        transition={{ delay: 0.5 + categoryIndex * 0.1 + soundIndex * 0.05 }}
                                        whileHover={{ scale: 1.03, y: -8 }}
                                        style={{
                                            background: getThemeCardBackground(),
                                            padding: '20px',
                                            borderRadius: '15px',
                                            boxShadow: isPlaying ?
                                                `0 8px 25px ${categoryColors[category]}40` :
                                                (currentTheme === 'dark' ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)'),
                                            textAlign: 'center',
                                            border: isPlaying ?
                                                `3px solid ${categoryColors[category]}` :
                                                (currentTheme === 'dark' ? '1px solid #374151' : '2px solid transparent'),
                                            position: 'relative'
                                        }}
                                    >
                                        {sound.isPremium && (
                                            <div style={{
                                                position: 'absolute',
                                                top: '10px',
                                                right: '10px',
                                                background: '#f59e0b',
                                                color: 'white',
                                                fontSize: '0.7rem',
                                                padding: '3px 8px',
                                                borderRadius: '8px',
                                                fontWeight: 'bold'
                                            }}>
                                                PRO
                                            </div>
                                        )}

                                        <motion.div
                                            animate={isPlaying ? {
                                                scale: [1, 1.2, 1],
                                                rotate: [0, 5, -5, 0]
                                            } : {}}
                                            transition={{
                                                repeat: isPlaying ? Infinity : 0,
                                                duration: 3,
                                                ease: "easeInOut"
                                            }}
                                            style={{ fontSize: '3rem', marginBottom: '15px' }}
                                        >
                                            {sound.emoji}
                                        </motion.div>

                                        <h4 style={{
                                            color: getThemeTextColor(),
                                            margin: '0 0 8px 0',
                                            fontSize: '1.2rem',
                                            fontWeight: 'bold'
                                        }}>
                                            {sound.name}
                                        </h4>
                                        <p style={{
                                            color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                                            fontSize: '0.9rem',
                                            margin: '0 0 15px 0',
                                            lineHeight: '1.4'
                                        }}>
                                            {sound.description}
                                        </p>

                                        {/* Volume Slider - only show when playing */}
                                        {isPlaying && (
                                            <motion.div
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                style={{ marginBottom: '15px' }}
                                            >
                                                <label style={{
                                                    color: getThemeTextColor(),
                                                    fontSize: '0.8rem',
                                                    display: 'block',
                                                    marginBottom: '5px',
                                                    fontWeight: 'bold'
                                                }}>
                                                    Volume: {Math.round(currentVolume * 100)}%
                                                </label>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max="1"
                                                    step="0.1"
                                                    value={currentVolume}
                                                    onChange={(e) => {
                                                        const newVolume = parseFloat(e.target.value);
                                                        audioManager.adjustVolume(sound.id, newVolume);
                                                    }}
                                                    style={{
                                                        width: '100%',
                                                        background: categoryColors[category],
                                                        borderRadius: '5px',
                                                        appearance: 'none',
                                                        height: '6px',
                                                        outline: 'none'
                                                    }}
                                                />
                                            </motion.div>
                                        )}

                                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'center' }}>
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                style={{
                                                    padding: '10px 20px',
                                                    background: isPlaying ? '#ef4444' : categoryColors[category],
                                                    color: 'white',
                                                    border: 'none',
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold',
                                                    flex: 1
                                                }}
                                                onClick={() => {
                                                    console.log(`🎵 ${isPlaying ? 'Stopping' : 'Playing'} sound:`, sound.name);
                                                    if (isPlaying) {
                                                        audioManager.stopSound(sound.id);
                                                    } else {
                                                        // Enhanced sound playback with proper volume
                                                        try {
                                                            if (sound.isPremium && !appState.user.subscription.isPremium) {
                                                                alert(`🔒 Premium Sound

"${sound.name}" is a premium sound!

Upgrade for $5 to unlock all premium sounds and features.`);
                                                                return;
                                                            }

                                                            audioManager.playSound(sound.id, 0.5);
                                                            console.log('✅ Sound started successfully');
                                                        } catch (error) {
                                                            console.error('❌ Sound playback failed:', error);
                                                            alert(`Unable to play ${sound.name}. Please check your audio settings.`);
                                                        }
                                                    }
                                                }}
                                            >
                                                {isPlaying ? '⏹️ Stop' : '▶️ Play'}
                                            </motion.button>

                                            {/* Info button */}
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                onClick={() => {
                                                    setShowModal({
                                                        type: 'sound-info',
                                                        data: { sound, isPlaying }
                                                    });
                                                }}
                                                style={{
                                                    padding: '10px',
                                                    background: 'transparent',
                                                    color: categoryColors[category],
                                                    border: `2px solid ${categoryColors[category]}`,
                                                    borderRadius: '8px',
                                                    cursor: 'pointer',
                                                    fontSize: '0.9rem',
                                                    fontWeight: 'bold'
                                                }}
                                            >
                                                ℹ️
                                            </motion.button>
                                        </div>
                                    </motion.div>
                                );
                            })}
                        </div>
                    </motion.div>
                );
            })}

            {/* Enhanced Sound Controls Panel */}
            {activeSounds.length > 0 && (
                <motion.div
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    style={{
                        position: 'fixed',
                        bottom: '20px',
                        right: '20px',
                        background: getThemeCardBackground(),
                        padding: '20px',
                        borderRadius: '15px',
                        boxShadow: currentTheme === 'dark' ? '0 8px 30px rgba(255,255,255,0.2)' : '0 8px 30px rgba(0,0,0,0.3)',
                        minWidth: '280px',
                        maxWidth: '350px',
                        border: currentTheme === 'dark' ? '1px solid #374151' : 'none'
                    }}
                >
                    <h4 style={{
                        margin: '0 0 15px 0',
                        color: getThemeTextColor(),
                        fontWeight: 'bold',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        🎛️ Sound Mixer ({activeSounds.length} active)
                    </h4>

                    <div style={{ marginBottom: '15px', maxHeight: '200px', overflowY: 'auto' }}>
                        {activeSounds.map(activeSound => {
                            const sound = appState.soundLibrary.find(s => s.id === activeSound.soundId);
                            return sound ? (
                                <div key={sound.id} style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    marginBottom: '10px',
                                    padding: '8px',
                                    background: currentTheme === 'dark' ? '#374151' : '#f8fafc',
                                    borderRadius: '8px'
                                }}>
                                    <span style={{
                                        fontSize: '1.2rem',
                                        marginRight: '8px'
                                    }}>
                                        {sound.emoji}
                                    </span>
                                    <div style={{ flex: 1, marginRight: '10px' }}>
                                        <div style={{
                                            fontSize: '0.8rem',
                                            fontWeight: 'bold',
                                            color: getThemeTextColor()
                                        }}>
                                            {sound.name}
                                        </div>
                                        <input
                                            type="range"
                                            min="0"
                                            max="1"
                                            step="0.1"
                                            value={activeSound.volume}
                                            onChange={(e) => {
                                                audioManager.adjustVolume(sound.id, parseFloat(e.target.value));
                                            }}
                                            style={{
                                                width: '100%',
                                                marginTop: '2px'
                                            }}
                                        />
                                    </div>
                                    <button
                                        onClick={() => audioManager.stopSound(sound.id)}
                                        style={{
                                            background: '#ef4444',
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

                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button
                            onClick={() => audioManager.stopAllSounds()}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#ef4444',
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
                        <button
                            onClick={() => {
                                // Save current mix as preset
                                const mixName = prompt('Save this sound mix as:');
                                if (mixName) {
                                    alert(`🎼 Mix "${mixName}" saved! (Feature coming soon)`);
                                }
                            }}
                            style={{
                                flex: 1,
                                padding: '10px',
                                background: '#3b82f6',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                                fontSize: '0.9rem'
                            }}
                        >
                            💾 Save Mix
                        </button>
                    </div>
                </motion.div>
            )}
        </motion.div>
    );
}

if (appState.currentPage === 'tips') {
    const [expandedTips, setExpandedTips] = useState<Set<string>>(new Set());
    const [expandedGuides, setExpandedGuides] = useState<Set<string>>(new Set());

    const toggleTipExpansion = (tipTitle: string) => {
        setExpandedTips(prev => {
            const newSet = new Set(prev);
            if (newSet.has(tipTitle)) {
                newSet.delete(tipTitle);
            } else {
                newSet.add(tipTitle);
            }
            return newSet;
        });
    };

    const toggleGuideExpansion = (guideTitle: string) => {
        setExpandedGuides(prev => {
            const newSet = new Set(prev);
            if (newSet.has(guideTitle)) {
                newSet.delete(guideTitle);
            } else {
                newSet.add(guideTitle);
            }
            return newSet;
        });
    };

    const handleUpgrade = () => {
        alert('💳 Upgrade to Premium\n\nUnlock all premium guides for just $5!\n\nIncludes:\n• 4 comprehensive guides with detailed modules\n• Downloadable worksheets and templates\n• 60+ minutes of expert video content\n• Scientific references and citations\n• Lifetime access to all content\n\nPayment integration coming soon!');
    };
    const tipCategories = {
        'Productivity': { color: '#10b981', icon: '📊' },
        'Focus': { color: '#3b82f6', icon: '🎯' },
        'Wellness': { color: '#8b5cf6', icon: '💜' },
        'Health': { color: '#f59e0b', icon: '🌱' }
    };

    const freeTips = [
        {
            title: 'Time Management',
            content: 'Use timers and break tasks into 15-minute chunks. Start with 5-minute tasks to build momentum.',
            detailedContent: {
                overview: 'Time management is crucial for ADHD brains. Our executive function challenges make traditional time management methods ineffective.',
                scientificBasis: 'Research shows ADHD brains struggle with time perception due to differences in the prefrontal cortex and basal ganglia.',
                practicalSteps: [
                    'Start with 5-minute tasks to build dopamine momentum',
                    'Use visual timers (Time Timer app recommended)',
                    'Break large tasks into 15-minute chunks',
                    'Schedule "buffer time" between activities',
                    'Use body doubling for accountability'
                ],
                expertTips: [
                    'Set reminders 5 minutes before transitions',
                    'Create "time landmarks" throughout your day',
                    'Use the "2-minute rule" for quick tasks'
                ],
                relatedResources: ['Pomodoro Technique', 'Time blocking', 'Getting Things Done (GTD)']
            },
            category: 'Productivity',
            isFree: true
        },
        {
            title: 'Focus Techniques',
            content: 'The Pomodoro Technique works great for ADHD brains. Try 25 minutes focused work, 5-minute break.',
            detailedContent: {
                overview: 'ADHD brains need external structure to maintain focus. The Pomodoro Technique provides this through time-boxing.',
                scientificBasis: 'Studies show time-boxing improves attention and reduces mental fatigue in neurodivergent individuals.',
                practicalSteps: [
                    'Set a 25-minute timer for focused work',
                    'Take a 5-minute break after each pomodoro',
                    'Take a longer 15-30 minute break after 4 pomodoros',
                    'Eliminate distractions during work periods',
                    'Use background noise or music if helpful'
                ],
                expertTips: [
                    'Start with shorter 15-minute sessions if 25 feels too long',
                    'Use apps like Forest or Focus Keeper for gamification',
                    'Track your productivity patterns to find optimal times'
                ],
                relatedResources: ['Deep work techniques', 'Attention restoration theory', 'Flow state research']
            },
            category: 'Focus',
            isFree: true
        },
        {
            title: 'Emotional Regulation',
            content: 'Deep breathing helps manage overwhelming feelings. Try the 4-7-8 technique: inhale 4, hold 7, exhale 8.',
            detailedContent: {
                overview: 'ADHD often comes with emotional dysregulation. Breathing techniques activate the parasympathetic nervous system.',
                scientificBasis: 'Controlled breathing stimulates the vagus nerve, reducing cortisol and increasing GABA production.',
                practicalSteps: [
                    'Inhale through nose for 4 counts',
                    'Hold breath for 7 counts',
                    'Exhale through mouth for 8 counts',
                    'Repeat 3-4 times when feeling overwhelmed',
                    'Practice daily for 5 minutes to build the habit'
                ],
                expertTips: [
                    'Use breathing apps like Breathe or Calm for guidance',
                    'Practice when calm to build muscle memory',
                    'Combine with progressive muscle relaxation'
                ],
                relatedResources: ['Mindfulness meditation', 'Vagus nerve stimulation', 'Cognitive behavioral therapy']
            },
            category: 'Wellness',
            isFree: true
        },
        {
            title: 'Sleep Hygiene',
            content: 'Consistent sleep schedule improves ADHD symptoms. Aim for 7-9 hours nightly.',
            detailedContent: {
                overview: 'Sleep is critical for ADHD management. Poor sleep worsens attention, emotional regulation, and executive function.',
                scientificBasis: 'ADHD brains have delayed circadian rhythms and increased sleep disorders (30-50% prevalence).',
                practicalSteps: [
                    'Set consistent bedtime and wake time (even weekends)',
                    'Create a 30-minute wind-down routine',
                    'Use blue light blocking glasses after sunset',
                    'Keep bedroom cool, dark, and quiet',
                    'Avoid screens 1 hour before bed'
                ],
                expertTips: [
                    'Use a sunrise alarm clock for natural waking',
                    'Take melatonin 30 minutes before desired sleep time',
                    'Exercise regularly but not within 3 hours of bedtime'
                ],
                relatedResources: ['Sleep hygiene protocols', 'Circadian rhythm research', 'Melatonin studies']
            },
            category: 'Health',
            isFree: true
        },
        {
            title: 'Fidget Tools',
            content: 'Use stress balls, fidget cubes, or textured items to help maintain focus during tasks.',
            detailedContent: {
                overview: 'Fidgeting provides sensory input that can help ADHD brains focus by giving excess energy an outlet.',
                scientificBasis: 'Kinesthetic stimulation increases norepinephrine and dopamine, improving attention in ADHD individuals.',
                practicalSteps: [
                    'Choose quiet fidgets for meetings (thinking putty, silent cubes)',
                    'Use different textures for different moods',
                    'Keep fidgets easily accessible at work/study spaces',
                    'Try foot fidgets under your desk',
                    'Experiment with different types to find what works'
                ],
                expertTips: [
                    'Avoid fidgets that are too engaging or distracting',
                    'Use fidgets during passive activities like listening',
                    'Consider weighted fidgets for deeper pressure input'
                ],
                relatedResources: ['Sensory processing research', 'Proprioceptive input studies', 'Occupational therapy resources']
            },
            category: 'Focus',
            isFree: true
        },
        {
            title: 'Body Doubling',
            content: 'Work alongside others virtually or in-person. Their presence helps maintain accountability.',
            detailedContent: {
                overview: 'Body doubling leverages social accountability and mirror neurons to improve focus and task completion.',
                scientificBasis: 'Social presence activates the anterior cingulate cortex, which helps with sustained attention and motivation.',
                practicalSteps: [
                    'Find a study/work buddy with similar goals',
                    'Use virtual body doubling apps or platforms',
                    'Work in coffee shops or libraries for ambient accountability',
                    'Join online study sessions or focus rooms',
                    'Set mutual check-ins and goals'
                ],
                expertTips: [
                    'Choose partners who won\'t be distracting',
                    'Agree on ground rules (no talking during focus time)',
                    'Use camera-on video calls for virtual sessions'
                ],
                relatedResources: ['Social facilitation theory', 'Mirror neuron research', 'Accountability partner studies']
            },
            category: 'Productivity',
            isFree: true
        }
    ];

    const premiumGuides = [
        {
            title: 'Advanced Executive Function Strategies',
            content: 'Comprehensive guide to planning, organization, and time management systems.',
            detailedContent: {
                overview: 'Master advanced strategies for executive function challenges including working memory, cognitive flexibility, and inhibitory control.',
                modules: [
                    'Working Memory Enhancement Techniques',
                    'Advanced Planning and Organization Systems',
                    'Cognitive Load Management',
                    'Decision-Making Frameworks for ADHD',
                    'Advanced Time Management Systems'
                ],
                worksheets: [
                    'Executive Function Assessment',
                    'Personal Organization System Builder',
                    'Weekly Planning Template',
                    'Decision Matrix Worksheet'
                ],
                videoContent: '45 minutes of expert guidance',
                scientificReferences: [
                    'Barkley, R.A. (2012). Executive Functions',
                    'Diamond, A. (2013). Executive Functions. Annual Review of Psychology',
                    'Miyake, A. et al. (2000). Unity and Diversity of Executive Functions'
                ]
            },
            category: 'Productivity',
            isFree: false
        },
        {
            title: 'Sensory Processing Solutions',
            content: 'Deep dive into sensory needs and environmental modifications.',
            detailedContent: {
                overview: 'Understand and optimize your sensory environment for better focus, regulation, and daily functioning.',
                modules: [
                    'Sensory Profile Assessment',
                    'Environmental Modifications',
                    'Sensory Diet Planning',
                    'Workplace Sensory Accommodations',
                    'Sensory Tools and Equipment Guide'
                ],
                worksheets: [
                    'Personal Sensory Profile',
                    'Environmental Audit Checklist',
                    'Sensory Diet Planner',
                    'Product Recommendation Guide'
                ],
                videoContent: '60 minutes including demonstrations',
                scientificReferences: [
                    'Dunn, W. (2014). Sensory Profile 2',
                    'Miller, L.J. et al. (2017). Sensory Processing Disorder',
                    'Reynolds, S. et al. (2019). Sensory Needs in ADHD'
                ]
            },
            category: 'Wellness',
            isFree: false
        },
        {
            title: 'Medication & Therapy Integration',
            content: 'How to maximize treatment effectiveness with lifestyle changes.',
            detailedContent: {
                overview: 'Optimize your treatment plan by integrating medication, therapy, and lifestyle modifications for maximum benefit.',
                modules: [
                    'Medication Timing and Lifestyle',
                    'Therapy Techniques for Daily Life',
                    'Nutrition and Supplement Integration',
                    'Exercise Protocols for ADHD',
                    'Sleep Optimization Strategies'
                ],
                worksheets: [
                    'Treatment Tracking Log',
                    'Side Effect Management Plan',
                    'Lifestyle Integration Checklist',
                    'Communication Guide for Healthcare Providers'
                ],
                videoContent: '50 minutes with medical experts',
                scientificReferences: [
                    'Faraone, S.V. et al. (2021). ADHD Treatment Guidelines',
                    'Cortese, S. et al. (2018). Exercise for ADHD',
                    'Bloch, M.H. et al. (2011). Nutritional Supplements'
                ]
            },
            category: 'Health',
            isFree: false
        },
        {
            title: 'Workplace Accommodations Guide',
            content: 'Complete handbook for requesting and implementing workplace supports.',
            detailedContent: {
                overview: 'Navigate workplace accommodations, disclosure decisions, and create an ADHD-friendly work environment.',
                modules: [
                    'Legal Rights and ADA Guidelines',
                    'Disclosure Decision Framework',
                    'Accommodation Request Process',
                    'Creating ADHD-Friendly Workspaces',
                    'Career Advancement Strategies'
                ],
                worksheets: [
                    'Accommodation Assessment',
                    'Disclosure Decision Tree',
                    'Request Letter Templates',
                    'Workplace Optimization Checklist'
                ],
                videoContent: '40 minutes including role-play scenarios',
                scientificReferences: [
                    'EEOC Guidelines on ADHD Accommodations',
                    'Job Accommodation Network (JAN) Resources',
                    'Workplace Studies on ADHD Accommodations'
                ]
            },
            category: 'Productivity',
            isFree: false
        }
    ];

    return (
        <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            style={{
                minHeight: '100vh',
                background: getThemeBackground(),
                padding: '20px',
                fontFamily: 'Arial, sans-serif',
                color: getThemeTextColor()
            }}
        >
            <motion.button
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigateToPage('dashboard')}
                style={{
                    marginBottom: '20px',
                    padding: '10px 20px',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                }}
            >
                ← Back to Dashboard
            </motion.button>

            <motion.div
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
            >
                <h1 style={{ color: getThemeTextColor(), fontWeight: 'bold', fontSize: '2.5rem', marginBottom: '10px' }}>
                    💡 Tips & Guides
                </h1>
                <p style={{ color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b', marginBottom: '40px', fontSize: '1.1rem' }}>
                    Evidence-based strategies for ADHD, autism, and anxiety management.
                </p>
            </motion.div>

            {/* Free Tips Section */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                style={{ marginBottom: '50px' }}
            >
                <h2 style={{
                    color: '#10b981',
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    🎆 Free Tips
                    <span style={{
                        background: '#10b981',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontWeight: 'normal'
                    }}>Always Free</span>
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    maxWidth: '1200px'
                }}>
                    {freeTips.map((tip, index) => {
                        const categoryInfo = tipCategories[tip.category as keyof typeof tipCategories];
                        return (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.5 + index * 0.1 }}
                                whileHover={{ scale: 1.02, y: -5 }}
                                style={{
                                    background: getThemeCardBackground(),
                                    padding: '25px',
                                    borderRadius: '15px',
                                    boxShadow: currentTheme === 'dark' ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)',
                                    border: currentTheme === 'dark' ? '1px solid #374151' : 'none'
                                }}
                            >
                                <h3 style={{
                                    color: getThemeTextColor(),
                                    marginBottom: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '1.3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {categoryInfo.icon} {tip.title}
                                </h3>
                                <span style={{
                                    background: categoryInfo.color,
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    fontWeight: 'bold'
                                }}>
                                    {tip.category}
                                </span>
                                <p style={{
                                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                                    margin: '15px 0',
                                    lineHeight: '1.6',
                                    fontSize: '1rem'
                                }}>
                                    {tip.content}
                                </p>
                                <button
                                    onClick={() => {
                                        const ttsText = `${tip.title}. ${tip.content}`;
                                        const success = speakText(ttsText, { title: tip.title, premium: false });
                                        if (!success) {
                                            alert(`📚 ${tip.title}

${tip.content}

This is a free tip available to all users!`);
                                        }
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: categoryInfo.color,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    🗣️ Read Aloud
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {/* Premium Guides Section */}
            <motion.div
                initial={{ y: 50, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.8 }}
            >
                <h2 style={{
                    color: '#8b5cf6',
                    fontWeight: 'bold',
                    fontSize: '1.8rem',
                    marginBottom: '20px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                }}>
                    🔒 Premium Guides
                    <span style={{
                        background: '#8b5cf6',
                        color: 'white',
                        fontSize: '0.7rem',
                        padding: '3px 8px',
                        borderRadius: '12px',
                        fontWeight: 'normal'
                    }}>$5 Upgrade</span>
                </h2>

                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                    gap: '20px',
                    maxWidth: '1200px'
                }}>
                    {premiumGuides.map((guide, index) => {
                        const categoryInfo = tipCategories[guide.category as keyof typeof tipCategories];
                        const isLocked = !appState.user.subscription.isPremium;

                        return (
                            <motion.div
                                key={index}
                                initial={{ scale: 0.9, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                transition={{ delay: 0.9 + index * 0.1 }}
                                whileHover={{ scale: isLocked ? 1.01 : 1.02, y: -5 }}
                                style={{
                                    background: getThemeCardBackground(),
                                    padding: '25px',
                                    borderRadius: '15px',
                                    boxShadow: currentTheme === 'dark' ? '0 4px 20px rgba(255,255,255,0.1)' : '0 4px 15px rgba(0,0,0,0.1)',
                                    border: isLocked ? '2px solid #8b5cf6' : (currentTheme === 'dark' ? '1px solid #374151' : 'none'),
                                    opacity: isLocked ? 0.8 : 1,
                                    position: 'relative'
                                }}
                            >
                                {isLocked && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '10px',
                                        right: '10px',
                                        background: '#8b5cf6',
                                        color: 'white',
                                        fontSize: '1.2rem',
                                        padding: '5px',
                                        borderRadius: '50%',
                                        width: '30px',
                                        height: '30px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        🔒
                                    </div>
                                )}

                                <h3 style={{
                                    color: isLocked ? '#8b5cf6' : getThemeTextColor(),
                                    marginBottom: '12px',
                                    fontWeight: 'bold',
                                    fontSize: '1.3rem',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px'
                                }}>
                                    {categoryInfo.icon} {guide.title}
                                </h3>
                                <span style={{
                                    background: categoryInfo.color,
                                    color: 'white',
                                    fontSize: '0.8rem',
                                    padding: '4px 10px',
                                    borderRadius: '15px',
                                    fontWeight: 'bold'
                                }}>
                                    {guide.category}
                                </span>
                                <p style={{
                                    color: currentTheme === 'dark' ? '#cbd5e1' : '#64748b',
                                    margin: '15px 0',
                                    lineHeight: '1.6',
                                    fontSize: '1rem'
                                }}>
                                    {isLocked ? `${guide.content} Unlock full detailed guide with examples, worksheets, and step-by-step instructions.` : guide.content}
                                </p>
                                <button
                                    onClick={() => {
                                        if (isLocked) {
                                            alert('🔒 Premium Guide\n\nThis comprehensive guide is available with our $5 upgrade!\n\nIncludes:\n• Detailed step-by-step instructions\n• Downloadable worksheets\n• Video demonstrations\n• Scientific references\n\nUpgrade now to unlock all premium content!');
                                        } else {
                                            const fullContent = `${guide.title}. ${guide.content} This premium guide includes comprehensive details, scientific backing, and practical applications for managing ADHD symptoms effectively.`;
                                            const success = speakText(fullContent, { title: guide.title, premium: true });
                                            if (!success) {
                                                alert(`📚 ${guide.title}

${guide.content}

This is a premium guide with full access!`);
                                            }
                                        }
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: isLocked ? '#8b5cf6' : categoryInfo.color,
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '8px',
                                        cursor: 'pointer',
                                        fontWeight: 'bold',
                                        fontSize: '0.9rem',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                                    onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                                >
                                    {isLocked ? '🔒 Upgrade to Unlock' : '🗣️ Read Aloud'}
                                </button>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>

            {!appState.user.subscription.isPremium && (
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 1.2 }}
                    style={{
                        marginTop: '40px',
                        padding: '30px',
                        background: 'linear-gradient(135deg, #fef3c7 0%, #fed7d7 100%)',
                        borderRadius: '20px',
                        textAlign: 'center',
                        border: '2px solid #f59e0b',
                        maxWidth: '600px',
                        margin: '40px auto 0'
                    }}
                >
                    <h3 style={{ color: '#92400e', marginBottom: '15px', fontWeight: 'bold' }}>
                        🚀 Unlock Premium Guides
                    </h3>
                    <p style={{ color: '#b45309', marginBottom: '20px', lineHeight: '1.5' }}>
                        Get access to comprehensive, evidence-based guides with detailed instructions, worksheets, and scientific backing.
                    </p>
                    <button
                        onClick={() => {
                            alert('💳 Upgrade to Premium\n\nOne-time payment of $5 unlocks:\n• 4 comprehensive guides\n• Downloadable resources\n• Video content\n• Scientific references\n• Lifetime access\n\nPayment integration coming soon!');
                        }}
                        style={{
                            padding: '12px 30px',
                            background: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '10px',
                            fontSize: '1.1rem',
                            fontWeight: 'bold',
                            cursor: 'pointer',
                            transition: 'transform 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
                        onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
                    >
                        💳 Upgrade for $5
                    </button>
                </motion.div>
            )}
        </motion.div>
    );
}

// Dashboard page (default)
return (
    <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #06b6d4 0%, #3b82f6 30%, #8b5cf6 60%, #3b82f6 100%)',
        fontFamily: 'Arial, sans-serif'
    }}>
        {/* Header */}
        <div style={{
            background: 'white',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
        }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <span style={{ fontSize: '2rem', marginRight: '10px' }}>🧠</span>
                <h1 style={{ margin: 0, color: '#1e293b', fontSize: '1.5rem' }}>NeuroFlow</h1>
            </div>
            <div style={{ color: '#64748b' }}>
                Hello, {appState.user.name}! 👋
                <span style={{ marginLeft: '10px', color: '#3b82f6', fontWeight: 'bold' }}>
                    Level {appState.user.level} • {appState.user.xp} XP
                </span>
            </div>
        </div>

        {/* Main content */}
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
            <h2 style={{ color: '#1e293b', marginBottom: '30px', fontSize: '2rem' }}>
                Welcome to your ADHD companion! 🎉
            </h2>

            {/* Active Tasks Section */}
            <div style={{
                maxWidth: '800px',
                margin: '0 auto 40px',
                background: 'white',
                borderRadius: '15px',
                padding: '20px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}>
                <h3 style={{ color: '#1e293b', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ⚡ Active Quests
                    <button
                        onClick={addNewTask}
                        style={{
                            marginLeft: '10px',
                            background: '#10b981',
                            color: 'white',
                            border: 'none',
                            padding: '5px 10px',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            fontSize: '12px'
                        }}
                    >
                        + Add New
                    </button>
                </h3>
                <div style={{ textAlign: 'left' }}>
                    {appState.tasks.filter(t => !t.completed).slice(0, 3).map(task => (
                        <div key={task.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            padding: '10px',
                            margin: '10px 0',
                            background: '#f8fafc',
                            borderRadius: '8px',
                            border: '2px solid #e2e8f0'
                        }}>
                            <div>
                                <strong>{task.title}</strong>
                                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                    {task.category} • +{task.xpReward} XP
                                </div>
                            </div>
                            <button
                                onClick={() => completeTask(task.id)}
                                style={{
                                    background: '#22c55e',
                                    color: 'white',
                                    border: 'none',
                                    padding: '8px 16px',
                                    borderRadius: '6px',
                                    cursor: 'pointer',
                                    fontWeight: 'bold'
                                }}
                            >
                                ✅ Complete
                            </button>
                        </div>
                    ))}
                    {appState.tasks.filter(t => !t.completed).length === 0 && (
                        <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
                            🎉 All tasks completed! Add a new one to keep the momentum going.
                        </div>
                    )}
                </div>
            </div>

            {/* Feature Navigation Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                gap: '20px',
                maxWidth: '800px',
                margin: '0 auto',
                marginBottom: '40px'
            }}>
                {/* Feature cards with real navigation */}
                {[
                    { icon: '✅', title: 'Task Manager', desc: 'Gamified to-do lists with XP rewards', color: '#10b981', page: 'tasks' as const },
                    { icon: '🧘', title: 'Zen Mode', desc: 'Breathing exercises and mindfulness', color: '#8b5cf6', page: 'zen' as const },
                    { icon: '🎵', title: 'Sound Library', desc: '50+ focus and relaxation sounds', color: '#f59e0b', page: 'sounds' as const },
                    { icon: '💡', title: 'Tips & Guides', desc: 'Evidence-based ADHD strategies', color: '#ef4444', page: 'tips' as const }
                ].map((feature, index) => (
                    <div key={index} style={{
                        background: 'white',
                        padding: '30px',
                        borderRadius: '15px',
                        boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                        cursor: 'pointer',
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        border: `3px solid ${feature.color}20`
                    }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'translateY(-5px)';
                            e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'translateY(0)';
                            e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                        }}
                        onClick={() => {
                            console.log(`🎯 ${feature.title} clicked!`);
                            navigateToPage(feature.page);
                        }}
                    >
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '15px',
                            color: feature.color
                        }}>{feature.icon}</div>
                        <h3 style={{
                            color: '#1e293b',
                            marginBottom: '10px',
                            fontSize: '1.3rem'
                        }}>{feature.title}</h3>
                        <p style={{
                            color: '#64748b',
                            margin: 0,
                            lineHeight: '1.5'
                        }}>{feature.desc}</p>
                    </div>
                ))}
            </div>

            {/* User status and actions */}
            <div style={{
                marginTop: '40px',
                padding: '20px',
                background: appState.user.isGuest
                    ? 'linear-gradient(135deg, #fef3c7 0%, #fed7d7 100%)'
                    : 'linear-gradient(135deg, #dbeafe 0%, #e0e7ff 100%)',
                borderRadius: '15px',
                maxWidth: '600px',
                margin: '40px auto 0',
                border: `2px solid ${appState.user.isGuest ? '#f59e0b40' : '#3b82f640'}`
            }}>
                <h3 style={{
                    color: appState.user.isGuest ? '#92400e' : '#1e40af',
                    marginBottom: '10px',
                    fontSize: '1.2rem'
                }}>
                    🚀 {appState.user.isGuest ? 'Demo Mode Active' : 'Welcome to NeuroFlow!'}
                </h3>
                <p style={{
                    color: appState.user.isGuest ? '#b45309' : '#1e40af',
                    margin: '0 0 15px 0',
                    lineHeight: '1.5'
                }}>
                    {appState.user.isGuest
                        ? "You're experiencing NeuroFlow with limited features. Demo includes: 3 active tasks, 5-minute zen sessions, basic sounds, and free tips. Upgrade to unlock the full ADHD companion experience!"
                        : "You have access to all NeuroFlow features! Start your journey to better focus and calm."
                    }
                </p>
                <button
                    onClick={() => {
                        if (appState.user.isGuest) {
                            handleUpgrade();
                        } else {
                            console.log('⚙️ Settings clicked!');
                            setShowModal({ type: 'settings', data: { currentTheme } });
                        }
                    }}
                    style={{
                        padding: '10px 20px',
                        background: appState.user.isGuest ? '#f59e0b' : '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold',
                        marginRight: '10px'
                    }}
                >
                    {appState.user.isGuest ? 'Upgrade for $5' : '⚙️ Settings'}
                </button>
                <button
                    onClick={() => {
                        console.log('🚪 Sign out clicked!');
                        setAppState(null);
                        setCurrentView('landing');
                    }}
                    style={{
                        padding: '10px 20px',
                        background: 'transparent',
                        color: appState.user.isGuest ? '#92400e' : '#1e40af',
                        border: `2px solid ${appState.user.isGuest ? '#92400e' : '#1e40af'}`,
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontWeight: 'bold'
                    }}
                >
                    🚪 Sign Out
                </button>
            </div>
        </div>

        {/* Modal System */}
        {renderModal()}

        {/* Loading Overlay */}
        <AnimatePresence>
            {isLoading && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    style={{
                        position: 'fixed',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        background: 'rgba(255,255,255,0.8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 999
                    }}
                >
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}
                        style={{ fontSize: '3rem' }}
                    >
                        ⚙️
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    </div>
);
}

export default App;
