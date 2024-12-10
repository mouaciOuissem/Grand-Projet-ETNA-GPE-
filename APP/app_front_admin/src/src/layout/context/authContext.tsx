import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import useAuthCheck from '@/src/hooks/useAuthCheck';

interface AuthContextType {
    isAuthenticated: boolean | null;
    userInfo: { username?: string; id?: number , role_id?: number} | null;
    setIsAuthenticated: (authStatus: boolean | null) => void;
    setUserInfo: (userInfo: { username?: string; id?: number, role_id?: number} | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const { isAuthenticated, userInfo } = useAuthCheck();

    // State for authentication status and user info
    const [authStatus, setAuthStatus] = useState<boolean | null>(isAuthenticated);
    const [user, setUser] = useState<{ username?: string; id?: number, role_id?: number } | null>(userInfo);

    // Update state when auth status or user info changes
    useEffect(() => {
        setAuthStatus(isAuthenticated);
        setUser(userInfo);
    }, [isAuthenticated, userInfo]);

    // Setter functions to update the context state
    const setIsAuthenticated = (authStatus: boolean | null) => {
        setAuthStatus(authStatus);
    };

    const setUserInfo = (userInfo: { username?: string; id?: number, role_id?: number } | null) => {
        setUser(userInfo);
    };

    const logout = () => {
        setAuthStatus(null);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated: authStatus, userInfo: user, setIsAuthenticated, setUserInfo, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
