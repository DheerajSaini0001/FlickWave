import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { API_URL } from '../api/backend';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const storedUser = localStorage.getItem('flickwave_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            setIsAuthenticated(true);
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        try {
            const res = await axios.post(`${API_URL}/users/login`, {
                email,
                password
            });

            const userData = res.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('flickwave_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Login failed:", error);
            return { success: false, message: error.response?.data?.message || 'Login failed' };
        }
    };

    const signup = async (email, password, name, nickname) => {
        try {
            const res = await axios.post(`${API_URL}/users/signup`, {
                email,
                password,
                name,
                nickname
            });

            const userData = res.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('flickwave_user', JSON.stringify(userData));
            return { success: true };
        } catch (error) {
            console.error("Signup failed:", error);
            return { success: false, message: error.response?.data?.message || 'Signup failed' };
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('flickwave_user');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, signup, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
