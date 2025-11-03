import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';

// Simple icon components
const Mail = () => <span>📧</span>;
const Lock = () => <span>🔒</span>;
const User = () => <span>👤</span>;
const Eye = () => <span>👁️</span>;
const EyeOff = () => <span>🙈</span>;
const Check = () => <span>✅</span>;
const Google = () => <span>🌐</span>;

interface SignUpProps {
    onSignUp: (name: string, email: string, password: string) => void;
    onGoogleSignUp?: () => void;
    onSwitchToSignIn: () => void;
    onGuestMode: () => void;
    isLoading?: boolean;
}

const SignUp: React.FC<SignUpProps> = ({ onSignUp, onGoogleSignUp, onSwitchToSignIn, onGuestMode, isLoading }) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [errors, setErrors] = useState<{
        name?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
        terms?: string;
        google?: string;
    }>({});
    const [googleLoading, setGoogleLoading] = useState(false);
    const { signInWithGoogle: authSignInWithGoogle } = useAuth();

    const handleGoogleSignUp = async () => {
        setGoogleLoading(true);
        setErrors({});
        try {
            const { error } = await authSignInWithGoogle();
            if (error) {
                setErrors({ google: error.message || 'Failed to sign up with Google' });
            }
        } catch (error: any) {
            console.error('Google sign up error:', error);
            setErrors({ google: error.message || 'An unexpected error occurred' });
        } finally {
            setGoogleLoading(false);
        }
    };

    const validateForm = () => {
        const newErrors: typeof errors = {};

        if (!name.trim()) {
            newErrors.name = 'Name is required';
        } else if (name.trim().length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

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

        if (!confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password';
        } else if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        if (!agreedToTerms) {
            newErrors.terms = 'Please agree to the terms and conditions';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (validateForm()) {
            onSignUp(name.trim(), email, password);
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
                    <h1 className="text-3xl font-bold text-primary mb-2">Join NeuroFlow!</h1>
                    <p className="text-secondary">Create your account and start your journey</p>
                </div>

                {/* Sign Up Form */}
                <div className="card">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Name Field */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Full Name
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User />
                                </div>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.name ? 'border-red-500' : 'border-themed'
                                        }`}
                                    placeholder="Your name"
                                />
                            </div>
                            {errors.name && (
                                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                            )}
                        </div>

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
                                    placeholder="Create a password"
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

                        {/* Confirm Password Field */}
                        <div>
                            <label className="block text-sm font-medium text-primary mb-2">
                                Confirm Password
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock />
                                </div>
                                <input
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors ${errors.confirmPassword ? 'border-red-500' : 'border-themed'
                                        }`}
                                    placeholder="Confirm your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                >
                                    {showConfirmPassword ? <EyeOff /> : <Eye />}
                                </button>
                            </div>
                            {errors.confirmPassword && (
                                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                            )}
                        </div>

                        {/* Terms Agreement */}
                        <div>
                            <label className="flex items-start gap-3 cursor-pointer">
                                <div className="relative mt-1">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="sr-only"
                                    />
                                    <div className={`w-5 h-5 border-2 rounded flex items-center justify-center transition-colors ${agreedToTerms ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
                                        }`}>
                                        {agreedToTerms && <Check />}
                                    </div>
                                </div>
                                <span className="text-sm text-secondary">
                                    I agree to the{' '}
                                    <button type="button" className="text-blue-500 hover:text-blue-600 underline">
                                        Terms of Service
                                    </button>{' '}
                                    and{' '}
                                    <button type="button" className="text-blue-500 hover:text-blue-600 underline">
                                        Privacy Policy
                                    </button>
                                </span>
                            </label>
                            {errors.terms && (
                                <p className="text-red-500 text-sm mt-1">{errors.terms}</p>
                            )}
                        </div>

                        {/* Sign Up Button */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    {/* Google Sign Up */}
                    <>
                        <div className="my-6 flex items-center">
                            <div className="flex-1 border-t border-themed"></div>
                            <span className="px-4 text-sm text-muted">or</span>
                            <div className="flex-1 border-t border-themed"></div>
                        </div>

                        {errors.google && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                                <p className="text-red-700 text-sm">{errors.google}</p>
                            </div>
                        )}

                        <button
                            onClick={handleGoogleSignUp}
                            disabled={isLoading || googleLoading}
                            className="w-full bg-white border border-gray-300 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 mb-4 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <Google />
                            {googleLoading ? 'Connecting to Google...' : 'Continue with Google'}
                        </button>
                    </>

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

                    {/* Sign In Link */}
                    <p className="text-center text-sm text-secondary">
                        Already have an account?{' '}
                        <button
                            onClick={onSwitchToSignIn}
                            className="text-blue-500 hover:text-blue-600 font-medium transition-colors"
                        >
                            Sign in
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
                        <h3 className="font-semibold text-yellow-800">Free Demo Available</h3>
                    </div>
                    <p className="text-sm text-yellow-700">
                        Try our demo with limited features, or create an account to unlock the full experience for just $5!
                    </p>
                </motion.div>
            </motion.div>
        </div>
    );
};

export default SignUp;