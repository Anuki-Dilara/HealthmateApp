import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    getHealthRecord
} from '../database/healthmateDatabase';
export default function EditRecordScreen() {

  // get selected id
  const { id } = useLocalSearchParams<{ id: string }>();

  // store the selected record's info
  const [recordDate, setRecordDate] = useState(new Date());
  const [stepsInput, setStepsInput] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [waterInput, setWaterInput] = useState('');

  // track loading and saving states
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  // display validation, loading error
  const [formError, setFormError] = useState('');

  // load the selected health record 
    useEffect(() => {
        
    let screenIsActive = true;

    async function loadRecord() {
        try {
        const recordId = Number(id);

        if (!Number.isSafeInteger(recordId) || recordId <= 0) {
            throw new Error('Invalid health record ID.');
        }

        const record = await getHealthRecord(recordId);

        if (!record) {
            throw new Error('Health record could not be found.');
        }

        if (screenIsActive) {
            const [year, month, day] = record.recordDate
            .split('-')
            .map(Number);

            setRecordDate(new Date(year, month - 1, day));
            setStepsInput(String(record.steps));
            setCaloriesInput(String(record.calories));
            setWaterInput(String(record.waterMl));
        }
        } catch (error) {
        if (screenIsActive) {
            setFormError(
            error instanceof Error
                ? error.message
                : 'Unable to load health record.'
            );
        }
        } finally {
        if (screenIsActive) {
            setIsLoading(false);
        }
        }
    }
    

    void loadRecord();

    return () => {
        screenIsActive = false;
    };
    }, [id]);
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

if (isLoading) {
  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#176B4D" />

        <Text style={styles.loadingText}>
          Loading health record...
        </Text>
      </View>
    </SafeAreaView>
  );
}

return (
  <SafeAreaView style={styles.screen}>
    <View style={styles.container}>
      <Text style={styles.title}>
        ✏️ Edit Health Record
      </Text>
       
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
      {formError !== '' && (
        <Text style={styles.errorText}>
          ⚠️ {formError}
        </Text>
      )}
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
    marginBottom: 20,
  },

  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    fontSize: 14,
    color: '#758178',
    marginTop: 12,
  },

  errorText: {
    color: '#BC3F35',
    backgroundColor: '#FFF0EF',
    padding: 12,
    borderRadius: 10,
    fontSize: 13,
    marginTop: 15,
  },

  label: {
  fontSize: 15,
  fontWeight: '600',
  color: '#35463B',
  marginTop: 15,
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
});