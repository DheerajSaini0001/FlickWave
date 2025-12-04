import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
    getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies,
    getTrendingTV, getPopularTV, getTopRatedTV, getOnTheAirTV
} from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';
import { motion, AnimatePresence } from 'framer-motion';
// 1. Import useTheme
import { useTheme } from '../context/ThemeContext';

const CategoryPage = () => {
    // 2. Access darkMode state
    const { darkMode } = useTheme();
    
    const { type, category } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                let res;
                let pageTitle = '';

                if (type === 'movie') {
                    switch (category) {
                        case 'trending':
                            res = await getTrendingMovies();
                            pageTitle = 'Trending Movies';
                            break;
                        case 'popular':
                            res = await getPopularMovies();
                            pageTitle = 'Popular Movies';
                            break;
                        case 'top-rated':
                            res = await getTopRatedMovies();
                            pageTitle = 'Top Rated Movies';
                            break;
                        case 'upcoming':
                            res = await getUpcomingMovies();
                            pageTitle = 'Upcoming Movies';
                            break;
                        default:
                            res = { data: { results: [] } };
                    }
                } else if (type === 'tv') {
                    switch (category) {
                        case 'trending':
                            res = await getTrendingTV();
                            pageTitle = 'Trending TV Shows';
                            break;
                        case 'popular':
                            res = await getPopularTV();
                            pageTitle = 'Popular TV Shows';
                            break;
                        case 'top-rated':
                            res = await getTopRatedTV();
                            pageTitle = 'Top Rated TV Shows';
                            break;
                        case 'on-the-air':
                            res = await getOnTheAirTV();
                            pageTitle = 'On The Air TV Shows';
                            break;
                        default:
                            res = { data: { results: [] } };
                    }
                }

                setItems(res.data.results);
                setTitle(pageTitle);
            } catch (error) {
                console.error("Error fetching category data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [type, category]);

    if (loading) return <Loader />;

    return (
        // 3. Wrapper Div: Handles full-screen background color
        <div className={`min-h-screen pt-28 transition-colors duration-300 ${
            darkMode ? "bg-[#0f1014]" : "bg-gray-50"
        }`}>
            {/* Inner Container: Handles centering and margins */}
            <div className="container mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    {/* 4. Dynamic Text Color for Heading */}
                    <h2 className={`text-3xl md:text-4xl font-bold mb-2 border-l-4 border-red-600 pl-4 transition-colors duration-300 ${
                        darkMode ? "text-white" : "text-gray-900"
                    }`}>
                        {title}
                    </h2>
                </motion.div>

                <motion.div
                    layout
                    className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-6"
                >
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                            >
                                {/* MovieCard will handle its own dark mode via context */}
                                <MovieCard movie={item} />
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </motion.div>
            </div>
        </div>
    );
};

export default CategoryPage;