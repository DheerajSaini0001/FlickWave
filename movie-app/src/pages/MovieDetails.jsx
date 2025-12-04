import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getMovieDetails } from '../api/tmdb';
import Loader from '../components/Loader';
import MovieRow from '../components/MovieRow';
import { useWatchlist } from '../context/WatchlistContext';
import { useAuth0 } from '@auth0/auth0-react';

const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();
    const { isAuthenticated, loginWithRedirect } = useAuth0();

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

    const handleWatchlist = () => {
        if (!isAuthenticated) {
            loginWithRedirect({ appState: { returnTo: window.location.pathname } });
            return;
        }
        if (inWatchlist) {
            removeFromWatchlist(movie.id);
        } else {
            addToWatchlist(movie);
        }
    };

    return (
        <div className="pb-10">
            {/* Backdrop */}
            <div
                className="relative h-[60vh] w-full bg-cover bg-center"
                style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
                <div className="absolute bottom-0 left-0 p-8 w-full container mx-auto flex flex-col md:flex-row items-end gap-8">
                    <img
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        className="hidden md:block w-48 rounded-lg shadow-2xl border-4 border-white dark:border-gray-800"
                    />
                    <div className="text-white pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold mb-2 drop-shadow-lg">{movie.title}</h1>
                        <div className="flex flex-wrap items-center gap-4 text-sm md:text-base text-gray-300 mb-4">
                            <span>{movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A'}</span>
                            <span>•</span>
                            <span>{movie.runtime} min</span>
                            <span>•</span>
                            <span className="flex items-center text-yellow-500 font-bold">★ {movie.vote_average.toFixed(1)}</span>
                        </div>
                        <div className="flex flex-wrap gap-2 mb-6">
                            {movie.genres.map(g => (
                                <span key={g.id} className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm border border-white/10">
                                    {g.name}
                                </span>
                            ))}
                        </div>

                        <button
                            onClick={handleWatchlist}
                            className={`px-6 py-3 rounded-full font-bold transition flex items-center gap-2 shadow-lg ${inWatchlist
                                ? 'bg-gray-600 hover:bg-gray-700 text-white'
                                : 'bg-red-600 hover:bg-red-700 text-white'
                                }`}
                        >
                            {inWatchlist ? '✓ In Watchlist' : '+ Add to Watchlist'}
                        </button>
                    </div>
                </div>
            </div>

            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2 space-y-8">
                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Overview</h2>
                            <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-lg">
                                {movie.overview}
                            </p>
                        </section>

                        {trailer && (
                            <section>
                                <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Trailer</h2>
                                <div className="aspect-video">
                                    <iframe
                                        className="w-full h-full rounded-lg shadow-lg"
                                        src={`https://www.youtube.com/embed/${trailer.key}`}
                                        title="YouTube video player"
                                        allowFullScreen
                                    ></iframe>
                                </div>
                            </section>
                        )}

                        <section>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Top Cast</h2>
                            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                                {cast.map(actor => (
                                    <div key={actor.id} className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden shadow hover:shadow-md transition">
                                        <img
                                            src={actor.profile_path ? `https://image.tmdb.org/t/p/w200${actor.profile_path}` : 'https://via.placeholder.com/200x300?text=No+Image'}
                                            alt={actor.name}
                                            className="w-full h-48 object-cover"
                                        />
                                        <div className="p-3">
                                            <p className="font-semibold text-gray-900 dark:text-white text-sm truncate">{actor.name}</p>
                                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{actor.character}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </section>
                    </div>

                    <div className="md:col-span-1">
                        {/* Sidebar content if needed */}
                    </div>
                </div>

                {recommendations.length > 0 && (
                    <MovieRow title="Recommended Movies" movies={recommendations} />
                )}
            </div>
        </div>
    );
};

export default MovieDetails;
