'use client';
import React, { useContext, useEffect, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartOptions } from 'chart.js';
import Nav from "@/src/app/(full-page)/nav/page";
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelUsers from '@/src/layout/menuMap/usersMenu';
import { requiredInfoByDemarche } from '@/src/app/(full-page)/processus/requiredInfo';
import { useUser } from '@/src/layout/context/userContext';
import { useApi } from '@/src/layout/context/apiContext';

const Processus = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const [selectedAide, setSelectedAide] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [missingInfo, setMissingInfo] = useState([]);
    const [usedInfo, setUsedInfo] = useState([]);
    const { userDataDetails} = useUser();
    const [aidesData, setAidesData] = useState([]);  // State to hold the API data
    const [selectedAideUrl, setSelectedAideUrl] = useState(null);  // Nouvelle variable pour stocker l'URL de la démarche
    const { getApiUrl } = useApi();
    const [descriptionModalVisible, setDescriptionModalVisible] = useState(false);
    const [selectedDescription, setSelectedDescription] = useState('');

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

    useEffect(() => {
        const fetchAidesData = async () => {
            try {
                const apiUrl = getApiUrl(); // Get the API URL
                const response = await fetch(`${apiUrl}/process`, { 
                    method: 'GET', 
                    credentials: 'include' 
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des aides');
                }
    
                const data = await response.json();
                const mappedAidesData = mapApiResponseToAidesData(data.process); // Map API data
                setAidesData(mappedAidesData); // Set the mapped data to the state
            } catch (error) {
                console.error('Erreur lors de la récupération des aides:', error);
            }
        };
    
        fetchAidesData(); // Fetch and map data on component mount
    }, [getApiUrl]);

    // const aidesData = [
    //     {
    //         title: 'CAF',
    //         children: [
    //             {
    //                 title: 'Logement',
    //                 items: ['APL (Aide personnalisée au logement)', 'ALF (Allocation logement familiale)']
    //             },
    //             {
    //                 title: 'Administratif',
    //                 items: ['Attestation de droits', 'Changement de situation']
    //             },
    //             {
    //                 title: 'Financier',
    //                 items: [
    //                     { 
    //                         label: 'Prime d’activité', 
    //                         href: 'https://wwwd.caf.fr/wps/portal/caffr/simulateurpa/' 
    //                     },
    //                     'RSA (Revenu de Solidarité Active)'
    //                 ]
    //             }
    //         ]
    //     },
    //     {
    //         title: 'Autres Aides',
    //         children: [
    //             {
    //                 title: 'Aides logement',
    //                 items: ['Action Logement']
    //             },
    //             {
    //                 title: 'Aides financières',
    //                 items: ['FSL (Fonds de Solidarité Logement)']
    //             }
    //         ]
    //     }
    // ];

    const fieldMapping = {
        'Nom': 'lastname',
        'Prénom': 'firstname',
        'Adresse': 'address',
        'Date de naissance': 'birthday',
        'Salaire 1': 'userFiscalDetails.salary_1',
        'Salaire 2': 'userFiscalDetails.salary_2',
        'Salaire 3': 'userFiscalDetails.salary_3',

    };

    const getValueByPath = (obj, path) => {
        return path.split('.').reduce((acc, part) => acc && acc[part], obj);
    };

    const handleAideClick = (aide) => {
        if (!userDataDetails) {
            console.error('Les détails de l\'utilisateur ne sont pas chargés.');
            return;
        }

        const requiredInfo = requiredInfoByDemarche[aide] || [];
        const userInfo = {};

        requiredInfo.forEach((infoLabel) => {
            const fieldPath = fieldMapping[infoLabel];
            if (fieldPath) {
                const value = getValueByPath(userDataDetails, fieldPath);
                userInfo[infoLabel] = value !== undefined && value !== null && value !== '' ? value : null;
            } else {
                console.warn(`Aucun mapping trouvé pour ${infoLabel}`);
                userInfo[infoLabel] = null;
            }
        });

        const missing = requiredInfo.filter(info => !userInfo[info]);
        setMissingInfo(missing);
        setUsedInfo(requiredInfo);
        setSelectedAide(aide);
        
        // Find URL associated with the selected aid
        const selectedAid = aidesData.flatMap(category => 
            category.children.map(child => 
                child.items.find(item => item.label === aide)
            )
        ).find(item => item); // This flattens and finds the aid
    
        if (selectedAid && selectedAid.href) {
            setSelectedAideUrl(selectedAid.href);
        } else {
            setSelectedAideUrl(null);
        }

        setShowModal(true);
    };

    const mapApiResponseToAidesData = (apiData) => {
        const mappedData = {};
    
        // Group the processes by category and subcategory
        apiData.forEach((process) => {
            const category = process.category || 'Autre'; // Default category if missing
            const subcategory = process.subcategory || 'Général'; // Default subcategory if missing
    
            if (!mappedData[category]) {
                mappedData[category] = {};
            }
    
            if (!mappedData[category][subcategory]) {
                mappedData[category][subcategory] = [];
            }
    
            // Push the process into the appropriate category/subcategory
            mappedData[category][subcategory].push({
                shortName: process.shortName || process.name,  // Use shortName if available, else fallback to name
                label: process.name,
                href: process.url || '#', // Handle URL if available, else '#'
                description: process.description || 'Description non disponible', // Ensure description is included
            });
        });

        return Object.keys(mappedData).map((category) => ({
            title: category,
            children: Object.keys(mappedData[category]).map((subcategory) => ({
                title: subcategory,
                items: mappedData[category][subcategory],
            })),
        }));
    };

    const handleContinue = () => {
        console.log("Selected Aide URL:", selectedAideUrl); // Check the URL value
        if (selectedAideUrl) {
            window.open(selectedAideUrl, '_blank');  // Ouvrir l'URL dans un nouvel onglet
        }
    };

    const hideModal = () => {
        setShowModal(false);
    };

    const showDescriptionModal = (item) => {
        setSelectedDescription(item.description || 'Description non disponible');
        setDescriptionModalVisible(true);
    };

    const hideDescriptionModal = () => {
        setDescriptionModalVisible(false);
        setSelectedDescription('');
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' });
    };

    return (
        <div className='processus'>
            <Nav />
            <div className="hidden xl:flex">
                <div className='layout-sidebar'>
                    <MenuProvider>
                        <ul className="layout-menu">
                            {modelUsers.map((item, i) => {
                                return !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                            })}
                        </ul>
                    </MenuProvider>
                </div>
            </div>
            <div className="grid justify-content-center mt-3" >
                <div className="col-12 xl:col-6" style={{ maxWidth: '1200px', padding: '0 2rem', marginTop: '2rem', marginBottom: '2rem'}}>
                <div className="card mt-3">
                    <h5>Organigramme des aides</h5>
                    {aidesData.map((aide, index) => (
                        <Card key={index} title={aide.title} className="mb-4">
                            {aide.children.map((child, i) => (
                                <div key={i} className="mb-3">
                                    <h6>{child.title}</h6>
                                    <ul>
                                        {child.items.map((item, idx) => (
                                            <li key={idx}>
                                                <span 
                                                    onClick={() => handleAideClick(item.label)} 
                                                    style={{
                                                        color: item.href !== '#' ? 'var(--primary-color)' : '--text-color', // primary if URL exists, else white/black
                                                        cursor: item.href !== '#' ? 'pointer' : 'default'  // Pointer if URL exists, else default cursor
                                                    }}
                                                >
                                                    {item.shortName} ({item.label})
                                                </span>
                                                <i
                                                    className="pi pi-question-circle ml-2"
                                                    style={{ cursor: 'pointer', fontSize: '1.2em' }}
                                                    onClick={() => showDescriptionModal(item)}
                                                ></i>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </Card>
                    ))}
                </div>
                </div>

                <Dialog header="Description de l'aide" visible={descriptionModalVisible} style={{ width: '40vw' }} onHide={hideDescriptionModal}>
                    <p>{selectedDescription}</p>
                    <Button label="Fermer" onClick={hideDescriptionModal} className="mt-3" />
                </Dialog>

                <Dialog header="Informations requises" visible={showModal} style={{ width: '50vw' }} onHide={hideModal}>
                    <h5>Vous avez sélectionné : {selectedAide}</h5>
                    
                    <h6>Informations que nous allons utiliser :</h6>
                    <ul style={{ listStyleType: 'none', padding: 0 }}>
                        {usedInfo.map((info, index) => {
                            const fieldPath = fieldMapping[info];
                            let fieldValue = fieldPath ? getValueByPath(userDataDetails, fieldPath) : null;

                            if (info === 'Date de naissance' && fieldValue) {
                                fieldValue = formatDate(fieldValue); 
                            }

                            const textColor = fieldValue ? '--text-color' : 'red';
                            
                            return (
                                <li key={index} style={{ display: 'flex', justifyContent: 'space-between', color: textColor }}>
                                    <span>{info}</span>
                                    <span style={{ flexGrow: 1, borderBottom: '1px dotted', margin: '0 10px', color: textColor}}></span>
                                    <span>{fieldValue ? fieldValue : '(manquant)'}</span>
                                </li>
                            );
                        })}
                    </ul>

                    <Button label="Continuer" onClick={handleContinue} disabled={missingInfo.length > 0} className="mt-3" />
                </Dialog>
            </div>
        </div>
    );
};

export default Processus;