
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

    CREATE INDEX IF NOT EXISTS idx_health_records_date
    ON health_records(record_date);
  `);
}
