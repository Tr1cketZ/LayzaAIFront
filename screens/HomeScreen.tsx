import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNav from '../components/BottomNav';
import { API_BASE_URL } from '../services/Api';
import Icon from 'react-native-vector-icons/MaterialIcons';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  Placeholder: undefined;
};

type HomeNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface Props {
  navigation: HomeNavigationProp;
}

const HomeScreen: React.FC<Props> = ({ navigation }) => {
  const userProfile = useSelector((state: any) => state.userProfile?.profile);
  const username = userProfile?.username || 'Estudante';
  const userPhoto = userProfile?.foto_perfil;

  const getPhoto = () => {
    if (userPhoto) {
      return { uri: `${API_BASE_URL}${userPhoto}` };
    }
    return require('../assets/images/avatar.png');
  };
  const navigateToPlaceholder = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };
  const getGreeting = () => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      return 'Bom dia';
    } else if (currentHour >= 12 && currentHour < 18) {
      return 'Boa tarde';
    } else {
      return 'Boa noite';
    }
  };

  return (
    <View style={globalStyles.containerMain}>
      <View style={globalStyles.header}>
        <View style={{ width: '80%' }}>
          <Text style={globalStyles.helloUser}>{getGreeting()}, {username}</Text>
        </View>
        {userProfile ? (
          <TouchableOpacity onPress={() => navigateToPlaceholder('Placeholder')}>
            <Image source={getPhoto()} style={globalStyles.avatarMain} />
          </TouchableOpacity>
        ) : (
          <View style={[globalStyles.avatarMain, { justifyContent: 'center', alignItems: 'center', backgroundColor: '#eee' }]}>
            <Icon name="person-outline" size={40} color="#888" />
          </View>
        )}
      </View>
      <View style={globalStyles.content}>
        <Text style={[globalStyles.text]}>Explorar</Text>
        <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#2F80ED' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
          <Text style={globalStyles.buttonText}>Estudar para o ENEM</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#34C759' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
          <Text style={globalStyles.buttonText}>Português</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#34C759' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
          <Text style={globalStyles.buttonText}>Ciências</Text>
        </TouchableOpacity>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
};

export default HomeScreen;