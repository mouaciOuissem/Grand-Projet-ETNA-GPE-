import React, { createContext, useContext, ReactNode } from 'react';

// Interface pour le contexte
interface ApiContextType {
    getApiUrl: () => string;
}

// Créer le contexte
const ApiContext = createContext<ApiContextType | undefined>(undefined);

// Créer le provider du contexte
export const ApiProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    
    const getApiUrl = (): string => {
        let apiUrl: string;
    
        if (typeof window !== 'undefined') {
            // côté client
            const host = window.location.hostname;
            apiUrl = host === 'localhost' 
                ? 'http://localhost:3000/api' 
                : host === 'recette.snl-corp.fr' 
                ? 'https://recette.snl-corp.fr/api'
                : host === 'preprod.snl-corp.fr'
                ? 'https://preprod.snl-corp.fr/api'
                : 'https://www.snl-corp.fr/api';
        } else {
            // côté serveur
            apiUrl = process.env.NEXT_PUBLIC_SNL_URL_API || 'https://www.snl-corp.fr/api';
        }
    
        return apiUrl;
    };

    return (
        <ApiContext.Provider value={{ getApiUrl }}>
            {children}
        </ApiContext.Provider>
    );
};

// Hook personnalisé pour utiliser le contexte de l'API
export const useApi = (): ApiContextType => {
    const context = useContext(ApiContext);
    if (!context) {
        throw new Error('useApi must be used within an ApiProvider');
    }
    return context;
};
