import { useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function ThemeToggle() {
    const [theme, setTheme] = useState(
        localStorage.getItem("theme") || "dark"
    );

    useEffect(() => {
        if (theme === "dark") {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.remove("dark");
        }
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

    return (
        <button
            onClick={toggleTheme}
            className={`relative w-14 h-7 rounded-full p-1 transition-colors duration-500 focus:outline-none ${theme === "dark" ? "bg-gray-800 border border-gray-700" : "bg-gray-200 border border-gray-300"
                }`}
            aria-label="Toggle Theme"
        >
            <motion.div
                className="w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center text-xs"
                layout
                transition={{ type: "spring", stiffness: 700, damping: 30 }}
                style={{
                    marginLeft: theme === "dark" ? "auto" : "0",
                    marginRight: theme === "dark" ? "0" : "auto",
                }}
            >
                {theme === "dark" ? "🌙" : "☀️"}
            </motion.div>
        </button>
    );
}
