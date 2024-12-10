'use client';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { useRouter } from 'next/navigation';
import Nav from "@/src/app/(full-page)/nav/page";
import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import modelDashboard from '@/src/layout/menuMap/dashboardMenu';
import { useApi } from '@/src/layout/context/apiContext';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { FileUpload } from 'primereact/fileupload';

const Process = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [processData, setProcessData] = useState<any[]>([]);
    const [selectedProcesses, setSelectedProcesses] = useState<any[]>([]);
    const [processDialog, setProcessDialog] = useState(false);
    const [deleteProcessDialog, setDeleteProcessDialog] = useState(false);
    const [process, setProcess] = useState<any>(null);
    const toast = useRef<Toast>(null);
    const { getApiUrl } = useApi();
    const router = useRouter();
    const dt = useRef<DataTable<any>>(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const fetchProcessData = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/process/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setProcessData(data.process);
        } catch (error) {
            console.error('Error fetching process data:', error);
        }
    };

    const handleEdit = (processId: number) => {
        router.push(`/edit-process/${processId}`);
    };

    const handleDelete = async (processId: number) => {
        const confirmed = window.confirm("Voulez-vous vraiment supprimer ce process ?");
        if (confirmed) {
            try {
                const apiUrl = getApiUrl();
                const response = await fetch(`${apiUrl}/process/${processId}`, {
                    method: 'DELETE',
                    credentials: 'include',
                });

                if (!response.ok) {
                    throw new Error('Erreur lors de la suppression du process');
                }

                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Process Deleted',
                    life: 3000
                });
                fetchProcessData();
            } catch (error) {
                console.error('Erreur lors de la suppression du process:', error);
            }
        }
    };

    useEffect(() => {
        fetchProcessData();
    }, []);

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New Process" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => router.push('/add-process')} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => setDeleteProcessDialog(true)} disabled={!selectedProcesses.length} />
            </React.Fragment>
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

    const processDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={() => setProcessDialog(false)} />
            <Button label="Save" icon="pi pi-check" text onClick={() => handleEdit(process?.id)} />
        </>
    );

    const deleteProcessDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setDeleteProcessDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={() => handleDelete(process?.id)} />
        </>
    );

    const handleProcessSelectionChange = (e: any) => {
        setSelectedProcesses(e.value);
    };

    const actionBodyTemplate = (rowData: any) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => handleEdit(rowData.id)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => {
                    setProcess(rowData);
                    setDeleteProcessDialog(true);
                }} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Process List</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
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
                        <DataTable
                            value={processData}
                            selection={selectedProcesses}
                            onSelectionChange={handleProcessSelectionChange}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords} processes"
                            globalFilter={globalFilter}
                            emptyMessage="No processes found."
                            header={header}
                            responsiveLayout="scroll"
                            ref={dt}
                        >
                            <Column selectionMode="multiple" headerStyle={{ width: '4rem' }}></Column>
                            <Column field="name" header="Process Name" sortable />
                            <Column body={actionBodyTemplate} headerStyle={{ width: '10rem' }}></Column>
                        </DataTable>

                        <Dialog visible={processDialog} style={{ width: '450px' }} header="Process Details" modal className="p-fluid" footer={processDialogFooter} onHide={() => setProcessDialog(false)}>
                        </Dialog>

                        <Dialog visible={deleteProcessDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProcessDialogFooter} onHide={() => setDeleteProcessDialog(false)}>
                            <div className="flex align-items-center justify-content-center">
                                <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                                {process && <span>Are you sure you want to delete <b>{process.name}</b>?</span>}
                            </div>
                        </Dialog>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Process;