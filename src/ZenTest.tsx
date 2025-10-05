import React from 'react';
import ZenMode from './pages/ZenMode';
import { DailyStats } from './types/index';

// Test component to verify ZenMode works with pink theme
const ZenTest: React.FC = () => {
    const mockAppState = {
        user: {
            name: 'Test User',
            xp: 100,
            level: 1,
            isGuest: false,
            avatar: '🧠',
            streak: 0,
            totalPoints: 100,
            achievements: [],
            preferences: {
                theme: 'colorful' as const,
                soundEnabled: true,
                animationsEnabled: true,
                notificationsEnabled: true,
                difficultyLevel: 'medium' as const,
                focusSessionLength: 25,
                breakLength: 5
            },
            subscription: {
                isPremium: false,
                plan: 'demo' as const
            }
        },
        tasks: [],
        currentPage: 'zen' as const,
        soundLibrary: [],
        activeSounds: [],
        achievements: [],
        dailyStats: [] as DailyStats[]
    };

    const handleUpdateState = (updates: any) => {
        console.log('State update:', updates);
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 30%, rgb(147, 197, 253) 60%, rgb(59, 130, 246) 100%)'
        }}>
            <h1 style={{
                color: 'white',
                textAlign: 'center',
                padding: '20px',
                fontSize: '2rem',
                fontWeight: 'bold',
                textShadow: '2px 2px 4px rgba(0,0,0,0.5)'
            }}>
                🧠✨ NeuroFlow - Enhanced Pink Theme Test
            </h1>
            <ZenMode appState={mockAppState} onUpdateState={handleUpdateState} />
        </div>
    );
};

export default ZenTest;