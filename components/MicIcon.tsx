import React, { useState } from 'react';
import { TouchableOpacity, StyleSheet, Platform, Modal, View } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

interface MicIconProps {
  onTranscribe?: (text: string) => void;
}

const speechHtml = `
  <!DOCTYPE html>
  <html>
  <body>
    <button id="start">Falar</button>
    <script>
      const btn = document.getElementById('start');
      let recognition;
      btn.onclick = () => {
        if (!('webkitSpeechRecognition' in window)) {
          window.ReactNativeWebView.postMessage('ERRO: SpeechRecognition não suportado');
          return;
        }
        recognition = new webkitSpeechRecognition();
        recognition.lang = 'pt-BR';
        recognition.onresult = function(event) {
          const text = event.results[0][0].transcript;
          window.ReactNativeWebView.postMessage(text);
        };
        recognition.onerror = function(e) {
          window.ReactNativeWebView.postMessage('ERRO: ' + e.error);
        };
        recognition.start();
      };
    </script>
  </body>
  </html>
`;

export default function MicIcon({ onTranscribe }: MicIconProps) {
  const [showWebView, setShowWebView] = useState(false);

  const handleMicPress = () => {
    if (Platform.OS === 'android') {
      setShowWebView(true);
    } else {
      alert('Speech-to-text só disponível no Android via WebView neste app.');
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7} style={styles.container}>
        <MaterialIcons name="mic" size={32} color={'#2F80ED'} />
      </TouchableOpacity>
      {Platform.OS === 'android' && (
        <Modal visible={showWebView} transparent animationType="slide">
          <View style={{ flex: 1, backgroundColor: '#0008', justifyContent: 'center' }}>
            <View style={{ height: 300, margin: 32, backgroundColor: '#fff', borderRadius: 16, overflow: 'hidden' }}>
              <WebView
                originWhitelist={['*']}
                source={{ html: speechHtml }}
                onMessage={event => {
                  const text = event.nativeEvent.data;
                  if (onTranscribe) onTranscribe(text);
                  setShowWebView(false);
                }}
              />
            </View>
          </View>
        </Modal>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
});