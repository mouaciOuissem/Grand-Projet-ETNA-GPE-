import React, { createContext, useState, useEffect, ReactNode, FC } from 'react';
import CookieManager from '@react-native-cookies/cookies';

// Define the shape of the AuthContext
interface AuthContextType {
    isLoggedIn: boolean;
    userId: string | null;
    loading: boolean;
    setIsLoggedIn: (loggedIn: boolean) => void;
    setUserId: (id: string | null) => void;
    setLoading: (loading: boolean) => void;
}

// Create the context with a default value
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Define a type for the props expected by AuthProvider
interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userId, setUserId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true); // Nouvel état de chargement

    useEffect(() => {
        // Check if user is authenticated by verifying the presence of a specific cookie
        const checkAuthentication = async () => {
            try {
                const authCookie = await CookieManager.get('https://www.test.snl-corp.fr');
                if (authCookie['authToken']) {
                    setIsLoggedIn(true);
                    console.log("User is authenticated");
                } else {
                    setIsLoggedIn(false);
                    setUserId(null);
                    console.log("User is not authenticated");
                }
            } catch (error) {
                console.error('Error retrieving cookie:', error);
                setIsLoggedIn(false);
                setUserId(null);
            } finally {
                setLoading(false); // Assurez-vous que le chargement est arrêté ici
            }
        };

        checkAuthentication();
    }, []);

    return (
        <AuthContext.Provider value={{ isLoggedIn, userId, setIsLoggedIn, setUserId, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
