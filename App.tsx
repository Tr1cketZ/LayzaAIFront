import React from 'react';
import AppNavigator from './navigation/AppNavigator';
import { useFonts } from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';


SplashScreen.preventAutoHideAsync(); // Evita que a splash desapareça antes da fonte carregar

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lobster-Regular': require('./assets/fonts/Lobster-Regular.ttf'),
  });
  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null; // Pode exibir um loading se quiser
  }
  return <AppNavigator />;
}
