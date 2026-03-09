import React, { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import SearchResults from './pages/SearchResults';
import Watchlist from './pages/Watchlist';
import Profile from './pages/Profile';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Browse from './pages/Browse';
import CategoryPage from './pages/CategoryPage';
import ProtectedRoute from './auth/ProtectedRoute';
import { initGA } from './utils/gtag';
import usePageTracking from './hooks/usePageTracking';

function App() {
  // Initialize Google Analytics on app mount
  useEffect(() => {
    initGA();
  }, []);

  // Track page views on every route change
  usePageTracking();
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0b0f] text-gray-900 dark:text-white transition-colors duration-300 flex flex-col font-sans">
      <Navbar />
      <main className="flex-grow pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/movie/:id" element={<MovieDetails />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/movies" element={<Browse type="movie" />} />
          <Route path="/tv-shows" element={<Browse type="tv" />} />
          <Route path="/category/:type/:category" element={<CategoryPage />} />

          <Route path="/watchlist" element={
            <ProtectedRoute>
              <Watchlist />
            </ProtectedRoute>
          } />

          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
