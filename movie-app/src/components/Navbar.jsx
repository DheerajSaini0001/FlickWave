import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';
import { useWatchlist } from '../context/WatchlistContext';
import { useTheme } from '../context/ThemeContext';
import { motion } from "framer-motion";
import ThemeToggle from './ThemeToggle';
import { cn } from '../lib/utils';

const Navbar = () => {
    const { logout, isAuthenticated, user } = useAuth();
    const { watchlist } = useWatchlist();
    const { darkMode } = useTheme();
    const [query, setQuery] = useState('');
    const [scrolled, setScrolled] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 50);
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
        { name: 'TV Shows', path: '/tv-shows' },
        ...(isAuthenticated ? [
            { name: 'My List', path: '/watchlist' },
            { name: 'Profile', path: '/profile' }
        ] : [])
    ];

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.5 }}
            className={cn(
                "fixed w-full z-50 top-0 transition-all duration-500 border-b border-transparent",
                scrolled
                    ? " backdrop-blur-xl shadow-lg"
                    
                    : ""
            )}

        >
            <div className={` px-6 py-[10px] flex justify-between items-center  ${darkMode ? "bg-[#0f1014]/8" : "bg-white/80"}`}>
                <Link to="/" className="text-3xl font-extrabold tracking-tight relative z-50">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 drop-shadow-sm">
                        FlickWave
                    </span>
                </Link>

                {/* Desktop Search */}
                <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-12 max-w-xl relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <svg className="h-5 w-5 text-gray-400 group-focus-within:text-red-500 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className={`w-full pl-12 pr-4 py-2.5 rounded-full border border-transparent focus:border-red-500/50 focus:outline-none focus:ring-4 focus:ring-red-500/10 transition-all duration-300 placeholder-gray-500 ${darkMode ? "bg-white/5 text-white focus:bg-black/40" : "bg-gray-100/50 text-gray-900 focus:bg-white"}`}
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                {/* Desktop Menu */}
                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`relative font-medium hover:text-red-600 transition-colors flex items-center gap-1 ${darkMode ? "text-gray-300 hover:text-red-500" : "text-gray-700"}`}
                        >
                            {link.name}
                            {link.name === 'My List' && watchlist.length > 0 && (
                                <span className="bg-red-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                    {watchlist.length}
                                </span>
                            )}
                            {location.pathname === link.path && (
                                <motion.span
                                    layoutId="underline"
                                    className="absolute left-0 top-full block h-[2px] w-full bg-red-600"
                                />
                            )}
                        </Link>
                    ))}

                    <div className={`h-6 w-px mx-2 ${darkMode ? "bg-gray-700" : "bg-gray-300"}`}></div>

                    <ThemeToggle />

                    {isAuthenticated ? (
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={logout}
                            className={`px-5 py-2 rounded-full font-medium hover:bg-red-500 hover:text-white transition-all duration-300 ${darkMode ? "bg-red-500/10 text-red-400" : "bg-red-500/10 text-red-600"}`}
                        >
                            Logout
                        </motion.button>
                    ) : (
                        <Link to="/login">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-gradient-to-r from-red-600 to-orange-600 text-white px-6 py-2 rounded-full font-medium shadow-lg shadow-red-600/20"
                            >
                                Login
                            </motion.button>
                        </Link>
                    )}
                </div>

                {/* Mobile Menu Button */}
                <div className="md:hidden flex items-center gap-4">
                    <ThemeToggle />
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className={`focus:outline-none z-50 relative ${darkMode ? "text-white" : "text-gray-900"}`}
                    >
                        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className={`fixed inset-0 z-40 pt-24 px-6 md:hidden flex flex-col gap-6 ${darkMode ? "bg-[#0f1014]" : "bg-white"}`}
                >
                    <form onSubmit={handleSearch} className="relative">
                        <input
                            type="text"
                            placeholder="Search movies..."
                            className={`w-full pl-4 pr-4 py-3 rounded-xl border border-transparent focus:border-red-500 focus:outline-none ${darkMode ? "bg-white/5 text-white" : "bg-gray-100 text-gray-900"}`}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                    </form>

                    <div className="flex flex-col gap-4">
                        {navLinks.map((link) => (
                            <Link
                                key={link.path}
                                to={link.path}
                                onClick={() => setIsOpen(false)}
                                className={`text-xl font-medium py-2 border-b flex justify-between items-center ${darkMode ? "text-white border-white/5" : "text-gray-900 border-gray-100"}`}
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

                    {isAuthenticated ? (
                        <button
                            onClick={() => { logout(); setIsOpen(false); }}
                            className={`w-full py-3 rounded-xl font-bold mt-4 ${darkMode ? "bg-red-500/10 text-red-400" : "bg-red-500/10 text-red-600"}`}
                        >
                            Logout
                        </button>
                    ) : (
                        <Link to="/login" onClick={() => setIsOpen(false)}>
                            <button className="w-full bg-gradient-to-r from-red-600 to-orange-600 text-white py-3 rounded-xl font-bold mt-4">
                                Login
                            </button>
                        </Link>
                    )}
                </motion.div>
            )}
        </motion.nav>
    );
};

export default Navbar;
