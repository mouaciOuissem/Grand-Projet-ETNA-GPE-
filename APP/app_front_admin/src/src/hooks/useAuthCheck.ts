import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';

const useAuthCheck = () => {
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<{ username?: string; id?: number, role_id?: number} | null>(null);
    const router = useRouter();
    const pathname = usePathname();

    const getApiUrl = () => {
        if (typeof window !== 'undefined') {
            // côté client
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
            // côté serveur
            return process.env.NEXT_PUBLIC_SNL_URL_API || 'https://www.snl-corp.fr/api';
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            const isAuthPage = pathname === '/dashboard' || pathname === '/document' || pathname === '/profile' || pathname === '/parametres';
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/auth/check-cookie`, {
                    method: 'GET',
                    credentials: 'include',
                });
                const data = await response.json();

                if (response.ok) {
                    if (data.isAuthenticated) {
                        setIsAuthenticated(true);
                        setUserInfo(data.user || null);
                    } else {
                        setIsAuthenticated(false);
                        setUserInfo(null);
                        if (isAuthPage) {
                            router.push('/auth/login');
                        }
                    }
                } else {
                    console.error('Failed to authenticate, redirecting to login.');
                    setIsAuthenticated(false);
                    setUserInfo(null);
                    if (isAuthPage) {
                        router.push('/auth/login');
                    }
                }
            } catch (error) {
                console.error('User not authenticated, redirecting to login.', error);
                setIsAuthenticated(false);
                setUserInfo(null);
                if (isAuthPage) {
                    router.push('/auth/login');
                }
            }
        };

        checkAuth();
    }, [router, pathname]);

    return { isAuthenticated, userInfo };
};

export default useAuthCheck;
