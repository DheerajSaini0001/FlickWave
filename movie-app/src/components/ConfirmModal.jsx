import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDestructive = false }) => {
    const { darkMode } = useTheme();

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    // Backdrop: Darker in dark mode, lighter/transparent in light mode
                    className={`absolute inset-0 backdrop-blur-sm ${
                        darkMode ? "bg-black/60" : "bg-black/20"
                    }`}
                />
                <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 20 }}
                    // Container: Switch background, border, and shadow
                    className={`relative rounded-2xl p-6 w-full max-w-sm shadow-2xl overflow-hidden border ${
                        darkMode 
                            ? "bg-[#1a1c24] border-white/10" 
                            : "bg-white border-gray-100"
                    }`}
                >
                    {/* Glow Effect */}
                    <div className={`absolute top-0 left-0 w-full h-1 ${isDestructive ? 'bg-red-600' : 'bg-green-600'}`} />

                    {/* Title */}
                    <h3 className={`text-xl font-bold mb-2 ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}>
                        {title}
                    </h3>
                    
                    {/* Message */}
                    <p className={`mb-6 ${
                        darkMode ? "text-gray-400" : "text-gray-600"
                    }`}>
                        {message}
                    </p>

                    <div className="flex gap-3 justify-end">
                        <button
                            onClick={onClose}
                            // Cancel Button: Adapt hover and text colors
                            className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                                darkMode 
                                    ? "text-gray-300 hover:text-white hover:bg-white/5" 
                                    : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                            }`}
                        >
                            {cancelText}
                        </button>
                        <button
                            onClick={() => {
                                onConfirm();
                                onClose();
                            }}
                            className={`px-4 py-2 rounded-lg text-white font-bold shadow-lg transition-all transform active:scale-95 ${isDestructive
                                    ? 'bg-red-600 hover:bg-red-700 shadow-red-600/20'
                                    : 'bg-green-600 hover:bg-green-700 shadow-green-600/20'
                                }`}
                        >
                            {confirmText}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};

export default ConfirmModal;