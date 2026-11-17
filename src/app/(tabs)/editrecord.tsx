import { useState } from 'react';

import {
    Text,
    View
} from 'react-native';

import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';


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

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <Text>Edit Health Record</Text>
      </View>
    </SafeAreaView>
  );
}