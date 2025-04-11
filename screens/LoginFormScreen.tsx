import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BackArrow from '../components/BackArrow';

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
    navigation.navigate('Home');
  };

  const handleEsqueceuSenha = () => {
    navigation.navigate('EsqueceuSenha');
  };

  return (
    <View style={globalStyles.container}>
      {/* Seta de voltar */}
      <BackArrow navigation={navigation} />

      {/* Textos */}
      <Text style={globalStyles.title}>Conecte-se</Text>
      <Text style={globalStyles.subtitle}>Bem vindo de volta</Text>

      {/* Campo Username */}
      <View style={globalStyles.inputContainer}>
        <Icon name="person" size={24} color="#666" style={{ marginRight: 10 }} />
        <TextInput
          style={globalStyles.input}
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
        />
      </View>

      {/* Campo Senha */}
      <View style={globalStyles.inputContainer}>
        <Icon name="lock" size={24} color="#666" style={{ marginRight: 10 }} />
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
  );
};

export default LoginFormScreen;