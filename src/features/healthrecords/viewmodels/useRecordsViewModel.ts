import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';

import { useHealthMateStore } from '../../../store/healthMateStore';
import { healthRecordRepository } from '../repositories/healthRecordRepository';

export function useRecordsViewModel() {

  const healthRecords = useHealthMateStore(
    (state) => state.healthRecords
  );

  const isLoading = useHealthMateStore(
    (state) => state.isLoadingRecords
  );

  const loadError = useHealthMateStore(
    (state) => state.recordsError
  );

  const setHealthRecords = useHealthMateStore(
    (state) => state.setHealthRecords
  );

  const setRecordsLoading = useHealthMateStore(
    (state) => state.setRecordsLoading
  );

  const setRecordsError = useHealthMateStore(
    (state) => state.setRecordsError
  );

  const removeHealthRecordFromStore = useHealthMateStore(
    (state) => state.removeHealthRecordFromStore
  );

  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function loadSavedHealthRecords() {
        setRecordsLoading(true);
        setRecordsError('');

        try {
          const savedRecords =
            await healthRecordRepository.getAll();

          if (screenIsActive) {
            setHealthRecords(savedRecords);
          }
        } catch (error) {
          if (screenIsActive) {
            setRecordsError(
              error instanceof Error
                ? error.message
                : 'Unable to load your health records.'
            );
          }
        } finally {
          if (screenIsActive) {
            setRecordsLoading(false);
          }
        }
      }

      void loadSavedHealthRecords();

      return () => {
        screenIsActive = false;
      };
    }, [
      setHealthRecords,
      setRecordsLoading,
      setRecordsError,
    ])
  );

  // delete record 
  const deleteRecord = useCallback(
    async (recordId: number) => {
      await healthRecordRepository.remove(recordId);

      removeHealthRecordFromStore(recordId);
    },
    [removeHealthRecordFromStore]
  );

  return {
    healthRecords,
    isLoading,
    loadError,
    deleteRecord,
  };
}