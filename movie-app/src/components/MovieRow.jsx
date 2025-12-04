import React, { useRef } from 'react';
import MovieCard from './MovieCard';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const MovieRow = ({ title, movies, viewAllPath }) => {
    const rowRef = useRef(null);

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
                className="text-2xl md:text-3xl font-bold text-white mb-6 border-l-4 border-red-600 pl-4 flex items-center gap-2"
            >
                {title}
                {viewAllPath && (
                    <Link to={viewAllPath} className="text-sm font-normal text-gray-500 ml-auto cursor-pointer hover:text-red-500 transition-colors">
                        View All &rarr;
                    </Link>
                )}
            </motion.h2>

            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1/2 backdrop-blur-sm border border-white/10"
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
                            className="min-w-[140px] md:min-w-[180px] flex-shrink-0 snap-start"
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
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-20 bg-black/50 hover:bg-red-600 text-white p-4 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1/2 backdrop-blur-sm border border-white/10"
                    aria-label="Scroll Right"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                </button>
            </div>
        </div>
    );
};

export default MovieRow;
