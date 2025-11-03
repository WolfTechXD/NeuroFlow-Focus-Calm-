import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Logo from '../components/Logo';

const GetStarted: React.FC = () => {
    const navigate = useNavigate();

    const plans = [
        {
            name: 'Free Demo',
            price: 0,
            period: 'forever',
            features: [
                'Basic task management',
                '3 focus sounds',
                '5 ADHD/Autism tips',
                'Basic Pomodoro timer',
                'Simple breathing exercises',
                'Light & dark themes'
            ],
            buttonText: 'Start Free',
            buttonClass: 'bg-gray-600 hover:bg-gray-700',
            popular: false
        },
        {
            name: 'Basic Plan',
            price: 4.99,
            period: 'one-time',
            features: [
                'Everything in Free',
                '15+ premium sounds',
                '25+ evidence-based tips',
                'Advanced Pomodoro features',
                'Full meditation library',
                'All themes unlocked',
                'Progress tracking'
            ],
            buttonText: 'Get Basic',
            buttonClass: 'bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700',
            popular: false
        },
        {
            name: 'Full Plan',
            price: 9.99,
            period: 'one-time',
            features: [
                'Everything in Basic',
                '50+ premium sounds',
                '100+ expert tips & articles',
                'Custom sound mixing',
                'Interactive guides',
                'Premium TTS voices',
                'Offline mode',
                'Priority support',
                'Future updates included'
            ],
            buttonText: 'Get Full Access',
            buttonClass: 'bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700',
            popular: true
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-100 via-purple-100 to-blue-100 p-4 py-12">
            <div className="max-w-6xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <div className="flex justify-center mb-4">
                        <Logo size="medium" animated={true} />
                    </div>

                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-pink-600 via-purple-600 to-blue-600 bg-clip-text text-transparent mb-4">
                        Choose Your Plan
                    </h1>

                    <p className="text-xl text-gray-700 max-w-2xl mx-auto">
                        Start with our free demo, or unlock premium features with a one-time payment.
                        No subscriptions, no recurring fees.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan, index) => (
                        <motion.div
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`bg-white rounded-2xl shadow-xl overflow-hidden ${
                                plan.popular ? 'ring-4 ring-purple-500 transform scale-105' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="bg-gradient-to-r from-purple-500 to-blue-600 text-white text-center py-2 font-bold">
                                    ⭐ MOST POPULAR
                                </div>
                            )}

                            <div className="p-8">
                                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                                    {plan.name}
                                </h3>

                                <div className="mb-6">
                                    <span className="text-5xl font-bold text-gray-900">
                                        ${plan.price}
                                    </span>
                                    <span className="text-gray-600 ml-2">
                                        {plan.period}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-8">
                                    {plan.features.map((feature, fIndex) => (
                                        <li key={fIndex} className="flex items-start">
                                            <span className="text-green-500 mr-2">✓</span>
                                            <span className="text-gray-700">{feature}</span>
                                        </li>
                                    ))}
                                </ul>

                                <button
                                    onClick={() => {
                                        if (plan.price === 0) {
                                            navigate('/login');
                                        } else {
                                            navigate('/login', { state: { plan: plan.name } });
                                        }
                                    }}
                                    className={`w-full ${plan.buttonClass} text-white font-bold py-4 rounded-xl transition-all transform hover:scale-105 shadow-lg`}
                                >
                                    {plan.buttonText}
                                </button>
                            </div>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="text-center"
                >
                    <p className="text-gray-600 mb-4">
                        Already have an account?{' '}
                        <button
                            onClick={() => navigate('/login')}
                            className="text-purple-600 font-semibold hover:underline"
                        >
                            Sign In
                        </button>
                    </p>

                    <div className="bg-white bg-opacity-80 backdrop-blur-sm rounded-2xl p-6 max-w-2xl mx-auto">
                        <h3 className="font-bold text-xl text-gray-800 mb-3">
                            💳 Payment Options Available
                        </h3>
                        <p className="text-gray-700 mb-2">
                            PayPal • Whop • Gumroad • LemonSqueezy • Payhip
                        </p>
                        <p className="text-sm text-gray-600">
                            Secure payments. One-time purchase. Instant access. 30-day money-back guarantee.
                        </p>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default GetStarted;
