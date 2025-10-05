/**
 * Centralized Theme Management Service
 * Handles theme persistence, synchronization, and application
 */

import React from 'react';

export type ThemeMode = 'light' | 'dark' | 'colorful';

export interface ThemeConfig {
    mode: ThemeMode;
    colors: {
        primary: string;
        secondary: string;
        accent: string;
        background: string;
        surface: string;
        text: string;
        textSecondary: string;
    };
    gradients: {
        primary: string;
        secondary: string;
        background: string;
    };
    animations: {
        enabled: boolean;
        duration: string;
        easing: string;
    };
}

const THEME_STORAGE_KEY = 'neuroflow-theme-config';
const THEME_MODE_KEY = 'neuroflow-theme';

export class ThemeManager {
    private static instance: ThemeManager;
    private currentTheme: ThemeConfig;
    private observers: Set<(theme: ThemeConfig) => void> = new Set();
    private isInitialized = false;

    private constructor() {
        this.currentTheme = this.getDefaultTheme('light');
        this.initializeTheme();
    }

    public static getInstance(): ThemeManager {
        if (!ThemeManager.instance) {
            ThemeManager.instance = new ThemeManager();
        }
        return ThemeManager.instance;
    }

    /**
     * Initialize theme from storage and apply to document
     */
    private async initializeTheme(): Promise<void> {
        try {
            // Load saved theme mode
            const savedMode = localStorage.getItem(THEME_MODE_KEY) as ThemeMode;
            const savedConfig = localStorage.getItem(THEME_STORAGE_KEY);

            if (savedConfig) {
                try {
                    this.currentTheme = JSON.parse(savedConfig);
                } catch (error) {
                    console.warn('Failed to parse saved theme config, using default');
                    this.currentTheme = this.getDefaultTheme(savedMode || 'light');
                }
            } else if (savedMode) {
                this.currentTheme = this.getDefaultTheme(savedMode);
            }

            // Apply theme to document
            this.applyThemeToDocument();
            this.isInitialized = true;
        } catch (error) {
            console.error('Theme initialization failed:', error);
            this.currentTheme = this.getDefaultTheme('light');
            this.applyThemeToDocument();
            this.isInitialized = true;
        }
    }

    /**
     * Get default theme configuration for a specific mode
     */
    private getDefaultTheme(mode: ThemeMode): ThemeConfig {
        const baseAnimations = {
            enabled: true,
            duration: '200ms',
            easing: 'ease-in-out'
        };

        switch (mode) {
            case 'light':
                return {
                    mode: 'light',
                    colors: {
                        primary: '#2563eb',
                        secondary: '#64748b',
                        accent: '#06b6d4',
                        background: '#f8fafc',
                        surface: '#ffffff',
                        text: '#1e293b',
                        textSecondary: '#64748b'
                    },
                    gradients: {
                        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        background: 'linear-gradient(135deg, #fdf2f8 0%, #fae8ff 50%, #eff6ff 100%)'
                    },
                    animations: baseAnimations
                };

            case 'dark':
                return {
                    mode: 'dark',
                    colors: {
                        primary: '#3b82f6',
                        secondary: '#94a3b8',
                        accent: '#06b6d4',
                        background: '#0f0f17',
                        surface: '#1e1e2e',
                        text: '#f1f5f9',
                        textSecondary: '#cbd5e1'
                    },
                    gradients: {
                        primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                        background: 'linear-gradient(135deg, #0f0f17 0%, #1e1b4b 50%, #581c87 100%)'
                    },
                    animations: baseAnimations
                };

            case 'colorful':
                return {
                    mode: 'colorful',
                    colors: {
                        primary: '#ec4899',
                        secondary: '#8b5cf6',
                        accent: '#06b6d4',
                        background: '#fef7ed',
                        surface: '#ffffff',
                        text: '#374151',
                        textSecondary: '#6b7280'
                    },
                    gradients: {
                        primary: 'linear-gradient(135deg, #ff6b6b 0%, #feca57 50%, #48dbfb 100%)',
                        secondary: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
                        background: 'linear-gradient(135deg, #fed7aa 0%, #fca5a5 50%, #c4b5fd 100%)'
                    },
                    animations: { ...baseAnimations, duration: '300ms' }
                };

            default:
                return this.getDefaultTheme('light');
        }
    }

    /**
     * Set theme mode and update configuration
     */
    public setThemeMode(mode: ThemeMode): void {
        const newTheme = this.getDefaultTheme(mode);
        this.setTheme(newTheme);
    }

    /**
     * Set complete theme configuration
     */
    public setTheme(theme: ThemeConfig): void {
        this.currentTheme = theme;
        this.applyThemeToDocument();
        this.saveTheme();
        this.notifyObservers();
    }

    /**
     * Get current theme configuration
     */
    public getCurrentTheme(): ThemeConfig {
        return { ...this.currentTheme };
    }

    /**
     * Get current theme mode
     */
    public getCurrentMode(): ThemeMode {
        return this.currentTheme.mode;
    }

