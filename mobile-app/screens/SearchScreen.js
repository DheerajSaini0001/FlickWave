import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../constants/config';

export default function SearchScreen({ navigation, route }) {
    const { user } = route.params || {};
    const [query, setQuery] = useState('');
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [trending, setTrending] = useState([]);

    useEffect(() => {
        fetchTrending();
    }, []);

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
            Alert.alert('Error', 'Failed to search movies');
        } finally {
            setLoading(false);
        }
    };

    const addToWatchlist = async (movie) => {
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
            } else {
                Alert.alert('Info', data.message || 'Could not add movie');
            }
        } catch (error) {
            Alert.alert('Error', 'Failed to add to watchlist');
        }
    };

    const renderMovie = ({ item }) => (
        <TouchableOpacity
            className="flex-1 m-2 bg-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/50"
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id, user })}
            activeOpacity={0.9}
        >
            <Image
                source={{ uri: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : 'https://via.placeholder.com/500x750?text=No+Image' }}
                className="w-full h-64"
                resizeMode="cover"
            />
            <View className="p-3">
                <Text numberOfLines={1} className="text-white font-bold text-base mb-1">{item.title}</Text>
                <View className="flex-row justify-between items-center mb-2">
                    <Text className="text-yellow-500 text-xs">★ {item.vote_average?.toFixed(1)}</Text>
                    <Text className="text-gray-400 text-xs">{item.release_date?.split('-')[0]}</Text>
                </View>
                <TouchableOpacity
                    className="bg-indigo-600 py-2 rounded-lg items-center"
                    onPress={() => addToWatchlist(item)}
                >
                    <Text className="text-white font-bold text-xs">Add to Watchlist</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 p-4">
                <View className="flex-row items-center bg-slate-800 rounded-full px-4 py-2 border border-slate-700 mb-6">
                    <TextInput
                        className="flex-1 text-white text-base py-2"
                        placeholder="Search movies..."
                        placeholderTextColor="#94a3b8"
                        value={query}
                        onChangeText={setQuery}
                        onSubmitEditing={searchMovies}
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
                        <Text className="text-xl font-bold text-white mb-4">
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
                                <Text className="text-gray-500 text-center mt-10">No movies found</Text>
                            }
                        />
                    </>
                )}
            </View>
        </SafeAreaView>
    );
}
