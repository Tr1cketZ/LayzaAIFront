import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BackArrow from '../components/BackArrow';
import { LinearGradient } from 'expo-linear-gradient';
import { APILayzaAuth } from '../services/Api';
import { PasswordResetConfirmRequest } from '../utils/Objects';
import { validatePassword } from '../utils/Validators';
import { RouteProp } from '@react-navigation/native';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  PasswordResetConfirm: { email: string };
};

type PasswordResetConfirmNavigationProp = StackNavigationProp<RootStackParamList, 'PasswordResetConfirm'>;
type PasswordResetConfirmScreenRouteProp = RouteProp<RootStackParamList, 'PasswordResetConfirm'>;

interface Props {
  navigation: PasswordResetConfirmNavigationProp;
  route: PasswordResetConfirmScreenRouteProp
}

const PasswordResetConfirmScreen: React.FC<Props> = ({ navigation, route }) => {
  const [email, setEmail] = useState<string>('');
  const [codeDigits, setCodeDigits] = useState<string[]>(Array(6).fill(''));
  const [newPassword, setNewPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  useEffect(() => {
    setEmail(route.params.email);
  }, [route.params.email]);
  const handleCodeChange = (text: string, index: number) => {
    const newDigits = [...codeDigits];
    newDigits[index] = text.slice(0, 1); // Limita a um dígito
    setCodeDigits(newDigits);

    // Move o foco para o próximo campo
    if (text && index < 5) {
      const nextInput = inputs[index + 1].current;
      if (nextInput) nextInput.focus();
    }
  };
  const handleResetConfirm = async () => {
    if (!email.includes('@') || !email.includes('.')) {
      alert('Insira um email válido, como exemplo@dominio.com');
      return;
    }
    const code = codeDigits.join('');
    if (code.length !== 6 || code.includes('')) {
      alert('Digite um código de 6 dígitos');
      return;
    }
    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      alert(passwordError);
      return;
    }

    const data: PasswordResetConfirmRequest = { email, code, new_password: newPassword };
    try {
      await APILayzaAuth.passwordResetConfirm(data);
      alert('Senha redefinida com sucesso!');
      navigation.navigate('LoginForm');
    } catch (error: any) {
      alert(error)
    }
  };
  const inputs = Array(6).fill(null).map((_, index) => React.createRef<TextInput>());
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
          <Text style={[globalStyles.text, { fontSize: 24, marginBottom: 20 }]}>Confirmar Redefinição</Text>
          <Text style={{ color: '#757575', textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 20 }}>
            Digite o código e a nova senha
          </Text>

          <View style={styles.codeContainer}>
            {codeDigits.map((digit, index) => (
              <TextInput
                key={index}
                ref={inputs[index]}
                style={styles.codeInput}
                value={digit}
                onChangeText={(text) => handleCodeChange(text, index)}
                keyboardType="numeric"
                maxLength={1}
                autoFocus={index === 0}
              />
            ))}
          </View>

          <View style={globalStyles.inputContainer}>
            <Feather
              name={showPassword ? "eye" : "eye-off"}
              size={20}
              color="#2F80ED"
              style={{ marginRight: 10 }}
              onPress={() => setShowPassword(!showPassword)}
            />
            <TextInput
              style={globalStyles.input}
              placeholder="Nova senha"
              value={newPassword}
              onChangeText={setNewPassword}
              secureTextEntry={!showPassword}
            />
          </View>

          <TouchableOpacity style={globalStyles.button} onPress={handleResetConfirm}>
            <Text style={globalStyles.buttonText}>Confirmar Nova Senha</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginForm')}>
            <Text style={globalStyles.linkText}>Voltar ao Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  );
};
const styles = StyleSheet.create({
  codeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  codeInput: {
    width: 40,
    height: 40,
    borderWidth: 1,
    borderColor: '#2F80ED',
    borderRadius: 5,
    textAlign: 'center',
    fontSize: 18,
    color: '#000',
  },
});
export default PasswordResetConfirmScreen;