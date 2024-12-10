// src/app/full-page/auth/Register/page.tsx
'use client';
import React, { useCallback, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { CSSTransition } from 'react-transition-group';
import AdvancedRegister from './advancedregister';
import { Suspense } from 'react'

const RegisterPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confPassword, setConfPassword] = useState('');
    const [showButtons, setShowButtons] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const [errorMessage, setErrorMessage] = useState('');
    const apiUrl = process.env.NEXT_PUBLIC_SNL_URL_API;
    const router = useRouter();


    let apiUrlTest: string;

    if (typeof window !== 'undefined') {
        // côté client
        if (window.location.hostname === 'localhost') {
            apiUrlTest = 'http://localhost:3000/api';
        } else if (window.location.hostname === 'recette.snl-corp.fr') {
            apiUrlTest = 'https://recette.snl-corp.fr/api';
        } else if (window.location.hostname === 'preprod.snl-corp.fr') {
            apiUrlTest = 'https://preprod.snl-corp.fr/api';
        } else {
            apiUrlTest = 'https://www.snl-corp.fr/api';
        }
    } else {
        // côté serveur
        apiUrlTest = process.env.NEXT_PUBLIC_SNL_URL_API || 'https://www.snl-corp.fr/api';
    }
    const registerUser = useCallback((username: any, email: any, password: any) => {
        fetch(`${apiUrlTest}/auth/register/`, {
            method: "POST",
            body: JSON.stringify({
                username,
                email,
                password,
            }),
            headers: {
                "Accept": "application/json",
                "Content-Type": "application/json",
            },
        })
        .then((res) => res.json())
        .then((data) => {
            if (data.error_message) {
                console.error('Error message:', data.error_message);
            } else {
                localStorage.setItem("email", email);
                localStorage.setItem("Token", data.token);
                sessionStorage.setItem("password", password);
            }
        })
        .catch((err) => {
            console.error('Request failed:', err);
            setErrorMessage(String(err));
            setUsername("");
            setEmail("");
            setPassword("");
        });
    }, []);
    useEffect(() => {
        const savedEmail = localStorage.getItem('email');
        if (savedEmail) {
            setEmail(savedEmail);
        }
    }, []);

    const containerClassName = classNames(
        'surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', 
        { 'p-input-filled': layoutConfig.inputStyle === 'filled' }
    );

    const handleConnectionClick = () => {
        if (password === confPassword) {
            registerUser(username, email, password);
            setShowButtons(true);
        } else {
            alert("Passwords do not match");
        }
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <CSSTransition in={!showButtons} timeout={500} classNames="slide" unmountOnExit>
                    <div>
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
                                    <div className="text-900 text-3xl font-medium mb-3">Bienvenue !</div>
                                    <span className="text-600 font-medium">Créer votre compte pour continuer</span>
                                </div>

                                <div>
                                    <label htmlFor="username1" className="block text-900 text-xl font-medium mb-2">
                                        Username    
                                    </label>
                                    <InputText id="username1" type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="username" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                    <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                        Mail    
                                    </label>
                                    <InputText id="email1" type="text" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Address mail" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                                    <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                        Mot de passe
                                    </label>
                                    <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />

                                    <label htmlFor="confpassword1" className="block text-900 font-medium text-xl mb-2">
                                        Confirmer le mot de passe
                                    </label>
                                    <Password inputId="confpassword1" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder="Confirmer le mot de passe" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem" />

                                    <Button label="Connection" className="w-full p-3 text-xl" onClick={handleConnectionClick} />
                                </div>
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
