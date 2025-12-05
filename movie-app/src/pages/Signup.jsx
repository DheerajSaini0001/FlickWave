import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [nickname, setNickname] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const { signup } = useAuth();
    const navigate = useNavigate();
    const { darkMode } = useTheme();

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        const result = await signup(email, password, name, nickname);
        if (result.success) {
            navigate('/');
        } else {
            setError(result.message);
        }
        setLoading(false);
    };

    return (
        <div className={`min-h-screen flex items-center justify-center px-4 transition-colors duration-300 ${darkMode ? 'bg-[#0f1014]' : 'bg-gray-50'
            }`}>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`p-8 rounded-2xl shadow-2xl w-full max-w-md border transition-colors duration-300 ${darkMode
                        ? 'bg-[#1a1c24] border-white/10'
                        : 'bg-white border-gray-200'
                    }`}
            >
                <h2 className={`text-3xl font-bold mb-6 text-center transition-colors ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    Create Account
                </h2>

                {error && (
                    <div className="bg-red-500/10 border border-red-500/50 text-red-500 px-4 py-2 rounded mb-4 text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSignup} className="space-y-4">
                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                            Full Name
                        </label>
                        <input
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${darkMode
                                    ? 'bg-black/20 border-white/10 text-white placeholder-gray-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            placeholder="John Doe"
                            required
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                            Email Address
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${darkMode
                                    ? 'bg-black/20 border-white/10 text-white placeholder-gray-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            placeholder="name@example.com"
                            required
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                            Password
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${darkMode
                                    ? 'bg-black/20 border-white/10 text-white placeholder-gray-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            placeholder="••••••••"
                            required
                        />
                    </div>
                    <div>
                        <label className={`block text-sm font-medium mb-1 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-700'
                            }`}>
                            Nickname (Optional)
                        </label>
                        <input
                            type="text"
                            value={nickname}
                            onChange={(e) => setNickname(e.target.value)}
                            className={`w-full rounded-lg px-4 py-3 focus:outline-none focus:border-red-600 transition-colors ${darkMode
                                    ? 'bg-black/20 border-white/10 text-white placeholder-gray-600'
                                    : 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400'
                                }`}
                            placeholder="MovieBuff"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white font-bold py-3 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 shadow-lg shadow-red-600/20 mt-2"
                    >
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                <p className={`mt-6 text-center text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                    Already have an account?{' '}
                    <Link to="/login" className="text-red-600 hover:text-red-500 font-medium">
                        Sign in
                    </Link>
                </p>
            </motion.div>
        </div>
    );
};

export default Signup;
