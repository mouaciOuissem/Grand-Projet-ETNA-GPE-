'use client';
import Nav from "../nav/page";
import { Prsy } from '@/src/types';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { ProductService } from '@/src/service/ProductService';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartOptions } from 'chart.js';
import { useForm, Controller, useWatch } from 'react-hook-form';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { Password } from 'primereact/password';
import { Dialog } from 'primereact/dialog';
import { Divider } from 'primereact/divider';
import { InputTextarea } from 'primereact/inputtextarea';
import { Button } from 'primereact/button';
import { Menu } from 'primereact/menu';
import { Accordion, AccordionTab } from 'primereact/accordion';
import { CountryService } from '@/src/service/CountryService';
import { classNames } from 'primereact/utils';

import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelUsers from '@/src/layout/menuMap/usersMenu';

import { useAuth } from '@/src/layout/context/authContext';
import { useUser } from '@/src/layout/context/userContext';
import { useApi } from '@/src/layout/context/apiContext';
import { InputNumber } from "primereact/inputnumber";

const Profile = () => {
    const [isHidden, setIsHidden] = useState(false);
    const [products, setProducts] = useState<Prsy.Product[]>([]);
    const menu1 = useRef<Menu>(null);
    const menu2 = useRef<Menu>(null);
    const [lineOptions, setLineOptions] = useState<ChartOptions>({});
    const { layoutConfig } = useContext(LayoutContext);
    const { isAuthenticated, userInfo } = useAuth();
    const { userData, userDataDetails, fetchUserData, fetchUserDataDetails } = useUser();
    const [countries, setCountries] = useState([]);
    const [showMessage, setShowMessage] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [formData, setFormData] = useState({});
    const countryservice = new CountryService();
    const { getApiUrl } = useApi();
    const [loading, setLoading] = useState(true);

    const defaultValuesBase = {
        username: userData?.username || '',
        email: userData?.email || '',
        password: '',
        encryption_password: ''
    };

    const defaultValuesDetails = {
        firstname: userDataDetails?.firstname || '',
        lastname: userDataDetails?.lastname || '',
        address: userDataDetails?.address || '',
        post_code: userDataDetails?.post_code || '',
        city: userDataDetails?.city || '',
        country: userDataDetails?.country || '',
        phone_number: userDataDetails?.phone_number || '',
        pronouns: userDataDetails?.pronouns || '',
        profile_picture: userDataDetails?.profile_picture || '',
        birthday: userDataDetails?.birthday || '',
        
        fiscal_details: {
            salary_1: userDataDetails?.userFiscalDetails?.salary_1 ?? 0,
            salary_2: userDataDetails?.userFiscalDetails?.salary_2 ?? 0,
            salary_3: userDataDetails?.userFiscalDetails?.salary_3 ?? 0,
            in_couple: userDataDetails?.userFiscalDetails?.in_couple ?? 0,
            waiting_child: userDataDetails?.userFiscalDetails?.waiting_child ?? 0,
            child_number: userDataDetails?.userFiscalDetails?.child_number ?? 0,
            owner: userDataDetails?.userFiscalDetails?.owner ?? 0,
            sales_1: userDataDetails?.userFiscalDetails?.sales_1 ?? 0,
            sales_2: userDataDetails?.userFiscalDetails?.sales_2 ?? 0,
            sales_3: userDataDetails?.userFiscalDetails?.sales_3 ?? 0,
            self_employed_business_profits: userDataDetails?.userFiscalDetails?.self_employed_business_profits ?? 0,
            housed_free_of_charge: userDataDetails?.userFiscalDetails?.housed_free_of_charge ?? 0,
            housing_allowance_1: userDataDetails?.userFiscalDetails?.housing_allowance_1 ?? 0,
            housing_allowance_2: userDataDetails?.userFiscalDetails?.housing_allowance_2 ?? 0,
            housing_allowance_3: userDataDetails?.userFiscalDetails?.housing_allowance_3 ?? 0,
            aah_1: userDataDetails?.userFiscalDetails?.aah_1 ?? 0,
            aah_2: userDataDetails?.userFiscalDetails?.aah_2 ?? 0,
            aah_3: userDataDetails?.userFiscalDetails?.aah_3 ?? 0,
            annual_investment_income: userDataDetails?.userFiscalDetails?.annual_investment_income ?? 0,
            other_resources_received_1: userDataDetails?.userFiscalDetails?.other_resources_received_1 ?? 0,
            other_resources_received_2: userDataDetails?.userFiscalDetails?.other_resources_received_2 ?? 0,
            other_resources_received_3: userDataDetails?.userFiscalDetails?.other_resources_received_3 ?? 0,
        },
        
        social_categorie: {
            self_employed: userDataDetails?.socialCategorie?.self_employed || 0,
            auto_entrepreneur: userDataDetails?.socialCategorie?.auto_entrepreneur || 0,
            activity: userDataDetails?.socialCategorie?.activity || '',
            student: userDataDetails?.socialCategorie?.student || 0,
            employee: userDataDetails?.socialCategorie?.employee || 0
        }
    };

    const socialCategoryOptions = [
        { label: 'Travailleur indépendant', value: 'self_employed' },
        { label: 'Auto-entrepreneur', value: 'auto_entrepreneur' },
        { label: 'Étudiant', value: 'student' },
        { label: 'Employé', value: 'employee' },
    ];

    const activityOptions = [
        { label: 'Profession libérale', value: 'Profession liberal' },
        { label: 'Artisan', value: 'Artisan' },
        { label: 'Commercant', value: 'Comercant' },
        { label: 'Autre', value: 'Autre' },
    ];

    
    useEffect(() => {
        countryservice.getCountries().then(data => setCountries(data));
    }, []);

    const { control: controlBase, formState: { errors: errorsBase }, handleSubmit: handleSubmitBase, reset: resetBase } = useForm({ 
        defaultValues: defaultValuesBase 
    });

    const { control: controlDetails, formState: { errors: errorsDetails }, handleSubmit: handleSubmitDetails, reset: resetDetails, watch, setValue } = useForm({ 
        defaultValues: defaultValuesDetails 
    });

    const handleCategoryChange = (selectedCategory) => {
        // Mettre à jour les valeurs de social_categorie selon la sélection
        setValue("social_categorie.self_employed", selectedCategory === 'self_employed' ? 1 : 0);
        setValue("social_categorie.auto_entrepreneur", selectedCategory === 'auto_entrepreneur' ? 1 : 0);
        setValue("social_categorie.student", selectedCategory === 'student' ? 1 : 0);
        setValue("social_categorie.employee", selectedCategory === 'employee' ? 1 : 0);
        
        // Réinitialiser l'activité si nécessaire
        if (selectedCategory !== 'self_employed' && selectedCategory !== 'auto_entrepreneur') {
            setValue("social_categorie.activity", "");
        }
    };

    const currentSocialCategory = useWatch({
        control: controlDetails,
        name: "social_categorie",
    });
    const [responseMessage, setResponseMessage] = useState('');

    useEffect(() => {
        if (userDataDetails) {
            resetDetails({
                ...defaultValuesDetails,
                social_categorie: {
                    ...userDataDetails.socialCategorie
                },
            });
        }
    }, [userDataDetails, resetDetails]);

    const updateBase = useCallback((data) => {
        const apiUrl = getApiUrl();
        fetch(`${apiUrl}/user/`, {
            method: "POST",
            body: JSON.stringify(data),
            credentials: 'include',
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                setResponseMessage(data.error_message);
                setShowErrorMessage(true);
            } else {
                setShowMessage(true);
            }
        })
        .catch((err) => {
            console.error(err);
            setResponseMessage("Erreur lors de la mise à jour.");
            setShowErrorMessage(true);
        });
    }, [getApiUrl]);

    const updateDetails = useCallback((data) => {
        const apiUrl = getApiUrl();
        fetch(`${apiUrl}/details/user/`, {
            method: "PATCH",
            body: JSON.stringify(data),
            credentials: 'include',
            mode: 'cors',
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            if (!res.ok) {
                return res.json().then(err => {
                    throw new Error(err.error_message || 'Une erreur est survenue lors de la mise à jour des détails.');
                });
            }
            return res.json();
        })
        .then((data) => {
            if (data.error_message) {
                setResponseMessage(data.error_message);
                setShowErrorMessage(true);
            } else {
                setShowMessage(true);
                setShowErrorMessage(false);
            }
        })
        .catch((err) => {
            console.error("Erreur pendant le fetch:", err);
            setResponseMessage(err.message || "Une erreur inconnue est survenue.");
            setShowErrorMessage(true);
        });
    }, [getApiUrl]);

    const onSubmitBase = (data) => {
        setFormData(data);
        updateBase(data)
        // .then(() => {
        //     fetchUserData();
        //     resetBase();
        // });
    };

    const onSubmitDetails = (data) => {
        const convertedData = {
            ...data,
            social_categorie: {
                self_employed: data.social_categorie.self_employed === 1 ? 1 : 0,
                auto_entrepreneur: data.social_categorie.auto_entrepreneur === 1 ? 1 : 0,
                student: data.social_categorie.student === 1 ? 1 : 0,
                employee: data.social_categorie.employee === 1 ? 1 : 0,
                activity: data.social_categorie.activity || "",
            }
        };
        setFormData(convertedData);
        updateDetails(convertedData);
        resetDetails(data);
    };

    const watchedSocialCategory = watch("social_categorie");

    const dialogFooter = (
        <div className="flex justify-content-center">
            <Button label="OK" className="p-button-text" autoFocus onClick={() => {
                    setShowMessage(false);
                    setShowErrorMessage(false);
                }}
            />
        </div>
    );

    const passwordHeader = <h6>Pick a password</h6>;
    const passwordFooter = (
        <React.Fragment>
            <Divider />
            <p className="mt-2">Suggestions</p>
            <ul className="pl-2 ml-2 mt-0" style={{ lineHeight: '1.5' }}>
                <li>Au moins une minuscule</li>
                <li>Au moins une majuscule</li>
                <li>Au moins un chiffre</li>
                <li>Minimum 8 caractères</li>
            </ul>
        </React.Fragment>
    );

    useEffect(() => {
        ProductService.getProductsSmall().then((data) => setProducts(data));
    }, []);

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
        const lineOptions: ChartOptions = {
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

    // if (isAuthenticated === null) {
    //     return (
    //         <div className="loading-screen">
    //             <p>Loading...</p>
    //         </div>
    //     );
    // }

    return (
        <div className='profile'>
            <Nav />
            <div className="hidden xl:flex">
                <div className='layout-sidebar'>
                    <MenuProvider>
                        <ul className="layout-menu">
                            {modelUsers.map((item, i) => (
                                !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={`sep-${i}`}></li>
                            ))}
                        </ul>
                    </MenuProvider>
                </div>
            </div>
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6" style={{ maxWidth: '1200px', padding: '0 2rem', marginTop: '2rem', marginBottom: '2rem'}}>
                    <div className="card p-fluid" >
                        <div className="profile-cover">
                        </div>
                        <div className="text-center mb-5 profile-info">
                            <img src={userDataDetails?.profile_picture} alt="Image" height="50" className="mb-3" />
                            <div className="text-900 text-3xl font-medium mb-3">Bienvenu {userData?.username}</div>
                            <div className="email text-700 text-xl mb-1">{userData?.email}</div>
                        </div>
                    </div>
                    <div className="card p-fluid" >
                        <Accordion>
                            <AccordionTab header="Base">

                                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                        <h5>Modifications Enregistré!</h5>
                                    </div>
                                </Dialog>
                                <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                                        <h5>error!</h5>
                                    </div>
                                </Dialog>

                                <form onSubmit={handleSubmitBase(onSubmitBase)} className="p-fluid">
                                    <div className="p-fluid formgrid grid">

                                        <div className="field col-12 md:col-6">
                                            <label htmlFor="username" className={classNames({ 'p-error': errorsDetails.lastname })}>{"Nom d'utilisateur"}</label>
                                            <Controller
                                                name="username"
                                                control={controlBase}
                                                render={({ field, fieldState }) => 
                                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-6">
                                            <label htmlFor="email" className={classNames({ 'p-error': errorsDetails.lastname })}>{"Address Mail"}</label>
                                            <Controller name="email" control={controlBase}
                                                rules={{ 
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }}}
                                                render={({ field, fieldState }) => (
                                                    <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                            )} />
                                        </div>
                                        <div className="field col-12 md:col-6">
                                            <label htmlFor="password" className={classNames({ 'p-error': errorsBase.password })}>Mot de passe*</label>
                                                <Controller name="password" control={controlBase} 
                                                render={({ field, fieldState }) => (
                                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                                )} />
                                        </div>
                                        <div className="field col-12 md:col-6">
                                            <label htmlFor="encryption_password" className={classNames({ 'p-error': errorsBase.password })}>Mot de passe du COFFRE-FORT</label>
                                                <Controller name="encryption_password" control={controlBase} 
                                                render={({ field, fieldState }) => (
                                                    <Password id={field.name} {...field} toggleMask className={classNames({ 'p-invalid': fieldState.invalid })} header={passwordHeader} footer={passwordFooter} />
                                                )} />
                                        </div>
                                        <Button type="submit" label="Envoyer" className="mt-2" />
                                    </div>
                                </form>
                            </AccordionTab>
                        </Accordion>
                    </div>
                    
                    <div className="card p-fluid" >
                        <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                        <h5>Modifications Avancées Enregistrée!</h5>
                                    </div>
                        </Dialog>

                        <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-times-circle" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                                        <h5>Erreur!</h5>
                                        <h5>{responseMessage}</h5>
                                    </div>
                        </Dialog>

                        <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="p-fluid">
                        <Accordion>
                            <AccordionTab header="Details">
                                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                        <h5>Modifications Avancées Enregistrée!</h5>
                                    </div>
                                </Dialog>

                                <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-times-circle" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                                        <h5>Erreur!</h5>
                                        <h5>{responseMessage}</h5>
                                    </div>
                                </Dialog>

                                <h5>Détails</h5>
                                {/* <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="p-fluid"> */}
                                    <div className="p-fluid formgrid grid">
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="firstname" className={classNames({ 'p-error': errorsDetails.firstname })}>{"Prénom"}</label>
                                            <Controller
                                                name="firstname"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="lastname" className={classNames({ 'p-error': errorsDetails.lastname })}>{"Nom"}</label>
                                            <Controller
                                                name="lastname"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="phone_number" className={classNames({ 'p-error': errorsDetails.phone_number })}>{"Numéro de téléphone"}</label>
                                            <Controller
                                                name="phone_number"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                    <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 ">
                                            <label htmlFor="address" className={classNames({ 'p-error': errorsDetails.address })}>{"Addresse"}</label>
                                            <Controller
                                                name="address"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                    <InputTextarea id={field.name} rows={4} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="city" className={classNames({ 'p-error': errorsDetails.city })}>{"Ville"}</label>
                                            <Controller
                                                name="city"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="country" className={classNames({ 'p-error': errorsDetails.address })}>{"Pays"}</label>
                                            <Controller
                                                name="country"
                                                control={controlDetails}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        id="country"
                                                        value={field.value}
                                                        onChange={(e) => field.onChange(e.value)}
                                                        options={countries}
                                                        optionLabel="name"
                                                        placeholder="Select One"
                                                    />
                                                )}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="post_code" className={classNames({ 'p-error': errorsDetails.address })}>{"Code Postal"}</label>
                                            <Controller
                                                name="post_code"
                                                control={controlDetails}
                                                render={({ field, fieldState }) => 
                                                <InputText id={field.name} {...field} autoFocus className={classNames({ 'p-invalid': fieldState.invalid })}/>}
                                            />
                                        </div>
                                        <div className="field col-12 md:col-3">
                                            <label htmlFor="birthday">Date D'anniversaire</label>
                                                <Controller name="birthday" control={controlDetails} render={({ field }) => (
                                                    <Calendar
                                                        id={field.name}
                                                        value={field.value ? new Date(field.value) : null}
                                                        onChange={(e) => field.onChange(e.value)} 
                                                        dateFormat="dd/mm/yy"
                                                        mask="99/99/9999"
                                                        showIcon
                                                    />
                                                )} />
                                        </div>
                                    </div>
                                    {/* <Button type="submit" label="Envoyer" className="mt-2" />
                                </form> */}
                            </AccordionTab>
                        </Accordion>
                        <Accordion>
                            <AccordionTab header="Fiscal">
                                <Dialog visible={showMessage} onHide={() => setShowMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-check-circle" style={{ fontSize: '5rem', color: 'var(--green-500)' }}></i>
                                        <h5>Modifications Avancées Enregistrée!</h5>
                                    </div>
                                </Dialog>

                                <Dialog visible={showErrorMessage} onHide={() => setShowErrorMessage(false)} position="top" footer={dialogFooter} showHeader={false} breakpoints={{ '960px': '80vw' }} style={{ width: '30vw' }}>
                                    <div className="flex justify-content-center flex-column pt-6 px-3"
                                        style={{ textAlign: "center" }}
                                    >
                                        <i className="pi pi-times-circle" style={{ fontSize: '5rem', color: 'var(--red-500)' }}></i>
                                        <h5>Erreur!</h5>
                                        <h5>{responseMessage}</h5>
                                    </div>
                                </Dialog>

                                <h5>Fiscal</h5>
                                {/* <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="p-fluid"> */}
                                    <Accordion>
                                            <AccordionTab header="Salaires">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="salary_1" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.salary_1 })}>{"Salaire 1"}</label>
                                                    <Controller
                                                        name="fiscal_details.salary_1"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            <InputNumber
                                                                id={field.name}
                                                                value={field.value}
                                                                onValueChange={(e) => field.onChange(e.value)}
                                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="salary_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.salary_2 })}>{"Salaire 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.salary_2"
                                                        control={controlDetails}
                                                        rules={{ required: "Champ requis", pattern: { value: /^[0-9]*$/, message: 'Doit être un nombre' }}}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="salary_3" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.salary_3 })}>{"Salaire 3"}</label>
                                                    <Controller
                                                        name="fiscal_details.salary_3"
                                                        control={controlDetails}
                                                        rules={{ required: "Champ requis", pattern: { value: /^[0-9]*$/, message: 'Doit être un nombre' }}}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="couple">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="in_couple" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.in_couple })}>{"En couple"}</label>
                                                    <Controller
                                                        name="fiscal_details.in_couple"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="waiting_child" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.waiting_child })}>{"Enfant à charge"}</label>
                                                    <Controller
                                                        name="fiscal_details.waiting_child"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="child_number" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.child_number })}>{"Nombre d'enfants"}</label>
                                                    <Controller
                                                        name="fiscal_details.child_number"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="Maison">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="owner" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.owner })}>{"Propriétaire"}</label>
                                                    <Controller
                                                        name="fiscal_details.owner"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="Ventes">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="sales_1" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.sales_1 })}>{"Ventes 1"}</label>
                                                    <Controller
                                                        name="fiscal_details.sales_1"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="sales_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.sales_2 })}>{"Ventes 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.sales_2"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="sales_3" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.sales_3 })}>{"Ventes 3"}</label>
                                                    <Controller
                                                        name="fiscal_details.sales_3"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="Bénéfices">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="self_employed_business_profits" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.self_employed_business_profits })}>{"Bénéfices d'entreprise"}</label>
                                                    <Controller
                                                        name="fiscal_details.self_employed_business_profits"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="housed_free_of_charge" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.housed_free_of_charge })}>{"Logé gratuitement"}</label>
                                                    <Controller
                                                        name="fiscal_details.housed_free_of_charge"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="housing_allowance_1" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.housing_allowance_1 })}>{"Aide au logement 1"}</label>
                                                    <Controller
                                                        name="fiscal_details.housing_allowance_1"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="housing_allowance_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.housing_allowance_2 })}>{"Aide au logement 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.housing_allowance_2"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="housing_allowance_3" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.housing_allowance_3 })}>{"Aide au logement 3"}</label>
                                                    <Controller
                                                        name="fiscal_details.housing_allowance_3"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="AAH">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="aah_1" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.aah_1 })}>{"AAH 1"}</label>
                                                    <Controller
                                                        name="fiscal_details.aah_1"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                {/* <div className="field col-12 md:col-6">
                                                    <label htmlFor="aah_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.aah_2 })}>{"AAH 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.aah_2"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} {...field} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div> */}
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="aah_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.aah_2 })}>{"AAH 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.aah_2"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            <InputNumber
                                                                id={field.name}
                                                                value={field.value} // Ensure this is number type
                                                                onValueChange={(e) => field.onChange(e.value)} // Correctly handles value change
                                                                className={classNames({ 'p-invalid': fieldState.invalid })}
                                                            />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="aah_3" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.aah_3 })}>{"AAH 3"}</label>
                                                    <Controller
                                                        name="fiscal_details.aah_3"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                            <AccordionTab header="Investissement">
                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="annual_investment_income" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.annual_investment_income })}>{"Revenus d'investissement annuels"}</label>
                                                    <Controller
                                                        name="fiscal_details.annual_investment_income"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="other_resources_received_1" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.other_resources_received_1 })}>{"Autres ressources 1"}</label>
                                                    <Controller
                                                        name="fiscal_details.other_resources_received_1"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="other_resources_received_2" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.other_resources_received_2 })}>{"Autres ressources 2"}</label>
                                                    <Controller
                                                        name="fiscal_details.other_resources_received_2"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>

                                                <div className="field col-12 md:col-6">
                                                    <label htmlFor="other_resources_received_3" className={classNames({ 'p-error': errorsDetails?.fiscal_details?.other_resources_received_3 })}>{"Autres ressources 3"}</label>
                                                    <Controller
                                                        name="fiscal_details.other_resources_received_3"
                                                        control={controlDetails}
                                                        render={({ field, fieldState }) => (
                                                            // <InputText id={field.name} {...field} />
                                                            <InputNumber id={field.name} value={field.value} onValueChange={(e) => field.onChange(e.value)} className={classNames({ 'p-invalid': fieldState.invalid })} />
                                                        )}
                                                    />
                                                </div>
                                            </AccordionTab>
                                        </Accordion>
                                    
                                {/* </form> */}
                            </AccordionTab>
                        </Accordion>
                        <Accordion>
                            <AccordionTab header="Social">

                                <h5>Social</h5>
                                {/* <form onSubmit={handleSubmitDetails(onSubmitDetails)} className="p-fluid"> */}
                                <div className="p-fluid formgrid grid">
                                    {userDataDetails?.socialCategorie && (
                                        <div className="field col-12 md:col-4">
                                            <label htmlFor="employmentStatus">{"Catégorie sociale"}</label>

                                            <Controller
                                                name="social_categorie"
                                                control={controlDetails}
                                                render={({ field }) => (
                                                    <Dropdown
                                                        id={field.name}
                                                        value={
                                                            watchedSocialCategory.self_employed === 1 ? 'self_employed' :
                                                            watchedSocialCategory.auto_entrepreneur === 1 ? 'auto_entrepreneur' :
                                                            watchedSocialCategory.student === 1 ? 'student' :
                                                            watchedSocialCategory.employee === 1 ? 'employee' : null
                                                        }
                                                        options={socialCategoryOptions}
                                                        onChange={(e) => handleCategoryChange(e.value)}
                                                        placeholder="Sélectionner une catégorie"
                                                        className="w-full"
                                                    />
                                                )}
                                            />

                                            {/* Utiliser `watchedSocialCategory` pour vérifier la condition d'affichage */}
                                            {(watchedSocialCategory?.self_employed === 1 || watchedSocialCategory?.auto_entrepreneur === 1) && (
                                                <>
                                                    <label htmlFor="activity">{"Activité"}</label>
                                                    <Controller
                                                        name="social_categorie.activity"
                                                        control={controlDetails}
                                                        render={({ field: fieldState }) => (
                                                            <Dropdown
                                                                id={fieldState.name}
                                                                value={fieldState.value}
                                                                options={activityOptions}
                                                                onChange={(e) => fieldState.onChange(e.value)}
                                                                placeholder="Sélectionner une activité"
                                                                className="w-full"
                                                            />
                                                        )}
                                                    />
                                                </>
                                            )}
                                        </div>
                                    )}
                                </div>
                                {/* </form> */}
                            </AccordionTab>
                        </Accordion>
                    <Button type="submit" label="Envoyer" className="mt-2" />
                    </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
