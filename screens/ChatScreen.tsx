import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Image } from "react-native";
import BottomNav from "../components/BottomNav";
import useChat from "../IA/useChat";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../services/Api";
import { renderMarkdownToRN } from '../utils/RenderMarkDown';
import MicIcon from '../components/MicIcon';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import ClipIcon from '../components/ClipIcon';

export default function ChatScreen({ navigation, route }: { navigation: any, route: any }) {
    const subject = route.params?.subject || { name: "Matéria", color: "#fff" };
    const [input, setInput] = useState(route.params?.initialPrompt || "");
    const [attachedImage, setAttachedImage] = useState<{ uri: string; base64?: string } | null>(null);
    const { messages, sendMessage, loading, clearChat } = useChat(subject);
    const flatListRef = useRef<FlatList>(null);
    const userProfile = useSelector((state: any) => state.userProfile?.profile);
    // Atualiza a foto do usuário sempre que mudar no Redux, forçando refresh com timestamp
    const getUserPhoto = () => {
        if (userProfile?.foto_perfil) {
            let url = userProfile.foto_perfil.startsWith('http')
                ? userProfile.foto_perfil
                : `${API_BASE_URL}${userProfile.foto_perfil}`;
            url += (url.includes('?') ? '&' : '?') + 't=' + (userProfile.updated_at || Date.now());
            return { uri: url };
        }
        return require("../assets/images/studentIcon.png");
    };
    const chatPhoto = ({ item }: { item: { sender: string; content: string } }) => {
        if (item.sender === "user") {
            return <Image
                source={getUserPhoto()}
                style={[styles.avatar, { alignSelf: "flex-end" }]}
            />
        }
        return <Image
            source={require("../assets/images/avatar.png")}
            style={[styles.avatar, { alignSelf: "flex-start" }]}
        />
    };

    const handleSend = () => {
        if (input.trim() || attachedImage) {
            sendMessage(input, attachedImage);
            setInput("");
            setAttachedImage(null);
        }
    };

    // Suporte a imagem enviada pelo usuário no chat
    const renderMessage = ({ item }: { item: { sender: string; content: string; imageUri?: string } }) => (
        <View>
            {chatPhoto({ item })}
            <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
                {item.sender === "bot"
                    ? renderMarkdownToRN(item.content)
                    : <Text style={{ color: "#fff" }}>{item.content}</Text>
                }
                {/* Exibe imagem enviada pelo usuário, se houver */}
                {item.sender === "user" && item.imageUri && (
                    <Image
                        source={{ uri: item.imageUri }}
                        style={{ width: 120, height: 120, borderRadius: 10, marginTop: 8 }}
                        resizeMode="cover"
                    />
                )}
            </View>
        </View>
    );

    useEffect(() => {
        if (flatListRef.current) {
            flatListRef.current.scrollToEnd({ animated: true });
        }
    }, [messages]);

    return (
        <View style={{ flex: 1, backgroundColor: subject.color }}>
            {/* Topo: Nome da matéria */}
            <View style={[styles.header, { backgroundColor: subject.color }]}>
                <Text style={styles.headerText}>{subject.name}</Text>
                <TouchableOpacity onPress={clearChat} style={{ position: 'absolute', right: 20, top: 55 }}>
                    <Text style={{ color: '#2F80ED', fontWeight: 'bold' }}>Limpar</Text>
                </TouchableOpacity>
            </View>

            {/* Área do chat (mensagens) */}
            <View style={styles.chatArea}>
                <FlatList
                    ref={flatListRef}
                    data={messages}
                    renderItem={renderMessage}
                    keyExtractor={(_, idx) => idx.toString()}
                    contentContainerStyle={{ paddingBottom: 10 }}
                />
                {loading && (
                    <View style={[styles.message, styles.botMessage, { flexDirection: 'row', alignItems: 'center' }]}>
                        <ActivityIndicator size="small" color="#2F80ED" style={{ marginRight: 8 }} />
                        <Text style={{ color: '#222' }}>Carregando...</Text>
                    </View>
                )}
            </View>

            {/* Input para digitar mensagem */}
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : undefined}
                keyboardVerticalOffset={80}
            >
                <View style={styles.inputContainer}>
                    {attachedImage && (
                        <View style={styles.attachmentPreview}>
                            <Image source={{ uri: attachedImage.uri }} style={styles.attachmentImage} />
                            <TouchableOpacity onPress={() => setAttachedImage(null)} style={styles.removeAttachment}>
                                <MaterialIcons name="close" size={18} color="#fff" />
                            </TouchableOpacity>
                        </View>
                    )}
                    <ClipIcon onImagePicked={setAttachedImage} />
                    <TextInput
                        style={styles.input}
                        placeholder="Digite sua mensagem..."
                        value={input}
                        onChangeText={setInput}
                        placeholderTextColor="#888"
                        onSubmitEditing={handleSend}
                        editable={!loading}
                    />
                    <MicIcon onTranscribe={setInput} />
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || (!input.trim() && !attachedImage)}>
                        <MaterialIcons name="send" size={24} color="#fff" />
                    </TouchableOpacity>
                </View>
            </KeyboardAvoidingView>

            {/* BottomNav fixo na parte de baixo */}
            <BottomNav navigation={navigation} />
        </View>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingTop: 50,
        paddingBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        elevation: 4,
    },
    headerText: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#222",
    },
    chatArea: {
        flex: 1,
        padding: 20,
    },
    message: {
        marginVertical: 6,
        padding: 12,
        borderRadius: 8,
        maxWidth: '85%',
        alignSelf: 'flex-start',
    },
    userMessage: {
        backgroundColor: "#2F80ED",
        alignSelf: 'flex-end',
    },
    botMessage: {
        backgroundColor: "#f0f0f0",
        alignSelf: 'flex-start',
    },
    avatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10,
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: "#eee",
        paddingBottom: 80
    },
    input: {
        flex: 1,
        fontSize: 16,
        paddingVertical: 8,
        color: "#222",
    },
    sendButton: {
        backgroundColor: "#2F80ED",
        paddingVertical: 10,
        paddingHorizontal: 18,
        borderRadius: 8,
        marginLeft: 8,
    },
    attachmentPreview: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 8,
        backgroundColor: '#eee',
        borderRadius: 8,
        padding: 2,
    },
    attachmentImage: {
        width: 36,
        height: 36,
        borderRadius: 6,
    },
    removeAttachment: {
        backgroundColor: '#2F80ED',
        borderRadius: 10,
        marginLeft: -10,
        padding: 2,
        zIndex: 1,
    },
});