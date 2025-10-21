import React, { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import TabNavigator from './src/navigation/TabNavigator';
import { useFonts, PlayfairDisplay_700Bold } from '@expo-google-fonts/playfair-display';
import { Inter_400Regular } from '@expo-google-fonts/inter';
import { StatusBar } from 'expo-status-bar';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';

const AppContent = () => {
  const { isDark } = useContext(ThemeContext);
  let [fontsLoaded] = useFonts({
    PlayfairDisplay_700Bold,
    Inter_400Regular,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <StatusBar style={isDark ? 'light' : 'dark'} />
      <TabNavigator />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}