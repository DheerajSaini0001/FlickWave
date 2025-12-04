import axios from 'axios';

const tmdb = axios.create({
    baseURL: import.meta.env.VITE_TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${import.meta.env.VITE_TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    },
});

export const getTrendingMovies = () => tmdb.get('/trending/movie/day');
export const getPopularMovies = () => tmdb.get('/movie/popular');
export const getTopRatedMovies = () => tmdb.get('/movie/top_rated');
export const getUpcomingMovies = () => tmdb.get('/movie/upcoming');
export const getMovieDetails = (id) => tmdb.get(`/movie/${id}?append_to_response=videos,credits,recommendations`);
export const searchMovies = (query) => tmdb.get(`/search/movie`, { params: { query } });

export default tmdb;
