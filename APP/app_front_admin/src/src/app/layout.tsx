'use client';
import { LayoutProvider } from '@/src/layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/src/styles/layout/layout.scss';
import '@/src/styles/scss/Styles.scss';
import '@/src/styles/layout/register.scss';
import { usePathname, useRouter , useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

import useAuthCheck from '@/src/hooks/useAuthCheck';
import { ApiProvider  } from '@/src/layout/context/apiContext';
import { AuthProvider } from '@/src/layout/context/authContext';
import { UserProvider } from '@/src/layout/context/UserContext';

interface RootLayoutProps {
    children: React.ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
    const { isAuthenticated, userInfo } = useAuthCheck();
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const isAuthPage = pathname === '/dashboard' || pathname === '/document' || pathname === '/profile' || pathname === '/parametres';

    useEffect(() => {
        if (isAuthenticated === false) {
            // Redirect to login with the original path as a query parameter
            const redirectTo = encodeURIComponent(pathname);
            router.push(`/auth/login?redirectTo=${redirectTo}`);
        } else if (isAuthenticated === true && userInfo.role_id !== 1) {
            // Redirect to /auth/access if userId is not 1
            router.push('/auth/access');
        }
    }, [isAuthenticated, userInfo, router, pathname]);

    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/prsy-adm/themes/bootstrap4-dark-purple/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                {(isAuthenticated === null || isAuthenticated === false) && isAuthPage ? (
                    <div className="loading-screen">
                        <div className="loader">
                            <div className="loader-inner">
                                <div className="loader-line-wrap">
                                    <div className="loader-line"></div>
                                </div>
                                <div className="loader-line-wrap">
                                    <div className="loader-line"></div>
                                </div>
                                <div className="loader-line-wrap">
                                    <div className="loader-line"></div>
                                </div>
                                <div className="loader-line-wrap">
                                    <div className="loader-line"></div>
                                </div>
                                <div className="loader-line-wrap">
                                    <div className="loader-line"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <PrimeReactProvider>
                        <ApiProvider> 
                            <AuthProvider>
                                <UserProvider>
                                    <LayoutProvider>
                                        {children}
                                    </LayoutProvider>
                                </UserProvider>
                            </AuthProvider>
                        </ApiProvider>
                    </PrimeReactProvider>
                )}
            </body>
        </html>
    );
}
