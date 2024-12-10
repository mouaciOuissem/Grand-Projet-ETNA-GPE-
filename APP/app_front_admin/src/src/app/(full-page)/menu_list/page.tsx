'use client';
/* eslint-disable @next/next/no-img-element */
import React, { useContext, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { TieredMenu } from 'primereact/tieredmenu';
import { MenuProvider } from '@/src/layout/context/menucontext';
import AppMenuitem from '@/src/layout/AppMenuitem';
import Link from 'next/link';
import { AppMenuItem } from '@/src/types';

const MenuList = () => {
    const { layoutConfig } = useContext(LayoutContext);

    const model: AppMenuItem[] = [
        {
            label: 'Home',
            items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
        },
        {
            label: 'Profile',
            icon: 'pi pi-fw pi-briefcase',
            to: '/pages',
            items: [
                {
                    label: 'Informations',
                    icon: 'pi pi-fw pi-search',
                    to: '/profile'
                },
                {
                    label: 'Dashboard',
                    icon: 'pi pi-fw pi-chart-bar',
                    to: '/dashboard'
                },
                {
                    label: 'Connection',
                    icon: 'pi pi-fw pi-user',
                    items: [
                        {
                            label: 'Logout',
                            icon: 'pi pi-fw pi-sign-in',
                            to: '/auth/logout'
                        },
                    ]
                },
                {
                    label: 'Documents',
                    icon: 'pi pi-fw pi-wallet',
                    to: '/document'
                },
            ]
        },
    ];

    return (
        <div className='layout-sidebar'>
            <MenuProvider>
                <ul className="layout-menu">
                    {model.map((item, i) => {
                        return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}
                </ul>
            </MenuProvider>
        </div>
        
    );
};

export default MenuList;
