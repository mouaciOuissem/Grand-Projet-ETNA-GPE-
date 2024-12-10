import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useApi } from '@/src/layout/context/apiContext';

// Interface for user data
interface User {
    username?: string;
    id?: number;
    email?: string;
}

// Interface for user details
interface UserDetails {
    id?: number;
    firstname?: string;
    lastname?: string;
    address?: string;
    post_code?: string;
    city?: string;
    country?: string;
    phone_number?: string;
    pronouns?: string;
    profile_picture?: string;
    birthday?: string;
    last_connection?: string;
    userFiscalDetails?: UserFiscalDetails;
    socialCategorie?: UserSocialCategory;
    bucket?: UserBucket;
}

// Interface for user fiscal details
interface UserFiscalDetails {
    id: number;
    UserdetailsId: number;
    salary_1: number;
    salary_2: number;
    salary_3: number;
    in_couple: number;
    waiting_child: number;
    child_number: number;
    owner: number;
    sales_1: number;
    sales_2: number;
    sales_3: number;
    self_employed_business_profits: number;
    housed_free_of_charge: number;
    housing_allowance_1: number;
    housing_allowance_2: number;
    housing_allowance_3: number;
    aah_1: number;
    aah_2: number;
    aah_3: number;
    annual_investment_income: number;
    other_resources_received_1: number;
    other_resources_received_2: number;
    other_resources_received_3: number;
    createdAt: string;
    updatedAt: string;
}

// Interface for user social category
interface UserSocialCategory {
    id: number;
    UserdetailsId: number;
    self_employed: number;
    auto_entrepreneur: number;
    activity: string | null;
    student: number;
    employee: number;
    other: number;
    createdAt: string;
    updatedAt: string;
}

// Interface for user bucket
interface UserBucket {
    id: number;
    UserdetailsId: number;
    bucketName: string;
    createdAt: string;
    updatedAt: string;
}

interface UserContextType {
    usersData: User | null;
    usersDataDetails: UserDetails | null;
    setUsersData: (user: User | null) => void;
    setUsersDataDetails: (userDetails: UserDetails | null) => void;
    fetchUsersData: () => Promise<void>;
    fetchUsersDataDetails: () => Promise<void>;
    clearUserData: () => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [usersData, setUsersData] = useState<User | null>(null);
    const [usersDataDetails, setUsersDataDetails] = useState<UserDetails | null>(null);
    const { getApiUrl } = useApi();

    // Function to fetch user data
    const fetchUsersData = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/users/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            if (data?.users) {
                setUsersData(data.users);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    const fetchUsersDataDetails = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/details/user`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data?.userDetails) {
                setUsersDataDetails(data.userDetails);
            }
        } catch (error) {
            console.error('Error fetching user details:', error);
        }
    };

    const clearUserData = () => {
        setUsersData(null);
        setUsersDataDetails(null);
    };

        useEffect(() => {
            if (!usersData) {
                fetchUsersData();
            }
            if (!usersDataDetails) {
                fetchUsersDataDetails();
            }
        }, [usersData, usersDataDetails]);

    return (
        <UserContext.Provider value={{ usersData, usersDataDetails, setUsersData, setUsersDataDetails, fetchUsersData, fetchUsersDataDetails, clearUserData }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = (): UserContextType => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};
