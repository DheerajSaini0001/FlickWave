import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
// 1. Import the theme hook
import { useTheme } from '../context/ThemeContext';

const MovieCard = ({ movie }) => {
    // 2. Access darkMode state
    const { darkMode } = useTheme();

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
                // 3. Conditional Background color for the card container
                className={`relative rounded-2xl overflow-hidden shadow-xl w-full max-w-[300px] transform-gpu transition-colors duration-300 ${darkMode ? "bg-[#1a1c24]" : "bg-white"
                    }`}
                whileHover={{
                    scale: 1.05,
                    y: -10,
                    rotateX: 5,
                    rotateY: 5,
                    // Keep the red glow in both modes for branding, or adjust opacity if needed
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

                    {/* Gradient Overlay - Logic:
                        Dark Mode: Dark gradient for mood.
                        Light Mode: Lighter or no top gradient to keep it crisp. 
                    */}
                    <div className={`absolute inset-0 bg-gradient-to-t transition-opacity duration-300 ${darkMode
                        ? "from-black via-black/40 to-transparent opacity-60 group-hover:opacity-80"
                        : "from-transparent via-transparent to-transparent opacity-0"
                        }`} />

                    {/* Hover Content - Play Icon */}


                    {/* Top Right Rating Badge - Logic:
                        Dark Mode: Dark glassmorphism.
                        Light Mode: White glassmorphism with dark text.
                    */}
                    <div className={`absolute top-3 right-3 backdrop-blur-md px-2 py-1 rounded-lg flex items-center gap-1 border transition-colors duration-300 ${darkMode
                        ? "bg-black/60 border-white/10"
                        : "bg-white/70 border-gray-200 text-gray-900"
                        }`}>
                        <span className="text-yellow-400 text-xs">★</span>
                        <span className={`text-xs font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
                            {voteAverage}
                        </span>
                    </div>
                </div>

                {/* Bottom Info Section (Glassmorphism) 
                   Logic: The gradient at the bottom needs to fade into the card's background color.
                */}
                <div className={`absolute bottom-0 left-0 right-0 p-1 md:p-4 pt-4 md:pt-12 bg-gradient-to-t transition-colors duration-300 ${darkMode
                    ? "from-[#1a1c24] via-[#1a1c24]/90 to-transparent"
                    : "from-white via-white/90 to-transparent"
                    }`}>
                    <h3 className={`text-[9px] md:text-lg font-bold leading-tight mb-0.5 md:mb-1 line-clamp-1 group-hover:text-red-500 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-900"
                        }`}>
                        {title}
                    </h3>
                    <div className={`flex justify-between items-center text-[7px] md:text-sm ${darkMode ? "text-gray-300" : "text-gray-600"
                        }`}>
                        <span>{releaseDate ? new Date(releaseDate).getFullYear() : 'N/A'}</span>
                        <span className={`text-[6px] md:text-xs px-1 md:px-2 py-0.5 rounded-full border ${darkMode
                            ? "border-white/20 bg-white/5"
                            : "border-gray-300 bg-gray-100"
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