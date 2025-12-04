import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import Loader from '../components/Loader';
import MovieRow from '../components/MovieRow';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../auth/AuthProvider';
import { motion } from 'framer-motion';
import ConfirmModal from '../components/ConfirmModal';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });

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
    if (!movie) return <div className="text-center mt-20 text-xl dark:text-white">Movie not found</div>;

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
        <div className="pb-10 bg-gray-50 dark:bg-[#0f1014] min-h-screen transition-colors duration-300">
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
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/80 to-transparent"></div>
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/50 to-transparent"></div>
                </motion.div>

                <div className="absolute bottom-0 left-0 p-8 md:p-12 w-full container mx-auto flex flex-col md:flex-row items-end gap-8 z-10">
                    <motion.img
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="hidden md:block w-64 rounded-xl shadow-2xl border-4 border-white/10 backdrop-blur-sm"
                    />
                    <div className="text-white pb-4 flex-1">
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
                            className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-6"
                        >
                            <span className="border border-white/20 px-2 py-0.5 rounded backdrop-blur-sm">
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
                                <span key={g.id} className="bg-white/10 backdrop-blur-md px-4 py-1.5 rounded-full text-sm font-medium border border-white/10 hover:bg-white/20 transition-colors cursor-default">
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                                <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                Overview
                            </h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                {movie.overview}
                            </p>
                        </motion.section>

                        {trailer && (
                            <motion.section
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                            >
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
                                    <span className="w-1 h-6 bg-red-600 rounded-full"></span>
                                    Official Trailer
                                </h2>
                                <div className="aspect-video rounded-2xl overflow-hidden shadow-2xl border border-gray-200 dark:border-gray-800">
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
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
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
                                        <div className="rounded-xl overflow-hidden shadow-lg mb-3 h-48 bg-gray-200 dark:bg-gray-800">
                                            <img
                                                src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                                alt={actor.name}
                                                className="w-full h-full object-cover hover:scale-110 transition-transform duration-500"
                                                loading="lazy"
                                            />
                                        </div>
                                        <p className="font-bold text-gray-900 dark:text-white text-sm truncate">{actor.name}</p>
                                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{actor.character}</p>
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
                            className="bg-white dark:bg-[#1a1c24] p-6 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-800"
                        >
                            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Movie Info</h3>
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
                                    <p className="font-medium text-gray-900 dark:text-white">{movie.status}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Original Language</p>
                                    <p className="font-medium text-gray-900 dark:text-white uppercase">{movie.original_language}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Budget</p>
                                    <p className="font-medium text-gray-900 dark:text-white">${movie.budget.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">Revenue</p>
                                    <p className="font-medium text-gray-900 dark:text-white">${movie.revenue.toLocaleString()}</p>
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
