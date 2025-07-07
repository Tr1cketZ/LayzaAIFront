import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TouchableOpacity, TextInput, Platform, FlatList, Alert } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Notifications from 'expo-notifications';
import { BackArrowMain } from '../components/BackArrow';

LocaleConfig.locales['pt-br'] = {
  monthNames: [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
  ],
  monthNamesShort: [
    'Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun',
    'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'
  ],
  dayNames: [
    'Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'
  ],
  dayNamesShort: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
  today: 'Hoje'
};
LocaleConfig.defaultLocale = 'pt-br';

const EVENT_STORAGE_KEY = 'calendar_events';

const eventTypes = [
  { label: 'Trabalho', value: 'trabalho' },
  { label: 'Prova', value: 'prova' },
  { label: 'Apresentação', value: 'apresentacao' },
  { label: 'Outro', value: 'outro' },
];

const reminderOptions = [
  { label: '1 semana antes', value: 7 * 24 * 60 * 60 },
  { label: '1 dia antes', value: 24 * 60 * 60 },
  { label: '1 hora antes', value: 60 * 60 },
  { label: 'No horário', value: 0 },
];

type Event = {
  type: string;
  title: string;
  time: string;
  reminder: number;
};

type EventsByDate = {
  [date: string]: Event[];
};

export default function CalendarScreen({ navigation }: { navigation: any }) {
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [modalVisible, setModalVisible] = useState(false);
  const [eventType, setEventType] = useState<string>(eventTypes[0].value);
  const [eventTitle, setEventTitle] = useState('');
  const [eventTime, setEventTime] = useState<Date>(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [reminder, setReminder] = useState<number>(reminderOptions[0].value);
  const [events, setEvents] = useState<EventsByDate>({});
  const [eventsForDay, setEventsForDay] = useState<Event[]>([]);

  useEffect(() => {
    loadEvents();
    Notifications.requestPermissionsAsync();
  }, []);

  useEffect(() => {
    if (selectedDate) {
      const sorted = (events[selectedDate] || []).slice().sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
      setEventsForDay(sorted);
    }
  }, [selectedDate, events]);

  const loadEvents = async () => {
    const stored = await AsyncStorage.getItem(EVENT_STORAGE_KEY);
    setEvents(stored ? JSON.parse(stored) : {});
  };

  const saveEvents = async (newEvents: EventsByDate) => {
    setEvents(newEvents);
    await AsyncStorage.setItem(EVENT_STORAGE_KEY, JSON.stringify(newEvents));
  };

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
    setEventType(eventTypes[0].value);
    setEventTitle('');
    setEventTime(new Date(day.dateString + 'T12:00:00'));
    setReminder(reminderOptions[0].value);
  };

  const handleAddEvent = async () => {
    if (!eventTitle.trim()) {
      Alert.alert('Preencha o título do evento.');
      return;
    }
    const newEvent: Event = {
      type: eventType,
      title: eventTitle,
      time: eventTime.toISOString(),
      reminder,
    };
    const dayEvents = events[selectedDate] ? [...events[selectedDate], newEvent] : [newEvent];
    const newEvents = { ...events, [selectedDate]: dayEvents };
    await saveEvents(newEvents);
    scheduleNotification(newEvent, selectedDate);
    setModalVisible(false);
  };

  const scheduleNotification = async (event: Event, dateStr: string) => {
    const eventDate = new Date(event.time);
    const triggerDate = new Date(eventDate.getTime() - event.reminder * 1000);
    const seconds = Math.floor((triggerDate.getTime() - Date.now()) / 1000);
    if (seconds > 0) {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Lembrete: ' + event.title,
          body: `Evento: ${eventTypes.find(e => e.value === event.type)?.label || event.type} em ${dateStr} às ${eventDate.toLocaleTimeString().slice(0,5)}`,
        },
        trigger: { seconds, repeats: false } as any,
      });
    }
  };

  // Marca os dias com eventos
  const markedDates: { [date: string]: any } = Object.keys(events).reduce((acc: { [date: string]: any }, date) => {
    acc[date] = { marked: true, dotColor: '#2F80ED' };
    return acc;
  }, {});
  if (selectedDate) markedDates[selectedDate] = { ...(markedDates[selectedDate] || {}), selected: true, selectedColor: '#2F80ED' };

  return (
    <View style={{ flex: 1, backgroundColor: '#fff', paddingTop: 80 }}>
      <View style={{ position: 'absolute', top: 10, left: 10, zIndex: 10 }}>
        <BackArrowMain navigation={navigation} color="#000" />
      </View>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={markedDates}
        theme={{
          selectedDayBackgroundColor: '#2F80ED',
          todayTextColor: '#2F80ED',
        }}
      />
      <View style={{ padding: 16 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 8, textAlign: 'left' }}>Eventos do dia</Text>
        <TouchableOpacity
          style={{ alignSelf: 'center', backgroundColor: '#2F80ED', borderRadius: 8, paddingVertical: 10, paddingHorizontal: 24, marginBottom: 16 }}
          onPress={() => setModalVisible(true)}
          disabled={!selectedDate}
        >
          <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16 }}>Adicionar evento</Text>
        </TouchableOpacity>
        <FlatList
          data={eventsForDay}
          keyExtractor={(_, i) => i.toString()}
          renderItem={({ item }) => (
            <View style={{ backgroundColor: '#f2f2f2', borderRadius: 8, padding: 10, marginBottom: 8 }}>
              <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
              <Text>{eventTypes.find(e => e.value === item.type)?.label || item.type} - {new Date(item.time).toLocaleTimeString().slice(0,5)}</Text>
            </View>
          )}
          ListEmptyComponent={<Text style={{ color: '#888', textAlign: 'center' }}>Nenhum evento para este dia.</Text>}
        />
      </View>
      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)', justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ backgroundColor: '#fff', borderRadius: 16, padding: 20, width: '90%' }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 10 }}>Novo Evento</Text>
            <Text style={{ marginBottom: 4 }}>Data: <Text style={{ fontWeight: 'bold' }}>{selectedDate ? selectedDate.split('-').reverse().join('/') : ''}</Text></Text>
            <TextInput
              placeholder="Título do evento"
              value={eventTitle}
              onChangeText={setEventTitle}
              style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 }}
            />
            <Text style={{ marginBottom: 4 }}>Tipo:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10 }}>
              {eventTypes.map((et) => (
                <TouchableOpacity
                  key={et.value}
                  onPress={() => setEventType(et.value)}
                  style={{
                    backgroundColor: eventType === et.value ? '#2F80ED' : '#eee',
                    padding: 8,
                    borderRadius: 8,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ color: eventType === et.value ? '#fff' : '#333' }}>{et.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={{ marginBottom: 4 }}>Horário:</Text>
            <TouchableOpacity onPress={() => setShowTimePicker(true)} style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginBottom: 10 }}>
              <Text>{eventTime.toLocaleTimeString().slice(0,5)}</Text>
            </TouchableOpacity>
            {showTimePicker && (
              <DateTimePicker
                value={eventTime}
                mode="time"
                is24Hour={true}
                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                onChange={(_event: any, date?: Date) => {
                  setShowTimePicker(false);
                  if (date) setEventTime(date);
                }}
              />
            )}
            <Text style={{ marginBottom: 4 }}>Lembrar:</Text>
            <View style={{ flexDirection: 'row', marginBottom: 10, flexWrap: 'wrap' }}>
              {reminderOptions.map((opt) => (
                <TouchableOpacity
                  key={opt.value}
                  onPress={() => setReminder(opt.value)}
                  style={{
                    backgroundColor: reminder === opt.value ? '#2F80ED' : '#eee',
                    padding: 8,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 4,
                  }}
                >
                  <Text style={{ color: reminder === opt.value ? '#fff' : '#333' }}>{opt.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <View style={{ flexDirection: 'row', justifyContent: 'flex-end' }}>
              <TouchableOpacity onPress={() => setModalVisible(false)} style={{ marginRight: 16 }}>
                <Text style={{ color: '#888', fontSize: 16 }}>Cancelar</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleAddEvent}>
                <Text style={{ color: '#2F80ED', fontWeight: 'bold', fontSize: 16 }}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
