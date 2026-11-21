
import {
    ActivityIndicator,
    Alert,
    Pressable,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';

import { useEditRecordViewModel } from '@/features/healthrecords/viewmodels/editRecordViewModel';
import { DateTimePickerAndroid } from '@react-native-community/datetimepicker';
import { router, useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
export default function EditRecordView() {

  // get selected id
  const { id } = useLocalSearchParams<{ id: string }>();
  // get editing informationfrom ViewModel.
  const {
    recordDate,
    setRecordDate,
    stepsInput,
    setStepsInput,
    caloriesInput,
    setCaloriesInput,
    waterInput,
    setWaterInput,
    isLoading,
    isSaving,
    formError,
    updateRecord,
  } = useEditRecordViewModel(id);
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

//update health record
async function handleUpdateRecord() {
  const updated = await updateRecord();

  if (updated) {
    Alert.alert(
      'Record Updated! 🎉',
      'Your health record has been updated successfully.',
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  }
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
{/* daily calories burnned */}
        <TextInput
        style={styles.input}
        placeholder="Enter number of steps"
        placeholderTextColor="#9AA49D"
        keyboardType="number-pad"
        value={stepsInput}
        onChangeText={setStepsInput}
        />
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

        {/* daily water intake */}
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
      {/*update the existing health record */}
        <Pressable
        style={[
            styles.saveButton,
            isSaving && styles.buttonDisabled,
        ]}
        onPress={handleUpdateRecord}
        disabled={isSaving}
        >
        <Text style={styles.saveButtonText}>
            {isSaving ? 'Updating...' : '💚 Update Health Record'}
        </Text>
        </Pressable>
        <Pressable
        style={styles.cancelButton}
        onPress={() => router.back()}
        disabled={isSaving}
        >
        <Text style={styles.cancelButtonText}>
            Cancel
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

buttonDisabled: {
  opacity: 0.6,
},
cancelButton: {
  backgroundColor: '#E8EFEB',
  paddingVertical: 14,
  borderRadius: 12,
  alignItems: 'center',
  marginTop: 12,
},

cancelButtonText: {
  color: '#35463B',
  fontSize: 15,
  fontWeight: 'bold',
},
});