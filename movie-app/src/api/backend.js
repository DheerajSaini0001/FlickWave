import axios from 'axios';

const API_URL = `${import.meta.env.VITE_BACKEND_URL}/api` || 'http://localhost:5001/api';

export const syncUser = async (user) => {
    try {
        const response = await axios.post(`${API_URL}/users/login`, user);
        return response.data;
    } catch (error) {
        console.error('Error syncing user:', error);
        throw error;
    }
};

export const getUserWatchlist = async (email) => {
    try {
        const response = await axios.get(`${API_URL}/users/${email}`);
        return response.data.watchlist;
    } catch (error) {
        console.error('Error fetching watchlist:', error);
        throw error;
    }
};

export const addToWatchlist = async (email, movie) => {
    try {
        const response = await axios.post(`${API_URL}/users/${email}/watchlist`, { movie });
        return response.data;
    } catch (error) {
        console.error('Error adding to watchlist:', error);
        throw error;
    }
};

export const removeFromWatchlist = async (email, movieId) => {
    try {
        const response = await axios.delete(`${API_URL}/users/${email}/watchlist/${movieId}`);
        return response.data;
    } catch (error) {
        console.error('Error removing from watchlist:', error);
        throw error;
    }
};
