import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { syncUser, getUserWatchlist, addToWatchlistApi, removeFromWatchlistApi } from '../api/backend';

const WatchlistContext = createContext();

export const useWatchlist = () => useContext(WatchlistContext);

export const WatchlistProvider = ({ children }) => {
    const { user, isAuthenticated } = useAuth0();
    const [watchlist, setWatchlist] = useState([]);

    useEffect(() => {
        const initializeUser = async () => {
            if (isAuthenticated && user) {
                try {
                    // Sync user with backend
                    await syncUser(user);
                    // Fetch user's watchlist
                    const serverWatchlist = await getUserWatchlist(user.sub);
                    setWatchlist(serverWatchlist);
                } catch (error) {
                    console.error("Failed to sync with backend:", error);
                    // Fallback to localStorage if backend fails (optional, keeping it simple for now)
                    const stored = localStorage.getItem(`watchlist_${user.sub}`);
                    if (stored) setWatchlist(JSON.parse(stored));
                }
            } else {
                setWatchlist([]);
            }
        };

        initializeUser();
    }, [isAuthenticated, user]);

    const addToWatchlist = async (movie) => {
        if (!isAuthenticated) return;
        if (isInWatchlist(movie.id)) return;

        // Optimistic update
        const updated = [...watchlist, movie];
        setWatchlist(updated);

        try {
            await addToWatchlistApi(user.sub, movie);
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
            await removeFromWatchlistApi(user.sub, id);
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
