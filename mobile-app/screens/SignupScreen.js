import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, ScrollView, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
// import axios from 'axios';
import config from '../constants/config';

export default function SignupScreen({ navigation }) {
    const [name, setName] = useState('');
    const [nickname, setNickname] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
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
            <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }} className="px-8">
                <View className="mb-8">
                    <Text className="text-3xl font-bold text-white mb-2">Create Account</Text>
                    <Text className="text-gray-400">Join FlickWave today</Text>
                </View>

                <View className="space-y-4">
                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Full Name</Text>
                        <TextInput
                            className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500"
                            placeholder="John Doe"
                            placeholderTextColor="#64748b"
                            value={name}
                            onChangeText={setName}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Nickname (Optional)</Text>
                        <TextInput
                            className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500"
                            placeholder="Johnny"
                            placeholderTextColor="#64748b"
                            value={nickname}
                            onChangeText={setNickname}
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Email</Text>
                        <TextInput
                            className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500"
                            placeholder="john@example.com"
                            placeholderTextColor="#64748b"
                            value={email}
                            onChangeText={setEmail}
                            autoCapitalize="none"
                            keyboardType="email-address"
                        />
                    </View>

                    <View>
                        <Text className="text-gray-400 mb-2 ml-1">Password</Text>
                        <TextInput
                            className="bg-slate-800 text-white rounded-2xl px-5 py-4 border border-slate-700 focus:border-indigo-500"
                            placeholder="••••••••"
                            placeholderTextColor="#64748b"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                        />
                    </View>

                    <TouchableOpacity
                        className="bg-indigo-600 rounded-2xl py-4 mt-6 shadow-lg shadow-indigo-600/30"
                        onPress={handleSignup}
                        disabled={loading}
                        activeOpacity={0.8}
                    >
                        <Text className="text-white text-center font-bold text-lg">
                            {loading ? 'Creating Account...' : 'Sign Up'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View className="flex-row justify-center mt-8 mb-4">
                    <Text className="text-gray-400">Already have an account? </Text>
                    <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                        <Text className="text-indigo-400 font-bold">Sign In</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}
