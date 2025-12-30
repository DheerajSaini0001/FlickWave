import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import YoutubePlayer from "react-native-youtube-iframe";
import { useTheme } from '../context/ThemeContext';
import config from '../constants/config';
import { Toast } from '../components/Toast';
import { CustomAlert } from '../components/CustomAlert';

export default function MovieDetailsScreen({ route, navigation }) {
    const { movieId, user } = route.params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [playing, setPlaying] = useState(false);
    const [trailerId, setTrailerId] = useState(null);

    const onStateChange = useCallback((state) => {
        if (state === "ended") {
            setPlaying(false);
        }
    }, []);

    useEffect(() => {
        fetchMovieDetails();
    }, [movieId]);

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`${config.TMDB_BASE_URL}/movie/${movieId}?append_to_response=credits,similar,videos`, {
                headers: {
                    Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMovie(data);
                const trailer = data.videos?.results?.find(
                    (video) => video.site === 'YouTube' && (video.type === 'Trailer' || video.type === 'Teaser')
                );
                setTrailerId(trailer?.key);
            } else {
                console.error('Error fetching movie details:', data);
            }
        } catch (error) {
            console.error('Network Error:', error);
        } finally {
            setLoading(false);
        }
    };



    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [alertVisible, setAlertVisible] = useState(false);

    const showToast = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };



    const handleAddToWatchlist = () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add to watchlist');
            return;
        }

        setAlertVisible(true);
    };

    const performAddToWatchlist = async () => {
        setAlertVisible(false);
        try {
            const response = await fetch(`${config.API_URL}/users/${user.email}/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie: movie, movieId: movie.id })
            });

            const data = await response.json();
            if (response.ok) {
                showToast('Added to Watchlist!', 'success');
            } else if (response.status === 400 && data.message === 'Movie already in watchlist') {
                showToast('Movie is already in your watchlist', 'error');
            } else {
                showToast(data.message || 'Could not add movie', 'error');
            }
        } catch (error) {
            showToast('Failed to add to watchlist', 'error');
        }
    };

    const { colorScheme } = useTheme();

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 justify-center items-center">
                <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    if (!movie) {
        return (
            <SafeAreaView className="flex-1 bg-white dark:bg-slate-900 justify-center items-center">
                <Text className="text-slate-900 dark:text-white">Movie not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900" edges={['top', 'left', 'right']}>
            <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />

            <Toast
                visible={toastVisible}
                message={toastMessage}
                type={toastType}
                onHide={() => setToastVisible(false)}
            />

            <CustomAlert
                visible={alertVisible}
                title="Add to Watchlist"
                message="Do you want to add this movie to your watchlist?"
                confirmText="Add to List"
                cancelText="Cancel"
                type="info"
                icon="bookmark"
                onCancel={() => setAlertVisible(false)}
                onConfirm={performAddToWatchlist}
            />

            <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                {/* Backdrop Image */}
                <View className="relative">
                    <Image
                        source={{ uri: movie.backdrop_path ? `https://image.tmdb.org/t/p/w1280${movie.backdrop_path}` : 'https://via.placeholder.com/500x300?text=No+Backdrop' }}
                        className="w-full h-72"
                        resizeMode="cover"
                    />
                    <View className="absolute top-0 left-0 w-full h-full bg-black/30" />

                    {/* Back Button */}
                    <TouchableOpacity
                        onPress={() => navigation.goBack()}
                        className="absolute top-2 left-4 bg-black/50 p-2 rounded-full z-10"
                    >
                        <Text className="text-white text-lg font-bold">←</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-4 -mt-10">
                    <View className="flex-row">
                        {/* Poster Image */}
                        <Image
                            source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster' }}
                            className="w-32 h-48 rounded-xl shadow-2xl border-2 border-slate-200 dark:border-slate-700"
                            resizeMode="cover"
                        />
                        <View className="flex-1 ml-4 justify-end pb-2">
                            <Text className="text-slate-900 dark:text-white text-2xl font-bold mb-1 shadow-white dark:shadow-black shadow-lg">{movie.title}</Text>
                            <Text className="text-slate-600 dark:text-gray-300 italic text-sm mb-2">{movie.tagline}</Text>
                            <View className="flex-row items-center flex-wrap">
                                {movie.genres?.map(genre => (
                                    <View key={genre.id} className="bg-slate-100 dark:bg-slate-800 px-2 py-1 rounded-md mr-2 mb-2 border border-slate-200 dark:border-slate-700">
                                        <Text className="text-slate-500 dark:text-gray-400 text-xs">{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mt-6 mb-6">
                        <TouchableOpacity
                            className="bg-indigo-600 flex-1 py-3 rounded-xl mr-3 items-center"
                            onPress={handleAddToWatchlist}
                        >
                            <Text className="text-white font-bold text-base">Add to Watchlist</Text>
                        </TouchableOpacity>

                        <View className="bg-slate-100 dark:bg-slate-800 w-12 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700">
                            <Text className="text-yellow-600 dark:text-yellow-500 font-bold">{movie.vote_average?.toFixed(1)}</Text>
                        </View>
                    </View>

                    {/* Trailer */}
                    {trailerId && (
                        <View className="mb-8">
                            <Text className="text-slate-900 dark:text-white text-lg font-bold mb-4">Official Trailer</Text>
                            <View className="rounded-xl overflow-hidden bg-black shadow-lg border border-slate-200 dark:border-slate-700">
                                <YoutubePlayer
                                    height={220}
                                    play={playing}
                                    videoId={trailerId}
                                    onChangeState={onStateChange}
                                />
                            </View>
                        </View>
                    )}

                    {/* Overview */}
                    <View className="mb-8">
                        <Text className="text-slate-900 dark:text-white text-lg font-bold mb-2">Overview</Text>
                        <Text className="text-slate-600 dark:text-gray-300 leading-6 text-base">{movie.overview}</Text>
                    </View>

                    {/* Movie Info Grid */}
                    <View className="mb-8">
                        <Text className="text-slate-900 dark:text-white text-lg font-bold mb-4">Movie Info</Text>
                        <View className="flex-row flex-wrap justify-between bg-slate-100 dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700">
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Status</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm">{movie.status}</Text>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Released</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm">{movie.release_date}</Text>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Original Language</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm uppercase">{movie.original_language}</Text>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Runtime</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm">{movie.runtime} min</Text>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Budget</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm">
                                    {movie.budget > 0 ? `$${movie.budget.toLocaleString()}` : 'N/A'}
                                </Text>
                            </View>
                            <View className="w-[48%] mb-4">
                                <Text className="text-indigo-500 dark:text-indigo-400 font-bold mb-1">Revenue</Text>
                                <Text className="text-slate-500 dark:text-gray-300 text-sm">
                                    {movie.revenue > 0 ? `$${movie.revenue.toLocaleString()}` : 'N/A'}
                                </Text>
                            </View>
                        </View>
                    </View>

                    {/* Top Cast */}
                    {(movie.credits?.cast?.length > 0 || movie.credits?.crew?.length > 0) && (
                        <View className="mb-8">
                            <Text className="text-slate-900 dark:text-white text-lg font-bold mb-4">Top Cast</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {movie.credits?.cast?.slice(0, 10).map((person) => (
                                    <View key={person.id} className="mr-4 items-center w-24">
                                        <Image
                                            source={{ uri: person.profile_path ? `https://image.tmdb.org/t/p/w185${person.profile_path}` : 'https://via.placeholder.com/185x278?text=No+Image' }}
                                            className="w-20 h-20 rounded-full mb-2 border border-slate-200 dark:border-slate-700"
                                            resizeMode="cover"
                                        />
                                        <Text numberOfLines={2} className="text-slate-900 dark:text-white text-xs text-center font-medium">{person.name}</Text>
                                        <Text numberOfLines={2} className="text-slate-500 dark:text-gray-400 text-[10px] text-center">{person.character}</Text>
                                    </View>
                                ))}
                            </ScrollView>
                        </View>
                    )}

                    {/* Recommended Movies */}
                    {movie.similar?.results?.length > 0 && (
                        <View className="mb-8">
                            <Text className="text-slate-900 dark:text-white text-lg font-bold mb-4">Recommended Movies</Text>
                            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                                {movie.similar.results.slice(0, 10).map((similarMovie) => (
                                    <TouchableOpacity
                                        key={similarMovie.id}
                                        className="mr-4 w-32"
                                        onPress={() => navigation.push('MovieDetails', { movieId: similarMovie.id, user })}
                                    >
                                        <Image
                                            source={{ uri: similarMovie.poster_path ? `https://image.tmdb.org/t/p/w342${similarMovie.poster_path}` : 'https://via.placeholder.com/342x513?text=No+Poster' }}
                                            className="w-32 h-48 rounded-xl mb-2 border border-slate-200 dark:border-slate-700"
                                            resizeMode="cover"
                                        />
                                        <Text numberOfLines={1} className="text-slate-900 dark:text-white text-sm font-medium mb-1">{similarMovie.title}</Text>
                                        <View className="flex-row justify-between items-center">
                                            <Text className="text-yellow-600 dark:text-yellow-500 text-[10px]">★ {similarMovie.vote_average?.toFixed(1)}</Text>
                                            <Text className="text-slate-500 dark:text-gray-400 text-[10px]">{similarMovie.release_date?.split('-')[0]}</Text>
                                        </View>
                                    </TouchableOpacity>
                                ))}
                            </ScrollView>
                        </View>
                    )}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
