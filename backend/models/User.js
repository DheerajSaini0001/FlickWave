const mongoose = require('mongoose');

const MovieSchema = new mongoose.Schema({
    id: { type: Number, required: true },
    title: { type: String, required: true },
    poster_path: String,
    backdrop_path: String,
    release_date: String,
    vote_average: Number,
    overview: String,
    addedAt: { type: Date, default: Date.now }
});

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    otp: String,
    otpExpires: Date,
    name: String,
    picture: String,
    nickname: String,
    lastUpdated: Date,
    watchlist: [MovieSchema], // Assuming WatchlistSchema refers to MovieSchema for syntactic correctness
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
