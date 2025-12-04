import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const { darkMode } = useTheme();

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await searchMovies(query);
                setMovies(res.data.results);
            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchMovies();
        }
    }, [query]);

    if (loading) return <Loader />;

    return (
        <div className={`min-h-screen pt-28 transition-colors duration-300 ${
            darkMode ? 'bg-[#0f1014]' : 'bg-gray-50'
        }`}>
            <div className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <h2 className={`text-3xl md:text-4xl font-bold mb-2 ${
                        darkMode ? 'text-white' : 'text-gray-900'
                    }`}>
                        Search Results
                    </h2>
                    <p className={`text-lg ${
                        darkMode ? 'text-gray-400' : 'text-gray-600'
                    }`}>
                        Found {movies.length} results for <span className="text-red-600 font-semibold">"{query}"</span>
                    </p>
                </motion.div>

                {movies.length > 0 ? (
                    <motion.div
                        layout
                        className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6"
                    >
                        <AnimatePresence>
                            {movies.map((movie, index) => (
                                <motion.div
                                    key={movie.id}
                                    layout
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ duration: 0.3, delay: index * 0.05 }}
                                >
                                    <MovieCard movie={movie} />
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </motion.div>
                ) : (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex flex-col items-center justify-center py-32 text-center"
                    >
                        <div className={`w-24 h-24 rounded-full flex items-center justify-center mb-6 ${
                            darkMode ? 'bg-gray-800' : 'bg-gray-100'
                        }`}>
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <h3 className={`text-2xl font-bold mb-2 ${
                            darkMode ? 'text-white' : 'text-gray-900'
                        }`}>No movies found</h3>
                        <p className={`max-w-md mx-auto ${
                            darkMode ? 'text-gray-400' : 'text-gray-500'
                        }`}>
                            We couldn't find any movies matching "{query}". Try checking for typos or using different keywords.
                        </p>
                    </motion.div>
                )}
            </div>
        </div>
    );
};

export default SearchResults;