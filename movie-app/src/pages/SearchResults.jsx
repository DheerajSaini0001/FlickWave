import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { searchMovies } from '../api/tmdb';
import MovieCard from '../components/MovieCard';
import Loader from '../components/Loader';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const query = searchParams.get('query');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovies = async () => {
            setLoading(true);
            try {
                const res = await searchMovies(query);
                setMovies(res.data.results);
            } catch (error) {
                console.error("Error searching movies:", error);
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchMovies();
        }
    }, [query]);

    if (loading) return <Loader />;

    return (
        <div className="container mx-auto px-4 py-8 pt-24 min-h-screen">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 border-b border-gray-200 dark:border-gray-700 pb-4">
                Search Results for "{query}"
            </h2>
            {movies.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
                    {movies.map(movie => (
                        <MovieCard key={movie.id} movie={movie} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <p className="text-gray-600 dark:text-gray-400 text-xl">No movies found matching your search.</p>
                </div>
            )}
        </div>
    );
};

export default SearchResults;
