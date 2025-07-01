import { useState } from 'react';
import { useNavigation } from '@react-navigation/native';

const ChatLogic = () => {
  const navigation: any = useNavigation();
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  interface Subject {
    name: string;
    color: string;
  }
  const subjects: Subject[] = [
    { name: 'Matemática', color: '#FFCDCD' },
    { name: 'Português', color: '#B2D0F9' },
    { name: 'Ciências', color: '#E2FFC9' },
  ];

  const openSubjectSelector = () => {
    setIsModalVisible(true);
  };

  const selectSubject = (subject: Subject) => {
    setSelectedSubject(subject);
    setIsModalVisible(false);
    navigation.navigate("LayzaChat",{subject}); // Navigate to chat screen with selected subject
  };

  const closeModal = () => {
    setIsModalVisible(false);
  };

  return {
    selectedSubject,
    isModalVisible,
    subjects,
    openSubjectSelector,
    selectSubject,
    closeModal,
  };
};

export default ChatLogic;