/* eslint-disable @next/next/no-img-element */
'use client';
import { Button } from 'primereact/button';
import { Chart } from 'primereact/chart';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Menu } from 'primereact/menu';
import { Ripple } from 'primereact/ripple';
import Nav from "../nav/page";
import Footer from "../footer/page";
import MenuList from "../menu_list/page";
import { NodeRef, Demo } from '@/src/types';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '../../../demo/service/ProductService';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { StyleClass } from 'primereact/styleclass';
import Link from 'next/link';
import { ChartData, ChartOptions } from 'chart.js';
import { classNames } from 'primereact/utils';
import AppTopbar from '@/src/layout/AppTopbar';

const lineData: ChartData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
        {
            label: 'First Dataset',
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: '#2f4860',
            borderColor: '#2f4860',
            tension: 0.4
        },
        {
            label: 'Second Dataset',
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: '#00bb7e',
            borderColor: '#00bb7e',
            tension: 0.4
        }
    ]
};

const Dashboard = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [products, setProducts] = useState<Demo.Product[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const menuRef = useRef<HTMLElement | null>(null);

    const applyLightTheme = () => {
        const lineOptions: ChartOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#495057'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                },
                y: {
                    ticks: {
                        color: '#495057'
                    },
                    grid: {
                        color: '#ebedef'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: '#ebedef'
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                },
                y: {
                    ticks: {
                        color: '#ebedef'
                    },
                    grid: {
                        color: 'rgba(160, 167, 181, .3)'
                    }
                }
            }
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);
    
    useEffect(() => {
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    const formatCurrency = (value: number) => {
        return value?.toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD'
        });
    };

    const toggleMenuItemClick = () => {
        setIsHidden((prevState) => !prevState);
    };
 
    return (
        <div className='profile'>
            <Nav />
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6">
                    <div className="card p-fluid">
                        <div className="text-center mb-5">
                            <img src="/demo/images/login/profil.png" alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenu Yanis</div>
                        </div>
                        <h5>Information</h5>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name2">Prénom :</label>
                                <p>Yanis</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="name2">Nom :</label>
                                <p>Nourry</p>
                            </div>
                        </div>
                        <div className="formgrid grid">
                            <div className="field col">
                                <label htmlFor="name2">Date de naissance</label>
                                <p>01/01/1998</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="name2">sex</label>
                                <p>20 cm</p>
                            </div>
                            <div className="field col">
                                <label htmlFor="email2">Email</label>
                                <p>email@email.com</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
