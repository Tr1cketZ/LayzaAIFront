import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoadingScreen from '../screens/LoadingScreen';
import LoginScreen from '../screens/LoginScreen';
import LoginFormScreen from '../screens/LoginFormScreen';
import HomeScreen from '../screens/HomeScreen';
import CriarContaScreen from '../screens/CriarContaScreen';
import { Provider } from 'react-redux';
import { store } from '../redux';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

const AppNavigator: React.FC = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Loading" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Loading" component={LoadingScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="LoginForm" component={LoginFormScreen} />
          <Stack.Screen name="CriarConta" component={CriarContaScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="EsqueceuSenha" component={HomeScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;