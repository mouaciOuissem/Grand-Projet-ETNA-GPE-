'use client';

import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { FormEvent } from 'react';
import { useApi } from '@/src/layout/context/apiContext';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [identifier, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    const [loginSuccess, setLoginSuccess] = useState(false);
    const { getApiUrl } = useApi();

    const router = useRouter();
    const searchParams = useSearchParams();
    const redirectTo = searchParams.get('redirectTo') || '/profile'; // URL par défaut si pas de "redirectTo"
    
    const { layoutConfig } = useContext(LayoutContext);
    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', 
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const loginUser = useCallback(() => {
        const apiUrl = getApiUrl();
        fetch(`${apiUrl}/auth/login`, {
            method: "POST",
            body: JSON.stringify({
                identifier,
                password,
            }),
            credentials: 'include',
            mode: 'cors',
            headers: {
                "Accept" : "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                setErrorMessage(String(data.error_message));
            } else {
                setLoginSuccess(true);
            }
        })
        .catch((err) => {
            console.log(err);
            setErrorMessage(String(err));
            setEmail("");
            setPassword("");
        });
    }, [identifier, password]);

    useEffect(() => {
        if (loginSuccess) {
            console.log("Login successful, redirecting to:", redirectTo);
            router.push(redirectTo); // Redirection vers la page où il était ou /profile par défaut
        }
    }, [loginSuccess, redirectTo, router]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        loginUser();
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/prsy-adm/layout/images/prosy.png`} alt="Sakai logo" className="mb-5 w-6rem flex-shrink-0" />
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
                            {/* <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Mail
                            </label> */}
                            <label htmlFor="identifier" className="block text-900 text-xl font-medium mb-2">
                                Email ou Nom d'utilisateur
                            </label>
                            <InputText value={identifier} onChange={(e) => setEmail(e.target.value)} id="email1" type="text" placeholder="Adresse mail ou nom d'utilisateur" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Mot de passe
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" feedback={false}></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">Se souvenir de moi</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Button label="Connexion" className="w-full p-3 text-xl" type="submit"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
