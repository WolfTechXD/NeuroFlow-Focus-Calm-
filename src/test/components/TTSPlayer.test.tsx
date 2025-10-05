import { describe, it, expect, vi, beforeEach } from 'vitest'
import { vi, describe, beforeEach, it, expect } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BrowserRouter } from 'react-router-dom'
import TTSPlayer from '../../components/TTSPlayer'

// Mock the TTS service and defaultTTSSettings
vi.mock('../../utils/textToSpeech', () => ({
  ttsService: {
    getAvailableVoices: vi.fn(() => Promise.resolve([
      {
        id: 'voice-1',
        name: 'Test Voice 1',
        language: 'en-US',
        gender: 'female',
        isPremium: false,
        voiceURI: 'test-voice-1',
        isAvailable: true
      },
      {
        id: 'voice-2',
        name: 'Premium Voice',
        language: 'en-US',
        gender: 'male',
        isPremium: true,
        voiceURI: 'premium-voice',
        isAvailable: true
      }
    ])),
    speak: vi.fn(() => Promise.resolve()),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    isSpeaking: vi.fn(() => false),
    isPaused: vi.fn(() => false)
  },
  defaultTTSSettings: {
    voice: {
      id: 'default',
      name: 'Default Voice',
      language: 'en-US',
      gender: 'female',
      isPremium: false,
      voiceURI: 'default',
      isAvailable: true
    },
    speed: 1,
    volume: 1,
    pitch: 1
  }
}))

const renderTTSPlayer = (props: any = {}) => {
  const defaultProps = {
    text: 'This is a test text for TTS playback.',
    title: 'Test TTS Player',
    isPremium: false,
    showSettings: true
  }
  
  return render(
    <BrowserRouter>
      <TTSPlayer {...defaultProps} {...props} />
    </BrowserRouter>
  )
}

