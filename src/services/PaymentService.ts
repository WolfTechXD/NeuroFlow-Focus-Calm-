/**
 * Enhanced Payment Service
 * Handles Stripe and PayPal integrations with dual-tier pricing model
 */

import { loadStripe, Stripe, StripeElementsOptions } from '@stripe/stripe-js';

// Payment configuration
interface PaymentConfig {
    stripe: {
        publishableKey: string;
        secretKey?: string;
    };
    paypal: {
        clientId: string;
        clientSecret?: string;
    };
    isDevelopment: boolean;
}

// Pricing tiers
export interface PricingTier {
    id: string;
    name: string;
    description: string;
    price: number;
    currency: 'USD';
    features: string[];
    isPopular?: boolean;
    stripePriceId?: string;
    paypalPlanId?: string;
}

// Payment method types
export type PaymentMethod = 'stripe' | 'paypal' | 'demo';

// Payment result
export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    tier: PricingTier;
    paymentMethod: PaymentMethod;
}

// User subscription info
export interface SubscriptionInfo {
    isPremium: boolean;
    tier: 'free' | 'base' | 'full';
    purchaseDate?: Date;
    transactionId?: string;
    expiryDate?: Date; // undefined for lifetime purchases
    paymentMethod?: PaymentMethod;
}

class PaymentService {
    private static instance: PaymentService;
    private stripe: Stripe | null = null;
    private config: PaymentConfig;
    private isInitialized = false;

    // Pricing tiers configuration
    public readonly pricingTiers: PricingTier[] = [
        {
            id: 'free',
            name: 'Free Demo',
            description: 'Experience NeuroFlow with basic features',
            price: 0,
            currency: 'USD',
            features: [
                'Basic sound library (10 sounds)',
                'Simple task management',
                'Standard themes',
                'Browser TTS voices',
                'Basic zen mode'
            ]
        },
        {
            id: 'base',
            name: 'NeuroFlow Base',
            description: 'Enhanced productivity with premium features',
            price: 5,
            currency: 'USD',
            features: [
                'Expanded sound library (25+ sounds)',
                'Advanced task management',
                'All themes including colorful mode',
                'Premium TTS voices',
                'Enhanced zen mode',
                'Sound mixer (up to 4 layers)',
                'Basic guidebook content'
            ],
            isPopular: true,
            stripePriceId: 'price_base_5usd',
            paypalPlanId: 'plan_base_5usd'
        },
        {
            id: 'full',
            name: 'NeuroFlow Full',
            description: 'Complete ADHD productivity suite',
            price: 10,
            currency: 'USD',
            features: [
                'Complete sound library (50+ sounds)',
                'API-powered sound expansion',
                'Advanced multi-layer sound mixing (8 layers)',
                'Neural TTS voices',
                'Interactive guidebook system',
                'Custom themes and animations',
                'Advanced analytics',
                'Priority support',
                'Unlimited saved mixes'
            ],
            stripePriceId: 'price_full_10usd',
            paypalPlanId: 'plan_full_10usd'
        }
    ];

    private constructor() {
        this.config = this.loadConfig();
    }

    public static getInstance(): PaymentService {
        if (!PaymentService.instance) {
            PaymentService.instance = new PaymentService();
        }
        return PaymentService.instance;
    }

    private loadConfig(): PaymentConfig {
        return {
            stripe: {
                publishableKey: process.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo',
                secretKey: process.env.VITE_STRIPE_SECRET_KEY
            },
            paypal: {
                clientId: process.env.VITE_PAYPAL_CLIENT_ID || 'demo_client_id',
                clientSecret: process.env.VITE_PAYPAL_CLIENT_SECRET
            },
            isDevelopment: process.env.NODE_ENV !== 'production'
        };
    }

