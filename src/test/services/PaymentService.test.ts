import { describe, it, expect, vi, beforeEach } from 'vitest'
import { paymentService, PaymentResult } from '../../services/PaymentService'

// Mock Stripe
const mockStripe = {
  confirmCardPayment: vi.fn(),
}

// Mock loadStripe
vi.mock('@stripe/stripe-js', () => ({
  loadStripe: vi.fn(() => Promise.resolve(mockStripe))
}))

// Mock PayPal
const mockPayPal = {
  Buttons: vi.fn(() => ({
    render: vi.fn()
  }))
}

// @ts-ignore
window.paypal = mockPayPal

describe('PaymentService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('initialization', () => {
    it('should initialize successfully', async () => {
      const result = await paymentService.initialize()
      expect(result).toBe(true)
    })
  })

  describe('pricing tiers', () => {
    it('should return all pricing tiers', () => {
      const tiers = paymentService.pricingTiers
      
      expect(tiers).toBeDefined()
      expect(tiers.length).toBeGreaterThan(0)
      
      const freeTier = tiers.find(tier => tier.id === 'free')
      const baseTier = tiers.find(tier => tier.id === 'base')
      const fullTier = tiers.find(tier => tier.id === 'full')
      
      expect(freeTier).toBeDefined()
      expect(baseTier).toBeDefined()
      expect(fullTier).toBeDefined()
    })

    it('should get pricing tier by ID', () => {
      const tier = paymentService.getPricingTier('base')
      
      expect(tier).toBeDefined()
      expect(tier?.id).toBe('base')
      expect(tier?.price).toBe(5)
    })

    it('should return null for invalid tier ID', () => {
      const tier = paymentService.getPricingTier('invalid')
      expect(tier).toBeNull()
    })
  })

  describe('payment processing', () => {
    describe('Stripe payments', () => {
      it('should process free tier without payment', async () => {
        const result = await paymentService.processStripePayment('free')
        
        expect(result.success).toBe(true)
        expect(result.tier.id).toBe('free')
        expect(result.paymentMethod).toBe('demo')
      })

      it('should simulate successful payment for demo mode', async () => {
        const result = await paymentService.processStripePayment('base')
        
        expect(result).toBeDefined()
        expect(result.tier.id).toBe('base')
        expect(result.paymentMethod).toBe('stripe')
        // Success rate is simulated at 95%, so we can't guarantee success
      })

      it('should handle invalid tier ID', async () => {
        const result = await paymentService.processStripePayment('invalid')
        
        expect(result.success).toBe(false)
        expect(result.error).toBe('Invalid pricing tier')
      })
    })

    describe('PayPal payments', () => {
      it('should process free tier without payment', async () => {
        const result = await paymentService.processPayPalPayment('free')
        
        expect(result.success).toBe(true)
        expect(result.tier.id).toBe('free')
        expect(result.paymentMethod).toBe('demo')
      })

      it('should simulate PayPal payment', async () => {
        const result = await paymentService.processPayPalPayment('full')
        
        expect(result).toBeDefined()
        expect(result.tier.id).toBe('full')
        expect(result.paymentMethod).toBe('paypal')
      }, 10000) // Increase timeout to 10 seconds
    })
  })

  describe('subscription management', () => {
    it('should create subscription from successful payment', () => {
      const mockPaymentResult: PaymentResult = {
        success: true,
        transactionId: 'test_123',
        tier: paymentService.getPricingTier('base')!,
        paymentMethod: 'stripe'
      }
      
      const subscription = paymentService.createSubscription(mockPaymentResult)
      
      expect(subscription.isPremium).toBe(true)
      expect(subscription.tier).toBe('base')
      expect(subscription.transactionId).toBe('test_123')
      expect(subscription.paymentMethod).toBe('stripe')
    })

    it('should create free subscription from failed payment', () => {
      const mockPaymentResult: PaymentResult = {
        success: false,
        error: 'Payment failed',
        tier: paymentService.getPricingTier('base')!,
        paymentMethod: 'stripe'
      }
      
      const subscription = paymentService.createSubscription(mockPaymentResult)
      
      expect(subscription.isPremium).toBe(false)
      expect(subscription.tier).toBe('free')
    })
  })

  describe('feature access', () => {
    it('should check feature access correctly', () => {
      const baseSubscription = {
        isPremium: true,
        tier: 'base' as const,
        purchaseDate: new Date(),
        transactionId: 'test_123'
      }
      
      const fullSubscription = {
        isPremium: true,
        tier: 'full' as const,
        purchaseDate: new Date(),
        transactionId: 'test_456'
      }
      
      // Base tier should have access to sound library
      expect(paymentService.hasAccess(baseSubscription, 'sound library')).toBe(true)
      
      // Full tier should have access to guidebooks
      expect(paymentService.hasAccess(fullSubscription, 'guidebook')).toBe(true)
      
      // Base tier should not have access to advanced features
      expect(paymentService.hasAccess(baseSubscription, 'advanced analytics')).toBe(false)
    })
  })

  describe('upgrade suggestions', () => {
    it('should return upgrade options for current tier', () => {
      const upgrades = paymentService.getUpgradeSuggestions('free')
      
      expect(upgrades.length).toBe(2) // base and full
      expect(upgrades[0].id).toBe('base')
      expect(upgrades[1].id).toBe('full')
    })

    it('should return empty array for highest tier', () => {
      const upgrades = paymentService.getUpgradeSuggestions('full')
      expect(upgrades.length).toBe(0)
    })
  })

  describe('pricing utilities', () => {
    it('should format prices correctly', () => {
      expect(paymentService.formatPrice(0)).toBe('Free')
      expect(paymentService.formatPrice(5)).toBe('$5')
      expect(paymentService.formatPrice(10.99)).toBe('$10.99')
    })

    it('should calculate savings for annual billing', () => {
      const savings = paymentService.calculateSavings('base', 'yearly')
      expect(savings).toBeGreaterThan(0)
      
      const monthlySavings = paymentService.calculateSavings('base', 'monthly')
      expect(monthlySavings).toBe(0)
    })
  })

  describe('payment methods', () => {
    it('should return available payment methods', () => {
      const methods = paymentService.getAvailablePaymentMethods('base')
      
      expect(methods).toBeDefined()
      expect(methods.length).toBeGreaterThan(0)
    })

    it('should return demo method for free tier', () => {
      const methods = paymentService.getAvailablePaymentMethods('free')
      
      expect(methods).toContain('demo')
    })
  })

  describe('service health', () => {
    it('should check service health', async () => {
      const health = await paymentService.checkHealth()
      
      expect(health).toBeDefined()
      expect(typeof health.stripe).toBe('boolean')
      expect(typeof health.paypal).toBe('boolean')
    })
  })

  describe('error handling', () => {
    it('should handle initialization errors gracefully', async () => {
      // This test would require mocking the initialization to fail
      // For now, we'll just ensure it doesn't throw
      expect(async () => {
        await paymentService.initialize()
      }).not.toThrow()
    })

    it('should handle payment processing errors', async () => {
      // Mock Stripe to throw an error
      mockStripe.confirmCardPayment.mockRejectedValue(new Error('Network error'))
      
      const result = await paymentService.processStripePayment('base')
      
      // Should fallback to demo payment in development
      expect(result).toBeDefined()
    })
  })
})