const express = require('express');
const router = express.Router();
const User = require('../models/User');
const axios = require('axios');

const sendEmail = require('../utils/sendEmail');

// Generate OTP
const generateOTP = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP
router.post('/send-otp', async (req, res) => {
    const { email } = req.body;

    try {
        let user = await User.findOne({ email });

        if (!user) {
            user = new User({
                email,
                name: email.split('@')[0],
                picture: `https://ui-avatars.com/api/?name=${email}&background=random`,
                watchlist: []
            });
        }

        const otp = generateOTP();
        const otpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes

        user.otp = otp;
        user.otpExpires = otpExpires;
        await user.save();

        const message = `Your verification code is: ${otp}`;
        const html = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">FlickWave Login Verification</h2>
                <p>Hello,</p>
                <p>Your verification code is:</p>
                <h1 style="background: #f3f4f6; padding: 10px; text-align: center; letter-spacing: 5px; border-radius: 5px;">${otp}</h1>
                <p>This code will expire in 10 minutes.</p>
                <p>If you didn't request this, please ignore this email.</p>
            </div>
        `;

        // Offload email sending to a worker thread
        const { Worker } = require('worker_threads');
        const path = require('path');

        const worker = new Worker(path.join(__dirname, '../workers/emailWorker.js'), {
            workerData: {
                email: user.email,
                subject: 'FlickWave Verification Code',
                message,
                html
            }
        });

        worker.on('message', (result) => {
            if (result.status === 'success') {
                console.log('Worker: Email sent successfully', result.messageId);
            } else {
                console.error('Worker: Failed to send email', result.error);
            }
        });

        worker.on('error', (error) => {
            console.error('Worker Error:', error);
        });

        worker.on('exit', (code) => {
            if (code !== 0)
                console.error(new Error(`Worker stopped with exit code ${code}`));
        });

        res.status(200).json({ message: 'OTP sent successfully' });
    } catch (error) {
        console.error('Error sending OTP:', error);
        console.error('Error Stack:', error.stack);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify OTP & Login
router.post('/login', async (req, res) => {
    const { email, otp, nickname } = req.body;

    try {
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(400).json({ message: 'User not found' });
        }

        if (!user.otp || !user.otpExpires) {
            return res.status(400).json({ message: 'No OTP requested' });
        }

        if (user.otp !== otp) {
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        if (user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'OTP expired' });
        }

        // Update user details
        if (nickname) {
            user.nickname = nickname;
        }
        user.lastUpdated = new Date();

        // Clear OTP
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json(user);
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Get User
router.get('/:email', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.params.email });
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
