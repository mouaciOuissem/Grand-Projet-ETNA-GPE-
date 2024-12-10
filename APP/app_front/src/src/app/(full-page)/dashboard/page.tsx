
'use client';
import Nav from "../nav/page";
import AppMenuitem from '@/src/layout/AppMenuitem';
import { useEffect, useState } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import { Chart } from 'primereact/chart';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dropdown } from 'primereact/dropdown';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { MenuProvider } from '@/src/layout/context/menucontext';
import modelUsers from '@/src/layout/menuMap/usersMenu';
import { useApi } from '@/src/layout/context/apiContext';
import { useAuth } from '@/src/layout/context/authContext';

interface ProcessStatus {
    count: number;
    name: string;
}

const Dashboard = () => {
    const [chartData, setChartData] = useState({});
    const [chartOptions, setChartOptions] = useState({});
    const [userData, setUserData] = useState([]);
    const [filteredData, setFilteredData] = useState([]);
    const [noProcesses, setNoProcesses] = useState(false);
    const { getApiUrl } = useApi();
    const { isAuthenticated, userInfo } = useAuth();
    const [statusOptions, setStatusOptions] = useState([]);
    const [selectedStatus, setSelectedStatus] = useState(null);
    const [timePeriod, setTimePeriod] = useState(null);

    const eventColors = {
        'commencer': 'rgb(13, 110, 253)',   // Blue
        'en cours': 'rgb(253, 126, 20)',    // Orange
        'terminer': 'rgb(25, 135, 84)',     // Green
        'annuler': 'rgb(220, 53, 69)',      // Red
        'en erreur': 'rgb(154, 37, 48)',    // Dark Red
        default: '#808080',                 // Gray
    };

    const fetchUserProcessData = async (id) => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/all_process_by_user/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            if (data.userHasProcess && data.userHasProcess.length > 0) {
                const sortedData = data.userHasProcess.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
                setUserData(sortedData);
                setNoProcesses(false);
                setFilteredData(sortedData);
                
                const uniqueStatuses = [...new Set(sortedData.map(item => item.Status.name))];
                const allOption = { label: 'All', value: null };
                setStatusOptions([allOption, ...uniqueStatuses.map(status => ({ label: status, value: status }))]);
            } else {
                setUserData([]);
                setFilteredData([]);
                setNoProcesses(true);
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserProcessData(userInfo.id);
        }
    }, [isAuthenticated]);

    const filterData = () => {
        let tempData = userData;
    
        if (selectedStatus) {
            tempData = tempData.filter(item => item.Status.name === selectedStatus);
        }
    
        if (timePeriod) {
            const now = new Date();
            let startDate;
            let endDate = now;
    
            switch (timePeriod) {
                case 'This Week': {
                    const dayOfWeek = now.getDay();
                    const startOfWeek = now.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1);
                    startDate = new Date(now.getFullYear(), now.getMonth(), startOfWeek);
                    break;
                }
                case 'This Month': {
                    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
                    break;
                }
                case 'Last Month': {
                    startDate = new Date(now.getFullYear(), now.getMonth() - 1, 1);
                    endDate = new Date(now.getFullYear(), now.getMonth(), 0);
                    break;
                }
                case 'Last 3 Months': {
                    startDate = new Date(now.getFullYear(), now.getMonth() - 3, 1);
                    endDate = now;
                    break;
                }
                case 'Last Year': {
                    startDate = new Date(now.getFullYear() - 1, 0, 1);
                    endDate = new Date(now.getFullYear(), 0, 0); 
                    break;
                }
                case 'This Year': {
                    startDate = new Date(now.getFullYear(), 0, 1);
                    break;
                }
                default: {
                    break;
                }
            }
    
            if (startDate) {
                tempData = tempData.filter(item => {
                    const itemDate = new Date(item.createdAt);
                    return itemDate >= startDate && itemDate <= endDate;
                });
            }
        }
    
        setFilteredData(tempData);
    };

    useEffect(() => {
        filterData();
    }, [selectedStatus, timePeriod, userData]);

    useEffect(() => {
        const documentStyle = getComputedStyle(document.documentElement);
        const processStatusCounts: { [key: string]: ProcessStatus } = {};

        const updateChartData = () => {
            for (const item of filteredData) {
                const statusId = item.StatusId;
                const statusName = item.Status.name;
                if (!processStatusCounts[statusId]) {
                    processStatusCounts[statusId] = { count: 0, name: statusName };
                }
                processStatusCounts[statusId].count += 1;
            }

            const labels = Object.values(processStatusCounts).map((status) => status.name);
            const dataValues = Object.values(processStatusCounts).map((status) => status.count);
            const backgroundColors = labels.map((label) => {
                const lowerLabel = label.toLowerCase();
                if (lowerLabel.includes('commencer')) return documentStyle.getPropertyValue('--blue-500');
                if (lowerLabel.includes('en cours')) return documentStyle.getPropertyValue('--orange-500');
                if (lowerLabel.includes('terminer')) return documentStyle.getPropertyValue('--green-500');
                if (lowerLabel.includes('annuler')) return documentStyle.getPropertyValue('--red-500');
                if (lowerLabel.includes('en erreur')) return documentStyle.getPropertyValue('--red-700');
                return documentStyle.getPropertyValue('--gray-500');
            });

            const data = {
                labels: labels,
                datasets: [{
                    data: dataValues,
                    backgroundColor: backgroundColors,
                    label: 'User Processes by Status Type'
                }]
            };

            const options = {
                plugins: {
                    legend: {
                        labels: {}
                    }
                }
            };

            setChartData(data);
            setChartOptions(options);
        };

        if (filteredData.length > 0) {
            updateChartData();
        }
    }, [filteredData]);

    const events = filteredData.map(proc => ({
        title: `${proc.Process.name} - ${proc.Status.name}`,
        start: new Date(proc.createdAt),
        backgroundColor: eventColors[proc.Status.name.toLowerCase()] || eventColors.default,
    }));

    const dateFormatter = (rowData) => {
        return format(new Date(rowData.createdAt), 'EEEE, dd MMMM yyyy', { locale: fr });
    };

    const statusBodyTemplate = (rowData) => {
        const statusName = rowData.Status.name.toLowerCase();
        const backgroundColor = eventColors[statusName] || eventColors.default;
        return (
            <span style={{ backgroundColor, color: '#fff', padding: '5px 10px', borderRadius: '3px' }}>
                {rowData.Status.name}
            </span>
        );
    };

    return (
        <div className='dashboard'>
            <Nav />
            <div className="layout-content">
                <div className="hidden xl:flex flex-col ">
                    <div className='layout-sidebar overflow-x-auto'>
                        <MenuProvider>
                            <ul className="layout-menu  flex-col ">
                                {modelUsers.map((item, i) => (
                                    !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label}  /> : <li className="menu-separator  " key={`sep-${item.label}`}></li>
                                ))}
                            </ul>
                        </MenuProvider>
                    </div>
                </div>
                <div className="grid justify-content-center mt-3">
                    {noProcesses ? (
                        <div className="col-12 xl:col-7 mx-2000">
                            <div className="card" style={{ height: '40rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                <h5>Aucun processus en cours.</h5>
                                <a href="/processus" style={{ marginTop: '1rem', color: '#007bff', textDecoration: 'underline', cursor: 'pointer' }}>
                                    Voir la liste des processus
                                </a>
                            </div>
                        </div>
                    ) : (
                        <>                            
                        <div className="col-12 xl:col-7 mt-5 mx-2000" style={{ maxWidth: '1200px', padding: '0 2rem'}}>
                            <div className="card mb-3" style={{ margin: '0 auto' }}>
                            {/* , marginBottom: '1rem'  */}
                                <h5>Filtrer les données</h5>
                                <div className="flex flex-column gap-3">
                                    <div>
                                        <label htmlFor="statusDropdown" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Selection du status</label>
                                        <Dropdown 
                                            value={selectedStatus}
                                            options={statusOptions}
                                            onChange={(e) => setSelectedStatus(e.value)}
                                            placeholder="Selectioner un status"
                                            className="w-full"
                                        />
                                    </div>
                                    <div style={{ marginBottom: '1rem' }}>
                                        <label htmlFor="timePeriod" style={{ fontWeight: 'bold', display: 'block', marginBottom: '0.5rem' }}>Selcetionner la periode de temps</label>
                                        <Dropdown
                                            value={timePeriod}
                                            options={[
                                                { label: 'This Week', value: 'This Week' },
                                                { label: 'This Month', value: 'This Month' },
                                                { label: 'Last Month', value: 'Last Month' },
                                                { label: 'Last 3 Months', value: 'Last 3 Months' },
                                                { label: 'Last Year', value: 'Last Year' },
                                                { label: 'This Year', value: 'This Year' },
                                            ]}
                                            onChange={(e) => setTimePeriod(e.value)}
                                            placeholder="Selectioner une période"
                                            className="w-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                            <div className="col-12 xl:col-7 mt-5 mx-2000" style={{ maxWidth: '1200px', padding: '0 2rem' }}>
                                <div className="card" style={{ height: '40rem' , margin: '0 auto'}}>
                                    <h5>Calendrier des procédures</h5>
                                    <FullCalendar
                                        plugins={[dayGridPlugin]}
                                        initialView="dayGridMonth"
                                        events={events}
                                        height='90%'
                                        firstDay={1}
                                        locale={fr}
                                    />
                                </div>
                            </div>

                            <div className="col-12 xl:col-7 mx-2000" style={{ maxWidth: '1200px', margin: '0 auto',padding: '0 2rem' }}>
                                <div className="grid grid-nogutter" style={{ gap: '1rem', margin: '0 auto',  display: 'flex',flexWrap: 'wrap',justifyContent: 'space-between', marginTop: '2rem',marginBottom: '2rem' }}>
                                    {/* <div className="col-12 md:col-6 lg:col-6" style={{ padding: '0.5rem' , boxSizing: 'border-box'}}> */}
                                    <div className="col-12 md:col-6 lg:col-6" style={{  minWidth: '300px',flex: '1 1 calc(50% - 1rem)', boxSizing: 'border-box'}}>
                                        <div className="
                                        card flex justify-content-center" style={{ height: '100%' }}>
                                            <Chart type="polarArea" data={chartData} options={chartOptions} />
                                        </div>
                                    </div>
                                
                                    {/* <div className="col-12 md:col-6 lg:col-6" style={{ padding: '0.5rem' , boxSizing: 'border-box'}}> */}
                                    <div className="col-12 md:col-6 lg:col-6" style={{ minWidth: '300px',  flex: '1 1 calc(50% - 1rem)' , boxSizing: 'border-box'}}>
                                        <div className="card" style={{ height: '100%' }}>
                                            <h5>Liste des Processus</h5>
                                            <DataTable value={filteredData} paginator rows={5} className="datatable-responsive">
                                                <Column field="Process.name" header="Nom du Processus" sortable />
                                                <Column field="createdAt" header="Date de Création" body={dateFormatter} sortable />
                                                <Column field="Status.name" header="Nom du Statut" body={statusBodyTemplate} sortable />
                                            </DataTable>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
