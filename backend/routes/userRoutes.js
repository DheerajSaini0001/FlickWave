const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Sync User (Create or Update)
router.post('/sync', async (req, res) => {
    const { sub, email, name, picture } = req.body;

    try {
        let user = await User.findOne({ auth0Id: sub });

        if (!user) {
            user = new User({
                auth0Id: sub,
                email,
                name,
                picture,
                watchlist: []
            });
            await user.save();
        } else {
            // Update user details if they changed
            user.email = email;
            user.name = name;
            user.picture = picture;
            await user.save();
        }

        res.status(200).json(user);
    } catch (error) {
        console.error('Error syncing user:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User
router.get('/:auth0Id', async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.params.auth0Id });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

const axios = require('axios');

// ... (existing imports)

// Add to Watchlist
router.post('/:auth0Id/watchlist', async (req, res) => {
    const { movie, movieId } = req.body;
    const id = movieId || movie?.id;

    if (!id) return res.status(400).json({ message: 'Movie ID required' });

    try {
        const user = await User.findOne({ auth0Id: req.params.auth0Id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Check if movie already exists
        const exists = user.watchlist.some(m => m.id === parseInt(id));
        if (exists) return res.status(400).json({ message: 'Movie already in watchlist' });

        let movieData = movie;

        // Fetch details from TMDB if Access Token is available
        if (process.env.TMDB_ACCESS_TOKEN) {
            try {
                const tmdbRes = await axios.get(`${process.env.TMDB_BASE_URL}/movie/${id}`, {
                    headers: {
                        Authorization: `Bearer ${process.env.TMDB_ACCESS_TOKEN}`,
                        'Content-Type': 'application/json',
                    }
                });
                const m = tmdbRes.data;
                movieData = {
                    id: m.id,
                    title: m.title,
                    poster_path: m.poster_path,
                    backdrop_path: m.backdrop_path,
                    release_date: m.release_date,
                    vote_average: m.vote_average,
                    overview: m.overview
                };
            } catch (tmdbError) {
                console.error('Error fetching from TMDB:', tmdbError.message);
                // Fallback to provided movie object if TMDB fetch fails
                if (!movieData) {
                    return res.status(500).json({ message: 'Failed to fetch movie details' });
                }
            }
        }

        if (!movieData) {
            return res.status(400).json({ message: 'No movie data provided' });
        }

        user.watchlist.push(movieData);
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Remove from Watchlist
router.delete('/:auth0Id/watchlist/:movieId', async (req, res) => {
    try {
        const user = await User.findOne({ auth0Id: req.params.auth0Id });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.watchlist = user.watchlist.filter(m => m.id !== parseInt(req.params.movieId));
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
