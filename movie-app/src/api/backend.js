import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000/api';

export const syncUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/users/sync`, user);
        return response.data;
    } catch (error) {
        console.error('Error syncing user:', error);
        throw error;
    }
};

export const getUserWatchlist = async (auth0Id) => {
    try {
        const response = await axios.get(`${API_URL}/users/${auth0Id}`);
        return response.data.watchlist;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const addToWatchlistApi = async (auth0Id, movie) => {
    try {
        const response = await axios.post(`${API_URL}/users/${auth0Id}/watchlist`, { movie });
        return response.data;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
    }
};

export const removeFromWatchlistApi = async (auth0Id, movieId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${auth0Id}/watchlist/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
    }
};
