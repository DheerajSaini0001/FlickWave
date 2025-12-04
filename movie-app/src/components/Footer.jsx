import React from 'react';

const Footer = () => {
    return (
        <footer className="bg-gray-100 dark:bg-gray-900 py-8 mt-auto border-t border-gray-200 dark:border-gray-800">
            <div className="container mx-auto px-4 text-center">
                <p className="text-gray-600 dark:text-gray-400">
                    © {new Date().getFullYear()} FlickWave. All rights reserved.
                </p>
                <p className="text-sm text-gray-500 mt-2">
                    Powered by <a href="https://www.themoviedb.org/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">TMDb</a>
                </p>
                <div className="mt-4 flex justify-center space-x-4">
                    <a href="#" className="text-gray-500 hover:text-red-500 transition">Privacy Policy</a>
                    <a href="#" className="text-gray-500 hover:text-red-500 transition">Terms of Service</a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
