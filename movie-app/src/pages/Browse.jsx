import React, { useEffect, useState } from 'react';
import {
    getPopularMovies, getTopRatedMovies, getUpcomingMovies, getTrendingMovies,
    getPopularTV, getTopRatedTV, getOnTheAirTV, getTrendingTV
} from '../api/tmdb';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';
import { useTheme } from '../context/ThemeContext';

const Browse = ({ type }) => {
    const { darkMode } = useTheme();
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

    const isMovie = type === 'movie';

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [trendingRes, popularRes, topRatedRes, upcomingRes] = await Promise.all([
                    isMovie ? getTrendingMovies() : getTrendingTV(),
                    isMovie ? getPopularMovies() : getPopularTV(),
                    isMovie ? getTopRatedMovies() : getTopRatedTV(),
                    isMovie ? getUpcomingMovies() : getOnTheAirTV()
                ]);

                setTrending(trendingRes.data.results);
                setPopular(popularRes.data.results);
                setTopRated(topRatedRes.data.results);
                setUpcoming(upcomingRes.data.results);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, isMovie]);

    if (loading) return <Loader />;

    const heroItem = trending[0];

    return (
        <div className={`pb-10 min-h-screen transition-colors duration-300 ${darkMode ? 'bg-[#0a0b0f]' : 'bg-gray-50'
            }`}>
            {/* Hero Section */}
            {heroItem && (
                <div className="relative h-[70vh] w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`,
                        }}
                    >
                        <div className={`absolute inset-0 bg-gradient-to-t to-transparent ${darkMode ? 'from-[#0a0b0f] via-[#0a0b0f]/60' : 'from-gray-50 via-gray-50/60'
                            }`} />
                        <div className={`absolute inset-0 bg-gradient-to-r to-transparent ${darkMode ? 'from-[#0a0b0f] via-[#0a0b0f]/50' : 'from-gray-50 via-gray-50/80'
                            }`} />
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 lg:w-1/2 z-20 flex flex-col justify-end h-full pb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`text-4xl md:text-6xl font-black mb-4 leading-tight ${darkMode ? 'text-white' : 'text-gray-900'
                                }`}
                        >
                            {heroItem.title || heroItem.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className={`text-lg mb-8 line-clamp-3 leading-relaxed ${darkMode ? 'text-gray-300' : 'text-gray-600'
                                }`}
                        >
                            {heroItem.overview}
                        </motion.p>
                    </div>
                </div>
            )}

            <div className="relative z-10 space-y-4 -mt-20">
                <MovieRow
                    title={`Trending ${isMovie ? 'Movies' : 'TV Shows'}`}
                    movies={trending}
                    viewAllPath={`/category/${type}/trending`}
                />
                <MovieRow
                    title={`Popular ${isMovie ? 'Movies' : 'TV Shows'}`}
                    movies={popular}
                    viewAllPath={`/category/${type}/popular`}
                />
                <MovieRow
                    title={`Top Rated ${isMovie ? 'Movies' : 'TV Shows'}`}
                    movies={topRated}
                    viewAllPath={`/category/${type}/top-rated`}
                />
                <MovieRow
                    title={isMovie ? 'Upcoming' : 'On The Air'}
                    movies={upcoming}
                    viewAllPath={`/category/${type}/${isMovie ? 'upcoming' : 'on-the-air'}`}
                />
            </div>
        </div>
    );
};

export default Browse;
