import React from 'react';
import { View, Text } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../styles/globalStyles';
import BottomNav from '../components/BottomNav';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  Placeholder: undefined;
};

type PlaceholderNavigationProp = StackNavigationProp<RootStackParamList, 'Placeholder'>;

interface Props {
  navigation: PlaceholderNavigationProp;
}

const PlaceholderScreen: React.FC<Props> = ({ navigation }) => {
  return (
    <LinearGradient
      colors={['#0172B2', '#001645']}
      start={{ x: 0, y: 0 }}
      end={{ x: 0, y: 1 }}
      style={globalStyles.container}
    >
      <View style={globalStyles.container}>
        <Text style={globalStyles.title}>Placeholder Screen</Text>
      </View>
      <BottomNav navigation={navigation} />
    </LinearGradient>
  );
};

export default PlaceholderScreen;