/**
 * Accessibility Service
 * Ensures ADHD-specific optimizations and WCAG 2.1 AA compliance
 */

import { themeManager } from './ThemeManager';

// Accessibility preference types
export interface AccessibilityPreferences {
    reducedMotion: boolean;
    highContrast: boolean;
    focusIndicators: 'standard' | 'enhanced' | 'high-visibility';
    fontSize: 'small' | 'medium' | 'large' | 'extra-large';
    soundEnabled: boolean;
    autoplay: boolean;
    keyboardNavigation: boolean;
    screenReaderOptimized: boolean;
    adhd: {
        attentionBreaks: boolean;
        breakInterval: number; // minutes
        focusReminders: boolean;
        distractionReduction: boolean;
        cognitiveLoadReduction: boolean;
    };
    sensoryPreferences: {
        flashingContent: boolean;
        parallaxEffects: boolean;
        videoAutoplay: boolean;
        backgroundSounds: boolean;
    };
}

// Accessibility issue types
export interface AccessibilityIssue {
    id: string;
    type: 'error' | 'warning' | 'info';
    category: 'contrast' | 'keyboard' | 'focus' | 'aria' | 'structure' | 'motion' | 'adhd';
    element: string;
    description: string;
    solution: string;
    wcagCriterion?: string;
}

// Focus management
export interface FocusTracker {
    currentElement: HTMLElement | null;
    focusHistory: HTMLElement[];
    trapStack: HTMLElement[];
}

class AccessibilityService {
    private static instance: AccessibilityService;
    private preferences: AccessibilityPreferences;
    private focusTracker: FocusTracker;
    private breakTimer: NodeJS.Timeout | null = null;
    private focusReminderTimer: NodeJS.Timeout | null = null;
    private observers: Set<(prefs: AccessibilityPreferences) => void> = new Set();
    private isInitialized = false;

    private constructor() {
        this.preferences = this.getDefaultPreferences();
        this.focusTracker = {
            currentElement: null,
            focusHistory: [],
            trapStack: []
        };
        this.initialize();
    }

    public static getInstance(): AccessibilityService {
        if (!AccessibilityService.instance) {
            AccessibilityService.instance = new AccessibilityService();
        }
        return AccessibilityService.instance;
    }

    /**
     * Initialize accessibility service
     */
    private async initialize(): Promise<void> {
        try {
            // Load saved preferences
            this.loadPreferences();
            
            // Apply preferences
            this.applyPreferences();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize ADHD-specific features
            this.initializeADHDFeatures();
            
            // Set up periodic accessibility checks
            this.scheduleAccessibilityChecks();
            
            this.isInitialized = true;
        } catch (error) {
            console.error('Accessibility service initialization failed:', error);
        }
    }

    /**
     * Get default accessibility preferences
     */
    private getDefaultPreferences(): AccessibilityPreferences {
        return {
            reducedMotion: window.matchMedia('(prefers-reduced-motion: reduce)').matches,
            highContrast: window.matchMedia('(prefers-contrast: high)').matches,
            focusIndicators: 'enhanced',
            fontSize: 'medium',
            soundEnabled: true,
            autoplay: false,
            keyboardNavigation: true,
            screenReaderOptimized: false,
            adhd: {
                attentionBreaks: true,
                breakInterval: 25, // Pomodoro technique
                focusReminders: true,
                distractionReduction: true,
                cognitiveLoadReduction: true
            },
            sensoryPreferences: {
                flashingContent: false,
                parallaxEffects: !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
                videoAutoplay: false,
                backgroundSounds: true
            }
        };
    }

    /**
     * Set up event listeners for accessibility
     */
    private setupEventListeners(): void {
        // Keyboard navigation
        document.addEventListener('keydown', this.handleKeyboardNavigation.bind(this));
        
        // Focus tracking
        document.addEventListener('focusin', this.handleFocusIn.bind(this));
        document.addEventListener('focusout', this.handleFocusOut.bind(this));
        
        // Media query changes
        window.matchMedia('(prefers-reduced-motion: reduce)').addListener(this.handleMotionPreferenceChange.bind(this));
        window.matchMedia('(prefers-contrast: high)').addListener(this.handleContrastPreferenceChange.bind(this));
        
        // Window events
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('beforeunload', this.cleanup.bind(this));
    }

