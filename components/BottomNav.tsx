import { FlatList, Modal, Pressable, TouchableOpacity, View, Text, StyleSheet } from "react-native";
import globalStyles from "../styles/globalStyles";
import Icon from 'react-native-vector-icons/MaterialIcons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';
import ChatLogic from "../IA/ChatLogic";
import { useSelector } from "react-redux";

export default function BottomNav({ navigation }: { navigation: any }) {
  const {
    isModalVisible,
    subjects,
    openSubjectSelector,
    selectSubject,
    closeModal,
  } = ChatLogic();

  // Pega o usuário do Redux
  const userProfile = useSelector((state: any) => state.userProfile?.profile);

  const currentRoute = navigation.getState().routes[navigation.getState().index].name;
  const navigateTo = (screen: string) => {
    navigation.navigate(screen);
  };
  const isActive = (screen: string) => {
    return currentRoute === screen;
  };

  return (
    <View style={globalStyles.bottomNav}>
      <TouchableOpacity onPress={() => navigateTo('Home')}>
        <Icon2 name={isActive('Home') ? "home" : "home-outline"} size={30} color='#000' />
        { isActive('Home')&& <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
      <TouchableOpacity onPress={openSubjectSelector}>
        <Icon name={isActive('LayzaChat') ? "chat-bubble" : "chat-bubble-outline"} size={30} color='#000' />
        {isActive('LayzaChat') && <View style={globalStyles.activeIndicator} />}
      </TouchableOpacity>
      {/* Só mostra se o usuário existir */}
      {userProfile && (
        <>
          <TouchableOpacity onPress={() => navigateTo('Placeholder')}>
            <Icon name={isActive('Placeholder') ? "favorite" : "favorite-outline"} size={30} color='#000' />
            { isActive('Placeholder')&& <View style={globalStyles.activeIndicator} />}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigateTo('Placeholder')}>
            <Icon name={isActive('Placeholder') ? "person" : "person-outline"} size={30} color='#000' />
            { isActive('Placeholder')&& <View style={globalStyles.activeIndicator} />}
          </TouchableOpacity>
        </>
      )}
      <Modal
        transparent={true}
        visible={isModalVisible}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <Pressable style={styles.modalOverlay} onPress={closeModal}>
          <View style={styles.modalContent}>
            <FlatList
              data={subjects}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <Pressable
                  style={styles.modalItem}
                  onPress={() => selectSubject(item)}
                >
                  <Text style={styles.modalText}>{item.name}</Text>
                </Pressable>
              )}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#FFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '50%',
  },
  modalItem: {
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
  },
  modalText: {
    fontSize: 18,
    color: '#000',
    textAlign: 'center',
  },
});