/* Import enhanced pink gradient theme styles */
import '../styles/zenMode.css';
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppState, ZenActivity } from '../types/index';
import { zenActivities, getZenActivitiesByType } from '../utils/zenUtils';
import { useTheme } from '../context/ThemeContext';
// Simple icon components to replace lucide-react
const Play = () => <span>▶️</span>;
const Pause = () => <span>⏸️</span>;
const RotateCcw = () => <span>🔄</span>;
const Volume2 = () => <span>🔊</span>;
const VolumeX = () => <span>🔇</span>;
const Heart = () => <span>❤️</span>;

interface ZenModeProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const ZenMode: React.FC<ZenModeProps> = ({ appState, onUpdateState }) => {
    const { getBackgroundStyle, colors } = useTheme();
    const [currentActivity, setCurrentActivity] = useState<ZenActivity | null>(null);
    const [isActive, setIsActive] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'breathing' | 'meditation' | 'sounds' | 'mindfulness'>('all');
    const [breathingPhase, setBreathingPhase] = useState<'inhale' | 'hold1' | 'exhale' | 'hold2'>('inhale');
    const [breathingCount, setBreathingCount] = useState(4);
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [zenMusicEnabled, setZenMusicEnabled] = useState(true);
    const [breathingSoundsEnabled, setBreathingSoundsEnabled] = useState(true);
    const [meditativeMusicEnabled, setMeditativeMusicEnabled] = useState(false);
    const [brownNoiseEnabled, setBrownNoiseEnabled] = useState(false);
    const [selectedMeditativeTrack, setSelectedMeditativeTrack] = useState<'singing-bowls' | 'temple-bells' | 'zen-garden' | 'piano-meditation'>('singing-bowls');
    const [currentBreathingPattern, setCurrentBreathingPattern] = useState<'4-4-4-4' | '4-7-8-0' | '6-2-6-2'>('4-4-4-4');
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const breathingIntervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioRef = useRef<AudioBufferSourceNode | null>(null);
    const breathingAudioRef = useRef<AudioBufferSourceNode | null>(null);
    const meditativeMusicRef = useRef<AudioBufferSourceNode | null>(null);
    const brownNoiseRef = useRef<AudioBufferSourceNode | null>(null);

    const filteredActivities = selectedCategory === 'all'
        ? zenActivities
        : getZenActivitiesByType(selectedCategory);

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft((prev) => {
                    if (prev <= 1) {
                        setIsActive(false);
                        completeActivity();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
        }

        return () => {
            if (intervalRef.current) {
                clearInterval(intervalRef.current);
            }
        };
    }, [isActive, timeLeft]);

