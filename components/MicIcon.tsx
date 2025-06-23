import React, { useState, useRef, useEffect } from 'react';
import { Animated, TouchableOpacity, StyleSheet, Easing } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Voice from '@react-native-community/voice';

interface MicIconProps {
  onTranscribe?: (text: string) => void;
}

export default function MicIcon({ onTranscribe }: MicIconProps) {
  const [recording, setRecording] = useState(false);
  const [pulse] = useState(new Animated.Value(1));
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    Voice.onSpeechResults = (e) => {
      if (onTranscribe && e.value && e.value[0]) {
        onTranscribe(e.value[0]);
      }
    };
    Voice.onSpeechEnd = () => {
      setRecording(false);
    };
    return () => {
      isMounted.current = false;
      Voice.destroy().then(Voice.removeAllListeners);
    };
  }, []);

  useEffect(() => {
    if (recording) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulse, {
            toValue: 1.2,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
          Animated.timing(pulse, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
            easing: Easing.inOut(Easing.ease),
          }),
        ])
      ).start();
    } else {
      pulse.setValue(1);
    }
  }, [recording]);

  const handleMicPress = async () => {
    console.log('Mic pressed, recording:', recording);
    if (recording) {
      setRecording(false);
      await Voice.stop();
    } else {
      setRecording(true);
      try {
        await Voice.start('pt-BR');
      } catch (e) {
        console.error('Voice start error:', e);
        setRecording(false);
      }
    }
  };

  return (
    <TouchableOpacity onPress={handleMicPress} activeOpacity={0.7} style={styles.container}>
      <Animated.View
        style={[
          styles.pulse,
          recording && { transform: [{ scale: pulse }], backgroundColor: '#ff5252' },
        ]}
      >
        <MaterialIcons name="mic" size={32} color={recording ? '#fff' : '#2F80ED'} />
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  pulse: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
});