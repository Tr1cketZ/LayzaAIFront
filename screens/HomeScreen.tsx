import React from 'react';
import { View, Text } from 'react-native';
import globalStyles from '../styles/globalStyles';

const HomeScreen: React.FC = () => {
  return (
    <View style={globalStyles.container}>
      <Text style={globalStyles.title}>Bem-vindo ao Layza!</Text>
    </View>
  );
};

export default HomeScreen;