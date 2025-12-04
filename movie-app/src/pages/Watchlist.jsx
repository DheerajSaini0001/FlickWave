import React from 'react';
import { useWatchlist } from '../context/WatchlistContext';
import MovieCard from '../components/MovieCard';

const Watchlist = () => {
    const { watchlist } = useWatchlist();

    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                My Watchlist
            </h2>
            {watchlist.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {watchlist.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-400 text-xl">Your watchlist is empty.</p>
                    <p className="text-gray-500 dark:text-gray-500 mt-2">Start adding movies to watch later!</p>
                </div>
            )}
        </div>
    );
};

export default Watchlist;
