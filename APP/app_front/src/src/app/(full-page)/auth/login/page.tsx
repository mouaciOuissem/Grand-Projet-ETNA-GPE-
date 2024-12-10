'use client';

import React, { useContext, useState, useCallback, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useApi } from '@/src/layout/context/apiContext';
import { useAuth } from '@/src/layout/context/authContext';
import { Toast } from 'primereact/toast';

const LoginPage = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { setIsAuthenticated, setUserInfo } = useAuth();
    const [password, setPassword] = useState('');
    const [identifier, setIdentifier] = useState('');
    const [checked, setChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const { getApiUrl } = useApi();
    const router = useRouter();
    const toast = useRef(null);

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden',
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    useEffect(() => {
        if (!window.location.search.includes('reloaded')) {
            window.location.href = `${window.location.pathname}?reloaded=true`;
        }
    }, []);

    const checkCookie = async () => {
        try {
            const apiUrl = getApiUrl();

            const checkCookieResponse = await fetch(`${apiUrl}/auth/check-cookie`, {
                method: 'GET',
                credentials: 'include',
                mode: 'cors',
                headers: {
                    "Accept": "application/json",
                },
            });

            if (checkCookieResponse.ok) {
                const data = await checkCookieResponse.json();
                setUserInfo(data.user || null);
                return true; 
            }
            return false;

        } catch (error) {
            console.error('Error during cookie check:', error);
            setErrorMessage('An error occurred while verifying the session');
            return false;
        }
    };

    const loginUser = useCallback(async () => {
        try {
            const apiUrl = getApiUrl();

            const response = await fetch(`${apiUrl}/auth/login`, {
                method: "POST",
                body: JSON.stringify({ identifier, password }),
                credentials: 'include',
                mode: 'cors',
                headers: {
                    "Accept": "application/json",
                    "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                const errorData = await response.json();
                let errorMessage = errorData?.error?.error || errorData.error_message || 'Problème lors de la connexion';
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: errorMessage, life: 3000 });
            }

            const userData = await response.json();
            setUserInfo(userData.user);
            setIsAuthenticated(true);

            const isCookieValid = await checkCookie();
            if (isCookieValid) {
                setIsAuthenticated(true);
                router.replace('/dashboard');
                setTimeout(() => {
                    window.location.reload();
                }, 1000)
            } else {
                toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'La vérification de la session a échoué', life: 3000 });
            }
        } catch (err) {
            toast.current.show({ severity: 'error', summary: 'Erreur', detail: 'Une erreur inattendue est survenue', life: 3000 });
            setIdentifier("");
            setPassword("");
        }
    }, [identifier, password, getApiUrl, router, setIsAuthenticated, setUserInfo]);

    const handleSubmit = (e) => {
        e.preventDefault();
        loginUser();
    };

    const handleCancel = () => {
        router.push('/');
    };

    const handleForgotPassword = () => {
        router.push('/auth/forgot-password');
    };

    const handleRegister = () => {
        router.push('/auth/register');
    };

    return (
        <div className={containerClassName}>
            <Toast ref={toast} />
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/layout/images/prosy.png`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Ravi de vous revoir !</div>
                            <span className="text-600 font-medium">Connectez-vous pour continuer</span>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <label htmlFor="identifier" className="block text-900 text-xl font-medium mb-2">
                                Email ou Nom d'utilisateur
                            </label>
                            <InputText value={identifier} onChange={(e) => setIdentifier(e.target.value)} id="email1" type="text" placeholder="Adresse mail ou nom d'utilisateur" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Mot de passe
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" feedback={false}></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2" />
                                    <label htmlFor="rememberme1">Se souvenir de moi</label>
                                </div>
                                <a onClick={handleForgotPassword} className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <div className="flex justify-content-between gap-4">
                                <Button label="Annuler" className="p-3 text-xl w-full p-button-secondary" type="button" onClick={handleCancel}></Button>
                                <Button label="Connexion" className="p-3 text-xl w-full" type="submit"></Button>
                            </div>
                        </form>
                        <div className="text-center">
                            <span className="text-600">Pas encore de compte ? </span>
                            <a onClick={handleRegister} className="font-medium no-underline ml-2 cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                Inscrivez-vous
                            </a>
                        </div>
                        {errorMessage && <div className="text-red-600 mt-3">{errorMessage}</div>}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
