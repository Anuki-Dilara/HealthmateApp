import {
  Alert,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { useAddRecordViewModel } from '@/features/healthrecords/viewmodels/addRecordViewModel';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { SafeAreaView } from 'react-native-safe-area-context';
// Check the health measurements
export default function AddRecordScreen() {

  // Get form information
  const {
    recordDate,
    setRecordDate,
    stepsInput,
    setStepsInput,
    caloriesInput,
    setCaloriesInput,
    waterInput,
    setWaterInput,
    isSaving,
    formError,
    saveRecord,
  } = useAddRecordViewModel();

  //open the calendar
  function openCalendar() {
    DateTimePickerAndroid.open({
      value: recordDate,
      mode: 'date',
      display: 'calendar',
      maximumDate: new Date(),

      onValueChange: (_event, selectedDate) => {
        if (selectedDate) {
          setRecordDate(selectedDate);
        }
      },
    });
  }

  //save the record
  async function handleSaveRecord() {
    const saved = await saveRecord();

    if (saved) {
      Alert.alert(
        'Record Saved! 🎉',
        'Your daily health record has been saved successfully.'
      );
    }
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
          style={[
            styles.saveButton,
            isSaving && styles.buttonDisabled,
          ]}
          onPress={handleSaveRecord}
          disabled={isSaving}
        >
          <Text style={styles.saveButtonText}>
            {isSaving ? 'Saving...' : '💚 Save Health Record'}
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

    buttonDisabled: {
      opacity: 0.6,
    },
});
