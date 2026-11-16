
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
