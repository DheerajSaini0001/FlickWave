import React from 'react';
import { useAuth } from '../auth/AuthProvider';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const Profile = () => {
    const { user, isAuthenticated, loading } = useAuth();

    if (loading) {
        return <Loader />;
    }

    return (
        isAuthenticated && (
            <div className="container mx-auto px-4 py-8 pt-32 min-h-screen flex justify-center items-start">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="relative bg-white/50 dark:bg-[#1a1c24]/50 backdrop-blur-xl p-10 rounded-3xl shadow-2xl max-w-2xl w-full text-center border border-white/20 overflow-hidden"
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
                            <img
                                src={user.picture}
                                alt={user.name}
                                className="relative w-40 h-40 rounded-full border-4 border-white dark:border-[#1a1c24] shadow-xl object-cover"
                            />
                        </motion.div>

                        <motion.h2
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl font-bold text-gray-900 dark:text-white mb-2"
                        >
                            {user.name}
                        </motion.h2>

                        <motion.p
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="text-lg text-gray-600 dark:text-gray-400 mb-8"
                        >
                            {user.email}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                            className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left mb-8"
                        >
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Nickname</p>
                                <p className="font-medium text-gray-900 dark:text-white">{user.nickname || 'Not set'}</p>
                            </div>
                            <div className="bg-white/50 dark:bg-black/20 p-4 rounded-xl border border-gray-200 dark:border-white/5">
                                <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Last Updated</p>
                                <p className="font-medium text-gray-900 dark:text-white">
                                    {user.lastUpdated ? new Date(user.lastUpdated).toLocaleString() : 'N/A'}
                                </p>
                            </div>
                        </motion.div>

                      
                    </div>
                </motion.div>
            </div>
        )
    );
};

export default Profile;
