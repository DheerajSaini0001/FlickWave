import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { getUserWatchlist, addToWatchlist as apiAddToWatchlist, removeFromWatchlist as apiRemoveFromWatchlist } from '../api/backend';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
    const [watchlist, setWatchlist] = useState([]);
    const { user, isAuthenticated } = useAuth();

    useEffect(() => {
        if (isAuthenticated && user) {
            // Fetch user's watchlist
            getUserWatchlist(user.email).then(data => {
                if (data) {
                    setWatchlist(data);
                }
            }).catch(err => console.error(err));
        } else {
            setWatchlist([]);
        }
    }, [isAuthenticated, user]);

    const addToWatchlist = async (movie) => {
        if (!isAuthenticated) return;
        if (isInWatchlist(movie.id)) return;

        // Optimistic update
        const updated = [...watchlist, movie];
        setWatchlist(updated);

        try {
            await apiAddToWatchlist(user.email, movie);
        } catch (error) {
            console.error("Failed to add to watchlist on server:", error);
            // Revert on failure
            setWatchlist(watchlist);
        }
    };

    const removeFromWatchlist = async (id) => {
        if (!isAuthenticated) return;

        // Optimistic update
        const previousWatchlist = watchlist;
        const updated = watchlist.filter(m => m.id !== id);
        setWatchlist(updated);

        try {
            await apiRemoveFromWatchlist(user.email, id);
        } catch (error) {
            console.error("Failed to remove from watchlist on server:", error);
            // Revert on failure
            setWatchlist(previousWatchlist);
        }
    };

    const isInWatchlist = (id) => {
        return watchlist.some(m => m.id === id);
    };

    return (
        <WatchlistContext.Provider value={{ watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist }}>
            {children}
        </WatchlistContext.Provider>
    );
};
