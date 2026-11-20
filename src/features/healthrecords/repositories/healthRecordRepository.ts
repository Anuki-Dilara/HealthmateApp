import {
  deleteHealthRecord,
  getHealthRecord,
  getHealthRecords,
  saveHealthRecord,
  updateHealthRecord,
} from '../../../database/healthmateDatabase';

import type { NewHealthRecord } from '../../../database/healthmateDatabase';

export const healthRecordRepository = {

  //get all saved health records.
  getAll: () => getHealthRecords(),

  // getone record 
  getById: (id: number) => getHealthRecord(id),

  //save a new health record
  create: (record: NewHealthRecord) =>
    saveHealthRecord(record),

  // update existing health record
  update: (id: number, record: NewHealthRecord) =>
    updateHealthRecord(id, record),

  //delete
  remove: (id: number) =>
    deleteHealthRecord(id),
};