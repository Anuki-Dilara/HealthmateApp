
import * as SQLite from 'expo-sqlite';
import type {
  HealthRecord,
  NewHealthRecord,
} from '../features/healthrecords/models/healthRecords';
export type {
  HealthRecord,
  NewHealthRecord
} from '../features/healthrecords/models/healthRecords';
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
  if (__DEV__) {
    await seedDemoHealthRecords();
  }

}

// convert date into YYYY-MM-DD 
function formatRecordDate(date: Date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
// Add sample records for testing
async function seedDemoHealthRecords() {
  const db = await getHealthMateDatabase();
  const existingRecords = await db.getFirstAsync<{ total: number }>(
    'SELECT COUNT(*) AS total FROM health_records'
  );
  if ((existingRecords?.total ?? 0) > 0) {
    return;
  }
  const demoRecords = [
    { daysAgo: 6, steps: 6450, calories: 360, waterMl: 1600 },
    { daysAgo: 5, steps: 8200, calories: 510, waterMl: 2100 },
    { daysAgo: 4, steps: 7300, calories: 430, waterMl: 1850 },
    { daysAgo: 3, steps: 10150, calories: 680, waterMl: 2400 },
    { daysAgo: 2, steps: 5600, calories: 310, waterMl: 1450 },
    { daysAgo: 1, steps: 8900, calories: 560, waterMl: 2200 },
    { daysAgo: 0, steps: 7850, calories: 420, waterMl: 2000 },
  ];
  const today = new Date();
  for (const sample of demoRecords) {
    const sampleDate = new Date(today);
    sampleDate.setDate(today.getDate() - sample.daysAgo);

    await db.runAsync(
      `INSERT INTO health_records
        (record_date, steps, calories, water_ml)
       VALUES (?, ?, ?, ?)`,
      formatRecordDate(sampleDate),
      sample.steps,
      sample.calories,
      sample.waterMl
    );
  }

  console.log('HealthMate demo records inserted successfully.');
}
// Save one daily rec
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


// Update existing  rec
export async function updateHealthRecord(
  id: number,
  record: NewHealthRecord
) {
  const db = await getHealthMateDatabase();

  // validate selected rec date
  if (
    !(record.recordDate instanceof Date) ||
    Number.isNaN(record.recordDate.getTime())
  ) {
    throw new Error('Please select a valid record date.');
  }

  const recordDate = formatRecordDate(record.recordDate);
  const todayDate = formatRecordDate(new Date());

  if (recordDate > todayDate) {
    throw new Error('A future health record cannot be saved.');
  }

  // validate health measurements
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

  // cant add record same date 
  const existingRecord = await db.getFirstAsync<{ id: number }>(
    `SELECT id FROM health_records
     WHERE record_date = ? AND id != ?`,
    recordDate,
    id
  );

  if (existingRecord) {
    throw new Error(
      'Another health record already exists for this date.'
    );
  }

  const result = await db.runAsync(
    `UPDATE health_records
     SET record_date = ?,
         steps = ?,
         calories = ?,
         water_ml = ?
     WHERE id = ?`,
    recordDate,
    record.steps,
    record.calories,
    record.waterMl,
    id
  );

  if (result.changes !== 1) {
    throw new Error('The health record could not be updated.');
  }
}

//delete rec
export async function deleteHealthRecord(id: number) {
  const db = await getHealthMateDatabase();

  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Invalid health record ID.');
  }

  const result = await db.runAsync(
    'DELETE FROM health_records WHERE id = ?',
    id
  );

  if (result.changes !== 1) {
    throw new Error('The health record could not be deleted.');
  }
}

// get one health record
export async function getHealthRecord(
  id: number
): Promise<HealthRecord | null> {
  if (!Number.isSafeInteger(id) || id <= 0) {
    throw new Error('Invalid health record ID.');
  }

  const db = await getHealthMateDatabase();

  const record = await db.getFirstAsync<HealthRecord>(
    `SELECT
       id,
       record_date AS recordDate,
       steps,
       calories,
       water_ml AS waterMl
     FROM health_records
     WHERE id = ?`,
    id
  );

  return record ?? null;
}