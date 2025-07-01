import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import { LinearGradient } from 'expo-linear-gradient';
import globalStyles from '../styles/globalStyles';
import BottomNav from '../components/BottomNav';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center', flex: 1 }]}>  
        <MaterialIcons name="build" size={70} color="#fff" style={{ marginBottom: 24 }} />
        <Text style={{ color: '#fff', fontSize: 28, fontWeight: 'bold', marginBottom: 12, textAlign: 'center' }}>Em desenvolvimento</Text>
        <Text style={{ color: '#fff', fontSize: 16, opacity: 0.8, marginBottom: 32, textAlign: 'center' }}>
          Esta funcionalidade está sendo construída. Em breve estará disponível!
        </Text>
        <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
          <MaterialIcons name="arrow-back" size={22} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.buttonText}>Voltar</Text>
        </TouchableOpacity>
      </View>
      <BottomNav navigation={navigation} />
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginTop: 12,
    alignSelf: 'center',
    elevation: 2,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default PlaceholderScreen;