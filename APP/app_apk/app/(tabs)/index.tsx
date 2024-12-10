// app/(tabs)/index.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import LoginScreen from '../screens/LoginScreen';
import { AuthProvider } from '../AuthContext';
// import CustomTabBar from '@/components/TopBar';

const Stack = createNativeStackNavigator();

export default function Tabs() {
  return (
    <AuthProvider>
      <View style={styles.container}>
        {/* <CustomTabBar /> */}
        <Stack.Navigator initialRouteName="Home" style={styles.stack}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      </View>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50, // Ajustez selon la hauteur de votre tabBar
  },
  stack: {
    flex: 1,
    marginTop: 50, // Pour laisser de l'espace en haut pour la tabBar
  },
});