    /**
     * Handle keyboard navigation
     */
    private handleKeyboardNavigation(event: KeyboardEvent): void {
        if (!this.preferences.keyboardNavigation) return;

        // Enhanced keyboard navigation for ADHD users
        switch (event.key) {
            case 'Tab':
                this.handleTabNavigation(event);
                break;
            case 'Escape':
                this.handleEscapeKey(event);
                break;
            case 'F6':
                this.handleLandmarkNavigation(event);
                break;
            case ' ':
                if (event.target && (event.target as HTMLElement).role === 'button') {
                    event.preventDefault();
                    (event.target as HTMLElement).click();
                }
                break;
        }
    }

    /**
     * Handle tab navigation with focus trapping
     */
    private handleTabNavigation(event: KeyboardEvent): void {
        const focusableElements = this.getFocusableElements();
        const currentIndex = focusableElements.indexOf(document.activeElement as HTMLElement);
        
        if (event.shiftKey) {
            // Shift+Tab (backward)
            if (currentIndex <= 0) {
                event.preventDefault();
                focusableElements[focusableElements.length - 1]?.focus();
            }
        } else {
            // Tab (forward)
            if (currentIndex >= focusableElements.length - 1) {
                event.preventDefault();
                focusableElements[0]?.focus();
            }
        }
    }

    /**
     * Handle escape key for closing modals/menus
     */
    private handleEscapeKey(event: KeyboardEvent): void {
        // Close any open modals or focus traps
        const modal = document.querySelector('[role=\"dialog\"][aria-modal=\"true\"]');
        if (modal) {
            const closeButton = modal.querySelector('[data-close]') as HTMLElement;
            if (closeButton) {
                closeButton.click();
            }
        }
        
        // Return focus to last trapped element
        this.releaseFocusTrap();
    }

    /**
     * Handle landmark navigation (F6)
     */
    private handleLandmarkNavigation(event: KeyboardEvent): void {
        event.preventDefault();
        const landmarks = document.querySelectorAll('[role=\"main\"], [role=\"navigation\"], [role=\"banner\"], [role=\"contentinfo\"], [role=\"complementary\"]');
        
        if (landmarks.length > 0) {
            const current = document.activeElement;
            let nextIndex = 0;
            
            for (let i = 0; i < landmarks.length; i++) {
                if (landmarks[i].contains(current)) {
                    nextIndex = (i + 1) % landmarks.length;
                    break;
                }
            }
            
            (landmarks[nextIndex] as HTMLElement).focus();
        }
    }

    /**
     * Get all focusable elements
     */
    private getFocusableElements(): HTMLElement[] {
        const selectors = [
            'button:not([disabled])',
            'input:not([disabled])',
            'select:not([disabled])',
            'textarea:not([disabled])',
            'a[href]',
            '[tabindex]:not([tabindex=\"-1\"])',
            '[role=\"button\"]:not([disabled])'
        ].join(', ');
        
        return Array.from(document.querySelectorAll(selectors)) as HTMLElement[];
    }

    /**
     * Focus tracking
     */
    private handleFocusIn(event: FocusEvent): void {
        const target = event.target as HTMLElement;
        if (target) {
            this.focusTracker.currentElement = target;
            this.focusTracker.focusHistory.push(target);
            
            // Limit history to prevent memory leaks
            if (this.focusTracker.focusHistory.length > 50) {
                this.focusTracker.focusHistory = this.focusTracker.focusHistory.slice(-25);
            }
            
            // Announce focus changes for screen readers
            this.announceFocusChange(target);
        }
    }

    private handleFocusOut(event: FocusEvent): void {
        // Focus out handling if needed
    }

    /**
     * Initialize ADHD-specific features
     */
    private initializeADHDFeatures(): void {
        if (this.preferences.adhd.attentionBreaks) {
            this.startAttentionBreakTimer();
        }
        
        if (this.preferences.adhd.focusReminders) {
            this.startFocusReminders();
        }
        
        if (this.preferences.adhd.distractionReduction) {
            this.applyDistractionReduction();
        }
        
        if (this.preferences.adhd.cognitiveLoadReduction) {
            this.applyCognitiveLoadReduction();
        }
    }

    /**
     * Start attention break timer
     */
    private startAttentionBreakTimer(): void {
        if (this.breakTimer) {
            clearInterval(this.breakTimer);
        }
        
        const intervalMs = this.preferences.adhd.breakInterval * 60 * 1000;
        this.breakTimer = setInterval(() => {
            this.showAttentionBreakNotification();
        }, intervalMs);
    }

