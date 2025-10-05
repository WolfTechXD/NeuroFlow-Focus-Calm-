import React from 'react';
import { motion } from 'framer-motion';

// Simple icon components to replace lucide-react
const Brain = () => <span>🧠</span>;
const Heart = () => <span>❤️</span>;
const Target = () => <span>🎯</span>;
const Zap = () => <span>⚡</span>;
const Star = () => <span>⭐</span>;
const Trophy = () => <span>🏆</span>;
const Users = () => <span>👥</span>;
const Shield = () => <span>🛡️</span>;

interface LandingPageProps {
    onGetStarted: () => void;
}

const LandingPage: React.FC<LandingPageProps> = ({ onGetStarted }) => {
    const features = [
        {
            icon: <Target />,
            title: "Gamified Tasks",
            description: "Turn boring tasks into exciting quests with points, badges, and rewards that spark dopamine"
        },
        {
            icon: <Brain />,
            title: "ADHD-Friendly Design",
            description: "Built specifically for neurodivergent minds with instant feedback and visual structure"
        },
        {
            icon: <Heart />,
            title: "Zen Mode",
            description: "Calming breathing exercises, mindfulness activities, and soothing sounds for overstimulation"
        },
        {
            icon: <Zap />,
            title: "Instant Rewards",
            description: "Get immediate positive feedback with celebrations, animations, and progress tracking"
        },
        {
            icon: <Trophy />,
            title: "Achievement System",
            description: "Unlock badges, level up your avatar, and build streaks that keep you motivated"
        },
        {
            icon: <Shield />,
            title: "Customizable",
            description: "Adjust themes, sounds, and difficulty to match your unique neurodivergent needs"
        }
    ];

    const testimonials = [
        {
            name: "Sarah M.",
            role: "College Student with ADHD",
            quote: "Finally, an app that doesn't make me feel guilty for missing tasks. The gamification actually makes me want to do my homework!",
            avatar: "👩‍🎓"
        },
        {
            name: "Alex R.",
            role: "Developer with Autism",
            quote: "The visual structure and calm design help me stay organized without feeling overwhelmed. Love the zen mode!",
            avatar: "👨‍💻"
        },
        {
            name: "Jordan L.",
            role: "Working Professional",
            quote: "The instant feedback and celebrations give me the dopamine hits I need to stay focused. Game-changer for my productivity!",
            avatar: "👩‍💼"
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-pink-50 via-pink-100 to-blue-50">
            {/* Hero Section */}
            <section className="relative overflow-hidden px-4 pt-16 pb-20">
                <div className="max-w-7xl mx-auto text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="text-6xl mb-4">🧠✨</div>
                        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-pink-500 via-pink-400 to-blue-500 bg-clip-text text-transparent mb-6">
                            NeuroFlow
                        </h1>
                        <p className="text-xl md:text-2xl text-gray-700 mb-4">
                            Focus & Calm Companion
                        </p>
                        <p className="text-lg text-gray-600 mb-8 max-w-3xl mx-auto">
                            Turn daily tasks into rewarding quests while finding calm and focus.
                            Designed specifically for ADHD, autism, and anxiety - because your brain works differently, and that's your superpower! 🦸‍♀️
                        </p>

                        <motion.button
                            onClick={onGetStarted}
                            className="btn-primary text-xl px-8 py-4 mb-8"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🚀 Start Your Journey
                        </motion.button>

                        <div className="flex justify-center gap-8 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                                <Star />
                                <span>Science-backed strategies</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Users />
                                <span>Built by neurodivergent developers</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <Heart />
                                <span>Free & accessible</span>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Why NeuroFlow Works for Your Brain 🧠
                        </h2>
                        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                            We understand that neurodivergent brains need different approaches. Our app is built on research
                            and real experiences from the ADHD, autistic, and anxiety communities.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card text-center hover:scale-105 transition-transform"
                            >
                                <div className="text-blue-500 mb-4 flex justify-center">
                                    {feature.icon}
                                </div>
                                <h3 className="text-xl font-semibold text-gray-800 mb-3">
                                    {feature.title}
                                </h3>
                                <p className="text-gray-600">
                                    {feature.description}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-20 px-4 bg-white/50">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Your Journey to Focus & Calm 🌈
                        </h2>
                        <p className="text-xl text-gray-600">
                            Simple steps designed for neurodivergent success
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                1
                            </div>
                            <h3 className="text-xl font-semibold mb-3">🎯 Create Your Quests</h3>
                            <p className="text-gray-600">
                                Turn everyday tasks into exciting missions. Break big projects into bite-sized, rewarding steps.
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-purple-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                2
                            </div>
                            <h3 className="text-xl font-semibold mb-3">⚡ Get Instant Rewards</h3>
                            <p className="text-gray-600">
                                Earn points, unlock badges, and level up your avatar. Every completed task triggers a celebration!
                            </p>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.4 }}
                            className="text-center"
                        >
                            <div className="w-16 h-16 bg-pink-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                                3
                            </div>
                            <h3 className="text-xl font-semibold mb-3">🧘 Find Your Calm</h3>
                            <p className="text-gray-600">
                                When overwhelmed, switch to Zen Mode for breathing exercises, mindfulness, and soothing sounds.
                            </p>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-16"
                    >
                        <h2 className="text-4xl font-bold text-gray-800 mb-6">
                            Real Stories from Our Community 💝
                        </h2>
                        <p className="text-xl text-gray-600">
                            See how NeuroFlow is helping neurodivergent individuals thrive
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: index * 0.1 }}
                                className="card"
                            >
                                <div className="text-4xl mb-4">{testimonial.avatar}</div>
                                <p className="text-gray-600 mb-4 italic">
                                    "{testimonial.quote}"
                                </p>
                                <div>
                                    <p className="font-semibold text-gray-800">{testimonial.name}</p>
                                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 bg-gradient-to-r from-pink-400 via-pink-500 to-blue-500">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h2 className="text-4xl font-bold mb-6">
                            Ready to Transform Your Daily Life? ✨
                        </h2>
                        <p className="text-xl mb-8 opacity-90">
                            Join thousands of neurodivergent individuals who've discovered a better way to focus, achieve, and find calm.
                        </p>
                        <motion.button
                            onClick={onGetStarted}
                            className="bg-white text-purple-600 font-bold text-xl px-8 py-4 rounded-xl hover:bg-gray-100 transition-colors shadow-lg"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                        >
                            🎯 Start Your Quest Now - It's Free!
                        </motion.button>
                        <p className="text-sm mt-4 opacity-75">
                            No signup required • Works on all devices • Your data stays private
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 bg-gray-900 text-white">
                <div className="max-w-7xl mx-auto text-center">
                    <div className="text-4xl mb-4">🧠✨</div>
                    <h3 className="text-2xl font-bold mb-4">NeuroFlow</h3>
                    <p className="text-gray-400 mb-8">
                        Built with ❤️ for the neurodivergent community
                    </p>
                    <div className="flex justify-center gap-8 text-sm text-gray-400">
                        <span>🌈 Inclusive Design</span>
                        <span>🔬 Science-Based</span>
                        <span>🔒 Privacy-First</span>
                        <span>🎮 Gamified</span>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;