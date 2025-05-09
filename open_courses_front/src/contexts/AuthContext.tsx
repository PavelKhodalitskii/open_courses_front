import { createContext, useContext, useEffect, useState } from 'react';
import User from '@/dataclasses/user'
import apiClient from '@/api/client';

type AuthContextType = {
    user: User | null;
    loading: boolean;
    login: (userData: User) => void;
    checkAuth: () => void;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    // const checkAuth = async () => {
    //     try {
    //         setLoading(true);
    //         const response = await apiClient.get('/auths/session_based_auths/check_auth/');
    //         const userData = response.data;
    //         login(userData);
    //     } catch (error) {
    //         localStorage.removeItem("user");
    //         setUser(null);
    //     } finally {
    //         setLoading(false);
    //     }
    // };

    useEffect(() => {
        setLoading(true);
        const user = localStorage.getItem("user");
        if (user) setUser(JSON.parse(user));
        setLoading(false);
    }, [])

    const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };
  
    const logout = async () => {
        try {
            await apiClient.post('/auths/session_based_auths/logout/')
            document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            document.cookie = 'X-CSRFToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };
  
    return (
        <AuthContext.Provider value={{ user, login, loading, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};