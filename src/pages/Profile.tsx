import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AppState, UserPreferences } from '../types/index';
import { calculateLevel, getXPProgress, defaultAchievements } from '../utils/gameUtils';

// Simple icon components to replace lucide-react
const User = () => <span>👤</span>;
const Settings = () => <span>⚙️</span>;
const Trophy = () => <span>🏆</span>;
const Zap = () => <span>⚡</span>;
const Target = () => <span>🎯</span>;
const Heart = () => <span>❤️</span>;
const Palette = () => <span>🎨</span>;
const Volume2 = () => <span>🔊</span>;
const Bell = () => <span>🔔</span>;
const Gamepad2 = () => <span>🎮</span>;

interface ProfileProps {
    appState: AppState;
    onUpdateState: (updates: Partial<AppState>) => void;
    onSignOut?: () => void;
    onUpgrade?: () => void;
}

const Profile: React.FC<ProfileProps> = ({ appState, onUpdateState, onSignOut, onUpgrade }) => {
    const [activeTab, setActiveTab] = useState<'profile' | 'settings' | 'achievements'>('profile');
    const [preferences, setPreferences] = useState<UserPreferences>(appState.user.preferences);

    const userLevel = calculateLevel(appState.user.xp);
    const xpProgress = getXPProgress(appState.user.xp);
    const nextLevelXP = userLevel * 1000;
    const currentLevelXP = (userLevel - 1) * 1000;

    const updatePreferences = (newPreferences: Partial<UserPreferences>) => {
        const updatedPreferences = { ...preferences, ...newPreferences };
        setPreferences(updatedPreferences);

        // Apply theme immediately to document
        if (newPreferences.theme) {
            document.documentElement.setAttribute('data-theme', newPreferences.theme);
        }

        onUpdateState({
            user: {
                ...appState.user,
                preferences: updatedPreferences
            }
        });
    };

    const updateProfile = (updates: { name?: string; avatar?: string }) => {
        onUpdateState({
            user: {
                ...appState.user,
                ...updates
            }
        });
    };

    const avatarOptions = ['🦸', '🦸‍♀️', '🧠', '⚡', '🌟', '🎯', '🎨', '🎮', '🌈', '💎', '🔥', '🌸'];
    const themeOptions = [
        { value: 'light', label: 'Light & Clean', icon: '☀️' },
        { value: 'dark', label: 'Dark & Cozy', icon: '🌙' },
        { value: 'colorful', label: 'Colorful & Fun', icon: '🌈' }
    ];

    const difficultyOptions = [
        { value: 'easy', label: 'Gentle Start', description: 'Smaller goals, more rewards' },
        { value: 'medium', label: 'Balanced Flow', description: 'Perfect mix of challenge & reward' },
        { value: 'hard', label: 'Challenge Mode', description: 'Bigger goals, epic rewards' }
    ];

    const totalTasks = appState.tasks.length;
    const completedTasks = appState.tasks.filter(t => t.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const unlockedAchievements = appState.user.achievements;
    const availableAchievements = defaultAchievements.filter(
        achievement => !unlockedAchievements.find(unlocked => unlocked.id === achievement.id)
    );

    return (
        <div className="p-4 space-y-6 max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center">
                <div className="text-6xl mb-4">{appState.user.avatar}</div>
                <h1 className="text-3xl font-bold text-gray-800">{appState.user.name}</h1>
                <p className="text-gray-600">Level {userLevel} Neurodivergent Hero</p>
            </div>

            {/* Tab Navigation */}
            <div className="flex justify-center">
                <div className="bg-white rounded-xl p-1 shadow-md">
                    {[
                        { id: 'profile', label: 'Profile', icon: User },
                        { id: 'settings', label: 'Settings', icon: Settings },
                        { id: 'achievements', label: 'Achievements', icon: Trophy }
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                ? 'bg-blue-500 text-white shadow-lg'
                                : 'text-gray-600 hover:bg-blue-50'
                                }`}
                        >
                            <tab.icon />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="space-y-6">
                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Stats Overview */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Zap />
                                Your Journey So Far
                            </h2>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                                <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">{userLevel}</div>
                                    <div className="text-sm text-gray-600">Current Level</div>
                                </div>
                                <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">{appState.user.totalPoints.toLocaleString()}</div>
                                    <div className="text-sm text-gray-600">Total XP</div>
                                </div>
                                <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">{completedTasks}</div>
                                    <div className="text-sm text-gray-600">Quests Complete</div>
                                </div>
                                <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">{appState.user.streak}</div>
                                    <div className="text-sm text-gray-600">Day Streak</div>
                                </div>
                            </div>

                            {/* XP Progress */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span>Progress to Level {userLevel + 1}</span>
                                    <span>{appState.user.xp - currentLevelXP} / {nextLevelXP - currentLevelXP} XP</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-4">
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-500 to-purple-500 rounded-full h-4"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${xpProgress}%` }}
                                        transition={{ duration: 1, ease: "easeOut" }}
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Edit Profile */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4">Customize Your Hero</h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Hero Name
                                    </label>
                                    <input
                                        type="text"
                                        value={appState.user.name}
                                        onChange={(e) => updateProfile({ name: e.target.value })}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Choose Your Avatar
                                    </label>
                                    <div className="grid grid-cols-6 gap-3">
                                        {avatarOptions.map((avatar) => (
                                            <button
                                                key={avatar}
                                                onClick={() => updateProfile({ avatar })}
                                                className={`text-3xl p-3 rounded-lg border-2 transition-all hover:scale-110 ${appState.user.avatar === avatar
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                {avatar}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Theme Settings */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Palette />
                                Appearance
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Theme</label>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                        {themeOptions.map((theme) => (
                                            <button
                                                key={theme.value}
                                                onClick={() => updatePreferences({ theme: theme.value as any })}
                                                className={`p-4 border-2 rounded-lg text-left transition-all ${preferences.theme === theme.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="text-2xl mb-2">{theme.icon}</div>
                                                <div className="font-medium">{theme.label}</div>

                                                {/* Theme Preview */}
                                                <div className="mt-2 flex gap-1">
                                                    <div className={`w-2 h-2 rounded-full ${theme.value === 'light' ? 'bg-blue-500' :
                                                        theme.value === 'dark' ? 'bg-gray-700' :
                                                            'bg-pink-500'
                                                        }`} />
                                                    <div className={`w-2 h-2 rounded-full ${theme.value === 'light' ? 'bg-gray-200' :
                                                        theme.value === 'dark' ? 'bg-gray-600' :
                                                            'bg-yellow-400'
                                                        }`} />
                                                    <div className={`w-2 h-2 rounded-full ${theme.value === 'light' ? 'bg-purple-500' :
                                                        theme.value === 'dark' ? 'bg-blue-400' :
                                                            'bg-green-400'
                                                        }`} />
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Audio Settings */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Volume2 />
                                Audio & Notifications
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Sound Effects</div>
                                        <div className="text-sm text-gray-600">Celebration sounds and audio feedback</div>
                                    </div>
                                    <button
                                        onClick={() => updatePreferences({ soundEnabled: !preferences.soundEnabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${preferences.soundEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.soundEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Animations</div>
                                        <div className="text-sm text-gray-600">Fun visual effects and transitions</div>
                                    </div>
                                    <button
                                        onClick={() => updatePreferences({ animationsEnabled: !preferences.animationsEnabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${preferences.animationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.animationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="font-medium">Notifications</div>
                                        <div className="text-sm text-gray-600">Gentle reminders and encouragement</div>
                                    </div>
                                    <button
                                        onClick={() => updatePreferences({ notificationsEnabled: !preferences.notificationsEnabled })}
                                        className={`w-12 h-6 rounded-full transition-colors ${preferences.notificationsEnabled ? 'bg-blue-500' : 'bg-gray-300'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transition-transform ${preferences.notificationsEnabled ? 'translate-x-6' : 'translate-x-1'
                                            }`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Difficulty Settings */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Gamepad2 />
                                Difficulty & Focus
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-3">Difficulty Level</label>
                                    <div className="space-y-2">
                                        {difficultyOptions.map((option) => (
                                            <button
                                                key={option.value}
                                                onClick={() => updatePreferences({ difficultyLevel: option.value as any })}
                                                className={`w-full p-4 border-2 rounded-lg text-left transition-all ${preferences.difficultyLevel === option.value
                                                    ? 'border-blue-500 bg-blue-50'
                                                    : 'border-gray-200 hover:border-blue-300'
                                                    }`}
                                            >
                                                <div className="font-medium">{option.label}</div>
                                                <div className="text-sm text-gray-600">{option.description}</div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Focus Session (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={preferences.focusSessionLength}
                                            onChange={(e) => updatePreferences({ focusSessionLength: parseInt(e.target.value) })}
                                            min="15"
                                            max="90"
                                            step="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Break Length (minutes)
                                        </label>
                                        <input
                                            type="number"
                                            value={preferences.breakLength}
                                            onChange={(e) => updatePreferences({ breakLength: parseInt(e.target.value) })}
                                            min="5"
                                            max="30"
                                            step="5"
                                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Account & Subscription */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <User />
                                Account & Subscription
                            </h2>

                            <div className="space-y-4">
                                {/* Subscription Status */}
                                <div className={`p-4 rounded-lg border-2 ${appState.user.subscription.isPremium
                                    ? 'bg-green-50 border-green-200'
                                    : appState.user.isGuest
                                        ? 'bg-yellow-50 border-yellow-200'
                                        : 'bg-blue-50 border-blue-200'
                                    }`}>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <div className="font-semibold flex items-center gap-2">
                                                {appState.user.subscription.isPremium ? '👑' : appState.user.isGuest ? '📱' : '🆓'}
                                                {appState.user.subscription.isPremium
                                                    ? 'NeuroFlow Full Version'
                                                    : appState.user.isGuest
                                                        ? 'Demo Mode'
                                                        : 'Free Account'
                                                }
                                            </div>
                                            <div className="text-sm text-gray-600">
                                                {appState.user.subscription.isPremium
                                                    ? 'All features unlocked • Lifetime access'
                                                    : appState.user.isGuest
                                                        ? 'Limited features • Try before you buy'
                                                        : 'Basic features • Upgrade for full access'
                                                }
                                            </div>
                                            {appState.user.subscription.purchaseDate && (
                                                <div className="text-xs text-gray-500 mt-1">
                                                    Purchased: {new Date(appState.user.subscription.purchaseDate).toLocaleDateString()}
                                                </div>
                                            )}
                                        </div>

                                        {!appState.user.subscription.isPremium && onUpgrade && (
                                            <button
                                                onClick={onUpgrade}
                                                className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-2 rounded-lg font-medium hover:from-purple-600 hover:to-pink-600 transition-all"
                                            >
                                                Upgrade $5
                                            </button>
                                        )}
                                    </div>
                                </div>

                                {/* Account Info */}
                                {!appState.user.isGuest && (
                                    <div className="space-y-3">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                            <div className="text-gray-600">{appState.user.email || 'Not set'}</div>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                                            <div className="text-gray-600">
                                                {appState.user.subscription.isPremium ? 'Premium User' : 'Free User'}
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Demo Limitations */}
                                {appState.user.isGuest && (
                                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                                        <h4 className="font-semibold text-yellow-800 mb-2">Demo Limitations</h4>
                                        <ul className="text-sm text-yellow-700 space-y-1">
                                            <li>• Maximum 3 tasks per day</li>
                                            <li>• Zen mode limited to 5 minutes</li>
                                            <li>• Basic themes only</li>
                                            <li>• Limited achievement system</li>
                                            <li>• No cloud sync</li>
                                        </ul>
                                        {onUpgrade && (
                                            <button
                                                onClick={onUpgrade}
                                                className="w-full mt-3 bg-yellow-500 text-white py-2 rounded-lg font-medium hover:bg-yellow-600 transition-colors"
                                            >
                                                Unlock All Features - $5
                                            </button>
                                        )}
                                    </div>
                                )}

                                {/* Sign Out */}
                                {onSignOut && !appState.user.isGuest && (
                                    <div className="pt-4 border-t border-gray-200">
                                        <button
                                            onClick={onSignOut}
                                            className="text-red-600 hover:text-red-700 font-medium transition-colors"
                                        >
                                            Sign Out
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Achievements Tab */}
                {activeTab === 'achievements' && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="space-y-6"
                    >
                        {/* Unlocked Achievements */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Trophy />
                                Unlocked Achievements ({unlockedAchievements.length})
                            </h2>

                            {unlockedAchievements.length === 0 ? (
                                <div className="text-center py-8 text-gray-500">
                                    <div className="text-4xl mb-2">🏆</div>
                                    <p>Complete your first quest to unlock achievements!</p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {unlockedAchievements.map((achievement) => (
                                        <div key={achievement.id} className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                                            <div className="flex items-start gap-3">
                                                <div className="text-3xl">{achievement.icon}</div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-800">{achievement.title}</h3>
                                                    <p className="text-sm text-gray-600 mb-2">{achievement.description}</p>
                                                    <div className="text-xs text-yellow-600">+{achievement.xpReward} XP</div>
                                                    {achievement.unlockedAt && (
                                                        <div className="text-xs text-gray-500 mt-1">
                                                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Available Achievements */}
                        <div className="card">
                            <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Target />
                                Coming Soon ({availableAchievements.length})
                            </h2>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {availableAchievements.map((achievement) => (
                                    <div key={achievement.id} className="p-4 bg-gray-50 border border-gray-200 rounded-lg opacity-75">
                                        <div className="flex items-start gap-3">
                                            <div className="text-3xl grayscale">{achievement.icon}</div>
                                            <div>
                                                <h3 className="font-semibold text-gray-600">{achievement.title}</h3>
                                                <p className="text-sm text-gray-500 mb-2">{achievement.description}</p>
                                                <div className="text-xs text-gray-400">+{achievement.xpReward} XP</div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default Profile;