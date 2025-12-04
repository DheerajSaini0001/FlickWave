import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-[#0f1014] py-12 border-t border-white/5 relative overflow-hidden">
            {/* Ambient Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-1 bg-gradient-to-r from-transparent via-red-600/50 to-transparent blur-sm"></div>

            <div className="container mx-auto px-6 text-center">
                <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-600 to-orange-600 mb-6">
                    FlickWave
                </h2>

                <div className="flex justify-center gap-8 mb-8 text-sm font-medium text-gray-400">
                    <a href="#" className="hover:text-white transition-colors">Home</a>
                    <a href="#" className="hover:text-white transition-colors">Movies</a>
                    <a href="#" className="hover:text-white transition-colors">TV Shows</a>
                    <a href="#" className="hover:text-white transition-colors">My List</a>
                </div>

                <div className="flex justify-center gap-6 mb-8">
                    {/* Social Icons Placeholder */}
                    {[1, 2, 3, 4].map((i) => (
                        <a key={i} href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all duration-300 transform hover:-translate-y-1">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" /></svg>
                        </a>
                    ))}
                </div>

                <p className="text-gray-600 text-sm">
                    © {new Date().getFullYear()} FlickWave. All rights reserved.
                </p>
                <p className="text-xs text-gray-700 mt-2">
                    Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500/60 hover:text-blue-500 hover:underline transition-colors">TMDb</a>
                </p>
            </div>
        </footer>
    );
};

export default Footer;
