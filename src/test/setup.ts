import '@testing-library/jest-dom'
import { vi } from 'vitest'

// Mock Web APIs that might not be available in test environment
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock AudioContext
class MockAudioContext {
  createOscillator() {
    return {
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
      frequency: { setValueAtTime: vi.fn() },
      type: 'sine'
    }
  }
  
  createGain() {
    return {
      connect: vi.fn(),
      disconnect: vi.fn(),
      gain: { 
        setValueAtTime: vi.fn(),
        value: 1
      }
    }
  }
  
  get destination() {
    return {
      connect: vi.fn()
    }
  }
  
  get currentTime() {
    return 0
  }
  
  get state() {
    return 'running'
  }
  
  suspend() {
    return Promise.resolve()
  }
  
  resume() {
    return Promise.resolve()
  }
  
  close() {
    return Promise.resolve()
  }
}

// @ts-ignore
window.AudioContext = MockAudioContext
// @ts-ignore
window.webkitAudioContext = MockAudioContext

// Mock SpeechSynthesis
Object.defineProperty(window, 'speechSynthesis', {
  writable: true,
  value: {
    speak: vi.fn(),
    cancel: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    getVoices: vi.fn(() => []),
    speaking: false,
    paused: false,
    pending: false,
    addEventListener: vi.fn()
  }
})

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock
})

// Mock HTMLAudioElement
class MockAudio {
  constructor() {
    // @ts-ignore
    this.play = vi.fn(() => Promise.resolve())
    // @ts-ignore
    this.pause = vi.fn()
    // @ts-ignore
    this.addEventListener = vi.fn()
    // @ts-ignore
    this.removeEventListener = vi.fn()
    // @ts-ignore
    this.volume = 1
    // @ts-ignore
    this.loop = false
    // @ts-ignore
    this.src = ''
  }
}

// @ts-ignore
window.Audio = MockAudio

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

// @ts-ignore
window.IntersectionObserver = MockIntersectionObserver

// Mock ResizeObserver
class MockResizeObserver {
  observe = vi.fn()
  disconnect = vi.fn()
  unobserve = vi.fn()
}

// @ts-ignore
window.ResizeObserver = MockResizeObserver

// Mock fetch
global.fetch = vi.fn(() =>
  Promise.resolve({
    ok: true,
    json: () => Promise.resolve({}),
  })
) as any

// Cleanup after each test
afterEach(() => {
  vi.clearAllMocks()
  localStorageMock.clear()
})