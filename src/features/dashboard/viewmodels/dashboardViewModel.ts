
import { useFocusEffect } from 'expo-router';
import { useCallback, useState } from 'react';
import { useHealthMateStore } from '../../../store/healthMateStore';
import type { HealthRecord } from '../../healthrecords/models/healthRecords';
import { healthRecordRepository } from '../../healthrecords/repositories/healthRecordRepository';

function formatDatabaseDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

function calculateWeeklyHealthSummary(
  records: HealthRecord[],
  today: Date
) {
  const firstDay = new Date(
    today.getFullYear(),
    today.getMonth(),
    today.getDate() - 6
  );

  const firstDayDate = formatDatabaseDate(firstDay);
  const todayDate = formatDatabaseDate(today);


  const weeklyRecords = records.filter(
    (record) =>
      record.recordDate >= firstDayDate &&
      record.recordDate <= todayDate
  );

  const totals = weeklyRecords.reduce(
    (summary, record) => ({
      steps: summary.steps + record.steps,
      calories: summary.calories + record.calories,
      waterMl: summary.waterMl + record.waterMl,
    }),
    {
      steps: 0,
      calories: 0,
      waterMl: 0,
    }
  );

  const daysTracked = weeklyRecords.length;

  return {
    totalSteps: totals.steps,
    totalCalories: totals.calories,
    totalWaterMl: totals.waterMl,
    daysTracked,


    averageSteps: daysTracked > 0
      ? Math.round(totals.steps / daysTracked)
      : 0,

    averageCalories: daysTracked > 0
      ? Math.round(totals.calories / daysTracked)
      : 0,

    averageWaterMl: daysTracked > 0
      ? Math.round(totals.waterMl / daysTracked)
      : 0,
  };
}


export function useDashboardViewModel() {

  const healthRecords = useHealthMateStore(
    (state) => state.healthRecords
  );

  const setHealthRecords = useHealthMateStore(
    (state) => state.setHealthRecords
  );

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState('');


  useFocusEffect(
    useCallback(() => {
      let screenIsActive = true;

      async function loadDashboardRecords() {
        setIsLoading(true);
        setLoadError('');

        try {
          const savedRecords =
            await healthRecordRepository.getAll();

          if (screenIsActive) {
            setHealthRecords(savedRecords);
          }
        } catch (error) {
          if (screenIsActive) {
            setLoadError(
              error instanceof Error
                ? error.message
                : 'Unable to load dashboard health information.'
            );
          }
        } finally {
          if (screenIsActive) {
            setIsLoading(false);
          }
        }
      }

      void loadDashboardRecords();

      return () => {
        screenIsActive = false;
      };
    }, [setHealthRecords])
  );

  const currentDate = new Date();
  const todayDate = formatDatabaseDate(currentDate);

  const todayRecord = healthRecords.find(
    (record) => record.recordDate === todayDate
  );

  const todayHealth = {
    steps: todayRecord?.steps ?? 0,
    calories: todayRecord?.calories ?? 0,
    waterMl: todayRecord?.waterMl ?? 0,
  };

  const weeklySummary = calculateWeeklyHealthSummary(
    healthRecords,
    currentDate
  );

  return {
    todayHealth,
    hasTodayRecord: Boolean(todayRecord),
    weeklySummary,
    isLoading,
    loadError,
  };
}
