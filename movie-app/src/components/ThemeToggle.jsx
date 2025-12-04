import { useEffect, useState } from "react";

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

    return (
        <button
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            className="p-2 rounded-full bg-gray-300 dark:bg-gray-700 transition hover:bg-gray-400 dark:hover:bg-gray-600"
            aria-label="Toggle Theme"
        >
            {theme === "dark" ? "🌙" : "☀️"}
        </button>
    );
}
