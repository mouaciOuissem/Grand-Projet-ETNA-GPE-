'use client';
import { InputText, Column, DataTable, Button, InputSwitch,Dropdown  } from 'primereact';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useApi } from '@/src/layout/context/apiContext';

const EditUser = () => {
    const { userId } = useParams();
    const [userData, setUserData] = useState<any>(null);
    const { getApiUrl } = useApi();

    const roleOptions = [
        { id: 1, name: 'Admin' },
        { id: 2, name: 'Éditeur' },
        { id: 3, name: 'User' },
    ];

    const fetchUserData = async (id: number) => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/user/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setUserData(data.user);
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (userId) {
            fetchUserData(Number(userId));
        }
    }, [userId]);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/user/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(userData),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            alert('User updated successfully');
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    if (!userData) {
        return <div>Chargement...</div>;
    }

    return (
        <div className="grid justify-content-center mt-3">
            <div className="col-12 xl:col-8">
                <div className="card">
                    <h5>Modifier l'utilisateur</h5>
                    <form onSubmit={handleSubmit}>
                        <div className="p-fluid">
                            <div className="p-field">
                                <label htmlFor="username">Nom d'utilisateur:</label>
                                <InputText
                                    id="username"
                                    value={userData.username}
                                    onChange={(e) => setUserData({ ...userData, username: e.target.value })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="email">Email:</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    value={userData.email}
                                    onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="role">Role:</label>
                                <Dropdown
                                    id="role"
                                    value={userData.role_id}
                                    options={roleOptions}
                                    onChange={(e) => setUserData({ ...userData, role_id: e.value })}
                                    optionLabel="name"
                                    optionValue="id"
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="active">Actif:</label>
                                <InputSwitch
                                    id="active"
                                    checked={userData.active}
                                    onChange={(e) => setUserData({ ...userData, active: e.value })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="firstname">Prénom:</label>
                                <InputText
                                    id="firstname"
                                    value={userData.userDetails?.firstname || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, firstname: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="lastname">Nom:</label>
                                <InputText
                                    id="lastname"
                                    value={userData.userDetails?.lastname || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, lastname: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="address">Adresse:</label>
                                <InputText
                                    id="address"
                                    value={userData.userDetails?.address || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, address: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="post_code">Code postal:</label>
                                <InputText
                                    id="post_code"
                                    value={userData.userDetails?.post_code || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, post_code: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="country">Pays:</label>
                                <InputText
                                    id="country"
                                    value={userData.userDetails?.country || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, country: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="phone_number">Téléphone:</label>
                                <InputText
                                    id="phone_number"
                                    value={userData.userDetails?.phone_number || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, phone_number: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="pronouns">Pronoms:</label>
                                <InputText
                                    id="pronouns"
                                    value={userData.userDetails?.pronouns || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, pronouns: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="profile_picture">Photo de profil:</label>
                                <InputText
                                    id="profile_picture"
                                    value={userData.userDetails?.profile_picture || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, profile_picture: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="birthday">Date de naissance:</label>
                                <InputText
                                    id="birthday"
                                    type="date"
                                    value={userData.userDetails?.birthday?.substring(0, 10) || ''}
                                    onChange={(e) => setUserData({
                                        ...userData,
                                        userDetails: { ...userData.userDetails, birthday: e.target.value }
                                    })}
                                />
                            </div>
                            <div className="p-field">
                                <label htmlFor="last_connection">Dernière connexion:</label>
                                <InputText
                                    id="last_connection"
                                    value={userData.userDetails?.last_connection || ''}
                                    disabled
                                />
                            </div>
                            <div className="p-field">
                                <Button type="submit" label="Enregistrer" className="p-button-primary" />
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
