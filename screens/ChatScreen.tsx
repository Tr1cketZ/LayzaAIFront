import React, { useState, useRef, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform, FlatList, ActivityIndicator, Image } from "react-native";
import BottomNav from "../components/BottomNav";
import useChat from "../IA/useChat";
import { useSelector } from "react-redux";
import { API_BASE_URL } from "../services/Api";
import { renderMarkdownToRN } from '../utils/RenderMarkDown';
import MicIcon from '../components/MicIcon';

export default function ChatScreen({ navigation, route }: { navigation: any, route: any }) {
    const subject = route.params?.subject || { name: "Matéria", color: "#fff" };
    const [input, setInput] = useState("");
    const { messages, sendMessage, loading, clearChat } = useChat(subject);
    const flatListRef = useRef<FlatList>(null);
    const userProfile = useSelector((state: any) => state.userProfile?.profile);
    const userPhoto = userProfile?.foto_perfil;
    const chatPhoto = ({ item }: { item: { sender: string; content: string } }) => {
        if (userPhoto) {
            return <Image 
                source={item.sender === "user" ? { uri: `${API_BASE_URL}${userPhoto}` } : require("../assets/images/avatar.png")}
                style={[styles.avatar, { alignSelf: item.sender === "user" ? "flex-end" : "flex-start" }]}
            />
        }
        return <Image
            source={item.sender === "user" ? require("../assets/images/studentIcon.png") : require("../assets/images/avatar.png")}
            style={[styles.avatar, { alignSelf: item.sender === "user" ? "flex-end" : "flex-start" }]}
        />
    }

    const handleSend = () => {
        if (input.trim()) {
            sendMessage(input);
            setInput("");
        }
    };

    const renderMessage = ({ item }: { item: { sender: string; content: string } }) => (
        <View>
            {chatPhoto({ item })}
            <View style={[styles.message, item.sender === "user" ? styles.userMessage : styles.botMessage]}>
                {item.sender === "bot"
                    ? renderMarkdownToRN(item.content)
                    : <Text style={{ color: "#fff" }}>{item.content}</Text>
                }
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
                    <TouchableOpacity style={styles.sendButton} onPress={handleSend} disabled={loading || !input.trim()}>
                        <Text style={{ color: "#fff", fontWeight: "bold" }}>Enviar</Text>
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
        paddingBottom: 60
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
});