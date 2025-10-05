import { loadStripe, Stripe } from '@stripe/stripe-js';

// Environment variables for payment providers
const STRIPE_PUBLISHABLE_KEY = process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY || 'pk_test_demo';
const PAYPAL_CLIENT_ID = process.env.REACT_APP_PAYPAL_CLIENT_ID || 'demo-client-id';

// Pricing configuration
export const PRICING_PLANS = {
    base: {
        id: 'base',
        name: 'NeuroFlow Base',
        price: 5.00,
        currency: 'USD',
        description: 'Complete neurodivergent toolkit with unlimited tasks, sounds, and features',
        features: [
            'Unlimited tasks and projects',
            'Full sound library (50+ sounds)',
            'Advanced Zen mode features',
            'Customizable themes',
            'Achievement system',
            'Analytics and insights',
            'Cloud sync and backup',
            'Ad-free experience'
        ]
    },
    guidebooks: {
        id: 'guidebooks',
        name: 'NeuroFlow + Guidebooks',
        price: 10.00,
        currency: 'USD',
        description: 'Everything in Base plus comprehensive guidebooks',
        features: [
            'Everything in Base plan',
            'Interactive guidebooks',
            'Evidence-based content',
            'Professional techniques',
            'Advanced strategies',
            'Premium content library',
            'Expert recommendations',
            'Priority support'
        ]
    },
    upgrade: {
        id: 'upgrade',
        name: 'Guidebooks Upgrade',
        price: 5.00,
        currency: 'USD',
        description: 'Add guidebooks to your existing Base plan',
        features: [
            'Interactive guidebooks',
            'Evidence-based content',
            'Professional techniques',
            'Advanced strategies',
            'Premium content library'
        ]
    }
};

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    plan?: string;
}

export interface PaymentProvider {
    name: string;
    id: 'stripe' | 'paypal';
    icon: string;
    processPayment: (plan: string, amount: number) => Promise<PaymentResult>;
}

class PaymentService {
    private stripe: Stripe | null = null;
    private stripeLoaded = false;

    async initializeStripe(): Promise<void> {
        if (this.stripeLoaded) return;

        try {
            this.stripe = await loadStripe(STRIPE_PUBLISHABLE_KEY);
            this.stripeLoaded = true;
        } catch (error) {
            console.error('Failed to load Stripe:', error);
            throw new Error('Payment system initialization failed');
        }
    }

