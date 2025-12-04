import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const MovieCard = ({ movie }) => {
    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const linkPath = movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`;
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';

    return (
        <Link to={linkPath} className="block h-full relative group perspective-1000">
            <motion.div
                className="relative rounded-2xl overflow-hidden bg-[#1a1c24] shadow-xl h-full transform-gpu"
                whileHover={{
                    scale: 1.05,
                    y: -10,
                    rotateX: 5,
                    rotateY: 5,
                    boxShadow: "0 25px 50px -12px rgba(220, 38, 38, 0.5)"
                }}
                transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
                {/* Image Container */}
                <div className="aspect-[2/3] overflow-hidden relative">
                    <motion.img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.15 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Hover Content - Play Icon */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 scale-50 group-hover:scale-100">
                        <div className="w-14 h-14 bg-red-600/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(220,38,38,0.6)]">
                            <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </div>
                    </div>

                    {/* Top Right Rating Badge */}
                    <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1">
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className="text-white text-xs font-bold">{voteAverage}</span>
                    </div>
                </div>

                {/* Bottom Info Section (Glassmorphism) */}
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-12">
                    <h3 className="text-lg font-bold text-white leading-tight mb-1 line-clamp-1 group-hover:text-red-500 transition-colors duration-300">
                        {title}
                    </h3>
                    <div className="flex justify-between items-center text-sm text-gray-300">
                        <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                        <span className="text-xs border border-white/20 px-2 py-0.5 rounded-full bg-white/5">
                            {movie.first_air_date ? 'TV' : 'Movie'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;
