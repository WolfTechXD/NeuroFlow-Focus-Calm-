import { supabase } from '../config/supabase';

export type PaymentProvider = 'paypal' | 'whop' | 'gumroad' | 'lemonsqueezy' | 'payhip' | 'google-play';
export type PlanType = 'demo' | 'basic' | 'full';

export interface PaymentConfig {
    provider: PaymentProvider;
    planType: PlanType;
    amount: number;
    currency: string;
}

export interface PaymentResult {
    success: boolean;
    transactionId?: string;
    error?: string;
    redirectUrl?: string;
}

export class MultiPlatformPaymentService {
    private static instance: MultiPlatformPaymentService;

    private planPricing: Record<PlanType, number> = {
        demo: 0,
        basic: 4.99,
        full: 9.99
    };

    private constructor() {}

    public static getInstance(): MultiPlatformPaymentService {
        if (!MultiPlatformPaymentService.instance) {
            MultiPlatformPaymentService.instance = new MultiPlatformPaymentService();
        }
        return MultiPlatformPaymentService.instance;
    }

    getPlanPrice(planType: PlanType): number {
        return this.planPricing[planType];
    }

    async initiatePayment(config: PaymentConfig): Promise<PaymentResult> {
        switch (config.provider) {
            case 'paypal':
                return this.initiatePayPalPayment(config);
            case 'whop':
                return this.initiateWhopPayment(config);
            case 'gumroad':
                return this.initiateGumroadPayment(config);
            case 'lemonsqueezy':
                return this.initiateLemonSqueezyPayment(config);
            case 'payhip':
                return this.initiatePayhipPayment(config);
            case 'google-play':
                return this.initiateGooglePlayPayment(config);
            default:
                return {
                    success: false,
                    error: 'Unsupported payment provider'
                };
        }
    }

    private async initiatePayPalPayment(config: PaymentConfig): Promise<PaymentResult> {
        try {
            const response = await fetch('/api/payments/paypal/create-order', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    planType: config.planType,
                    amount: config.amount
                })
            });

            const data = await response.json();

            if (data.success) {
                return {
                    success: true,
                    transactionId: data.orderId,
                    redirectUrl: data.approvalUrl
                };
            }

            return {
                success: false,
                error: data.error || 'PayPal payment failed'
            };
        } catch (error) {
            return {
                success: false,
                error: 'Failed to initiate PayPal payment'
            };
        }
    }

    private async initiateWhopPayment(config: PaymentConfig): Promise<PaymentResult> {
        const whopProductIds = {
            basic: import.meta.env.VITE_WHOP_BASIC_PRODUCT_ID,
            full: import.meta.env.VITE_WHOP_FULL_PRODUCT_ID
        };

        const productId = whopProductIds[config.planType as 'basic' | 'full'];

        if (!productId) {
            return {
                success: false,
                error: 'Whop product not configured for this plan'
            };
        }

        return {
            success: true,
            redirectUrl: `https://whop.com/checkout/${productId}`
        };
    }

    private async initiateGumroadPayment(config: PaymentConfig): Promise<PaymentResult> {
        const gumroadProductIds = {
            basic: import.meta.env.VITE_GUMROAD_BASIC_PRODUCT_ID,
            full: import.meta.env.VITE_GUMROAD_FULL_PRODUCT_ID
        };

        const productId = gumroadProductIds[config.planType as 'basic' | 'full'];

        if (!productId) {
            return {
                success: false,
                error: 'Gumroad product not configured for this plan'
            };
        }

        return {
            success: true,
            redirectUrl: `https://gumroad.com/l/${productId}`
        };
    }

    private async initiateLemonSqueezyPayment(config: PaymentConfig): Promise<PaymentResult> {
        const lemonSqueezyProductIds = {
            basic: import.meta.env.VITE_LEMONSQUEEZY_BASIC_PRODUCT_ID,
            full: import.meta.env.VITE_LEMONSQUEEZY_FULL_PRODUCT_ID
        };

        const productId = lemonSqueezyProductIds[config.planType as 'basic' | 'full'];

        if (!productId) {
            return {
                success: false,
                error: 'LemonSqueezy product not configured for this plan'
            };
        }

        return {
            success: true,
            redirectUrl: `https://lemonsqueezy.com/checkout/buy/${productId}`
        };
    }

    private async initiatePayhipPayment(config: PaymentConfig): Promise<PaymentResult> {
        const payhipProductIds = {
            basic: import.meta.env.VITE_PAYHIP_BASIC_PRODUCT_ID,
            full: import.meta.env.VITE_PAYHIP_FULL_PRODUCT_ID
        };

        const productId = payhipProductIds[config.planType as 'basic' | 'full'];

        if (!productId) {
            return {
                success: false,
                error: 'Payhip product not configured for this plan'
            };
        }

        return {
            success: true,
            redirectUrl: `https://payhip.com/buy?${productId}`
        };
    }

    private async initiateGooglePlayPayment(config: PaymentConfig): Promise<PaymentResult> {
        return {
            success: false,
            error: 'Google Play billing requires Android app integration'
        };
    }

    async verifyLicenseKey(licenseKey: string): Promise<{ valid: boolean; planType?: PlanType }> {
        try {
            const { data, error } = await supabase
                .from('payment_transactions')
                .select('plan_type, status')
                .eq('provider_transaction_id', licenseKey)
                .eq('status', 'completed')
                .maybeSingle();

            if (error || !data) {
                return { valid: false };
            }

            return {
                valid: true,
                planType: data.plan_type as PlanType
            };
        } catch (error) {
            return { valid: false };
        }
    }

    async recordTransaction(
        userId: string,
        provider: PaymentProvider,
        transactionId: string,
        planType: PlanType,
        amount: number,
        status: 'pending' | 'completed' | 'failed'
    ): Promise<boolean> {
        try {
            const { error } = await supabase
                .from('payment_transactions')
                .insert({
                    user_id: userId,
                    payment_provider: provider,
                    provider_transaction_id: transactionId,
                    amount,
                    plan_type: planType,
                    status,
                    currency: 'USD'
                });

            return !error;
        } catch (error) {
            console.error('Failed to record transaction:', error);
            return false;
        }
    }

    async updateSubscription(
        userId: string,
        planType: PlanType,
        provider: PaymentProvider,
        transactionId: string
    ): Promise<boolean> {
        try {
            const isPremium = planType !== 'demo';

            const { error } = await supabase
                .from('subscriptions')
                .upsert({
                    user_id: userId,
                    plan_type: planType,
                    is_premium: isPremium,
                    payment_provider: provider,
                    provider_subscription_id: transactionId,
                    purchase_date: new Date().toISOString()
                }, {
                    onConflict: 'user_id'
                });

            return !error;
        } catch (error) {
            console.error('Failed to update subscription:', error);
            return false;
        }
    }

    async getUserSubscription(userId: string): Promise<{ planType: PlanType; isPremium: boolean } | null> {
        try {
            const { data, error } = await supabase
                .from('subscriptions')
                .select('plan_type, is_premium')
                .eq('user_id', userId)
                .maybeSingle();

            if (error || !data) {
                return null;
            }

            return {
                planType: data.plan_type as PlanType,
                isPremium: data.is_premium
            };
        } catch (error) {
            return null;
        }
    }
}

export const multiPlatformPayment = MultiPlatformPaymentService.getInstance();
