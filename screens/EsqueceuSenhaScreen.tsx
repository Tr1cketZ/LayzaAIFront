import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import {BackArrow} from '../components/BackArrow';
import { LinearGradient } from 'expo-linear-gradient';
import { APILayzaAuth } from '../services/Api';
import { PasswordResetRequest } from '../utils/Objects';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome5';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  PasswordResetConfirm: {email: string};
  PasswordResetPassword: {email: string, code: string};
};

type EsqueceuSenhaNavigationProp = StackNavigationProp<RootStackParamList, 'EsqueceuSenha'>;

interface Props {
  navigation: EsqueceuSenhaNavigationProp;
}

const EsqueceuSenhaScreen: React.FC<Props> = ({ navigation }) => {
  const [email, setEmail] = useState<string>('');

  const handleResetRequest = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      alert('Insira um email válido, como exemplo@dominio.com');
      return;
    }
    const data: PasswordResetRequest = { email };
    try {
      await APILayzaAuth.passwordResetRequest(data);
      alert('Código de redefinição enviado para o seu email!');
      navigation.navigate('PasswordResetConfirm', { email });
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.detail ||
        error.response?.data?.email?.[0] ||
        error.message ||
        'Erro ao solicitar redefinição de senha';
      console.error('Erro ao solicitar redefinição:', errorMessage, error.response?.data);
      alert(`Erro: ${errorMessage}`);
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
        <View style={[globalStyles.buttonContainer, { paddingHorizontal: 10, paddingVertical: 20 }]}>
          <IconFontAwesome name='couch' size={100} color="#2F80ED" />
          <Text style={[globalStyles.text, { fontSize: 24, marginBottom: 20 }]}>Recuperação de Senha</Text>
          <Text style={{ color: '#757575', textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 20 }}>
            Digite seu E-mail para iniciar a recuperação de senha
          </Text>

          <View style={globalStyles.inputContainer}>
            <Icon name="mail-outline" size={24} color="#2F80ED" style={{ marginRight: 10 }} />
            <TextInput
              style={globalStyles.input}
              placeholder="E-mail"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <TouchableOpacity style={globalStyles.button} onPress={handleResetRequest}>
            <Text style={globalStyles.buttonText}>Recuperar Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
            <Text style={globalStyles.linkText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};

export default EsqueceuSenhaScreen;