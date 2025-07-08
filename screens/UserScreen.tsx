import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, ActivityIndicator, Alert, Platform } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';
import { setUserProfile } from '../redux/UserProfileSlice';
import { APILayzaPerfil, API_BASE_URL } from '../services/Api';
import globalStyles from '../styles/globalStyles';
import BottomNav from '../components/BottomNav';
import Icon from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import { PerfilUpdateRequest } from '../utils/Objects';


export default function UserScreen() {
  const navigation = useNavigation();
  const dispatch = useDispatch();
  const userProfile = useSelector((state: any) => state.userProfile?.profile);
  const [profile, setProfile] = useState<any>(userProfile);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);


  // Carrega perfil do backend só se não houver no Redux
  useEffect(() => {
    if (!userProfile) {
      APILayzaPerfil.getPerfil()
        .then(res => setProfile(res.data))
        .catch(() => Alert.alert('Erro', 'Não foi possível carregar o perfil'))
        .finally(() => setLoading(false));
    } else {
      setProfile(userProfile);
      setLoading(false);
    }
  }, [userProfile]);

  // Função para obter a foto do usuário (igual HomeScreen)
  const getPhoto = () => {
    if (profile?.foto_perfil) {
      // Garante URL absoluta e força refresh ao trocar (quebra cache)
      let url = profile.foto_perfil.startsWith('http')
        ? profile.foto_perfil
        : `${API_BASE_URL}${profile.foto_perfil}`;
      // Adiciona timestamp para forçar reload se a foto mudou
      url += (url.includes('?') ? '&' : '?') + 't=' + (profile.updated_at || Date.now());
      return { uri: url };
    }
    return require('../assets/images/studentIcon.png');
  };

  // Modal para escolher câmera ou galeria
  const handlePickImage = async (fromCamera: boolean) => {
    setModalVisible(false);
    let result;
    if (fromCamera) {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    } else {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.7,
      });
    }
    if (!result.canceled && result.assets && result.assets[0]) {
      setUploading(true);
      const formData = new FormData();
      // Adiciona todos os campos do perfil, se existirem, como string ou vazio
      formData.append('username', profile?.username ?? '');
      formData.append('email', profile?.email ?? '');
      formData.append('pref_visual', String(profile?.pref_visual ?? ''));
      formData.append('pref_auditivo', String(profile?.pref_auditivo ?? ''));
      formData.append('pref_leitura_escrita', String(profile?.pref_leitura_escrita ?? ''));
      formData.append('serie_atual', profile?.serie_atual ?? '');
      formData.append('foto_perfil', {
        uri: result.assets[0].uri,
        type: 'image/jpeg',
        name: 'profile.jpg',
      } as any);
      try {
        for (let pair of (formData as any)._parts ?? []) {
          console.log('FormData:', pair[0], pair[1]);
        }
        await APILayzaPerfil.updatePerfil(formData);
        const updated = await APILayzaPerfil.getPerfil();
        setProfile(updated.data);
        dispatch(setUserProfile(updated.data));
        Alert.alert('Sucesso', 'Foto atualizada!');
      } catch (e: any) {
        Alert.alert('Erro', e.message || 'Não foi possível atualizar a foto');
      }
      setUploading(false);
    }
  };

  if (loading) return <ActivityIndicator style={{ flex: 1 }} size="large" color="#2F80ED" />;

  return (
    <View style={[globalStyles.containerMain, { justifyContent: 'flex-start', paddingTop: 30, backgroundColor: '#F7F7F7' }]}> 
      <TouchableOpacity style={{ position: 'absolute', top: 40, left: 20, zIndex: 10 }} onPress={() => navigation.goBack()}>
        <Icon name="arrow-back" size={36} color="#2F80ED" />
      </TouchableOpacity>
      <View style={{ alignItems: 'center', marginTop: 10, marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setModalVisible(true)} disabled={uploading} style={styles.avatarWrapper}>
          <Image
            source={getPhoto()}
            style={styles.avatar}
          />
          {uploading && <ActivityIndicator style={styles.avatarLoader} color="#2F80ED" />}
        </TouchableOpacity>
        <Text style={[styles.configuracoes, { color: '#2F80ED' }]}>Configurações</Text>
      </View>
      {/* Modal para escolher câmera ou galeria */}
      {modalVisible && (
        <View style={{
          position: 'absolute',
          left: 0, right: 0, top: 0, bottom: 0,
          backgroundColor: 'rgba(0,0,0,0.2)',
          justifyContent: 'center', alignItems: 'center',
          zIndex: 1000,
        }}>
          <TouchableOpacity style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }} onPress={() => setModalVisible(false)} />
          <View style={{ backgroundColor: '#fff', borderRadius: 12, padding: 18, minWidth: 160, elevation: 5, zIndex: 2 }}>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={async () => {
                setModalVisible(false);
                setTimeout(() => handlePickImage(true), 200);
              }}
            >
              <Icon name="photo-camera" size={22} color="#2F80ED" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: '#2F80ED' }}>Câmera</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 10 }}
              onPress={async () => {
                setModalVisible(false);
                setTimeout(() => handlePickImage(false), 200);
              }}
            >
              <Icon name="photo-library" size={22} color="#2F80ED" />
              <Text style={{ marginLeft: 10, fontSize: 16, color: '#2F80ED' }}>Galeria</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
      <View style={styles.cardContainer}>
        <Text style={styles.sectionTitle}>Informações pessoais</Text>
        <TouchableOpacity style={styles.infoRow} activeOpacity={0.8}>
          <Text style={styles.infoLabel}>Nome do usuário</Text>
          <Text style={styles.infoValue}>{profile?.username}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow} activeOpacity={0.8}>
          <Text style={styles.infoLabel}>E-mail</Text>
          <Text style={styles.infoValue}>{profile?.email}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.infoRow} activeOpacity={0.8} onPress={() => navigation.navigate('UserEditScreen' as never)}>
          <Icon name="edit" size={20} color="#2F80ED" style={{ marginRight: 8 }} />
          <Text style={styles.infoLabel}>Editar perfil</Text>
        </TouchableOpacity>
        <Text style={styles.sectionTitle}>Sobre a Layza</Text>
        <TouchableOpacity style={styles.infoRow} activeOpacity={0.8} onPress={() => navigation.navigate('TermosPoliticasScreen' as never)}>
          <Icon name="description" size={20} color="#2F80ED" style={{ marginRight: 8 }} />
          <Text style={styles.infoLabel}>Termo de serviço e Política de privacidade</Text>
        </TouchableOpacity>
      </View>
      <BottomNav navigation={navigation} />
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrapper: {
    borderRadius: 100,
    borderWidth: 4,
    borderColor: '#2F80ED',
    padding: 4,
    backgroundColor: '#FFF',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
  },
  avatar: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: '#EEE',
  },
  avatarLoader: {
    position: 'absolute',
    top: 40,
    left: 40,
  },
  configuracoes: {
    marginTop: 10,
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#2F80ED',
  },
  cardContainer: {
    backgroundColor: '#FFF',
    borderRadius: 22,
    marginHorizontal: 10,
    padding: 20,
    marginBottom: 20,
    alignItems: 'stretch',
    width: '100%',
    maxWidth: 370,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 6,
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
  infoValue: {
    color: '#2F80ED',
    fontSize: 15,
    fontWeight: 'bold',
    textAlign: 'right',
    flex: 1,
  },
});
