import { AppMenuItem } from '@/src/types';

const modelCompany: AppMenuItem[] = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Entreprise',
        items: [
            { label: 'A propos de nous', icon: 'pi pi-fw pi-info-circle', to: '/company/about-us' },
            { label: 'Contact', icon: 'pi pi-fw pi-envelope', to: '/company/contact' },
            { label: 'Actualités', icon: 'pi pi-fw pi-bell', to: '/company/news' }
        ]
    }
]
export default modelCompany;