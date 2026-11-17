import { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    StyleSheet,
    Text,
    View
} from 'react-native';

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
});