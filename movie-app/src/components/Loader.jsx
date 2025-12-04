import { motion } from "framer-motion";
import { useTheme } from '../context/ThemeContext';

const Loader = () => {
    const { darkMode } = useTheme();

    return (
        <div 
            className={`flex justify-center items-center h-screen transition-colors duration-300 ${
                darkMode ? 'bg-[#0f1014]' : 'bg-gray-50'
            }`}
        >
            <div className="relative w-24 h-24">
                <motion.div
                    className="absolute inset-0 border-4 border-t-red-600 border-r-transparent border-b-transparent border-l-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-2 border-4 border-t-transparent border-r-orange-500 border-b-transparent border-l-transparent rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />
                <motion.div
                    className="absolute inset-4 border-4 border-t-transparent border-r-transparent border-b-yellow-500 border-l-transparent rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600">
                        FW
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Loader;