import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext'; // Import the theme hook

const MovieRow = ({ title, movies, viewAllPath }) => {
    const rowRef = useRef(null);
    const { darkMode } = useTheme(); // Access dark mode state

    const scroll = (direction) => {
        const { current } = rowRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="my-12 px-6 container mx-auto">
            <motion.h2
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
                // Dynamic text color based on darkMode
                className={`text-2xl md:text-3xl font-bold mb-6 border-l-4 border-red-600 pl-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}
            >
                {title}
                {viewAllPath && (
                    <Link
                        to={viewAllPath}
                        // Dynamic link color
                        className={`text-sm font-normal ml-auto cursor-pointer hover:text-red-500 transition-colors ${darkMode ? 'text-gray-400' : 'text-gray-600'
                            }`}
                    >
                        View All &rarr;
                    </Link>
                )}
            </motion.h2>

            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    // Dynamic button background and border
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1/2 backdrop-blur-sm border hover:bg-red-600 hover:text-white hover:border-red-600 ${darkMode
                        ? 'bg-black/50 text-white border-white/10'
                        : 'bg-white/80 text-gray-900 border-gray-200 shadow-lg'
                        }`}
                    aria-label="Scroll Left"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-6 overflow-x-auto scrollbar-hide py-8 px-2 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            className="min-w-[80px] md:min-w-[180px] flex-shrink-0 snap-start"
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5, delay: index * 0.05 }}
                            viewport={{ once: true }}
                        >
                            <MovieCard movie={movie} />
                        </motion.div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    // Dynamic button background and border
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1/2 backdrop-blur-sm border hover:bg-red-600 hover:text-white hover:border-red-600 ${darkMode
                        ? 'bg-black/50 text-white border-white/10'
                        : 'bg-white/80 text-gray-900 border-gray-200 shadow-lg'
                        }`}
                    aria-label="Scroll Right"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default MovieRow;