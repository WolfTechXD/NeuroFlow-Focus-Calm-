import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { paymentService, PRICING_PLANS, PaymentResult } from '../utils/paymentService';

// Simple icon components
const Check = () => <span>✅</span>;
const X = () => <span>❌</span>;
const Star = () => <span>⭐</span>;
const Crown = () => <span>👑</span>;
const CreditCard = () => <span>💳</span>;
const Shield = () => <span>🛡️</span>;

interface PurchaseProps {
    onPurchase: (paymentMethod: string, plan?: string) => void;
    onCancel: () => void;
    isLoading?: boolean;
    currentPlan?: 'demo' | 'base' | 'full';
}

const Purchase: React.FC<PurchaseProps> = ({ onPurchase, onCancel, isLoading, currentPlan = 'demo' }) => {
    const [selectedPlan, setSelectedPlan] = useState<string>(currentPlan === 'base' ? 'upgrade' : 'base');
    const [selectedPayment, setSelectedPayment] = useState<'stripe' | 'paypal'>('stripe');
    const [showConfirmation, setShowConfirmation] = useState(false);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);

    const paymentProviders = paymentService.getPaymentProviders();
    const pricing = selectedPlan === 'guidebooks' ? PRICING_PLANS.guidebooks :
        selectedPlan === 'upgrade' ? PRICING_PLANS.upgrade :
            PRICING_PLANS.base;

    const handlePurchase = () => {
        setShowConfirmation(true);
        setPaymentError(null);
    };

    const confirmPurchase = async () => {
        setIsProcessing(true);
        setPaymentError(null);

        try {
            const provider = paymentProviders.find(p => p.id === selectedPayment);
            if (!provider) {
                throw new Error('Payment provider not found');
            }

            const result: PaymentResult = await provider.processPayment(selectedPlan, pricing.price);

            if (result.success) {
                onPurchase(selectedPayment, selectedPlan);
            } else {
                setPaymentError(result.error || 'Payment failed. Please try again.');
            }
        } catch (error) {
            setPaymentError(error instanceof Error ? error.message : 'Payment processing error');
        } finally {
            setIsProcessing(false);
        }
    };

    if (showConfirmation) {
        return (
            <div className="min-h-screen bg-app flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md"
                >
                    <div className="card text-center">
                        <div className="text-6xl mb-4">🎉</div>
                        <h2 className="text-2xl font-bold text-primary mb-4">
                            Confirm Your Purchase
                        </h2>
                        <p className="text-secondary mb-6">
                            You're about to unlock {pricing.name} for {paymentService.formatPrice(pricing.price)}!
                        </p>

                        <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg mb-6">
                            <div className="flex items-center justify-between mb-2">
                                <span className="font-semibold">{pricing.name}</span>
                                <span className="text-2xl font-bold text-green-600">
                                    {paymentService.formatPrice(pricing.price)}
                                </span>
                            </div>
                            <p className="text-sm text-gray-600">{pricing.description}</p>
                        </div>

                        <div className="space-y-3">
                            <button
                                onClick={confirmPurchase}
                                disabled={isProcessing || isLoading}
                                className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                <CreditCard />
                                {isProcessing || isLoading ? 'Processing...' : 'Complete Purchase'}
                            </button>

                            {paymentError && (
                                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                                    {paymentError}
                                </div>
                            )}

                            <button
                                onClick={() => {
                                    setShowConfirmation(false);
                                    setPaymentError(null);
                                }}
                                className="w-full btn-secondary"
                            >
                                Back to Options
                            </button>
                        </div>

                        <p className="text-xs text-gray-500 mt-4">
                            <Shield /> Secure payment processing • 30-day money-back guarantee
                        </p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-app p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center space-y-2"
                >
                    <div className="text-4xl mb-4">🧠✨</div>
                    <h1 className="text-3xl font-bold text-primary">
                        {currentPlan === 'base' ? 'Upgrade to Full Experience' : 'Unlock Your Complete Toolkit'}
                    </h1>
                    <p className="text-secondary">
                        {currentPlan === 'base'
                            ? 'Add comprehensive guidebooks to your existing plan'
                            : 'Choose the perfect plan for your neurodivergent journey'
                        }
                    </p>
                </motion.div>

                {/* Plan Selection */}
                {currentPlan !== 'base' && (
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 rounded-lg p-1 flex">
                            <button
                                onClick={() => setSelectedPlan('base')}
                                className={`px-4 py-2 rounded-md transition-colors ${selectedPlan === 'base'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Base Plan - {paymentService.formatPrice(PRICING_PLANS.base.price)}
                            </button>
                            <button
                                onClick={() => setSelectedPlan('guidebooks')}
                                className={`px-4 py-2 rounded-md transition-colors ${selectedPlan === 'guidebooks'
                                        ? 'bg-white text-gray-900 shadow-sm'
                                        : 'text-gray-600 hover:text-gray-900'
                                    }`}
                            >
                                Full Package - {paymentService.formatPrice(PRICING_PLANS.guidebooks.price)}
                            </button>
                        </div>
                    </div>
                )}

                {/* Pricing Card */}
                <div className="max-w-md mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="card relative border-2 border-purple-500 bg-gradient-to-br from-purple-50 to-pink-50"
                    >
                        {/* Popular Badge */}
                        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                            <div className="bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-medium flex items-center gap-1">
                                <Crown /> {currentPlan === 'base' ? 'Upgrade' : 'Most Popular'}
                            </div>
                        </div>

                        <div className="text-center mb-6 mt-4">
                            <div className="text-3xl mb-2">🚀</div>
                            <h3 className="text-xl font-bold text-primary">{pricing.name}</h3>
                            <p className="text-secondary">{pricing.description}</p>
                            <div className="text-4xl font-bold text-purple-600 mt-4">
                                {paymentService.formatPrice(pricing.price)}
                            </div>
                            <p className="text-sm text-gray-600">One-time payment</p>
                        </div>

                        <div className="space-y-3 mb-6">
                            {pricing.features.map((feature, index) => (
                                <div key={index} className="flex items-center gap-3">
                                    <div className="flex-shrink-0 text-green-500">
                                        <Check />
                                    </div>
                                    <span className="text-sm text-gray-700">
                                        {feature}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Payment Method Selection */}
                        <div className="mb-6">
                            <h4 className="font-semibold mb-3">Payment Method:</h4>
                            <div className="space-y-2">
                                {paymentProviders.map(provider => (
                                    <button
                                        key={provider.id}
                                        onClick={() => setSelectedPayment(provider.id)}
                                        className={`w-full p-3 rounded-lg border-2 transition-all text-left ${selectedPayment === provider.id
                                                ? 'border-purple-500 bg-purple-50'
                                                : 'border-gray-200 hover:border-purple-300'
                                            }`}
                                    >
                                        <div className="flex items-center gap-3">
                                            <span className="text-xl">{provider.icon}</span>
                                            <span className="font-medium">{provider.name}</span>
                                            {selectedPayment === provider.id && (
                                                <span className="ml-auto text-purple-600">✓</span>
                                            )}
                                        </div>
                                    </button>
                                ))}
                            </div>
                        </div>

                        <button
                            onClick={handlePurchase}
                            disabled={isProcessing}
                            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 px-4 rounded-lg font-semibold hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Star /> {isProcessing ? 'Processing...' : `Upgrade Now - ${paymentService.formatPrice(pricing.price)}`}
                        </button>

                        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-700 text-center">
                                🎯 Perfect for ADHD, Autism & Anxiety Support
                            </p>
                        </div>
                    </motion.div>
                </div>

                {/* Benefits Section */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="card bg-gradient-to-r from-blue-50 to-purple-50"
                >
                    <h3 className="text-xl font-bold text-center text-primary mb-6">
                        Why Upgrade to NeuroFlow?
                    </h3>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <div className="text-3xl mb-3">🧠</div>
                            <h4 className="font-semibold text-primary mb-2">Neurodivergent-Focused</h4>
                            <p className="text-sm text-secondary">
                                Specifically designed for ADHD, autism, and anxiety with evidence-based features
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl mb-3">🎮</div>
                            <h4 className="font-semibold text-primary mb-2">Gamified Experience</h4>
                            <p className="text-sm text-secondary">
                                Turn daily tasks into engaging challenges with rewards and achievements
                            </p>
                        </div>

                        <div className="text-center">
                            <div className="text-3xl mb-3">💜</div>
                            <h4 className="font-semibold text-primary mb-2">Mental Wellness</h4>
                            <p className="text-sm text-secondary">
                                Complete zen mode with breathing exercises, meditation, and calming sounds
                            </p>
                        </div>
                    </div>
                </motion.div>

                {/* Money Back Guarantee */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 bg-green-50 border border-green-200 rounded-full px-6 py-3">
                        <Shield />
                        <span className="text-green-700 font-medium">30-Day Money-Back Guarantee</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                        Not satisfied? Get a full refund within 30 days, no questions asked.
                    </p>
                </motion.div>

                {/* Cancel Button */}
                <div className="text-center">
                    <button
                        onClick={onCancel}
                        className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                        Maybe later - Continue with demo
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Purchase;