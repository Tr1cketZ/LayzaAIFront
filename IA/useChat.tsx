import { useState, useEffect, useRef } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

type Message = {
    sender: "user" | "bot";
    content: string;
    imageUri?: string;
};

type Subject = {
    name: string;
    color: string;
};

const subjects: Subject[] = [
    { name: "Matemática", color: "#FFCDCD" },
    { name: "Português", color: "#B2D0F9" },
    { name: "Ciências", color: "#E2FFC9" },
];

const STORAGE_KEY = 'layzaai_chat_histories';

type ChatHistories = {
    [subject: string]: Message[];
};

export default function useChat(externalSubject: Subject) {
    const [subject, setSubject] = useState<Subject>(externalSubject);
    const [histories, setHistories] = useState<ChatHistories>({});
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const prevSubject = useRef(subject.name);

    // Sincroniza subject com prop externa
    useEffect(() => {
        if (externalSubject.name !== subject.name) {
            setSubject(externalSubject);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [externalSubject.name]);

    // Carrega histórico do AsyncStorage ao iniciar
    useEffect(() => {
        (async () => {
            try {
                const stored = await AsyncStorage.getItem(STORAGE_KEY);
                const parsed: ChatHistories = stored ? JSON.parse(stored) : {};
                setHistories(parsed);
                setMessages(parsed[subject.name] || []);
            } catch {
                setHistories({});
                setMessages([]);
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Salva histórico da matéria anterior e carrega o novo ao trocar de matéria
    useEffect(() => {
        (async () => {
            if (prevSubject.current !== subject.name) {
                const updatedHistories = { ...histories, [prevSubject.current]: messages };
                setHistories(updatedHistories);
                await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedHistories));
                setMessages(updatedHistories[subject.name] || []);
                prevSubject.current = subject.name;
            }
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [subject.name]);

    // Sempre que messages mudar, salva o histórico da matéria atual
    useEffect(() => {
        (async () => {
            const newHistories = { ...histories, [subject.name]: messages };
            setHistories(newHistories);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistories));
        })();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [messages]);

    const getSubjectPrompt = (userQuestion: string, history: Message[]) => {
        const subjectPrompts: Record<string, { description: string; name: string }> = {
            "Português": {
                description: "Português do ensino médio, incluindo gramática, literatura, redação e interpretação de textos, conforme os conteúdos da Base Nacional Comum Curricular (BNCC)",
                name: "Português",
            },
            "Matemática": {
                description: "Matemática do ensino médio, incluindo álgebra, geometria, trigonometria, estatística e probabilidade, conforme os conteúdos da Base Nacional Comum Curricular (BNCC)",
                name: "Matemática",
            },
            "Ciências": {
                description: "Ciências do ensino médio, incluindo biologia, química e física, conforme os conteúdos da Base Nacional Comum Curricular (BNCC)",
                name: "Ciências",
            }
        };

        const current = subjectPrompts[subject.name] || subjectPrompts["Português"];

        const maxHistory = 5;
        const recentHistory = history.slice(-maxHistory);

        const formattedHistory = recentHistory.map(msg => {
            const prefix = msg.sender === "user" ? "Usuário: " : "Layza: ";
            const content = msg.sender === "user"
                ? msg.content.split("Agora, responda à seguinte pergunta: ")[1] || msg.content
                : msg.content;
            return `${prefix}${content}`;
        }).join("\n\n");

        return `Você é Layza, uma professora doce, gentil e altamente qualificada, especializada exclusivamente em ${current.description}. Sua função é responder apenas perguntas relacionadas a ${current.name} do ensino médio, seguindo rigorosamente os conteúdos da BNCC.

Instruções estritas:
1. Responda apenas perguntas diretamente relacionadas a ${current.name}. Qualquer pergunta fora desse escopo deve ser respondida com: "Desculpe-me, mas eu só posso ajudar com questões de ${current.name} do ensino médio. Para outros assuntos, recomendo consultar um professor especializado ou uma fonte confiável."
2. Se a pergunta abordar temas sensíveis, como saúde mental, violência, abuso, automutilação, bullying ou qualquer questão pessoal/emocional, responda exclusivamente com: "Sinto muito que você esteja passando por isso. Eu sou uma professora de ${current.name} e não posso ajudar com esse tipo de questão. Recomendo que você procure um profissional qualificado, como um psicólogo, ou entre em contato com o CVV (ligue 188) para apoio."
3. Mantenha um tom educativo, claro e respeitoso, sempre focada em ensinar e esclarecer dúvidas acadêmicas de ${current.name}.
4. Se a pergunta for vaga ou ambígua, peça esclarecimentos para garantir que a resposta esteja dentro do escopo de ${current.name}.

Histórico da conversa:
${formattedHistory}

Agora, responda à seguinte pergunta: ${userQuestion}`;
    };


    // Adapta o tipo Message para suportar imagem opcional
    const sendMessage = async (userQuestion: string, image?: { uri: string; base64?: string } | null) => {
        if (!userQuestion.trim() && !image) return;
        const newMessages: Message[] = [...messages, { sender: "user" as const, content: userQuestion, imageUri: image?.uri }];
        setMessages(newMessages);
        setLoading(true);

        // Monte o prompt com histórico
        const prompt = getSubjectPrompt(userQuestion, newMessages);

        let body;
        if (image && image.base64) {
            // Payload para imagem + texto
            body = JSON.stringify({
                contents: [{
                    parts: [
                        {
                            inline_data: {
                                mime_type: "image/jpeg",
                                data: image.base64,
                            }
                        },
                        { text: prompt }
                    ]
                }]
            });
        } else {
            // Payload só texto
            body = JSON.stringify({
                contents: [{
                    parts: [{ text: prompt }]
                }]
            });
        }

        try {
            const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyD5ERC6pnMAF293CpW6hkprXifPw7GbYOc", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body
            });

            const data = await response.json();
            let botResponseContent = '';
            if (data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0] && data.candidates[0].content.parts[0].text) {
                botResponseContent = data.candidates[0].content.parts[0].text;
            } else {
                botResponseContent = 'Desculpe, não consegui processar a resposta corretamente.';
            }
            setMessages((prev) => [...prev, { sender: "bot", content: botResponseContent }]);
        } catch (e) {
            setMessages((prev) => [...prev, { sender: "bot", content: "Erro ao responder." }]);
        }
        setLoading(false);
    };

    const clearChat = async () => {
        setMessages([]);
        const newHistories = { ...histories, [subject.name]: [] };
        setHistories(newHistories);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newHistories));
    };

    const changeSubject = (newSubject: Subject) => {
        setSubject(newSubject);
    };

    return {
        subject,
        setSubject: changeSubject,
        messages,
        sendMessage,
        loading,
        clearChat,
        subjects,
        histories,
    };
}