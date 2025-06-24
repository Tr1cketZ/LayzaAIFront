import React, { useRef, useState } from 'react';
import { TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { WebView } from 'react-native-webview';

interface MicIconProps {
  onTranscribe?: (text: string) => void;
}

const speechHtml = `
  <!DOCTYPE html>
  <html>
  <body>
    <script>
      let recognition;
      window.document.addEventListener('message', function(event) {
        if (event.data === 'START') {
          if (!('webkitSpeechRecognition' in window)) {
            window.ReactNativeWebView.postMessage('ERRO: SpeechRecognition não suportado');
            return;
          }
          recognition = new webkitSpeechRecognition();
          recognition.lang = 'pt-BR';
          recognition.onstart = function() {
            window.ReactNativeWebView.postMessage('REC_START');
          };
          recognition.onend = function() {
            window.ReactNativeWebView.postMessage('REC_END');
          };
          recognition.onresult = function(event) {
            const text = event.results[0][0].transcript;
            window.ReactNativeWebView.postMessage(text);
          };
          recognition.onerror = function(e) {
            window.ReactNativeWebView.postMessage('ERRO: ' + e.error);
          };
          recognition.start();
        }
      });
    </script>
  </body>
  </html>
`;

export default function MicIcon({ onTranscribe }: MicIconProps) {
  const webviewRef = useRef<any>(null);
  const [recording, setRecording] = useState(false);

  const handleMicPress = () => {
    webviewRef.current?.postMessage('START');
  };

  const handleWebViewMessage = (event: any) => {
    const text = event.nativeEvent.data;
    if (text === 'REC_START') setRecording(true);
    else if (text === 'REC_END') setRecording(false);
    else if (onTranscribe && !text.startsWith('ERRO')) {
      setRecording(false);
      onTranscribe(text);
    }
  };

  return (
    <>
      <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7} style={styles.container}>
        {recording ? (
          <ActivityIndicator size={32} color="#2F80ED" />
        ) : (
          <MaterialIcons name="mic" size={32} color={'#2F80ED'} />
        )}
      </TouchableOpacity>
      <WebView
        ref={webviewRef}
        originWhitelist={['*']}
        source={{ html: speechHtml }}
        onMessage={handleWebViewMessage}
        style={{ width: 0, height: 0, opacity: 0, position: 'absolute' }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: -250,
  },
});