import React from 'react';
import { motion } from 'framer-motion';
import { Brain } from 'lucide-react';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', animated = false, className = '' }) => {
    const sizeMap = {
        small: 48,
        medium: 80,
        large: 120
    };

    const dimension = sizeMap[size];

    const logoVariants = {
        initial: { scale: 0.9, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.6,
                ease: "easeOut"
            }
        },
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2.5,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: [0.2, 0.5, 0.2],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const MotionDiv = animated ? motion.div : 'div';

    return (
        <MotionDiv
            className={`relative inline-flex items-center justify-center ${className}`}
            style={{ width: dimension, height: dimension }}
            variants={animated ? logoVariants : undefined}
            initial={animated ? "initial" : undefined}
            animate={animated ? ["animate", "pulse"] : undefined}
        >
            {/* Glow effect background */}
            {animated && (
                <motion.div
                    className="absolute inset-0 rounded-full"
                    style={{
                        background: 'radial-gradient(circle, rgba(168, 85, 247, 0.4) 0%, rgba(168, 85, 247, 0) 70%)',
                        filter: 'blur(20px)',
                    }}
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                />
            )}

            {/* Split brain container */}
            <div
                className="relative z-10"
                style={{
                    width: dimension * 0.7,
                    height: dimension * 0.7,
                    position: 'relative'
                }}
            >
                {/* Left half - Pink */}
                <div
                    style={{
                        position: 'absolute',
                        left: 0,
                        top: 0,
                        width: '50%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            color: '#ec4899',
                            filter: 'drop-shadow(0 2px 8px rgba(236, 72, 153, 0.4))',
                        }}
                    >
                        <Brain
                            size={dimension * 0.7}
                            strokeWidth={2}
                        />
                    </div>
                </div>

                {/* Right half - Blue */}
                <div
                    style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        width: '50%',
                        height: '100%',
                        overflow: 'hidden',
                    }}
                >
                    <div
                        style={{
                            color: '#3b82f6',
                            transform: `translateX(-${dimension * 0.35}px)`,
                            filter: 'drop-shadow(0 2px 8px rgba(59, 130, 246, 0.4))',
                        }}
                    >
                        <Brain
                            size={dimension * 0.7}
                            strokeWidth={2}
                        />
                    </div>
                </div>

                {/* Center glow line */}
                <div
                    style={{
                        position: 'absolute',
                        left: '50%',
                        top: '10%',
                        transform: 'translateX(-50%)',
                        width: '2px',
                        height: '80%',
                        background: 'linear-gradient(to bottom, rgba(236, 72, 153, 0) 0%, rgba(168, 85, 247, 0.6) 50%, rgba(59, 130, 246, 0) 100%)',
                        filter: 'blur(2px)',
                    }}
                />
            </div>

            {/* Sparkle effect */}
            {animated && (
                <motion.div
                    className="absolute"
                    style={{
                        top: '15%',
                        right: '15%',
                        width: dimension * 0.15,
                        height: dimension * 0.15,
                    }}
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5],
                        rotate: [0, 180, 360],
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                    }}
                >
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M12 2L14 10L22 12L14 14L12 22L10 14L2 12L10 10L12 2Z"
                            fill="url(#sparkleGradient)"
                        />
                        <defs>
                            <linearGradient id="sparkleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                <stop offset="0%" stopColor="#fbbf24" />
                                <stop offset="100%" stopColor="#f59e0b" />
                            </linearGradient>
                        </defs>
                    </svg>
                </motion.div>
            )}
        </MotionDiv>
    );
};

export default Logo;
