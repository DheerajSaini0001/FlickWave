import React, { useEffect, useState } from 'react';
import {
    getPopularMovies, getTopRatedMovies, getUpcomingMovies, getTrendingMovies,
    getPopularTV, getTopRatedTV, getOnTheAirTV, getTrendingTV
} from '../api/tmdb';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { motion } from 'framer-motion';

const Browse = ({ type }) => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]); // Or On The Air for TV
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
        <div className="pb-10 min-h-screen bg-white dark:bg-gray-900 transition-colors duration-300">
            {/* Hero Section */}
            {heroItem && (
                <div className="relative h-[70vh] w-full overflow-hidden">
                    <div
                        className="absolute inset-0 bg-cover bg-center"
                        style={{
                            backgroundImage: `url(https://image.tmdb.org/t/p/original${heroItem.backdrop_path})`,
                        }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#0f1014] via-transparent to-transparent" />
                        <div className="absolute inset-0 bg-gradient-to-r from-white dark:from-[#0f1014] via-white/50 dark:via-[#0f1014]/50 to-transparent" />
                    </div>

                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 lg:w-1/2 z-20 flex flex-col justify-end h-full pb-20">
                        <motion.h1
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-4xl md:text-6xl font-black text-gray-900 dark:text-white mb-4 leading-tight"
                        >
                            {heroItem.title || heroItem.name}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-lg text-gray-700 dark:text-gray-300 mb-8 line-clamp-3"
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
