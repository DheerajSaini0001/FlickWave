import { useTheme } from '../context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';

export default function ProfileScreen({ route, navigation }) {
    const { user: initialUser } = route.params || {};
    const [user, setUser] = useState(initialUser);
    const { colorScheme, toggleColorScheme } = useTheme();

    // ... (rest of the code)

    return (
        <SafeAreaView className="flex-1 bg-white dark:bg-slate-900">
            <StatusBar barStyle={colorScheme === 'dark' ? "light-content" : "dark-content"} />
            <View className="flex-1 px-6 pt-4">
                <View className="flex-row justify-between items-center mb-8">
                    <Text className="text-3xl font-extrabold text-slate-900 dark:text-white">Profile</Text>
                    <TouchableOpacity onPress={toggleColorScheme} className="bg-slate-200 dark:bg-slate-800 p-2 rounded-full">
                        <Ionicons name={colorScheme === 'dark' ? "sunny" : "moon"} size={24} color={colorScheme === 'dark' ? "#fbbf24" : "#6366f1"} />
                    </TouchableOpacity>
                </View>

                <View className="items-center mb-10">
                    <View className="w-24 h-24 rounded-full bg-slate-100 dark:bg-slate-800 border-2 border-indigo-500 items-center justify-center overflow-hidden mb-4 shadow-lg shadow-indigo-500/20">
                        {user?.picture ? (
                            <Image source={{ uri: user.picture }} className="w-full h-full" />
                        ) : (
                            <Text className="text-4xl">👤</Text>
                        )}
                    </View>
                    <Text className="text-2xl font-bold text-slate-900 dark:text-white">{user?.name || 'User Name'}</Text>
                    <Text className="text-slate-500 dark:text-gray-400 text-base">{user?.email || 'user@example.com'}</Text>
                    {user?.nickname && <Text className="text-indigo-500 dark:text-indigo-400 mt-1">@{user.nickname}</Text>}
                </View>

                <View className="bg-slate-100 dark:bg-slate-800 rounded-2xl p-4 mb-6">
                    <Text className="text-slate-500 dark:text-gray-400 text-sm mb-2 uppercase tracking-wider font-semibold">Account Details</Text>
                    <View className="flex-row justify-between py-3 border-b border-slate-200 dark:border-slate-700">
                        <Text className="text-slate-900 dark:text-white">Member Since</Text>
                        <Text className="text-slate-500 dark:text-gray-400">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}</Text>
                    </View>
                    <View className="flex-row justify-between py-3">
                        <Text className="text-slate-900 dark:text-white">Watchlist Items</Text>
                        <Text className="text-slate-500 dark:text-gray-400">{user?.watchlist?.length || 0}</Text>
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
