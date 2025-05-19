import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BackArrow from '../components/BackArrow';
import { LinearGradient } from 'expo-linear-gradient';
import { APILayzaAuth } from '../services/Api';
import { RegisterRequest } from '../utils/Objects';
import { validatePassword } from '../utils/Validators';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  Perfil: undefined;
  Avaliacao: undefined;
};

type CriarContaNavigationProp = StackNavigationProp<RootStackParamList, 'CriarConta'>;

interface Props {
  navigation: CriarContaNavigationProp;
}

const CriarContaScreen: React.FC<Props> = ({ navigation }) => {
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const  handleRegister = async () => {
    const passwordError = validatePassword(password);
    if (passwordError) {
      alert(passwordError);
      return;
    }
    if (!email.includes('@') || !email.includes('.')) {
      alert('Insira um email válido, como exemplo@dominio.com');
      return;
    }
    const data: RegisterRequest = { username, email, password };
    try {
        console.log(data);
      await APILayzaAuth.register(data);
      alert('Conta criada com sucesso!');
      navigation.navigate('LoginForm');
    } catch (error: any) {
      alert(error.message);
    }
  };

  return (
    <LinearGradient
      colors={['#0172B2', '#001645']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={globalStyles.container}
    >
      <View style={globalStyles.container}>
        <BackArrow navigation={navigation} />
        <Image source={require('../assets/images/avatar.png')} style={[globalStyles.logo, { marginBottom: 20 }]} />
        <View style={[globalStyles.buttonContainer, { paddingHorizontal: 10, paddingVertical: 20 }]}>
          <Text style={[globalStyles.text, { fontSize: 24, marginBottom: 20 }]}>Criar Conta</Text>
          <Text style={{ color: '#757575', textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 20 }}>
            Junte-se ao Layza
          </Text>

          <View style={globalStyles.inputContainer}>
            <Icon name="person-outline" size={24} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="Nome de usuário"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Icon name="mail-outline" size={24} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
            />
          </View>

          <View style={globalStyles.inputContainer}>
            <Feather name="lock" size={20} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="Senha"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={globalStyles.button} onPress={handleRegister}>
            <Text style={globalStyles.buttonText}>Criar Conta</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
            <Text style={globalStyles.linkText}>Já tem uma conta? Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default CriarContaScreen;