/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useCallback, useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { useNavigate } from 'react-router-dom';
import { FormEvent } from 'react';

const LoginPage = () => {
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [checked, setChecked] = useState(false);
    const { layoutConfig } = useContext(LayoutContext);
    const [errorMessage, setErrorMessage] = useState('');

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });
    const apiUrl = process.env.NEXT_PUBLIC_SNL_URL_API;

    let apiUrlTest: string;

    if (typeof window !== 'undefined') {
        // côté client
        const host = window.location.hostname;
        apiUrlTest = host === 'localhost' 
            ? 'http://localhost:3000/api' 
            : host === 'recette.snl-corp.fr' 
            ? 'https://recette.snl-corp.fr/api'
            : host === 'preprod.snl-corp.fr'
            ? 'https://preprod.snl-corp.fr/api'
            : 'https://www.snl-corp.fr/api';
    } else {
        // côté serveur
        apiUrlTest = process.env.NEXT_PUBLIC_SNL_URL_API || 'https://www.snl-corp.fr/api';
    }

    const loginUser = useCallback(() => {
        //fetch(`${apiUrl}/auth/login/`, {
        fetch(`${apiUrlTest}/auth/login/`, {
            method: "POST",
            body: JSON.stringify({
                email,
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
                router.push("/dashboard");
            }
        })
        .catch((err) => {
            console.log(err)
            setErrorMessage(String(err));
            setEmail("");
            setPassword("");
        });
    }, [email, password]);

    const handleSubmit = (e: { preventDefault: () => void; }) => {
        e.preventDefault();
        loginUser();
    };

    return (
        <div className={containerClassName}>
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
                            <span className="text-600 font-medium">Connecter vous pour continuer</span>
                        </div>

                        <div>
                            <label htmlFor="email1" className="block text-900 text-xl font-medium mb-2">
                                Mail
                            </label>
                            <InputText value={email} onChange={(e) => setEmail(e.target.value)} id="email1" type="text" placeholder="Address mail" className="w-full md:w-30rem mb-5" style={{ padding: '1rem' }} />

                            <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                Mot de passe
                            </label>
                            <Password inputId="password1" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" toggleMask className="w-full mb-5" inputClassName="w-full p-3 md:w-30rem"></Password>

                            <div className="flex align-items-center justify-content-between mb-5 gap-5">
                                <div className="flex align-items-center">
                                    <Checkbox inputId="rememberme1" checked={checked} onChange={(e) => setChecked(e.checked ?? false)} className="mr-2"></Checkbox>
                                    <label htmlFor="rememberme1">ce souvenir de moi</label>
                                </div>
                                <a className="font-medium no-underline ml-2 text-right cursor-pointer" style={{ color: 'var(--primary-color)' }}>
                                    Mot de passe oublié ?
                                </a>
                            </div>
                            <Button label="Connection" className="w-full p-3 text-xl" onClick={handleSubmit}></Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
