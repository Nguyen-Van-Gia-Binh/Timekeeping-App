// src/services/db.js
// Local database using Dexie.js (IndexedDB wrapper)
import Dexie from "dexie";

export const db = new Dexie("StudyTracker");

db.version(4).stores({
    // dateKey = "YYYY-MM-DD" is the primary key
    tasks: "++id, dateKey, completed",
    sessions: "++id, dateKey",
    withdrawals: "++id, timestamp",
    debts: "++id, amount, reason, timestamp, isPaid",
});
