'use client';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import Nav from "@/src/app/(full-page)/nav/page";
import AppMenuitem from '@/src/layout/AppMenuitem';
import { Toolbar } from 'primereact/toolbar';
import { FileUpload } from 'primereact/fileupload';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { ProgressSpinner } from 'primereact/progressspinner';

import { MenuProvider } from '@/src/layout/context/menucontext';
import modelDashboard from '@/src/layout/menuMap/dashboardMenu';
import { useApi } from '@/src/layout/context/apiContext';
import { useUser } from '@/src/layout/context/UserContext';

const Users = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const { usersData, usersDataDetails, fetchUsersData, fetchUsersDataDetails } = useUser();
    // const [usersData, setUsersData, fetchUsersData] = useState<User[]>([]); // Initialiser avec un tableau vide
    const [selectedUsers, setSelectedUsers] = useState<any[]>([]);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [user, setUser] = useState<any>(null);
    const toast = useRef<Toast>(null);
    const { getApiUrl } = useApi();
    const router = useRouter();
    const dt = useRef<DataTable<any>>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [loading, setLoading] = useState(true); // Loading state

    useEffect(() => {
        // Fetch users and then set loading to false
        const fetchData = async () => {
            await fetchUsersData();
            setLoading(false); // Stop loading once data is fetched
        };
        fetchData();
    }, []);
    // const fetchUsersData = async () => {
    //     try {
    //         const apiUrl = getApiUrl();
    //         const response = await fetch(`${apiUrl}/users/`, {
    //             method: 'GET',
    //             credentials: 'include',
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const data = await response.json();
    //         setUsersData(data.users);
    //     } catch (error) {
    //         console.error('Error fetching user data:', error);
    //     }
    // };

    const handleEdit = (userId: number) => {
        router.push(`/edit-user/${userId}`);
    };
    
    const handleDelete = async (userId: number) => {
        // const confirmed = window.confirm("Voulez-vous vraiment supprimer cet utilisateur ?");
        // if (confirmed) {
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/user/${userId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });
    
                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression de l\'utilisateur');
                }
    
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'User Deleted',
                    life: 3000
                });
                setDeleteUserDialog(false)
                fetchUsersData();
            } catch (error) {
                console.error('Erreur lors de la suppression de l\'utilisateur:', error);
            }
        // }
    };

    // useEffect(() => {
    //     fetchUsersData();
    // }, []);

    const leftToolbarTemplate = () => {
        return (
            <div className="my-2">
                <Button label="New User" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => router.push('/add-user')} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => setDeleteUserDialog(true)} disabled={!selectedUsers.length} />
            </div>
        );
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };
    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={() => setUserDialog(false)} />
            <Button label="Save" icon="pi pi-check" text onClick={() => handleEdit(user?.id)} />
        </>
    );

    const deleteUserDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setDeleteUserDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={() => handleDelete(user?.id)} />
        </>
    );

    const handleUserSelectionChange = (e: any) => {
        setSelectedUsers(e.value);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => handleEdit(rowData.id)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => {
                    setUser(rowData);
                    setDeleteUserDialog(true);
                }} />
            </>
        );
    };

    const dateFormatter = (rowData) => {
        return format(new Date(rowData.createdAt), 'EEEE, dd MMMM yyyy', { locale: fr });
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">User List</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" placeholder="Search..." value={globalFilter}  onChange={(e) => setGlobalFilter(e.target.value)}/>
            </span>
        </div>
    );

    return (
        <div className='prsy-adm'>
            <Nav />
            <div className='layout-sidebar'>
                <MenuProvider>
                    <ul className="layout-menu">
                        {modelDashboard.map((item, i) => (
                            !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={`sep-${i}`}></li>
                        ))}
                    </ul>
                </MenuProvider>
            </div>
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6">
                    <div className="card">
                        <Toast ref={toast} />
                        <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                        {loading ? (
                            <div className="flex justify-content-center align-items-center" style={{ height: '400px' }}>
                                <ProgressSpinner />
                            </div>
                        ) : (
<DataTable
    value={usersData}
    selection={selectedUsers}
    onSelectionChange={handleUserSelectionChange}
    dataKey="id"
    paginator
    rows={10}
    rowsPerPageOptions={[5, 10, 25]}
    className="datatable-responsive"
    paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
    currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
    globalFilter={globalFilter}
    emptyMessage="No users found."
    header={header}
    responsiveLayout="scroll"
    ref={dt}
>
    <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
    <Column field="username" header="Username" sortable />
    <Column field="email" header="Email" sortable />
    <Column field="role_id" header="Role ID" sortable />
    <Column field="active" header="Active" body={(rowData) => rowData.active ? 'Yes' : 'No'} sortable />
    <Column body={actionBodyTemplate} headerStyle={{ width: '10rem' }}></Column>
    <Column field="createdAt" header="Date de Création" body={dateFormatter} sortable />
</DataTable>
                        )}
                        <Dialog visible={userDialog} style={{ width: '450px' }} header="User Details" modal className="p-fluid" footer={userDialogFooter} onHide={() => setUserDialog(false)}>
                            {/* Content for user details */}
                        </Dialog>

                        <Dialog visible={deleteUserDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteUserDialogFooter} onHide={() => setDeleteUserDialog(false)}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {user && <span>Are you sure you want to delete <b>{user.username}</b>?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Users;
