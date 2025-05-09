import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BackArrow from '../components/BackArrow';
import { LinearGradient } from 'expo-linear-gradient';

// Definir o tipo das rotas
type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined; // Nova tela
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined; // Para "Esqueceu a senha"
};

type LoginFormNavigationProp = StackNavigationProp<RootStackParamList, 'LoginForm'>;

interface Props {
  navigation: LoginFormNavigationProp;
}

const LoginFormScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleLogin = () => {
    // Simulação de login, navega para Home
    console.log(username, password);
    navigation.navigate('Home');
  };

  const handleEsqueceuSenha = () => {
    navigation.navigate('EsqueceuSenha');
  };

  return (
    <LinearGradient
      colors={['#0172B2', '#001645']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={globalStyles.container}
    >
      <View style={globalStyles.container}>
        {/* Seta de voltar */}
        <BackArrow navigation={navigation} />

        <Image source={require('../assets/images/avatar.png')} style={[globalStyles.logo,{marginBottom: 20}]} />

        <View style={[globalStyles.buttonContainer, { paddingHorizontal: 10, paddingVertical: 20 }]}>
          <Text style={[globalStyles.text, { fontSize: 24, marginBottom: 20 }]}>Conecte-se</Text>
          <Text style={{ color: '#757575', textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 20 }}>Bem vindo de volta</Text>

          {/* Campo Username */}
          <View style={globalStyles.inputContainer}>
            <Icon name="mail-outline" size={24} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="Email"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          {/* Campo Senha */}
          <View style={globalStyles.inputContainer}>
            <Feather name="eye-off" size={20} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          {/* Botão Logar */}
          <TouchableOpacity style={globalStyles.button} onPress={handleLogin}>
            <Text style={globalStyles.buttonText}>Logar</Text>
          </TouchableOpacity>

          {/* Esqueceu a senha */}
          <TouchableOpacity onPress={handleEsqueceuSenha}>
            <Text style={globalStyles.linkText}>Esqueceu a senha? Mudar Senha</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default LoginFormScreen;