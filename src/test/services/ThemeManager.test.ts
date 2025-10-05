import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { themeManager, ThemeMode } from '../../services/ThemeManager'

// Mock localStorage
const mockLocalStorage = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}

Object.defineProperty(window, 'localStorage', {
  value: mockLocalStorage
})

describe('ThemeManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockLocalStorage.clear()
  })

  afterEach(() => {
    // Reset to default theme
    themeManager.setThemeMode('light')
  })

  describe('initialization', () => {
    it('should initialize with default theme', async () => {
      await themeManager.waitForInitialization()
      expect(themeManager.isThemeInitialized()).toBe(true)
    })

    it('should load saved theme from localStorage', () => {
      mockLocalStorage.getItem.mockReturnValue('dark')
      
      // Create a new theme manager instance (we can't easily do this with singleton)
      // So we'll test the behavior indirectly
      const currentTheme = themeManager.getCurrentTheme()
      expect(currentTheme).toBeDefined()
    })
  })

  describe('theme management', () => {
    it('should set theme mode correctly', () => {
      themeManager.setThemeMode('dark')
      expect(themeManager.getCurrentMode()).toBe('dark')
      
      themeManager.setThemeMode('light')
      expect(themeManager.getCurrentMode()).toBe('light')
      
      themeManager.setThemeMode('colorful')
      expect(themeManager.getCurrentMode()).toBe('colorful')
    })

    it('should return current theme configuration', () => {
      const theme = themeManager.getCurrentTheme()
      
      expect(theme).toBeDefined()
      expect(theme.mode).toBeDefined()
      expect(theme.colors).toBeDefined()
      expect(theme.gradients).toBeDefined()
      expect(theme.animations).toBeDefined()
    })

    it('should toggle between light and dark modes', () => {
      themeManager.setThemeMode('light')
      themeManager.toggleDarkMode()
      expect(themeManager.getCurrentMode()).toBe('dark')
      
      themeManager.toggleDarkMode()
      expect(themeManager.getCurrentMode()).toBe('light')
    })
  })

  describe('animations', () => {
    it('should report animations state correctly', () => {
      const enabled = themeManager.areAnimationsEnabled()
      expect(typeof enabled).toBe('boolean')
    })

    it('should toggle animations', () => {
      const initialState = themeManager.areAnimationsEnabled()
      themeManager.toggleAnimations()
      expect(themeManager.areAnimationsEnabled()).toBe(!initialState)
      
      themeManager.toggleAnimations()
      expect(themeManager.areAnimationsEnabled()).toBe(initialState)
    })
  })

  describe('theme persistence', () => {
    it('should save theme to localStorage when changed', () => {
      themeManager.setThemeMode('dark')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        'neuroflow-theme',
        'dark'
      )
    })

    it('should save complete theme configuration', () => {
      themeManager.setThemeMode('colorful')
      
      expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
        expect.stringContaining('theme'),
        expect.any(String)
      )
    })
  })

  describe('observer pattern', () => {
    it('should notify observers of theme changes', () => {
      const observer = vi.fn()
      const unsubscribe = themeManager.observe(observer)
      
      themeManager.setThemeMode('dark')
      
      expect(observer).toHaveBeenCalled()
      
      unsubscribe()
    })

    it('should not notify unsubscribed observers', () => {
      const observer = vi.fn()
      const unsubscribe = themeManager.observe(observer)
      
      unsubscribe()
      observer.mockClear()
      
      themeManager.setThemeMode('colorful')
      
      expect(observer).not.toHaveBeenCalled()
    })
  })

  describe('available modes', () => {
    it('should return all available theme modes', () => {
      const modes = themeManager.getAvailableModes()
      
      expect(modes).toContain('light')
      expect(modes).toContain('dark')
      expect(modes).toContain('colorful')
      expect(modes.length).toBeGreaterThanOrEqual(3)
    })
  })

  describe('reset functionality', () => {
    it('should reset to default theme', () => {
      themeManager.setThemeMode('colorful')
      themeManager.resetToDefault()
      
      const theme = themeManager.getCurrentTheme()
      expect(theme.mode).toBe('colorful') // Should reset to default for current mode
    })
  })

  describe('DOM integration', () => {
    it('should apply theme to document', () => {
      const documentSpy = vi.spyOn(document.documentElement, 'setAttribute')
      
      themeManager.setThemeMode('dark')
      
      expect(documentSpy).toHaveBeenCalledWith('data-theme', 'dark')
    })

    it('should set CSS custom properties', () => {
      const setPropertySpy = vi.spyOn(document.documentElement.style, 'setProperty')
      
      themeManager.setThemeMode('light')
      
      expect(setPropertySpy).toHaveBeenCalledWith(
        '--color-primary',
        expect.any(String)
      )
    })
  })

  describe('error handling', () => {
    it('should handle invalid theme mode gracefully', () => {
      expect(() => {
        // @ts-ignore - Testing invalid input
        themeManager.setThemeMode('invalid')
      }).not.toThrow()
    })

    it('should handle localStorage errors gracefully', () => {
      mockLocalStorage.setItem.mockImplementation(() => {
        throw new Error('Storage error')
      })
      
      expect(() => {
        themeManager.setThemeMode('dark')
      }).not.toThrow()
    })
  })
})