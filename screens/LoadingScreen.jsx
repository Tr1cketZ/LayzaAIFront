import React, { useEffect, useRef, useState } from 'react';
import { View, Text, ActivityIndicator, Animated, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { LinearGradient } from 'expo-linear-gradient';

const AnimatedView = Animated.createAnimatedComponent(View);

const LoadingScreen = ({ navigation }) => {
  const [isLoginReady, setIsLoginReady] = useState(false); // Controla se Login está pronto
  const fadeAnim = useRef(new Animated.Value(0)).current; // Valor inicial da animação
  const slideAnim = useRef(new Animated.Value(0)).current; // Para animação de deslize

  // Simula o carregamento da tela de login (3 segundos mínimos)
  useEffect(() => {
    // Fade in ao carregar
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // Simula carregamento da próxima tela (pode substituir por uma chamada real)
    const simulateLoading = setTimeout(() => {
      setIsLoginReady(true); // Marca Login como pronto após 3s
    }, 3000);

    return () => clearTimeout(simulateLoading);
  }, [fadeAnim]);

  // Quando Login estiver pronto, inicia a animação de saída
  useEffect(() => {
    if (isLoginReady) {
      Animated.timing(slideAnim, {
        toValue: -1000, // Desliza para a esquerda (fora da tela)
        duration: 800, // Duração da animação
        useNativeDriver: true,
      }).start(() => {
        navigation.replace('Login'); // Navega para Login após animação
      });
    }
  }, [isLoginReady, slideAnim, navigation]);

  return (
    <AnimatedView
      style={[
        {
          flex: 1,
          opacity: fadeAnim,
          transform: [{ translateX: slideAnim }],
        },
      ]}
    >
      <LinearGradient
        colors={['#0172B2', '#001645']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={globalStyles.container}
      >

        <View style={globalStyles.titleContainer}>
          <Text style={globalStyles.title}>Layza</Text>
          <Image
            source={require('../assets/images/avatar.png')}
            style={globalStyles.avatar}
          />
        </View>
        <Text style={globalStyles.subtitle}>Bem Vindo a sua assistente de estudos virtual</Text>
        <ActivityIndicator size="large" color="#ffffff" style={globalStyles.loadingIndicator} />

      </LinearGradient>
    </AnimatedView>
  );
};

export default LoadingScreen;