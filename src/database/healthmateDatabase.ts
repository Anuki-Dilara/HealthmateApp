
import * as SQLite from 'expo-sqlite';

const DATABASE_NAME = 'healthmate.db';

let databaseConnection: Promise<SQLite.SQLiteDatabase> | null = null;

async function getHealthMateDatabase() {
  if (databaseConnection === null) {
    databaseConnection = SQLite.openDatabaseAsync(DATABASE_NAME);
  }

  return databaseConnection;
}

export async function initDatabase() {
  const db = await getHealthMateDatabase();

  await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS health_records (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      record_date TEXT NOT NULL,
      steps INTEGER NOT NULL CHECK (steps >= 0),
      calories INTEGER NOT NULL CHECK (calories >= 0),
      water_ml INTEGER NOT NULL CHECK (water_ml >= 0)
    );
  `);

  const existingColumns = await db.getAllAsync<{ name: string }>(
    'PRAGMA table_info(health_records)'
  );

  const columnNames = new Set(
    existingColumns.map((column) => column.name)
  );

  if (columnNames.has('date') && !columnNames.has('record_date')) {
    await db.execAsync(`
      ALTER TABLE health_records
      RENAME COLUMN date TO record_date;
    `);

    columnNames.delete('date');
    columnNames.add('record_date');
  }

  if (columnNames.has('water') && !columnNames.has('water_ml')) {
    await db.execAsync(`
      ALTER TABLE health_records
      RENAME COLUMN water TO water_ml;
    `);

    columnNames.delete('water');
    columnNames.add('water_ml');
  }

  const requiredColumns = [
    'id',
    'record_date',
    'steps',
    'calories',
    'water_ml',
  ];

  const missingColumns = requiredColumns.filter(
    (column) => !columnNames.has(column)
  );

  if (missingColumns.length > 0) {
    throw new Error(
      `Health records table is missing columns: ${missingColumns.join(', ')}`
    );
  }

  await db.execAsync(`
    CREATE INDEX IF NOT EXISTS idx_health_records_date
    ON health_records(record_date);
  `);

  console.log(
    'HealthMate database columns:',
    Array.from(columnNames).join(', ')
  );


}


export type NewHealthRecord = {
  recordDate: Date;
  steps: number;
  calories: number;
  waterMl: number;
};
export type HealthRecord = {
  id: number;
  recordDate: string;
  steps: number;
  calories: number;
  waterMl: number;
};
// Convert the selected date into YYYY-MM-DD format
function formatRecordDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

// Save one daily health record
export async function saveHealthRecord(record: NewHealthRecord) {
  const db = await getHealthMateDatabase();

  // Make sure the selected date is valid.
  if (
    !(record.recordDate instanceof Date) ||
    Number.isNaN(record.recordDate.getTime())
  ) {
    throw new Error('Please select a valid record date.');
  }

  // daily record cannot be created for a future date
  const recordDate = formatRecordDate(record.recordDate);
  const todayDate = formatRecordDate(new Date());

  if (recordDate > todayDate) {
    throw new Error('A future health record cannot be saved.');
  }

  // measurements must be whole numbers and cannot be negative
  const measurements = [
    { name: 'Steps', value: record.steps },
    { name: 'Calories', value: record.calories },
    { name: 'Water intake', value: record.waterMl },
  ];

  for (const measurement of measurements) {
    if (
      !Number.isSafeInteger(measurement.value) ||
      measurement.value < 0
    ) {
      throw new Error(
        `${measurement.name} must be a non-negative whole number.`
      );
    }
  }

  // one daily summary per date
  // check for an existing record before inserting another one
  const existingRecord = await db.getFirstAsync<{ id: number }>(
    'SELECT id FROM health_records WHERE record_date = ?',
    recordDate
  );

  if (existingRecord) {
    throw new Error(
      'A health record already exists for this date. Please edit the existing record instead.'
    );
  }

  const result = await db.runAsync(
    `INSERT INTO health_records
      (record_date, steps, calories, water_ml)
     VALUES (?, ?, ?, ?)`,
    recordDate,
    record.steps,
    record.calories,
    record.waterMl
  );

  if (result.changes !== 1) {
    throw new Error('The health record could not be saved.');
  }

  return result.lastInsertRowId;
}
// get all records
export async function getHealthRecords(): Promise<HealthRecord[]> {
  const db = await getHealthMateDatabase();

  const savedRecords = await db.getAllAsync<HealthRecord>(
    `SELECT
      id,
      record_date AS recordDate,
      steps,
      calories,
      water_ml AS waterMl
     FROM health_records
     ORDER BY record_date DESC, id DESC`
  );

  return savedRecords;
}


