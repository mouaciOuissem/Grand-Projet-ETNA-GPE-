// app/components/CustomTabBar.js
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';

const TopBar = () => {
  const router = useRouter();
  const colorScheme = useColorScheme();

  const tabs = [
    {
      name: 'Home',
      route: 'index',
    },
    {
      name: 'Explore',
      route: 'explore',
    },
  ];

  return (
    <View style={[styles.tabBar, { backgroundColor: Colors[colorScheme ?? 'light'].background }]}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.route}
          style={styles.tabButton}
          onPress={() => router.push(tab.route)}
        >
          <Text style={styles.tabText}>{tab.name}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    elevation: 5, // Pour ajouter une ombre
    position: 'absolute', // Fixe la barre en haut
    top: 0,
    left: 0,
    right: 0,
    zIndex: 100, // Pour s'assurer que la barre est au-dessus d'autres composants
  },
  tabButton: {
    padding: 10,
  },
  tabText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default CustomTabBar;
