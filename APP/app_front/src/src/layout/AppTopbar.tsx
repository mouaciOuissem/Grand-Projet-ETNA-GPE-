import Link from 'next/link';
import { Ripple } from 'primereact/ripple';
import { Button } from 'primereact/button';
import { useRouter } from 'next/navigation';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useImperativeHandle, useRef, useState, useEffect  } from 'react';
import { AppTopbarRef } from '@/src/types';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { PrimeReactContext } from 'primereact/api';

import { useAuth } from '@/src/layout/context/authContext';
import { useUser } from '@/src/layout/context/userContext';
import { useApi  } from '@/src/layout/context/apiContext';

import { Menubar } from 'primereact/menubar';
import { Badge } from 'primereact/badge';
import { Avatar } from 'primereact/avatar';  
import { OverlayPanel } from 'primereact/overlaypanel';

const AppTopbar = forwardRef<AppTopbarRef>((props, ref) => {
    const { layoutConfig, setLayoutConfig } = useContext(LayoutContext);
    const [isHidden, setIsHidden] = useState(false);
    const router = useRouter();
    const { changeTheme } = useContext(PrimeReactContext);
    const [isLightTheme, setIsLightTheme] = useState(false);
    const { isAuthenticated, userInfo } = useAuth();
    // const [userData, setUserData] = useState<any>(null);
    const { userData, fetchUserData } = useUser();
    const { getApiUrl } = useApi();
    const overlayRef = useRef(null);

    const itemRenderer = (item) => (
        <a className="flex align-items-center p-menuitem-link">
            <span className={item.icon} />
            <span className="mx-2">{item.label}</span>
            {item.badge && <Badge className="ml-auto" value={item.badge} />}
            {item.shortcut && <span className="ml-auto border-1 surface-border border-round surface-100 text-xs p-1">{item.shortcut}</span>}
        </a>
    );

    // Function to change theme
    const _changeTheme = (theme: string, colorScheme: string) => {
        changeTheme?.(layoutConfig.theme, theme, 'theme-css', () => {
            setLayoutConfig((prevState) => ({ ...prevState, theme, colorScheme }));
        });
    };

    // Handle theme change
    const handleThemeChange = () => {
        const newTheme = !isLightTheme;
        setIsLightTheme(newTheme);
        _changeTheme(
            newTheme ? 'bootstrap4-light-purple' : 'bootstrap4-dark-purple',
            newTheme ? 'light' : 'dark'
        );
    };

    // Handle logout
    const handleLogout = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/auth/logout/`, {
                method: "POST",
                credentials: 'include',
                mode: 'cors',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });
    
            if (!response.ok) {
                throw new Error('Logout failed');
            }

        router.replace('/');
        window.location.reload();
        
        } catch (error) {
            console.error('Error logging out:', error);
        }
    };


    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const handleMenuToggle = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    // useEffect(() => {
    //     if (isAuthenticated && !userData) {
    //         fetchUserData(userInfo.id); 
    //     }
    // }, [isAuthenticated, userData, fetchUserData]);
    
    const menuItems = [
        
        {
            // label: 'Message',
            icon: 'pi pi-envelope',
            badge: 3,
            template: itemRenderer
        },
        {
            label: userData?.username,
            // icon: 'pi pi-fw pi-user',
            template: () => (
                <div
                    className={classNames('flex align-items-center p-menuitem-link', {
                        'surface-hover': isMenuOpen
                    })}
                    onClick={handleMenuToggle}
                    style={{ cursor: 'pointer' }} 
                >
                    <Avatar
                        image='/layout/images/login/profil.png'
                        shape="circle"
                    />
                    <span className="ml-2">{userData?.username}</span>
                    <span
                        className={classNames('pi pi-fw ml-2', {
                            'pi-angle-down': !isMenuOpen,
                            'pi-angle-up': isMenuOpen 
                        })}
                    ></span>
                </div>
            ),
            items: [
                ...(userInfo && userInfo.role_id === 1 ? [
                    {
                        label: 'Admin',
                        icon: 'pi pi-fw pi-lock',
                        command: () => {
                            router.push('/prsy-adm');
                        }
                    }
                ] : []),
                {
                    label: 'Tableau de bord',
                    icon: 'pi pi-fw pi-desktop',
                    // url: '/dashboard'
                    command: () => {
                        router.push('/dashboard');
                    }
                },
                {
                    label: 'Profil',
                    icon: 'pi pi-fw pi-user',
                    // url: '/profile'
                    command: () => {
                        router.push('/profile');
                    }
                },
                {
                    label: 'Déconnexion',
                    icon: 'pi pi-fw pi-sign-in',
                    command: () => {
                        handleLogout();
                    }
                }
            ]
        }
    ]
    const handleMenuClick = (event) => {
        overlayRef.current.toggle(event);
    };

    return (
        <div className="layout-topbar">
            <Link href="/" className="layout-topbar-logo">
                <img src="/layout/images/prosy.png" alt="Logo" height="80" className="mr-0 lg:mr-2" />
                <span>PROSY</span>
            </Link>
            <Button
                icon="pi pi-bars"
                className="xl:hidden" 
                onClick={handleMenuClick}
                style={{ marginRight: '1em' }}
            />
            <OverlayPanel ref={overlayRef} className="mobile-menu" style={{ width: '200px', left: '0' }}>
                <div className="flex flex-column">
                    {isAuthenticated ? (
                        <>
                            <Link href="/dashboard" className="p-menuitem-link">
                                <span className="pi pi-fw pi-desktop"></span> Tableau de bord
                            </Link>
                            <Link href="/profile" className="p-menuitem-link">
                                <span className="pi pi-fw pi-user"></span> Profil
                            </Link>
                            <Link href="/parametres" className="p-menuitem-link">
                                <span className="pi pi-fw pi-cog"></span> Paramètres
                            </Link>
                            <Button label="Déconnexion" onClick={handleLogout} className="p-button-danger" />
                        </>
                    ) : (
                        <>
                            <Button label="Se connecter" text onClick={() => router.push('/auth/login')} />
                            <Button label="S'inscrire" onClick={() => router.push('/auth/register')} />
                        </>
                    )}
                </div>
            </OverlayPanel>
            <div className={classNames('hidden xl:flex','align-items-center surface-0 flex-grow-1 justify-content-end hidden lg:flex absolute lg:static w-full left-0 px-6 lg:px-0 z-2', { hidden: isHidden })} style={{ top: '100%' }}>
                <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    {isAuthenticated ? (
                        <>
                            <div>
                                <Menubar model={menuItems} 
                                style={{ backgroundColor: "var(--surface-card)" }}
                                />
                            </div>
                        </>
                    ) : (
                        <>
                            <Button label="Se connecter" text rounded className="border-none ml-5 font-light line-height-2 text-blue-500" onClick={() => router.push('/auth/login')}></Button>
                            <Button label="S'inscrire" rounded className="border-none ml-5 font-light line-height-2 bg-blue-500 text-white" onClick={() => router.push('/auth/register')}
                            style={{ marginRight: "20px" }}    
                            ></Button>
                        </>
                    )}
                </div>
                <div className="flex justify-content-between lg:block border-top-1 lg:border-top-none surface-border py-3 lg:py-0 mt-3 lg:mt-0">
                    <div className="layout-topbar-theme-switcher">
                        <button className="flex flex-shrink-0 px-link border-1 border-solid w-2rem h-2rem surface-border border-round surface-card align-items-center justify-content-center transition-all transition-duration-300 hover:border-primary" onClick={handleThemeChange}>
                            {isLightTheme ? (
                                <img
                                    src="/layout/images/themes/moon.svg"
                                    alt="Switch to Dark Theme"
                                    className="layout-topbar-theme-icon mr-2"
                                    style={{ margin: "0 !important" }}
                                />
                            ) : (
                                <img
                                    src="/layout/images/themes/brightness-low-fill.svg"
                                    alt="Switch to Light Theme"
                                    className="layout-topbar-theme-icon mr-2"
                                    style={{ filter: 'brightness(0) invert(1)' }}
                                />
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
});

AppTopbar.displayName = 'AppTopbar';

export default AppTopbar;