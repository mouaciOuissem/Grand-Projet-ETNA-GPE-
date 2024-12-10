'use client';
import { InputText, Column, DataTable, Button } from 'primereact';
import { useParams } from 'next/navigation';
import React, { useEffect, useState, useRef } from 'react';
import { useApi } from '@/src/layout/context/apiContext';
import { useRouter } from 'next/navigation';
import { Dialog } from 'primereact/dialog';
import { Toast } from 'primereact/toast';
import { FileUpload } from 'primereact/fileupload';
import { Toolbar } from 'primereact/toolbar';

const EditProcess = () => {
    const { processId } = useParams();
    const [processData, setProcessData] = useState<any>(null);
    const [inputData, setInputData] = useState<any[]>([]);
    const { getApiUrl } = useApi();
    const [globalFilter, setGlobalFilter] = useState('');
    const [processDialog, setProcessDialog] = useState(false);
    const [inputDialog, setInputDialog] = useState(false);
    const [deleteInputDialog, setDeleteInputDialog] = useState(false);
    const [deleteProcessDialog, setDeleteProcessDialog] = useState(false);
    const [selectedInput, setSelectedInput] = useState<any>(null);
    const [selectedProcess, setSelectedProcess] = useState<any>(null);
    const toast = useRef<Toast>(null);
    const [pagination, setPagination] = useState({ first: 0, rows: 10 });
    const [selectedInputs, setSelectedInputs] = useState<any[]>([]);

    const router = useRouter();
    const dt = useRef<DataTable<any>>(null);

    useEffect(() => {
        if (processId) {
            fetchProcessData(Number(processId));
            fetchInputData(Number(processId));
        }
    }, [processId]);

    // Fetch process data
    const fetchProcessData = async (id: number) => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/process/${id}`, {
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

    // Fetch input data
    const fetchInputData = async (id: number) => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/process/information/${id}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setInputData(data.input);
        } catch (error) {
            console.error('Error fetching input data:', error);
        }
    };

    // Save process data
    const handleSaveProcess = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/process/${processId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(processData),
            });

            if (!response.ok) {
                throw new Error('Error updating process');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Process Updated',
                life: 3000
            });

            setProcessDialog(false);
            // fetchProcessData(Number(processId));
        } catch (error) {
            // console.error('Error updating process:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: error.message || 'An error occurred while updating the process',
                life: 3000
            });
        }
    };

    // Save input data
    const handleSaveInput = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/input/${selectedInput.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify(selectedInput),
            });

            if (!response.ok) {
                throw new Error('Error updating input');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Input Updated',
                life: 3000
            });

            setInputDialog(false);
            // fetchInputData(Number(processId));
        } catch (error) {
            console.error('Error updating input:', error);
        }
    };

    // Delete process data
    const handleDeleteProcess = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/process/${selectedProcess.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error deleting process');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Process Deleted',
                life: 3000
            });

            setDeleteProcessDialog(false);
            router.push('/process');
        } catch (error) {
            console.error('Error deleting process:', error);
        }
    };

    // Delete input data
    const handleDeleteInput = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/input/${selectedInput.id}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error deleting input');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Input Deleted',
                life: 3000
            });

            setDeleteInputDialog(false);
            fetchInputData(Number(processId));
        } catch (error) {
            console.error('Error deleting input:', error);
        }
    };

    const actionBodyTemplateProcess = (rowData: any) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-warning mr-2" onClick={() => {
                setSelectedProcess(rowData);
                setProcessDialog(true);
            }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {
                setSelectedProcess(rowData);
                setDeleteProcessDialog(true);
            }} />
        </>
    );

    const actionBodyTemplateInput = (rowData: any) => (
        <>
            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => {
                setSelectedInput(rowData.input);
                setInputDialog(true);
            }} />
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {
                setSelectedInput(rowData.input);
                setDeleteInputDialog(true);
            }} />
        </>
    );

    const processDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={() => setProcessDialog(false)} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSaveProcess} />
        </>
    );

    const inputDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={() => setInputDialog(false)} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSaveInput} />
        </>
    );

    const deleteProcessDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setDeleteProcessDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={handleDeleteProcess} />
        </>
    );

    const deleteInputDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setDeleteInputDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={handleDeleteInput} />
        </>
    );


    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New Input" icon="pi pi-plus" severity="success" className="mr-2" onClick={() => router.push('/add-input')} />
                <Button label="Delete" icon="pi pi-trash" severity="danger" onClick={() => setDeleteProcessDialog(true)} disabled={!selectedInputs.length} />
            </React.Fragment>
        );
    };

    const exportCSV = () => {
        dt.current?.exportCSV();
    };

    const handleInputsSelectionChange = (e: any) => {
        setSelectedInputs(e.value);
    };

    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" severity="help" onClick={exportCSV} />
            </React.Fragment>
        );
    };

    return (
        <div className="grid justify-content-center mt-3">
            <div className="col-12 xl:col-8">
                <div className="card">
                    <Toast ref={toast} />
                    <DataTable value={[processData]} 
                        header={
                            <div className="flex justify-content-between align-items-center">
                                <h5 className="m-0">Modifier le process</h5>
                            </div>
                        }
                    >
                        <Column field="id" header="ID" />
                        <Column field="name" header="Name" />
                        <Column field="url" header="URL" />
                        <Column field="fixed_url" header="Fixed URL" />
                        <Column body={actionBodyTemplateProcess} header="Actions" />
                    </DataTable>
                </div>
                <div className="card mt-4">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>
                    <DataTable
                        selection={selectedInputs}
                        onSelectionChange={handleInputsSelectionChange}
                        value={inputData}
                        // value={inputData.filter(item =>
                        //     item.input.id.toString().includes(globalFilter) ||
                        //     item.input.type.toLowerCase().includes(globalFilter.toLowerCase()) ||
                        //     item.input.target.toLowerCase().includes(globalFilter.toLowerCase()) ||
                        //     item.input.css_target_id.toString().includes(globalFilter)
                        // )}
                        paginator
                        rows={pagination.rows}
                        first={pagination.first}
                        onPage={(e) => setPagination({ first: e.first, rows: e.rows })}
                        dataKey="input.id"
                        rowsPerPageOptions={[5, 10, 25]}
                        globalFilter={globalFilter}
                        responsiveLayout="scroll"
                        ref={dt}
                        header={
                            <div className="flex justify-content-between align-items-center">
                                <h5 className="m-0">Liste des Input</h5>
                                <span className="block mt-2 p-input-icon-left">
                                    <i className="pi pi-search" />
                                    <InputText type="search" placeholder="Search..." value={globalFilter} onChange={(e) => setGlobalFilter(e.target.value)} />
                                </span>
                            </div>
                        }
                    >
                        <Column selectionMode="multiple" headerStyle={{ width: '4rem' }} />
                        <Column field="input.id" header="Input ID" />
                        <Column field="input.type" header="Type" />
                        <Column field="input.target" header="Target" />
                        <Column field="page" header="Page" />
                        <Column field="input.css_target_id" header="CSS Target ID" />
                        <Column body={actionBodyTemplateInput} header="Actions" />
                    </DataTable>
                </div>
                {/* Process Edit Dialog */}
                <Dialog visible={processDialog} header="Edit Process" modal footer={processDialogFooter} onHide={() => setProcessDialog(false)}>
                    {processData && (
                        <>
                            <label htmlFor="name">Name</label>
                            <InputText id="name" value={processData.name} onChange={(e) => setProcessData({ ...processData, name: e.target.value })} />
                            <label htmlFor="url">URL</label>
                            <InputText id="url" value={processData.url} onChange={(e) => setProcessData({ ...processData, url: e.target.value })} />
                            <label htmlFor="fixed_url">Fixed URL</label>
                            <InputText id="fixed_url" value={processData.fixed_url} onChange={(e) => setProcessData({ ...processData, fixed_url: e.target.value })} />
                        </>
                    )}
                </Dialog>
                {/* Input Edit Dialog */}
                <Dialog visible={inputDialog} header="Edit Input" modal footer={inputDialogFooter} onHide={() => setInputDialog(false)}>
                    {selectedInput && (
                        <>
                            <label htmlFor="type">Type</label>
                            <InputText id="type" value={selectedInput.type} onChange={(e) => setSelectedInput({ ...selectedInput, type: e.target.value })} />
                            <label htmlFor="target">Target</label>
                            <InputText id="target" value={selectedInput.target} onChange={(e) => setSelectedInput({ ...selectedInput, target: e.target.value })} />
                            {/* <label htmlFor="page">Page</label>
                            <InputText id="target" value={selectedInput.page} onChange={(e) => setSelectedInput({ ...selectedInput, page: e.page.value })} /> */}
                            <label htmlFor="css_target_id">CSS Target ID</label>
                            <InputText id="css_target_id" value={selectedInput.css_target_id} onChange={(e) => setSelectedInput({ ...selectedInput, css_target_id: e.target.value })} />
                        </>
                    )}
                </Dialog>
                {/* Delete Confirmation Dialogs */}
                <Dialog visible={deleteProcessDialog} header="Confirm" modal footer={deleteProcessDialogFooter} onHide={() => setDeleteProcessDialog(false)}>
                    <p>Etes vous sûr de vouloir supprimer ce process??</p>
                </Dialog>
                <Dialog visible={deleteInputDialog} header="Confirm" modal footer={deleteInputDialogFooter} onHide={() => setDeleteInputDialog(false)}>
                    <p>Etes vous sûr de vouloir supprimer cet input??</p>
                </Dialog>
            </div>
        </div>
    );
};

export default EditProcess;
