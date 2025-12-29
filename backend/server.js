require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.get('/', (req, res) => {
    res.send('FlickWave Backend is running');
});

// Import Routes
const userRoutes = require('./routes/userRoutes');
const movieRoutes = require('./routes/movieRoutes');

app.use('/api/users', userRoutes);
app.use('/api/movies', movieRoutes);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
