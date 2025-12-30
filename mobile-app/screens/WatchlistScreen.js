import React, { useState, useEffect } from 'react';
import { View, Text, SafeAreaView as RNSafeAreaView, StatusBar, TouchableOpacity, FlatList, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
// import axios from 'axios';
import config from '../constants/config';

export default function WatchlistScreen({ route, navigation }) {
    const { user: initialUser } = route.params || {};
    const [user, setUser] = useState(initialUser);
    const [refreshing, setRefreshing] = useState(false);

    const fetchUserData = async () => {
        if (!user?.email) return;
        try {
            const response = await fetch(`${config.API_URL}/users/${user.email}`);

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            setUser(data);
        } catch (error) {
            console.error('Error refreshing user data:', error);
        }
    };

    const handleRemoveMovie = async (movieId) => {
        Alert.alert(
            "Remove from Watchlist",
            "Are you sure you want to remove this movie?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Remove",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            const response = await fetch(`${config.API_URL}/users/${user.email}/watchlist/${movieId}`, {
                                method: 'DELETE',
                            });

                            if (!response.ok) {
                                throw new Error('Failed to remove movie');
                            }

                            const updatedWatchlist = await response.json();
                            setUser(prev => ({ ...prev, watchlist: updatedWatchlist }));
                        } catch (error) {
                            console.error('Error removing movie:', error);
                            Alert.alert('Error', 'Failed to remove movie from watchlist');
                        }
                    }
                }
            ]
        );
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    useEffect(() => {
        if (user?.watchlist) {
            navigation.setOptions({
                tabBarBadge: user.watchlist.length > 0 ? user.watchlist.length : null,
            });
        }
    }, [user?.watchlist, navigation]);

    const renderMovieItem = ({ item }) => (
        <TouchableOpacity
            className="flex-1 m-2 bg-slate-800 rounded-xl overflow-hidden shadow-lg shadow-black/50"
            onPress={() => navigation.navigate('MovieDetails', { movieId: item.id, user })}
            activeOpacity={0.9}
        >
            <View className="relative">
                <Image
                    source={{ uri: `https://image.tmdb.org/t/p/w500${item.poster_path}` }}
                    className="w-full h-56"
                    resizeMode="cover"
                />
                <TouchableOpacity
                    className="absolute top-2 right-2 bg-black/50 p-2 rounded-full"
                    onPress={() => handleRemoveMovie(item.id)}
                >
                    <Ionicons name="trash-outline" size={20} color="#ef4444" />
                </TouchableOpacity>
            </View>
            <View className="p-3">
                <Text numberOfLines={1} className="text-white font-semibold text-sm mb-1">{item.title}</Text>
                <View className="flex-row items-center">
                    <Text className="text-yellow-500 text-xs mr-1">★</Text>
                    <Text className="text-gray-400 text-xs">{item.vote_average?.toFixed(1)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 pt-4 px-4 bg-slate-900">
                <View className="flex-row justify-between items-center mb-6 mt-2">
                    <View>
                        <Text className="text-3xl font-extrabold text-white tracking-tight">Watchlist</Text>
                        {user && <Text className="text-indigo-400 font-medium">{user.name}</Text>}
                    </View>

                </View>

                {user?.watchlist && user.watchlist.length > 0 ? (
                    <FlatList
                        data={user.watchlist}
                        renderItem={renderMovieItem}
                        keyExtractor={item => item.id.toString()}
                        numColumns={2}
                        showsVerticalScrollIndicator={false}
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        contentContainerStyle={{ paddingBottom: 20 }}
                        columnWrapperStyle={{ justifyContent: 'space-between' }}
                    />
                ) : (
                    <View className="flex-1 items-center justify-center -mt-20">
                        <View className="bg-slate-800 p-6 rounded-full mb-6">
                            <Text className="text-4xl">🎬</Text>
                        </View>
                        <Text className="text-gray-300 text-xl font-bold mb-2">No movies yet</Text>
                        <Text className="text-gray-500 text-center px-10 leading-6">
                            Your watchlist is empty. Add movies from the web app to see them here!
                        </Text>
                    </View>
                )}
            </View>
        </SafeAreaView>
    );
}
