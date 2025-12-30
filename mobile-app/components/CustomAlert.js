import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../context/ThemeContext';

export const CustomAlert = ({
    visible,
    title,
    message,
    onCancel,
    onConfirm,
    confirmText = "Confirm",
    cancelText = "Cancel",
    type = "danger",
    icon
}) => {
    const { colorScheme } = useTheme();
    const isDark = colorScheme === 'dark';

    const getIconName = () => {
        if (icon) return icon;
        if (type === 'danger') return "trash-outline";
        if (type === 'success') return "checkmark-circle-outline";
        return "information-circle-outline";
    };

    const getColors = () => {
        if (type === 'danger') return { primary: '#ef4444', bg: '#fee2e2' };
        if (type === 'success') return { primary: '#10b981', bg: '#d1fae5' };
        return { primary: '#6366f1', bg: '#e0e7ff' }; // indigo
    };

    const colors = getColors();

    return (
        <Modal
            transparent
            visible={visible}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={[
                    styles.alertBox,
                    { backgroundColor: isDark ? '#1e293b' : 'white', borderColor: isDark ? '#334155' : '#e2e8f0' }
                ]}>
                    <View style={[styles.iconContainer, { backgroundColor: isDark ? `${colors.primary}20` : colors.bg }]}>
                        <Ionicons
                            name={getIconName()}
                            size={32}
                            color={colors.primary}
                        />
                    </View>

                    <Text style={[styles.title, { color: isDark ? 'white' : '#0f172a' }]}>{title}</Text>
                    <Text style={[styles.message, { color: isDark ? '#94a3b8' : '#64748b' }]}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            onPress={onCancel}
                            style={[
                                styles.cancelButton,
                                { backgroundColor: isDark ? '#334155' : '#f1f5f9' }
                            ]}
                            activeOpacity={0.8}
                        >
                            <Text style={[styles.cancelButtonText, { color: isDark ? '#cbd5e1' : '#475569' }]}>{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            style={[styles.confirmButton, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
                            activeOpacity={0.8}
                        >
                            <Text style={styles.confirmButtonText}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker overlay for better focus
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    alertBox: {
        borderRadius: 24,
        padding: 24,
        width: '100%',
        maxWidth: 320,
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 10 },
        shadowOpacity: 0.3,
        shadowRadius: 20,
        elevation: 10,
        borderWidth: 1,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
        letterSpacing: 0.5,
    },
    message: {
        fontSize: 15,
        textAlign: 'center',
        marginBottom: 28,
        lineHeight: 22,
    },
    buttonContainer: {
        flexDirection: 'row',
        width: '100%',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        fontWeight: '600',
        fontSize: 16,
    },
    confirmButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    confirmButtonText: {
        color: 'white',
        fontWeight: '600',
        fontSize: 16,
    }
});
