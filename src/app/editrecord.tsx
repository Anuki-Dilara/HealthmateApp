import { useEffect, useState } from 'react';

import {
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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Edit Health Record</Text>
      </View>
    </SafeAreaView>
  );
}