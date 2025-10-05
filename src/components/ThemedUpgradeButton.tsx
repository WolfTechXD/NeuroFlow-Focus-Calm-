import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

interface ThemedUpgradeButtonProps {
    variant?: 'primary' | 'secondary' | 'floating';
    context?: string;
    onUpgrade?: (plan: 'basic' | 'premium') => void;
}

const ThemedUpgradeButton: React.FC<ThemedUpgradeButtonProps> = ({
    variant = 'primary',
    context = 'general',
    onUpgrade
}) => {
    const { colors, getCardStyle } = useTheme();
    const [showModal, setShowModal] = useState(false);

    const handleUpgrade = () => {
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
    };

    const getButtonStyle = () => {
        const baseStyle = {
            border: 'none',
            fontWeight: 'bold',
            cursor: 'pointer',
            background: colors.buttonPrimary,
            color: colors.textPrimary,
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)',
        };

        switch (variant) {
            case 'primary':
                return {
                    ...baseStyle,
                    padding: '12px 24px',
                    borderRadius: '12px',
                    fontSize: '1rem',
                };
            case 'secondary':
                return {
                    ...baseStyle,
                    background: colors.buttonSecondary,
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                };
            case 'floating':
                return {
                    ...baseStyle,
                    position: 'fixed' as const,
                    bottom: '20px',
                    right: '20px',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    zIndex: 1000,
                    boxShadow: '0 6px 20px rgba(0, 0, 0, 0.3)',
                };
            default:
                return baseStyle;
        }
    };

    return (
        <>
            <motion.button
                onClick={handleUpgrade}
                style={getButtonStyle()}
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
                            className={getCardStyle()}
                            style={{
                                backgroundColor: colors.cardBackground,
                                border: `2px solid ${colors.accent}`,
                                borderRadius: '20px',
                                padding: '30px',
                                maxWidth: '800px',
                                width: '95%',
                                maxHeight: '90vh',
                                overflowY: 'auto',
                                textAlign: 'center',
                                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
                                color: colors.textPrimary
                            }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div style={{ fontSize: '3rem', marginBottom: '20px' }}>💎✨</div>

                            <h2 style={{
                                color: colors.accent,
                                marginBottom: '20px',
                                fontSize: '1.8rem',
                                fontWeight: 'bold'
                            }}>
                                Unlock Premium Features
                            </h2>

                            <div style={{
                                background: colors.buttonPrimary,
                                borderRadius: '15px',
                                padding: '25px',
                                marginBottom: '25px',
                                color: 'white'
                            }}>
                                <h3 style={{ marginBottom: '15px', fontSize: '1.3rem' }}>
                                    🚀 Choose Your Plan
                                </h3>

                                <div style={{
                                    display: 'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    gap: '20px'
                                }}>
                                    {/* Basic Plan Features */}
                                    <div style={{
                                        background: 'rgba(255, 255, 255, 0.1)',
                                        borderRadius: '10px',
                                        padding: '15px'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
                                            🌱 Basic Plan - $4.99
                                        </h4>
                                        <ul style={{
                                            textAlign: 'left',
                                            lineHeight: '1.6',
                                            listStyle: 'none',
                                            padding: 0,
                                            fontSize: '0.9rem'
                                        }}>
                                            <li>• <strong>5 Tasks Maximum:</strong> Limited task creation</li>
                                            <li>• <strong>5-Minute Zen Sessions:</strong> Basic meditation</li>
                                            <li>• <strong>Basic Sounds:</strong> 10 nature sounds</li>
                                            <li>• <strong>Essential Tips:</strong> Core ADHD strategies</li>
                                            <li>• <strong>3 Themes:</strong> Light, dark, colorful</li>
                                        </ul>
                                    </div>

                                    {/* Premium Plan Features */}
                                    <div style={{
                                        background: 'linear-gradient(135deg, #fbbf24 20%, #f59e0b 100%)',
                                        borderRadius: '10px',
                                        padding: '15px',
                                        border: '2px solid #fbbf24'
                                    }}>
                                        <h4 style={{ marginBottom: '10px', fontSize: '1.1rem' }}>
                                            ⭐ Premium Plan - $9.99
                                        </h4>
                                        <ul style={{
                                            textAlign: 'left',
                                            lineHeight: '1.6',
                                            listStyle: 'none',
                                            padding: 0,
                                            fontSize: '0.9rem'
                                        }}>
                                            <li>✨ <strong>Everything in Basic +</strong></li>
                                            <li>✨ <strong>Unlimited Tasks:</strong> Create as many as you need</li>
                                            <li>🧘 <strong>Unlimited Zen:</strong> Extended meditation sessions</li>
                                            <li>🎵 <strong>50+ Premium Sounds:</strong> Full audio library</li>
                                            <li>📚 <strong>Expert Guides:</strong> 4 comprehensive wellness guides</li>
                                            <li>📈 <strong>Advanced Analytics:</strong> Detailed progress tracking</li>
                                            <li>💾 <strong>Cloud Sync:</strong> Access across all devices</li>
                                            <li>🎯 <strong>Priority Support:</strong> Get help when you need it</li>
                                            <li>🤖 <strong>AI Coaching:</strong> Personalized recommendations</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '15px',
                                justifyContent: 'center',
                                flexWrap: 'wrap'
                            }}>
                                <motion.button
                                    onClick={() => {
                                        if (onUpgrade) {
                                            onUpgrade('basic');
                                            closeModal();
                                        } else {
                                            // Fallback for demo purposes
                                            alert('🔄 Basic Plan Features:\n\n🌱 Perfect for getting started:\n• 5 tasks maximum\n• 5-minute zen sessions\n• 10 basic nature sounds\n• Essential ADHD tips\n• 3 beautiful themes\n\nPayment integration coming soon!');
                                            closeModal();
                                        }
                                    }}
                                    style={{
                                        background: colors.buttonPrimary,
                                        color: 'white',
                                        padding: '15px 30px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(0, 0, 0, 0.2)'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    💳 Basic Plan - $4.99
                                </motion.button>

                                <motion.button
                                    onClick={() => {
                                        if (onUpgrade) {
                                            onUpgrade('premium');
                                            closeModal();
                                        } else {
                                            // Fallback for demo purposes
                                            alert('🔄 Premium Plan - $9.99\n\nIncludes everything in Basic plus:\n• Advanced AI coaching\n• Personalized routines\n• Priority support\n• Early access to new features\n\nPayment integration coming soon!');
                                            closeModal();
                                        }
                                    }}
                                    style={{
                                        background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                                        color: 'white',
                                        padding: '15px 30px',
                                        borderRadius: '12px',
                                        border: 'none',
                                        fontWeight: 'bold',
                                        fontSize: '1.1rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)'
                                    }}
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    🌟 Premium Plan - $9.99
                                </motion.button>

                                <motion.button
                                    onClick={closeModal}
                                    style={{
                                        background: 'transparent',
                                        color: colors.accent,
                                        padding: '15px 25px',
                                        borderRadius: '12px',
                                        border: `2px solid ${colors.accent}`,
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
                                color: colors.textSecondary,
                                lineHeight: '1.5'
                            }}>
                                💡 <strong>Why upgrade?</strong> Supporting NeuroFlow helps us continue developing
                                features specifically designed for neurodivergent minds. Your upgrade makes this
                                ADHD-friendly experience possible! 🧠💜
                            </p>

                            <div style={{
                                marginTop: '15px',
                                padding: '15px',
                                background: colors.cardBackground,
                                borderRadius: '10px',
                                border: `1px solid ${colors.border}`
                            }}>
                                <p style={{
                                    fontSize: '0.8rem',
                                    color: colors.textSecondary,
                                    margin: 0,
                                    lineHeight: '1.4'
                                }}>
                                    🔒 <strong>Secure Payment:</strong> Your payment information is protected with
                                    bank-level encryption. Cancel anytime with no questions asked.
                                </p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default ThemedUpgradeButton;