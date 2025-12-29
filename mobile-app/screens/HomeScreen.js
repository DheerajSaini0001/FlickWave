import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, TouchableOpacity, ActivityIndicator, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import config from '../constants/config';

export default function HomeScreen({ navigation, route }) {
    const { user } = route.params || {};
    const [trending, setTrending] = useState([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchTrending = async () => {
        try {
            const response = await fetch(`${config.TMDB_BASE_URL}/trending/movie/week`, {
                headers: {
                    Authorization: `Bearer ${config.TMDB_ACCESS_TOKEN}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                console.error(`TMDB Error: ${response.status}`);
                return;
            }

            const data = await response.json();
            setTrending(data.results || []);
        } catch (error) {
            console.error('Network Error fetching trending:', error);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchTrending();
    }, []);

    const onRefresh = () => {
        setRefreshing(true);
        fetchTrending();
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
            } else if (response.status === 400 && data.message === 'Movie already in watchlist') {
                Alert.alert('Info', 'Already in Watchlist');
            } else {
                Alert.alert('Error', data.message || 'Could not add movie');
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
                    className="bg-indigo-600 py-2 rounded-lg items-center active:bg-indigo-700"
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
            <View className="flex-1 px-4 pt-2">
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-3xl font-extrabold text-transparent bg-clip-text text-white tracking-widest">
                            FlickWave
                        </Text>
                        <Text className="text-gray-400 text-xs tracking-widest uppercase">Movie Companion</Text>
                    </View>
                    {user && (
                        <View className="flex-row items-center">
                            <View className="bg-slate-800 px-3 py-1 rounded-full border border-slate-700 mr-2">
                                <Text className="text-indigo-400 font-bold text-xs">{user.name}</Text>
                            </View>
                        </View>
                    )}
                </View>

                {/* Search Bar Trigger */}
                <TouchableOpacity
                    className="bg-slate-800 border border-slate-700 rounded-2xl flex-row items-center px-4 py-3 mb-6"
                    activeOpacity={0.8}
                    onPress={() => navigation.navigate('Search', { user })}
                >
                    <Text className="text-indigo-400 text-lg mr-3">🔍</Text>
                    <Text className="text-gray-500 font-medium">Search for movies...</Text>
                </TouchableOpacity>

                <Text className="text-xl font-bold text-white mb-4">Trending Now</Text>

                {loading ? (
                    <ActivityIndicator size="large" color="#6366f1" className="mt-20" />
                ) : (
                    <FlatList
                        data={trending}
                        renderItem={renderMovie}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        contentContainerStyle={{ paddingBottom: 20 }}
                    />
                )}
            </View>
        </SafeAreaView>
    );
}