    /**
     * Show attention break notification
     */
    private showAttentionBreakNotification(): void {
        if (!document.hidden) {
            // Create a non-intrusive notification
            const notification = document.createElement('div');
            notification.className = 'attention-break-notification';
            notification.setAttribute('role', 'alert');
            notification.setAttribute('aria-live', 'polite');
            notification.innerHTML = `
                <div class=\"bg-blue-500 text-white p-4 rounded-lg shadow-lg fixed top-4 right-4 z-50 max-w-sm\">
                    <div class=\"flex items-center gap-3\">
                        <span class=\"text-2xl\">⏰</span>
                        <div>
                            <h3 class=\"font-semibold\">Time for a break!</h3>
                            <p class=\"text-sm opacity-90\">You've been focused for ${this.preferences.adhd.breakInterval} minutes.</p>
                        </div>
                        <button class=\"ml-auto text-white hover:bg-white/20 p-1 rounded\" onclick=\"this.parentElement.parentElement.remove()\">
                            ✕
                        </button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(notification);
            
            // Auto-remove after 10 seconds
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 10000);
        }
    }

    /**
     * Apply distraction reduction
     */
    private applyDistractionReduction(): void {
        const style = document.createElement('style');
        style.textContent = `
            /* Reduce distracting animations */
            .distraction-reduced * {
                animation-duration: 0.1s !important;
                transition-duration: 0.1s !important;
            }
            
            /* Hide decorative elements */
            .distraction-reduced .decorative {
                display: none !important;
            }
            
            /* Simplify focus indicators */
            .distraction-reduced *:focus {
                outline: 3px solid #2563eb !important;
                outline-offset: 2px !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.classList.add('distraction-reduced');
    }

    /**
     * Apply cognitive load reduction
     */
    private applyCognitiveLoadReduction(): void {
        const style = document.createElement('style');
        style.textContent = `
            /* Increase spacing for easier scanning */
            .cognitive-load-reduced .card {
                padding: 2rem !important;
                margin-bottom: 2rem !important;
            }
            
            /* Limit content width */
            .cognitive-load-reduced .prose {
                max-width: 65ch !important;
            }
            
            /* Enhance readability */
            .cognitive-load-reduced p {
                line-height: 1.8 !important;
                margin-bottom: 1.5rem !important;
            }
        `;
        
        document.head.appendChild(style);
        document.body.classList.add('cognitive-load-reduced');
    }

    /**
     * Apply accessibility preferences
     */
    private applyPreferences(): void {
        // Apply motion preferences
        if (this.preferences.reducedMotion) {
            document.documentElement.style.setProperty('--animation-duration', '0.01ms');
            document.body.classList.add('reduce-motion');
        }
        
        // Apply contrast preferences
        if (this.preferences.highContrast) {
            document.body.classList.add('high-contrast');
        }
        
        // Apply font size
        this.applyFontSize();
        
        // Apply focus indicators
        this.applyFocusIndicators();
        
        // Apply sensory preferences
        this.applySensoryPreferences();
    }

    /**
     * Apply font size preferences
     */
    private applyFontSize(): void {
        const sizeMap = {
            'small': '0.875rem',
            'medium': '1rem',
            'large': '1.125rem',
            'extra-large': '1.25rem'
        };
        
        document.documentElement.style.fontSize = sizeMap[this.preferences.fontSize];
    }

    /**
     * Apply focus indicator preferences
     */
    private applyFocusIndicators(): void {
        const style = document.createElement('style');
        
        switch (this.preferences.focusIndicators) {
            case 'enhanced':
                style.textContent = `
                    *:focus {
                        outline: 3px solid #2563eb !important;
                        outline-offset: 2px !important;
                        box-shadow: 0 0 0 6px rgba(37, 99, 235, 0.2) !important;
                    }
                `;
                break;
            case 'high-visibility':
                style.textContent = `
                    *:focus {
                        outline: 4px solid #dc2626 !important;
                        outline-offset: 3px !important;
                        box-shadow: 0 0 0 8px rgba(220, 38, 38, 0.3) !important;
                        background-color: #fef2f2 !important;
                    }
                `;
                break;
        }
        
        document.head.appendChild(style);
    }

    /**
     * Apply sensory preferences
     */
    private applySensoryPreferences(): void {
        if (!this.preferences.sensoryPreferences.flashingContent) {
            const style = document.createElement('style');
            style.textContent = `
                @keyframes none {
                    0%, 100% { opacity: 1; }
                }
                
                .flashing, .blinking, .pulse {
                    animation: none !important;
                }
            `;
            document.head.appendChild(style);
        }
        
        if (!this.preferences.sensoryPreferences.parallaxEffects) {
            document.body.classList.add('no-parallax');
        }
    }

    /**
     * Run accessibility audit
     */
    public runAccessibilityAudit(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // Check color contrast
        issues.push(...this.checkColorContrast());
        
        // Check keyboard accessibility
        issues.push(...this.checkKeyboardAccessibility());
        
        // Check ARIA attributes
        issues.push(...this.checkAriaAttributes());
        
        // Check focus management
        issues.push(...this.checkFocusManagement());
        
        // Check ADHD-specific issues
        issues.push(...this.checkADHDAccessibility());
        
        return issues;
    }

    /**
     * Check color contrast
     */
    private checkColorContrast(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // This would implement actual contrast checking
        // For now, return empty array
        
        return issues;
    }

    /**
     * Check keyboard accessibility
     */
    private checkKeyboardAccessibility(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // Check for elements that should be focusable
        const interactiveElements = document.querySelectorAll('button, a, input, select, textarea, [role=\"button\"]');
        
        interactiveElements.forEach((element, index) => {
            if (!element.hasAttribute('tabindex') && element.getAttribute('tabindex') === '-1') {
                issues.push({
                    id: `keyboard-${index}`,
                    type: 'error',
                    category: 'keyboard',
                    element: element.tagName.toLowerCase(),
                    description: 'Interactive element is not keyboard accessible',
                    solution: 'Add appropriate tabindex or ensure element is naturally focusable',
                    wcagCriterion: '2.1.1 Keyboard'
                });
            }
        });
        
        return issues;
    }

    /**
     * Check ARIA attributes
     */
    private checkAriaAttributes(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // Check for missing labels
        const inputs = document.querySelectorAll('input, select, textarea');
        inputs.forEach((input, index) => {
            if (!input.hasAttribute('aria-label') && !input.hasAttribute('aria-labelledby')) {
                const associatedLabel = document.querySelector(`label[for=\"${input.id}\"]`);
                if (!associatedLabel) {
                    issues.push({
                        id: `aria-${index}`,
                        type: 'error',
                        category: 'aria',
                        element: input.tagName.toLowerCase(),
                        description: 'Form control missing accessible label',
                        solution: 'Add aria-label, aria-labelledby, or associated label element',
                        wcagCriterion: '3.3.2 Labels or Instructions'
                    });
                }
            }
        });
        
        return issues;
    }

    /**
     * Check focus management
     */
    private checkFocusManagement(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // Check for focus traps in modals
        const modals = document.querySelectorAll('[role=\"dialog\"]');
        modals.forEach((modal, index) => {
            if (!modal.hasAttribute('aria-modal')) {
                issues.push({
                    id: `focus-${index}`,
                    type: 'warning',
                    category: 'focus',
                    element: 'dialog',
                    description: 'Modal dialog missing aria-modal attribute',
                    solution: 'Add aria-modal=\"true\" to modal dialogs',
                    wcagCriterion: '2.4.3 Focus Order'
                });
            }
        });
        
        return issues;
    }

    /**
     * Check ADHD-specific accessibility
     */
    private checkADHDAccessibility(): AccessibilityIssue[] {
        const issues: AccessibilityIssue[] = [];
        
        // Check for overwhelming content
        const longTexts = document.querySelectorAll('p');
        longTexts.forEach((p, index) => {
            if (p.textContent && p.textContent.length > 300) {
                issues.push({
                    id: `adhd-${index}`,
                    type: 'info',
                    category: 'adhd',
                    element: 'p',
                    description: 'Long text block may be overwhelming for ADHD users',
                    solution: 'Consider breaking into smaller chunks or adding visual breaks'
                });
            }
        });
        
        return issues;
    }

    /**
     * Create focus trap
     */
    public createFocusTrap(container: HTMLElement): void {
        this.focusTracker.trapStack.push(container);
        
        // Focus first focusable element in container
        const focusableElements = container.querySelectorAll(
            'button, input, select, textarea, a[href], [tabindex]:not([tabindex=\"-1\"])'
        );
        
        if (focusableElements.length > 0) {
            (focusableElements[0] as HTMLElement).focus();
        }
    }

    /**
     * Release focus trap
     */
    public releaseFocusTrap(): void {
        if (this.focusTracker.trapStack.length > 0) {
            this.focusTracker.trapStack.pop();
            
            // Return focus to previous element
            if (this.focusTracker.focusHistory.length > 1) {
                const previousElement = this.focusTracker.focusHistory[this.focusTracker.focusHistory.length - 2];
                if (previousElement && document.contains(previousElement)) {
                    previousElement.focus();
                }
            }
        }
    }

    /**
     * Announce content for screen readers
     */
    public announce(message: string, priority: 'polite' | 'assertive' = 'polite'): void {
        const announcer = document.createElement('div');
        announcer.setAttribute('aria-live', priority);
        announcer.setAttribute('aria-atomic', 'true');
        announcer.className = 'sr-only';
        announcer.textContent = message;
        
        document.body.appendChild(announcer);
        
        // Remove after announcement
        setTimeout(() => {
            document.body.removeChild(announcer);
        }, 1000);
    }

    /**
     * Announce focus changes
     */
    private announceFocusChange(element: HTMLElement): void {
        if (this.preferences.screenReaderOptimized) {
            const label = element.getAttribute('aria-label') || 
                         element.getAttribute('title') || 
                         element.textContent?.trim() || 
                         element.tagName.toLowerCase();
            
            if (label) {
                this.announce(`Focused: ${label}`);
            }
        }
    }

    /**
     * Update preferences
     */
    public updatePreferences(updates: Partial<AccessibilityPreferences>): void {
        this.preferences = { ...this.preferences, ...updates };
        this.applyPreferences();
        this.savePreferences();
        this.notifyObservers();
    }

    /**
     * Get current preferences
     */
    public getPreferences(): AccessibilityPreferences {
        return { ...this.preferences };
    }

    /**
     * Save preferences to localStorage
     */
    private savePreferences(): void {
        try {
            localStorage.setItem('neuroflow-accessibility-preferences', JSON.stringify(this.preferences));
        } catch (error) {
            console.error('Failed to save accessibility preferences:', error);
        }
    }

    /**
     * Load preferences from localStorage
     */
    private loadPreferences(): void {
        try {
            const saved = localStorage.getItem('neuroflow-accessibility-preferences');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.preferences = { ...this.preferences, ...parsed };
            }
        } catch (error) {
            console.error('Failed to load accessibility preferences:', error);
        }
    }

    /**
     * Media query change handlers
     */
    private handleMotionPreferenceChange(event: MediaQueryListEvent): void {
        this.preferences.reducedMotion = event.matches;
        this.applyPreferences();
    }

    private handleContrastPreferenceChange(event: MediaQueryListEvent): void {
        this.preferences.highContrast = event.matches;
        this.applyPreferences();
    }

    private handleResize(): void {
        // Handle responsive accessibility adjustments
        if (window.innerWidth < 768) {
            // Mobile-specific accessibility adjustments
            document.body.classList.add('mobile-accessibility');
        } else {
            document.body.classList.remove('mobile-accessibility');
        }
    }

    /**
     * Schedule periodic accessibility checks
     */
    private scheduleAccessibilityChecks(): void {
        setInterval(() => {
            const issues = this.runAccessibilityAudit();
            if (issues.length > 0) {
                console.warn('Accessibility issues detected:', issues);
            }
        }, 30000); // Check every 30 seconds
    }

    /**
     * Observer pattern for preference changes
     */
    public observe(callback: (prefs: AccessibilityPreferences) => void): () => void {
        this.observers.add(callback);
        
        // Return unsubscribe function
        return () => {
            this.observers.delete(callback);
        };
    }

    private notifyObservers(): void {
        this.observers.forEach(callback => {
            try {
                callback(this.preferences);
            } catch (error) {
                console.error('Accessibility observer error:', error);
            }
        });
    }

    /**
     * Start focus reminders
     */
    private startFocusReminders(): void {
        if (this.focusReminderTimer) {
            clearInterval(this.focusReminderTimer);
        }
        
        // Gentle reminders every 45 minutes
        this.focusReminderTimer = setInterval(() => {
            if (!document.hidden) {
                this.announce('Reminder: Take a moment to check your focus and posture', 'polite');
            }
        }, 45 * 60 * 1000);
    }

    /**
     * Cleanup resources
     */
    private cleanup(): void {
        if (this.breakTimer) {
            clearInterval(this.breakTimer);
        }
        
        if (this.focusReminderTimer) {
            clearInterval(this.focusReminderTimer);
        }
        
        this.observers.clear();
    }

    /**
     * Check if service is initialized
     */
    public isServiceInitialized(): boolean {
        return this.isInitialized;
    }
}

// Export singleton instance
export const accessibilityService = AccessibilityService.getInstance();"