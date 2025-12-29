const express = require('express');
const router = express.Router();
const axios = require('axios');

const TMDB_BASE_URL = process.env.TMDB_BASE_URL || 'https://api.themoviedb.org/3';

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
        'Content-Type': 'application/json',
    }
});

// Get Trending Movies
router.get('/trending', async (req, res) => {
    try {
        const response = await tmdbClient.get('/trending/movie/week');
        res.json(response.data.results);
    } catch (error) {
        console.error('Error fetching trending movies:', error.message);
        res.status(500).json({ message: 'Failed to fetch trending movies' });
    }
});

// Search Movies
router.get('/search', async (req, res) => {
    const { query } = req.query;
    if (!query) return res.status(400).json({ message: 'Query is required' });

    try {
        const response = await tmdbClient.get('/search/movie', {
            params: { query }
        });
        res.json(response.data.results);
    } catch (error) {
        console.error('Error searching movies:', error.message);
        res.status(500).json({ message: 'Failed to search movies' });
    }
});

module.exports = router;
