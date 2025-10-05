import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { audioManager } from '../../services/AudioManager'
import { soundLibrary } from '../../utils/soundLibrary'

describe('AudioManager', () => {
  beforeEach(async () => {
    // Reset the audio manager state
    audioManager.stopAllAudio()
    await audioManager.initialize()
  })

  afterEach(() => {
    audioManager.stopAllAudio()
  })

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const result = await audioManager.initialize()
      expect(result).toBe(true)
    })

    it('should return true if already initialized', async () => {
      await audioManager.initialize()
      const result = await audioManager.initialize()
      expect(result).toBe(true)
    })
  })

  describe('audio playback', () => {
    it('should play generated audio successfully', async () => {
      const testSound = soundLibrary[0]
      const instanceId = await audioManager.playGeneratedAudio(testSound, 0.5, true)
      
      expect(instanceId).toBeDefined()
      expect(typeof instanceId).toBe('string')
    })

    it('should return null when audio is disabled', async () => {
      audioManager.setEnabled(false)
      
      const testSound = soundLibrary[0]
      const instanceId = await audioManager.playGeneratedAudio(testSound, 0.5, true)
      
      expect(instanceId).toBeNull()
    })

    it('should handle multiple simultaneous sounds', async () => {
      const sound1 = soundLibrary[0]
      const sound2 = soundLibrary[1]
      
      const id1 = await audioManager.playGeneratedAudio(sound1, 0.5, true)
      const id2 = await audioManager.playGeneratedAudio(sound2, 0.5, true)
      
      expect(id1).toBeDefined()
      expect(id2).toBeDefined()
      expect(id1).not.toBe(id2)
      
      const activeInstances = audioManager.getActiveInstances()
      expect(activeInstances.generated.length).toBe(2)
    })
  })

  describe('volume control', () => {
    it('should set master volume correctly', () => {
      audioManager.setMasterVolume(0.8)
      expect(audioManager.getMasterVolume()).toBe(0.8)
    })

    it('should clamp master volume to valid range', () => {
      audioManager.setMasterVolume(1.5)
      expect(audioManager.getMasterVolume()).toBe(1)
      
      audioManager.setMasterVolume(-0.5)
      expect(audioManager.getMasterVolume()).toBe(0)
    })

    it('should adjust individual audio volume', async () => {
      const testSound = soundLibrary[0]
      const instanceId = await audioManager.playGeneratedAudio(testSound, 0.5, true)
      
      if (instanceId) {
        // This should not throw
        expect(() => audioManager.setAudioVolume(instanceId, 0.8)).not.toThrow()
      }
    })
  })

  describe('audio control', () => {
    it('should stop specific audio instance', async () => {
      const testSound = soundLibrary[0]
      const instanceId = await audioManager.playGeneratedAudio(testSound, 0.5, true)
      
      if (instanceId) {
        audioManager.stopAudio(instanceId)
        
        const activeInstances = audioManager.getActiveInstances()
        expect(activeInstances.generated.find(i => i.id === instanceId)).toBeUndefined()
      }
    })

    it('should stop all audio instances', async () => {
      const sound1 = soundLibrary[0]
      const sound2 = soundLibrary[1]
      
      await audioManager.playGeneratedAudio(sound1, 0.5, true)
      await audioManager.playGeneratedAudio(sound2, 0.5, true)
      
      audioManager.stopAllAudio()
      
      const activeInstances = audioManager.getActiveInstances()
      expect(activeInstances.generated.length).toBe(0)
      expect(activeInstances.audio.length).toBe(0)
    })
  })

  describe('audio enable/disable', () => {
    it('should report correct enabled state', () => {
      expect(audioManager.isAudioEnabled()).toBe(true)
      
      audioManager.setEnabled(false)
      expect(audioManager.isAudioEnabled()).toBe(false)
      
      audioManager.setEnabled(true)
      expect(audioManager.isAudioEnabled()).toBe(true)
    })

    it('should stop all audio when disabled', async () => {
      const testSound = soundLibrary[0]
      await audioManager.playGeneratedAudio(testSound, 0.5, true)
      
      audioManager.setEnabled(false)
      
      const activeInstances = audioManager.getActiveInstances()
      expect(activeInstances.generated.length).toBe(0)
    })
  })

  describe('cleanup', () => {
    it('should cleanup resources properly', () => {
      expect(() => audioManager.cleanup()).not.toThrow()
    })
  })

  describe('error handling', () => {
    it('should handle invalid sound gracefully', async () => {
      const invalidSound = {
        id: 'invalid',
        name: 'Invalid Sound',
        category: soundLibrary[0].category,
        description: 'Test',
        audioUrl: '',
        isPremium: false,
        tags: [],
        volume: 0.5
      }
      
      const instanceId = await audioManager.playGeneratedAudio(invalidSound, 0.5, true)
      expect(instanceId).toBeDefined() // Should still work with generated audio
    })
  })
})