
import { useState } from 'react';

import {
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function AddRecordScreen() {
// Check the health measurements before allowing the record 
function validateHealthRecord() {

  if (
    stepsInput.trim() === '' ||
    caloriesInput.trim() === '' ||
    waterInput.trim() === ''
  ) {
    setFormError('Please complete all health information.');
    return false;
  }

  const recordedSteps = Number(stepsInput);
  const recordedCalories = Number(caloriesInput);
  const recordedWater = Number(waterInput);

  // Health measurements must be non negative whole numbers
  if (
    !Number.isSafeInteger(recordedSteps) ||
    recordedSteps < 0
  ) {
    setFormError('Please enter a valid whole number for steps.');
    return false;
  }

  if (
    !Number.isSafeInteger(recordedCalories) ||
    recordedCalories < 0
  ) {
    setFormError('Please enter valid calories burned.');
    return false;
  }

  if (
    !Number.isSafeInteger(recordedWater) ||
    recordedWater < 0
  ) {
    setFormError('Please enter valid water intake in ml.');
    return false;
  }

  setFormError('');
  return true;
}

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
// Holds the number of steps entered for health record
const [stepsInput, setStepsInput] = useState('');
// Calories burned
const [caloriesInput, setCaloriesInput] = useState('');
// WaterIntake
const [waterInput, setWaterInput] = useState('');
// Validation message for user entered a wrong input
const [formError, setFormError] = useState('');
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
        {/* daily step count */}
        <Text style={styles.label}>
        👟 Steps
        </Text>

        <TextInput
            style={styles.input}
            placeholder="Enter number of steps"
            placeholderTextColor="#9AA49D"
            keyboardType="number-pad"
            value={stepsInput}
            onChangeText={setStepsInput}
        />

        {/* calories burned in recorded day */}
        <Text style={styles.label}>
        🔥 Calories Burned
        </Text>

        <TextInput
            style={styles.input}
            placeholder="Enter calories burned (kcal)"
            placeholderTextColor="#9AA49D"
            keyboardType="number-pad"
            value={caloriesInput}
            onChangeText={setCaloriesInput}
        />

        {/* daily water consumption */}
        <Text style={styles.label}>
        💧 Water Intake (ml)
        </Text>

        <TextInput
            style={styles.input}
            placeholder="Enter water intake in ml"
            placeholderTextColor="#9AA49D"
            keyboardType="number-pad"
            value={waterInput}
            onChangeText={setWaterInput}
        />
        {formError !== '' && (
        <Text style={styles.errorText}>
            ⚠️ {formError}
        </Text>
        )}
        <Pressable
            style={styles.saveButton}
            onPress={() => {
                if (validateHealthRecord()) {
                Alert.alert(
                    'Validation successful',
                    'Your health information is valid. Permanent saving will be added when we connect SQLite.'
                );
                }
            }}
            >
            <Text style={styles.saveButtonText}>
                Check Health Record
            </Text>
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

  input: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#DCE9DF',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 15,
    fontSize: 15,
    color: '#35463B',
    },

  saveButton: {
    backgroundColor: '#176B4D',
    paddingVertical: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 25,
    },

    saveButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    },

    errorText: {
    color: '#BC3F35',
    backgroundColor: '#FFF0EF',
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginTop: 15,
    },
});
