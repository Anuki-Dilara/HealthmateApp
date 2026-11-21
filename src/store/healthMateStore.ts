import { create } from 'zustand';

import type { HealthRecord } from '../features/healthrecords/models/healthRecords';

type HealthMateState = {
  healthRecords: HealthRecord[];
  isLoadingRecords: boolean;
  recordsError: string;

  setHealthRecords: (records: HealthRecord[]) => void;
  setRecordsLoading: (loading: boolean) => void;
  setRecordsError: (message: string) => void;
  clearRecordsError: () => void;

  removeHealthRecordFromStore: (recordId: number) => void;
  replaceHealthRecordInStore: (updatedRecord: HealthRecord) => void;
};

export const useHealthMateStore = create<HealthMateState>((set) => ({

  healthRecords: [],
  isLoadingRecords: false,
  recordsError: '',

  setHealthRecords: (records) =>
    set({ healthRecords: records }),

  setRecordsLoading: (loading) =>
 set({ isLoadingRecords: loading }),

  setRecordsError: (message) =>
    set({ recordsError: message }),

clearRecordsError: () =>
    set({ recordsError: '' }),

  //remove deleted records 
  removeHealthRecordFromStore: (recordId) =>
    set((state) => ({
      healthRecords: state.healthRecords.filter(
        (record) => record.id !== recordId
      ),
    })),

  //update existingrecord
  replaceHealthRecordInStore: (updatedRecord) =>
    set((state) => ({
      healthRecords: state.healthRecords.map((record) =>
        record.id === updatedRecord.id
          ? updatedRecord
          : record
      ),
    })),
}));