    /**
     * Apply theme to document root
     */
    private applyThemeToDocument(): void {
        const root = document.documentElement;
        const theme = this.currentTheme;

        // Set theme mode attribute
        root.setAttribute('data-theme', theme.mode);

        // Apply CSS custom properties
        root.style.setProperty('--color-primary', theme.colors.primary);
        root.style.setProperty('--color-secondary', theme.colors.secondary);
        root.style.setProperty('--color-accent', theme.colors.accent);
        root.style.setProperty('--color-background', theme.colors.background);
        root.style.setProperty('--color-surface', theme.colors.surface);
        root.style.setProperty('--color-text', theme.colors.text);
        root.style.setProperty('--color-text-secondary', theme.colors.textSecondary);

        // Apply gradients
        root.style.setProperty('--gradient-primary', theme.gradients.primary);
        root.style.setProperty('--gradient-secondary', theme.gradients.secondary);
        root.style.setProperty('--gradient-background', theme.gradients.background);

        // Apply animation settings
        root.style.setProperty('--animation-duration', theme.animations.duration);
        root.style.setProperty('--animation-easing', theme.animations.easing);
        
        if (!theme.animations.enabled) {
            root.style.setProperty('--animation-duration', '0ms');
        }

        // Apply enhanced dark mode styles
        if (theme.mode === 'dark') {
            this.applyDarkModeEnhancements();
        }

        console.log(`Theme applied: ${theme.mode}`);
    }

    /**
     * Apply enhanced dark mode specific styles
     */
    private applyDarkModeEnhancements(): void {
        const root = document.documentElement;
        
        // Enhanced dark mode CSS properties for better contrast and accessibility
        root.style.setProperty('--shadow-low', '0 1px 3px rgba(0, 0, 0, 0.4)');
        root.style.setProperty('--shadow-medium', '0 4px 6px rgba(0, 0, 0, 0.3)');
        root.style.setProperty('--shadow-high', '0 10px 25px rgba(0, 0, 0, 0.5)');
        root.style.setProperty('--border-color', 'rgba(148, 163, 184, 0.2)');
        root.style.setProperty('--hover-overlay', 'rgba(255, 255, 255, 0.05)');
    }

    /**
     * Save current theme to localStorage
     */
    private saveTheme(): void {
        try {
            localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(this.currentTheme));
            localStorage.setItem(THEME_MODE_KEY, this.currentTheme.mode);
        } catch (error) {
            console.error('Failed to save theme:', error);
        }
    }

    /**
     * Subscribe to theme changes
     */
    public observe(callback: (theme: ThemeConfig) => void): () => void {
        this.observers.add(callback);
        
        // Immediately call with current theme if initialized
        if (this.isInitialized) {
            callback(this.currentTheme);
        }
        
        // Return unsubscribe function
        return () => {
            this.observers.delete(callback);
        };
    }

    /**
     * Notify all observers of theme changes
     */
    private notifyObservers(): void {
        this.observers.forEach(callback => {
            try {
                callback(this.currentTheme);
            } catch (error) {
                console.error('Theme observer error:', error);
            }
        });
    }

    /**
     * Toggle between light and dark modes
     */
    public toggleDarkMode(): void {
        const newMode = this.currentTheme.mode === 'dark' ? 'light' : 'dark';
        this.setThemeMode(newMode);
    }

    /**
     * Check if animations are enabled
     */
    public areAnimationsEnabled(): boolean {
        return this.currentTheme.animations.enabled;
    }

    /**
     * Toggle animations
     */
    public toggleAnimations(): void {
        const newTheme = {
            ...this.currentTheme,
            animations: {
                ...this.currentTheme.animations,
                enabled: !this.currentTheme.animations.enabled
            }
        };
        this.setTheme(newTheme);
    }

    /**
     * Reset theme to default for current mode
     */
    public resetToDefault(): void {
        const defaultTheme = this.getDefaultTheme(this.currentTheme.mode);
        this.setTheme(defaultTheme);
    }

    /**
     * Get available theme modes
     */
    public getAvailableModes(): ThemeMode[] {
        return ['light', 'dark', 'colorful'];
    }

    /**
     * Check if theme is initialized
     */
    public isThemeInitialized(): boolean {
        return this.isInitialized;
    }

    /**
     * Wait for theme initialization
     */
    public async waitForInitialization(): Promise<void> {
        if (this.isInitialized) return;
        
        return new Promise(resolve => {
            const checkInterval = setInterval(() => {
                if (this.isInitialized) {
                    clearInterval(checkInterval);
                    resolve();
                }
            }, 10);
        });
    }
}

// Export singleton instance
export const themeManager = ThemeManager.getInstance();

// React hook for theme management
export function useTheme() {
    const [theme, setTheme] = React.useState<ThemeConfig>(themeManager.getCurrentTheme());
    
    React.useEffect(() => {
        const unsubscribe = themeManager.observe(setTheme);
        return unsubscribe;
    }, []);
    
    return {
        theme,
        setThemeMode: (mode: ThemeMode) => themeManager.setThemeMode(mode),
        toggleDarkMode: () => themeManager.toggleDarkMode(),
        toggleAnimations: () => themeManager.toggleAnimations(),
        resetToDefault: () => themeManager.resetToDefault(),
        availableModes: themeManager.getAvailableModes()
    };
}

// Initialize theme on module load
themeManager.waitForInitialization();