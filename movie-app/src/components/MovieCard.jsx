import React from 'react';
import { Link } from 'react-router-dom';

const MovieCard = ({ movie }) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    return (
        <Link to={`/movie/${movie.id}`} className="block transform transition duration-300 hover:scale-105">
            <div className="bg-white dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg h-full border border-gray-200 dark:border-gray-700">
                <div className="aspect-[2/3] overflow-hidden">
                    <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate" title={movie.title}>{movie.title}</h3>
                    <div className="flex justify-between items-center mt-2">
                        <span className="text-sm text-gray-600 dark:text-gray-400">{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                        <span className="text-sm font-bold text-yellow-500 flex items-center gap-1">
                            <span>★</span> {movie.vote_average ? movie.vote_average.toFixed(1) : '0.0'}
                        </span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default MovieCard;
