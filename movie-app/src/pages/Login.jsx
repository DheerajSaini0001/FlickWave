import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Login = () => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [nickname, setNickname] = useState('');
    const [step, setStep] = useState(1); // 1: Email, 2: OTP
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { login, sendOtp } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const handleSendOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await sendOtp(email);
        if (success) {
            setStep(2);
        } else {
            setError('Failed to send verification code. Please try again.');
        }
        setLoading(false);
    };

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const success = await login(email, otp, nickname);
        if (success) {
            navigate('/');
        } else {
            setError('Invalid verification code or expired.');
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${
            darkMode ? 'bg-[#0f1014]' : 'bg-gray-50'
        }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-2xl shadow-2xl w-full max-w-md border transition-colors duration-300 ${
                    darkMode 
                        ? 'bg-[#1a1c24] border-white/10' 
                        : 'bg-white border-gray-200'
                }`}
            >
                <h2 className={`text-3xl font-bold mb-6 text-center transition-colors ${
                    darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                    {step === 1 ? 'Sign In' : 'Verify Email'}
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                {step === 1 ? (
                    <form onSubmit={handleSendOtp} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors ${
                                darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                                Email Address
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${
                                    darkMode 
                                        ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                                placeholder="name@example.com"
                                required
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-red-600/20"
                        >
                            {loading ? 'Sending Code...' : 'Send Verification Code'}
                        </button>
                    </form>
                ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-6">
                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors ${
                                darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                                Verification Code
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors text-center tracking-widest text-2xl ${
                                    darkMode 
                                        ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-300'
                                }`}
                                placeholder="000000"
                                maxLength="6"
                                required
                            />
                        </div>
                        <div>
                            <label className={`block text-sm font-medium mb-2 transition-colors ${
                                darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                                Nickname (Optional)
                            </label>
                            <input
                                type="text"
                                value={nickname}
                                onChange={(e) => setNickname(e.target.value)}
                                className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${
                                    darkMode 
                                        ? 'bg-black/20 border-white/10 text-white placeholder-gray-600' 
                                        : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                                placeholder="Enter a nickname"
                            />
                        </div>
                        <p className={`text-xs mt-2 text-center transition-colors ${
                            darkMode ? 'text-gray-500' : 'text-gray-500'
                        }`}>
                            We sent a code to {email}
                        </p>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-red-600/20"
                        >
                            {loading ? 'Verifying...' : 'Verify & Login'}
                        </button>
                        <button
                            type="button"
                            onClick={() => setStep(1)}
                            className={`w-full text-sm transition-colors hover:underline ${
                                darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-900'
                            }`}
                        >
                            Back to Email
                        </button>
                    </form>
                )}
            </motion.div>
        </div>
    );
};

export default Login;