export type HealthRecord = {
  id: number;
  recordDate: string;
  steps: number;
  calories: number;
  waterMl: number;
};

// Represents information required to create or update a health record.
export type NewHealthRecord = {
  recordDate: Date;
  steps: number;
  calories: number;
  waterMl: number;
};