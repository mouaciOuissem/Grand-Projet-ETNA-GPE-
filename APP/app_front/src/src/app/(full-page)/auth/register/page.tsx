// src/app/full-page/auth/Register/page.tsx
'use client';
import React, { useCallback, useContext, useState, useEffect, useRef  } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { Password } from 'primereact/password';
import { Divider } from 'primereact/divider';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import { Toast } from 'primereact/toast';

import AdvancedRegister from './advancedregister';
import { useApi } from '@/src/layout/context/apiContext';
import { useAuth } from '@/src/layout/context/authContext'; 

const RegisterPage: React.FC = () => {
    const [showButtons, setShowButtons] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const [errorMessage, setErrorMessage] = useState('');
    const router = useRouter();
    const { getApiUrl } = useApi();
    const { setIsAuthenticated, setUserInfo } = useAuth();
    const toast = useRef<Toast | null>(null);

    useEffect(() => {
        if (!window.location.search.includes('reloaded')) {
            window.location.href = `${window.location.pathname}?reloaded=true`;
        }
    }, []);

const registerUser = useCallback((username: string, email: string, password: string) => {
    const apiUrl = getApiUrl();
    fetch(`${apiUrl}/auth/register/`, {
        method: "POST",
        body: JSON.stringify({ username, email, password }),
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        credentials: 'include',
        mode: 'cors'
    })
    .then(async (res) => {
        const data = await res.json();
        if (!res.ok) {
            let errorMessage = data.error_message || data.error?.message || 'Problème lors de l\'inscription';
            if (data.error?.error?.error === 'User with this email already exists') {
                errorMessage = 'Un utilisateur avec cet email existe déjà.';
            }

            toast.current?.show({ severity: 'error', summary: 'Erreur', detail: errorMessage, life: 3000 });
            return;
        } 
        
        // Succès de l'inscription
        setShowButtons(true);

        setIsAuthenticated(true);
    })
    .catch((err) => {
        toast.current?.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur inattendue est survenue', life: 3000 });
        console.error('Registration error:', err);
    });
}, [getApiUrl, setIsAuthenticated]);

    const { control, handleSubmit, formState: { errors }, watch } = useForm({
        defaultValues: {
            username: '',
            email: '',
            password: '',
            confirmPassword: ''
        }
    });

    const password = watch('password');

    const onSubmit = (data: any) => {
        if (data.password === data.confirmPassword) {
            registerUser(data.username, data.email, data.password);
        } else {
            setErrorMessage('Les mots de passe ne correspondent pas');
        }
    };

    const passwordHeader = <h6>Choisir un mot de passe</h6>;
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

    const handleCancel = () => {
        router.push('/');
    };

    const handleLogin = () => {
        router.push('/auth/login');
    };

    return (
        
        <div className={classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', 
            { 'p-input-filled': layoutConfig.inputStyle === 'filled' })}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <CSSTransition in={!showButtons} timeout={500} classNames="slide" unmountOnExit>
                    <div>
                        <img src={`/layout/images/prosy.png`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                        <div style={{
                            borderRadius: '56px',
                            padding: '0.3rem',
                            background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                        }}>
                            <div className="w-full surface-card py-8 px-5 sm:px-8 flex flex-column align-items-left justify-content-center max-w-[30rem] mx-auto" style={{ borderRadius: '53px' }}>
                                <div className="text-center mb-5">
                                    <div className="text-900 text-3xl font-medium mb-3">Bienvenue !</div>
                                    <span className="text-600 font-medium">Créer votre compte pour continuer</span>
                                </div>

                                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-[30rem] mx-auto">
                                    <div className="field items-center mb-4">
                                        <label htmlFor="username1" className="block text-900 text-xl font-medium mb-2">Nom d'utilisateur*</label>
                                        <div className="flex-1">
                                            <Controller name="username" control={control} rules={{ required: 'Username is required' }} 
                                                render={({ field, fieldState }) => (
                                                    <InputText id="username1" {...field} placeholder="Username" 
                                                        className={classNames({ 'p-invalid': fieldState.invalid }, "w-full md:w-30rem")} style={{ padding: '1rem' }} 
                                                    />
                                                )}
                                            />
                                        </div>
                                      
                                        {errors.username && <small className="p-error">{errors.username.message}</small>}
                                    </div>

                                    <div className="field items-center mb-4">
                                        <label htmlFor="email" className={classNames({ 'p-error': errors.email}, "block text-900 text-xl font-medium mb-2")}>Addresse Mail*</label>
                                        <div className="flex-1">
                                            <Controller name="email" control={control}
                                                rules={{ 
                                                required: 'L adresse Mail est requise',
                                                pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: 'Invalid email address. E.g. example@email.com' }}}
                                                render={({ field, fieldState }) => (
                                                    <InputText id={field.name} {...field} placeholder="Email" className={classNames({ 'p-invalid': fieldState.invalid }, "w-full md:w-30rem")} style={{ padding: '1rem' }}/>
                                            )} />
                                        </div>
                                    </div>

                                    <div className="field items-center mb-4">
                                        <label htmlFor="password" className={classNames({ 'p-error': errors.password }, "block text-900 text-xl font-medium mb-2")}>Mot de passe*</label>
                                        <div className="flex-1">
                                            <Controller name="password" control={control}
                                                rules={{
                                                    required: 'Le mot de passe est requis',
                                                }}
                                                render={({ field, fieldState }) => (
                                                    <Password id={field.name} {...field} toggleMask
                                                    placeholder="Mot de passe" className={classNames({ 'p-invalid': fieldState.invalid }, "w-full")}
                                                    inputClassName="w-full p-3 md:w-30rem"
                                                    header={passwordHeader} footer={passwordFooter}
                                                    />
                                                )}
                                            />
                                        </div>
                                       
                                        {errors.password && <small className="p-error">{errors.password.message}</small>}
                                    </div>

                                    <div className="field items-center mb-4">
                                        <label htmlFor="confirmPassword" className={classNames({ 'p-error': errors.confirmPassword }, "block text-900 text-xl font-medium mb-2")}>Confirmer le mot de passe*</label>
                                       
                                        <Controller name="confirmPassword" control={control}
                                            rules={{
                                                required: 'La confirmation du mot de passe est requise',
                                                validate: value => value === password || 'Les mots de passe ne correspondent pas'
                                            }}
                                            render={({ field, fieldState }) => (
                                                <Password id={field.name} {...field} toggleMask placeholder="Cofirmer mot de passe"
                                                    className={classNames({ 'p-invalid': fieldState.invalid }, "w-full")}
                                                    inputClassName="w-full p-3 md:w-30rem"
                                                    feedback={false} // Disable the strength indicator
                                                />
                                            )}
                                        />
                                        {errors.confirmPassword && <small className="p-error">{errors.confirmPassword.message}</small>}
                                    </div>

                                    <div className="flex justify-content-between gap-4">
                                        <Button label="Annuler" className="p-3 text-xl w-full p-button-secondary" type="button" onClick={handleCancel} />
                                        <Button label="Inscription" className="p-3 text-xl w-full" type="submit" />
                                    </div>
                                </form>
                                <div className="text-center">
                                    <span className="text-600">Vous avez déjà un compte ?</span>
                                    <a onClick={handleLogin} className="font-medium no-underline ml-2 cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                        Connectez-vous
                                    </a>
                                </div>
                                {errorMessage && <div className="p-error mt-3">{errorMessage}</div>}
                            </div>
                        </div>
                    </div>
                </CSSTransition>

                <CSSTransition in={showButtons} timeout={500} classNames="slide" unmountOnExit>
                    <AdvancedRegister />
                </CSSTransition>
            </div>
        </div>
    );
};

export default RegisterPage;
