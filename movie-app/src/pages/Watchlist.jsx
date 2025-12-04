import React, { useState } from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';
import { motion, AnimatePresence } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const Watchlist = () => {
    const { watchlist, removeFromWatchlist } = useWatchlist();
    const [modalOpen, setModalOpen] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const handleRemoveClick = (movie) => {
        setSelectedMovie(movie);
        setModalOpen(true);
    };

    const confirmRemove = () => {
        if (selectedMovie) {
            removeFromWatchlist(selectedMovie.id);
        }
    };

    return (
        <div className="container mx-auto px-6 py-8 pt-28 min-h-screen">
            <ConfirmModal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                onConfirm={confirmRemove}
                title="Remove from Watchlist"
                message={`Are you sure you want to remove "${selectedMovie?.title || selectedMovie?.name}" from your watchlist?`}
                confirmText="Remove"
                isDestructive={true}
            />

            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-4 mb-12"
            >
                <div className="w-1.5 h-10 bg-red-600 rounded-full"></div>
                <h2 className="text-4xl font-bold text-gray-900 dark:text-white">
                    My Watchlist
                </h2>
                <span className="bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-3 py-1 rounded-full text-sm font-medium">
                    {watchlist.length} Movies
                </span>
            </motion.div>

            {watchlist.length > 0 ? (
                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6"
                >
                    <AnimatePresence>
                        {watchlist.map((movie, index) => (
                            <motion.div
                                key={movie.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.9 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="relative group"
                            >
                                <MovieCard movie={movie} />
                                <button
                                    onClick={(e) => {
                                        e.preventDefault();
                                        handleRemoveClick(movie);
                                    }}
                                    className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700 z-20"
                                    title="Remove from Watchlist"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </button>
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
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Your watchlist is empty</h3>
                    <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                        Looks like you haven't added any movies yet. Browse the home page to find something interesting!
                    </p>
                </motion.div>
            )}
        </div>
    );
};

export default Watchlist;
