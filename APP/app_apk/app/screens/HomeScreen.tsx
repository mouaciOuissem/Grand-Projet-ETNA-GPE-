import React, { useEffect, useState, useContext } from 'react';
import { Image, StyleSheet, View, Text, Button, Modal, TouchableOpacity } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import { Table, Row, Rows } from 'react-native-table-component';
import { Calendar } from 'react-native-calendars';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { AuthContext } from '../AuthContext';
// import TopBar from '@/components/TopBar';

export default function HomeScreen({ navigation }) {
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState('');
    const [tableData, setTableData] = useState([]);
    const [markedDates, setMarkedDates] = useState({});
    const [selectedStatus, setSelectedStatus] = useState('tous');
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedDateDetails, setSelectedDateDetails] = useState([]);

    // Always call useContext at the top level
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }
    const { isLoggedIn, userId, loading: authLoading } = authContext;


    // console.log('isLoggedIn:', isLoggedIn);

    // This useEffect handles the redirection based on the isLoggedIn state
    useEffect(() => {
        const checkAuth = async () => {
            console.log('Vérification de l\'authentification en cours...');
            console.log('isLoggedIn:', isLoggedIn); // Vérifier l'état de l'authentification
    
            if (authLoading) {
                return;
            }

            if (isLoggedIn !== true) {
                console.log("Navigating to login...");
                navigation.navigate('Login'); 
            } else {
                console.log("User is logged in, fetching user data...");
                await fetchUserData(); // Récupérer les données de l'utilisateur
            }
            
            setLoading(false); // Mettre à jour l'état de chargement à la fin
        };
    
        checkAuth();
    }, [isLoggedIn, authLoading, navigation]);

    const handleLogout = async () => {
        try {
            const response = await fetch('https://www.test.snl-corp.fr/api/auth/logout', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                await CookieManager.clearAll();
                navigation.navigate('Login');
            } else {
                console.error('Logout failed:', await response.text());
                setError('Erreur lors de la déconnexion.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            setError('Une erreur est survenue lors de la déconnexion.');
        }
    };

    // Fetch user data when isLoggedIn or userId changes
    const fetchUserData = async () => {
        try {
            const response = await fetch(`https://www.test.snl-corp.fr/api/user/`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            if (response.ok) {
                setUserData(data);
                fetchUserProcesses(data.user.id);
            } else {
                setError(data.error_message);
            }
        } catch (error) {
            console.error('Erreur lors de la récupération des informations utilisateur:', error);
            setError('Une erreur est survenue lors de la récupération des informations utilisateur');
        }
    };

    const fetchUserProcesses = async (userId) => {
        try {
            const response = await fetch(`https://www.test.snl-corp.fr/api/all_process_by_user/${userId}`, {
                method: 'GET',
                credentials: 'include',
            });

            const data = await response.json();
            console.log(data)
            if (response.ok) {
                prepareTableData(data.userHasProcess);
            } else {
                setError(data.error_message);
            }
        } catch (error) {
            console.error('Error fetching process data:', error);
        }
    };

    const fetchProcessById = async (processId) => {
        console.log(processId)
        try {
            const response = await fetch(`https://www.test.snl-corp.fr/api/process/${processId}`, {
                method: 'GET',
                credentials: 'include',
            });
    
            const data = await response.json();
            console.log(data.process)
            if (response.ok) {
                return data.process;
            } else {
                setError(data.error_message);
                return null;
            }
        } catch (error) {
            console.error('Erreur lors de la récupération du processus:', error);
            setError('Une erreur est survenue lors de la récupération du processus');
            return null;
        }
    };

    const prepareTableData = (processData) => {
        const tableHeader = ['Processus', 'Date de Création', 'Statut'];

        const statusColors = {
            'en cours': 'blue',
            'terminer': 'green',
            'annuler': 'red',
            'en erreur': 'orange',
            'commencer': 'purple',
        };

        const filteredData = selectedStatus === 'tous'
            ? processData
            : processData.filter(item => item.Status.name.toLowerCase() === selectedStatus);

        const tableRows = filteredData.map(item => {
            const status = item.Status.name.toLowerCase();
            const color = statusColors[status] || 'gray';

        // Valider la date avant de la convertir
        const createdAtDate = new Date(item.createdAt);
        if (isNaN(createdAtDate.getTime())) {
            console.warn(`Date invalide pour item: ${item.createdAt}`);
            return [item.Process.name, 'Date invalide', <Text style={{ color }}>N/A</Text>];
        }
        const formattedDate = createdAtDate.toISOString().split('T')[0] + `-${item.ProcessId}`;
        
        return [
            item.Process.name,
            formattedDate, // utilisez la date formatée ici avec l'ID
            <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                <Text style={{ color }}>{item.Status.name}</Text>
            </View>,
        ];
    });

        setTableData([tableHeader, ...tableRows]);

        const newMarkedDates = {};
        filteredData.forEach(item => {
            const dateObj = new Date(item.createdAt);
            if (!isNaN(dateObj.getTime())) {
                const date = dateObj.toISOString().split('T')[0];
                const status = item.Status.name.toLowerCase();
                const color = statusColors[status] || 'gray';
    
                newMarkedDates[date] = {
                    marked: true,
                    selected: true,
                    selectedColor: color,
                };
            } else {
                console.warn(`Date invalide lors de la marque: ${item.createdAt}`);
            }
        });
    
        setMarkedDates(newMarkedDates);
    };

    const handleDayPress = async (day) => {
        const date = day.dateString; // Obtient la date au format YYYY-MM-DD
        // Trouvez les détails du processus en fonction de la date
        console.log("Date sélectionnée:", date);
        console.log("Détails du tableau avant le filtrage:", tableData);
        const details = tableData.slice(1).filter(item => {
            const processDate = item[1].split('-').slice(0, 3).join('-'); // Récupère la date complète (YYYY-MM-DD)
            console.log("Process Date:", processDate);
            return processDate === date; // Comparaison correcte
        });

        if (details.length > 0) {
            // console.log(details)
            // L'ID du processus est maintenant extrait directement des détails
            const processId = details[0][1].split('-')[3]; // Extrait l'ID du processus
            // console.log(processId)
            // Appeler fetchProcessById avec l'ID du processus
            // console.log(processId)
            const processDetails = await fetchProcessById(processId);
            if (processDetails) {
                setSelectedDateDetails([processDetails]); // Mettez à jour les détails du processus sélectionné
            } else {
                setSelectedDateDetails([]); // Si aucun détail n'est trouvé
            }
        } else {
            setSelectedDateDetails([]);
        }
    
        setModalVisible(true);
    };

    // Return the loading state, error state, or the main content
    if (loading) { 
        return (
            <View style={styles.container}>
                <ThemedText type="title">Vérification de l'authentification...</ThemedText>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <ThemedText type="title">{error}</ThemedText>
            </View>
        );
    }

    if (!userData) {
        return (
            <View style={styles.container}>
                <ThemedText type="title">{userId}</ThemedText>
                <ThemedText type="title">Chargement des données utilisateur...</ThemedText>
            </View>
        );
    }

    return (
        <View style={{ flex: 1 }}>
            {/* <TopBar /> */}
            <ThemedView style={styles.titleContainer}>
                <ThemedText type="title">Bienvenue {userData?.user?.username} !</ThemedText>
                <HelloWave />
                <Button title="Logout" onPress={handleLogout} />
                <Calendar 
                    markedDates={markedDates} 
                    style={styles.calendar} 
                    onDayPress={handleDayPress}
                />
                <View style={styles.card}>
                    <Text style={styles.title}>Liste des Processus en Cours</Text>
                    <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                        <Row data={tableData[0]} style={styles.header} textStyle={styles.text} />
                        <Rows data={tableData.slice(1)} textStyle={styles.text} />
                    </Table>
                </View>
                <Modal
                    animationType="slide"
                    transparent={true} 
                    visible={modalVisible}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalView}>
                            <Text style={styles.modalTitle}>Détails des Processus</Text>
                            {selectedDateDetails.length > 0 ? (
                                <Table borderStyle={{ borderWidth: 1, borderColor: '#C1C0B9' }}>
                                    <Row data={['Processus', 'Date de Création', 'Statut']} style={styles.header} textStyle={styles.text} />
                                    <Rows 
                                        data={selectedDateDetails.map(item => [
                                            item.name,                          // Affiche le nom du processus
                                            new Date(item.createdAt).toLocaleDateString(), // Formate la date de création
                                            item.fixed_url === 0 ? 'Actif' : 'Inactif' // Assurez-vous d'afficher le statut selon votre logique
                                        ])} 
                                        textStyle={styles.text} 
                                    />
                                </Table>
                            ) : (
                                <Text>Aucun processus trouvé pour cette date.</Text>
                            )}
                            <TouchableOpacity style={styles.button} onPress={() => setModalVisible(false)}>
                                <Text style={styles.buttonText}>Fermer</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </ThemedView>
        </View>
    );
}

const styles = StyleSheet.create({
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center', 
        // backgroundColor: 'rgba(0, 0, 0, 0.5)', // Couleur de fond semi-transparente pour le container
        backgroundColor: ''
    },
    modalView: {
        width: '80%',   
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        elevation: 5,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    button: {
        marginTop: 20,
        backgroundColor: '#2196F3',
        borderRadius: 5,
        padding: 10,
    },
    buttonText: {
        color: 'white',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    reactLogo: {
        height: 178,
        width: 290,
        bottom: 0,
        left: 0,
        position: 'absolute',
    },
    card: {
        marginTop: 20,
        padding: 16,
        borderWidth: 1,
        borderColor: '#C1C0B9',
        borderRadius: 8,
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    header: {
        height: 40,
        backgroundColor: '#f1f8ff',
    },
    text: {
        margin: 6,
        textAlign: 'center',
        color: '#000',
    },
    calendar: {
        marginBottom: 20,
    },
});
