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
    auth0Id: { type: String, required: true, unique: true },
    email: { type: String, required: true },
    name: String,
    picture: String,
    watchlist: [MovieSchema],
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
