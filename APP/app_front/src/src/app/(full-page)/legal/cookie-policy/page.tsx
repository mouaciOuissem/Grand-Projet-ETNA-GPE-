'use client';
import React , { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';

import Nav from "@/src/app/(full-page)/nav/page";
import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelLegal from '@/src/layout/menuMap/legalMenu';

const CookiePolicy = () => {
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
                        <h4>POLITIQUE EN MATIÈRE DE COOKIES</h4>
                    </div>
                    <div className="card">
                        <h5>1. Qu'est-ce qu'un cookie ?</h5>
                        <p>Un cookie est un petit fichier constitué de lettres et de chiffres et téléchargé sur votre ordinateur 
                            lorsque vous accédez à certains sites web. En général, les cookies permettent à un site web de reconnaître l'ordinateur de l’utilisateur.</p>
                        <p> La chose la plus importante à savoir sur les cookies que nous plaçons est qu'ils servent à améliorer la convivialité de notre site web, 
                            par exemple en mémorisant les préférences du site et les paramètres linguistiques.</p>
                    </div>
                    <div className="card">
                        <h5>2. Pourquoi utilisons-nous des cookies ?</h5>
                        <p>Nous pouvons utiliser des cookies et d'autres technologies similaires pour un certain nombre de raisons, par exemple : <br />
                            i) pour des besoins de sécurité ou de protection contre la fraude, et afin d'identifier et de prévenir les cyber-attaques, <br />
                            ii) pour vous fournir le service que vous avez choisi de recevoir de notre part, <br />
                            iii) pour contrôler et analyser les performances, le fonctionnement et l'efficacité de notre service et <br />
                            iv) d'améliorer votre expérience utilisateur.</p>
                    </div>
                    <div className="card">
                        <h5>3. Tableau des cookies :</h5>
                        <p></p>
                    </div>
                    <div className="card">
                        <h5>4. Vos choix :</h5>
                        <p>Pour en savoir plus sur les cookies, notamment sur la manière de voir quels cookies ont été définis et de comprendre comment les gérer, 
                            les supprimer ou les bloquer, visitez 
                            <ul>
                                <li><a href="https://www.cnil.fr/fr/cookies-les-outils-pour-les-maitriser" target="_blank" rel="noopener noreferrer">Les outils pour maîtriser les cookies - CNIL</a></li>
                                <li><a href="https://support.google.com/accounts/answer/32050" target="_blank" rel="noopener noreferrer">Comment gérer les cookies dans Google Chrome</a></li>
                            </ul>
                        </p>
                        <p>Il est également possible d'empêcher votre navigateur d'accepter les cookies en modifiant les paramètres concernés dans votre navigateur. 
                            Vous pouvez généralement trouver ces paramètres dans le menu « Options » ou « Préférences » de votre navigateur.</p>
                        <p>Veuillez noter que la suppression de nos cookies ou la désactivation de futurs cookies ou technologies de suivi pourront vous empêcher 
                            d'accéder à certaines zones ou fonctionnalités de nos services, ou pourront autrement affecter négativement votre expérience d'utilisateur.</p>
                        <p>Les liens suivants peuvent être utiles, ou vous pouvez utiliser l'option « Aide » de votre navigateur.
                            <ul>
                                <li><a href="https://support.mozilla.org/fr/kb/protection-renforcee-contre-pistage-firefox-ordinateur?redirectslug=Enabling+and+disabling+cookies&redirectlocale=en-US" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Firefox</a></li>
                                <li><a href="https://support.microsoft.com/fr-fr/windows/g%C3%A9rer-les-cookies-dans-microsoft-edge-afficher-autoriser-bloquer-supprimer-et-utiliser-168dab11-0753-043d-7c16-ede5947fc64d" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Internet Explorer</a></li>
                                <li><a href="https://support.google.com/chrome/answer/95647?hl=fr" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Google Chrome</a></li>
                                <li><a href="https://support.apple.com/fr-fr/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Safari (OS X)</a></li>
                                <li><a href="https://support.apple.com/fr-fr/105082" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Safari (iOS)</a></li>
                                <li><a href="https://support.google.com/accounts/answer/32050?co=GENIE.Platform%3DAndroid&hl=fr" target="_blank" rel="noopener noreferrer">Paramètres des cookies dans Android</a></li>
                            </ul>
                        </p>
                        <p>Pour refuser et empêcher que vos données soient utilisées par Google Analytics sur tous les sites web, consultez les instructions suivantes :
                            <ul>
                                <li><a href="https://tools.google.com/dlpage/gaoptout?hl=fr" target="_blank" rel="noopener noreferrer">https://tools.google.com/dlpage/gaoptout?hl=fr</a></li>
                            </ul>
                        </p>
                        <p>Il se peut que nous modifiions cette politique en matière de cookies. Nous vous encourageons à consulter régulièrement cette page pour obtenir 
                            les dernières informations sur les cookies.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CookiePolicy;
