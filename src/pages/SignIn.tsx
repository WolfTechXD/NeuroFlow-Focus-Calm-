import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useGoogleAuthDemo } from '../hooks/useGoogleAuth';

// Simple icon components
const Mail = () => <span>📧</span>;
const Lock = () => <span>🔒</span>;
const User = () => <span>👤</span>;
const Eye = () => <span>👁️</span>;
const EyeOff = () => <span>🙈</span>;
const Google = () => <span>🌐</span>;

interface SignInProps {
    onSignIn: (email: string, password: string) => void;
    onGoogleSignIn?: () => void;
    onSwitchToSignUp: () => void;
    onGuestMode: () => void;
    isLoading?: boolean;
}

const SignIn: React.FC<SignInProps> = ({ onSignIn, onGoogleSignIn, onSwitchToSignUp, onGuestMode, isLoading }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

    // Google Auth integration
    const { signInWithGoogle } = useGoogleAuthDemo(
        (user) => {
            // Handle successful Google sign in - directly call the handler with Google user data
            handleGoogleAuth(user);
        },
        (error) => {
            console.error('Google sign in error:', error);
        }
    );

    const handleGoogleAuth = (user: any) => {
        // Create a simulated email/password flow for Google users
        const googleEmail = user.email;
        const googleName = user.name;

        // Update the form state to show Google user info
        setEmail(googleEmail);

        // Directly call the sign in handler with Google user data
        onSignIn(googleEmail, 'google-auth-token');
    };

    const validateForm = () => {
        const newErrors: { email?: string; password?: string } = {};

        if (!email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!password) {
            newErrors.password = 'Password is required';
        } else if (password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSignIn(email, password);
        }
    };

    return (
        <div className="min-h-screen bg-app flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-md"
            >
                {/* Logo & Header */}
                <div className="text-center mb-8">
                    <div className="text-6xl mb-4">🧠✨</div>
                    <h1 className="text-3xl font-bold text-primary mb-2">Welcome Back!</h1>
                    <p className="text-secondary">Sign in to continue your neurodivergent journey</p>
                </div>

                {/* Sign In Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Field */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Email Address
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Mail />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.email ? 'border-red-500' : 'border-themed'
                                        }`}
                                    placeholder="you@example.com"
                                />
                            </div>
                            {errors.email && (
                                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                            )}
                        </div>

                        {/* Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.password ? 'border-red-500' : 'border-themed'
                                        }`}
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
                            )}
                        </div>

                        {/* Forgot Password */}
                        <div className="text-right">
                            <button
                                type="button"
                                className="text-sm text-blue-500 hover:text-blue-600 transition-colors"
                            >
                                Forgot your password?
                            </button>
                        </div>

                        {/* Sign In Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Signing In...' : 'Sign In'}
                        </button>
                    </form>

                    {/* Google Sign In */}
                    {onGoogleSignIn && (
                        <>
                            <div className="my-6 flex items-center">
                                <div className="flex-1 border-t border-themed"></div>
                                <span className="px-4 text-sm text-muted">or</span>
                                <div className="flex-1 border-t border-themed"></div>
                            </div>

                            <button
                                onClick={signInWithGoogle}
                                disabled={isLoading}
                                className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <Google />
                                Continue with Google
                            </button>
                        </>
                    )}

                    {/* Divider */}
                    <div className="my-6 flex items-center">
                        <div className="flex-1 border-t border-themed"></div>
                        <span className="px-4 text-sm text-muted">or</span>
                        <div className="flex-1 border-t border-themed"></div>
                    </div>

                    {/* Guest Mode */}
                    <button
                        onClick={onGuestMode}
                        className="w-full btn-secondary flex items-center justify-center gap-2 mb-4"
                    >
                        <User />
                        Try Demo Mode (Limited Features)
                    </button>

                    {/* Sign Up Link */}
                    <p className="text-center text-sm text-secondary">
                        Don't have an account?{' '}
                        <button
                            onClick={onSwitchToSignUp}
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                        >
                            Sign up for free
                        </button>
                    </p>
                </div>

                {/* Demo Notice */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg"
                >
                    <div className="flex items-center gap-2 mb-2">
                        <span className="text-2xl">✨</span>
                        <h3 className="font-semibold text-yellow-800">Demo Version</h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                        This is a demo version with limited features. Upgrade to the full version for just $5 to unlock all features!
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignIn;