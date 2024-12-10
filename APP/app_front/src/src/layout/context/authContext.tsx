import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useApi } from '@/src/layout/context/apiContext';

interface AuthContextType {
    isAuthenticated: boolean | null;
    userInfo: { username?: string; id?: number; role_id?: number } | null;
    isChecking: boolean;
    setIsAuthenticated: (authStatus: boolean | null) => void;
    setUserInfo: (userInfo: { username?: string; id?: number; role_id?: number } | null) => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<{ username?: string; id?: number; role_id?: number } | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(true);
    const [checkCompleted, setCheckCompleted] = useState<boolean>(false);
    const router = useRouter();
    const pathname = usePathname();
    const { getApiUrl } = useApi();


    // Fonction pour vérifier le cookie
    const checkCookie = async () => {
        const apiUrl = getApiUrl();
        const response = await fetch(`${apiUrl}/auth/check-cookie`, {
            method: 'GET',
            credentials: 'include',
        });
        const data = await response.json();
        return { ok: response.ok, isAuthenticated: data.isAuthenticated, user: data.user || null };
    };

    const handleRedirection = (isAuthPage: boolean, isAuth: boolean) => {
        if (checkCompleted && isAuthPage && !isAuth) {
            router.push('/auth/login');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsChecking(true);
            const protectedRoutes = ['/dashboard', '/document', '/profile', '/parametres', '/processus'];
            const isAuthPage = protectedRoutes.includes(pathname);

            try {
                const { ok, isAuthenticated, user } = await checkCookie();

                if (ok && isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserInfo(user);
                } else {
                    setIsAuthenticated(false);
                    setUserInfo(null);
                }

                if (!isAuthenticated && isAuthPage) {
                    router.push('/auth/login');
                }
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
                setUserInfo(null);
                if (isAuthPage) {
                    router.push('/auth/login');
                }
            } finally {
                setIsChecking(false);
            }
        };

        checkAuth();
    }, [router, pathname]);

    const logout = () => {
        setIsAuthenticated(null);
        setUserInfo(null);
    };

    return (
        <AuthContext.Provider value={{ 
            isAuthenticated, 
            userInfo,
            isChecking,
            setIsAuthenticated, 
            setUserInfo, 
            logout 
        }}>
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

export { AuthContext };