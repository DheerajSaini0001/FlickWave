import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen({ route, navigation }) {
    const { user } = route.params || {};

    const handleLogout = () => {
        navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 px-6 pt-4">
                <Text className="text-3xl font-extrabold text-white mb-8">Profile</Text>

                <View className="items-center mb-10">
                    <View className="w-24 h-24 rounded-full bg-slate-800 border-2 border-indigo-500 items-center justify-center overflow-hidden mb-4 shadow-lg shadow-indigo-500/20">
                        {user?.picture ? (
                            <Image source={{ uri: user.picture }} className="w-full h-full" />
                        ) : (
                            <Text className="text-4xl">👤</Text>
                        )}
                    </View>
                    <Text className="text-2xl font-bold text-white">{user?.name || 'User Name'}</Text>
                    <Text className="text-gray-400 text-base">{user?.email || 'user@example.com'}</Text>
                    {user?.nickname && <Text className="text-indigo-400 mt-1">@{user.nickname}</Text>}
                </View>

                <View className="bg-slate-800 rounded-2xl p-4 mb-6">
                    <Text className="text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Account Details</Text>
                    <View className="flex-row justify-between py-3 border-b border-slate-700">
                        <Text className="text-white">Member Since</Text>
                        <Text className="text-gray-400">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Text>
                    </View>
                    <View className="flex-row justify-between py-3">
                        <Text className="text-white">Watchlist Items</Text>
                        <Text className="text-gray-400">{user?.watchlist?.length || 0}</Text>
                    </View>
                </View>

                <TouchableOpacity
                    className="bg-red-500/10 border border-red-500/50 rounded-xl py-4 items-center"
                    onPress={handleLogout}
                    activeOpacity={0.7}
                >
                    <Text className="text-red-500 font-bold text-lg">Log Out</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
