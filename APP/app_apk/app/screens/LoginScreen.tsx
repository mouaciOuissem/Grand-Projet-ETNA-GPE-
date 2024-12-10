import React, { useContext, useState } from 'react';
import { View, Text, Button, TextInput, Alert, ActivityIndicator, StyleSheet } from 'react-native';
import CookieManager from '@react-native-cookies/cookies';
import { AuthContext } from '../AuthContext';

export default function LoginScreen({ navigation }) {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error('AuthContext must be used within an AuthProvider');
    }

    const { setIsLoggedIn } = authContext;
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        if (!identifier || !password) {
            Alert.alert('Erreur', 'Veuillez entrer votre nom d\'utilisateur et votre mot de passe.');
            return;
        }
    
        setLoading(true);
    
        try {
            const response = await fetch('https://www.test.snl-corp.fr/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, password }),
            });
    
            const data = await response.json(); // Parse the JSON response
            // console.log(data)
            if (!response.ok) {
                throw new Error(data.message || 'Erreur lors de la connexion');
            }
    
            // Assuming your API returns the user ID in the response
            // const userId = data.user.id;
    
            await CookieManager.setFromResponse(
                'https://www.test.snl-corp.fr',
                'user_session=abcdefg; path=/; expires=Thu, 1 Jan 2030 00:00:00 -0000; secure; HttpOnly; domain=www.test.snl-corp.fr'
            );
    
            const cookies = await CookieManager.get('https://www.test.snl-corp.fr');
            console.log('Cookies enregistrés:', cookies);
    
            // Store the user ID in the context
            // authContext.setUserId(userId);
            setIsLoggedIn(true);
            navigation.navigate('Home');
        } catch (error) {
            Alert.alert('Erreur', error.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };
    

    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <TextInput
                style={styles.input}
                placeholder="Nom d'utilisateur"
                value={identifier}
                onChangeText={setIdentifier}
            />
            <TextInput
                style={styles.input}
                placeholder="Mot de passe"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
            />
            <Button title="Se connecter" onPress={handleLogin} />
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    input: {
        width: '80%',
        height: 40,
        padding: 10,
        margin: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
    },
});
