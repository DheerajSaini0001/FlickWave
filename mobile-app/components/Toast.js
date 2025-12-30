import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export const Toast = ({ visible, message, type = 'success', onHide }) => {
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(opacity, {
                    toValue: 1,
                    duration: 300,
                    useNativeDriver: true,
                }),
                Animated.delay(2000),
                Animated.timing(opacity, {
                    toValue: 0,
                    duration: 300,
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onHide) onHide();
            });
        }
    }, [visible]);

    if (!visible) return null;

    const bgColor = type === 'success' ? '#10b981' : '#ef4444'; // green-500 : red-500
    const iconName = type === 'success' ? 'checkmark-circle' : 'alert-circle';

    return (
        <Animated.View style={[styles.container, { opacity, backgroundColor: bgColor }]}>
            <Ionicons name={iconName} size={24} color="white" />
            <Text style={styles.text}>{message}</Text>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 100,
        left: 20,
        right: 20,
        padding: 16,
        borderRadius: 12,
        flexDirection: 'row',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.30,
        shadowRadius: 4.65,
        elevation: 8,
        zIndex: 1000,
    },
    text: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
        marginLeft: 10,
    }
});
