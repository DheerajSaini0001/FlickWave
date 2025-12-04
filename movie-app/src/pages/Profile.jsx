import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
// 1. Import useTheme
import { useTheme } from '../context/ThemeContext';

const Profile = () => {
    // 2. Access darkMode state
    const { darkMode } = useTheme();
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return (
        isAuthenticated && (
            // 3. Main wrapper: Handles full screen background color
            <div className={`min-h-screen w-full flex justify-center items-start pt-32 px-4 transition-colors duration-300 ${
                darkMode ? "bg-[#0f1014]" : "bg-gray-50"
            }`}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    // 4. Card Styling: Glassmorphism adjusted for Light/Dark
                    className={`relative backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center border overflow-hidden transition-all duration-300 ${
                        darkMode 
                            ? "bg-[#1a1c24]/50 border-white/10" 
                            : "bg-white/80 border-white/60"
                    }`}
                >
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-red-600/20 to-orange-600/20"></div>
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-red-500/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"></div>

                    <div className="relative z-10">
                        <motion.div
                            initial={{ scale: 0.5, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            transition={{ delay: 0.2, type: "spring" }}
                            className="relative inline-block mb-6"
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-orange-500 rounded-full blur opacity-50"></div>
                            {/* 5. Image Border: Matches card background */}
                            <img
                                src={user.picture}
                                alt={user.name}
                                className={`relative w-40 h-40 rounded-full border-4 shadow-xl object-cover transition-colors duration-300 ${
                                    darkMode ? "border-[#1a1c24]" : "border-white"
                                }`}
                            />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className={`text-4xl font-bold mb-2 transition-colors duration-300 ${
                                darkMode ? "text-white" : "text-gray-900"
                            }`}
                        >
                            {user.name}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className={`text-lg mb-8 transition-colors duration-300 ${
                                darkMode ? "text-gray-400" : "text-gray-600"
                            }`}
                        >
                            {user.email}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8"
                        >
                            {/* Reusable Style for Detail Boxes */}
                            <DetailBox 
                                label="Nickname" 
                                value={user.nickname || 'Not set'} 
                                darkMode={darkMode} 
                            />
                            <DetailBox 
                                label="Last Updated" 
                                value={user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : 'N/A'} 
                                darkMode={darkMode} 
                            />
                        </motion.div>
                    </div>
                </motion.div>
            </div>
        )
    );
};

// Helper component to keep the main JSX clean
const DetailBox = ({ label, value, darkMode }) => (
    <div className={`p-4 rounded-xl border transition-colors duration-300 ${
        darkMode 
            ? "bg-black/20 border-white/5" 
            : "bg-white/60 border-gray-200"
    }`}>
        <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">{label}</p>
        <p className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>
            {value}
        </p>
    </div>
);

export default Profile;