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
import PlaceholderScreen from '../screens/PlaceHolderScreen';
import ChatScreen from '../screens/ChatScreen';
import EnemScreen from '../screens/EnemScreen'; 
import EnemQuestionDetailScreen from '../screens/EnemQuestionDetailsScreen';
import CalendarScreen from '../screens/CalendarScreen';

type RootStackParamList = {
  Loading: undefined;
  Login: undefined;
  LoginForm: undefined;
  CriarConta: undefined;
  Home: undefined;
  EsqueceuSenha: undefined;
  PasswordResetConfirm: { email: string };
  NewPasswordScreen: { email: string; code: string };
  Placeholder: undefined;
  LayzaChat: { subject: { name: string; color: string } };
  EnemScreen: { year: number };
  EnemQuestionDetail: { questionId: string };
  Calendar: undefined;
  UserScreen: undefined;
  UserEditScreen: undefined;
  TermosPoliticasScreen: undefined;
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
          <Stack.Screen name="EsqueceuSenha" component={EsqueceuSenhaScreen} />
          <Stack.Screen name="PasswordResetConfirm" component={PasswordResetConfirmScreen} />
          <Stack.Screen name="NewPasswordScreen" component={NewPasswordScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Placeholder" component={PlaceholderScreen} />
          <Stack.Screen name="LayzaChat" component={ChatScreen} />
          <Stack.Screen name="EnemScreen" component={EnemScreen} />
          <Stack.Screen name="EnemQuestionDetail" component={EnemQuestionDetailScreen} />
          <Stack.Screen name="UserScreen" component={require('../screens/UserScreen').default} />
          <Stack.Screen name="UserEditScreen" component={require('../screens/UserEditScreen').default} />
          <Stack.Screen name="TermosPoliticasScreen" component={require('../screens/TermosPoliticasScreen').default} />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default AppNavigator;