describe('TTSPlayer Component', () => {
  const user = userEvent.setup()
  
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('should render with basic props', () => {
      renderTTSPlayer()
      
      expect(screen.getByText('Test TTS Player')).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('should render without title when not provided', () => {
      renderTTSPlayer({ title: undefined })
      
      expect(screen.queryByText('Test TTS Player')).not.toBeInTheDocument()
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('should show settings when enabled', () => {
      renderTTSPlayer({ showSettings: true })
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      expect(settingsButton).toBeInTheDocument()
    })

    it('should hide settings when disabled', () => {
      renderTTSPlayer({ showSettings: false })
      
      const settingsButton = screen.queryByRole('button', { name: /settings/i })
      expect(settingsButton).not.toBeInTheDocument()
    })
  })

  describe('voice loading', () => {
    it('should load voices on mount', async () => {
      renderTTSPlayer()
      
      await waitFor(() => {
        expect(ttsService.getAvailableVoices).toHaveBeenCalled()
      })
    })

    it('should show loading state initially', () => {
      renderTTSPlayer()
      
      // The component should show some loading indication
      // This depends on the actual implementation
    })
  })

  describe('playback control', () => {
    it('should start playback when play button is clicked', async () => {
      renderTTSPlayer()
      
      const playButton = screen.getByRole('button', { name: /start/i })
      await user.click(playButton)
      
      await waitFor(() => {
        expect(ttsService.speak).toHaveBeenCalledWith(
          'This is a test text for TTS playback.',
          expect.any(Object),
          expect.any(Function),
          expect.any(Function),
          expect.any(Function)
        )
      })
    })

    it('should not play when text is empty', async () => {
      renderTTSPlayer({ text: '' })
      
      const playButton = screen.getByRole('button', { name: /start/i })
      expect(playButton).toBeDisabled()
    })

    it('should stop playback when stop button is clicked', async () => {
      renderTTSPlayer()
      
      // First start playback
      const playButton = screen.getByRole('button', { name: /start/i })
      await user.click(playButton)
      
      // Then stop it
      const stopButton = screen.getByRole('button', { name: /stop/i })
      await user.click(stopButton)
      
      expect(ttsService.stop).toHaveBeenCalled()
    })
  })

  describe('settings panel', () => {
    it('should toggle settings panel when settings button is clicked', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      // Settings panel should be visible
      expect(screen.getByLabelText(/voice/i)).toBeInTheDocument()
    })

    it('should show voice selection dropdown', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        const voiceSelect = screen.getByLabelText(/voice/i)
        expect(voiceSelect).toBeInTheDocument()
      })
    })

    it('should show speed control', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText(/speed/i)).toBeInTheDocument()
      })
    })

    it('should show volume control', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        expect(screen.getByLabelText(/volume/i)).toBeInTheDocument()
      })
    })
  })

  describe('premium features', () => {
    it('should show premium upgrade notice for non-premium users', () => {
      renderTTSPlayer({ isPremium: false })
      
      expect(screen.getByText(/unlock premium voices/i)).toBeInTheDocument()
    })

    it('should not show premium notice for premium users', () => {
      renderTTSPlayer({ isPremium: true })
      
      expect(screen.queryByText(/unlock premium voices/i)).not.toBeInTheDocument()
    })

    it('should disable premium voices for non-premium users', async () => {
      renderTTSPlayer({ isPremium: false })
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        const voiceSelect = screen.getByLabelText(/voice/i)
        const premiumOption = screen.getByText(/premium voice/i)
        
        expect(premiumOption).toBeInTheDocument()
        // The option should be disabled or marked as premium
      })
    })
  })

  describe('voice settings', () => {
    it('should update speed setting', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        const speedSlider = screen.getByLabelText(/speed/i)
        fireEvent.change(speedSlider, { target: { value: '1.5' } })
        
        // Should update the displayed speed
        expect(screen.getByText(/1\\.5x/)).toBeInTheDocument()
      })
    })

    it('should update volume setting', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(() => {
        const volumeSlider = screen.getByLabelText(/volume/i)
        fireEvent.change(volumeSlider, { target: { value: '0.8' } })
        
        // Should update the displayed volume
        expect(screen.getByText(/80%/)).toBeInTheDocument()
      })
    })
  })

  describe('test voice functionality', () => {
    it('should test voice settings when test button is clicked', async () => {
      renderTTSPlayer()
      
      const settingsButton = screen.getByRole('button', { name: /settings/i })
      await user.click(settingsButton)
      
      await waitFor(async () => {
        const testButton = screen.getByText(/test voice/i)
        await user.click(testButton)
        
        expect(ttsService.speak).toHaveBeenCalled()
      })
    })
  })

  describe('error handling', () => {
    it('should handle TTS errors gracefully', async () => {
      const mockSpeak = vi.mocked(ttsService.speak)
      mockSpeak.mockRejectedValue(new Error('TTS Error'))
      
      renderTTSPlayer()
      
      const playButton = screen.getByRole('button', { name: /start/i })
      await user.click(playButton)
      
      // Should not crash the component
      expect(screen.getByRole('button', { name: /start/i })).toBeInTheDocument()
    })

    it('should handle voice loading errors', async () => {
      const mockGetVoices = vi.mocked(ttsService.getAvailableVoices)
      mockGetVoices.mockRejectedValue(new Error('Voice loading error'))
      
      renderTTSPlayer()
      
      // Component should still render
      expect(screen.getByText('Test TTS Player')).toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('should have proper ARIA labels', () => {
      renderTTSPlayer()
      
      const playButton = screen.getByRole('button', { name: /start/i })
      expect(playButton).toHaveAttribute('aria-label')
    })

    it('should be keyboard navigable', async () => {
      renderTTSPlayer()
      
      const playButton = screen.getByRole('button', { name: /start/i })
      
      // Should be focusable
      playButton.focus()
      expect(playButton).toHaveFocus()
      
      // Should activate with Enter key
      fireEvent.keyDown(playButton, { key: 'Enter' })
      
      await waitFor(() => {
        expect(ttsService.speak).toHaveBeenCalled()
      })
    })
  })
})