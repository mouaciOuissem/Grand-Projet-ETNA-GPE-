import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<{ username?: string; id?: number; role_id?: number } | null>(null);
    const [isChecking, setIsChecking] = useState<boolean>(true); // Loading state
    const router = useRouter();
    const pathname = usePathname();

    const getApiUrl = () => {
        if (typeof window !== 'undefined') {
            if (window.location.hostname === 'localhost') {
                return 'http://localhost:3000/api';
            } else if (window.location.hostname === 'recette.snl-corp.fr') {
                return 'https://recette.snl-corp.fr/api';
            } else if (window.location.hostname === 'preprod.snl-corp.fr') {
                return 'https://preprod.snl-corp.fr/api';
            } else {
                return 'https://www.snl-corp.fr/api';
            }
        } else {
            return process.env.NEXT_PUBLIC_SNL_URL_API || 'https://www.snl-corp.fr/api';
        }
    };

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

    // Fonction pour gérer la redirection
    const handleRedirection = (isAuthPage: boolean, isAuth: boolean) => {
        if (isAuthPage && !isAuth) {
            router.push('/auth/login');
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            setIsChecking(true); // Start checking
            const isAuthPage = ['/dashboard', '/document', '/profile', '/parametres'].includes(pathname);

            try {
                const { ok, isAuthenticated, user } = await checkCookie();

                if (ok && isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserInfo(user);
                } else {
                    setIsAuthenticated(false);
                    setUserInfo(null);
                }

                // Gérer la redirection après le check du cookie
                handleRedirection(isAuthPage, isAuthenticated);
            } catch (error) {
                console.error('Error checking authentication:', error);
                setIsAuthenticated(false);
                setUserInfo(null);

                // Gérer la redirection en cas d'erreur
                handleRedirection(isAuthPage, false);
            } finally {
                setIsChecking(false); // Authentication check completed
            }
        };

        checkAuth();
    }, [router, pathname]);

    // Return `isChecking` so you can use it to show loading state in your pages
    return { isAuthenticated, userInfo, isChecking };
};

export default useAuthCheck;
