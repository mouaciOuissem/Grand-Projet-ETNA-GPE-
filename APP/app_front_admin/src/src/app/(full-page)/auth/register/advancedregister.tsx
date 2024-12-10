// src/app/full-page/auth/Register/AdvancedRegister.tsx
import React, { useState, useEffect } from 'react';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import '@/src/styles/layout/buttons.scss';
import { useRouter } from 'next/navigation';

const AdvancedRegister: React.FC = () => {
    const router = useRouter();
    const [titleText, setTitleText] = useState('What kind of profile customization would you like?');
    const [showButtons, setShowButtons] = useState(true);
    const [showFields, setShowFields] = useState(false);
    const [showNextFields, setShowNextFields] = useState(false);
    const [showOtherNextFields, setShowOtherNextFields] = useState(false);
    const [buttonClicked, setButtonClicked] = useState<number | null>(null);

    // State for form data
    const [formData, setFormData] = useState({
        Username: '',
        first_name: '',
        last_name: '',
        age: '',
        location: '',
        sex: '',
        address: '',
        city: '',
        postal_code: '',
        phone_number: '',
        occupation: '',
        occupation_type: '',
        salary_1: '',
        salary_2: '',
        salary_3: ''
    });

    // Options for dropdowns
    const dropdownOptions1 = [{ label: 'Student', value: 'student' }, { label: 'self employed', value: 'self_employed' }, { label: 'Auto entrepreneur', value: 'auto_entrepreneur' }, { label: 'Employee', value: 'employee' }, { label: 'Other', value: 'other' }];
    const dropdownOptions3 = [{ label: 'Male', value: 'male' }, { label: 'Female', value: 'female' }, { label: 'Other', value: 'other' }, { label: 'Prefer not to say', value: 'n/a' }];
    const occupationTypes = [
        { label: 'Craftsman', value: 'craftsman' },
        { label: 'Retailer', value: 'retailer' }
    ];
    // Handle input blur event
    const handleBlur = (e: React.FocusEvent<HTMLInputElement> | React.FocusEvent<HTMLSelectElement>) => {
        const { id, value } = e.target as HTMLInputElement;
        setFormData(prevData => {
            const updatedData = { ...prevData, [id]: value };
            sessionStorage.setItem('formData', JSON.stringify(updatedData));
            return updatedData;
        });
    };

    // Handle dropdown change event
    const handleDropdownChange = (e: { value: any; id: string }) => {
        const { id, value } = e;
        setFormData(prevData => {
            const updatedData = { ...prevData, [id]: value };
            sessionStorage.setItem('formData', JSON.stringify(updatedData));
            return updatedData;
        });
    };

    // Load data from session storage on mount
    useEffect(() => {
        const storedData = JSON.parse(sessionStorage.getItem('formData') || '{}');
        setFormData(prevData => ({ ...prevData, ...storedData }));
    }, []);

    // Button click handlers
    const handleFirstButtonClick = () => {
        router.push('/profile');
    };

    const handleSecondThirdButtonClick = (buttonId: number) => {
        setShowButtons(false);
        setShowFields(true);
        setButtonClicked(buttonId);
        setTitleText('Fill out the information below');
    };

    const handleNextButtonClick = () => {
        setShowNextFields(true);
        setShowFields(false);
    };
    const handleOtherNextButtonClick = () => {
        setShowOtherNextFields(true);
        setShowNextFields(false);
        setShowFields(false);
    };

    const handleSubmit = () => {
        // Handle form submission logic here
        alert('Form submitted');
        router.push('/profile');
    };

    return (
        <div className="surface-ground flex flex-column align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden">
            <h1 className="title">{titleText}</h1>
            {showButtons && (
                <div className="button-container">
                    <Button label="None" className="p-button p-component p-button-primary custom-button" onClick={handleFirstButtonClick} />
                    <Button label="Basic customization" className="p-button p-component p-button-primary custom-button" onClick={() => handleSecondThirdButtonClick(2)} />
                    <Button label="Advanced customization" className="p-button p-component p-button-primary custom-button" onClick={() => handleSecondThirdButtonClick(3)} />
                    <Button label="ULTRA Advanced customization" className="p-button p-component p-button-primary custom-button" onClick={() => handleSecondThirdButtonClick(4)} />
                </div>
            )}
            {showFields && (
                <div className="fields-container">
                    <label htmlFor="first_name" className="field-label">First Name</label>
                    <InputText id="first_name" placeholder="John" className="field-input" defaultValue={formData.first_name} onBlur={handleBlur} />
                    <label htmlFor="last_name" className="field-label">Last Name</label>
                    <InputText id="last_name" placeholder="Doe" className="field-input" defaultValue={formData.last_name} onBlur={handleBlur} />
                    <label htmlFor="age" className="field-label">Age</label>
                    <InputText id="age" type="number" placeholder="20" className="field-input" min="0" max="120" defaultValue={formData.age} onBlur={handleBlur} />
                    <label htmlFor="sex" className="field-label">Sex</label>
                    <Dropdown 
                        id="sex" 
                        options={dropdownOptions3} 
                        value={formData.sex} 
                        onChange={(e) => handleDropdownChange({ id: 'sex', value: e.value })} 
                        placeholder="Select sex" 
                        className="field-input" 
                    />

                    {buttonClicked === 2 && (
                        <Button label="Submit" className="p-button p-component p-button-primary custom-button" onClick={handleSubmit} />
                    )}
                    {buttonClicked === 3 || buttonClicked === 4 && (
                        <Button label="Next" className="p-button p-component p-button-primary custom-button" onClick={handleNextButtonClick} />
                    )}
                </div>
            )}
            {showNextFields && (
                <div className="fields-container">
                    <label htmlFor="address" className="field-label">Address</label>
                    <InputText id="address" placeholder="42 Marygold Lane" className="field-input" defaultValue={formData.address} onBlur={handleBlur} />
                    <label htmlFor="location" className="field-label">Location (Country)</label>
                    <InputText id="location" placeholder="France" className="field-input" defaultValue={formData.location} onBlur={handleBlur} />
                    <label htmlFor="postal_code" className="field-label">Postal Code</label>
                    <InputText id="postal_code" type="number" placeholder="75013" className="field-input" defaultValue={formData.postal_code} onBlur={handleBlur} />
                    <label htmlFor="phone_number" className="field-label">Phone Number</label>
                    <InputText id="phone_number" placeholder="00 00 00 00 00" className="field-input" defaultValue={formData.phone_number} onBlur={handleBlur} />
                    {buttonClicked === 3 && (
                        <Button label="Submit" className="p-button p-component p-button-primary custom-button" onClick={handleSubmit} />
                    )}
                    {buttonClicked === 4 && (
                        <Button label="Next" className="p-button p-component p-button-primary custom-button" onClick={handleOtherNextButtonClick} />
                    )}
                </div>
            )}
            {showOtherNextFields && (
                <div className="fields-container">
                    <label htmlFor="occupation" className="field-label">Occupation</label>
                    <Dropdown 
                        id="occupation" 
                        options={dropdownOptions1} 
                        value={formData.occupation} 
                        onChange={(e) => {
                            handleDropdownChange({ id: 'occupation', value: e.value });
                            if (e.value === 'self_employed' || e.value === 'auto_entrepreneur') {
                                setFormData(prevData => ({ ...prevData, occupation_type: '' })); // Réinitialiser le type d'occupation
                            }
                        }} 
                        placeholder="Select occupation" 
                        className="field-input" 
                    />

                    {formData.occupation === 'self_employed' || formData.occupation === 'auto_entrepreneur' ? (
                        <>
                            <label htmlFor="occupation_type" className="field-label">Occupation Type</label>
                            <Dropdown 
                                id="occupation_type" 
                                options={occupationTypes} 
                                value={formData.occupation_type} 
                                onChange={(e) => handleDropdownChange({ id: 'occupation_type', value: e.value })} 
                                placeholder="Select occupation type" 
                                className="field-input" 
                            />
                        </>
                    ) : null}

                    <label htmlFor="salary_1" className="field-label">Salary 1</label>
                    <InputText id="salary_1" type="number" placeholder="50000" className="field-input" defaultValue={formData.salary_1} onBlur={handleBlur} />
                    
                    <label htmlFor="salary_2" className="field-label">Salary 2</label>
                    <InputText id="salary_2" type="number" placeholder="60000" className="field-input" defaultValue={formData.salary_2} onBlur={handleBlur} />
                    
                    <label htmlFor="salary_3" className="field-label">Salary 3</label>
                    <InputText id="salary_3" type="number" placeholder="70000" className="field-input" defaultValue={formData.salary_3} onBlur={handleBlur} />

                    {buttonClicked === 4 && (
                        <Button label="Submit" className="p-button p-component p-button-primary custom-button" onClick={handleSubmit} />
                    )}
                </div>
            )}
        </div>
    );
};

export default AdvancedRegister;
