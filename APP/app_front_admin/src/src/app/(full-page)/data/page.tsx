'use client';
import { useEffect, useState, useRef } from 'react';
import { Button } from 'primereact/button';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Dialog } from 'primereact/dialog';
import { useApi } from '@/src/layout/context/apiContext';
import Nav from "@/src/app/(full-page)/nav/page";
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { MenuProvider } from '@/src/layout/context/menucontext';
import modelDashboard from '@/src/layout/menuMap/dashboardMenu';
import AppMenuitem from '@/src/layout/AppMenuitem';

const ListBuckets = () => {
    const [buckets, setBuckets] = useState<any[]>([]);
    const [selectedBucket, setSelectedBucket] = useState<any>(null);
    const [bucketDialog, setBucketDialog] = useState(false);
    const toast = useRef<Toast>(null);
    const { getApiUrl } = useApi();

    useEffect(() => {
        fetchBuckets();
    }, []);

    const fetchBuckets = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/bckt/list-bucket`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setBuckets(data); 
        } catch (error) {
            console.error('Error fetching buckets:', error);
        }
    };

    // Delete a bucket
    const handleDeleteBucket = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/bucket/${selectedBucket.name}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Error deleting bucket');
            }

            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Bucket Deleted',
                life: 3000,
            });

            setBucketDialog(false);
            fetchBuckets();
        } catch (error) {
            console.error('Error deleting bucket:', error);
        }
    };

    const dateFormatter = (rowData) => {
        return format(new Date(rowData.CreationDate), 'EEEE, dd MMMM yyyy', { locale: fr });
    };

    const actionBodyTemplate = (rowData: any) => (
        <>
            <Button icon="pi pi-trash" className="p-button-rounded p-button-danger" onClick={() => {
                setSelectedBucket(rowData);
                setBucketDialog(true);
            }} />
        </>
    );

    const bucketDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" text onClick={() => setBucketDialog(false)} />
            <Button label="Yes" icon="pi pi-check" text onClick={handleDeleteBucket} />
        </>
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
                        <DataTable value={buckets} paginator rows={10} dataKey="name">
                            <Column field="Name" header="Bucket Name" />
                            <Column field="createdAt" header="Date de Création" body={dateFormatter} sortable />
                            <Column body={actionBodyTemplate} header="Actions" />
                        </DataTable>
                    </div>

                    {/* Delete Confirmation Dialog */}
                    <Dialog visible={bucketDialog} header="Confirm" modal footer={bucketDialogFooter} onHide={() => setBucketDialog(false)}>
                        <p>Are you sure you want to delete this bucket?</p>
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default ListBuckets;
