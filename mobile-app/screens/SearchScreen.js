import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../constants/config';

import { Toast } from '../components/Toast';
import { CustomAlert } from '../components/CustomAlert';
import { useTheme } from '../context/ThemeContext';

export default function SearchScreen({ navigation, route }) {
    const { user } = route.params || {};
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        fetchTrending();
    }, []);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            if (query.trim()) {
                searchMovies();
            }
        }, 1000);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const fetchTrending = async () => {
        try {
            const response = await fetch(`${config.TMDB_BASE_URL}/trending/movie/week`, {
                headers: {
                    Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setTrending(data.results || []);
            }
        } catch (error) {
            console.error('Error fetching trending:', error);
        }
    };

    const searchMovies = async () => {
        if (!query.trim()) return;
        setLoading(true);
        try {
            const response = await fetch(`${config.TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(query)}`, {
                headers: {
                    Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });
            const data = await response.json();
            if (response.ok) {
                setMovies(data.results || []);
            }
        } catch (error) {
            console.error('Error searching:', error);
            // Alert.alert('Error', 'Failed to search movies'); // Suppress alert on type search to avoid annoyance
        } finally {
            setLoading(false);
        }
    };

    const { colorScheme } = useTheme();

    const [toastVisible, setToastVisible] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastType, setToastType] = useState('success');

    const [alertVisible, setAlertVisible] = useState(false);
    const [selectedMovie, setSelectedMovie] = useState(null);

    const showToast = (message, type = 'success') => {
        setToastMessage(message);
        setToastType(type);
        setToastVisible(true);
    };

    const confirmAddToWatchlist = (movie) => {
        if (!user) {
            Alert.alert('Login Required', 'Please login to add to watchlist');
            return;
        }
        setSelectedMovie(movie);
        setAlertVisible(true);
    };

    const performAddToWatchlist = async () => {
        if (!selectedMovie) return;
        setAlertVisible(false);

        try {
            const response = await fetch(`${config.API_URL}/users/${user.email}/watchlist`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ movie: selectedMovie, movieId: selectedMovie.id })
            });

            const data = await response.json();

            if (response.ok) {
                showToast('Added to Watchlist!', 'success');
            } else if (response.status === 400 && data.message === 'Movie already in watchlist') {
                showToast('Movie is already in your watchlist', 'info');
            } else {
                showToast(data.message || 'Could not add movie', 'error');
            }
        } catch (error) {
            showToast('Failed to add to watchlist', 'error');
        } finally {
            setSelectedMovie(null);
        }
    };

    // ... existing search logic ...

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            className="flex-1 m-2 bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/50"
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id, user })}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image' }}
                className="w-full h-64"
                resizeMode="cover"
            />
            <View className="p-3">
                <Text numberOfLines={1} className="text-slate-900 dark:text-white font-bold text-base mb-1">{item.title}</Text>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-yellow-600 dark:text-yellow-500 text-xs">★ {item.vote_average?.toFixed(1)}</Text>
                    <Text className="text-slate-500 dark:text-gray-400 text-xs">{item.release_date?.split('-')[0]}</Text>
                </View>
                <TouchableOpacity
                    className="bg-indigo-600 py-2 rounded-lg items-center active:bg-indigo-700"
                    onPress={() => confirmAddToWatchlist(item)}
                >
                    <Text className="text-white font-bold text-xs">Add to Watchlist</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
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
                message={`Add "${selectedMovie?.title}" to your watchlist?`}
                confirmText="Add to List"
                cancelText="Cancel"
                type="info"
                icon="bookmark"
                onCancel={() => setAlertVisible(false)}
                onConfirm={performAddToWatchlist}
            />

            <View className="flex-1 p-4">
                <View className="flex-row items-center bg-slate-100 dark:bg-slate-800 rounded-full px-4 py-2 border border-slate-200 dark:border-slate-700 mb-6">
                    <TextInput
                        className="flex-1 text-slate-900 dark:text-white text-base py-2"
                        placeholder="Search movies..."
                        placeholderTextColor="#94a3b8"
                        value={query}
                        onChangeText={setQuery}
                        returnKeyType="search"
                    />
                    <TouchableOpacity onPress={searchMovies} className="bg-indigo-600 p-2 rounded-full">
                        <Text className="text-white">🔍</Text>
                    </TouchableOpacity>
                </View>

                {loading ? (
                    <ActivityIndicator size="large" color="#6366f1" />
                ) : (
                    <>
                        <Text className="text-xl font-bold text-slate-900 dark:text-white mb-4">
                            {query ? 'Search Results' : 'Trending This Week'}
                        </Text>
                        <FlatList
                            data={query ? movies : trending}
                            renderItem={renderMovie}
                            keyExtractor={item => item.id.toString()}
                            numColumns={2}
                            columnWrapperStyle={{ justifyContent: 'space-between' }}
                            showsVerticalScrollIndicator={false}
                            ListEmptyComponent={
                                <Text className="text-slate-500 dark:text-gray-500 text-center mt-10">No movies found</Text>
                            }
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
