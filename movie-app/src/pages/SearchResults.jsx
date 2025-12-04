import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

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
        <div className="container mx-auto px-6 py-8 pt-28 min-h-screen">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-12"
            >
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    Search Results
                </h2>
                <p className="text-gray-600 dark:text-gray-400 text-lg">
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
                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-6">
                        <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No movies found</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        We couldn't find any movies matching "{query}". Try checking for typos or using different keywords.
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default SearchResults;
