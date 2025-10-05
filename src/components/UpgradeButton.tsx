import React, { useState } from 'react';
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface UpgradeButtonProps {
    variant?: 'primary' | 'secondary' | 'floating';
    context?: string;
}

const UpgradeButton: React.FC<UpgradeButtonProps> = ({
    variant = 'primary',
    context = 'general'
}) => {
    const [showModal, setShowModal] = useState(false);

    const handleUpgrade = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const buttonStyles = {
        primary: {
            background: 'linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '1rem',
            cursor: 'pointer',
            boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
        },
        secondary: {
            background: 'linear-gradient(135deg, rgb(252, 165, 165) 0%, rgb(147, 197, 253) 100%)',
            color: 'white',
            padding: '8px 16px',
            borderRadius: '8px',
            border: 'none',
            fontWeight: '600',
            fontSize: '0.9rem',
            cursor: 'pointer',
        },
        floating: {
            position: 'fixed' as const,
            bottom: '20px',
            right: '20px',
            background: 'linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)',
            color: 'white',
            padding: '12px 20px',
            borderRadius: '25px',
            border: 'none',
            fontWeight: 'bold',
            fontSize: '0.9rem',
            cursor: 'pointer',
            boxShadow: '0 6px 20px rgba(236, 72, 153, 0.4)',
            zIndex: 1000,
        }
    };

    return (
        <>
            <motion.button
                onClick={handleUpgrade}
                style={buttonStyles[variant]}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.3 }}
            >
                💎 Upgrade for $4.99
            </motion.button>

            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        style={{
                            position: 'fixed',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            background: 'rgba(0, 0, 0, 0.6)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            zIndex: 1001,
                            padding: '20px'
                        }}
                        onClick={closeModal}
                    >
                        <motion.div
                            initial={{ scale: 0.8, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.8, y: 50 }}
                            style={{
                                background: 'linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%)',
                                borderRadius: '20px',
                                padding: '40px',
                                maxWidth: '500px',
                                width: '100%',
                                textAlign: 'center',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                                border: '2px solid rgb(236, 72, 153)'
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💎✨</div>

                            <h2 style={{
                                color: 'rgb(190, 24, 93)',
                                marginBottom: '20px',
                                fontSize: '1.8rem',
                                fontWeight: 'bold'
                            }}>
                                Unlock Premium Features
                            </h2>

                            <div style={{
                                background: 'linear-gradient(135deg, rgb(251, 207, 232) 0%, rgb(252, 165, 165) 100%)',
                                borderRadius: '15px',
                                padding: '25px',
                                marginBottom: '25px',
                                color: 'white'
                            }}>
                                <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>
                                    🚀 Premium Benefits - Just $4.99!
                                </h3>

                                <ul style={{
                                    textAlign: 'left',
                                    lineHeight: '1.8',
                                    listStyle: 'none',
                                    padding: 0
                                }}>
                                    <li>✨ <strong>Unlimited Tasks:</strong> Create as many tasks as you need</li>
                                    <li>🧘 <strong>Extended Zen Sessions:</strong> Unlimited meditation time</li>
                                    <li>🎵 <strong>Premium Sounds:</strong> Access to 50+ exclusive audio tracks</li>
                                    <li>📚 <strong>Expert Guides:</strong> 4 comprehensive wellness guides</li>
                                    <li>🎨 <strong>Custom Themes:</strong> Beautiful color variations</li>
                                    <li>📊 <strong>Advanced Analytics:</strong> Detailed progress tracking</li>
                                    <li>💾 <strong>Cloud Sync:</strong> Access across all devices</li>
                                    <li>🎯 <strong>Priority Support:</strong> Get help when you need it</li>
                                </ul>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <motion.button
                                    onClick={() => {
                                        // Integrate with actual payment system
                                        alert('🔄 Payment integration coming soon!\n\nWe\'re setting up secure payment processing with Stripe and PayPal. You\'ll be notified when premium features are available!');
                                        closeModal();
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, rgb(147, 197, 253) 0%, rgb(59, 130, 246) 100%)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    💳 Upgrade Now - $5
                                </motion.button>

                                <motion.button
                                    onClick={closeModal}
                                    style={{
                                        background: 'transparent',
                                        color: 'rgb(190, 24, 93)',
                                        padding: '15px 25px',
                                        borderRadius: '12px',
                                        border: '2px solid rgb(190, 24, 93)',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    Maybe Later
                                </motion.button>
                            </div>

                            <p style={{
                                marginTop: '20px',
                                fontSize: '0.9rem',
                                color: 'rgb(117, 117, 117)',
                                lineHeight: '1.5'
                            }}>
                                <strong>🔒 Secure Payment:</strong> We use industry-standard encryption.<br />
                                <strong>💝 One-time payment:</strong> Lifetime access, no subscriptions.<br />
                                <strong>🔄 30-day guarantee:</strong> Full refund if not satisfied.
                            </p>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default UpgradeButton;