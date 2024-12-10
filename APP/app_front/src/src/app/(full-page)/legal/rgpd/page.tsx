'use client';
import React , { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';

import Nav from "@/src/app/(full-page)/nav/page";

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelLegal from '@/src/layout/menuMap/legalMenu';

const Tos = () => {
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
        <div className='tos'>
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
                        <h4>POLITIQUE DE CONFIDENTIALITÉ ET D'UTILISATION DES DONNÉES PERSONNELLES</h4>
                    </div>
                    <div className="card">
                        <h5>Définition des termes utilisés dans la politique de confidentialité</h5>
                        <p>On désignera par la suite :</p>
                        <p><strong>« Donnée personnelle » </strong>
                            : se définit comme «<em>toute information relative à une personne physique identifiée ou qui peut être identifiée, 
                            directement ou indirectement, par référence à un numéro d'identification ou à un ou plusieurs éléments qui lui sont propres</em> 
                            », conformément à la loi Informatique et libertés du 6 janvier 1978.</p>
                        <p><strong>« Service » </strong>
                            : le service https://www.snl-corp.fr et l'ensemble de ses contenus.</p>
                        <p><strong>« Editeur » </strong> ou <strong>Nous</strong>
                            : , personne morale ou physique responsable de l'édition et du contenu du Service.</p>
                        <p><strong>« Utilisateur » </strong> ou <strong>Vous</strong>
                            : l'internaute visitant et utilisant le Service.</p>
                    </div>
                    <div className="card">
                        <h5>Article 1 - Introduction et rôle de la Politique de confidentialité</h5>
                        <p>La présente charte vise à vous informer des engagements du Service eu égard au respect de votre vie privée et à la protection 
                            des Données personnelles vous concernant, collectées et traitées à l'occasion de votre utilisation du Service.</p>
                        <p>Il est important que vous lisiez la présente politique de confidentialité afin que vous soyez conscient des raisons 
                            pour lesquelles nous utilisons vos données et comment nous le faisons.</p>
                        <p>En vous inscrivant sur le Service, vous vous engagez à nous fournir des informations véritables vous concernant. 
                            La communication de fausses informations est contraire aux conditions générales figurant sur le Service.</p>
                        <p>Veuillez noter que la présente Politique de confidentialité est susceptible d’être modifiée ou complétée à tout moment, 
                            notamment en vue de se conformer à toute évolution législative, réglementaire, jurisprudentielle ou technologique. 
                            La date de sa mise à jour sera clairement mentionnée, le cas échéant.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tos;
