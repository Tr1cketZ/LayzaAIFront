import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
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
      <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
        <Text style={globalStyles.buttonText}>Login</Text>
      </TouchableOpacity>
      <TouchableOpacity style={globalStyles.button} onPress={handleCriarConta}>
        <Text style={globalStyles.buttonText}>Criar conta</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={handleMaisTarde}>
        <Text style={globalStyles.linkText}>Mais tarde</Text>
      </TouchableOpacity>
    </View>
    </LinearGradient>
  );
};

export default LoginScreen;