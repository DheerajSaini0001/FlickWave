import React, { useState, useEffect } from 'react';
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, StatusBar, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../constants/config';

export default function MovieDetailsScreen({ route, navigation }) {
    const { movieId, user } = route.params;
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMovieDetails();
    }, [movieId]);

    const fetchMovieDetails = async () => {
        try {
            const response = await fetch(`${config.TMDB_BASE_URL}/movie/${movieId}`, {
                headers: {
                    Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMovie(data);
            } else {
                console.error('Error fetching movie details:', data);
            }
        } catch (error) {
            console.error('Network Error:', error);
        } finally {
            setLoading(false);
        }
    };

    const addToWatchlist = async () => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add to watchlist');
            return;
        }
        try {
            const response = await fetch(`${config.API_URL}/users/${user.email}/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie: movie, movieId: movie.id })
            });

            const data = await response.json();
            if (response.ok) {
                Alert.alert('Success', 'Added to Watchlist');
            } else if (response.status === 400 && data.message === 'Movie already in watchlist') {
                Alert.alert('Info', 'Movie is already in your watchlist');
            } else {
                Alert.alert('Error', data.message || 'Could not add movie');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add to watchlist');
        }
    };

    if (loading) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
                <StatusBar barStyle="light-content" />
                <ActivityIndicator size="large" color="#6366f1" />
            </SafeAreaView>
        );
    }

    if (!movie) {
        return (
            <SafeAreaView className="flex-1 bg-slate-900 justify-center items-center">
                <Text className="text-white">Movie not found</Text>
            </SafeAreaView>
        );
    }

    return (
        <View className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
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
                        className="absolute top-12 left-4 bg-black/50 p-2 rounded-full"
                    >
                        <Text className="text-white text-lg font-bold">←</Text>
                    </TouchableOpacity>
                </View>

                <View className="px-4 -mt-10">
                    <View className="flex-row">
                        {/* Poster Image */}
                        <Image
                            source={{ uri: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Poster' }}
                            className="w-32 h-48 rounded-xl shadow-2xl border-2 border-slate-700"
                            resizeMode="cover"
                        />
                        <View className="flex-1 ml-4 justify-end pb-2">
                            <Text className="text-white text-2xl font-bold mb-1 shadow-black shadow-lg">{movie.title}</Text>
                            <Text className="text-gray-300 italic text-sm mb-2">{movie.tagline}</Text>
                            <View className="flex-row items-center flex-wrap">
                                {movie.genres?.map(genre => (
                                    <View key={genre.id} className="bg-slate-800 px-2 py-1 rounded-md mr-2 mb-2 border border-slate-700">
                                        <Text className="text-gray-400 text-xs">{genre.name}</Text>
                                    </View>
                                ))}
                            </View>
                        </View>
                    </View>

                    {/* Action Buttons */}
                    <View className="flex-row mt-6 mb-6">
                        <TouchableOpacity
                            className="bg-indigo-600 flex-1 py-3 rounded-xl mr-3 items-center"
                            onPress={addToWatchlist}
                        >
                            <Text className="text-white font-bold text-base">Add to Watchlist</Text>
                        </TouchableOpacity>

                        <View className="bg-slate-800 w-12 items-center justify-center rounded-xl border border-slate-700">
                            <Text className="text-yellow-500 font-bold">{movie.vote_average?.toFixed(1)}</Text>
                        </View>
                    </View>

                    {/* Overview */}
                    <View className="mb-8">
                        <Text className="text-white text-lg font-bold mb-2">Overview</Text>
                        <Text className="text-gray-300 leading-6 text-base">{movie.overview}</Text>
                    </View>

                    {/* Additional Info */}
                    <View className="flex-row justify-between bg-slate-800 p-4 rounded-xl border border-slate-700 mb-8">
                        <View className="items-center">
                            <Text className="text-indigo-400 font-bold mb-1">Status</Text>
                            <Text className="text-gray-300 text-xs">{movie.status}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-indigo-400 font-bold mb-1">Released</Text>
                            <Text className="text-gray-300 text-xs">{movie.release_date}</Text>
                        </View>
                        <View className="items-center">
                            <Text className="text-indigo-400 font-bold mb-1">Runtime</Text>
                            <Text className="text-gray-300 text-xs">{movie.runtime} min</Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </View>
    );
}
