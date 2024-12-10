/* eslint-disable @next/next/no-img-element */
'use client';
import Nav from "../nav/page";
import { Prsy } from '@/src/types';
import React, { useContext, useEffect, useState, useRef } from 'react';
import { LayoutContext } from '@/src/layout/context/layoutcontext';
import { ChartOptions } from 'chart.js';
import { Galleria } from 'primereact/galleria';
import { Button } from 'primereact/button';
import AppMenuitem from '@/src/layout/AppMenuitem';
import { MenuProvider } from '@/src/layout/context/menucontext';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { PhotoService } from "@/src/service/PhotoService";
import { Dialog } from 'primereact/dialog';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

import { useApi } from '@/src/layout/context/apiContext';
import { useUser } from '@/src/layout/context/userContext';
import modelUsers from '@/src/layout/menuMap/usersMenu';

const Document = () => {
    const [images, setImages] = useState<Prsy.Photo[]>([]);
    const [files, setFiles] = useState<{ name: string; type: string; size: number; lastModified: string }[]>([]);
    const [loadingFiles, setLoadingFiles] = useState(true);
    const { layoutConfig } = useContext(LayoutContext);
    const { getApiUrl } = useApi();
    const toast = useRef<Toast>(null);
    const [previewContent, setPreviewContent] = useState('');
    const [previewType, setPreviewType] = useState('');
    const [visible, setVisible] = useState(false);
    const [sizeFormat, setSizeFormat] = useState('mo');
    const [totalSize, setTotalSize] = useState<{ bytes: number; mo: string }>({ bytes: 0, mo: "0.00" });
    const { userDataDetails, fetchUserDataDetails } = useUser();

    
    useEffect(() => {
        if (!userDataDetails) {
            fetchUserDataDetails();
        }
    }, [userDataDetails, fetchUserDataDetails]);

    const bucketName = userDataDetails?.bucket?.bucketName;



    const galleriaResponsiveOptions = [
        { breakpoint: '1024px', numVisible: 5 },
        { breakpoint: '960px', numVisible: 4 },
        { breakpoint: '768px', numVisible: 3 },
        { breakpoint: '560px', numVisible: 1 }
    ];

    useEffect(() => {
        PhotoService.getImages().then((images) => setImages(images));
    }, []);


    const fetchFiles = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/bckt/list-objects/${bucketName}/`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const filesWithProps = data.files.map(file => ({
                name: file.name,
                type: file.type || 'unknown',
                size: file.size || 0,
                lastModified: file.lastModified || new Date().toISOString()
            }));

            setFiles(filesWithProps);
            setTotalSize(data.totalSize);
        } catch (error) {
            console.error('Error fetching files:', error);
        } finally {
            setLoadingFiles(false);
        }
    };

    useEffect(() => {
        if (userDataDetails && userDataDetails.bucket?.bucketName) {
            fetchFiles();
        }
    }, [userDataDetails]);

    const previewFile = async (fileName, fileType) => {
        try {
            const apiUrl = getApiUrl();
            // Get the presigned URL from your API
            const response = await fetch(`${apiUrl}/bckt/view-file/${bucketName}/${encodeURIComponent(fileName)}`, {
                method: 'GET',
                credentials: 'include',
            });
    
            if (!response.ok) {
                throw new Error('Failed to load presigned URL');
            }
    
            const { url } = await response.json();
    
        if (fileType.startsWith('image/') || fileType === 'application/pdf' || fileType === 'text/plain') {
            setPreviewContent(url);
            setPreviewType(fileType);
        } else {
            throw new Error('Unsupported file type');
        }
    
            setVisible(true);
        } catch (error) {
            console.error('Error previewing file:', error);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Failed to load preview', life: 3000 });
        }
    };


    const handleUpload = async () => {

    };

    const handleDelete = async () => {

    };

    const dateFormatter = (rowData) => {
        return format(new Date(rowData.lastModified), 'EEEE, dd MMMM yyyy', { locale: fr });
    };

    const galleriaItemTemplate = (item: Prsy.Photo) => (
        <img src={`/${item.itemImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />
    );

    const galleriaThumbnailTemplate = (item: Prsy.Photo) => (
        <img src={`/${item.thumbnailImageSrc}`} alt={item.alt} style={{ width: '100%', display: 'block' }} />
    );

    useEffect(() => {
        return () => {
            if (previewContent) {
                URL.revokeObjectURL(previewContent);
            }
        };
    }, [previewContent]);

    const headerTemplate = (
        <div style={{ display: 'flex', alignItems: 'center' }}>
            <span>Taille du fichier</span>
            <select value={sizeFormat} onChange={(e) => setSizeFormat(e.target.value)} style={{ marginLeft: '10px' }}>
                <option value="ko">Ko</option>
                <option value="mo">Mo</option>
            </select>
        </div>
    );

    const footerContent = (
        <div>
            <Button label="Fermer" severity="info" onClick={() => setVisible(false)} />
            <Button label="Modifier" severity="warning" onClick={handleUpload} />
            <Button label="Supprimer" severity="danger"onClick={handleDelete} />
        </div>
    );

    if (!userDataDetails || !userDataDetails.bucket || !userDataDetails.bucket.bucketName) {
        return <div>Loading...</div>;
    }

    return (
        <div className='document'>
            <Nav />
            <div className="hidden xl:flex">
                <div className='layout-sidebar'>
                    <MenuProvider>
                        <ul className="layout-menu">
                            {modelUsers.map((item, i) => (
                                !item?.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator" key={`sep-${i}`}></li>
                            ))}
                        </ul>
                    </MenuProvider>
                </div>
            </div>
            <div className="grid justify-content-center mt-3">
                <div className="col-12 xl:col-6" style={{ maxWidth: '1200px', padding: '0 2rem', marginTop: '2rem', marginBottom: '2rem'}}>
                    <div className="card">
                        <Toast ref={toast} />
                        <h5>Liste des fichiers</h5>
                        <p>Taille totale : {totalSize.mo} Mo</p>
                        {loadingFiles ? (
                            <p>Chargement...</p>
                        ) : (
                            <DataTable 
                                value={files} 
                                paginator rows={10} 
                                rowsPerPageOptions={[5, 10, 25]} 
                                emptyMessage="Aucun fichier trouvé."
                            >
                                <Column field="name" header="Nom du fichier" sortable />
                                <Column field="type" header="Type du fichier" sortable />
                                <Column 
                                    header={headerTemplate}
                                    body={(rowData) => {
                                        const size = sizeFormat === 'ko' ? rowData.size.ko : rowData.size.mo;
                                        return `${size} ${sizeFormat.toUpperCase()}`;
                                    }} 
                                    sortable 
                                />
                                <Column field="lastModified" header="Dernière modification du fichier" body={dateFormatter} sortable />
                                <Column body={(rowData) => <button onClick={() => previewFile(rowData.name, rowData.type)}>Prévisualiser</button>} header="Actions" />
                            </DataTable>
                        )}
                    </div>

                    <div className="card">
                        <h5>Documents</h5>
                        <Galleria value={images} responsiveOptions={galleriaResponsiveOptions} numVisible={7} circular style={{ maxWidth: '800px', margin: 'auto' }} item={galleriaItemTemplate} thumbnail={galleriaThumbnailTemplate}></Galleria>
                    </div>
                    
                    <Dialog header="Aperçu du fichier" visible={visible} onHide={() => setVisible(false)} footer={footerContent} style={{ width: '60vw' }}>
                        {previewType.startsWith('image/') ? (
                            <img src={previewContent} alt="Preview" style={{ width: '100%', height: 'auto' }} />
                        ) : previewType === 'application/pdf' ? (
                            <embed src={previewContent} width="100%" height="400px" type="application/pdf" />
                        ) : previewType === 'text/plain' ? (
                            <iframe src={previewContent} width="100%" height="400px" style={{ border: 'none' }} title="Text Preview"></iframe>
                        ) : (
                            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word' }}>{previewContent}</pre>
                        )}
                    </Dialog>
                </div>
            </div>
        </div>
    );
};

export default Document;
