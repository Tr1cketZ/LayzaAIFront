import React, { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity, Modal, Pressable } from 'react-native';
import axios from 'axios';
import { BackArrowMain } from '../components/BackArrow';
import BottomNav from '../components/BottomNav';
import AskLayzaButton from '../components/AskLayzaButton';

interface Alternative {
  letter: string;
  text: string;
  file: string | null;
  isCorrect: boolean;
}

interface Question {
  title: string;
  index: number;
  discipline: string;
  language: string | null;
  year: number;
  context: string;
  files: string[];
  correctAlternative: string;
  alternativesIntroduction: string;
  alternatives: Alternative[];
}

const EnemQuestionDetailScreen = function ({ navigation, route }: any) {
  const { year, index } = route.params;
  const [question, setQuestion] = useState<Question | null>(null);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalImage, setModalImage] = useState<string | null>(null);
  const [selectedAlt, setSelectedAlt] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`https://api.enem.dev/v1/exams/${year}/questions/${index}`)
      .then(res => {
        setQuestion(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [year, index]);

  // Log para depuração
  useEffect(() => {
    if (question) {
      console.log('Questão carregada:', question.alternatives);
      if (typeof question.context !== 'string') {
        console.warn('question.context NÃO é string:', question.context);
      }
      if (!Array.isArray(question.alternatives)) {
        console.warn('question.alternatives NÃO é array:', question.alternatives);
      } else {
        question.alternatives.forEach((alt, idx) => {
          if (typeof alt.text !== 'string') {
            console.warn(`alt.text NÃO é string na alternativa ${idx}:`, alt.text);
          }
        });
      }
    }
  }, [question]);

  // Defina as cores para cada disciplina conforme ChatLogic
  const disciplineColors: Record<string, string> = {
    'matematica': '#FFCDCD',
    'linguagens': '#B2D0F9',
    'ciencias-humanas': '#B2D0F9',
    'ciencias-natureza': '#E2FFC9',
  };
  const headerColor = question ? (disciplineColors[question.discipline.toLowerCase()] || '#2F80ED') : '#2F80ED';

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2F80ED" />
        <Text style={{ marginTop: 10 }}>Carregando questão...</Text>
      </View>
    );
  }

  if (!question) {
    return (
      <View style={styles.center}>
        <Text>Questão não encontrada.</Text>
      </View>
    );
  }

  function renderContextWithImages(context: string) {
    if (!context) return null;
    const regex = /!\[]\((.*?)\)/g;
    const parts: (string | { image: string })[] = [];
    let lastIndex = 0;
    let match;
    while ((match = regex.exec(context)) !== null) {
      if (match.index > lastIndex) {
        parts.push(context.slice(lastIndex, match.index));
      }
      parts.push({ image: match[1] });
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < context.length) {
      parts.push(context.slice(lastIndex));
    }
    return parts.map((part, idx) => {
      if (typeof part === 'string') {
        return <Text key={idx} style={styles.context}>{part.trim()}</Text>;
      } else {
        return <Image key={idx} source={{ uri: part.image }} style={{ width: '100%', height: 140, borderRadius: 8, marginVertical: 8, backgroundColor: '#eee' }} resizeMode="contain" />;
      }
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor: '#f7f7f7',paddingBottom: 60 }}>
      <View style={[styles.header, { backgroundColor: headerColor }]}>
        <BackArrowMain navigation={navigation} color="#000" />
        <Text style={styles.headerText}>Questão {question.index} - {question.discipline?.toUpperCase()|| ''}</Text>
      </View>
      <ScrollView contentContainerStyle={{ padding: 18 }}>
        <AskLayzaButton discipline={question.discipline} navigation={navigation} question={question} />
        <Text style={styles.title}>{question.title}</Text>
        {question.files && question.files.length > 0 && (
          <ScrollView horizontal style={{ marginVertical: 8 }}>
            {question.files.map((file, idx) => (
              <Pressable key={idx} onPress={() => { setModalImage(file); setModalVisible(true); }}>
                <Image
                  source={{ uri: file }}
                  style={{ width: 260, height: 150, marginRight: 10, borderRadius: 8, backgroundColor: '#eee' }}
                  resizeMode="contain"
                />
              </Pressable>
            ))}
          </ScrollView>
        )}
        {/* Sempre mostra o contexto, mesmo se houver imagem */}
        <View style={{ marginBottom: 8 }}>{renderContextWithImages(typeof question.context === 'string' ? question.context : '')}</View>
        <Text style={styles.altIntro}>{question.alternativesIntroduction}</Text>
        {Array.isArray(question.alternatives) && question.alternatives.length > 0 ? (
          question.alternatives.map((alt, idx) => {
            const isSelected = selectedAlt === alt.letter;
            const feedbackStyle = isSelected
              ? alt.isCorrect
                ? styles.altCorrect
                : styles.altWrong
              : undefined;
            return (
              <TouchableOpacity
                key={alt.letter}
                style={[styles.alt, feedbackStyle]}
                activeOpacity={0.8}
                onPress={() => setSelectedAlt(alt.letter)}
              >
                <Text>
                  <Text style={{ fontWeight: 'bold' }}>{alt.letter} </Text>
                  {typeof alt.text === 'string' ? alt.text : ''}
                </Text>
              </TouchableOpacity>
            );
          })
        ) : (
          <Text style={{ color: '#888', fontStyle: 'italic', marginBottom: 8 }}>Nenhuma alternativa disponível.</Text>
        )}
      </ScrollView>
      {/* Modal de imagem ampliada */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <Pressable
          style={{ flex: 1, backgroundColor: '#000c', justifyContent: 'center', alignItems: 'center' }}
          onPress={() => setModalVisible(false)}
        >
          <View style={{ position: 'absolute', top: 40, right: 20, zIndex: 2 }}>
            <Pressable onPress={() => setModalVisible(false)} style={{ backgroundColor: '#fff', borderRadius: 20, width: 40, height: 40, justifyContent: 'center', alignItems: 'center', elevation: 3 }}>
              <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#2F80ED' }}>X</Text>
            </Pressable>
          </View>
          {modalImage && (
            <Image
              source={{ uri: modalImage }}
              style={{ width: '90%', height: '60%', borderRadius: 12, backgroundColor: '#fff' }}
              resizeMode="contain"
            />
          )}
        </Pressable>
      </Modal>
      <BottomNav navigation={navigation} />
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    paddingTop: 48,
    paddingBottom: 20,
    alignItems: 'center',
    marginBottom: 8,
    borderBottomLeftRadius: 16,
    borderBottomRightRadius: 16,
    elevation: 2,
    flexDirection: 'row',
    justifyContent: 'center', // alterado para centralizar
  },
  headerText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 0, // removido o marginLeft
    flexShrink: 1,
    textAlign: 'center', // garante centralização
  },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
  context: { marginBottom: 8, color: '#444' },
  altIntro: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#2F80ED',
    marginBottom: 8,
    marginTop: 8,
    textAlign: 'left',
  },
  alt: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#f4f4f4',
    borderRadius: 8,
    padding: 12,
    marginBottom: 10,
    borderColor: '#bbb',
    borderWidth: 1,
    elevation: 2, // sombra Android
    shadowColor: '#000', // sombra iOS
    shadowOpacity: 0.10,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    // Para web (opcional):
    // cursor: 'pointer',
  },
  altCorrect: {
    backgroundColor: '#d4edda',
    borderColor: '#27ae60',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#27ae60',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
  altWrong: {
    backgroundColor: '#ffd6d6',
    borderColor: '#e74c3c',
    borderWidth: 2,
    elevation: 3,
    shadowColor: '#e74c3c',
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
  },
});

export default EnemQuestionDetailScreen;