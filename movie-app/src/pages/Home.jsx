import React, { useEffect, useState } from 'react';
import { getTrendingMovies, getPopularMovies, getTopRatedMovies, getUpcomingMovies } from '../api/tmdb';
import MovieRow from '../components/MovieRow';
import Loader from '../components/Loader';
import { Link } from 'react-router-dom';

const Home = () => {
    const [trending, setTrending] = useState([]);
    const [popular, setPopular] = useState([]);
    const [topRated, setTopRated] = useState([]);
    const [upcoming, setUpcoming] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="pb-10">
            {/* Hero Section */}
            {heroMovie && (
                <div
                    className="relative h-[80vh] w-full bg-cover bg-center"
                    style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${heroMovie.backdrop_path})` }}
                >
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent"></div>
                    <div className="absolute bottom-0 left-0 p-8 md:p-16 w-full md:w-2/3 lg:w-1/2">
                        <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">{heroMovie.title}</h1>
                        <p className="text-lg text-gray-200 mb-6 line-clamp-3 drop-shadow-md">{heroMovie.overview}</p>
                        <div className="flex space-x-4">
                            <Link
                                to={`/movie/${heroMovie.id}`}
                                className="bg-red-600 text-white px-8 py-3 rounded-full font-bold hover:bg-red-700 transition shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                            >
                                View Details
                            </Link>
                        </div>
                    </div>
                </div>
            )}

            <div className="relative z-10 space-y-4">
                <MovieRow title="Trending Now" movies={trending} />
                <MovieRow title="Popular Movies" movies={popular} />
                <MovieRow title="Top Rated" movies={topRated} />
                <MovieRow title="Upcoming" movies={upcoming} />
            </div>
        </div>
    );
};

export default Home;
