import React, { useRef } from 'react';
import MovieCard from './MovieCard';

const MovieRow = ({ title, movies }) => {
    const rowRef = useRef(null);

    const scroll = (direction) => {
        const { current } = rowRef;
        if (current) {
            const scrollAmount = direction === 'left' ? -500 : 500;
            current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        }
    };

    if (!movies || movies.length === 0) return null;

    return (
        <div className="my-8 px-4 container mx-auto">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 border-l-4 border-red-600 pl-3">{title}</h2>
            <div className="relative group">
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform -translate-x-1/2"
                    aria-label="Scroll Left"
                >
                    &#10094;
                </button>

                <div
                    ref={rowRef}
                    className="flex space-x-4 overflow-x-auto scrollbar-hide py-4 px-2 scroll-smooth"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {movies.map((movie) => (
                        <div key={movie.id} className="min-w-[160px] md:min-w-[200px] flex-shrink-0">
                            <MovieCard movie={movie} />
                        </div>
                    ))}
                </div>

                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-black/60 hover:bg-red-600 text-white p-3 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-1/2"
                    aria-label="Scroll Right"
                >
                    &#10095;
                </button>
            </div>
        </div>
    );
};

export default MovieRow;
