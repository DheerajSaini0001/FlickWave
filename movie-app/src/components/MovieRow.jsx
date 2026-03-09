import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';

const MovieRow = ({ title, movies, viewAllPath }) => {
    const rowRef = useRef(null);
    const { darkMode } = useTheme();

    const scroll = (direction) => {
        const { current } = rowRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -800 : 800;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    // Staggered container + children animation
    const containerVariants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: 0.06,
            },
        },
    };

    const cardVariants = {
        hidden: { opacity: 0, y: 50, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: 'spring',
                stiffness: 100,
                damping: 15,
                mass: 0.8,
            },
        },
    };

    return (
        <div className="my-10 px-6 container mx-auto">
            {/* Section Header */}
            <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                viewport={{ once: true, margin: '-80px' }}
                className="flex items-center gap-4 mb-8"
            >
                <div className="w-1 h-8 rounded-full bg-gradient-to-b from-red-500 to-orange-500"></div>
                <h2 className={`text-2xl md:text-3xl font-bold tracking-tight ${darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                    {title}
                </h2>
                {viewAllPath && (
                    <Link
                        to={viewAllPath}
                        className={`ml-auto text-sm font-semibold flex items-center gap-1 group transition-colors duration-200 ${darkMode
                                ? 'text-gray-400 hover:text-red-400'
                                : 'text-gray-500 hover:text-red-600'
                            }`}
                    >
                        View All
                        <svg className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                    </Link>
                )}
            </motion.div>

            <div className="relative group">
                {/* Left scroll button */}
                <button
                    onClick={() => scroll('left')}
                    className={`absolute left-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1/2 backdrop-blur-md border hover:scale-110 ${darkMode
                            ? 'bg-[#12141a]/80 text-white border-white/10 hover:bg-red-600 hover:border-red-600'
                            : 'bg-white/90 text-gray-700 border-gray-200 shadow-xl hover:bg-red-600 hover:text-white hover:border-red-600'
                        }`}
                    aria-label="Scroll Left"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                </button>

                {/* Cards container */}
                <motion.div
                    ref={rowRef}
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: '-50px' }}
                    className="flex space-x-5 overflow-x-auto scrollbar-hide py-6 px-2 scroll-smooth snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie, index) => (
                        <motion.div
                            key={movie.id}
                            variants={cardVariants}
                            className="w-[160px] md:w-[220px] flex-shrink-0 snap-start"
                        >
                            <MovieCard movie={movie} index={index} />
                        </motion.div>
                    ))}
                </motion.div>

                {/* Right scroll button */}
                <button
                    onClick={() => scroll('right')}
                    className={`absolute right-0 top-1/2 -translate-y-1/2 z-20 p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1/2 backdrop-blur-md border hover:scale-110 ${darkMode
                            ? 'bg-[#12141a]/80 text-white border-white/10 hover:bg-red-600 hover:border-red-600'
                            : 'bg-white/90 text-gray-700 border-gray-200 shadow-xl hover:bg-red-600 hover:text-white hover:border-red-600'
                        }`}
                    aria-label="Scroll Right"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default MovieRow;