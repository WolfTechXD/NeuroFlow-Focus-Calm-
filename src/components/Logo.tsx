import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', animated = false, className = '' }) => {
    const sizeMap = {
        small: 40,
        medium: 80,
        large: 120
    };

    const dimension = sizeMap[size];

    const logoVariants = {
        initial: { scale: 0.8, opacity: 0 },
        animate: {
            scale: 1,
            opacity: 1,
            transition: {
                duration: 0.5,
                ease: "easeOut"
            }
        },
        pulse: {
            scale: [1, 1.05, 1],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const MotionSvg = animated ? motion.svg : 'svg';

    return (
        <MotionSvg
            width={dimension}
            height={dimension}
            viewBox="0 0 200 200"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            variants={animated ? logoVariants : undefined}
            initial={animated ? "initial" : undefined}
            animate={animated ? ["animate", "pulse"] : undefined}
        >
            <defs>
                <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" />
                    <stop offset="50%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#3b82f6" />
                </linearGradient>
                <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f472b6" />
                    <stop offset="100%" stopColor="#60a5fa" />
                </linearGradient>
            </defs>

            {/* Brain outline */}
            <path
                d="M100 30 C70 30 50 50 50 75 C50 85 55 95 60 100 C50 110 45 125 50 140 C55 155 70 165 85 165 C90 168 95 170 100 170 C105 170 110 168 115 165 C130 165 145 155 150 140 C155 125 150 110 140 100 C145 95 150 85 150 75 C150 50 130 30 100 30 Z"
                fill="url(#brainGradient)"
                stroke="url(#pathwayGradient)"
                strokeWidth="3"
                opacity="0.9"
            />

            {/* Left hemisphere detail */}
            <path
                d="M65 60 Q70 65 65 70 Q60 75 65 80 Q70 85 65 90"
                stroke="url(#pathwayGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
            />
            <path
                d="M75 55 Q80 60 75 65 Q70 70 75 75"
                stroke="url(#pathwayGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Right hemisphere detail */}
            <path
                d="M135 60 Q130 65 135 70 Q140 75 135 80 Q130 85 135 90"
                stroke="url(#pathwayGradient)"
                strokeWidth="2.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.7"
            />
            <path
                d="M125 55 Q120 60 125 65 Q130 70 125 75"
                stroke="url(#pathwayGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Neural pathways - center connections */}
            <path
                d="M85 100 L100 105 L115 100"
                stroke="url(#pathwayGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.8"
            />
            <path
                d="M90 110 L100 115 L110 110"
                stroke="url(#pathwayGradient)"
                strokeWidth="1.5"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Neural nodes */}
            <circle cx="85" cy="100" r="3" fill="#f472b6" opacity="0.8" />
            <circle cx="100" cy="105" r="3.5" fill="#a855f7" opacity="0.9" />
            <circle cx="115" cy="100" r="3" fill="#60a5fa" opacity="0.8" />
            <circle cx="70" cy="80" r="2.5" fill="#ec4899" opacity="0.7" />
            <circle cx="130" cy="80" r="2.5" fill="#3b82f6" opacity="0.7" />

            {/* Lower connections */}
            <path
                d="M85 130 Q90 135 95 130 Q100 125 105 130 Q110 135 115 130"
                stroke="url(#pathwayGradient)"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
                opacity="0.6"
            />

            {/* Focus sparkle */}
            <g opacity="0.8">
                <path
                    d="M100 45 L102 50 L107 52 L102 54 L100 59 L98 54 L93 52 L98 50 Z"
                    fill="#fbbf24"
                />
            </g>
        </MotionSvg>
    );
};

export default Logo;
