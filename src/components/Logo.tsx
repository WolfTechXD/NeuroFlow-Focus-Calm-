import React from 'react';
import { motion } from 'framer-motion';

interface LogoProps {
    size?: 'small' | 'medium' | 'large';
    animated?: boolean;
    className?: string;
}

const Logo: React.FC<LogoProps> = ({ size = 'medium', animated = false, className = '' }) => {
    const sizeMap = {
        small: 48,
        medium: 96,
        large: 140
    };

    const dimension = sizeMap[size];

    const logoVariants = {
        initial: { scale: 0.8, opacity: 0, rotate: -5 },
        animate: {
            scale: 1,
            opacity: 1,
            rotate: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut"
            }
        },
        pulse: {
            scale: [1, 1.03, 1],
            transition: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const glowVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: [0.3, 0.6, 0.3],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
            }
        }
    };

    const sparkleVariants = {
        initial: { opacity: 0, scale: 0 },
        animate: {
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            transition: {
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
                delay: 0.5
            }
        }
    };

    const MotionSvg = animated ? motion.svg : 'svg';
    const MotionPath = animated ? motion.path : 'path';
    const MotionCircle = animated ? motion.circle : 'circle';
    const MotionG = animated ? motion.g : 'g';

    return (
        <MotionSvg
            width={dimension}
            height={dimension}
            viewBox="0 0 240 240"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            variants={animated ? logoVariants : undefined}
            initial={animated ? "initial" : undefined}
            animate={animated ? ["animate", "pulse"] : undefined}
        >
            <defs>
                {/* Main gradient - vibrant pink to blue */}
                <linearGradient id="brainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#ec4899" stopOpacity="1" />
                    <stop offset="35%" stopColor="#d946ef" stopOpacity="1" />
                    <stop offset="65%" stopColor="#a855f7" stopOpacity="1" />
                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="1" />
                </linearGradient>

                {/* Pathway gradient */}
                <linearGradient id="pathwayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#f472b6" stopOpacity="1" />
                    <stop offset="50%" stopColor="#c084fc" stopOpacity="1" />
                    <stop offset="100%" stopColor="#60a5fa" stopOpacity="1" />
                </linearGradient>

                {/* Light pathway gradient */}
                <linearGradient id="lightPathway" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#fbbf24" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.8" />
                </linearGradient>

                {/* Glow effect */}
                <radialGradient id="glowGradient">
                    <stop offset="0%" stopColor="#a855f7" stopOpacity="0.6" />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                </radialGradient>

                {/* Shadow */}
                <filter id="shadow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur in="SourceAlpha" stdDeviation="4"/>
                    <feOffset dx="0" dy="2" result="offsetblur"/>
                    <feComponentTransfer>
                        <feFuncA type="linear" slope="0.3"/>
                    </feComponentTransfer>
                    <feMerge>
                        <feMergeNode/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>

                {/* Glossy effect */}
                <linearGradient id="glossy" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
                    <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                    <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                </linearGradient>
            </defs>

            {/* Outer glow effect */}
            {animated && (
                <MotionCircle
                    cx="120"
                    cy="120"
                    r="85"
                    fill="url(#glowGradient)"
                    variants={glowVariants}
                    initial="initial"
                    animate="animate"
                />
            )}

            {/* Main brain shape - anatomically inspired */}
            <g filter="url(#shadow)">
                {/* Left hemisphere */}
                <path
                    d="M 75 65
                       C 60 65 50 75 50 90
                       C 50 100 52 108 56 115
                       Q 50 125 50 135
                       C 50 145 55 155 65 160
                       Q 70 165 80 168
                       C 85 170 90 172 95 172
                       L 100 172
                       L 100 95
                       Q 95 85 90 75
                       Q 85 68 75 65 Z"
                    fill="url(#brainGradient)"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Right hemisphere */}
                <path
                    d="M 165 65
                       C 180 65 190 75 190 90
                       C 190 100 188 108 184 115
                       Q 190 125 190 135
                       C 190 145 185 155 175 160
                       Q 170 165 160 168
                       C 155 170 150 172 145 172
                       L 140 172
                       L 140 95
                       Q 145 85 150 75
                       Q 155 68 165 65 Z"
                    fill="url(#brainGradient)"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    strokeLinejoin="round"
                />

                {/* Center connecting bridge (corpus callosum) */}
                <ellipse
                    cx="120"
                    cy="120"
                    rx="20"
                    ry="45"
                    fill="url(#brainGradient)"
                    opacity="0.9"
                />

                {/* Glossy overlay */}
                <ellipse
                    cx="120"
                    cy="100"
                    rx="70"
                    ry="50"
                    fill="url(#glossy)"
                    opacity="0.5"
                />
            </g>

            {/* Detailed neural pathways - Left hemisphere */}
            <g opacity="0.85">
                {/* Frontal lobe patterns */}
                <path
                    d="M 70 75 Q 75 78 72 82 Q 68 86 72 90 Q 76 94 72 98"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 80 70 Q 84 74 81 78 Q 78 82 81 86"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Temporal lobe patterns */}
                <path
                    d="M 65 110 Q 70 113 67 117 Q 64 121 67 125 Q 70 129 67 133"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M 75 115 Q 78 118 76 122 Q 74 126 76 130"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Occipital patterns */}
                <path
                    d="M 70 145 Q 75 147 72 150 Q 69 153 72 156"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>

            {/* Detailed neural pathways - Right hemisphere */}
            <g opacity="0.85">
                {/* Frontal lobe patterns */}
                <path
                    d="M 170 75 Q 165 78 168 82 Q 172 86 168 90 Q 164 94 168 98"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />
                <path
                    d="M 160 70 Q 156 74 159 78 Q 162 82 159 86"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Temporal lobe patterns */}
                <path
                    d="M 175 110 Q 170 113 173 117 Q 176 121 173 125 Q 170 129 173 133"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M 165 115 Q 162 118 164 122 Q 166 126 164 130"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />

                {/* Occipital patterns */}
                <path
                    d="M 170 145 Q 165 147 168 150 Q 171 153 168 156"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>

            {/* Central neural connections */}
            <g opacity="0.9">
                <path
                    d="M 95 115 L 120 120 L 145 115"
                    stroke="url(#lightPathway)"
                    strokeWidth="2.5"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M 100 125 L 120 128 L 140 125"
                    stroke="url(#lightPathway)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
                <path
                    d="M 105 135 Q 120 138 135 135"
                    stroke="url(#pathwayGradient)"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                />
            </g>

            {/* Neural nodes - synapses */}
            <g>
                {/* Left hemisphere nodes */}
                <circle cx="72" cy="82" r="3" fill="#f472b6" opacity="0.9" />
                <circle cx="67" cy="117" r="3.5" fill="#ec4899" opacity="0.9" />
                <circle cx="72" cy="150" r="2.5" fill="#f472b6" opacity="0.85" />
                <circle cx="81" cy="78" r="2.5" fill="#d946ef" opacity="0.85" />

                {/* Right hemisphere nodes */}
                <circle cx="168" cy="82" r="3" fill="#60a5fa" opacity="0.9" />
                <circle cx="173" cy="117" r="3.5" fill="#3b82f6" opacity="0.9" />
                <circle cx="168" cy="150" r="2.5" fill="#60a5fa" opacity="0.85" />
                <circle cx="159" cy="78" r="2.5" fill="#a855f7" opacity="0.85" />

                {/* Central nodes */}
                <circle cx="120" cy="120" r="4" fill="#fbbf24" opacity="0.95" />
                <circle cx="100" cy="115" r="3" fill="#c084fc" opacity="0.9" />
                <circle cx="140" cy="115" r="3" fill="#c084fc" opacity="0.9" />
                <circle cx="110" cy="135" r="2.5" fill="#f59e0b" opacity="0.85" />
                <circle cx="130" cy="135" r="2.5" fill="#f59e0b" opacity="0.85" />
            </g>

            {/* Electrical activity sparkles */}
            {animated && (
                <g>
                    <MotionG
                        variants={sparkleVariants}
                        initial="initial"
                        animate="animate"
                    >
                        <path
                            d="M 85 90 L 87 95 L 92 97 L 87 99 L 85 104 L 83 99 L 78 97 L 83 95 Z"
                            fill="#fbbf24"
                            opacity="0.9"
                        />
                    </MotionG>

                    <MotionG
                        variants={sparkleVariants}
                        initial="initial"
                        animate="animate"
                        style={{ animationDelay: '0.7s' }}
                    >
                        <path
                            d="M 155 90 L 157 95 L 162 97 L 157 99 L 155 104 L 153 99 L 148 97 L 153 95 Z"
                            fill="#fbbf24"
                            opacity="0.9"
                        />
                    </MotionG>

                    <MotionG
                        variants={sparkleVariants}
                        initial="initial"
                        animate="animate"
                        style={{ animationDelay: '1.2s' }}
                    >
                        <path
                            d="M 120 100 L 122 105 L 127 107 L 122 109 L 120 114 L 118 109 L 113 107 L 118 105 Z"
                            fill="#f59e0b"
                            opacity="0.95"
                        />
                    </MotionG>
                </g>
            )}

            {/* Emphasis particles for depth */}
            <g opacity="0.4">
                <circle cx="90" cy="105" r="1.5" fill="#fbbf24" />
                <circle cx="150" cy="105" r="1.5" fill="#fbbf24" />
                <circle cx="120" cy="145" r="1.5" fill="#f472b6" />
                <circle cx="75" cy="125" r="1" fill="#60a5fa" />
                <circle cx="165" cy="125" r="1" fill="#ec4899" />
            </g>
        </MotionSvg>
    );
};

export default Logo;
