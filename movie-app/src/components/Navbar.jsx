import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from "@auth0/auth0-react";
import ThemeToggle from './ThemeToggle';

const Navbar = () => {
    const { loginWithRedirect, logout, isAuthenticated, user } = useAuth0();
    const [query, setQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (query.trim()) {
            navigate(`/search?query=${query}`);
            setQuery('');
        }
    };

    return (
        <nav className="bg-white dark:bg-gray-900 shadow-md fixed w-full z-50 top-0 transition-colors duration-300">
            <div className="container mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-red-600">FlickWave</Link>

                <form onSubmit={handleSearch} className="hidden md:flex flex-1 mx-10 max-w-lg">
                    <input
                        type="text"
                        placeholder="Search movies..."
                        className="w-full px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-red-500 transition-colors"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </form>

                <div className="flex items-center space-x-4">
                    <Link to="/" className="hover:text-red-500 transition-colors">Home</Link>
                    {isAuthenticated && (
                        <>
                            <Link to="/watchlist" className="hover:text-red-500 transition-colors">Watchlist</Link>
                            <Link to="/profile" className="hover:text-red-500 transition-colors">Profile</Link>
                        </>
                    )}

                    <ThemeToggle />

                    {isAuthenticated ? (
                        <button
                            onClick={() => logout({ logoutParams: { returnTo: window.location.origin } })}
                            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
                        >
                            Logout
                        </button>
                    ) : (
                        <button
                            onClick={() => loginWithRedirect({ appState: { returnTo: window.location.pathname } })}
                            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                        >
                            Login
                        </button>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
