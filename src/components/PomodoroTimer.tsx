import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface PomodoroTimerProps {
    onSessionComplete?: () => void;
}

type TimerMode = 'work' | 'break';
type AlarmSound = 'bell' | 'chime' | 'gentle' | 'digital';

const PomodoroTimer: React.FC<PomodoroTimerProps> = ({ onSessionComplete }) => {
    const [mode, setMode] = useState<TimerMode>('work');
    const [workDuration, setWorkDuration] = useState(25);
    const [breakDuration, setBreakDuration] = useState(5);
    const [timeLeft, setTimeLeft] = useState(workDuration * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [selectedAlarm, setSelectedAlarm] = useState<AlarmSound>('bell');
    const [sessionsCompleted, setSessionsCompleted] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const audioContextRef = useRef<AudioContext | null>(null);

    const alarmSounds: Array<{ value: AlarmSound; label: string; icon: string }> = [
        { value: 'bell', label: 'Bell', icon: '🔔' },
        { value: 'chime', label: 'Chime', icon: '🎵' },
        { value: 'gentle', label: 'Gentle', icon: '✨' },
        { value: 'digital', label: 'Digital', icon: '⏰' }
    ];

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimerComplete();
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
    }, [isRunning, timeLeft]);

    const handleTimerComplete = () => {
        setIsRunning(false);
        playAlarmSound();

        if (mode === 'work') {
            setSessionsCompleted(prev => prev + 1);
            setMode('break');
            setTimeLeft(breakDuration * 60);
            onSessionComplete?.();
        } else {
            setMode('work');
            setTimeLeft(workDuration * 60);
        }
    };

    const playAlarmSound = () => {
        if (!audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        }

        const audioContext = audioContextRef.current;
        const duration = 0.3;

        switch (selectedAlarm) {
            case 'bell':
                playBellSound(audioContext, duration);
                break;
            case 'chime':
                playChimeSound(audioContext, duration);
                break;
            case 'gentle':
                playGentleSound(audioContext, duration);
                break;
            case 'digital':
                playDigitalSound(audioContext, duration);
                break;
        }
    };

    const playBellSound = (context: AudioContext, duration: number) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(800, context.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, context.currentTime + duration);

        gainNode.gain.setValueAtTime(0.3, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration);
    };

    const playChimeSound = (context: AudioContext, duration: number) => {
        const frequencies = [523.25, 659.25, 783.99];

        frequencies.forEach((freq, index) => {
            setTimeout(() => {
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();

                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(freq, context.currentTime);

                gainNode.gain.setValueAtTime(0.2, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration);

                oscillator.connect(gainNode);
                gainNode.connect(context.destination);

                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + duration);
            }, index * 150);
        });
    };

    const playGentleSound = (context: AudioContext, duration: number) => {
        const oscillator = context.createOscillator();
        const gainNode = context.createGain();

        oscillator.type = 'sine';
        oscillator.frequency.setValueAtTime(440, context.currentTime);

        gainNode.gain.setValueAtTime(0.15, context.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + duration * 2);

        oscillator.connect(gainNode);
        gainNode.connect(context.destination);

        oscillator.start(context.currentTime);
        oscillator.stop(context.currentTime + duration * 2);
    };

    const playDigitalSound = (context: AudioContext, duration: number) => {
        for (let i = 0; i < 3; i++) {
            setTimeout(() => {
                const oscillator = context.createOscillator();
                const gainNode = context.createGain();

                oscillator.type = 'square';
                oscillator.frequency.setValueAtTime(880, context.currentTime);

                gainNode.gain.setValueAtTime(0.2, context.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.01, context.currentTime + 0.1);

                oscillator.connect(gainNode);
                gainNode.connect(context.destination);

                oscillator.start(context.currentTime);
                oscillator.stop(context.currentTime + 0.1);
            }, i * 200);
        }
    };

    const handleStart = () => {
        setIsRunning(true);
    };

    const handlePause = () => {
        setIsRunning(false);
    };

    const handleReset = () => {
        setIsRunning(false);
        setTimeLeft(mode === 'work' ? workDuration * 60 : breakDuration * 60);
    };

    const handleWorkDurationChange = (newDuration: number) => {
        setWorkDuration(newDuration);
        if (mode === 'work' && !isRunning) {
            setTimeLeft(newDuration * 60);
        }
    };

    const handleBreakDurationChange = (newDuration: number) => {
        setBreakDuration(newDuration);
        if (mode === 'break' && !isRunning) {
            setTimeLeft(newDuration * 60);
        }
    };

    const formatTime = (seconds: number): string => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const progress = mode === 'work'
        ? ((workDuration * 60 - timeLeft) / (workDuration * 60)) * 100
        : ((breakDuration * 60 - timeLeft) / (breakDuration * 60)) * 100;

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="card mb-6"
        >
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-primary flex items-center gap-2">
                    <span>⏱️</span>
                    Pomodoro Timer
                </h2>
                <div className="text-sm text-secondary">
                    Sessions: {sessionsCompleted}
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-1">
                    <div className="relative w-48 h-48 mx-auto mb-4">
                        <svg className="transform -rotate-90 w-48 h-48">
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                className="text-gray-200"
                            />
                            <circle
                                cx="96"
                                cy="96"
                                r="88"
                                stroke="currentColor"
                                strokeWidth="8"
                                fill="none"
                                strokeDasharray={`${2 * Math.PI * 88}`}
                                strokeDashoffset={`${2 * Math.PI * 88 * (1 - progress / 100)}`}
                                className={mode === 'work' ? 'text-pink-500' : 'text-blue-500'}
                                strokeLinecap="round"
                            />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center">
                            <div className="text-4xl font-bold text-primary">
                                {formatTime(timeLeft)}
                            </div>
                            <div className="text-sm text-secondary mt-1">
                                {mode === 'work' ? '🎯 Focus Time' : '☕ Break Time'}
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-3">
                        {!isRunning ? (
                            <button
                                onClick={handleStart}
                                className="bg-gradient-to-r from-pink-500 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                ▶️ Start
                            </button>
                        ) : (
                            <button
                                onClick={handlePause}
                                className="bg-gradient-to-r from-yellow-500 to-orange-600 text-white px-6 py-3 rounded-lg font-semibold hover:scale-105 transition-transform"
                            >
                                ⏸️ Pause
                            </button>
                        )}
                        <button
                            onClick={handleReset}
                            className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                        >
                            🔄 Reset
                        </button>
                    </div>
                </div>

                <div className="flex-1 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                            Work Duration (minutes)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="5"
                                max="60"
                                step="5"
                                value={workDuration}
                                onChange={(e) => handleWorkDurationChange(Number(e.target.value))}
                                disabled={isRunning}
                                className="flex-1"
                            />
                            <span className="text-lg font-semibold text-primary w-12">
                                {workDuration}m
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                            Break Duration (minutes)
                        </label>
                        <div className="flex items-center gap-3">
                            <input
                                type="range"
                                min="1"
                                max="30"
                                step="1"
                                value={breakDuration}
                                onChange={(e) => handleBreakDurationChange(Number(e.target.value))}
                                disabled={isRunning}
                                className="flex-1"
                            />
                            <span className="text-lg font-semibold text-primary w-12">
                                {breakDuration}m
                            </span>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-primary mb-2">
                            Alarm Sound
                        </label>
                        <div className="grid grid-cols-2 gap-2">
                            {alarmSounds.map(sound => (
                                <button
                                    key={sound.value}
                                    onClick={() => setSelectedAlarm(sound.value)}
                                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                        selectedAlarm === sound.value
                                            ? 'bg-gradient-to-r from-pink-500 to-purple-600 text-white'
                                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                                    }`}
                                >
                                    <span className="mr-2">{sound.icon}</span>
                                    {sound.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default PomodoroTimer;
