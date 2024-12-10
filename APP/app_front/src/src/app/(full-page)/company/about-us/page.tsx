'use client';
import React , { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartData, ChartOptions } from 'chart.js';
import Nav from "@/src/app/(full-page)/nav/page";
import { Button } from 'primereact/button';

import Timeline from '@mui/lab/Timeline';
import TimelineItem from '@mui/lab/TimelineItem';
import TimelineSeparator from '@mui/lab/TimelineSeparator';
import TimelineConnector from '@mui/lab/TimelineConnector';
import TimelineContent from '@mui/lab/TimelineContent';
import TimelineDot from '@mui/lab/TimelineDot';

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelCompany from '@/src/layout/menuMap/companyMenu';

const AboutUs = () => {
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
        <div className='about-us'>
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
            {/* <div id="about-hero" className="flex flex-column pt-4 px-4 lg:px-8 overflow-hidden" style={{ background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0.2)), radial-gradient(77.36% 256.97% at 77.36% 57.52%, #EEEFAF 0%, #C3E3FA 100%)', clipPath: 'ellipse(150% 87% at 93% 13%)' }}>
                <div className="mx-4 md:mx-8 mt-0 md:mt-4">
                    <h1 className="text-6xl font-bold text-gray-900 line-height-2">
                        <span className="font-light block">À propos de PROSY</span>Notre mission et notre équipe.
                    </h1>
                    <p className="font-normal text-2xl line-height-3 md:mt-3 text-gray-700">Découvrez comment PROSY peut vous simplifier la vie et apprenez à connaître les personnes derrière ce projet innovant.</p>
                    <Button type="button" label="En savoir plus" rounded className="text-xl border-none mt-3 bg-blue-500 font-normal line-height-3 px-3 text-white"></Button>
                </div>
                <div className="flex justify-content-center md:justify-content-end">
                    <img src="/layout/images/landing/screen-1.png" alt="About Image" className="w-9 md:w-auto" />
                </div>
            </div> */}

            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6">
                    <div id="about-info" className="mt-5 mx-0">
                        <div className="grid justify-content-center"
                                style={{
                                    textAlign: "center",
                                }}>
                            <div className="col-12 text-center mt-8 mb-4">
                                <h2 className="text-900 font-normal mb-2">Notre Mission</h2>
                                <span className="text-600 text-2xl">Faciliter vos démarches administratives avec simplicité et efficacité.</span>
                            </div>

                            <div className="col-12 md:col-12 lg:col-6 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                <div className="p-3 surface-card" style={{ borderRadius: '8px', background: 'linear-gradient(90deg, rgba(145,226,237,0.2),rgba(172,180,223,0.2))' }}>
                                    <h5 className="mb-2 text-900">À propos de l'application</h5>
                                    <p className="text-600">PROSY est une plateforme conçue pour simplifier et automatiser vos démarches administratives. Notre objectif est de vous offrir une solution pratique et sécurisée pour gérer vos documents et suivre vos demandes en toute tranquillité.</p>
                                </div>
                            </div>

                            <div className="col-12 md:col-12 lg:col-6 p-0 lg:pr-5 lg:pb-5 mt-4 lg:mt-0">
                                <div className="p-3 surface-card" style={{ borderRadius: '8px', background: 'linear-gradient(90deg, rgba(187,199,205,0.2),rgba(251,199,145,0.2))' }}>
                                    <h5 className="mb-2 text-900">Notre Équipe</h5>
                                    <p className="text-600">Nous sommes une équipe passionnée et dévouée, composée de professionnels ayant une vaste expérience dans les domaines de la technologie et des services administratifs. Nous travaillons sans relâche pour offrir une expérience utilisateur exceptionnelle et des fonctionnalités innovantes.</p>
                                </div>
                            </div>
                        </div>
                        <div id="about-timeline" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8"
                            style={{
                                padding: '0rem! important',
                                margin: '0rem! important',
                            }}
                        >
                        <div className="grid justify-content-center">
                            <div className="col-12 text-center mt-8 mb-4">
                                <h2 className="text-900 font-normal mb-2">Notre Histoire</h2>
                                <span className="text-600 text-2xl">Un voyage de l'idée à la réalisation.</span>
                            </div>

                            <div className="col-12 lg:col-12">
                            <Timeline position="alternate">
                                <TimelineItem>
                                    <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="inherit" />
                                    <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>                                            
                                        <h5 className="text-900">Septembre 2024</h5>
                                        <p className="text-600">Déploiement d'une version plus avancée avec des améliorations significatives, intégration de nouvelles fonctionnalité.</p>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="success" />
                                    <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <h5 className="text-900">Janvier 2024</h5>
                                        <p className="text-600">Lancement de la première version du produit avec les fonctionnalités de base pour répondre aux besoins initiaux des utilisateurs.</p>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="warning" />
                                    <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <h5 className="text-900">Mars 2023</h5>
                                        <p className="text-600">Concrétisation de l'idée et début du développement avec la création des premières maquettes et la mise en place de l'architecture du logiciel.</p>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="secondary" />
                                    <TimelineConnector />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <h5 className="text-900">Janvier 2023</h5>
                                        <p className="text-600">Formation d'une équipe et optimisation de l'idée initiale du projet, visant à développer une solution innovante pour la gestion des processus métier.</p>
                                    </TimelineContent>
                                </TimelineItem>
                                <TimelineItem>
                                    <TimelineSeparator>
                                    <TimelineDot variant="outlined" color="primary" />
                                    </TimelineSeparator>
                                    <TimelineContent>
                                        <h5 className="text-900">Décembre 2020</h5>
                                        <p className="text-600">L'idée d'une application moderne et innovante germe dans l'esprit de deux jeunes hommes</p>
                                    </TimelineContent>
                                </TimelineItem>
                                </Timeline>
                                {/* <ul className="list-none p-0 m-0">
                                    <li className="p-4 flex align-items-center">
                                        <div className="flex-shrink-0 w-3rem h-3rem bg-blue-500 text-white flex align-items-center justify-content-center font-bold rounded-full">1</div>
                                        <div className="ml-4">
                                            <h5 className="text-900">Janvier 2023</h5>
                                            <p className="text-600">Formation d'une équipe et création de l'idée initiale du projet, visant à développer une solution innovante pour la gestion des processus métier.</p>
                                        </div>
                                    </li>
                                    <li className="p-4 flex align-items-center">
                                        <div className="flex-shrink-0 w-3rem h-3rem bg-blue-500 text-white flex align-items-center justify-content-center font-bold rounded-full">2</div>
                                        <div className="ml-4">
                                            <h5 className="text-900">Mars 2023</h5>
                                            <p className="text-600">Concrétisation de l'idée et début du développement avec la création des premières maquettes et la mise en place de l'architecture du logiciel.</p>
                                        </div>
                                    </li>
                                    <li className="p-4 flex align-items-center">
                                        <div className="flex-shrink-0 w-3rem h-3rem bg-blue-500 text-white flex align-items-center justify-content-center font-bold rounded-full">3</div>
                                        <div className="ml-4">
                                            <h5 className="text-900">Janvier 2024</h5>
                                            <p className="text-600">Lancement de la première version du produit avec les fonctionnalités de base pour répondre aux besoins initiaux des utilisateurs.</p>
                                        </div>
                                    </li>
                                    <li className="p-4 flex align-items-center">
                                        <div className="flex-shrink-0 w-3rem h-3rem bg-blue-500 text-white flex align-items-center justify-content-center font-bold rounded-full">4</div>
                                        <div className="ml-4">
                                            <h5 className="text-900">Septembre 2024</h5>
                                            <p className="text-600">Déploiement d'une version plus avancée avec des améliorations significatives, intégration de nouvelles fonctionnalité.</p>
                                        </div>
                                    </li>
                                </ul> */}
                            </div>
                        </div>
                    </div>
                    <div id="about-team" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                        <div className="grid justify-content-center">
                            <div className="col-12 text-center mt-8 mb-4">
                                <h2 className="text-900 font-normal mb-2">Notre Équipe</h2>
                                <span className="text-600 text-2xl">Rencontrez l'équipe originel qui rend tout cela possible.</span>
                            </div>

                            <div className="col-12 lg:col-12">
                                <div className="grid justify-content-center" style={{textAlign: 'center'}}>
                                    <div className="col-12 md:col-6 lg:col-6 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/yanis.jpg" alt="yanis" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Yanis NOURRY</h5>
                                        <p className="text-600">Directeur Général<br/>Fondateur
                                        </p>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-6 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/jacques.jpg" alt="jacques" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Jacques CUBAUD</h5>
                                        <p className="text-600">Président<br/>Fondateur
                                        </p>
                                    </div>

                                    <div className="col-12 md:col-6 lg:col-6 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/lylian.png" alt="lylian" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Lylian SCHMITT</h5>
                                        <p className="text-600">Lead Dev Front-end<br/>Fondateur
                                        </p>
                                    </div>
                                    <div className="col-12 md:col-6 lg:col-6 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/alexandre.png" alt="alexandre" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Alexandre ELISABETH</h5>
                                        <p className="text-600">Lead Dev Back-end<br/>Fondateur
                                        </p>
                                    </div>

                                    <div className="col-12 md:col-4 lg:col-4 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/imene.jpg" alt="imene" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Imene BELAID</h5>
                                        <p className="text-600">Développeuse Front-end</p>
                                    </div>
                                    <div className="col-12 md:col-4 lg:col-4 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/ouissem.png" alt="ouissem" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Ouissem MOUACI</h5>
                                        <p className="text-600">Développeuse back-end</p>
                                    </div>
                                    <div className="col-12 md:col-4 lg:col-4 p-3 flex flex-column align-items-center">
                                        <div style={{
                                                position: 'relative',
                                                width: '130px',
                                                height: '130px',
                                                borderRadius: '50%',
                                                padding: '5px',
                                                border: '4px solid orange',
                                                textAlign: 'center',
                                                display: 'inline-block'
                                            }}>
                                            <img src="/layout/images/team/milissa.png" alt="milissa" className="w-8rem h-8rem rounded-circle mb-3"  
                                                style={{
                                                    borderRadius: '50%',
                                                    objectFit: 'cover'
                                                }} />
                                        </div>
                                        <h5 className="text-900 mb-1">Milissa BOUZIDIA</h5>
                                        <p className="text-600">Développeuse back-end</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div id="about-testimonials" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                        <div className="grid justify-content-center">
                            <div className="col-12 text-center mt-8 mb-4">
                                <h2 className="text-900 font-normal mb-2">Témoignages</h2>
                                <span className="text-600 text-2xl">Ce que nos utilisateurs disent de PROSY.</span>
                            </div>

                            <div className="col-12 lg:col-12">
                                <div className="card">
                                    <h5>Marie Dupont</h5>
                                    <span className="text-600">Utilisateur depuis janvier 2024</span>
                                    <p className="text-600">"PROSY a transformé la façon dont je gère mes documents. La plateforme est intuitive et les fonctionnalités sont exactement ce dont j'avais besoin pour simplifier mes démarches."</p>
                                </div>
                                <div className="card">
                                    <h5>Jean Martin</h5>
                                    <span className="text-600">Utilisateur depuis septembre 2024</span>
                                    <p className="text-600">"L'interface utilisateur de PROSY est extrêmement conviviale et les fonctionnalités de suivi sont très utiles. Je recommande vivement cette application à tout le monde."</p>
                                </div>
                            </div>
                        </div>
                    </div>
                        <div id="about-faq" className="py-4 px-4 lg:px-8 mt-5 mx-0 lg:mx-8">
                            <div className="grid justify-content-center">
                                <div className="col-12 text-center mt-8 mb-4">
                                    <h2 className="text-900 font-normal mb-2">Questions Fréquemment Posées</h2>
                                    <span className="text-600 text-2xl">Trouvez les réponses à vos questions courantes.</span>
                                </div>
                                <div className="col-12 lg:col-12">
                                    <div className="card">
                                        <h5 className="text-900">Comment puis-je créer un compte ?</h5>
                                        <p className="text-600">Pour créer un compte, cliquez sur le bouton "S'inscrire" en haut à droite de la page d'accueil et suivez les instructions à l'écran.</p>
                                    </div>
                                    <div className="card">
                                    <h5 className="text-900">Quels types de documents puis-je gérer avec PROSY ?</h5>
                                    <p className="text-600">PROSY vous permet de gérer divers types de documents administratifs, y compris les contrats, les factures, les demandes de remboursement, et plus encore.</p>
                                    </div>
                                    <div className="card">
                                    <h5 className="text-900">Y a-t-il un support client disponible ?</h5>
                                        <p className="text-600">Oui, nous avons une équipe de support client disponible 24/7 pour vous aider avec toute question ou problème que vous pourriez rencontrer.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AboutUs;
