import { createContext, useContext, useEffect, useState } from 'react';
import User from '@/dataclasses/user'

type AuthContextType = {
    user: User | null;
    login: (userData: User) => void;
    logout: () => Promise<void>; // Делаем logout асинхронным
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
  
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) setUser(JSON.parse(savedUser));
    }, [])

    const login = (userData: User) => {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
    };
  
    const logout = async () => {
        try {
            await fetch('/auths/session_based_auths/logout/', {
                method: 'POST',
                credentials: 'include',
            });

            document.cookie = 'sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
            localStorage.removeItem("user");
            setUser(null);
        } catch (error) {
            console.error('Ошибка при выходе:', error);
        }
    };
  
    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
};