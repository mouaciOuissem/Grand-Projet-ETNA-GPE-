'use client';
import React , { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import Nav from "@/src/app/(full-page)/nav/page";

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelLegal from '@/src/layout/menuMap/legalMenu';

const PrivacyPolicy = () => {
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
        <div className='privacy-policy'>
            <Nav />
            <div className="hidden xl:flex">
                <div className='layout-sidebar'>
                    <MenuProvider>
                        <ul className="layout-menu">
                            {modelLegal.map((item, i) => {
                                return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                            })}
                        </ul>
                    </MenuProvider>
                </div>
            </div>
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <h5>Politique de confidentialité</h5>
                        <p>
                            Chez Prosy, nous prenons votre vie privée très au sérieux et nous nous engageons à protéger les données personnelles que vous partagez avec nous. Cette politique de confidentialité décrit la manière dont nous collectons, utilisons et protégeons vos informations en lien avec la gestion de vos documents administratifs.
                        </p>

                        <h6>1. Informations que nous collectons</h6>
                        <p>
                            Nous collectons les types d'informations personnelles suivantes auprès de nos utilisateurs :
                        </p>
                        <ul>
                            <li>Informations d'identification personnelle (nom, adresse e-mail, etc.)</li>
                            <li>Documents téléchargés par l'utilisateur pour traitement</li>
                            <li>Données d'utilisation liées à votre interaction avec notre plateforme</li>
                        </ul>

                        <h6>2. Comment nous utilisons vos informations</h6>
                        <p>
                            Les informations que nous collectons sont utilisées pour les finalités suivantes :
                        </p>
                        <ul>
                            <li>Fournir et maintenir nos services, y compris la gestion des documents</li>
                            <li>Personnaliser votre expérience et améliorer notre plateforme</li>
                            <li>Communiquer avec vous, y compris pour envoyer des notifications ou des mises à jour</li>
                            <li>Respecter nos obligations légales et résoudre tout différend</li>
                        </ul>

                        <h6>3. Sécurité des données</h6>
                        <p>
                            Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos informations personnelles contre toute divulgation non autorisée, altération ou destruction. Nous utilisons des technologies de cryptage et des contrôles d'accès pour assurer la sécurité de vos données.
                        </p>

                        <h6>4. Partage de vos informations</h6>
                        <p>
                            Nous ne vendons, n'échangeons ni ne louons vos informations personnelles à des tiers. Cependant, nous pouvons partager vos informations dans les cas suivants :
                        </p>
                        <ul>
                            <li>Pour se conformer à une obligation légale, une décision judiciaire ou une procédure légale.</li>
                            <li>Pour protéger nos droits, notre propriété ou notre sécurité, ainsi que ceux de nos utilisateurs.</li>
                        </ul>

                        <h6>5. Vos droits</h6>
                        <p>
                            Vous avez le droit d'accéder à vos informations personnelles, de les rectifier, de demander leur suppression ou de limiter leur traitement. Vous pouvez également vous opposer au traitement de vos données dans certains cas.
                        </p>

                        <h6>6. Modifications de cette politique</h6>
                        <p>
                            Nous pouvons être amenés à mettre à jour cette politique de confidentialité afin de refléter les changements législatifs ou des modifications dans nos pratiques. Toute modification sera publiée sur cette page avec une nouvelle date d'entrée en vigueur.
                        </p>

                        <h6>7. Contact</h6>
                        <p>
                            Si vous avez des questions concernant cette politique de confidentialité, n'hésitez pas à nous contacter à l'adresse suivante : contact@prosy.fr.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;
