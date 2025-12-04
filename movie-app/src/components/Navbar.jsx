import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";
import ThemeToggle from './ThemeToggle';
import { cn } from '../lib/utils';

const Navbar = () => {
    const { logout, isAuthenticated } = useAuth();
    const { watchlist } = useWatchlist();
    const { darkMode } = useTheme();
    const [query, setQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?query=${query}`);
            setQuery('');
            setIsOpen(false);
        }
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Movies', path: '/movies' },
  
        ...(isAuthenticated ? [
            { name: 'My List', path: '/watchlist' },
            { name: 'Profile', path: '/profile' }
        ] : [])
    ];

    // Dynamic classes based on Scroll and Theme
    const navBackgroundClass = scrolled
        ? darkMode
            ? "bg-[#0f1014]/90 backdrop-blur-md shadow-lg border-b border-white/5"
            : "bg-white/90 backdrop-blur-md shadow-sm border-b border-gray-200"
        : "bg-transparent border-b border-transparent";

    const navPaddingClass = scrolled ? "py-3" : "py-5";

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed w-full z-50 top-0 transition-all duration-300 ease-in-out",
                navBackgroundClass,
                navPaddingClass
            )}
        >
            <div className="container mx-auto px-6 flex justify-between items-center">
                {/* Logo */}
                <Link to="/" className="text-3xl font-extrabold tracking-tight relative z-50 flex items-center gap-2">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-500 drop-shadow-sm">
                        FlickWave
                    </span>
                </Link>

                {/* Desktop Search */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-12 max-w-xl relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 transition-colors duration-300 ${darkMode ? "text-gray-400" : "text-slate-400 group-focus-within:text-red-500"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search movies & shows..."
                        className={`w-full pl-12 pr-4 py-2.5 rounded-full text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500/50 ${
                            darkMode 
                                ? "bg-white/10 text-white placeholder-gray-400 border border-transparent focus:bg-black/40 focus:ring-offset-[#0f1014]" 
                                : "bg-slate-100 text-slate-900 placeholder-slate-500 border border-slate-200 focus:bg-white focus:ring-offset-white focus:border-red-200"
                        }`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative font-semibold text-sm transition-colors duration-200 flex items-center gap-1 group ${
                                darkMode 
                                    ? "text-gray-300 hover:text-white" 
                                    : "text-slate-600 hover:text-red-600"
                            }`}
                        >
                            {link.name}
                            {link.name === 'My List' && watchlist.length > 0 && (
                                <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ml-1 ${
                                    darkMode ? "bg-red-600 text-white" : "bg-red-100 text-red-600 group-hover:bg-red-600 group-hover:text-white transition-colors"
                                }`}>
                                    {watchlist.length}
                                </span>
                            )}
                            {location.pathname === link.path && (
                                <motion.span
                                    layoutId="underline"
                                    className="absolute -bottom-1 left-0 block h-[2px] w-full bg-red-600 rounded-full"
                                />
                            )}
                        </Link>
                    ))}

                    <div className={`h-6 w-px ${darkMode ? "bg-gray-700" : "bg-slate-200"}`}></div>

                    <div className="flex items-center gap-4">
                        <ThemeToggle />

                        {isAuthenticated ? (
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={logout}
                                className={`px-5 py-2 rounded-full text-sm font-bold border transition-all duration-300 ${
                                    darkMode 
                                        ? "border-red-500/30 text-red-400 hover:bg-red-500/10" 
                                        : "border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
                                }`}
                            >
                                Logout
                            </motion.button>
                        ) : (
                            <Link to="/login">
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full text-sm font-bold shadow-lg shadow-red-500/20 hover:shadow-red-500/40 transition-all"
                                >
                                    Login
                                </motion.button>
                            </Link>
                        )}
                    </div>
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`focus:outline-none p-2 rounded-lg transition-colors ${
                            darkMode ? "text-gray-200 hover:bg-white/10" : "text-slate-800 hover:bg-slate-100"
                        }`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {isOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <motion.div
                initial={false}
                animate={isOpen ? { opacity: 1, pointerEvents: "auto" } : { opacity: 0, pointerEvents: "none" }}
                transition={{ duration: 0.2 }}
                className={`fixed inset-0 z-40 pt-24 px-6 md:hidden flex flex-col gap-6 backdrop-blur-xl ${
                    darkMode ? "bg-[#0f1014]/95" : "bg-white/95 supports-[backdrop-filter]:bg-white/80"
                }`}
            >
                <form onSubmit={handleSearch} className="relative">
                    <input
                        type="text"
                        placeholder="Search..."
                        className={`w-full pl-4 pr-10 py-3 rounded-xl border focus:outline-none transition-colors ${
                            darkMode 
                                ? "bg-white/5 border-white/10 text-white focus:border-red-500" 
                                : "bg-slate-100 border-slate-200 text-slate-900 focus:border-red-500 focus:bg-white"
                        }`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </button>
                </form>

                <div className="flex flex-col gap-2">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            onClick={() => setIsOpen(false)}
                            className={`text-lg font-medium py-3 px-4 rounded-xl flex justify-between items-center transition-colors ${
                                darkMode 
                                    ? "text-gray-200 hover:bg-white/5" 
                                    : "text-slate-800 hover:bg-slate-100"
                            }`}
                        >
                            {link.name}
                            {link.name === 'My List' && watchlist.length > 0 && (
                                <span className="bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                                    {watchlist.length}
                                </span>
                            )}
                        </Link>
                    ))}
                </div>

                <div className="mt-auto mb-8">
                    {isAuthenticated ? (
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className={`w-full py-3.5 rounded-xl font-bold border transition-colors ${
                                darkMode 
                                    ? "border-red-500/30 text-red-400 bg-red-500/5" 
                                    : "border-red-200 text-red-600 bg-red-50"
                            }`}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3.5 rounded-xl font-bold shadow-lg shadow-red-500/20">
                                Login
                            </button>
                        </Link>
                    )}
                </div>
            </motion.div>
        </motion.nav>
    );
};

export default Navbar;