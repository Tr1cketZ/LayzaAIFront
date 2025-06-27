import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, ActivityIndicator, StyleSheet, ScrollView, Image, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BackArrowMain } from '../components/BackArrow';
import EnemQuestionCard from '../components/EnemQuestionCard';
import BottomNav from '../components/BottomNav';

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
    language?: string;
    year: number;
    context: string;
    files: string[];
    correctAlternative: string;
    alternativesIntroduction: string;
    alternatives: Alternative[];
}

const EnemScreen = function ({ navigation, route }: any) {
    const year = route.params.year;
    const [questions, setQuestions] = useState<Question[]>([]);
    const [loading, setLoading] = useState(true);
    const [filteredDiscipline, setFilteredDiscipline] = useState<string | null>(null);

    useEffect(() => {
        let isMounted = true;
        setLoading(true);
        setQuestions([]);
        // Busca a primeira página para saber o total
        axios
            .get(`https://api.enem.dev/v1/exams/${year}/questions?limit=50&offset=1`)
            .then(async res => {
                if (!isMounted) return;
                const firstQuestions = res.data.questions || [];
                const total = res.data.metadata?.total || firstQuestions.length;
                const pages = Math.ceil(total / 50);
                const requests = [];
                for (let i = 2; i <= pages; i++) {
                    requests.push(
                        axios.get(`https://api.enem.dev/v1/exams/${year}/questions?limit=50&offset=${(i - 1) * 50 + 1}`)
                    );
                }
                const results = await Promise.all(requests);
                const allQuestions = [
                    ...firstQuestions,
                    ...results.flatMap(r => r.data.questions || [])
                ];
                setQuestions(allQuestions);
                setLoading(false);
            })
            .catch(() => {
                if (isMounted) setLoading(false);
            });
        return () => { isMounted = false; };
    }, [year]);

    // Agrupa por disciplina
    const questionsByDiscipline = questions.reduce((acc: any, q) => {
        acc[q.discipline] = acc[q.discipline] || [];
        acc[q.discipline].push(q);
        return acc;
    }, {});

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2F80ED" />
                <Text style={{ marginTop: 10 }}>Carregando questões...</Text>
            </View>
        );
    }

    if (!questions.length) {
        return (
            <View style={styles.center}>
                <Text>Nenhuma questão encontrada para {year}.</Text>
            </View>
        );
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#f7f7f7', paddingBottom: 60 }}>
            {/* Header com o ano */}
            <View style={styles.header}>
                <BackArrowMain navigation={navigation} />
                <Text style={styles.headerText}>ENEM {year}</Text>
            </View>
            {/* Filtros de disciplina */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 8, marginBottom: 12, alignItems: 'center', height: 44 }} // altura fixa para centralizar
            >
                {['matematica', 'linguagens', 'ciencias-humanas', 'ciencias-natureza'].map((disc) => (
                    <TouchableOpacity
                        key={disc}
                        style={{
                            backgroundColor: filteredDiscipline === disc ? '#2F80ED' : '#fff',
                            borderRadius: 20,
                            paddingVertical: 8,
                            paddingHorizontal: 18,
                            borderWidth: 1,
                            borderColor: '#2F80ED',
                            marginHorizontal: 4,
                            alignItems: 'center',
                            justifyContent: 'center',
                            minHeight: 36,
                            height: 36,
                        }}
                        onPress={() => setFilteredDiscipline(filteredDiscipline === disc ? null : disc)}
                    >
                        <Text
                            style={{
                                color: filteredDiscipline === disc ? '#fff' : '#2F80ED',
                                fontWeight: 'bold',
                                fontSize: 13,
                                textAlign: 'center',
                            }}
                            numberOfLines={1}
                            ellipsizeMode="tail"
                        >
                            {disc.replace('-', ' ').toUpperCase()}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>
            <FlatList
                data={Object.keys(questionsByDiscipline).filter(d =>
                    !filteredDiscipline || d === filteredDiscipline
                )}
                keyExtractor={d => d}
                contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
                renderItem={({ item: discipline }) => (
                    <View>
                        <Text style={styles.sectionTitle}>{discipline.toUpperCase()}</Text>
                        {questionsByDiscipline[discipline].map((q: Question) => (
                            <EnemQuestionCard
                                key={`${q.index}-${q.discipline}-${Math.random()}`}
                                question={q}
                                onPress={() =>
                                    navigation.navigate('EnemQuestionDetail', {
                                        year,
                                        index: q.index,
                                    })
                                }
                            />
                        ))}
                    </View>
                )}
            />
            <BottomNav navigation={navigation} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#2F80ED',
        paddingTop: 48,
        paddingBottom: 20,
        alignItems: 'center',
        marginBottom: 8,
        borderBottomLeftRadius: 16,
        borderBottomRightRadius: 16,
        elevation: 2,
    },
    headerText: {
        color: '#fff',
        fontSize: 22,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    questionBox: {
        backgroundColor: '#fff',
        borderRadius: 12,
        padding: 16,
        marginBottom: 18,
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
    },
    title: { fontWeight: 'bold', fontSize: 16, marginBottom: 6 },
    context: { marginBottom: 8, color: '#444' },
    altIntro: { fontStyle: 'italic', marginBottom: 4, color: '#666' },
    alt: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        backgroundColor: '#f4f4f4',
        borderRadius: 6,
        padding: 8,
        marginBottom: 4,
    },
    sectionTitle: {
        fontWeight: 'bold',
        fontSize: 17,
        marginBottom: 8,
        marginTop: 18,
        color: '#2F80ED',
        letterSpacing: 0.5,
    },
});

export default EnemScreen;