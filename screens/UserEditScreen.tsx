import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/UserProfileSlice';
import { APILayzaPerfil } from '../services/Api';
import globalStyles from '../styles/globalStyles';
import Icon from 'react-native-vector-icons/MaterialIcons';
import BottomNav from '../components/BottomNav';

export default function UserEditScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ username: '', email: '', serie_atual: '', pref_visual: false, pref_auditivo: false, pref_leitura_escrita: false });

  useEffect(() => {
    APILayzaPerfil.getPerfil()
      .then(res => {
        setProfile(res.data);
        setForm({
          username: res.data.username || '',
          email: res.data.email || '',
          serie_atual: res.data.serie_atual || '',
          pref_visual: !!res.data.pref_visual,
          pref_auditivo: !!res.data.pref_auditivo,
          pref_leitura_escrita: !!res.data.pref_leitura_escrita,
        });
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar o perfil'))
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (field: string, value: any) => {
    setForm({ ...form, [field]: value });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Envia como FormData para compatibilidade com o backend (igual UserScreen)
      const formData = new FormData();
      formData.append('username', form.username ?? '');
      formData.append('email', form.email ?? '');
      formData.append('serie_atual', form.serie_atual ?? '');
      formData.append('pref_visual', String(form.pref_visual ?? ''));
      formData.append('pref_auditivo', String(form.pref_auditivo ?? ''));
      formData.append('pref_leitura_escrita', String(form.pref_leitura_escrita ?? ''));
      const updated = await APILayzaPerfil.updatePerfil(formData);
      dispatch(setUserProfile(updated));
      Alert.alert('Sucesso', 'Perfil atualizado!');
      navigation.goBack();
    } catch (e: any) {
      Alert.alert('Erro', e.message || 'Não foi possível atualizar o perfil');
    }
    setSaving(false);
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2F80ED" />;

  return (
    <View style={{ flex: 1, backgroundColor: '#F7F7F7' }}>
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }} onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={36} color="#2F80ED" />
        </TouchableOpacity>
        <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', alignItems: 'center', minHeight: 400, width: '100%' }}>
          <View style={styles.cardContainer}>
            <Text style={{ color: '#2F80ED', fontSize: 24, fontWeight: 'bold', marginBottom: 16, alignSelf: 'center' }}>Editar Perfil</Text>
            <Text style={styles.sectionTitle}>Informações pessoais</Text>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nome do usuário</Text>
              <TextInput
                style={styles.input}
                value={form.username}
                onChangeText={t => handleChange('username', t)}
                placeholder="Nome"
                placeholderTextColor="#2F80ED"
              />
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Série</Text>
              <View style={{ flex: 1, marginLeft: 8 }}>
                {["1º Ano", "2º Ano", "3º Ano"].map((serie) => (
                  <TouchableOpacity
                    key={serie}
                    style={[
                      styles.serieOption,
                      form.serie_atual === serie && styles.serieOptionActive
                    ]}
                    onPress={() => handleChange('serie_atual', serie)}
                  >
                    <Text style={{ color: form.serie_atual === serie ? '#2F80ED' : '#2F80ED99', fontWeight: 'bold' }}>{serie}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={[styles.infoRow, { justifyContent: 'space-between' }]}> 
              <TouchableOpacity style={[styles.prefButton, form.pref_visual && styles.prefButtonActive]} onPress={() => handleChange('pref_visual', !form.pref_visual)}>
                <Text style={[styles.prefButtonText, { color: '#2F80ED' }]}>Visual</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.prefButton, form.pref_auditivo && styles.prefButtonActive]} onPress={() => handleChange('pref_auditivo', !form.pref_auditivo)}>
                <Text style={[styles.prefButtonText, { color: '#2F80ED' }]}>Auditivo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.prefButton, form.pref_leitura_escrita && styles.prefButtonActive]} onPress={() => handleChange('pref_leitura_escrita', !form.pref_leitura_escrita)}>
                <Text style={[styles.prefButtonText, { color: '#2F80ED' }]}>Leitura/Escrita</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
              <Text style={styles.saveButtonText}>{saving ? 'Salvando...' : 'Salvar'}</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    padding: 20,
    marginBottom: 20,
    alignItems: 'stretch',
    width: '92%',
    maxWidth: '100%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
  },
  serieOption: {
    backgroundColor: '#EAF3FB',
    borderRadius: 8,
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: '#D6E6F7',
    alignItems: 'center',
    justifyContent: 'center',
    opacity: 0.7,
  },
  serieOptionActive: {
    borderColor: '#2F80ED',
    borderWidth: 2,
    opacity: 1,
  },
  sectionTitle: {
    color: '#2F80ED',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 10,
    marginTop: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAF3FB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    marginBottom: 10,
    marginTop: 0,
    borderWidth: 1,
    borderColor: '#D6E6F7',
  },
  infoLabel: {
    color: '#2F80ED',
    fontSize: 15,
    fontWeight: '500',
    flex: 1,
  },
  input: {
    backgroundColor: '#EAF3FB',
    borderRadius: 8,
    padding: 8,
    color: '#2F80ED',
    fontSize: 15,
    flex: 1,
    borderWidth: 1,
    borderColor: '#D6E6F7',
    marginLeft: 8,
  },
  prefButton: {
    backgroundColor: '#EAF3FB',
    borderRadius: 12,
    paddingVertical: 8,
    paddingHorizontal: 14,
    marginHorizontal: 2,
    opacity: 0.5,
    borderWidth: 1,
    borderColor: '#D6E6F7',
  },
  prefButtonActive: {
    opacity: 1,
    borderWidth: 2,
    borderColor: '#2F80ED',
  },
  prefButtonText: {
    color: '#2F80ED',
    fontWeight: 'bold',
    fontSize: 14,
  },
  saveButton: {
    backgroundColor: '#2F80ED',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 40,
    marginTop: 18,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center',
  },
});
