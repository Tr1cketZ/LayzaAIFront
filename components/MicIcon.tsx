import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator, View, Text } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';
import axios from 'axios';

interface MicIconProps {
  onTranscribe?: (text: string) => void;
}

export default function MicIcon({ onTranscribe }: MicIconProps) {
  const [recording, setRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [audioUri, setAudioUri] = useState<string | null>(null);
  const [audioRecording, setAudioRecording] = useState<Audio.Recording | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [statusMsg, setStatusMsg] = useState<string | null>(null);

  const handleMicPress = async () => {
    setError(null);
    if (!recording) {
      // Iniciar gravação
      try {
        setStatusMsg('Aguardando permissão...');
        const perm = await Audio.requestPermissionsAsync();
        if (!perm.granted) {
          setError('Permissão de microfone negada.');
          setStatusMsg(null);
          return;
        }
        setStatusMsg('Gravando...');
        await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
        const { recording } = await Audio.Recording.createAsync(
          Audio.RecordingOptionsPresets.HIGH_QUALITY
        );
        setAudioRecording(recording);
        setRecording(true);
        setStatusMsg(null);
      } catch (e) {
        setRecording(false);
        setError('Erro ao iniciar gravação.');
        setStatusMsg(null);
      }
    } else {
      // Parar gravação e enviar
      setRecording(false);
      setLoading(true);
      setStatusMsg('Enviando áudio...');
      try {
        await audioRecording?.stopAndUnloadAsync();
        const uri = audioRecording?.getURI();
        setAudioUri(uri || null);
        if (uri) {
          setStatusMsg('Transcrevendo...');
          const transcript = await transcribeAudio(uri);
          if (transcript) {
            if (onTranscribe) onTranscribe(transcript);
          } else {
            setError('Falha ao transcrever o áudio.');
          }
        }
      } catch (e) {
        setError('Erro ao processar o áudio.');
      }
      setLoading(false);
      setStatusMsg(null);
    }
  };

  // Função para upload e transcrição via Gemini
  const transcribeAudio = async (uri: string): Promise<string> => {
    try {
      // 1. Upload resumable
      const fileInfo = await FileSystem.getInfoAsync(uri);
      if (!fileInfo.exists) {
        setError('Arquivo de áudio não encontrado.');
        return '';
      }
      const fileSize = typeof fileInfo.size === 'number' ? fileInfo.size : 0;
      const mimeType = 'audio/m4a';
      const GEMINI_API_KEY = 'AIzaSyD5ERC6pnMAF293CpW6hkprXifPw7GbYOc';
      const displayName = 'audio.m4a';
      // Inicia upload
      const startRes = await axios.post(
        'https://generativelanguage.googleapis.com/upload/v1beta/files',
        { file: { display_name: displayName } },
        {
          headers: {
            'x-goog-api-key': GEMINI_API_KEY,
            'X-Goog-Upload-Protocol': 'resumable',
            'X-Goog-Upload-Command': 'start',
            'X-Goog-Upload-Header-Content-Length': fileSize,
            'X-Goog-Upload-Header-Content-Type': mimeType,
            'Content-Type': 'application/json',
          },
          maxRedirects: 0,
          validateStatus: status => status < 400 || status === 308,
        }
      );
      const uploadUrl = startRes.headers['x-goog-upload-url'];
      // 2. Upload dos bytes binários usando FileSystem.uploadAsync
      const uploadRes = await FileSystem.uploadAsync(uploadUrl, uri, {
        httpMethod: 'POST',
        uploadType: FileSystem.FileSystemUploadType.BINARY_CONTENT,
        headers: {
          'Content-Length': fileSize.toString(),
          'X-Goog-Upload-Offset': '0',
          'X-Goog-Upload-Command': 'upload, finalize',
          'Content-Type': mimeType,
        },
      });
      // 3. Buscar file_uri diretamente do uploadRes.body
      let fileUri = '';
      try {
        const uploadBody = JSON.parse(uploadRes.body);
        fileUri = uploadBody.file?.uri;
      } catch (err) {
        setError('Erro ao ler resposta do upload.');
        return '';
      }
      if (!fileUri) {
        setError('Upload falhou: fileUri não retornado.');
        return '';
      }
      // 4. Requisição de transcrição
      const prompt = 'transcreva o conteudo do audio em seu idioma original, OBS: RESPONDA APENAS COM O CONTEUDO DO AUDIO NADA MAIS';
      const geminiRes = await axios.post(
        'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent',
        {
          contents: [{
            parts: [
              { text: prompt },
              { file_data: { mime_type: mimeType, file_uri: fileUri } }
            ]
          }]
        },
        {
          headers: {
            'x-goog-api-key': GEMINI_API_KEY,
            'Content-Type': 'application/json',
          },
        }
      );
      // Extrai texto
      const candidates = geminiRes.data.candidates || [];
      const text = candidates[0]?.content?.parts?.[0]?.text || '';
      if (!text) {
        setError('Transcrição vazia.');
      }
      return text;
    } catch (e: any) {
      setError('Erro ao enviar ou transcrever o áudio: ' + (e?.response?.data?.error?.message || e.message || 'Erro desconhecido'));
      return '';
    }
  };

  return (
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7} style={styles.container} disabled={loading}>
        {loading ? (
          <View style={styles.loadingCircle}>
            <ActivityIndicator size={20} color="#2F80ED" />
          </View>
        ) : recording ? (
          <View style={styles.recordingCircle}>
            <View style={styles.stopSquare} />
          </View>
        ) : (
          <MaterialIcons name="mic" size={32} color={'#2F80ED'} />
        )}
      </TouchableOpacity>
      {error && (
        <Text style={{ color: 'red', fontSize: 12, marginLeft: 8, maxWidth: 120 }}>{error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  recordingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#E53935',
    justifyContent: 'center',
    alignItems: 'center',
  },
  stopSquare: {
    width: 16,
    height: 16,
    backgroundColor: '#E53935',
    borderRadius: 3,
  },
  loadingCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 3,
    borderColor: '#2F80ED',
    justifyContent: 'center',
    alignItems: 'center',
  },
});