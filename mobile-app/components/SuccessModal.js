import React, { useEffect, useState } from 'react';
import { View, Text, Modal, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function SuccessModal({ visible, onClose, message = "Account Created Successfully!" }) {
    const [animation] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.spring(animation, {
                toValue: 1,
                useNativeDriver: true,
                speed: 10,
                bounciness: 10,
            }).start();
        } else {
            animation.setValue(0);
        }
    }, [visible]);

    if (!visible) return null;

    const scale = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0.8, 1],
    });

    const opacity = animation;

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 justify-center items-center bg-black/60 px-6">
                <Animated.View
                    style={{ transform: [{ scale }], opacity }}
                    className="w-full bg-slate-900 border border-indigo-500/30 rounded-3xl p-6 items-center shadow-2xl shadow-indigo-500/20"
                >
                    <View className="w-20 h-20 bg-green-500/20 rounded-full items-center justify-center mb-6 border border-green-500/30">
                        <Ionicons name="checkmark" size={40} color="#4ade80" />
                    </View>

                    <Text className="text-2xl font-bold text-white mb-2 text-center">
                        Welcome Aboard!
                    </Text>

                    <Text className="text-slate-400 text-center mb-8 leading-relaxed">
                        {message}
                    </Text>

                    <TouchableOpacity
                        onPress={onClose}
                        className="w-full bg-indigo-600 py-4 rounded-xl shadow-lg shadow-indigo-600/30"
                        activeOpacity={0.8}
                    >
                        <Text className="text-white font-bold text-center text-lg">
                            Continue to Login
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );
}
