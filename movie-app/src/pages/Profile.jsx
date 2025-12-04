import React from 'react';
import { useAuth0 } from "@auth0/auth0-react";
import Loader from '../components/Loader';

const Profile = () => {
    const { user, isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <Loader />;
    }

    return (
        isAuthenticated && (
            <div className="container mx-auto px-4 py-8 pt-24 min-h-screen flex justify-center items-start">
                <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-xl max-w-lg w-full text-center border border-gray-200 dark:border-gray-700">
                    <img src={user.picture} alt={user.name} className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-red-500 shadow-md" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">{user.name}</h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">{user.email}</p>

                    {user.nickname && (
                        <p className="text-gray-500 dark:text-gray-500 mb-4">@{user.nickname}</p>
                    )}
                </div>
            </div>
        )
    );
};

export default Profile;
