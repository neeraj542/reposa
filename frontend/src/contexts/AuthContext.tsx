import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface User {
    id: number;
    github_id: number;
    username: string;
    email: string;
    avatar_url: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    loginWithGithub: () => void;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                // Ensure cookies are sent with the request
                const response = await axios.get(`${API_BASE_URL}/auth/me`, {
                    withCredentials: true
                });
                setUser(response.data);
            } catch (error) {
                // Silent error for non-logged in users
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();

        // Re-check auth when window regains focus (after GitHub redirect)
        const handleFocus = () => {
            checkAuth();
        };

        window.addEventListener('focus', handleFocus);
        return () => window.removeEventListener('focus', handleFocus);
    }, []);

    const loginWithGithub = () => {
        window.location.href = `${API_BASE_URL}/auth/github`;
    };

    const logout = async () => {
        try {
            await axios.post(`${API_BASE_URL}/auth/logout`, {}, {
                withCredentials: true
            });
            setUser(null);
        } catch (error) {
            console.error('Logout failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, loginWithGithub, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
