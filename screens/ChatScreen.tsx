import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, KeyboardAvoidingView, Platform } from "react-native";
import BottomNav from "../components/BottomNav";

export default function ChatScreen({ navigation, route }: { navigation: any, route: any }) {
    const subject  = route.params?.subject || { name: "Matéria", color: "#fff" }; // Fallback caso subject não seja passado
    console.log("Selected Subject:", subject);
    const [input, setInput] = useState("");


    return (
        <View style={{ flex: 1, backgroundColor: subject.color }}>
            {/* Topo: Nome da matéria */}
            <View style={[styles.header, { backgroundColor: subject.color }]}>
                <Text style={styles.headerText}>{subject.name}</Text>
            </View>

            {/* Área do chat (mensagens) */}
            <View style={styles.chatArea}>
                {/* Aqui você pode renderizar as mensagens */}
                <Text style={{ color: "#333" }}>Aqui vão as mensagens do chat...</Text>
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
                    />
                    <TouchableOpacity style={styles.sendButton}>
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
        // Aqui você pode adicionar scroll se quiser
    },
    inputContainer: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#fff",
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderTopWidth: 1,
        borderColor: "#eee",
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