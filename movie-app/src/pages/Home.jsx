import React, { useEffect, useState } from 'react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../api/tmdb';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth } from '../auth/AuthProvider';
import ConfirmModal from '../components/ConfirmModal';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [modalConfig, setModalConfig] = useState({ isOpen: false, type: null });

    const { scrollY } = useScroll();
    const y = useTransform(scrollY, [0, 500], [0, 200]);
    const opacity = useTransform(scrollY, [0, 500], [1, 0]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
                    getTrendingMovies(),
                    getPopularMovies(),
                    getTopRatedMovies(),
                    getUpcomingMovies()
                ]);

                setTrending(trendingRes.data.results);
                setPopular(popularRes.data.results);
                setTopRated(topRatedRes.data.results);
                setUpcoming(upcomingRes.data.results);
            } catch (error) {
                console.error("Error fetching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    if (loading) return <Loader />;

    const heroMovie = trending[0];
    const inWatchlist = heroMovie ? isInWatchlist(heroMovie.id) : false;

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
            removeFromWatchlist(heroMovie.id);
        } else {
            addToWatchlist(heroMovie);
        }
        setModalConfig({ ...modalConfig, isOpen: false });
    };

    return (
        <div className="pb-10">
            {heroMovie && (
                <ConfirmModal
                    isOpen={modalConfig.isOpen}
                    onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
                    onConfirm={confirmAction}
                    title={modalConfig.type === 'remove' ? "Remove from Watchlist" : "Add to Watchlist"}
                    message={`Are you sure you want to ${modalConfig.type === 'remove' ? 'remove' : 'add'} "${heroMovie.title}" ${modalConfig.type === 'remove' ? 'from' : 'to'} your watchlist?`}
                    confirmText={modalConfig.type === 'remove' ? "Remove" : "Add"}
                    isDestructive={modalConfig.type === 'remove'}
                />
            )}
            {/* Hero Section */}
            {heroMovie && (
                <div className="relative h-[95vh] w-full overflow-hidden">
                    {/* Parallax Background */}
                    <motion.div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})`,
                            y,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0f1014] via-[#0f1014]/40 to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-[#0f1014] via-[#0f1014]/60 to-transparent" />
                    </motion.div>

                    <motion.div
                        className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 lg:w-1/2 z-20 flex flex-col justify-end h-full pb-32"
                        style={{ opacity }}
                    >
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2, duration: 0.8 }}
                            className="flex items-center gap-3 mb-4"
                        >
                            <span className="bg-red-600 text-white text-xs font-bold px-3 py-1 rounded uppercase tracking-widest shadow-lg shadow-red-600/20">
                                Trending #1
                            </span>
                            <span className="text-gray-300 text-sm font-medium border border-white/20 px-2 py-1 rounded backdrop-blur-sm">
                                {heroMovie.release_date ? new Date(heroMovie.release_date).getFullYear() : 'N/A'}
                            </span>
                            <span className="text-yellow-400 text-sm font-bold flex items-center gap-1">
                                ★ {heroMovie.vote_average.toFixed(1)}
                            </span>
                        </motion.div>

                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4, duration: 0.8 }}
                            className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 leading-tight drop-shadow-2xl tracking-tight"
                        >
                            {heroMovie.title}
                        </motion.h1>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6, duration: 0.8 }}
                            className="text-lg md:text-xl text-gray-300 mb-10 line-clamp-3 leading-relaxed max-w-2xl drop-shadow-md"
                        >
                            {heroMovie.overview}
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.8, duration: 0.8 }}
                            className="flex flex-wrap gap-4"
                        >
                            <Link to={`/movie/${heroMovie.id}`}>
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    className="bg-red-600 text-white px-8 py-4 rounded-full font-bold hover:bg-red-700 transition-colors shadow-lg shadow-red-600/40 flex items-center gap-3 text-lg"
                                >
                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                                    View Details
                                </motion.button>
                            </Link>
                            <motion.button
                                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.2)" }}
                                whileTap={{ scale: 0.95 }}
                                onClick={handleWatchlistClick}
                                className="bg-white/10 backdrop-blur-md text-white border border-white/20 px-8 py-4 rounded-full font-bold transition-colors shadow-lg flex items-center gap-3 text-lg"
                            >
                                {inWatchlist ? (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                        In Watchlist
                                    </>
                                ) : (
                                    <>
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
                                        Add to Watchlist
                                    </>
                                )}
                            </motion.button>
                        </motion.div>
                    </motion.div>
                </div>
            )}

            <div className="relative z-10 space-y-4">
                <MovieRow title="Trending Now" movies={trending} viewAllPath="/category/movie/trending" />
                <MovieRow title="Popular Movies" movies={popular} viewAllPath="/category/movie/popular" />
                <MovieRow title="Top Rated" movies={topRated} viewAllPath="/category/movie/top-rated" />
                <MovieRow title="Upcoming" movies={upcoming} viewAllPath="/category/movie/upcoming" />
            </div>
        </div>
    );
};

export default Home;
