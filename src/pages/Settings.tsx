import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, UserPreferences } from '../types/index';
import { TTSSettings } from '../types/sounds';
import { defaultTTSSettings, ttsService } from '../utils/textToSpeech';
import { themeManager, useTheme } from '../services/ThemeManager';

// Simple icon components
const Settings = () => <span>⚙️</span>;
const Volume = () => <span>🔊</span>;
const VolumeX = () => <span>🔇</span>;
const Palette = () => <span>🎨</span>;
const Bell = () => <span>🔔</span>;
const BellOff = () => <span>🔕</span>;
const Zap = () => <span>⚡</span>;
const ZapOff = () => <span>🚫</span>;
const Moon = () => <span>🌙</span>;
const Sun = () => <span>☀️</span>;
const Save = () => <span>💾</span>;
const Reset = () => <span>🔄</span>;

interface SettingsProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
}

const SettingsPage: React.FC<SettingsProps> = ({ appState, onUpdateState }) => {
    const { theme, setThemeMode, toggleAnimations, availableModes } = useTheme();
    const [preferences, setPreferences] = useState<UserPreferences>(appState.user.preferences);
    const [ttsSettings, setTTSSettings] = useState<TTSSettings>(defaultTTSSettings);
    const [availableVoices, setAvailableVoices] = useState<any[]>([]);
    const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
    const [isLoadingVoices, setIsLoadingVoices] = useState(true);

    const updatePreference = <K extends keyof UserPreferences>(
        key: K,
        value: UserPreferences[K]
    ) => {
        setPreferences(prev => ({ ...prev, [key]: value }));
        setHasUnsavedChanges(true);

        // Apply theme changes immediately through ThemeManager
        if (key === 'theme') {
            setThemeMode(value as any);
        }
        if (key === 'animationsEnabled') {
            // Update theme manager animations setting
            if (theme.animations.enabled !== value) {
                toggleAnimations();
            }
        }
    };

    const updateTTSSetting = <K extends keyof TTSSettings>(
        key: K,
        value: TTSSettings[K]
    ) => {
        setTTSSettings(prev => ({ ...prev, [key]: value }));
        setHasUnsavedChanges(true);
    };

    const saveSettings = () => {
        const updatedUser = {
            ...appState.user,
            preferences
        };

        onUpdateState({
            user: updatedUser
        });

        // Save TTS settings to localStorage
        localStorage.setItem('neuroflow-tts-settings', JSON.stringify(ttsSettings));

        // Theme is automatically saved by ThemeManager
        setHasUnsavedChanges(false);

        // Show success message
        setTimeout(() => {
            alert('✅ Settings saved successfully!');
        }, 300);
    };

    const resetToDefaults = () => {
        if (confirm('Are you sure you want to reset all settings to default values?')) {
            const defaultPreferences: UserPreferences = {
                theme: 'light',
                soundEnabled: true,
                animationsEnabled: true,
                notificationsEnabled: true,
                difficultyLevel: 'medium',
                focusSessionLength: 25,
                breakLength: 5
            };

            setPreferences(defaultPreferences);
            setTTSSettings(defaultTTSSettings);
            setHasUnsavedChanges(true);
        }
    };

    const testTTSVoice = async () => {
        if (ttsSettings.voice.isPremium && !appState.user.subscription.isPremium) {
            alert('🌟 Premium voices are available in the full version! Upgrade to access high-quality TTS voices.');
            return;
        }

        try {
            await ttsService.speak(
                "Hello! This is a test of your selected voice settings. How does this sound to you?",
                ttsSettings
            );
        } catch (error) {
            alert('❌ Voice test failed. Please check your browser settings.');
        }
    };

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-bold text-primary mb-2">
                        <Settings /> Settings
                    </h1>
                    <p className="text-secondary">
                        Customize your NeuroFlow experience
                    </p>
                </motion.div>

                {/* Save Banner */}
                {hasUnsavedChanges && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="card bg-yellow-50 border-yellow-200 mb-6"
                    >
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-yellow-600">⚠️</span>
                                <span className="text-yellow-800 font-medium">You have unsaved changes</span>
                            </div>
                            <div className="flex gap-2">
                                <button
                                    onClick={saveSettings}
                                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm"
                                >
                                    <Save /> Save Changes
                                </button>
                                <button
                                    onClick={() => {
                                        setPreferences(appState.user.preferences);
                                        setHasUnsavedChanges(false);
                                    }}
                                    className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors text-sm"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Theme Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <Palette /> Theme & Appearance
                        </h2>

                        {/* Theme Selection */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Color Theme
                            </label>
                            <div className="grid grid-cols-3 gap-3">
                                {(['light', 'dark', 'colorful'] as const).map(theme => (
                                    <button
                                        key={theme}
                                        onClick={() => updatePreference('theme', theme)}
                                        className={`p-3 rounded-lg border-2 transition-all text-center ${preferences.theme === theme
                                            ? 'border-blue-500 bg-blue-50'
                                            : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <div className="text-2xl mb-1">
                                            {theme === 'light' ? <Sun /> : theme === 'dark' ? <Moon /> : '🌈'}
                                        </div>
                                        <div className="text-sm font-medium capitalize">{theme}</div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Animation Settings */}
                        <div className="mb-4">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary">
                                    Enable Animations
                                </span>
                                <button
                                    onClick={() => updatePreference('animationsEnabled', !preferences.animationsEnabled)}
                                    className={`p-2 rounded-lg transition-colors ${preferences.animationsEnabled
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {preferences.animationsEnabled ? <Zap /> : <ZapOff />}
                                </button>
                            </label>
                            <p className="text-xs text-muted mt-1">
                                Smooth transitions and motion effects
                            </p>
                        </div>
                    </motion.div>

                    {/* Audio Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            <Volume /> Audio & Sound
                        </h2>

                        {/* Sound Toggle */}
                        <div className="mb-6">
                            <label className="flex items-center justify-between mb-2">
                                <span className="text-sm font-medium text-secondary">
                                    Enable Sound Effects
                                </span>
                                <button
                                    onClick={() => updatePreference('soundEnabled', !preferences.soundEnabled)}
                                    className={`p-2 rounded-lg transition-colors ${preferences.soundEnabled
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {preferences.soundEnabled ? <Volume /> : <VolumeX />}
                                </button>
                            </label>
                            <p className="text-xs text-muted">
                                Achievement notifications and ambient sounds
                            </p>
                        </div>

                        {/* Notification Settings */}
                        <div className="mb-4">
                            <label className="flex items-center justify-between">
                                <span className="text-sm font-medium text-secondary">
                                    Push Notifications
                                </span>
                                <button
                                    onClick={() => updatePreference('notificationsEnabled', !preferences.notificationsEnabled)}
                                    className={`p-2 rounded-lg transition-colors ${preferences.notificationsEnabled
                                        ? 'bg-green-100 text-green-600'
                                        : 'bg-gray-100 text-gray-400'
                                        }`}
                                >
                                    {preferences.notificationsEnabled ? <Bell /> : <BellOff />}
                                </button>
                            </label>
                            <p className="text-xs text-muted mt-1">
                                Reminders and achievement notifications
                            </p>
                        </div>
                    </motion.div>

                    {/* Focus Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            🎯 Focus & Productivity
                        </h2>

                        {/* Difficulty Level */}
                        <div className="mb-6">
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Difficulty Level
                            </label>
                            <select
                                value={preferences.difficultyLevel}
                                onChange={(e) => updatePreference('difficultyLevel', e.target.value as 'easy' | 'medium' | 'hard')}
                                className="w-full px-3 py-2 border border-themed rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="easy">🌱 Easy - Gentle challenges</option>
                                <option value="medium">🌿 Medium - Balanced approach</option>
                                <option value="hard">🌳 Hard - Maximum challenge</option>
                            </select>
                        </div>

                        {/* Focus Session Length */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Focus Session Length: {preferences.focusSessionLength} minutes
                            </label>
                            <input
                                type="range"
                                min="15"
                                max="60"
                                step="5"
                                value={preferences.focusSessionLength}
                                onChange={(e) => updatePreference('focusSessionLength', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted mt-1">
                                <span>15 min</span>
                                <span>60 min</span>
                            </div>
                        </div>

                        {/* Break Length */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Break Length: {preferences.breakLength} minutes
                            </label>
                            <input
                                type="range"
                                min="3"
                                max="15"
                                step="1"
                                value={preferences.breakLength}
                                onChange={(e) => updatePreference('breakLength', parseInt(e.target.value))}
                                className="w-full"
                            />
                            <div className="flex justify-between text-xs text-muted mt-1">
                                <span>3 min</span>
                                <span>15 min</span>
                            </div>
                        </div>
                    </motion.div>

                    {/* TTS Settings */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="card"
                    >
                        <h2 className="text-xl font-bold text-primary mb-4 flex items-center gap-2">
                            🎙️ Text-to-Speech
                        </h2>

                        {/* Voice Selection */}
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-secondary mb-2">
                                Voice
                            </label>
                            <select
                                value={ttsSettings.voice.id}
                                onChange={(e) => {
                                    const voice = availableVoices.find(v => v.id === e.target.value);
                                    if (voice) updateTTSSetting('voice', voice);
                                }}
                                className="w-full px-3 py-2 border border-themed rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                {availableVoices.map(voice => (
                                    <option key={voice.id} value={voice.id}>
                                        {voice.name} {voice.isPremium && !appState.user.subscription.isPremium ? '(Premium)' : ''}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Voice Settings */}
                        <div className="space-y-4 mb-4">
                            {/* Speed */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    Speed: {ttsSettings.rate.toFixed(1)}x
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={ttsSettings.rate}
                                    onChange={(e) => updateTTSSetting('rate', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Pitch */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    Pitch: {ttsSettings.pitch.toFixed(1)}
                                </label>
                                <input
                                    type="range"
                                    min="0.5"
                                    max="2"
                                    step="0.1"
                                    value={ttsSettings.pitch}
                                    onChange={(e) => updateTTSSetting('pitch', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>

                            {/* Volume */}
                            <div>
                                <label className="block text-sm font-medium text-secondary mb-1">
                                    Volume: {Math.round(ttsSettings.volume * 100)}%
                                </label>
                                <input
                                    type="range"
                                    min="0"
                                    max="1"
                                    step="0.1"
                                    value={ttsSettings.volume}
                                    onChange={(e) => updateTTSSetting('volume', parseFloat(e.target.value))}
                                    className="w-full"
                                />
                            </div>
                        </div>

                        {/* Test Voice Button */}
                        <button
                            onClick={testTTSVoice}
                            className="w-full px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                        >
                            🎤 Test Voice
                        </button>
                    </motion.div>
                </div>

                {/* Action Buttons */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-4 mt-8 justify-center"
                >
                    <button
                        onClick={saveSettings}
                        disabled={!hasUnsavedChanges}
                        className="px-6 py-3 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                    >
                        <Save /> Save All Settings
                    </button>
                    <button
                        onClick={resetToDefaults}
                        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                    >
                        <Reset /> Reset to Defaults
                    </button>
                </motion.div>

                {/* Premium Features Notice */}
                {!appState.user.subscription.isPremium && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="card bg-gradient-to-r from-purple-400 to-pink-500 text-white mt-8 text-center"
                    >
                        <h3 className="font-bold text-lg mb-2">🌟 Unlock Premium Settings</h3>
                        <p className="text-sm opacity-90 mb-4">
                            Get access to premium TTS voices, advanced customization options, and personalized settings profiles!
                        </p>
                        <button className="btn-secondary bg-white text-purple-600 hover:bg-gray-100">
                            Upgrade to Premium
                        </button>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SettingsPage;