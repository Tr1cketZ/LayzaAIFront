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
import EsqueceuSenhaScreen from '../screens/EsqueceuSenhaScreen';
import PasswordResetConfirmScreen from '../screens/PasswordReserConfirmScreen';
import NewPasswordScreen from '../screens/NewPasswordScreen';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  PasswordResetConfirm: { email: string };
  NewPasswordScreen: { email: string; code: string };
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
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />
          <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
          <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;