    async processStripePayment(plan: string, amount: number): Promise<PaymentResult> {
        try {
            await this.initializeStripe();

            if (!this.stripe) {
                throw new Error('Stripe not initialized');
            }

            // In a real implementation, you would:
            // 1. Create a checkout session on your server
            // 2. Redirect to Stripe Checkout
            // 3. Handle the success/cancel webhooks

            // For demo purposes, simulate a successful payment
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        transactionId: `stripe_${Date.now()}`,
                        plan: plan
                    });
                }, 2000);
            });

        } catch (error) {
            console.error('Stripe payment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }

    async processPayPalPayment(plan: string, amount: number): Promise<PaymentResult> {
        try {
            // In a real implementation, you would:
            // 1. Load PayPal SDK
            // 2. Create PayPal buttons
            // 3. Handle the payment approval
            // 4. Capture the payment on your server

            // For demo purposes, simulate a successful payment
            return new Promise((resolve) => {
                setTimeout(() => {
                    resolve({
                        success: true,
                        transactionId: `paypal_${Date.now()}`,
                        plan: plan
                    });
                }, 1500);
            });

        } catch (error) {
            console.error('PayPal payment error:', error);
            return {
                success: false,
                error: error instanceof Error ? error.message : 'Payment failed'
            };
        }
    }

    getPaymentProviders(): PaymentProvider[] {
        return [
            {
                name: 'Credit Card (Stripe)',
                id: 'stripe',
                icon: '💳',
                processPayment: this.processStripePayment.bind(this)
            },
            {
                name: 'PayPal',
                id: 'paypal',
                icon: '🅿️',
                processPayment: this.processPayPalPayment.bind(this)
            }
        ];
    }

    // Real Stripe Checkout implementation (commented for demo)
    /*
    async createStripeCheckoutSession(plan: string): Promise<string> {
        const response = await fetch('/api/create-checkout-session', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                plan: plan,
                successUrl: `${window.location.origin}/success`,
                cancelUrl: `${window.location.origin}/cancel`
            })
        });

        const { sessionId } = await response.json();
        return sessionId;
    }

    async redirectToStripeCheckout(sessionId: string): Promise<void> {
        if (!this.stripe) {
            throw new Error('Stripe not initialized');
        }

        const result = await this.stripe.redirectToCheckout({
            sessionId: sessionId
        });

        if (result.error) {
            throw new Error(result.error.message);
        }
    }
    */

    // Server-side Stripe integration example (Node.js/Express)
    /*
    // This would go in your backend server
    app.post('/api/create-checkout-session', async (req, res) => {
        const { plan } = req.body;
        const pricing = PRICING_PLANS[plan];

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            line_items: [{
                price_data: {
                    currency: pricing.currency.toLowerCase(),
                    product_data: {
                        name: pricing.name,
                        description: pricing.description
                    },
                    unit_amount: pricing.price * 100 // Convert to cents
                },
                quantity: 1
            }],
            mode: 'payment',
            success_url: req.body.successUrl,
            cancel_url: req.body.cancelUrl,
            metadata: {
                plan: plan,
                userId: req.body.userId // If you have user authentication
            }
        });

        res.json({ sessionId: session.id });
    });
    */

    // PayPal SDK integration example
    /*
    initializePayPal(): Promise<void> {
        return new Promise((resolve, reject) => {
            if ((window as any).paypal) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = `https://www.paypal.com/sdk/js?client-id=${PAYPAL_CLIENT_ID}&currency=USD`;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('PayPal SDK failed to load'));
            document.head.appendChild(script);
        });
    }

    async createPayPalButtons(containerId: string, plan: string): Promise<void> {
        await this.initializePayPal();
        const pricing = PRICING_PLANS[plan];

        (window as any).paypal.Buttons({
            createOrder: (data: any, actions: any) => {
                return actions.order.create({
                    purchase_units: [{
                        amount: {
                            value: pricing.price.toString(),
                            currency_code: pricing.currency
                        },
                        description: pricing.description
                    }]
                });
            },
            onApprove: async (data: any, actions: any) => {
                const order = await actions.order.capture();
                // Handle successful payment
                this.handlePaymentSuccess(order, plan);
            },
            onError: (err: any) => {
                console.error('PayPal payment error:', err);
                this.handlePaymentError(err);
            }
        }).render(`#${containerId}`);
    }
    */

    // Utility methods for payment handling
    formatPrice(amount: number, currency: string = 'USD'): string {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency
        }).format(amount);
    }

    calculateTax(amount: number, taxRate: number = 0): number {
        return amount * taxRate;
    }

    calculateTotal(amount: number, taxRate: number = 0): number {
        return amount + this.calculateTax(amount, taxRate);
    }
}

export const paymentService = new PaymentService();

// Example usage in component:
/*
const handlePurchase = async (plan: string, provider: 'stripe' | 'paypal') => {
    setLoading(true);
    
    try {
        const pricing = PRICING_PLANS[plan];
        const result = await paymentService.getPaymentProviders()
            .find(p => p.id === provider)
            ?.processPayment(plan, pricing.price);
            
        if (result?.success) {
            // Handle successful payment
            onPaymentSuccess(result);
        } else {
            // Handle payment failure
            onPaymentError(result?.error || 'Payment failed');
        }
    } catch (error) {
        onPaymentError('Payment processing error');
    } finally {
        setLoading(false);
    }
};
*/