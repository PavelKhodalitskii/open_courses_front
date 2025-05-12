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

    const checkAuth = async () => {
        setLoading(true)
        try {
            const response = await apiClient.get('/auths/session_based_auths/check_auth/');
            let user: User = {
                id: response.data.user.id,
                username: response.data.user.username,
                first_name: response.data.user.first_name,
                last_name: response.data.user.last_name,
                email: response.data.user.email
            };
            console.log(user);
            login(user);
        } catch (error) {
            logout();
            console.error('Невозможно авторизировать пользователя', error);
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }
        checkAuth();
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