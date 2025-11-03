import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { multiPlatformPayment, PaymentProvider, PlanType } from '../services/MultiPlatformPayment';

const PaymentHub: React.FC = () => {
    const { user } = useAuth();
    const [selectedPlan, setSelectedPlan] = useState<PlanType>('full');
    const [selectedProvider, setSelectedProvider] = useState<PaymentProvider>('paypal');
    const [licenseKey, setLicenseKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const plans = [
        {
            type: 'basic' as PlanType,
            name: 'Basic Plan',
            price: 4.99,
            features: [
                '15+ premium sounds',
                '25+ ADHD/Autism tips',
                'Advanced Pomodoro',
                'Full meditation library',
                'All themes unlocked'
            ]
        },
        {
            type: 'full' as PlanType,
            name: 'Full Plan',
            price: 9.99,
            features: [
                'Everything in Basic',
                '50+ premium sounds',
                '100+ expert tips & articles',
                'Custom sound mixing',
                'Interactive guides',
                'Offline mode',
                'Priority support'
            ],
            popular: true
        }
    ];

    const providers = [
        { id: 'paypal' as PaymentProvider, name: 'PayPal', icon: '💳', color: 'from-blue-500 to-blue-600' },
        { id: 'whop' as PaymentProvider, name: 'Whop', icon: '🛍️', color: 'from-purple-500 to-purple-600' },
        { id: 'gumroad' as PaymentProvider, name: 'Gumroad', icon: '🎨', color: 'from-pink-500 to-pink-600' },
        { id: 'lemonsqueezy' as PaymentProvider, name: 'LemonSqueezy', icon: '🍋', color: 'from-yellow-500 to-yellow-600' },
        { id: 'payhip' as PaymentProvider, name: 'Payhip', icon: '🏪', color: 'from-green-500 to-green-600' }
    ];

    const handlePayment = async () => {
        if (!user) {
            setError('Please sign in to make a purchase');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await multiPlatformPayment.initiatePayment({
                provider: selectedProvider,
                planType: selectedPlan,
                amount: multiPlatformPayment.getPlanPrice(selectedPlan),
                currency: 'USD'
            });

            if (result.success) {
                if (result.redirectUrl) {
                    window.location.href = result.redirectUrl;
                } else {
                    setSuccess('Payment initiated successfully!');
                }
            } else {
                setError(result.error || 'Payment failed');
            }
        } catch (err) {
            setError('An error occurred during payment');
        } finally {
            setLoading(false);
        }
    };

    const handleLicenseActivation = async () => {
        if (!user) {
            setError('Please sign in to activate a license');
            return;
        }

        if (!licenseKey.trim()) {
            setError('Please enter a license key');
            return;
        }

        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const result = await multiPlatformPayment.verifyLicenseKey(licenseKey);

            if (result.valid && result.planType) {
                const updated = await multiPlatformPayment.updateSubscription(
                    user.id,
                    result.planType,
                    'gumroad',
                    licenseKey
                );

                if (updated) {
                    setSuccess('License activated successfully! Refresh the page to see your new features.');
                } else {
                    setError('Failed to activate license');
                }
            } else {
                setError('Invalid license key');
            }
        } catch (err) {
            setError('Failed to verify license key');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 py-12">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Upgrade to Premium
                    </h1>
                    <p className="text-xl text-gray-700">
                        One-time payment. Lifetime access. No subscriptions.
                    </p>
                </motion.div>

                {error && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-xl mb-6 max-w-2xl mx-auto"
                    >
                        {error}
                    </motion.div>
                )}

                {success && (
                    <motion.div
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-green-100 border border-green-400 text-green-700 px-6 py-4 rounded-xl mb-6 max-w-2xl mx-auto"
                    >
                        {success}
                    </motion.div>
                )}

                <div className="grid md:grid-cols-2 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            onClick={() => setSelectedPlan(plan.type)}
                            className={`bg-white rounded-2xl shadow-xl p-8 cursor-pointer transition-all ${
                                selectedPlan === plan.type
                                    ? 'ring-4 ring-purple-500 transform scale-105'
                                    : 'hover:shadow-2xl'
                            } ${plan.popular ? 'border-2 border-purple-500' : ''}`}
                        >
                            {plan.popular && (
                                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-2 px-4 rounded-full text-sm font-bold mb-4 inline-block">
                                    ⭐ MOST POPULAR
                                </div>
                            )}

                            <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                            <div className="mb-6">
                                <span className="text-5xl font-bold text-gray-900">${plan.price}</span>
                                <span className="text-gray-600 ml-2">one-time</span>
                            </div>

                            <ul className="space-y-3">
                                {plan.features.map((feature, fIndex) => (
                                    <li key={fIndex} className="flex items-start">
                                        <span className="text-green-500 mr-2">✓</span>
                                        <span className="text-gray-700">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="bg-white rounded-2xl shadow-xl p-8 mb-12"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                        Choose Payment Method
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
                        {providers.map((provider) => (
                            <button
                                key={provider.id}
                                onClick={() => setSelectedProvider(provider.id)}
                                className={`p-4 rounded-xl font-semibold transition-all ${
                                    selectedProvider === provider.id
                                        ? `bg-gradient-to-r ${provider.color} text-white transform scale-105 shadow-lg`
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <div className="text-3xl mb-2">{provider.icon}</div>
                                <div className="text-sm">{provider.name}</div>
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={handlePayment}
                        disabled={loading || !user}
                        className="w-full bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xl font-bold py-4 rounded-xl shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all disabled:opacity-50 disabled:transform-none"
                    >
                        {loading ? 'Processing...' : `Pay $${multiPlatformPayment.getPlanPrice(selectedPlan)} with ${providers.find(p => p.id === selectedProvider)?.name}`}
                    </button>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="bg-white rounded-2xl shadow-xl p-8"
                >
                    <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                        Already Purchased?
                    </h3>
                    <p className="text-gray-600 text-center mb-6">
                        Enter your license key from Gumroad, LemonSqueezy, Whop, or Payhip
                    </p>

                    <div className="max-w-md mx-auto">
                        <input
                            type="text"
                            value={licenseKey}
                            onChange={(e) => setLicenseKey(e.target.value)}
                            placeholder="Enter your license key"
                            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent mb-4 text-gray-900"
                        />
                        <button
                            onClick={handleLicenseActivation}
                            disabled={loading || !user}
                            className="w-full bg-gradient-to-r from-purple-500 to-blue-600 text-white font-bold py-3 rounded-xl hover:shadow-lg transition-all disabled:opacity-50"
                        >
                            {loading ? 'Verifying...' : 'Activate License'}
                        </button>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default PaymentHub;
