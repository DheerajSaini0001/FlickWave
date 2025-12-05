import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
    getTrendingMovies,
    getPopularMovies,
    getTopRatedMovies,
    getUpcomingMovies,
    getTrendingTV,
    getPopularTV,
    getTopRatedTV,
    getOnTheAirTV,
} from "../api/tmdb";
import MovieCard from "../components/MovieCard";
import Loader from "../components/Loader";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "../context/ThemeContext";

const CategoryPage = () => {
    const { darkMode } = useTheme();

    const { type, category } = useParams();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [title, setTitle] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);

            try {
                let res;
                let pageTitle = "";

                if (type === "movie") {
                    switch (category) {
                        case "trending":
                            res = await getTrendingMovies();
                            pageTitle = "Trending Movies";
                            break;
                        case "popular":
                            res = await getPopularMovies();
                            pageTitle = "Popular Movies";
                            break;
                        case "top-rated":
                            res = await getTopRatedMovies();
                            pageTitle = "Top Rated Movies";
                            break;
                        case "upcoming":
                            res = await getUpcomingMovies();
                            pageTitle = "Upcoming Movies";
                            break;
                        default:
                            res = { data: { results: [] } };
                    }
                } else if (type === "tv") {
                    switch (category) {
                        case "trending":
                            res = await getTrendingTV();
                            pageTitle = "Trending TV Shows";
                            break;
                        case "popular":
                            res = await getPopularTV();
                            pageTitle = "Popular TV Shows";
                            break;
                        case "top-rated":
                            res = await getTopRatedTV();
                            pageTitle = "Top Rated TV Shows";
                            break;
                        case "on-the-air":
                            res = await getOnTheAirTV();
                            pageTitle = "On The Air TV Shows";
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
        <div
            className={`min-h-screen pt-28 transition-colors duration-300 ${darkMode ? "bg-[#0f1014]" : "bg-gray-50"
                }`}
        >
            <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8">
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <h2
                        className={`text-2xl sm:text-3xl md:text-4xl font-bold border-l-4 border-red-600 pl-4 transition-colors duration-300 ${darkMode ? "text-white" : "text-gray-900"
                            }`}
                    >
                        {title}
                    </h2>
                </motion.div>

                <motion.div
                    layout
                    className="
            grid 
            grid-cols-1 
            sm:grid-cols-2 
            md:grid-cols-3 
            lg:grid-cols-4 
            xl:grid-cols-5 
            gap-4 sm:gap-5 md:gap-6
          "
                >
                    <AnimatePresence>
                        {items.map((item, index) => (
                            <motion.div
                                key={item.id}
                                layout
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: index * 0.05 }}
                                className="flex justify-center"
                            >
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
