import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

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

interface AskLayzaButtonProps {
  discipline: string;
  navigation: any;
  question: Question;
}

const disciplineToSubject = (discipline: string) => {
  const d = discipline.toLowerCase();
  if (d === 'matematica') return { name: 'Matemática', color: '#FFCDCD' };
  if (d === 'ciencias-natureza') return { name: 'Ciências', color: '#E2FFC9' };
  // linguagens e ciencias-humanas vão para português
  return { name: 'Português', color: '#B2D0F9' };
};

function buildPrompt(question: Question): string {
  let prompt = `Questão do ENEM ${question.year}\n`;
  if (question.files && question.files.length > 0) {
    prompt += `Imagem: ${question.files[0]}\n`;
  }
  prompt += `Enunciado: ${question.title}\n`;
  if (question.context) prompt += `Contexto: ${question.context}\n`;
  prompt += `\n${question.alternativesIntroduction}\n`;
  question.alternatives.forEach(alt => {
    prompt += `${alt.letter}) ${alt.text}\n`;
  });
  prompt += `\nAlternativa correta: ${question.correctAlternative}\n`;
  prompt += `\nExplique por que essa alternativa é a correta e por que as outras não são.`;
  return prompt;
}

const AskLayzaButton: React.FC<AskLayzaButtonProps> = ({ discipline, navigation, question }) => {
  const subject = disciplineToSubject(discipline);
  const prompt = buildPrompt(question);
  return (
    <TouchableOpacity
      style={styles.button}
      onPress={() => navigation.navigate('LayzaChat', { subject, initialPrompt: prompt })}
      activeOpacity={0.85}
    >
      <MaterialIcons name="smart-toy" size={22} color="#fff" style={{ marginRight: 8 }} />
      <Text style={styles.text}>Perguntar para a Layza</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#2F80ED',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 18,
    marginVertical: 12,
    alignSelf: 'center',
    elevation: 2,
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default AskLayzaButton;
