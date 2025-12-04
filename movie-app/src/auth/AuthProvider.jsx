import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

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

    const sendOtp = async (email) => {
        try {
            await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/send-otp`, { email });
            return true;
        } catch (error) {
            console.error("Failed to send OTP:", error);
            return false;
        }
    };

    const login = async (email, otp, nickname) => {
        try {
            const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/users/login`, {
                email,
                otp,
                nickname
            });

            const userData = res.data;
            setUser(userData);
            setIsAuthenticated(true);
            localStorage.setItem('flickwave_user', JSON.stringify(userData));
            return true;
        } catch (error) {
            console.error("Login failed:", error);
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setIsAuthenticated(false);
        localStorage.removeItem('flickwave_user');
        navigate('/');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, login, logout, sendOtp, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
