'use client';
import React , { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import Nav from "@/src/app/(full-page)/nav/page";

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelCompany from '@/src/layout/menuMap/companyMenu';

const Contact = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});

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
        if (layoutConfig.colorScheme === 'light') {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [layoutConfig.colorScheme]);

    return (
        <div className='contact'>
            <Nav />
            <div className="hidden xl:flex">
                <div className='layout-sidebar'>
                    <MenuProvider>
                    <ul className="layout-menu">
                        {modelCompany.map((item, i) => {
                            return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                        })}
                    </ul>
                    </MenuProvider>
                </div>
            </div>
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Contactez-nous</h5>
                        <p>
                            Si vous avez des questions ou des préoccupations, n'hésitez pas à nous contacter. Nous serons ravis de vous aider. Remplissez le formulaire ci-dessous ou utilisez l'une des méthodes de contact suivantes.
                        </p>

                        <h6>Formulaire de contact</h6>
                        <form>
                            <div className="p-field">
                                <label htmlFor="name">Nom</label>
                                <input id="name" type="text" className="p-inputtext p-component" placeholder="Votre nom" />
                            </div>
                            <div className="p-field">
                                <label htmlFor="email">Email</label>
                                <input id="email" type="email" className="p-inputtext p-component" placeholder="Votre email" />
                            </div>
                            <div className="p-field">
                                <label htmlFor="message">Message</label>
                                <textarea id="message" className="p-inputtext p-component" placeholder="Votre message" rows={5}></textarea>
                            </div>
                            <div className="p-field">
                                <button type="submit" className="p-button p-component p-button-primary">
                                    Envoyer
                                </button>
                            </div>
                        </form>

                        <h6>Informations de contact</h6>
                        <p>
                            <strong>Adresse</strong><br />
                            123 Rue de l'Entreprise,<br />
                            75000 Paris, France
                        </p>
                        <p>
                            <strong>Email</strong><br />
                            <a href="mailto:contact@votre-entreprise.com">contact@votre-entreprise.com</a>
                        </p>
                        <p>
                            <strong>Téléphone</strong><br />
                            +33 1 23 45 67 89
                        </p>

                        <h6>Réseaux sociaux</h6>
                        <p>
                            Retrouvez-nous sur les réseaux sociaux pour des mises à jour en temps réel :
                        </p>
                        <ul>
                            <li><a href="https://www.facebook.com/votreentreprise" target="_blank" rel="noopener noreferrer">Facebook</a></li>
                            <li><a href="https://www.twitter.com/votreentreprise" target="_blank" rel="noopener noreferrer">Twitter</a></li>
                            <li><a href="https://www.linkedin.com/company/votreentreprise" target="_blank" rel="noopener noreferrer">LinkedIn</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;
