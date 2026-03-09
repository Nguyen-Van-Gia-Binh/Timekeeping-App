// src/services/db.js
// Local database using Dexie.js (IndexedDB wrapper)
import Dexie from "dexie";

export const db = new Dexie("StudyTracker");

db.version(3).stores({
    // dateKey = "YYYY-MM-DD" is the primary key
    tasks: "++id, dateKey, completed",
    sessions: "++id, dateKey",
    dayRecords: "dateKey", // primary key = date string
    withdrawals: "++id, timestamp", // new table for withdrawal history
    debts: "++id, amount, reason, timestamp, isPaid", // new table for debt
});
