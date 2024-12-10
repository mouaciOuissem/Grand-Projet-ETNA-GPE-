import { AppMenuItem } from '@/src/types';

const modelUsers: AppMenuItem[] = [
    
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Profil',
        items: [
            { label: 'Profil', icon: 'pi pi-fw pi-user', to: '/profile' },
            { label: 'Paramètres', icon: 'pi pi-fw pi-cog', to: '/parametres' },
        ]
    },
    {
        label: 'Tableau de bord',
        items: [
            { 
                label: 'Tableau de bord', 
                icon: 'pi pi-fw pi-desktop', 
                items: [
                {                        
                    label: 'Résumé',
                    icon: 'pi pi-receipt',
                    to: '/dashboard',
                },
                    {
                        label: 'Processus',
                        icon: 'pi pi-microchip-ai',
                        to: '/processus',
                        // items: [
                        //     {
                        //         label: 'En cours',
                        //         icon: 'pi pi-spinner'
                        //     },
                        //     {
                        //         label: 'Complété',
                        //         icon: 'pi pi-check'
                        //     }
                        // ]
                    }
                ]
            },
            { label: 'Coffre-Fort', icon: 'pi pi-fw pi-server', to: '/document' },
        ]
    }
    
];

export default modelUsers;

