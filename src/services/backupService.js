// src/services/backupService.js
// Data export, import, and database utility functions
import { db } from "./db";
import { format } from "date-fns";

const SETTING_KEYS = [
    "StudyTracker_MoneyGoal",
    "StudyTracker_MonthlyHourGoal",
    "StudyTracker_MoneyGoalName",
    "StudyTracker_MonthlyHourGoalName",
];

function readSettings() {
    return {
        moneyGoal: localStorage.getItem("StudyTracker_MoneyGoal") || "10000000",
        monthlyHourGoal: localStorage.getItem("StudyTracker_MonthlyHourGoal") || "50",
        moneyGoalName: localStorage.getItem("StudyTracker_MoneyGoalName") || "Mục tiêu tích lũy",
        monthlyHourGoalName: localStorage.getItem("StudyTracker_MonthlyHourGoalName") || "Mục tiêu tháng",
    };
}

function applySettings(settings = {}) {
    if (settings.moneyGoal) localStorage.setItem("StudyTracker_MoneyGoal", settings.moneyGoal);
    if (settings.monthlyHourGoal) localStorage.setItem("StudyTracker_MonthlyHourGoal", settings.monthlyHourGoal);
    if (settings.moneyGoalName) localStorage.setItem("StudyTracker_MoneyGoalName", settings.moneyGoalName);
    if (settings.monthlyHourGoalName) localStorage.setItem("StudyTracker_MonthlyHourGoalName", settings.monthlyHourGoalName);
}

export async function exportData() {
    const [tasks, sessions, withdrawals, debts] = await Promise.all([
        db.tasks.toArray(), db.sessions.toArray(),
        db.withdrawals.toArray(), db.debts.toArray(),
    ]);
    const payload = { version: 5, exportedAt: new Date().toISOString(), tasks, sessions, withdrawals, debts, settings: readSettings() };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `studytracker-backup-${format(new Date(), "yyyy-MM-dd")}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

export async function importDataFromPayload(payload) {
    const { tasks, sessions, withdrawals, debts, settings } = payload;
    applySettings(settings);
    let count = 0;

    await db.transaction("rw", db.tasks, db.sessions, db.withdrawals, db.debts, async () => {
        for (const t of tasks || []) { const { id, ...rest } = t; await db.tasks.put({ id, ...rest }); count++; }
        for (const s of sessions || []) { const { id, ...rest } = s; await db.sessions.put({ id, ...rest }); count++; }
        for (const w of withdrawals || []) { const { id, ...rest } = w; await db.withdrawals.put({ id, ...rest }); count++; }
        for (const d of debts || []) { const { id, ...rest } = d; await db.debts.put({ id, ...rest }); count++; }
    });
    return count;
}

export async function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try { resolve(await importDataFromPayload(JSON.parse(e.target.result))); }
            catch (err) { reject(err); }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}

export async function isDatabaseEmpty() {
    const [taskCount, sessionCount] = await Promise.all([db.tasks.count(), db.sessions.count()]);
    return taskCount === 0 && sessionCount === 0;
}

export async function getDataSnapshot() {
    const [tasks, sessions, withdrawals, debts] = await Promise.all([
        db.tasks.toArray(), db.sessions.toArray(),
        db.withdrawals.toArray(), db.debts.toArray(),
    ]);
    return { version: 5, exportedAt: new Date().toISOString(), tasks, sessions, withdrawals, debts, settings: readSettings() };
}

export async function clearAllData() {
    await db.transaction("rw", db.tasks, db.sessions, db.withdrawals, db.debts, async () => {
        await Promise.all([db.tasks.clear(), db.sessions.clear(), db.withdrawals.clear(), db.debts.clear()]);
    });
}
