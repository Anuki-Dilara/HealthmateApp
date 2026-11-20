import { useHealthMateStore } from '@/store/healthMateStore';
import { useEffect, useState } from 'react';
import { healthRecordRepository } from '../repositories/healthRecordRepository';

//manage the selected health rec
export function useEditRecordViewModel(recordId: string | undefined) {
  // store the selected record's info
  const [recordDate, setRecordDate] = useState(new Date());
  const [stepsInput, setStepsInput] = useState('');
  const [caloriesInput, setCaloriesInput] = useState('');
  const [waterInput, setWaterInput] = useState('');

  // track loading andsaving   
const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  // error messages
  const [formError, setFormError] = useState('');
  const setHealthRecords = useHealthMateStore(
  (state) => state.setHealthRecords
); 
  // load the selected health record
    useEffect(() => {
    let screenIsActive = true;

    async function loadRecord() {
        try {
        const selectedId = Number(recordId);

        // check record ID is valid.
        if (!Number.isSafeInteger(selectedId) || selectedId <= 0) {
            throw new Error('Invalid health record ID.');
        }
        const record = await healthRecordRepository.getById(selectedId);

        if (!record) {
            throw new Error('Health record could not be found.');
        }

        if (screenIsActive) {
            // Convert the saved date into a JavaScript Date object.
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
    }, [recordId]);
    //validate health measurements
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

    // measurements must be non-negative whole numbers
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
        //update the selected health record
    async function updateRecord(): Promise<boolean> {

    if (!validateHealthRecord()) {
        return false;
    }

    const selectedId = Number(recordId);

    if (!Number.isSafeInteger(selectedId) || selectedId <= 0) {
        setFormError('Invalid health record ID.');
        return false;
    }

    setIsSaving(true);

    try {
        await healthRecordRepository.update(selectedId, {
        recordDate: recordDate,
        steps: Number(stepsInput),
        calories: Number(caloriesInput),
        waterMl: Number(waterInput),
        });

        const savedRecords = await healthRecordRepository.getAll();

        setHealthRecords(savedRecords);

        setFormError('');
        return true;

    } catch (error) {
        setFormError(
        error instanceof Error
            ? error.message
            : 'Unable to update your health record.'
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
    isLoading,
    isSaving,
    formError,
    setRecordDate,
    setStepsInput,
    setCaloriesInput,
    setWaterInput,
    validateHealthRecord,
    updateRecord,
  };
}