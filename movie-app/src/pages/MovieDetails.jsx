import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import Loader from '../components/Loader';
import MovieRow from '../components/MovieRow';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';
import { useTheme } from '../context/ThemeContext';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });
    const { darkMode } = useTheme();

    useEffect(() => {
        const fetchMovie = async () => {
            setLoading(true);
            try {
                const res = await getMovieDetails(id);
                setMovie(res.data);
            } catch (error) {
                console.error("Error fetching movie details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovie();
        window.scrollTo(0, 0);
    }, [id]);

    if (loading) return <Loader />;
    if (!movie) return <div className={`text-center mt-20 text-xl ${darkMode ? 'text-white' : 'text-gray-900'}`}>Movie not found</div>;

    const trailer = movie.videos.results.find(vid => vid.type === 'Trailer' && vid.site === 'YouTube');
    const cast = movie.credits.cast.slice(0, 10);
    const recommendations = movie.recommendations.results;
    const inWatchlist = isInWatchlist(movie.id);

    const handleWatchlistClick = () => {
        if (!isAuthenticated) {
            navigate('/login');
            return;
        }
        if (inWatchlist) {
            setModalConfig({ isOpen: true, type: 'remove' });
        } else {
            setModalConfig({ isOpen: true, type: 'add' });
        }
    };

    const confirmAction = () => {
        if (modalConfig.type === 'remove') {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    return (
        <div className={`pb-10 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0f1014]' : 'bg-gray-50'}`}>
            <ConfirmModal
                isOpen={modalConfig.isOpen}
                onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                onConfirm={confirmAction}
                title={modalConfig.type === 'remove' ? "Remove from Watchlist" : "Add to Watchlist"}
                message={`Are you sure you want to ${modalConfig.type === 'remove' ? 'remove' : 'add'} "${movie.title}" ${modalConfig.type === 'remove' ? 'from' : 'to'} your watchlist?`}
                confirmText={modalConfig.type === 'remove' ? "Remove" : "Add"}
                isDestructive={modalConfig.type === 'remove'}
            />
            {/* Cinematic Backdrop */}
            <div className="relative h-[70vh] w-full overflow-hidden">
                <motion.div
                    initial={{ scale: 1.1 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 10, ease: "linear" }}
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
                >
                     {/* Vertical Gradient - matches theme background */}
                    <div className={`absolute inset-0 bg-gradient-to-t via-transparent to-transparent ${
                        darkMode ? 'from-[#0f1014] via-[#0f1014]/80' : 'from-gray-50 via-gray-50/80'
                    }`} />
                    
                    {/* Horizontal Gradient - matches theme background */}
                    <div className={`absolute inset-0 bg-gradient-to-r to-transparent ${
                        darkMode ? "from-[#0f1014] via-[#0f1014]/60" 
      : "from-gray-50 via-gray-50/80"
                    }`} />
                </motion.div>

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full container mx-auto flex flex-col md:flex-row items-end gap-8 z-10">
                    <motion.img
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className={`hidden md:block w-64 rounded-xl shadow-2xl border-4 backdrop-blur-sm ${
                            darkMode ? 'border-white/10' : 'border-white/20'
                        }`}
                    />
                    <div className={`pb-4 flex-1 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                        <motion.h1
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                            className="text-4xl md:text-6xl font-bold mb-4 drop-shadow-2xl leading-tight"
                        >
                            {movie.title}
                        </motion.h1>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className={`flex flex-wrap items-center gap-4 text-sm md:text-base mb-6 ${
                                darkMode ? 'text-gray-300' : 'text-gray-600'
                            }`}
                        >
                            <span className={`px-2 py-0.5 rounded backdrop-blur-sm border ${
                                darkMode ? 'border-white/20' : 'border-gray-900/20'
                            }`}>
                                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}
                            </span>
                            <span>•</span>
                            <span>{movie.runtime} min</span>
                            <span>•</span>
                            <span className="flex items-center text-yellow-400 font-bold gap-1 bg-yellow-400/10 px-2 py-0.5 rounded">
                                ★ {movie.vote_average.toFixed(1)}
                            </span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                            className="flex flex-wrap gap-2 mb-8"
                        >
                            {movie.genres.map(g => (
                                <span key={g.id} className={`backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border transition-colors cursor-default ${
                                    darkMode 
                                        ? 'bg-white/10 border-white/10 hover:bg-white/20 text-white' 
                                        : 'bg-black/5 border-black/10 hover:bg-black/10 text-gray-900'
                                }`}>
                                    {g.name}
                                </span>
                            ))}
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                            className="flex gap-4"
                        >
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleWatchlistClick}
                                className={`px-8 py-3.5 rounded-full font-bold transition-all flex items-center gap-2 shadow-lg ${inWatchlist
                                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-green-600/30'
                                    : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/30'
                                    }`}
                            >
                                {inWatchlist ? (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        In Watchlist
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add to Watchlist
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2 space-y-12">
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className={`text-2xl font-bold mb-4 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                Overview
                            </h2>
                            <p className={`leading-relaxed text-lg ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                {movie.overview}
                            </p>
                        </motion.section>

                        {trailer && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                    Official Trailer
                                </h2>
                                <div className={`aspect-video rounded-2xl overflow-hidden shadow-2xl border ${darkMode ? 'border-gray-800' : 'border-gray-200'}`}>
                                    <iframe
                                        className="w-full h-full"
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="YouTube video player"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </motion.section>
                        )}

                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                        >
                            <h2 className={`text-2xl font-bold mb-6 flex items-center gap-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                Top Cast
                            </h2>
                            <div className="flex overflow-x-auto pb-6 gap-4 scrollbar-hide snap-x">
                                {cast.map((actor, index) => (
                                    <motion.div
                                        key={actor.id}
                                        className="min-w-[140px] w-[140px] snap-start"
                                        initial={{ opacity: 0, x: 20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        transition={{ delay: index * 0.05 }}
                                        viewport={{ once: true }}
                                    >
                                        <div className={`rounded-xl overflow-hidden shadow-lg mb-3 h-48 ${darkMode ? 'bg-gray-800' : 'bg-gray-200'}`}>
                                            <img
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                                alt={actor.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className={`font-bold text-sm truncate ${darkMode ? 'text-white' : 'text-gray-900'}`}>{actor.name}</p>
                                        <p className={`text-xs truncate ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>{actor.character}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </motion.section>
                    </div>

                    <div className="lg:col-span-1 space-y-8">
                        {/* Additional details or sidebar content could go here */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className={`p-6 rounded-2xl shadow-lg border ${
                                darkMode 
                                    ? 'bg-[#1a1c24] border-gray-800' 
                                    : 'bg-white border-gray-100'
                            }`}
                        >
                            <h3 className={`text-xl font-bold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>Movie Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Status</p>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>{movie.status}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Original Language</p>
                                    <p className={`font-medium uppercase ${darkMode ? 'text-white' : 'text-gray-900'}`}>{movie.original_language}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Budget</p>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>${movie.budget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>Revenue</p>
                                    <p className={`font-medium ${darkMode ? 'text-white' : 'text-gray-900'}`}>${movie.revenue.toLocaleString()}</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <div className="mt-16">
                        <MovieRow title="Recommended Movies" movies={recommendations} />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MovieDetails;