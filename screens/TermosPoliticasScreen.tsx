import React from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import globalStyles from '../styles/globalStyles';

export default function TermosPoliticasScreen() {
  const navigation = useNavigation();
  return (
    <View style={globalStyles.containerMain}>
      <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={36} color="#2F80ED" />
      </TouchableOpacity>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={[styles.title, { color: '#2F80ED' }]}>Termos de Uso e Política de Privacidade</Text>
        <Text style={[styles.text, { color: '#2F80ED' }]}>Bem-vindo ao Layza!{"\n\n"}Ao utilizar nosso aplicativo, você concorda com os seguintes termos:{"\n\n"}1. Suas informações pessoais são utilizadas apenas para personalizar sua experiência de aprendizado e nunca serão compartilhadas com terceiros sem seu consentimento.{"\n\n"}2. Você pode editar ou excluir seus dados a qualquer momento nas configurações do perfil.{"\n\n"}3. O Layza utiliza cookies e tecnologias similares para melhorar a navegação e oferecer conteúdos relevantes.{"\n\n"}4. O uso do aplicativo é destinado exclusivamente para fins educacionais. Não é permitido o uso para atividades ilícitas ou que violem direitos de terceiros.{"\n\n"}5. Reservamo-nos o direito de atualizar estes termos e políticas. Notificações serão enviadas em caso de alterações relevantes.{"\n\n"}Para mais informações, entre em contato pelo suporte do aplicativo.{"\n\n"}Obrigado por confiar no Layza!</Text>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#757575',
    marginBottom: 18,
    textAlign: 'center',
  },
  text: {
    fontSize: 16,
    color: '#333',
    lineHeight: 24,
    textAlign: 'justify',
  },
});
