import { useState } from 'react';
import { useHealthMateStore } from '../../../store/healthMateStore';
import { healthRecordRepository } from '../repositories/healthRecordRepository';
export function useAddRecordViewModel() {

  // store date selected forhealth record
  const [recordDate, setRecordDate] = useState(new Date());

  //store health measurements
  const [stepsInput, setStepsInput] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [waterInput, setWaterInput] = useState('');

  const [isSaving, setIsSaving] = useState(false);
  const [formError, setFormError] = useState('');
  //update health records after saving new record
const setHealthRecords = useHealthMateStore(
  (state) => state.setHealthRecords
);
  // validate health measurements
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

    //measurements must be non-negative whole numbers
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
  //save a new health record
async function saveRecord(): Promise<boolean> {

  if (!validateHealthRecord()) {
    return false;
  }

  setIsSaving(true);

  try {
    await healthRecordRepository.create({
      recordDate: recordDate,
      steps: Number(stepsInput),
      calories: Number(caloriesInput),
      waterMl: Number(waterInput),
    });

    const savedRecords = await healthRecordRepository.getAll();

    setHealthRecords(savedRecords);

    setRecordDate(new Date());
    setStepsInput('');
    setCaloriesInput('');
    setWaterInput('');
    setFormError('');

    return true;

  } catch (error) {
    setFormError(
      error instanceof Error
        ? error.message
        : 'Unable to save your health record.'
    );

    return false;

  } finally {
    setIsSaving(false);
  }
}
  return {
    recordDate,
    stepsInput,
    caloriesInput,
    waterInput,
    isSaving,
    formError,
    validateHealthRecord,
    setRecordDate,
    setStepsInput,
    setCaloriesInput,
    setWaterInput,
    saveRecord,
  };

}