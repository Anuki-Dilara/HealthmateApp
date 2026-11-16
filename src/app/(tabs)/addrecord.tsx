
import { useState } from 'react';

import {
    Pressable,
    StyleSheet,
    Text,
    View,
} from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddRecordScreen() {

  // new health record uses today's date by default
  const [recordDate, setRecordDate] = useState(new Date());

  // Open the calendar when date field pressed
  function openCalendar() {
    DateTimePickerAndroid.open({
      value: recordDate,
      mode: 'date',
      display: 'calendar',
      maximumDate: new Date(),

      onValueChange: (_event, selectedDate) => {
        setRecordDate(selectedDate);
      },
    });
  }

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.container}>

        <Text style={styles.title}>
          ➕ Add Health Record
        </Text>

        <Text style={styles.description}>
          Record your daily health activities.
        </Text>

        {/* date selection */}
        <Text style={styles.label}>
          📅 Record Date
        </Text>

        <Pressable
          style={styles.dateButton}
          onPress={openCalendar}
        >
          <Text style={styles.dateText}>
            {recordDate.toLocaleDateString('en-GB', {
              day: '2-digit',
              month: 'long',
              year: 'numeric',
            })}
          </Text>

          <Text style={styles.calendarIcon}>🗓️</Text>
        </Pressable>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({

  screen: {
    flex: 1,
    backgroundColor: '#F4F7F5',
  },

  container: {
    padding: 20,
  },

  title: {
    fontSize: 25,
    fontWeight: 'bold',
    color: '#176B4D',
    marginBottom: 8,
  },

  description: {
    fontSize: 14,
    color: '#758178',
    marginBottom: 25,
  },

  label: {
    fontSize: 15,
    fontWeight: '600',
    color: '#35463B',
    marginBottom: 10,
  },

  dateButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE9DF',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  dateText: {
    fontSize: 15,
    color: '#35463B',
  },

  calendarIcon: {
    fontSize: 20,
  },
});
