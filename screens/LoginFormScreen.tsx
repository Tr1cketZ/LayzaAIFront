import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import {BackArrow} from '../components/BackArrow';
import { LinearGradient } from 'expo-linear-gradient';
import { useDispatch } from 'react-redux';
import { LoginRequest } from '../utils/Objects';
import { APILayzaAuth, APILayzaPerfil } from '../services/Api';
import { setTokens } from '../redux/AuthSlice';
import { setUserProfile } from '../redux/UserProfileSlice';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const dispatch = useDispatch();

  const handleLogin = async () => {
    if(!email.includes('@') || !email.includes('.')) return alert('Insira um email válido, como exemplo@dominio.com');
    if(!password.trim()) return alert('A senha não pode estar em branco.');
    const data: LoginRequest = { email, password };
    try{
      const response = await APILayzaAuth.login(data);
      dispatch(setTokens(response.data));
      // Buscar perfil do usuário após login
      const perfilResponse = await APILayzaAuth.getPerfil();
      dispatch(setUserProfile(perfilResponse.data));
      // Salvar no AsyncStorage
      await AsyncStorage.setItem('userProfile', JSON.stringify(perfilResponse.data));
      navigation.navigate('Home');
    } catch (error: any) {
      const errorMessage = error;
      alert(`Erro ao fazer login: ${errorMessage}`);
    }
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
              value={email}
              onChangeText={setEmail}
              keyboardType='email-address'
              autoCapitalize='none'
            />
          </View>

          {/* Campo Senha */}
          <View style={globalStyles.inputContainer}>
            <Feather name={showPassword ? 'eye' : 'eye-off'} size={20} color="#2F80ED" style={{ marginRight: 10 }} onPress={() => setShowPassword(!showPassword)} />
            <TextInput
              style={globalStyles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPassword}
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