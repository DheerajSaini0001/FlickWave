import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import WatchlistScreen from '../screens/WatchlistScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { Text, View } from 'react-native';

const Tab = createBottomTabNavigator();

function TabIcon({ focused, icon }) {
    return (
        <View className="items-center justify-center">
            <Text className="text-2xl">{icon}</Text>
        </View>
    );
}

export default function TabNavigator({ route }) {
    const { user } = route.params || {};

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarStyle: {
                    backgroundColor: '#0f172a', // slate-900 (darker to match screen bg or slightly different)
                    borderTopWidth: 1,
                    borderTopColor: '#1e293b', // slate-800
                    height: 80, // Taller proper tab bar
                    paddingTop: 10,
                },
                tabBarShowLabel: true, // Show labels
                tabBarActiveTintColor: '#818cf8', // Indigo-400
                tabBarInactiveTintColor: '#94a3b8', // Slate-400
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '600',
                    marginBottom: 5,
                }
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeScreen}
                initialParams={{ user }}
                options={{
                    title: 'Home',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🏠" />
                }}
            />
            <Tab.Screen
                name="WatchlistTab"
                component={WatchlistScreen}
                initialParams={{ user }}
                options={{
                    title: 'Watchlist',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="🎬" />,
                    tabBarBadge: user?.watchlist?.length > 0 ? user.watchlist.length : null,
                }}
            />
            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                initialParams={{ user }}
                options={{
                    title: 'Profile',
                    tabBarIcon: ({ focused }) => <TabIcon focused={focused} icon="👤" />
                }}
            />

        </Tab.Navigator>
    );
}
