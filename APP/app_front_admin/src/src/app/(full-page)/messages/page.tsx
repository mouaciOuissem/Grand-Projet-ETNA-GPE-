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

const Messages = () => {
    const { layoutConfig } = useContext(LayoutContext);
    const [messages, setMessages] = useState<any[]>([]);
    const [message, setMessage] = useState('');
    const [selectedMessage, setSelectedMessage] = useState<any>(null); // New state for the selected message
    const [newMessageDialog, setNewMessageDialog] = useState(false); // State for new message dialog
    const [editMessageDialog, setEditMessageDialog] = useState(false); // State for edit message dialog
    const toast = useRef<Toast>(null);
    const { getApiUrl } = useApi();
    const router = useRouter();


    const fetchMessages = async () => {
        try {
            const apiUrl = getApiUrl();
            const response = await fetch(`${apiUrl}/messages`, {
                method: 'GET',
                credentials: 'include',
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setMessages(data.messages); // Assuming the API returns messages in this format
        } catch (error) {
            console.error('Error fetching messages:', error);
        }
    };

    const sendMessage = async () => {
        try {
            const apiUrl = getApiUrl();
            await fetch(`${apiUrl}/messages`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: message,
                    sender: 'PROSY',
                }),
                credentials: 'include',
            });

            setMessage('');
            toast.current?.show({
                severity: 'success',
                summary: 'Message Sent',
                detail: 'Your message has been sent successfully!',
                life: 3000,
            });
            fetchMessages();
        } catch (error) {
            console.error('Error sending message:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error sending your message. '+error,
                life: 3000,
            });
        }
    };

    const editMessage = async () => {
        try {
            const apiUrl = getApiUrl();
            await fetch(`${apiUrl}/messages/${selectedMessage.id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    content: selectedMessage.content,
                }),
                credentials: 'include',
            });

            toast.current?.show({
                severity: 'success',
                summary: 'Message Updated',
                detail: 'Your message has been updated successfully!',
                life: 3000,
            });
            setEditMessageDialog(false);
            fetchMessages();
        } catch (error) {
            console.error('Error editing message:', error);
            toast.current?.show({
                severity: 'error',
                summary: 'Error',
                detail: 'There was an error editing your message.',
                life: 3000,
            });
        }
    };

    useEffect(() => {
        fetchMessages(); // Fetch messages when component mounts
    }, []);

    const actionBodyTemplate = (rowData: any) => {
        return (
            <span>
                {rowData.sender}: {rowData.content}
                <Button
                    icon="pi pi-pencil"
                    className="p-button-rounded p-button-warning ml-2"
                    onClick={() => {
                        setSelectedMessage(rowData);
                        setEditMessageDialog(true);
                    }}
                />
            </span>
        ); // Display message content and sender
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Messages List</h5>
            <Button label="New Message" icon="pi pi-plus" onClick={() => setNewMessageDialog(true)} />
        </div>
    );

    const newMessageDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setNewMessageDialog(false)} />
            <Button label="Send" icon="pi pi-check" onClick={sendMessage} />
        </>
    );

    const editMessageDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" onClick={() => setEditMessageDialog(false)} />
            <Button label="Save" icon="pi pi-check" onClick={editMessage} />
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
                        <DataTable
                            value={messages}
                            dataKey="id"
                            paginator
                            rows={10}
                            rowsPerPageOptions={[5, 10, 25]}
                            className="datatable-responsive"
                            globalFilter={''}
                            emptyMessage="No messages found."
                            header={header}
                            responsiveLayout="scroll"
                        >
                            <Column field="sender" header="Sender" sortable />
                            <Column field="content" header="Message" sortable />
                            <Column field="createdAt" header="Date" sortable />
                            <Column body={actionBodyTemplate} header="Actions" />
                        </DataTable>
                    </div>
                </div>
            </div>

            {/* New Message Dialog */}
            <Dialog visible={newMessageDialog} header="New Message" modal footer={newMessageDialogFooter} onHide={() => setNewMessageDialog(false)}>
                <InputText 
                    type="text" 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)} 
                    placeholder="Type your message here"
                    className="w-full"
                />
            </Dialog>

            {/* Edit Message Dialog */}
            <Dialog visible={editMessageDialog} header="Edit Message" modal footer={editMessageDialogFooter} onHide={() => setEditMessageDialog(false)}>
                {selectedMessage && (
                    <InputText 
                        type="text" 
                        value={selectedMessage.content} 
                        onChange={(e) => setSelectedMessage({ ...selectedMessage, content: e.target.value })} 
                        placeholder="Edit your message"
                        className="w-full"
                    />
                )}
            </Dialog>
        </div>
    );
};

export default Messages;
