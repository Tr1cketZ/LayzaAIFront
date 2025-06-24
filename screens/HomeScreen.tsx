import React from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from 'react-native';
import { useSelector } from 'react-redux';
import globalStyles from '../styles/globalStyles';
import { StackNavigationProp } from '@react-navigation/stack';
import BottomNav from '../components/BottomNav';
import { API_BASE_URL } from '../services/Api';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MenuButtom from '../components/MenuButtom';

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
    return require('../assets/images/studentIcon.png');
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
      <View style={[globalStyles.content, {marginTop: -5}]}>
        {/* Sessão ENEM - Scroll horizontal */}
        <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 8 }}>ENEM</Text>
        <View style={{ height: 80, marginBottom: 50,borderRadius: 16, overflow: 'hidden', }}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {Array.from({ length: 2023 - 2009 + 1 }, (_, i) => 2023 - i).map((year) => (
              <MenuButtom
                key={year}
                text={year.toString()}
                backgroundColor="#2F80ED"
                navigateTo="Placeholder"
                navigation={navigation}
                style={{ marginRight: 10, width: 70, height: 70 }}
              />
            ))}
          </ScrollView>
        </View>
        {/* Grid de funcionalidades */} 
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center', width: '48%', marginBottom: 18 }}>
            <MenuButtom
              iconName="calendar-today"
              backgroundColor="#27ae60"
              navigateTo="Placeholder"
              navigation={navigation}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 6, fontWeight: '500', fontSize: 25 }}>Calendário</Text>
          </View>
          <View style={{ alignItems: 'center', width: '48%', marginBottom: 18 }}>
            <MenuButtom
              iconName="ondemand-video"
              backgroundColor="#e67e22"
              navigateTo="Placeholder"
              navigation={navigation}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 6, fontWeight: '500', fontSize: 25 }}>Vídeos</Text>
          </View>
          <View style={{ alignItems: 'center', width: '48%', marginBottom: 18 }}>
            <MenuButtom
              iconName="audiotrack"
              backgroundColor="#9b59b6"
              navigateTo="Placeholder"
              navigation={navigation}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 6, fontWeight: '500', fontSize: 25 }}>Áudios</Text>
          </View>
          <View style={{ alignItems: 'center', width: '48%', marginBottom: 18 }}>
            <MenuButtom
              iconName="description"
              backgroundColor="#2980b9"
              navigateTo="Placeholder"
              navigation={navigation}
              style={{ width: 100, height: 100 }}
            />
            <Text style={{ marginTop: 6, fontWeight: '500', fontSize: 25 }}>Textos</Text>
          </View>
        </View>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
};

export default HomeScreen;