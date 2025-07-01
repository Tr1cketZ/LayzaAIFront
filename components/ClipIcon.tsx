import React, { useState } from 'react';
import { TouchableOpacity, View, Modal, Text, StyleSheet } from 'react-native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';

interface ClipIconProps {
    onImagePicked: (image: { uri: string; base64?: string }) => void;
}

const ClipIcon: React.FC<ClipIconProps> = ({ onImagePicked }) => {
    const [modalVisible, setModalVisible] = useState(false);

    const pickImage = async (fromCamera: boolean) => {
        setModalVisible(false);
        let result;
        if (fromCamera) {
            result = await ImagePicker.launchCameraAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
        } else {
            result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, base64: true });
        }
        if (!result.canceled && result.assets && result.assets.length > 0) {
            const asset = result.assets[0];
            onImagePicked({ uri: asset.uri, base64: asset.base64 ?? undefined });
        }
    };

    return (
        <View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.iconButton}>
                <MaterialIcons name="attach-file" size={28} color="#2F80ED" />
            </TouchableOpacity>
            <Modal
                visible={modalVisible}
                transparent
                animationType="fade"
                onRequestClose={() => setModalVisible(false)}
            >
                <TouchableOpacity style={styles.modalOverlay} onPress={() => setModalVisible(false)}>
                    <View style={styles.modalContent}>
                        <TouchableOpacity style={styles.option} onPress={() => pickImage(true)}>
                            <MaterialIcons name="photo-camera" size={22} color="#2F80ED" />
                            <Text style={styles.optionText}>Câmera</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.option} onPress={() => pickImage(false)}>
                            <MaterialIcons name="photo-library" size={22} color="#2F80ED" />
                            <Text style={styles.optionText}>Galeria</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    iconButton: {
        paddingHorizontal: 6,
        paddingVertical: 4,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 18,
        minWidth: 160,
        elevation: 5,
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    optionText: {
        marginLeft: 10,
        fontSize: 16,
        color: '#2F80ED',
    },
});

export default ClipIcon;
