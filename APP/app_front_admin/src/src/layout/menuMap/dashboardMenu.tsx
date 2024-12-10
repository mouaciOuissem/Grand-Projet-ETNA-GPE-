import { AppMenuItem } from '@/src/types';

const modelDashboard: AppMenuItem[] = [
    {
        label: 'Home',
        items: [{ label: 'Home', icon: 'pi pi-fw pi-home', to: '/' }]
    },
    {
        label: 'Admin',
        items: [
            { label: 'Tableau de bord', icon: 'pi pi-fw pi-desktop', to: '/' },
            { label: 'Users', icon: 'pi pi-fw pi-user', to: '/users' },
            { label: 'Process', icon: 'pi pi-fw pi-list-check', to: '/process' },
            { label: 'Data', icon: 'pi pi-fw pi-server', to: '/data' },
            { label: 'Messages', icon: 'pi pi-fw pi-envelope', to: '/messages' },
        ]
    }
]
export default modelDashboard;