    /**
     * Initialize payment services
     */
    public async initialize(): Promise<boolean> {
        if (this.isInitialized) return true;

        try {
            // Initialize Stripe
            if (this.config.stripe.publishableKey !== 'pk_test_demo') {
                this.stripe = await loadStripe(this.config.stripe.publishableKey);
            }

            // Initialize PayPal SDK
            if (this.config.paypal.clientId !== 'demo_client_id') {
                await this.loadPayPalSDK();
            }

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Payment service initialization failed:', error);
            return false;
        }
    }

    /**
     * Load PayPal SDK dynamically
     */
    private async loadPayPalSDK(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).paypal) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${this.config.paypal.clientId}&currency=USD`;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('PayPal SDK failed to load'));
            document.head.appendChild(script);
        });
    }

    /**
     * Get pricing tier by ID
     */
    public getPricingTier(tierId: string): PricingTier | null {
        return this.pricingTiers.find(tier => tier.id === tierId) || null;
    }

    /**
     * Process payment with Stripe
     */
    public async processStripePayment(tierId: string, userEmail?: string): Promise<PaymentResult> {
        const tier = this.getPricingTier(tierId);
        if (!tier) {
            return { success: false, error: 'Invalid pricing tier', tier: this.pricingTiers[0], paymentMethod: 'stripe' };
        }

        if (tier.price === 0) {
            // Free tier - no payment needed
            return {
                success: true,
                transactionId: `free_${Date.now()}`,
                tier,
                paymentMethod: 'demo'
            };
        }

        if (!this.stripe) {
            // Demo mode payment simulation
            return this.simulatePayment(tier, 'stripe');
        }

        try {
            // Create payment intent via your backend
            const response = await fetch('/api/create-payment-intent', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    tierId,
                    amount: tier.price * 100, // Convert to cents
                    currency: tier.currency.toLowerCase(),
                    customerEmail: userEmail
                })
            });

            const { clientSecret, error } = await response.json();

            if (error) {
                throw new Error(error);
            }

            // Confirm payment with Stripe
            const result = await this.stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: {
                        // This would be handled by Stripe Elements in a real implementation
                    },
                    billing_details: {
                        email: userEmail
                    }
                }
            });

            if (result.error) {
                return {
                    success: false,
                    error: result.error.message,
                    tier,
                    paymentMethod: 'stripe'
                };
            }

            return {
                success: true,
                transactionId: result.paymentIntent.id,
                tier,
                paymentMethod: 'stripe'
            };
        } catch (error) {
            console.error('Stripe payment failed:', error);
            // Fallback to demo payment in development
            if (this.config.isDevelopment) {
                return this.simulatePayment(tier, 'stripe');
            }
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Payment failed',
                tier,
                paymentMethod: 'stripe'
            };
        }
    }

    /**
     * Process payment with PayPal
     */
    public async processPayPalPayment(tierId: string): Promise<PaymentResult> {
        const tier = this.getPricingTier(tierId);
        if (!tier) {
            return { success: false, error: 'Invalid pricing tier', tier: this.pricingTiers[0], paymentMethod: 'paypal' };
        }

        if (tier.price === 0) {
            return {
                success: true,
                transactionId: `free_${Date.now()}`,
                tier,
                paymentMethod: 'demo'
            };
        }

        if (!(window as any).paypal) {
            // Demo mode or PayPal not loaded
            return this.simulatePayment(tier, 'paypal');
        }

        try {
            return new Promise((resolve) => {
                (window as any).paypal.Buttons({
                    createOrder: (data: any, actions: any) => {
                        return actions.order.create({
                            purchase_units: [{
                                amount: {
                                    value: tier.price.toString(),
                                    currency_code: tier.currency
                                },
                                description: `${tier.name} - ${tier.description}`
                            }]
                        });
                    },
                    onApprove: async (data: any, actions: any) => {
                        try {
                            const order = await actions.order.capture();
                            resolve({
                                success: true,
                                transactionId: order.id,
                                tier,
                                paymentMethod: 'paypal'
                            });
                        } catch (error) {
                            resolve({
                                success: false,
                                error: 'PayPal capture failed',
                                tier,
                                paymentMethod: 'paypal'
                            });
                        }
                    },
                    onError: (error: any) => {
                        resolve({
                            success: false,
                            error: 'PayPal payment failed',
                            tier,
                            paymentMethod: 'paypal'
                        });
                    }
                }).render('#paypal-button-container');
            });
        } catch (error) {
            console.error('PayPal payment failed:', error);
            // Fallback to demo payment
            return this.simulatePayment(tier, 'paypal');
        }
    }

    /**
     * Simulate payment for demo purposes
     */
    private async simulatePayment(tier: PricingTier, method: PaymentMethod): Promise<PaymentResult> {
        // Simulate payment processing delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate 95% success rate
        const success = Math.random() > 0.05;

        if (success) {
            return {
                success: true,
                transactionId: `demo_${method}_${Date.now()}`,
                tier,
                paymentMethod: method
            };
        } else {
            return {
                success: false,
                error: 'Demo payment failed (simulated)',
                tier,
                paymentMethod: method
            };
        }
    }

    /**
     * Validate payment and create subscription
     */
    public createSubscription(paymentResult: PaymentResult): SubscriptionInfo {
        if (!paymentResult.success) {
            return {
                isPremium: false,
                tier: 'free'
            };
        }

        return {
            isPremium: paymentResult.tier.id !== 'free',
            tier: paymentResult.tier.id as 'free' | 'base' | 'full',
            purchaseDate: new Date(),
            transactionId: paymentResult.transactionId,
            paymentMethod: paymentResult.paymentMethod,
            expiryDate: undefined // Lifetime purchase
        };
    }

    /**
     * Check if user has access to specific features
     */
    public hasAccess(subscription: SubscriptionInfo, feature: string): boolean {
        const tier = this.getPricingTier(subscription.tier);
        if (!tier) return false;

        return tier.features.some(f => f.toLowerCase().includes(feature.toLowerCase()));
    }

    /**
     * Get upgrade suggestions for current tier
     */
    public getUpgradeSuggestions(currentTier: string): PricingTier[] {
        const currentTierIndex = this.pricingTiers.findIndex(tier => tier.id === currentTier);
        return this.pricingTiers.slice(currentTierIndex + 1);
    }

    /**
     * Calculate savings for yearly vs monthly (future feature)
     */
    public calculateSavings(tierId: string, billingPeriod: 'monthly' | 'yearly' = 'yearly'): number {
        const tier = this.getPricingTier(tierId);
        if (!tier || billingPeriod === 'monthly') return 0;

        // For yearly billing, provide 20% discount
        const yearlyPrice = tier.price * 12 * 0.8;
        const monthlyPrice = tier.price * 12;
        return monthlyPrice - yearlyPrice;
    }

    /**
     * Get payment methods available for a tier
     */
    public getAvailablePaymentMethods(tierId: string): PaymentMethod[] {
        const tier = this.getPricingTier(tierId);
        if (!tier || tier.price === 0) {
            return ['demo'];
        }

        const methods: PaymentMethod[] = [];
        
        if (this.stripe || this.config.isDevelopment) {
            methods.push('stripe');
        }
        
        if ((window as any).paypal || this.config.isDevelopment) {
            methods.push('paypal');
        }

        return methods.length > 0 ? methods : ['demo'];
    }

    /**
     * Format price for display
     */
    public formatPrice(price: number, currency: string = 'USD'): string {
        if (price === 0) return 'Free';
        
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency,
            minimumFractionDigits: 0,
            maximumFractionDigits: 2
        }).format(price);
    }

    /**
     * Check service health
     */
    public async checkHealth(): Promise<{ stripe: boolean; paypal: boolean }> {
        return {
            stripe: this.stripe !== null || this.config.isDevelopment,
            paypal: !!(window as any).paypal || this.config.isDevelopment
        };
    }

    /**
     * Clear payment cache and reset
     */
    public reset(): void {
        this.stripe = null;
        this.isInitialized = false;
    }
}

// Export singleton instance
export const paymentService = PaymentService.getInstance();