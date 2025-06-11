import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';
import {BackArrowMain }from '../components/BackArrow';
import { StackNavigationProp } from '@react-navigation/stack';

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
  const username = useSelector((state: any) => state.userProfile?.profile?.username || 'Usuário');

  const navigateToPlaceholder = (screen: keyof RootStackParamList) => {
    navigation.navigate(screen);
  };

  return (
      <View style={globalStyles.containerMain}>
        {/* <BackArrowMain navigation={navigation} /> */}
        <View style={globalStyles.header}>
          <Text style={globalStyles.subtitle}>Olá, {username}</Text>
          <Image source={require('../assets/images/avatar.png')} style={globalStyles.avatar} />
        </View>
        <View style={globalStyles.content}>
          <TextInput
            style={globalStyles.searchInput}
            placeholder="Pesquise"
            placeholderTextColor="#757575"
          />
          <TouchableOpacity style={globalStyles.button} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>Explorar</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#2F80ED' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>Estudar para o ENEM</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#34C759' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>Português</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.button, { backgroundColor: '#34C759' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>Ciências</Text>
          </TouchableOpacity>
          <Text style={globalStyles.subtitle}>Em qual ensino médio você está?</Text>
          <TouchableOpacity style={[globalStyles.optionButton, { backgroundColor: '#87CEEB' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>1ª série</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.optionButton, { backgroundColor: '#87CEEB' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>2ª série</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[globalStyles.optionButton, { backgroundColor: '#87CEEB' }]} onPress={() => navigateToPlaceholder('Placeholder')}>
            <Text style={globalStyles.buttonText}>3ª série</Text>
          </TouchableOpacity>
        </View>
        <View style={globalStyles.bottomNav}>
          <TouchableOpacity onPress={() => navigateToPlaceholder('Home')}>
            <Icon name="home" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToPlaceholder('Placeholder')}>
            <Icon name="search" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToPlaceholder('Placeholder')}>
            <Icon name="favorite" size={30} color="#FFF" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateToPlaceholder('Placeholder')}>
            <Icon name="person" size={30} color="#FFF" />
          </TouchableOpacity>
        </View>
      </View>
  );
};

export default HomeScreen;