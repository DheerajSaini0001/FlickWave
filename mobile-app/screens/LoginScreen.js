import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
import config from '../constants/config';

export default function LoginScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Please fill in all fields');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/users/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            console.log('Login successful:', data);
            navigation.navigate('Main', { user: data });
        } catch (error) {
            console.error('Login error:', error);
            Alert.alert('Login Failed', error.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView className="flex-1 bg-slate-900">
            <StatusBar barStyle="light-content" />
            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-10">
                    <Text className="text-5xl font-extrabold text-transparent bg-clip-text text-white tracking-widest">
                        FlickWave
                    </Text>
                    <Text className="text-indigo-400 mt-2 font-medium tracking-wide border-b border-indigo-400 pb-1">
                        MOVIE COMPANION
                    </Text>
                </View>

                <Text className="text-2xl font-bold text-white mb-2">Welcome Back</Text>
                <Text className="text-gray-400 mb-8">Sign in to access your watchlist</Text>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Email</Text>
                        <TextInput
                            className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500"
                            placeholder="Enter your email"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Password</Text>
                        <View className="relative">
                            <TextInput
                                className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500 pr-12"
                                placeholder="Enter your password"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                onPress={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-4"
                            >
                                <Ionicons name={showPassword ? "eye" : "eye-off"} size={24} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-2xl py-4 mt-6 shadow-lg shadow-indigo-600/30"
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? 'Signing In...' : 'Sign In'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-8">
                    <Text className="text-gray-400">New to FlickWave? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text className="text-indigo-400 font-bold">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
