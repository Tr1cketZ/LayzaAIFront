import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../styles/globalStyles';
import Sofa from 'react-native-vector-icons/FontAwesome5';
import BackArrow from '../components/BackArrow';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';

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
const HomeScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
    colors={['#0172B2', '#001645']}
    start={{ x: 0, y: 0 }}
    end={{ x: 0, y: 1 }}
    style={globalStyles.container}
  >
    <View style={globalStyles.container}>
      <BackArrow navigation={navigation} />
      <Sofa name="couch" size={200} color="#2F80ED" />
      <Text style={globalStyles.title}>Bem-vindo ao Layza!</Text>
    </View>
    </LinearGradient>
  );
};

export default HomeScreen;