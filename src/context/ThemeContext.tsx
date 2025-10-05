import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ThemeType = 'light' | 'dark' | 'colorful';

interface ThemeColors {
    background: string;
    cardBackground: string;
    textPrimary: string;
    textSecondary: string;
    accent: string;
    border: string;
    buttonPrimary: string;
    buttonSecondary: string;
}

interface ThemeContextType {
    theme: ThemeType;
    setTheme: (theme: ThemeType) => void;
    colors: ThemeColors;
    getBackgroundStyle: () => React.CSSProperties;
    getCardStyle: () => string;
    getButtonStyle: (variant?: 'primary' | 'secondary') => string;
}

// Pink-to-Blue gradient themes as per memory specification
const themes: Record<ThemeType, ThemeColors> = {
    light: {
        background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 25%, #fbcfe8 50%, #dbeafe 75%, #bfdbfe 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.8)',
        textPrimary: '#0f172a',
        textSecondary: '#475569',
        accent: '#3b82f6',
        border: 'rgba(148, 163, 184, 0.3)',
        buttonPrimary: 'linear-gradient(135deg, #f472b6 0%, #3b82f6 100%)',
        buttonSecondary: 'linear-gradient(135deg, #fbcfe8 0%, #dbeafe 100%)'
    },
    dark: {
        background: 'linear-gradient(135deg, #1e293b 0%, #334155 50%, #475569 100%)',
        cardBackground: 'rgba(30, 41, 59, 0.8)',
        textPrimary: '#f1f5f9',
        textSecondary: '#cbd5e1',
        accent: '#60a5fa',
        border: 'rgba(71, 85, 105, 0.5)',
        buttonPrimary: 'linear-gradient(135deg, #f472b6 0%, #60a5fa 100%)',
        buttonSecondary: 'linear-gradient(135deg, #334155 0%, #475569 100%)'
    },
    colorful: {
        background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 25%, rgb(147, 197, 253) 75%, rgb(59, 130, 246) 100%)',
        cardBackground: 'rgba(255, 255, 255, 0.85)',
        textPrimary: '#0f172a',
        textSecondary: '#1e293b',
        accent: '#fbbf24',
        border: 'rgba(255, 255, 255, 0.3)',
        buttonPrimary: 'linear-gradient(135deg, #f472b6 0%, #3b82f6 100%)',
        buttonSecondary: 'linear-gradient(135deg, rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 100%)'
    }
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
    children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
    const [theme, setTheme] = useState<ThemeType>('colorful');

    // Load theme from localStorage on mount
    useEffect(() => {
        const savedTheme = localStorage.getItem('neuroflow-theme') as ThemeType;
        if (savedTheme && themes[savedTheme]) {
            setTheme(savedTheme);
        }
    }, []);

    // Save theme to localStorage and update CSS custom properties
    useEffect(() => {
        localStorage.setItem('neuroflow-theme', theme);

        // Update CSS custom properties for global theme application
        const root = document.documentElement;
        const currentTheme = themes[theme];

        root.style.setProperty('--theme-text-primary', currentTheme.textPrimary);
        root.style.setProperty('--theme-text-secondary', currentTheme.textSecondary);
        root.style.setProperty('--theme-accent', currentTheme.accent);
        root.style.setProperty('--theme-border', currentTheme.border);

        // Set data-theme attribute for CSS targeting
        root.setAttribute('data-theme', theme);
    }, [theme]);

    const getBackgroundStyle = (): React.CSSProperties => ({
        background: themes[theme].background,
        minHeight: '100vh'
    });

    const getCardStyle = (): string => {
        const currentTheme = themes[theme];
        return `backdrop-blur-sm border border-opacity-20 rounded-xl`;
    };

    const getButtonStyle = (variant: 'primary' | 'secondary' = 'primary'): string => {
        const currentTheme = themes[theme];
        const bgStyle = variant === 'primary' ? currentTheme.buttonPrimary : currentTheme.buttonSecondary;
        return `text-white font-medium px-4 py-2 rounded-lg transition-all hover:scale-105 active:scale-95`;
    };

    const value: ThemeContextType = {
        theme,
        setTheme,
        colors: themes[theme],
        getBackgroundStyle,
        getCardStyle,
        getButtonStyle
    };

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = (): ThemeContextType => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

// Theme utility functions for components
export const getThemeColors = (theme: ThemeType) => themes[theme];

export const applyThemeToStyle = (theme: ThemeType, element: 'background' | 'card' | 'button'): React.CSSProperties => {
    const currentTheme = themes[theme];

    switch (element) {
        case 'background':
            return { background: currentTheme.background };
        case 'card':
            return {
                backgroundColor: currentTheme.cardBackground,
                border: `1px solid ${currentTheme.border}`,
                backdropFilter: 'blur(10px)'
            };
        case 'button':
            return {
                background: currentTheme.buttonPrimary,
                color: currentTheme.textPrimary
            };
        default:
            return {};
    }
};