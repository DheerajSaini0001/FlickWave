import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StatusBar, ActivityIndicator } from 'react-native';
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
            await SecureStore.setItemAsync('user_session', JSON.stringify(data));

            // Reset navigation stack so user cannot go back to login
            navigation.reset({
                index: 0,
                routes: [{ name: 'Main', params: { user: data } }],
            });
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

            {/* Decorative Background Elements */}
            <View className="absolute top-[-50] left-[-50] w-60 h-60 bg-indigo-500 rounded-full opacity-20" />
            <View className="absolute top-[20%] right-[-30] w-40 h-40 bg-purple-500 rounded-full opacity-20" />
            <View className="absolute bottom-[-20] right-[-20] w-72 h-72 bg-indigo-600 rounded-full opacity-10" />

            <View className="flex-1 justify-center px-8">
                <View className="items-center mb-12">
                    <View className="w-20 h-20 bg-indigo-500/20 rounded-3xl items-center justify-center mb-4 border border-indigo-500/30">
                        <Ionicons name="film-outline" size={40} color="#818cf8" />
                    </View>
                    <Text className="text-4xl font-extrabold text-white tracking-wider">
                        FlickWave
                    </Text>
                    <Text className="text-indigo-400 font-medium tracking-[0.2em] text-xs mt-2 uppercase">
                        Your Ultimate Movie Companion
                    </Text>
                </View>

                <View className="space-y-6">
                    <View>
                        <Text className="text-gray-400 mb-2 ml-1 font-medium text-sm">Email Address</Text>
                        <View className="flex-row items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 focus:border-indigo-500 focus:bg-slate-800 transition-all">
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="name@example.com"
                                placeholderTextColor="#64748b"
                                value={email}
                                onChangeText={setEmail}
                                autoCapitalize="none"
                                keyboardType="email-address"
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1 font-medium text-sm">Password</Text>
                        <View className="flex-row items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 focus:border-indigo-500">
                            <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="Enter your password"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                        <TouchableOpacity className="self-end mt-2">
                            <Text className="text-indigo-400 text-xs font-medium">Forgot Password?</Text>
                        </TouchableOpacity>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-2xl py-4 mt-4 shadow-lg shadow-indigo-500/40"
                        onPress={handleLogin}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-bold text-lg tracking-wide">
                                Sign In
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-10">
                    <Text className="text-slate-400">Don't have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
                        <Text className="text-indigo-400 font-bold">Create Account</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
}
