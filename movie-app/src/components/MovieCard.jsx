import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const MovieCard = ({ movie, index = 0 }) => {
    const { darkMode } = useTheme();

    const posterUrl = movie.poster_path
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image';

    const title = movie.title || movie.name;
    const releaseDate = movie.release_date || movie.first_air_date;
    const linkPath = movie.first_air_date ? `/tv/${movie.id}` : `/movie/${movie.id}`;
    const voteAverage = movie.vote_average ? movie.vote_average.toFixed(1) : '0.0';
    const rating = parseFloat(voteAverage);

    // Dynamic rating colour
    const ratingColor = rating >= 7.5
        ? 'text-emerald-400'
        : rating >= 5.0
            ? 'text-amber-400'
            : 'text-red-400';

    return (
        <Link to={linkPath} className="block h-full relative group perspective-1000">
            <motion.div
                className={`relative rounded-2xl overflow-hidden w-full max-w-[300px] transform-gpu transition-all duration-500 ${darkMode
                        ? "bg-[#12141a] ring-1 ring-white/5 shadow-lg shadow-black/40"
                        : "bg-white ring-1 ring-gray-200/80 shadow-lg shadow-gray-300/30"
                    }`}
                whileHover={{
                    scale: 1.04,
                    y: -8,
                    transition: { type: "spring", stiffness: 400, damping: 15 }
                }}
            >
                {/* Image Container */}
                <div className="aspect-[2/3] overflow-hidden relative">
                    <motion.img
                        src={posterUrl}
                        alt={title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                    />

                    {/* Gradient Overlay */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${darkMode
                            ? "from-[#12141a] via-[#12141a]/30 to-transparent opacity-70 group-hover:opacity-90"
                            : "from-white via-white/20 to-transparent opacity-50 group-hover:opacity-70"
                        }`} />

                    {/* Play icon on hover */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 z-10">
                        <motion.div
                            initial={{ scale: 0.5 }}
                            whileHover={{ scale: 1.1 }}
                            className={`w-14 h-14 rounded-full flex items-center justify-center backdrop-blur-md border ${darkMode
                                    ? "bg-white/15 border-white/20"
                                    : "bg-black/10 border-black/10"
                                }`}
                        >
                            <svg className={`w-6 h-6 ml-1 ${darkMode ? "text-white" : "text-gray-800"}`} fill="currentColor" viewBox="0 0 24 24">
                                <path d="M8 5v14l11-7z" />
                            </svg>
                        </motion.div>
                    </div>

                    {/* Rating Badge */}
                    <div className={`absolute top-3 right-3 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1.5 border transition-colors duration-300 ${darkMode
                            ? "bg-black/60 border-white/10"
                            : "bg-white/80 border-gray-200/80 shadow-sm"
                        }`}>
                        <span className={`text-xs font-bold ${ratingColor}`}>★</span>
                        <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {voteAverage}
                        </span>
                    </div>
                </div>

                {/* Bottom Info Section */}
                <div className={`absolute bottom-0 left-0 right-0 p-2 md:p-4 pt-6 md:pt-14 bg-gradient-to-t transition-colors duration-300 ${darkMode
                        ? "from-[#12141a] via-[#12141a]/95 to-transparent"
                        : "from-white via-white/95 to-transparent"
                    }`}>
                    <h3 className={`text-[10px] md:text-base font-bold leading-tight mb-0.5 md:mb-1.5 line-clamp-1 transition-colors duration-300 ${darkMode
                            ? "text-white group-hover:text-red-400"
                            : "text-gray-900 group-hover:text-red-600"
                        }`}>
                        {title}
                    </h3>
                    <div className={`flex justify-between items-center text-[8px] md:text-sm ${darkMode ? "text-gray-400" : "text-gray-500"
                        }`}>
                        <span className="font-medium">{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                        <span className={`text-[7px] md:text-xs px-1.5 md:px-2.5 py-0.5 rounded-full font-medium ${darkMode
                                ? "bg-white/8 text-gray-300 ring-1 ring-white/10"
                                : "bg-gray-100 text-gray-600 ring-1 ring-gray-200"
                            }`}>
                            {movie.first_air_date ? 'TV' : 'Movie'}
                        </span>
                    </div>
                </div>
            </motion.div>
        </Link>
    );
};

export default MovieCard;