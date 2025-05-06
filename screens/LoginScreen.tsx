import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  CriarConta: undefined;
  Home: undefined;
  LoginForm: undefined;
};
type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;
interface Props {
  navigation: LoginScreenNavigationProp
}
function LoginScreen({ navigation }: Props) {
  const handleLogin = () => {
    navigation.navigate('LoginForm');
  }
  const handleCriarConta = () => {
    navigation.navigate('CriarConta');
  }
  const handleMaisTarde = () => {
    navigation.navigate('Home');
  }
  return (
    <LinearGradient
      colors={['#0172B2', '#001645']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={globalStyles.container}
    >
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Layza</Text>
        <Image source={require('../assets/images/avatar.png')} style={globalStyles.logo} />
        <View style={[globalStyles.buttonContainer, { paddingHorizontal: 5, paddingVertical: 20 }]}>
          <Text style={[globalStyles.text, { marginBottom: 10 }]}>Faça Login ou cadastre-se</Text>
          <Text style={{ color: '#757575', textAlign: 'center', fontSize: 15, fontWeight: '500', marginBottom: 20 }}>Faça login para uma experiência de aprendizado personalizada ou crie uma conta para acessar conteúdos personalizados</Text>
          <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#ffffff', boxShadow: '0px 0px 10px 0px rgba(0, 0, 0, 0.7)' }]} onPress={handleCriarConta}>
            <Text style={globalStyles.text}>Criar conta</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleMaisTarde}>
            <Text style={globalStyles.linkText}>Mais tarde</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginScreen;