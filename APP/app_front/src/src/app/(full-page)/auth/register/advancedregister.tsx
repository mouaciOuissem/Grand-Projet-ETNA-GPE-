import React, { useCallback, useState, useEffect, useRef } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { FileUpload } from 'primereact/fileupload';
import '@/src/styles/layout/buttons.scss';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { DropdownChangeEvent } from 'primereact/dropdown';

import { useApi } from '@/src/layout/context/apiContext';

const AdvancedRegister: React.FC = () => {
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3 for form steps
    const [currentSubStep, setCurrentSubStep] = useState(1);
    const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
    const [userInfo, setUserInfo] = useState<{ username?: string; id?: number, role_id?: number } | null>(null);
    const [responseMessage, setResponseMessage] = useState('');
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showMessage, setShowMessage] = useState(false);
    const [showSuccessDialog, setShowSuccessDialog] = useState(false);
    const buttonEl = useRef(null);
    const { getApiUrl } = useApi();
    const [redirectToDashboard, setRedirectToDashboard] = useState(false);

    // Modal.setAppElement('#__next');

    //     // Handle form submission success
    //     const handleSuccessModalOpen = () => {
    //         setShowSuccessModal(true);
    //     };
    
    //     const handleSuccessModalClose = () => {
    //         setShowSuccessModal(false);
    //         // router.push('/success-page');
    //     };

    const [formDataDetails, setFormDataDetails] = useState({
        // Form 1 fields - UserDetails
        firstname: '',
        lastname: '',
        address: '',
        post_code: '',
        city: '',
        country: '',
        phone_number: '',
        pronouns: '',
        profile_picture: '/layout/images/login/profil.png',
        birthday: null,
    });

    const [formDataFiscal, setFormDataFiscal] = useState({
        // Form 2 fields - UserFiscalDetails
        salary_1: 0,
        salary_2: 0,
        salary_3: 0,
        sales_1: 0,
        sales_2: 0,
        sales_3: 0,
        self_employed_business_profits: 0,
        in_couple: 0,
        waiting_child: 0,
        child_number: 0,
        owner: 0,
        housed_free_of_charge: 0,
        housing_allowance_1: 0,
        housing_allowance_2: 0,
        housing_allowance_3: 0,
        aah_1: 0,
        aah_2: 0,
        aah_3: 0,
        annual_investment_income: 0,
        other_resources_received_1: 0,
        other_resources_received_2: 0,
        other_resources_received_3: 0,
    });

    // Dropdown options for social categories
    const socialCategoryOptions = [
        { label: 'Travailleur indépendant', value: 'self_employed' },
        { label: 'Auto-entrepreneur', value: 'auto_entrepreneur' },
        { label: 'Étudiant', value: 'student' },
        { label: 'Employé', value: 'employee' },
        { label: 'Autre', value: 'other' },
    ];

    const socialCategoryActivityOptions = [
        { label: 'Profession libérale', value: 'Profession liberal' },
        { label: 'Artisan', value: 'Artisan' },
        { label: 'Commercant', value: 'Comercant' },
        { label: 'Autre', value: 'Autre' },
    ];

    
    const [formDataSocial, setFormDataSocial] = useState({
        // Form 3 fields - SocialCategorie
        self_employed: '',
        activity: '',
        auto_entrepreneur: '',
        student: '',
        employee: '',
    });

    // const [formDataSocialActivity, setFormDataSocialActivity] = useState({
    //     // Form 3 fields - Activity
    //     activity: '',
    // });

    // interface FormDataSocial {
    //     self_employed: number;
    //     self_employed_activity: string;
    //     self_employed_business_profits: string;
    //     auto_entrepreneur: number;
    //     auto_entrepreneur_activity: string;
    //     student: number;
    //     employee: number;
    //     sales_1: string;
    //     sales_2: string;
    //     sales_3: string;
    // }

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormDataDetails((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleFiscalInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormDataFiscal((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleSocialInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;
        setFormDataSocial((prevData) => ({ ...prevData, [id]: value }));
    };
    
    const handleSocialCategoryChange = (e) => {
        const selectedCategory = e.value;

        // Réinitialiser toutes les valeurs à "0"
        const updatedSocialData = {
            self_employed: "0",
            auto_entrepreneur: "0",
            student: "0",
            employee: "0",
        };

        // Mettre à "1" la catégorie sélectionnée
        if (selectedCategory in updatedSocialData) {
            updatedSocialData[selectedCategory] = "1";
        }

        // Mettre à jour l'état avec les nouvelles valeurs
        setFormDataSocial((prevData) => ({
            ...prevData,
            ...updatedSocialData,
        }));

        // Déterminer le sous-étape à afficher
        if (selectedCategory !== 'self_employed' && selectedCategory !== 'auto_entrepreneur') {
            setCurrentSubStep(3);
        } else {
            setCurrentSubStep(2); // Avancer à la sous-étape 2
        }
    };

    // const handleSocialCategoryActivityChange = (e: DropdownChangeEvent) => {
    //     const value = e.value;
    //     setFormDataSocialActivity((prevData) => ({ ...prevData, activity: value }));
    // };

    const handleSocialCategoryActivityChange = (e: DropdownChangeEvent) => {
        const value = e.value;
        setFormDataSocial((prevData) => ({ ...prevData, activity: value }));
    };

    // Dropdown options
    const pronounOptions = [{ label: 'Homme', value: 'he/him' }, { label: 'Femme', value: 'she/her' }, { label: 'Autre', value: 'they/them' }];
    const yesNoOptions = [{ label: 'Oui', value: '1' }, { label: 'Non', value: '0' }];

    const handleDropdownChange = (e: { value: any; id: string }) => {
        const { id, value } = e;
        setFormDataDetails((prevData) => ({ ...prevData, [id]: value }));
    };

    const handleDropdownChangeFiscal = (e: { value: any; id: string }) => {
        const { id, value } = e;
        setFormDataFiscal((prevData) => ({ ...prevData, [id]: value }));
    };

    // const handleDropdownChangeSocial = (e: { value: any; id: string }) => {
    //     const { id, value } = e;
    //     setFormDataSocial((prevData) => ({ ...prevData, [id]: value }));
    // };
    // Handle file upload
    const handleFileUpload = (e: any) => {
        setFormDataDetails((prevData) => ({ ...prevData, profile_picture: e.files[0] }));
    };


    // Navigation
    const handleNextStep = () => {
        if (currentStep === 2 && currentSubStep < 4) {
            setCurrentSubStep(currentSubStep + 1);
        } else if (currentStep === 3 && currentSubStep < 3) {
            setCurrentSubStep(currentSubStep + 1);
        } else if (currentStep === 4) {
            handleSubmit(); // Ici, handleSubmit sera appelé automatiquement
        } else {
            setCurrentStep(currentStep + 1);
            setCurrentSubStep(1); // Réinitialiser les sous-étapes
        }
    };
    
    const handlePreviousStep = () => {
        if ((currentStep === 2 || currentStep === 3) && currentSubStep > 1) {
            // Si on est dans une sous-étape, reculer dans les sous-étapes
            setCurrentSubStep(currentSubStep - 1);
        } else {
            // Passer à l'étape précédente
            setCurrentStep(currentStep - 1);
            setCurrentSubStep(currentStep === 3 ? 3 : 1); // Réinitialiser les sous-étapes
        }
    };
    
    const checkAuth = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/auth/check-cookie`, {
                method: 'GET',
                credentials: 'include',
            });
            const data = await response.json();

            if (response.ok) {
                if (data.isAuthenticated) {
                    setIsAuthenticated(true);
                    setUserInfo(data.user || null);
                    return data.isAuthenticated;
                } else {
                    setIsAuthenticated(false);
                    setUserInfo(null);
                }
            } else {
                setIsAuthenticated(false);
                setUserInfo(null);
                return false;
            }
        } catch (error) {
            setIsAuthenticated(false);
            setUserInfo(null);
            return false;
        }
    };

    const updateDetails = useCallback((data) => {
       
        const sanitizeData = (data) => {
            const sanitizedSocialCategorie = Object.fromEntries(
                Object.entries(data.social_categorie).map(([key, value]) => [key, value === '' ? null : value])
            );
            const sanitizedFiscalDetails = Object.fromEntries(
                Object.entries(data.fiscal_details).map(([key, value]) => [key, value === '' ? null : value])
            );
            
            return {
                ...data,
                social_categorie: sanitizedSocialCategorie,
                fiscal_details: sanitizedFiscalDetails
            };
        };
        const sanitizedData = sanitizeData(data);

        const apiUrl = getApiUrl();
        fetch(`${apiUrl}/details/user/`, {
            method: "PATCH",
            body: JSON.stringify(sanitizedData),
            credentials: 'include',
            mode: 'cors',
            headers: {
                "Accept" : "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => {
            if (!res.ok) {
                // Si le statut HTTP n'est pas 200-299, on lève une erreur personnalisée
                return res.json().then(err => {
                    throw new Error(err.error_message || 'Une erreur est survenue lors de la mise à jour des détails.');
                });
            }
            setShowSuccessDialog(true);
            return res.json();
        })
        .then((data) => {
            if (data.error_message) {
                setResponseMessage(data.error_message);
                setShowErrorMessage(true);
            } else {
                setShowMessage(true);
                setIsAuthenticated(true);
                setShowErrorMessage(false);
            }
        })
        .catch((err) => {
            // Capture de l'erreur HTTP ou du fetch
            console.error("Erreur pendant le fetch:", err);
            setResponseMessage(err.message || "Une erreur inconnue est survenue.");
            setShowErrorMessage(true);
        });
    }, []);

    // Submit
    const handleSubmit = async () => {
        const authenticated = await checkAuth(); // Get authentication status directly

        if (!authenticated) { // Check the returned value
            alert("You must be logged in to submit the form.");
            return;
        }
    
        const formData = {
            ...formDataDetails,
            fiscal_details: {
                ...formDataFiscal,
            },
            social_categorie: {
                ...formDataSocial,
            }
        };
    
        try {
            await updateDetails(formData);
            
        } catch (error) {
            console.error('Error submitting form:', error);
            alert("There was an error submitting your form. Please try again.");
        }
    };

    const handleSuccessDialogClose = () => {
        setShowSuccessDialog(false);
        setRedirectToDashboard(true);
    };

    // useEffect(() => {
    //     if (redirectToDashboard) {
    //         router.push('/dashboard');
    //         setTimeout(() => {
    //             window.location.reload();
    //         }, 1000)        
    //     }
    // }, [redirectToDashboard]);
    useEffect(() => {
        if (redirectToDashboard) {
            window.location.href = '/dashboard';
        }
    }, [redirectToDashboard]);

    return (
        <div className="surface-ground flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            {/* Step 1: Basic Information Form */}
            {currentStep === 1 && (
                <div className="fields-container">
                    <h2>Etapes 1: Informations personelles</h2>

                    {/* First Name */}
                    <label htmlFor="first_name" className="field-label">Prénom</label>
                    <InputText id="firstname" value={formDataDetails.firstname} onChange={handleInputChange} placeholder="John" className="field-input" />

                    {/* Last Name */}
                    <label htmlFor="last_name" className="field-label">Nom de famille</label>
                    <InputText id="lastname" value={formDataDetails.lastname} onChange={handleInputChange} placeholder="Doe" className="field-input" />

                    {/* Address */}
                    <label htmlFor="address" className="field-label">Addresse</label>
                    <InputText id="address" value={formDataDetails.address} onChange={handleInputChange} placeholder="53 rue des hortensias" className="field-input" />

                    {/* Postal Code */}
                    <label htmlFor="post_code" className="field-label">Code postal</label>
                    <InputText id="post_code" value={formDataDetails.post_code} onChange={handleInputChange} placeholder="75000" className="field-input" />

                    {/* City */}
                    <label htmlFor="city" className="field-label">Ville</label>
                    <InputText id="city" value={formDataDetails.city} onChange={handleInputChange} placeholder="Paris" className="field-input" />

                    {/* Country */}
                    <label htmlFor="country" className="field-label">Pays</label>
                    <InputText id="country" value={formDataDetails.country} onChange={handleInputChange} placeholder="France" className="field-input" />

                    {/* Phone Number */}
                    <label htmlFor="phone_number" className="field-label">Numéro de télephone</label>
                    <InputText id="phone_number" value={formDataDetails.phone_number} onChange={handleInputChange} placeholder="00-00-00-00-00" className="field-input" />
                    {/* <InputMask id="phone_number" value={formDataDetails.phone_number} onChange={(e) => {handleInputChange}(e.target.value)} mask="00-00-00-00-00" placeholder="00-00-00-00-00" /> */}

                    {/* Pronouns */}
                    <label htmlFor="pronouns" className="field-label">Genre</label>
                    <Dropdown 
                        id="pronouns" 
                        value={formDataDetails.pronouns} 
                        options={pronounOptions} 
                        onChange={(e) => handleDropdownChange({ id: 'pronouns', value: e.value })} 
                        placeholder="Sélectionner" 
                        className="field-input" 
                    />

                    {/* Birthday */}
                    <label htmlFor="birthday" className="field-label">Date d'anniversaire</label>
                    <Calendar 
                        id="birthday" 
                        value={formDataDetails.birthday} 
                        onChange={(e) => setFormDataDetails((prevData) => ({ ...prevData, birthday: e.value }))} 
                        placeholder="Sélectionner" 
                        className="field-input"
                        dateFormat="dd/mm/yy"
                        showIcon 
                    />

                    {/* Profile Picture */}
                    {/* <label htmlFor="profile_picture" className="field-label">Profile Picture</label>
                    <FileUpload 
                        id="profile_picture" 
                        mode="basic" 
                        auto 
                        chooseLabel="Choose" 
                        customUpload 
                        onUpload={handleFileUpload} 
                        accept="image/*" 
                        maxFileSize={1000000} 
                    /> */}

                    {/* Navigation Buttons */}
                    <div className="button-group">
                        <Button label="Suivant" className="p-button p-component p-button-primary custom-button" onClick={handleNextStep} />
                    </div>
                </div>
            )}

            {/* Step 2: Fiscal Details */}
            {currentStep === 2 && (
                <div className="fields-container">
                    <h2>Etape 2.{currentSubStep}: Details Fiscaux </h2>

                    {/* Sub-step 2.1 - Salary and Couple Information */}
                    {currentSubStep === 1 && (
                        <>
                            <label htmlFor="salary_1" className="field-label">Salaire 1</label>
                            <InputText id="salary_1" value={String(formDataFiscal.salary_1)} onChange={handleFiscalInputChange} placeholder="50000" className="field-input" type="number" />

                            <label htmlFor="salary_2" className="field-label">Salaire 2</label>
                            <InputText id="salary_2" value={String(formDataFiscal.salary_2)} onChange={handleFiscalInputChange} placeholder="50000" className="field-input" type="number" />

                            <label htmlFor="salary_3" className="field-label">Salaire 3</label>
                            <InputText id="salary_3" value={String(formDataFiscal.salary_3)} onChange={handleFiscalInputChange} placeholder="50000" className="field-input" type="number" />

                            <label htmlFor="in_couple" className="field-label">Etes-vous en couple ?</label>
                            <Dropdown id="in_couple" value={formDataFiscal.in_couple} options={yesNoOptions} onChange={(e) => handleDropdownChangeFiscal({ id: 'in_couple', value: e.value })} placeholder="Sélectionner" className="field-input" />

                            <label htmlFor="waiting_child" className="field-label">Attentedez-vous des enfants ?</label>
                            <Dropdown id="waiting_child" value={formDataFiscal.waiting_child} options={yesNoOptions} onChange={(e) => handleDropdownChangeFiscal({ id: 'waiting_child', value: e.value })} placeholder="Sélectionner" className="field-input" />

                            <label htmlFor="child_number" className="field-label">Nombre d'enfants</label>
                            <InputText id="child_number" value={String(formDataFiscal.child_number)} onChange={handleFiscalInputChange} placeholder="0" className="field-input" type="number" />
                        </>
                    )}

                    {/* Sub-step 2.2 - Owner and Housing Information */}
                    {currentSubStep === 2 && (
                        <>
                            <label htmlFor="owner" className="field-label">Êtes-vous propriétaire d'un bien immobilier? ?</label>
                            <Dropdown id="owner" value={formDataFiscal.owner} options={yesNoOptions} onChange={(e) => handleDropdownChangeFiscal({ id: 'owner', value: e.value })} placeholder="Sélectionner" className="field-input" />

                            <label htmlFor="housed_free_of_charge" className="field-label">Etes-vous logé gratuitement ?</label>
                            <Dropdown id="housed_free_of_charge" value={formDataFiscal.housed_free_of_charge} options={yesNoOptions} onChange={(e) => handleDropdownChangeFiscal({ id: 'housed_free_of_charge', value: e.value })} placeholder="Sélectionner" className="field-input" />

                            <label htmlFor="housing_allowance_1" className="field-label">Aide au logement 1</label>
                            <InputText id="housing_allowance_1" value={String(formDataFiscal.housing_allowance_1)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                     
                            <label htmlFor="housing_allowance_2" className="field-label">Aide au logement 2</label>
                            <InputText id="housing_allowance_2" value={String(formDataFiscal.housing_allowance_2)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                     
                            <label htmlFor="housing_allowance_3" className="field-label">Aide au logement 3</label>
                            <InputText id="housing_allowance_3" value={String(formDataFiscal.housing_allowance_3)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                     
                        </>
                    )}

                    {/* Sub-step 2.3 - AAH Information */}
                    {currentSubStep === 3 && (
                        <>
                            <label htmlFor="aah_1" className="field-label">AAH 1</label>
                            <InputText id="aah_1" value={String(formDataFiscal.aah_1)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />

                            <label htmlFor="aah_2" className="field-label">AAH 2</label>
                            <InputText id="aah_2" value={String(formDataFiscal.aah_2)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                            
                            <label htmlFor="aah_3" className="field-label">AAH 3</label>
                            <InputText id="aah_3" value={String(formDataFiscal.aah_3)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                        
                        </>
                    )}

                    {/* Sub-step 2.4 - Annual and Other Resources Information */}
                    {currentSubStep === 4 && (
                        <>
                            <label htmlFor="annual_investment_income" className="field-label">Revenu annuel de vos placement</label>
                            <InputText id="annual_investment_income" value={String(formDataFiscal.annual_investment_income)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />

                            <label htmlFor="other_resources_received_1" className="field-label">Autres ressources 1</label>
                            <InputText id="other_resources_received_1" value={String(formDataFiscal.other_resources_received_1)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />

                            <label htmlFor="other_resources_received_2" className="field-label">Autres ressources 2</label>
                            <InputText id="other_resources_received_2" value={String(formDataFiscal.other_resources_received_2)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                   
                            <label htmlFor="other_resources_received_3" className="field-label">Autres ressources 3</label>
                            <InputText id="other_resources_received_3" value={String(formDataFiscal.other_resources_received_3)} onChange={handleFiscalInputChange} placeholder="Enter amount" className="field-input" type="number" />
                   
                        </>
                    )}

                    <div className="button-group">
                        <Button label="Précédent" className="p-button p-component p-button-secondary custom-button" onClick={handlePreviousStep} />
                        <Button label="Suivant" className="p-button p-component p-button-primary custom-button" onClick={handleNextStep} />
                    </div>
                </div>
            )}

            {/* Step 3:Social Categorie */}
            {currentStep === 3 && (
                <div className="fields-container">
                    <h2>Etape 3.{currentSubStep}: Catégories sociales</h2>

                    {/* Substep 3.1 - Social Category Selection */}
                    {currentSubStep === 1 && (
                        <>
                            <label htmlFor="social_category" className="field-label">Sélectionnez votre catégorie sociale</label>
                            <Dropdown 
                                id="social_category" 
                                value={formDataSocial.self_employed} 
                                options={socialCategoryOptions} 
                                onChange={handleSocialCategoryChange} 
                                placeholder="Sélectionner votre catégorie" 
                                className="field-input" 
                            />
                        </>
                    )}

                    {/* Substep 3.2 - Additional Data for Specific Categories */}
                    {currentSubStep === 2 && (
                        <>
                            {formDataSocial.self_employed === '1' && (
                                <>
                                    <label htmlFor="social_category" className="field-label">Sélectionnez votre secteur d'activité</label>
                                    <Dropdown 
                                        id="social_category" 
                                        value={formDataSocial.activity} 
                                        options={socialCategoryActivityOptions} 
                                        onChange={handleSocialCategoryActivityChange} 
                                        placeholder="Sélectionner votre activité" 
                                        className="field-input" 
                                    />
                                    {/* <label htmlFor="activity" className="field-label">Activity</label>
                                    <InputText 
                                        id="activity" 
                                        value={formDataSocial.activity} 
                                        onChange={handleSocialInputChange} 
                                        placeholder="Describe your activity" 
                                        className="field-input" 
                                    /> */}
                                    <label htmlFor="self_employed_business_profits" className="field-label">Bénéfices</label>
                                    <InputText 
                                        id="self_employed_business_profits" 
                                        value={String(formDataFiscal.self_employed_business_profits)} 
                                        onChange={handleFiscalInputChange} 
                                        placeholder="Enter profits" 
                                        className="field-input" 
                                        type="number" 
                                    />
                                </>
                            )}

                            {formDataSocial.auto_entrepreneur  === '1' && (
                                <>
                                    <label htmlFor="social_category" className="field-label">Sélectionnez votre secteur d'activité</label>
                                    <Dropdown 
                                        id="social_category" 
                                        value={formDataSocial.activity} 
                                        options={socialCategoryActivityOptions} 
                                        onChange={handleSocialCategoryActivityChange} 
                                        placeholder="Selectionner votre Activité" 
                                        className="field-input" 
                                    />
                                    {/* <label htmlFor="activity" className="field-label">Auto Entrepreneur Activity</label>
                                    <InputText 
                                        id="activity" 
                                        value={formDataSocial.activity} 
                                        onChange={handleSocialInputChange} 
                                        placeholder="Describe your activity" 
                                        className="field-input" 
                                    /> */}
                                </>
                            )}
                        </>
                    )}

                    {/* Substep 3.3 - Sales Information */}
                    {currentSubStep === 3 && (
                        <>
                            <label htmlFor="sales_1" className="field-label">Ventes 1</label>
                            <InputText 
                                id="sales_1" 
                                value={String(formDataFiscal.sales_1)} 
                                onChange={handleFiscalInputChange} 
                                placeholder="Enter amount" 
                                className="field-input" 
                                type="number" 
                            />

                            <label htmlFor="sales_2" className="field-label">Ventes 2</label>
                            <InputText 
                                id="sales_2" 
                                value={String(formDataFiscal.sales_2)} 
                                onChange={handleFiscalInputChange} 
                                placeholder="Enter amount" 
                                className="field-input" 
                                type="number" 
                            />

                            <label htmlFor="sales_3" className="field-label">Ventes 3</label>
                            <InputText 
                                id="sales_3" 
                                value={String(formDataFiscal.sales_3)} 
                                onChange={handleFiscalInputChange} 
                                placeholder="Enter amount" 
                                className="field-input" 
                                type="number" 
                            />
                        </>
                    )}

                    {/* Navigation Buttons */}
                    <div className="button-container">
                        <Button label="Précédent" className="p-button p-component p-button-secondary custom-button" onClick={handlePreviousStep} />
                        <Button label="Suivant" className="p-button p-component p-button-primary custom-button" onClick={handleNextStep} />
                    </div>
                </div>
            )}

            
            {/* Review & Submit */}
            {currentStep === 4 && (
                <div className="review-container">
                <h2>Étape 4 : Examinez vos informations</h2>

                {/* Display User Details */}
                <div className="review-section">
                    <h3>Informations Personnelles</h3>
                    <p><strong>Prénom :</strong> {formDataDetails.firstname}</p>
                    <p><strong>Nom de famille :</strong> {formDataDetails.lastname}</p>
                    <p><strong>Adresse :</strong> {formDataDetails.address}</p>
                    <p><strong>Code postal :</strong> {formDataDetails.post_code}</p>
                    <p><strong>Ville :</strong> {formDataDetails.city}</p>
                    <p><strong>Pays :</strong> {formDataDetails.country}</p>
                    <p><strong>Numéro de téléphone :</strong> {formDataDetails.phone_number}</p>
                    <p><strong>Pronoms :</strong> {formDataDetails.pronouns}</p>
                    <p><strong>Date de naissance :</strong> {formDataDetails.birthday?.toLocaleDateString()}</p>
                    {/* <p><strong>Photo de profil :</strong> {formDataDetails.profile_picture ? formDataDetails.profile_picture : 'Aucun fichier téléchargé'}</p> */}
                </div>

                {/* Display Fiscal Details */}
                <div className="review-section">
                    <h3>Détails Fiscaux</h3>
                    <p><strong>Salaire 1 :</strong> {formDataFiscal.salary_1}</p>
                    <p><strong>Salaire 2 :</strong> {formDataFiscal.salary_2}</p>
                    <p><strong>Salaire 3 :</strong> {formDataFiscal.salary_3}</p>
                    <p><strong>En couple :</strong> {formDataFiscal.in_couple}</p>
                    <p><strong>En attente d'un enfant :</strong> {formDataFiscal.waiting_child}</p>
                    <p><strong>Nombre d'enfants :</strong> {formDataFiscal.child_number}</p>
                    <p><strong>Propriétaire :</strong> {formDataFiscal.owner}</p>
                    <p><strong>Logé à titre gratuit :</strong> {formDataFiscal.housed_free_of_charge}</p>
                    <p><strong>Aide au logement 1 :</strong> {formDataFiscal.housing_allowance_1}</p>
                    <p><strong>Aide au logement 2 :</strong> {formDataFiscal.housing_allowance_2}</p>
                    <p><strong>Aide au logement 3 :</strong> {formDataFiscal.housing_allowance_3}</p>
                    <p><strong>AAH 1 :</strong> {formDataFiscal.aah_1}</p>
                    <p><strong>AAH 2 :</strong> {formDataFiscal.aah_2}</p>
                    <p><strong>AAH 3 :</strong> {formDataFiscal.aah_3}</p>
                    <p><strong>Revenus annuels d'investissement :</strong> {formDataFiscal.annual_investment_income}</p>
                    <p><strong>Autres ressources 1 :</strong> {formDataFiscal.other_resources_received_1}</p>
                    <p><strong>Autres ressources 2 :</strong> {formDataFiscal.other_resources_received_2}</p>
                    <p><strong>Autres ressources 3 :</strong> {formDataFiscal.other_resources_received_3}</p>
                </div>

                {/* Display Social Catégorie */}
                    <div className="review-section">
                        <h3>Détails Sociaux</h3>
                        <p><strong>Catégorie Sociale :</strong> {formDataSocial.self_employed ? "Self-Employed" : formDataSocial.auto_entrepreneur ? "Auto Entrepreneur" : 'N/A'}</p>

                        {/* Display additional information for Self-Employed */}
                        {formDataSocial.self_employed === '1' && (
                            <>
                                <p><strong>Activité d'Indépendant :</strong> {formDataSocial.activity}</p>
                                <p><strong>Bénéfices :</strong> {formDataFiscal.self_employed_business_profits}</p>
                            </>
                        )}

                        {/* Display additional information for Auto Entrepreneur */}
                        {formDataSocial.auto_entrepreneur === '1' && (
                            <>
                                <p><strong>Activité d'Auto-Entrepreneur :</strong> {formDataSocial.activity}</p>
                            </>
                        )}

                        {/* Display Sales Information */}
                        <p><strong>Ventes 1:</strong> {formDataFiscal.sales_1}</p>
                        <p><strong>Ventes 2:</strong> {formDataFiscal.sales_2}</p>
                        <p><strong>Ventes 3:</strong> {formDataFiscal.sales_3}</p>
                    </div>
                    
                    <Button label="Précédent" className="p-button p-component p-button-secondary custom-button" onClick={handlePreviousStep} />
                    <Button label="Confirmer & Soumettre" className="p-button p-button-success p-component p-button-primary custom-button" onClick={handleSubmit} />
                </div>
            )}
            
            <Dialog header="Inscription réussie !" visible={showSuccessDialog} style={{ width: '500px', height: '600px' }} onHide={handleSuccessDialogClose}>
                <div className="dialog-content" style={{ width: '100%', height: '100%'}}>
                    <p>Merci d'avoir complété l'inscription !</p>
                    <div className="tenor-gif-embed-wrapper" style={{ width: '100%', height: '80%'}}>
                        <iframe
                            src="/layout/images/FalloutThumbsUp.gif"
                            frameBorder="0"
                            allowFullScreen
                            style={{ width: '100%', height: '100%', border: 'none' }}
                        ></iframe>
                    </div>
                    <Button label="Close" onClick={handleSuccessDialogClose} className="p-button-success" />
                </div>
            </Dialog>
        </div>
    );
};
export default AdvancedRegister;


