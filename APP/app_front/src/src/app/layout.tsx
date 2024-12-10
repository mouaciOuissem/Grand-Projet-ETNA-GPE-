// src/layout/RootLayout.tsx
'use client';
import { LayoutProvider } from '@/src/layout/context/layoutcontext';
import { PrimeReactProvider } from 'primereact/api';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';
import '@/src/styles/layout/layout.scss';
import '@/src/styles/scss/Styles.scss';
import '@/src/styles/layout/register.scss';
import { AuthProvider, useAuth } from '@/src/layout/context/authContext';
import { ApiProvider } from '@/src/layout/context/apiContext';
import { UserProvider } from '@/src/layout/context/userContext';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';

interface RootLayoutProps {
    children: React.ReactNode;
}

const AuthenticatedRootLayout = ({ children }: { children: React.ReactNode }) => {
    const { isAuthenticated, isChecking } = useAuth();
    const router = useRouter();
    const pathname = usePathname();

    const isAuthPage = ['/dashboard', '/document', '/profile', '/parametres'].includes(pathname);

    useEffect(() => {
        if (isAuthenticated === null && !isChecking) {
            if (isAuthPage) {
                router.push('/auth/login');
            }
        }
    }, [isAuthenticated, isChecking, router, isAuthPage]);

    if (isChecking) {
        return (
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
        );
    }

    return <>{children}</>;
};

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" suppressHydrationWarning>
            <head>
                <link id="theme-css" href={`/themes/bootstrap4-dark-purple/theme.css`} rel="stylesheet"></link>
            </head>
            <body>
                <PrimeReactProvider>
                    <ApiProvider>
                        <AuthProvider>
                            <UserProvider>
                                <LayoutProvider>
                                    <AuthenticatedRootLayout>
                                        {children}
                                    </AuthenticatedRootLayout>
                                </LayoutProvider>
                            </UserProvider>
                        </AuthProvider>
                    </ApiProvider>
                </PrimeReactProvider>
            </body>
        </html>
    );
}
