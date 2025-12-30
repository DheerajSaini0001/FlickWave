import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
import config from '../constants/config';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        if (!name || !email || !password) {
            Alert.alert('Error', 'Please fill in Name, Email and Password');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${config.API_URL}/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    name,
                    nickname,
                    email,
                    password
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Something went wrong');
            }

            console.log('Signup successful:', data);
            Alert.alert('Success', 'Account created! Please login.');
            navigation.navigate('Login');
        } catch (error) {
            console.error('Signup error:', error);
            Alert.alert('Signup Failed', error.message || 'Something went wrong');
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

            <View className="px-8 mt-4 w-full">
                <TouchableOpacity
                    onPress={() => navigation.goBack()}
                    className="w-10 h-10 bg-slate-800 rounded-full items-center justify-center"
                >
                    <Ionicons name="arrow-back" size={24} color="white" />
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingBottom: 40 }} className="px-8">
                <View className="mb-8 mt-4">


                    <Text className="text-3xl font-bold text-white mb-2 tracking-wide">Create Account</Text>
                    <Text className="text-gray-400 text-base">Join FlickWave regarding to start your journey</Text>
                </View>

                <View className="space-y-5">
                    <View>
                        <Text className="text-gray-400 mb-2 ml-1 font-medium text-sm">Full Name</Text>
                        <View className="flex-row items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 focus:border-indigo-500">
                            <Ionicons name="person-outline" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="John Doe"
                                placeholderTextColor="#64748b"
                                value={name}
                                onChangeText={setName}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1 font-medium text-sm">Nickname (Optional)</Text>
                        <View className="flex-row items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 focus:border-indigo-500">
                            <Ionicons name="happy-outline" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="Johnny"
                                placeholderTextColor="#64748b"
                                value={nickname}
                                onChangeText={setNickname}
                            />
                        </View>
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1 font-medium text-sm">Email Address</Text>
                        <View className="flex-row items-center bg-slate-800/80 border border-slate-700 rounded-2xl px-4 py-3 focus:border-indigo-500">
                            <Ionicons name="mail-outline" size={20} color="#94a3b8" style={{ marginRight: 10 }} />
                            <TextInput
                                className="flex-1 text-white text-base"
                                placeholder="john@example.com"
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
                                placeholder="••••••••"
                                placeholderTextColor="#64748b"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color="#94a3b8" />
                            </TouchableOpacity>
                        </View>
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-2xl py-4 mt-6 shadow-lg shadow-indigo-500/40"
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text className="text-white text-center font-bold text-lg tracking-wide">
                                Create Account
                            </Text>
                        )}
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-8 mb-4">
                    <Text className="text-slate-400">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-indigo-400 font-bold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
