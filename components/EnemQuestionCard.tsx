// LayzaAIFront/components/EnemQuestionCard.tsx
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';

interface EnemQuestionCardProps {
  question: {
    index: number;
    discipline: string;
    context: string;
    files: string[];
    language?: string;
  };
  onPress: () => void;
}

const getResumo = (context: string | null) => {
  if (!context) return '';
  // Se for imagem, retorna vazio (imagem será exibida)
  if (context.startsWith('![](')) return '';
  // Senão, retorna as primeiras 120 letras do contexto
  return context.replace(/\n/g, ' ').slice(0, 120) + (context.length > 120 ? '...' : '');
};

export default function EnemQuestionCard({ question, onPress }: EnemQuestionCardProps) {
  const isImageContext = question.context && question.context.startsWith('![](') && question.files.length > 0;
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Text style={styles.number}>#{question.index}</Text>
        <Text style={styles.discipline}>{question.discipline}</Text>
        {question.language && (
          <Text style={styles.language}>  |  {question.language.charAt(0).toUpperCase() + question.language.slice(1)}</Text>
        )}
      </View>
      {isImageContext ? (
        <Image
          source={{ uri: question.files[0] }}
          style={styles.image}
          resizeMode="contain"
        />
      ) : (
        <Text style={styles.resumo}>{getResumo(question.context)}</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 14,
    marginBottom: 12,
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    shadowOffset: { width: 0, height: 1 },
  },
  number: { fontWeight: 'bold', fontSize: 16, marginRight: 12, color: '#2F80ED' },
  discipline: { fontSize: 15, color: '#444', fontWeight: '600' },
  language: { fontSize: 14, color: '#888', fontWeight: '500', marginLeft: 4 },
  resumo: { marginTop: 8, color: '#555', fontSize: 14 },
  image: { width: '100%', height: 100, borderRadius: 8, marginTop: 8, backgroundColor: '#eee' },
});