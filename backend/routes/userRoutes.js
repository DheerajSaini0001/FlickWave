const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');
const bcrypt = require('bcryptjs');

// Signup
router.post('/signup', async (req, res) => {
    const { email, password, name, nickname } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            email,
            password: hashedPassword,
            name: name || email.split('@')[0],
            nickname: nickname || '',
            picture: `https://ui-avatars.com/api/?name=${name || email}&background=random`,
            watchlist: []
        });

        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(201).json(userResponse);
    } catch (error) {
        console.error('Error in signup:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.password) {
            return res.status(400).json({ message: 'Account not set up for password login. Please sign up again.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        user.lastUpdated = new Date();
        await user.save();

        const userResponse = user.toObject();
        delete userResponse.password;

        res.status(200).json(userResponse);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email }).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Add to Watchlist
router.post('/:email/watchlist', async (req, res) => {
    const { movie, movieId } = req.body;
    const id = movieId || movie?.id;

    if (!id) return res.status(400).json({ message: 'Movie ID required' });

    try {
        const user = await User.findOne({ email: req.params.email });
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
                console.error('Error fetching from TMDB:', tmdbError.response?.data || tmdbError.message);
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
router.delete('/:email/watchlist/:movieId', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.watchlist = user.watchlist.filter(m => m.id !== parseInt(req.params.movieId));
        await user.save();
        res.json(user.watchlist);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
