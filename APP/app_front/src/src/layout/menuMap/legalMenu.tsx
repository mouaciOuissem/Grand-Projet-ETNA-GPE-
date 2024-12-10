import { AppMenuItem } from '@/src/types';

const modelLegal: AppMenuItem[] = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Politiques',
        items: [
            { label: 'Cookies', icon: 'pi pi-fw pi-code', to: '/legal/cookie-policy' },
            { label: 'Marque', icon: 'pi pi-fw pi-briefcase', to: '/legal/brand-policy' },
            { label: 'Confidentialité', icon: 'pi pi-fw pi-lock', to: '/legal/privacy-policy' },
            { label: 'rgpd', icon: 'pi pi-fw pi-shield', to: '/legal/rgpd' },
            { label: 'Conditions d\'utilisation', icon: 'pi pi-fw pi-file', to: '/legal/terms-of-service' }
        ]
    }
]
export default modelLegal;