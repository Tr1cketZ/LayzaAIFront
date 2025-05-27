import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
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
    PasswordResetCode: { email: string };
    NewPasswordScreen: { email: string; code: string };
};


type PasswordResetConfirmNavigationProp = StackNavigationProp<RootStackParamList, 'NewPasswordScreen'>;
type PasswordResetConfirmScreenRouteProp = RouteProp<RootStackParamList, 'NewPasswordScreen'>;

interface Props {
    navigation: PasswordResetConfirmNavigationProp;
    route: PasswordResetConfirmScreenRouteProp
}

const NewPasswordScreen: React.FC<Props> = ({ navigation, route }) => {
    const { email, code } = route.params;
    const [newPassword, setNewPassword] = useState<string>('');
    const [showPassword, setShowPassword] = useState<boolean>(false);

    const handleResetConfirm = async () => {
        if (!email.includes('@') || !email.includes('.')) {
            alert('Insira um email válido, como exemplo@dominio.com');
            return;
        }
        if (code.length !== 6 || code.includes(' ')) {
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
                    <Text style={[globalStyles.text, { fontSize: 24, marginBottom: 20 }]}>Definir Nova Senha</Text>
                    <Text style={{ color: '#757575', textAlign: 'center', fontSize: 20, fontWeight: '500', marginBottom: 20 }}>
                        Insira sua nova senha
                    </Text>

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

export default NewPasswordScreen;