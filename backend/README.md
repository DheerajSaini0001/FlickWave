# FlickWave Backend

This is the backend server for the FlickWave movie application. It handles user synchronization with Auth0 and manages user watchlists.

## Prerequisites

- Node.js
- MongoDB (Local or Atlas)

## Setup

1.  Install dependencies:
    ```bash
    npm install
    ```

2.  Configure environment variables:
    Create a `.env` file in the root directory (if not already present) with the following content:
    ```env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/flickwave
    ```
    Replace `MONGODB_URI` with your actual MongoDB connection string if different.

## Running the Server

- Development mode (with nodemon):
    ```bash
    npm run dev
    ```
    (You need to add `"dev": "nodemon server.js"` to scripts in package.json if not present)

- Production mode:
    ```bash
    node server.js
    ```

## API Endpoints

- `POST /api/users/sync`: Sync user details from Auth0.
- `GET /api/users/:auth0Id`: Get user details including watchlist.
- `POST /api/users/:auth0Id/watchlist`: Add a movie to the watchlist.
- `DELETE /api/users/:auth0Id/watchlist/:movieId`: Remove a movie from the watchlist.
