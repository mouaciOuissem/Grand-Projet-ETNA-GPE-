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
                        <h5>Conditions d'utilisation</h5>
                        <p>
                            Bienvenue sur Prosy. En accédant à notre plateforme, vous acceptez de respecter et d'être lié par les présentes conditions d'utilisation. Veuillez lire attentivement ce document avant d'utiliser nos services.
                        </p>

                        <h6>1. Acceptation des conditions</h6>
                        <p>
                            En utilisant notre plateforme, vous acceptez d'être lié par ces conditions d'utilisation, ainsi que par toutes les lois et règlements applicables. Si vous n'acceptez pas ces conditions, veuillez ne pas utiliser nos services.
                        </p>

                        <h6>2. Modification des conditions</h6>
                        <p>
                            Nous nous réservons le droit de modifier ces conditions d'utilisation à tout moment. Toute modification sera publiée sur cette page avec une nouvelle date d'entrée en vigueur. Il est de votre responsabilité de consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
                        </p>

                        <h6>3. Utilisation de la plateforme</h6>
                        <p>
                            Vous vous engagez à utiliser la plateforme uniquement à des fins légales et conformément aux lois en vigueur dans votre pays de résidence. Vous acceptez de ne pas utiliser la plateforme pour des activités illégales, nuisibles ou contraires aux bonnes mœurs.
                        </p>

                        <h6>4. Création de compte</h6>
                        <p>
                            Pour accéder à certains services de la plateforme, vous devrez créer un compte utilisateur. Vous vous engagez à fournir des informations exactes, à jour et complètes lors de l'inscription. Vous êtes responsable de la confidentialité de vos informations de compte et de toutes les activités qui se produisent sous votre compte.
                        </p>

                        <h6>5. Propriété intellectuelle</h6>
                        <p>
                            Tous les droits de propriété intellectuelle liés au contenu, aux fonctionnalités et au design de la plateforme sont la propriété de Prosy ou de ses partenaires. Vous n'êtes pas autorisé à reproduire, distribuer ou modifier tout contenu sans l'autorisation préalable de l'entité détentrice des droits.
                        </p>

                        <h6>6. Responsabilité</h6>
                        <p>
                            Prosy met en œuvre tous les moyens pour assurer le bon fonctionnement de ses services, mais ne peut être tenue responsable des dysfonctionnements techniques, des erreurs ou des pertes de données qui pourraient survenir lors de l'utilisation de la plateforme. L'utilisation de la plateforme se fait à vos propres risques.
                        </p>

                        <h6>7. Confidentialité et protection des données</h6>
                        <p>
                            La protection de vos données personnelles est une priorité pour nous. Pour plus de détails, veuillez consulter notre <a href="/legal/privacy-policy">politique de confidentialité</a>.
                        </p>

                        <h6>8. Limitation de responsabilité</h6>
                        <p>
                            En aucun cas, Prosy ne pourra être tenue responsable de dommages directs, indirects, accessoires ou consécutifs découlant de l'utilisation ou de l'impossibilité d'utiliser ses services.
                        </p>

                        <h6>9. Durée et résiliation</h6>
                        <p>
                            Ces conditions d'utilisation sont effectives tant que vous utilisez notre plateforme. Nous nous réservons le droit de suspendre ou de résilier votre accès à la plateforme à tout moment, sans préavis, en cas de violation de ces conditions.
                        </p>

                        <h6>10. Droit applicable</h6>
                        <p>
                            Ces conditions d'utilisation sont régies par les lois en vigueur dans [pays ou région]. En cas de litige, vous acceptez de soumettre toute réclamation à la juridiction compétente de [ville ou région].
                        </p>

                        <h6>11. Contact</h6>
                        <p>
                            Si vous avez des questions concernant ces conditions d'utilisation, n'hésitez pas à nous contacter à l'adresse suivante : contact@prosy.fr.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Tos;
