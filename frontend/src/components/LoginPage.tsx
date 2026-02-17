import React, { useState } from 'react';
import { FiArrowLeft, FiGithub } from 'react-icons/fi';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';

interface LoginPageProps {
    onBack: () => void;
    onSignup: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onBack, onSignup }) => {
    const { theme } = useTheme();
    const { loginWithGithub } = useAuth();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Email login coming soon! Please use GitHub for now.');
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 animate-fade-in relative overflow-hidden"
            style={{ background: theme === 'dark' ? '#0a0a0a' : '#f4f4f4' }}>

            {/* Back Button */}
            <button
                onClick={onBack}
                className="absolute top-8 left-8 p-3 rounded-full hover:bg-black/5 dark:hover:bg-white/10 transition-colors duration-200 group"
                aria-label="Back to Home"
            >
                <FiArrowLeft className="text-xl text-gray-600 dark:text-gray-400 group-hover:text-black dark:group-hover:text-white transition-colors" />
            </button>

            {/* Main Card */}
            <div className="w-full max-w-md bg-white dark:bg-[#18181b] rounded-[24px] shadow-xl p-8 sm:p-12 relative z-10 border border-black/5 dark:border-white/10">
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-gray-50 dark:bg-white/5 mb-6">
                        <img src="/st1.svg" alt="Reposa" className="w-6 h-6" style={{ filter: theme === 'light' ? 'brightness(0.8)' : 'none' }} />
                    </div>
                    <h1 className="text-2xl font-bold mb-2 text-gray-900 dark:text-white tracking-tight">Welcome back</h1>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Please enter your details to sign in</p>
                </div>

                <button
                    onClick={loginWithGithub}
                    className="w-full flex items-center justify-center gap-3 px-4 py-4 border border-gray-200 dark:border-white/10 rounded-xl hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-all duration-200 group bg-white dark:bg-white/5"
                >
                    <FiGithub className="text-xl" />
                    <span className="text-sm font-bold">Continue with GitHub</span>
                </button>

                <div className="relative my-8">
                    <div className="absolute inset-0 flex items-center">
                        <div className="w-full border-t border-gray-100 dark:border-white/10"></div>
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-white dark:bg-[#18181b] px-4 text-gray-400 dark:text-gray-500 font-medium tracking-wider">Or continue with</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Email address</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-black/10 dark:focus:border-white/10 outline-none transition-all duration-200 text-sm"
                            placeholder="name@example.com"
                        />
                    </div>
                    <div>
                        <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2 ml-1">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-3 rounded-xl bg-gray-50 dark:bg-black/20 border border-transparent focus:bg-white dark:focus:bg-black/40 focus:border-black/10 dark:focus:border-white/10 outline-none transition-all duration-200 text-sm"
                            placeholder="••••••••"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full py-3.5 rounded-xl bg-black dark:bg-white text-white dark:text-black text-sm font-semibold hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 shadow-lg shadow-black/5 dark:shadow-white/5"
                    >
                        Log in
                    </button>
                </form>

                <p className="mt-8 text-center text-xs text-gray-500 dark:text-gray-400">
                    Don't have an account? <button onClick={onSignup} className="text-black dark:text-white font-medium hover:underline">Sign up</button>
                </p>
            </div>

            {/* Cal.com style background blur */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-tr from-blue-500/5 to-purple-500/5 rounded-full blur-3xl pointer-events-none"></div>
        </div>
    );
};

export default LoginPage;