    // Breathing animation cycle
    useEffect(() => {
        if (currentActivity?.type === 'breathing' && isActive) {
            breathingIntervalRef.current = setInterval(() => {
                setBreathingCount((prev) => {
                    if (prev <= 1) {
                        setBreathingPhase((currentPhase) => {
                            let nextPhase: 'inhale' | 'hold1' | 'exhale' | 'hold2';
                            switch (currentPhase) {
                                case 'inhale':
                                    nextPhase = 'hold1';
                                    break;
                                case 'hold1':
                                    nextPhase = 'exhale';
                                    // Generate exhale sound
                                    generateBreathingSound('exhale');
                                    break;
                                case 'exhale':
                                    nextPhase = 'hold2';
                                    break;
                                case 'hold2':
                                    nextPhase = 'inhale';
                                    // Generate inhale sound
                                    generateBreathingSound('inhale');
                                    break;
                                default:
                                    nextPhase = 'inhale';
                            }
                            return nextPhase;
                        });
                        return getPhaseCount();
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current);
                breathingIntervalRef.current = null;
            }
        }

        return () => {
            if (breathingIntervalRef.current) {
                clearInterval(breathingIntervalRef.current);
            }
        };
    }, [currentActivity, isActive, breathingPhase, breathingSoundsEnabled, currentBreathingPattern]);

    // Cleanup audio when component unmounts
    useEffect(() => {
        return () => {
            stopAudio();
            stopMeditativeMusic();
            stopBrownNoise();
        };
    }, []);

    // Start/stop meditative music based on toggle
    useEffect(() => {
        if (meditativeMusicEnabled && (isActive || currentActivity === null)) {
            startMeditativeMusic();
        } else {
            stopMeditativeMusic();
        }
    }, [meditativeMusicEnabled, selectedMeditativeTrack, isActive]);

    // Start/stop brown noise based on toggle
    useEffect(() => {
        if (brownNoiseEnabled && (isActive || currentActivity === null)) {
            startBrownNoise();
        } else {
            stopBrownNoise();
        }
    }, [brownNoiseEnabled, isActive]);

    const getPhaseCount = () => {
        const pattern = currentBreathingPattern.split('-').map(Number);
        switch (breathingPhase) {
            case 'inhale': return pattern[0];
            case 'hold1': return pattern[1];
            case 'exhale': return pattern[2];
            case 'hold2': return pattern[3];
            default: return 4;
        }
    };

    // Generate breathing sounds
    const generateBreathingSound = async (phase: 'inhale' | 'exhale') => {
        if (!breathingSoundsEnabled) return;

        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Create a gentle breathing sound
            const oscillator = audioContext.createOscillator();
            const gainNode = audioContext.createGain();
            const filter = audioContext.createBiquadFilter();

            // Different frequencies for inhale vs exhale
            if (phase === 'inhale') {
                oscillator.frequency.setValueAtTime(200, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.5);
            } else {
                oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
                oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.5);
            }

            oscillator.type = 'sine';
            filter.type = 'lowpass';
            filter.frequency.value = 800;

            // Gentle volume envelope
            gainNode.gain.setValueAtTime(0, audioContext.currentTime);
            gainNode.gain.linearRampToValueAtTime(0.05, audioContext.currentTime + 0.2);
            gainNode.gain.linearRampToValueAtTime(0.03, audioContext.currentTime + 0.8);
            gainNode.gain.linearRampToValueAtTime(0, audioContext.currentTime + 1);

            oscillator.connect(filter);
            filter.connect(gainNode);
            gainNode.connect(audioContext.destination);

            oscillator.start();
            oscillator.stop(audioContext.currentTime + 1);

        } catch (error) {
            console.error('Breathing sound generation error:', error);
        }
    };

    const startActivity = (activity: ZenActivity) => {
        // Demo limitation - limit zen sessions to 5 minutes
        if (appState.user.subscription.plan === 'demo' && activity.duration > 5) {
            if (confirm('🌱 Basic Plan Limitation: Zen sessions are limited to 5 minutes.\n\n🌱 Basic Plan ($4.99): 5-minute zen sessions, basic features\n⭐ Premium Plan ($9.99): Unlimited zen sessions, advanced meditation guides\n\nWould you like to try a 5-minute version of this activity, or upgrade to Premium?')) {
                const limitedActivity = { ...activity, duration: 5 };
                setCurrentActivity(limitedActivity);
                setTimeLeft(5 * 60);
                setIsActive(true);

                // Handle different activity types
                handleActivityStart(limitedActivity);
            }
            return;
        }

        setCurrentActivity(activity);
        setTimeLeft(activity.duration * 60);
        setIsActive(true);

        // Handle different activity types
        handleActivityStart(activity);
    };

    // Enhanced activity handler for all types
    const handleActivityStart = (activity: ZenActivity) => {
        // Reset states based on activity type
        switch (activity.type) {
            case 'breathing':
                setBreathingPhase('inhale');
                const initialCount = parseInt(currentBreathingPattern.split('-')[0]);
                setBreathingCount(initialCount);
                break;

            case 'sounds':
                if (activity.audioUrl) {
                    playAudio(activity.audioUrl);
                }
                break;

            case 'meditation':
                // Meditation activities use guided instructions
                // No special audio/breathing setup needed
                break;

            case 'mindfulness':
                // Mindfulness activities like 5-4-3-2-1 grounding
                // Use instruction-based guidance
                break;
        }
    };

    const playAudio = async (audioUrl: string) => {
        if (!zenMusicEnabled) return;

        try {
            // Stop any existing audio
            if (audioRef.current) {
                audioRef.current.stop();
                audioRef.current = null;
            }

            // For demo purposes, we'll use Web Audio API to generate soothing tones
            // In a real app, you would load actual audio files
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();

            // Resume audio context if it's suspended (required for user interaction in modern browsers)
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            if (audioUrl.includes('forest')) {
                console.log('Starting forest ambience...');
                generateForestSounds(audioContext);
            } else if (audioUrl.includes('rain')) {
                generateRainSounds(audioContext);
            } else if (audioUrl.includes('ocean')) {
                generateOceanSounds(audioContext);
            }
        } catch (error) {
            console.error('Audio playback error:', error);
            // Show user-friendly error message
            alert('🔊 Audio not available: Your browser may have blocked audio playback. Please check your browser settings or try clicking the play button again.');
        }
    };

    const generateForestSounds = (audioContext: AudioContext) => {
        try {
            // Resume audio context if suspended (required for user interaction)
            if (audioContext.state === 'suspended') {
                audioContext.resume();
            }

            // Create realistic forest ambiance with gentle wind and subtle nature sounds
            const bufferSize = audioContext.sampleRate * 10; // Longer buffer for better looping
            const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
            const leftData = buffer.getChannelData(0);
            const rightData = buffer.getChannelData(1);

            for (let i = 0; i < bufferSize; i++) {
                // Base gentle wind sound - increased amplitude for better audibility
                const windBase = (Math.random() * 2 - 1) * 0.15; // Increased from 0.08

                // Low-frequency rustling (leaves) - make it more prominent
                const rustling = Math.sin(i * 0.0003) * 0.08 * (Math.random() * 0.4 + 0.8); // More prominent rustling

                // Add gentle whooshing wind variation - more noticeable
                const windVariation = Math.sin(i * 0.0001) * 0.06; // Increased from 0.03

                // Add subtle ambient forest "presence" - low frequency hum
                const ambientPresence = Math.sin(i * 0.00005) * 0.03;

                // Very rare and quiet bird chirp (once every 15-20 seconds)
                let birdChirp = 0;
                if (Math.random() < 0.000005) { // Even rarer occurrence
                    const chirpFreq = 0.015 + Math.random() * 0.01; // Vary the frequency
                    birdChirp = Math.sin(i * chirpFreq) * 0.015 * Math.exp(-(i % 2000) / 400);
                }

                // Combine all elements with better balance
                const forestSound = windBase + rustling + windVariation + ambientPresence + birdChirp;
                leftData[i] = forestSound;
                rightData[i] = forestSound * 0.95 + rustling * 1.1 + windVariation * 0.9; // Better stereo variation
            }

            const source = audioContext.createBufferSource();
            const filter = audioContext.createBiquadFilter();
            const lowpass = audioContext.createBiquadFilter();
            const gainNode = audioContext.createGain();

            // Better filtering for natural sound
            filter.type = 'lowpass';
            filter.frequency.value = 800; // Higher cutoff for more clarity
            filter.Q.value = 0.5;

            lowpass.type = 'lowpass';
            lowpass.frequency.value = 1200; // Higher for more natural sound

            // Increased volume for better audibility
            gainNode.gain.value = 0.6; // Increased from 0.3

            source.buffer = buffer;
            source.loop = true;
            source.connect(filter);
            filter.connect(lowpass);
            lowpass.connect(gainNode);
            gainNode.connect(audioContext.destination);

            if (!isAudioMuted) {
                source.start();
                audioRef.current = source;
            }
        } catch (error) {
            console.error('Error generating forest sounds:', error);
        }
    };

    const generateRainSounds = (audioContext: AudioContext) => {
        // Create gentle thunderstorm sound with soft rain and distant thunder
        const bufferSize = audioContext.sampleRate * 4;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            // Gentle rain base sound - much softer
            const rainBase = (Math.random() * 2 - 1) * 0.08;

            // Add subtle distant thunder rumble (very low frequency)
            const thunderRumble = Math.sin(i * 0.0001) * 0.03 * Math.sin(i * 0.00005);

            // Soft patter variation
            const patter = Math.sin(i * 0.01) * 0.02;

            leftData[i] = rainBase + thunderRumble + patter;
            rightData[i] = rainBase * 0.9 + thunderRumble * 0.8 + patter * 1.1; // Slight stereo variation
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const lowpass = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        // Gentle filtering to remove harsh frequencies
        filter.type = 'bandpass';
        filter.frequency.value = 800;
        filter.Q.value = 0.5;

        lowpass.type = 'lowpass';
        lowpass.frequency.value = 2000;

        // Lower volume for gentleness
        gainNode.gain.value = 0.6;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(lowpass);
        lowpass.connect(gainNode);
        gainNode.connect(audioContext.destination);

        if (!isAudioMuted) {
            source.start();
            audioRef.current = source;
        }
    };

    const generateOceanSounds = (audioContext: AudioContext) => {
        // Create ocean wave-like sound
        const bufferSize = audioContext.sampleRate * 4;
        const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
        const data = buffer.getChannelData(0);

        for (let i = 0; i < bufferSize; i++) {
            const wave = Math.sin(i * 0.001) * 0.3;
            data[i] = (Math.random() * 2 - 1) * 0.1 + wave;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.value = 400;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(audioContext.destination);

        if (!isAudioMuted) {
            source.start();
            audioRef.current = source;
        }
    };

    const stopAudio = () => {
        if (audioRef.current) {
            try {
                audioRef.current.stop();
            } catch (error) {
                console.log('Error stopping audio');
            }
            audioRef.current = null;
        }
    };

    // Generate meditative music based on selected track
    const startMeditativeMusic = async () => {
        try {
            stopMeditativeMusic(); // Stop any existing meditative music

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            switch (selectedMeditativeTrack) {
                case 'singing-bowls':
                    generateSingingBowls(audioContext);
                    break;
                case 'temple-bells':
                    generateTempleBells(audioContext);
                    break;
                case 'zen-garden':
                    generateZenGarden(audioContext);
                    break;
                case 'piano-meditation':
                    generatePianoMeditation(audioContext);
                    break;
            }
        } catch (error) {
            console.error('Error starting meditative music:', error);
        }
    };

    const stopMeditativeMusic = () => {
        if (meditativeMusicRef.current) {
            try {
                meditativeMusicRef.current.stop();
            } catch (error) {
                console.log('Error stopping meditative music');
            }
            meditativeMusicRef.current = null;
        }
    };

    // Generate brown noise for deep focus
    const startBrownNoise = async () => {
        try {
            stopBrownNoise(); // Stop any existing brown noise

            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            generateBrownNoise(audioContext);
        } catch (error) {
            console.error('Error starting brown noise:', error);
        }
    };

    const stopBrownNoise = () => {
        if (brownNoiseRef.current) {
            try {
                brownNoiseRef.current.stop();
            } catch (error) {
                console.log('Error stopping brown noise');
            }
            brownNoiseRef.current = null;
        }
    };

    // Generate singing bowls sound
    const generateSingingBowls = (audioContext: AudioContext) => {
        const bufferSize = audioContext.sampleRate * 8;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            // Create deep, resonant tones characteristic of singing bowls
            const fundamentalFreq = 0.001; // Very low base frequency
            const harmonic1 = Math.sin(i * fundamentalFreq * 2) * 0.3;
            const harmonic2 = Math.sin(i * fundamentalFreq * 3) * 0.2;
            const harmonic3 = Math.sin(i * fundamentalFreq * 5) * 0.15;

            // Add subtle vibrato and resonance
            const vibrato = Math.sin(i * 0.0001) * 0.05;
            const resonance = Math.sin(i * fundamentalFreq * 7) * 0.1;

            const bowlSound = harmonic1 + harmonic2 + harmonic3 + vibrato + resonance;
            leftData[i] = bowlSound;
            rightData[i] = bowlSound * 0.9; // Slight stereo variation
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        filter.type = 'lowpass';
        filter.frequency.value = 1200;
        gainNode.gain.value = 0.4;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        meditativeMusicRef.current = source;
    };

    // Generate temple bells sound
    const generateTempleBells = (audioContext: AudioContext) => {
        const bufferSize = audioContext.sampleRate * 6;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            // Create bell-like tones with natural decay
            let bellSound = 0;

            // Random bell strikes every few seconds
            if (i % Math.floor(audioContext.sampleRate * 3) < 1000) {
                const strikePosition = i % Math.floor(audioContext.sampleRate * 3);
                const decay = Math.exp(-strikePosition / (audioContext.sampleRate * 0.8));

                const fundamental = Math.sin(i * 0.003) * decay * 0.6;
                const harmonic = Math.sin(i * 0.005) * decay * 0.3;
                const resonance = Math.sin(i * 0.007) * decay * 0.2;

                bellSound = fundamental + harmonic + resonance;
            }

            leftData[i] = bellSound;
            rightData[i] = bellSound * 0.8;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        filter.type = 'bandpass';
        filter.frequency.value = 800;
        gainNode.gain.value = 0.5;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        meditativeMusicRef.current = source;
    };

    // Generate zen garden ambience
    const generateZenGarden = (audioContext: AudioContext) => {
        const bufferSize = audioContext.sampleRate * 10;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        for (let i = 0; i < bufferSize; i++) {
            // Gentle water trickling
            const waterTrickle = (Math.random() * 2 - 1) * 0.1 * Math.sin(i * 0.001);

            // Subtle wind through bamboo
            const bambooWind = Math.sin(i * 0.0002) * 0.05;

            // Occasional water drop
            let waterDrop = 0;
            if (Math.random() < 0.0002) {
                waterDrop = Math.sin(i * 0.01) * 0.1 * Math.exp(-(i % 1000) / 200);
            }

            const gardenSound = waterTrickle + bambooWind + waterDrop;
            leftData[i] = gardenSound;
            rightData[i] = gardenSound * 0.9;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        filter.type = 'lowpass';
        filter.frequency.value = 1000;
        gainNode.gain.value = 0.6;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        meditativeMusicRef.current = source;
    };

    // Generate soft piano meditation
    const generatePianoMeditation = (audioContext: AudioContext) => {
        const bufferSize = audioContext.sampleRate * 12;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        // Simple pentatonic scale frequencies for peaceful melody
        const notes = [0.002, 0.0025, 0.003, 0.0035, 0.004]; // Approximate piano key frequencies

        for (let i = 0; i < bufferSize; i++) {
            let pianoSound = 0;

            // Play soft notes at intervals
            const noteInterval = Math.floor(audioContext.sampleRate * 4); // Every 4 seconds
            if (i % noteInterval < audioContext.sampleRate * 2) { // Note duration: 2 seconds
                const noteIndex = Math.floor(i / noteInterval) % notes.length;
                const noteProgress = (i % noteInterval) / (audioContext.sampleRate * 2);
                const envelope = Math.sin(noteProgress * Math.PI); // Attack and decay

                pianoSound = Math.sin(i * notes[noteIndex]) * envelope * 0.3;
            }

            leftData[i] = pianoSound;
            rightData[i] = pianoSound * 0.8;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        filter.type = 'lowpass';
        filter.frequency.value = 2000;
        gainNode.gain.value = 0.4;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        meditativeMusicRef.current = source;
    };

    // Generate ring alarm sound for countdown completion
    const playRingAlarm = async () => {
        try {
            const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
            if (audioContext.state === 'suspended') {
                await audioContext.resume();
            }

            // Create a series of bell-like alarm tones
            for (let i = 0; i < 3; i++) {
                setTimeout(() => {
                    // Create oscillators for rich bell sound
                    const oscillator1 = audioContext.createOscillator();
                    const oscillator2 = audioContext.createOscillator();
                    const oscillator3 = audioContext.createOscillator();
                    const gainNode = audioContext.createGain();

                    // Bell-like frequencies with harmonics
                    oscillator1.frequency.setValueAtTime(800, audioContext.currentTime);
                    oscillator2.frequency.setValueAtTime(1200, audioContext.currentTime);
                    oscillator3.frequency.setValueAtTime(1600, audioContext.currentTime);

                    oscillator1.type = 'sine';
                    oscillator2.type = 'sine';
                    oscillator3.type = 'triangle';

                    // Create envelope for bell decay
                    gainNode.gain.setValueAtTime(0, audioContext.currentTime);
                    gainNode.gain.rapidlyLinearRampToValueAtTime(0.3, audioContext.currentTime + 0.01);
                    gainNode.gain.exponentialRampToValueAtTime(0.1, audioContext.currentTime + 0.3);
                    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 1.0);

                    // Connect all oscillators
                    oscillator1.connect(gainNode);
                    oscillator2.connect(gainNode);
                    oscillator3.connect(gainNode);
                    gainNode.connect(audioContext.destination);

                    // Start and stop
                    oscillator1.start();
                    oscillator2.start();
                    oscillator3.start();
                    oscillator1.stop(audioContext.currentTime + 1.2);
                    oscillator2.stop(audioContext.currentTime + 1.2);
                    oscillator3.stop(audioContext.currentTime + 1.2);
                }, i * 400); // Ring every 400ms
            }
        } catch (error) {
            console.error('Ring alarm error:', error);
        }
    };

    // Generate brown noise for deep focus
    const generateBrownNoise = (audioContext: AudioContext) => {
        const bufferSize = audioContext.sampleRate * 4;
        const buffer = audioContext.createBuffer(2, bufferSize, audioContext.sampleRate);
        const leftData = buffer.getChannelData(0);
        const rightData = buffer.getChannelData(1);

        let brownNoise = 0;
        for (let i = 0; i < bufferSize; i++) {
            // Brown noise generation (Brownian noise)
            const white = Math.random() * 2 - 1;
            brownNoise = (brownNoise + (0.02 * white)) / 1.02;
            brownNoise *= 0.3; // Amplitude scaling
            brownNoise = Math.max(-1, Math.min(1, brownNoise)); // Clipping

            leftData[i] = brownNoise;
            rightData[i] = brownNoise;
        }

        const source = audioContext.createBufferSource();
        const filter = audioContext.createBiquadFilter();
        const gainNode = audioContext.createGain();

        // Brown noise is naturally low-frequency, but add gentle filtering
        filter.type = 'lowpass';
        filter.frequency.value = 200;
        gainNode.gain.value = 0.5;

        source.buffer = buffer;
        source.loop = true;
        source.connect(filter);
        filter.connect(gainNode);
        gainNode.connect(audioContext.destination);

        source.start();
        brownNoiseRef.current = source;
    };

    const toggleAudio = () => {
        setIsAudioMuted(!isAudioMuted);
        if (!isAudioMuted) {
            stopAudio();
        } else if (currentActivity?.type === 'sounds' && currentActivity.audioUrl) {
            playAudio(currentActivity.audioUrl);
        }
    };

    const pauseActivity = () => {
        setIsActive(!isActive);

        if (currentActivity?.type === 'sounds') {
            if (isActive) {
                // Pausing - stop audio
                stopAudio();
            } else {
                // Resuming - restart audio
                if (currentActivity.audioUrl) {
                    playAudio(currentActivity.audioUrl);
                }
            }
        }
    };

    const resetActivity = () => {
        setIsActive(false);
        setTimeLeft(currentActivity ? currentActivity.duration * 60 : 0);

        if (currentActivity?.type === 'breathing') {
            setBreathingPhase('inhale');
            setBreathingCount(4);
        } else if (currentActivity?.type === 'sounds') {
            stopAudio();
            // Restart audio for sound activities
            if (currentActivity.audioUrl) {
                setTimeout(() => {
                    playAudio(currentActivity.audioUrl!);
                }, 100);
            }
        }
    };

    const completeActivity = () => {
        if (!currentActivity) return;

        // Play ring alarm when countdown completes
        playRingAlarm();

        // Stop any playing audio
        stopAudio();

        // Award XP for zen activity
        const xpReward = Math.min(50, currentActivity.duration * 5);
        const newXP = appState.user.xp + xpReward;

        // Update daily stats
        const today = new Date().toISOString().split('T')[0];
        const todayStats = appState.dailyStats.find(s => s.date === today) || {
            date: today,
            tasksCompleted: 0,
            focusMinutes: 0,
            zenMinutes: 0,
            xpEarned: 0,
            streakDay: false
        };

        const updatedStats = appState.dailyStats.filter(s => s.date !== today);
        updatedStats.push({
            ...todayStats,
            zenMinutes: todayStats.zenMinutes + currentActivity.duration,
            xpEarned: todayStats.xpEarned + xpReward
        });

        onUpdateState({
            user: {
                ...appState.user,
                xp: newXP,
                totalPoints: appState.user.totalPoints + xpReward
            },
            dailyStats: updatedStats
        });

        // Show completion celebration
        setTimeout(() => {
            alert(`🧘 Zen session complete! You earned ${xpReward} XP for taking care of your mental wellbeing. 💜`);
        }, 500);
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const getBreathingInstruction = () => {
        switch (breathingPhase) {
            case 'inhale': return 'Breathe In';
            case 'hold1': return 'Hold';
            case 'exhale': return 'Breathe Out';
            case 'hold2': return 'Hold';
            default: return 'Breathe In';
        }
    };

    const categoryColors = {
        breathing: 'from-pink-300 to-blue-400',
        meditation: 'from-pink-300 to-blue-300',
        sounds: 'from-blue-300 to-pink-300',
        mindfulness: 'from-pink-200 to-blue-300'
    };

    return (
        <div className="min-h-screen p-4" style={getBackgroundStyle()}>
            <div className="max-w-4xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <div className="text-4xl">🧘‍♀️</div>
                    <h1 className="text-3xl font-bold" style={{ color: colors.textPrimary }}>Zen Mode</h1>
                    <p style={{ color: colors.textSecondary }}>Take a moment to breathe and find your center</p>
                </motion.div>

                {/* Active Session */}
                <AnimatePresence>
                    {currentActivity && (
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className={`card bg-gradient-to-br ${categoryColors[currentActivity.type]} text-white text-center`}
                        >
                            <h2 className="text-2xl font-bold mb-2">{currentActivity.name}</h2>
                            <p className="text-lg opacity-90 mb-6">{currentActivity.description}</p>

                            {/* Timer Display with Ring Clock */}
                            <div className="mb-6 relative">
                                {/* Ring Progress Clock */}
                                <div className="relative w-48 h-48 mx-auto mb-4">
                                    {/* Background Ring */}
                                    <svg className="w-48 h-48 transform -rotate-90" viewBox="0 0 100 100">
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="rgba(255,255,255,0.2)"
                                            strokeWidth="3"
                                            fill="none"
                                        />
                                        {/* Progress Ring */}
                                        <circle
                                            cx="50"
                                            cy="50"
                                            r="45"
                                            stroke="#fbbf24"
                                            strokeWidth="3"
                                            fill="none"
                                            strokeLinecap="round"
                                            strokeDasharray={`${2 * Math.PI * 45}`}
                                            strokeDashoffset={`${2 * Math.PI * 45 * (1 - (currentActivity ? timeLeft / (currentActivity.duration * 60) : 1))}`}
                                            className="transition-all duration-1000 ease-linear"
                                        />
                                    </svg>

                                    {/* Clock Face */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="text-center">
                                            <div className="text-4xl font-mono font-bold text-white mb-1">
                                                {formatTime(timeLeft)}
                                            </div>
                                            <div className="text-sm text-white/70">
                                                {currentActivity ? `${Math.ceil(timeLeft / 60)} min left` : 'Ready'}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Clock Hands */}
                                    {currentActivity && (
                                        <>
                                            {/* Minute Hand */}
                                            <div
                                                className="absolute top-1/2 left-1/2 origin-bottom w-0.5 bg-white rounded-full transition-transform duration-1000"
                                                style={{
                                                    height: '35px',
                                                    transform: `translate(-50%, -100%) rotate(${((currentActivity.duration * 60 - timeLeft) / (currentActivity.duration * 60)) * 360}deg)`
                                                }}
                                            />
                                            {/* Hour Marker */}
                                            <div className="absolute top-1/2 left-1/2 w-2 h-2 bg-yellow-400 rounded-full transform -translate-x-1/2 -translate-y-1/2" />
                                        </>
                                    )}

                                    {/* Ring Animation when Active */}
                                    {isActive && (
                                        <motion.div
                                            className="absolute inset-0 rounded-full border-2 border-yellow-400"
                                            animate={{
                                                scale: [1, 1.1, 1],
                                                opacity: [0.3, 0.8, 0.3]
                                            }}
                                            transition={{
                                                duration: 2,
                                                repeat: Infinity,
                                                ease: "easeInOut"
                                            }}
                                        />
                                    )}
                                </div>
                            </div>

                            {/* Sound Activity Indicator */}
                            {currentActivity.type === 'sounds' && (
                                <div className="mb-6">
                                    <motion.div
                                        className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
                                        animate={{
                                            scale: isActive && !isAudioMuted ? [1, 1.1, 1] : 1,
                                            opacity: isAudioMuted ? 0.5 : 1
                                        }}
                                        transition={{
                                            duration: 2,
                                            repeat: isActive && !isAudioMuted ? Infinity : 0,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="text-4xl">
                                            {currentActivity.id.includes('forest') ? '🌲' :
                                                currentActivity.id.includes('rain') ? '🌧️' :
                                                    currentActivity.id.includes('ocean') ? '🌊' : '🎵'}
                                        </div>
                                    </motion.div>

                                    <div className="text-xl font-semibold mb-2">
                                        {isAudioMuted ? 'Audio Muted' : 'Listening to Nature'}
                                    </div>
                                    <div className="text-sm opacity-75">
                                        {isAudioMuted ? 'Click the volume button to unmute' : 'Let the sounds wash over you'}
                                    </div>
                                </div>
                            )}

                            {/* Breathing Animation */}
                            {currentActivity.type === 'breathing' && (
                                <div className="mb-6">
                                    <motion.div
                                        className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
                                        animate={{
                                            scale: breathingPhase === 'inhale' || breathingPhase === 'hold1' ? 1.2 : 0.8
                                        }}
                                        transition={{
                                            duration: breathingPhase.includes('hold') ? 0 : 2,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <Heart />
                                    </motion.div>

                                    <div className="text-xl font-semibold mb-2">
                                        {getBreathingInstruction()}
                                    </div>
                                    <div className="text-lg opacity-75">
                                        {breathingCount}
                                    </div>
                                </div>
                            )}

                            {/* Meditation Activity Display */}
                            {currentActivity.type === 'meditation' && (
                                <div className="mb-6">
                                    <motion.div
                                        className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
                                        animate={{
                                            opacity: isActive ? [0.6, 1, 0.6] : 1,
                                            scale: isActive ? [1, 1.05, 1] : 1
                                        }}
                                        transition={{
                                            duration: 3,
                                            repeat: isActive ? Infinity : 0,
                                            ease: "easeInOut"
                                        }}
                                    >
                                        <div className="text-4xl">🧘</div>
                                    </motion.div>

                                    <div className="text-xl font-semibold mb-2">
                                        {isActive ? 'Meditating...' : 'Ready to Meditate'}
                                    </div>
                                    <div className="text-sm opacity-75">
                                        Follow the guided instructions below
                                    </div>
                                </div>
                            )}

                            {/* Mindfulness Activity Display */}
                            {currentActivity.type === 'mindfulness' && (
                                <div className="mb-6">
                                    <motion.div
                                        className="w-32 h-32 mx-auto rounded-full bg-white/20 flex items-center justify-center mb-4"
                                        animate={{
                                            rotate: isActive ? [0, 360] : 0
                                        }}
                                        transition={{
                                            duration: 8,
                                            repeat: isActive ? Infinity : 0,
                                            ease: "linear"
                                        }}
                                    >
                                        <div className="text-4xl">
                                            {currentActivity.id.includes('grounding') ? '🌍' :
                                                currentActivity.id.includes('gratitude') ? '🙏' :
                                                    currentActivity.id.includes('breathing') ? '🌬️' : '🌟'}
                                        </div>
                                    </motion.div>

                                    <div className="text-xl font-semibold mb-2">
                                        {currentActivity.id.includes('grounding') ? 'Grounding Exercise' :
                                            currentActivity.id.includes('gratitude') ? 'Gratitude Practice' :
                                                currentActivity.id.includes('breathing') ? 'Mindful Breathing' : 'Mindfulness Practice'}
                                    </div>
                                    <div className="text-sm opacity-75">
                                        {isActive ? 'Focus on the present moment' : 'Ready to begin mindfulness'}
                                    </div>
                                </div>
                            )}

                            {/* Instructions */}
                            {currentActivity.instructions && (
                                <div className="mb-6 text-left bg-white/10 rounded-lg p-4 instructions-panel">
                                    <h3 className="font-semibold mb-2">Instructions:</h3>
                                    <ul className="space-y-1 text-sm">
                                        {currentActivity.instructions.map((instruction, index) => (
                                            <li key={index} className="flex items-start gap-2">
                                                <span className="text-yellow-300 mt-1">
                                                    {currentActivity.type === 'mindfulness' && currentActivity.id.includes('grounding') ?
                                                        `${5 - index}.` : '•'}
                                                </span>
                                                <span>{instruction}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    {/* Special guidance for specific activities */}
                                    {currentActivity.type === 'mindfulness' && currentActivity.id.includes('grounding') && (
                                        <div className="mt-3 p-2 bg-blue-500/20 rounded-lg">
                                            <div className="text-xs font-medium text-blue-200 mb-1">💡 Grounding Technique</div>
                                            <div className="text-xs text-blue-100">
                                                Take your time with each step. This exercise helps bring you back to the present moment when feeling anxious or overwhelmed.
                                            </div>
                                        </div>
                                    )}

                                    {currentActivity.type === 'meditation' && (
                                        <div className="mt-3 p-2 bg-purple-500/20 rounded-lg">
                                            <div className="text-xs font-medium text-purple-200 mb-1">🧘 Meditation Guide</div>
                                            <div className="text-xs text-purple-100">
                                                Don't worry if your mind wanders - that's completely normal. Simply notice when it happens and gently return your attention to the practice.
                                            </div>
                                        </div>
                                    )}

                                    {currentActivity.type === 'sounds' && (
                                        <div className="mt-3 p-2 bg-green-500/20 rounded-lg">
                                            <div className="text-xs font-medium text-green-200 mb-1">🎵 Sound Meditation</div>
                                            <div className="text-xs text-green-100">
                                                Let the sounds be your anchor. When thoughts arise, gently return your focus to the audio environment.
                                            </div>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Controls */}
                            <div className="flex justify-center gap-4 mb-4">
                                <motion.button
                                    onClick={pauseActivity}
                                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    {isActive ? <Pause /> : <Play />}
                                </motion.button>

                                <motion.button
                                    onClick={resetActivity}
                                    className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <RotateCcw />
                                </motion.button>

                                {/* Zen Music Toggle */}
                                {currentActivity?.type === 'sounds' && (
                                    <motion.button
                                        onClick={() => setZenMusicEnabled(!zenMusicEnabled)}
                                        className={`p-3 rounded-full transition-colors ${zenMusicEnabled ? 'bg-green-500/30' : 'bg-white/20'
                                            }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Toggle Zen Music"
                                    >
                                        {zenMusicEnabled ? <Volume2 /> : <VolumeX />}
                                    </motion.button>
                                )}

                                {/* Breathing Sounds Toggle */}
                                {currentActivity?.type === 'breathing' && (
                                    <motion.button
                                        onClick={() => setBreathingSoundsEnabled(!breathingSoundsEnabled)}
                                        className={`p-3 rounded-full transition-colors ${breathingSoundsEnabled ? 'bg-green-500/30' : 'bg-white/20'
                                            }`}
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Toggle Breathing Sounds"
                                    >
                                        {breathingSoundsEnabled ? '🎵' : '🔇'}
                                    </motion.button>
                                )}

                                {/* Audio toggle button for sound activities */}
                                {currentActivity?.type === 'sounds' && (
                                    <motion.button
                                        onClick={toggleAudio}
                                        className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                    >
                                        {isAudioMuted ? <VolumeX /> : <Volume2 />}
                                    </motion.button>
                                )}

                                {/* Special controls for meditation and mindfulness */}
                                {(currentActivity?.type === 'meditation' || currentActivity?.type === 'mindfulness') && (
                                    <motion.button
                                        onClick={() => {
                                            // Toggle between instructions visible/hidden for better focus
                                            const instructionsDiv = document.querySelector('.instructions-panel');
                                            if (instructionsDiv) {
                                                instructionsDiv.classList.toggle('opacity-50');
                                                instructionsDiv.classList.toggle('pointer-events-none');
                                            }
                                        }}
                                        className="bg-white/20 hover:bg-white/30 p-3 rounded-full transition-colors"
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        title="Dim Instructions for Focus"
                                    >
                                        📝
                                    </motion.button>
                                )}
                            </div>

                            {/* Breathing Pattern Selector */}
                            {currentActivity?.type === 'breathing' && (
                                <div className="bg-white/10 rounded-lg p-4 mb-4">
                                    <h4 className="font-semibold mb-2">Breathing Pattern:</h4>
                                    <div className="flex gap-2 flex-wrap justify-center">
                                        {[
                                            { pattern: '4-4-4-4' as const, name: 'Box Breathing', desc: '4-4-4-4' },
                                            { pattern: '4-7-8-0' as const, name: '4-7-8 Technique', desc: '4-7-8-0' },
                                            { pattern: '6-2-6-2' as const, name: 'Coherent Breathing', desc: '6-2-6-2' }
                                        ].map(({ pattern, name, desc }) => (
                                            <button
                                                key={pattern}
                                                onClick={() => {
                                                    setCurrentBreathingPattern(pattern);
                                                    // Reset breathing phase and count when pattern changes
                                                    setBreathingPhase('inhale');
                                                    const newCount = parseInt(pattern.split('-')[0]);
                                                    setBreathingCount(newCount);
                                                }}
                                                className={`px-3 py-2 rounded-lg text-sm transition-colors ${currentBreathingPattern === pattern
                                                    ? 'bg-white/30 text-white'
                                                    : 'bg-white/10 text-white/70 hover:bg-white/20'
                                                    }`}
                                            >
                                                <div className="font-medium">{name}</div>
                                                <div className="text-xs opacity-75">{desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Activity Categories */}
                <div className="flex flex-wrap gap-2 justify-center">
                    {['all', 'breathing', 'meditation', 'sounds', 'mindfulness'].map((category) => (
                        <button
                            key={category}
                            onClick={() => setSelectedCategory(category as any)}
                            className={`px-4 py-2 rounded-full font-medium transition-colors ${selectedCategory === category
                                ? 'bg-purple-500 text-white'
                                : 'hover:bg-purple-50'
                                }`}
                            style={{
                                backgroundColor: selectedCategory === category ? '#8b5cf6' : colors.cardBackground,
                                color: selectedCategory === category ? 'white' : colors.textPrimary,
                                border: `1px solid ${colors.border}`
                            }}
                        >
                            {category === 'all' ? '🌈 All' :
                                category === 'breathing' ? '🌬️ Breathing' :
                                    category === 'meditation' ? '🧘 Meditation' :
                                        category === 'sounds' ? '🎵 Sounds' :
                                            '🌟 Mindfulness'}
                        </button>
                    ))}
                </div>

                {/* Global Audio Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card text-center"
                    style={{
                        background: colors.cardBackground,
                        border: `1px solid ${colors.border}`,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <h3 className="text-lg font-semibold mb-4" style={{ color: colors.textPrimary }}>🎧 Audio Environment</h3>

                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Meditative Music Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-medium" style={{ color: colors.textPrimary }}>🎼 Meditative Music</div>
                                    <div className="text-sm" style={{ color: colors.textSecondary }}>Peaceful background music for deep meditation</div>
                                </div>
                                <motion.button
                                    onClick={() => setMeditativeMusicEnabled(!meditativeMusicEnabled)}
                                    className={`w-12 h-6 rounded-full transition-colors ${meditativeMusicEnabled ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${meditativeMusicEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </motion.button>
                            </div>

                            {meditativeMusicEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="space-y-2"
                                >
                                    <div className="text-sm font-medium" style={{ color: colors.textPrimary }}>Choose Track:</div>
                                    <div className="grid grid-cols-2 gap-2">
                                        {[
                                            { id: 'singing-bowls' as const, name: '🎌 Singing Bowls', desc: 'Tibetan bowls' },
                                            { id: 'temple-bells' as const, name: '🔔 Temple Bells', desc: 'Sacred chimes' },
                                            { id: 'zen-garden' as const, name: '🏯 Zen Garden', desc: 'Water & bamboo' },
                                            { id: 'piano-meditation' as const, name: '🎹 Soft Piano', desc: 'Gentle melodies' }
                                        ].map(track => (
                                            <button
                                                key={track.id}
                                                onClick={() => setSelectedMeditativeTrack(track.id)}
                                                className={`p-2 rounded-lg text-xs transition-colors ${selectedMeditativeTrack === track.id
                                                    ? 'bg-purple-100 border-purple-500'
                                                    : 'hover:bg-gray-50'
                                                    }`}
                                                style={{
                                                    backgroundColor: selectedMeditativeTrack === track.id ? '#f3e8ff' : colors.cardBackground,
                                                    border: `1px solid ${selectedMeditativeTrack === track.id ? '#8b5cf6' : colors.border}`,
                                                    color: colors.textPrimary
                                                }}
                                            >
                                                <div className="font-medium">{track.name}</div>
                                                <div className="text-xs opacity-75">{track.desc}</div>
                                            </button>
                                        ))}
                                    </div>
                                </motion.div>
                            )}
                        </div>

                        {/* Brown Noise Section */}
                        <div className="space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="text-left">
                                    <div className="font-medium" style={{ color: colors.textPrimary }}>🌊 Brown Noise</div>
                                    <div className="text-sm" style={{ color: colors.textSecondary }}>Deep, low-frequency noise for focus</div>
                                </div>
                                <motion.button
                                    onClick={() => setBrownNoiseEnabled(!brownNoiseEnabled)}
                                    className={`w-12 h-6 rounded-full transition-colors ${brownNoiseEnabled ? 'bg-green-500' : 'bg-gray-300'
                                        }`}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${brownNoiseEnabled ? 'translate-x-6' : 'translate-x-1'
                                        }`} />
                                </motion.button>
                            </div>

                            {brownNoiseEnabled && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="bg-blue-50 p-3 rounded-lg"
                                    style={{
                                        backgroundColor: `${colors.accent}15`,
                                        border: `1px solid ${colors.accent}30`
                                    }}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                                        <div className="text-sm" style={{ color: colors.textPrimary }}>Brown noise is playing</div>
                                    </div>
                                    <div className="text-xs mt-1" style={{ color: colors.textSecondary }}>Helps mask distractions and improve concentration</div>
                                </motion.div>
                            )}
                        </div>
                    </div>

                    {(meditativeMusicEnabled || brownNoiseEnabled) && (
                        <div className="mt-4 text-xs" style={{ color: colors.textSecondary }}>
                            💡 Tip: Audio will continue playing during all zen activities
                        </div>
                    )}
                </motion.div>

                {/* Activity Grid */}
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredActivities.map((activity) => (
                        <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`card hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br ${categoryColors[activity.type]}`}
                            onClick={() => startActivity(activity)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <div className="text-white">
                                <div className="text-3xl mb-3">
                                    {activity.type === 'breathing' ? '🌬️' :
                                        activity.type === 'meditation' ? '🧘' :
                                            activity.type === 'sounds' ? '🎵' : '🌟'}
                                </div>

                                <h3 className="text-xl font-bold mb-2">{activity.name}</h3>
                                <p className="text-sm opacity-90 mb-4">{activity.description}</p>

                                <div className="flex justify-between items-center">
                                    <span className="text-sm opacity-75">
                                        {activity.duration} minutes
                                    </span>
                                    <div className="flex items-center gap-1">
                                        <span className="text-xs opacity-75">+{Math.min(50, activity.duration * 5)} XP</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Daily Zen Stats */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="card text-center"
                    style={{
                        background: colors.cardBackground,
                        border: `1px solid ${colors.border}`,
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <h3 className="text-xl font-semibold mb-4" style={{ color: colors.textPrimary }}>Today's Zen Progress 🌸</h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <div className="text-2xl font-bold text-green-600">
                                {appState.dailyStats.find(s => s.date === new Date().toISOString().split('T')[0])?.zenMinutes || 0}
                            </div>
                            <div className="text-sm" style={{ color: colors.textSecondary }}>Minutes of Zen</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">
                                {appState.user.achievements.filter(a => a.type === 'zen').length}
                            </div>
                            <div className="text-sm" style={{ color: colors.textSecondary }}>Zen Achievements</div>
                        </div>
                    </div>
                    <p className="text-sm mt-4" style={{ color: colors.textSecondary }}>
                        Remember: Taking breaks is productive! Your mental health matters. 💜
                    </p>
                </motion.div>
            </div>
        </div>
    );
};

export default ZenMode;