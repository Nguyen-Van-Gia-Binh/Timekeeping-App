// src/services/localService.js
// CRUD operations on local IndexedDB via Dexie
import { db } from "./db";
import { format } from "date-fns";

// ─── TASKS ────────────────────────────────────────────────────────────────────

export async function addTask(title) {
    const dateKey = format(new Date(), "yyyy-MM-dd");
    const id = await db.tasks.add({ dateKey, title, completed: false, createdAt: Date.now() });
    return id;
}

export async function updateTask(id, updates) {
    await db.tasks.update(id, updates);
}

export async function deleteTask(id) {
    await db.tasks.delete(id);
}

export async function getTasksForDate(dateKey) {
    return db.tasks.where("dateKey").equals(dateKey).toArray();
}

// ─── STUDY SESSIONS ───────────────────────────────────────────────────────────

export async function addStudySession(durationSeconds) {
    const dateKey = format(new Date(), "yyyy-MM-dd");
    const id = await db.sessions.add({
        dateKey,
        durationSeconds,
        startedAt: Date.now() - durationSeconds * 1000,
        endedAt: Date.now(),
    });
    return id;
}

export async function getSessionsForDate(dateKey) {
    return db.sessions.where("dateKey").equals(dateKey).toArray();
}

// ─── ALL DAY DATA (for balance) ───────────────────────────────────────────────

/**
 * Aggregates all tasks and sessions into day records for balance calculation.
 * Returns: [{ date, missedCount, completedAll, studySeconds }]
 */
export async function getAllDayRecords() {
    const [allTasks, allSessions] = await Promise.all([
        db.tasks.toArray(),
        db.sessions.toArray(),
    ]);

    // Group by dateKey
    const dayMap = {};

    for (const task of allTasks) {
        if (!dayMap[task.dateKey]) dayMap[task.dateKey] = { tasks: [], sessions: [] };
        dayMap[task.dateKey].tasks.push(task);
    }

    for (const s of allSessions) {
        if (!dayMap[s.dateKey]) dayMap[s.dateKey] = { tasks: [], sessions: [] };
        dayMap[s.dateKey].sessions.push(s);
    }

    return Object.entries(dayMap).map(([date, { tasks, sessions }]) => {
        const completedAll = tasks.length > 0 && tasks.every((t) => t.completed);
        const missedCount = tasks.filter((t) => !t.completed).length;
        const studySeconds = sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0);
        return { date, completedAll, missedCount, studySeconds };
    });
}
// ─── WITHDRAWALS ──────────────────────────────────────────────────────────────

export async function addWithdrawal(amount, reason) {
    return await db.withdrawals.add({
        amount,
        reason,
        timestamp: Date.now()
    });
}

export async function getWithdrawals() {
    return db.withdrawals.orderBy("timestamp").reverse().toArray();
}

// ─── DEBTS ───────────────────────────────────────────────────────────────────

export async function addDebt(amount, reason) {
    return await db.debts.add({
        amount,
        reason,
        timestamp: Date.now(),
        isPaid: false
    });
}

export async function getUnpaidDebts() {
    return db.debts.toArray().then(all => all.filter(d => !d.isPaid));
}

export async function payDebt(debtId, amountToPay) {
    const debt = await db.debts.get(debtId);
    if (!debt) return 0; // trả lại phần dư nếu không tìm thấy nợ

    if (amountToPay >= debt.amount) {
        // Trả hết nợ này, dư bao nhiêu đem cấn trừ tiếp hoặc trả lại
        const remainder = amountToPay - debt.amount;
        await db.debts.update(debtId, { isPaid: true, amount: 0 });
        return remainder;
    } else {
        // Chưa trả hết
        await db.debts.update(debtId, { amount: debt.amount - amountToPay });
        return 0; // không còn dư
    }
}

// ─── EXPORT / IMPORT ─────────────────────────────────────────────────────────


export async function exportData() {
    const [tasks, sessions, withdrawals, debts] = await Promise.all([
        db.tasks.toArray(),
        db.sessions.toArray(),
        db.withdrawals.toArray(),
        db.debts.toArray(),
    ]);
    const settings = {
        moneyGoal: localStorage.getItem("StudyTracker_MoneyGoal") || "10000000",
        monthlyHourGoal: localStorage.getItem("StudyTracker_MonthlyHourGoal") || "50",
        moneyGoalName: localStorage.getItem("StudyTracker_MoneyGoalName") || "Mục tiêu tích lũy",
        monthlyHourGoalName: localStorage.getItem("StudyTracker_MonthlyHourGoalName") || "Mục tiêu tháng"
    };
    const payload = { version: 3, exportedAt: new Date().toISOString(), tasks, sessions, withdrawals, debts, settings };
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
    let count = 0;

    // Import Settings to localStorage directly
    if (settings) {
        if (settings.moneyGoal) localStorage.setItem("StudyTracker_MoneyGoal", settings.moneyGoal);
        if (settings.monthlyHourGoal) localStorage.setItem("StudyTracker_MonthlyHourGoal", settings.monthlyHourGoal);
        if (settings.moneyGoalName) localStorage.setItem("StudyTracker_MoneyGoalName", settings.moneyGoalName);
        if (settings.monthlyHourGoalName) localStorage.setItem("StudyTracker_MonthlyHourGoalName", settings.monthlyHourGoalName);
    }

    await db.transaction("rw", db.tasks, db.sessions, db.withdrawals, db.debts, async () => {
        if (tasks?.length) {
            for (const t of tasks) {
                const { id, ...rest } = t;
                await db.tasks.put({ id, ...rest });
            }
            count += tasks.length;
        }
        if (sessions?.length) {
            for (const s of sessions) {
                const { id, ...rest } = s;
                await db.sessions.put({ id, ...rest });
            }
            count += sessions.length;
        }
        if (withdrawals?.length) {
            for (const w of withdrawals) {
                const { id, ...rest } = w;
                await db.withdrawals.put({ id, ...rest });
            }
            count += withdrawals.length;
        }
        if (debts?.length) {
            for (const d of debts) {
                const { id, ...rest } = d;
                await db.debts.put({ id, ...rest });
            }
            count += debts.length;
        }
    });
    return count;
}

export async function isDatabaseEmpty() {
    const taskCount = await db.tasks.count();
    const sessionCount = await db.sessions.count();
    return taskCount === 0 && sessionCount === 0;
}

export async function getTaskStats() {
    const allTasks = await db.tasks.toArray();
    const done = allTasks.filter((t) => t.completed).length;
    return { total: allTasks.length, done };
}

export async function getDataSnapshot() {
    const [tasks, sessions, withdrawals, debts] = await Promise.all([
        db.tasks.toArray(),
        db.sessions.toArray(),
        db.withdrawals.toArray(),
        db.debts.toArray()
    ]);
    const settings = {
        moneyGoal: localStorage.getItem("StudyTracker_MoneyGoal") || "10000000",
        monthlyHourGoal: localStorage.getItem("StudyTracker_MonthlyHourGoal") || "50",
        moneyGoalName: localStorage.getItem("StudyTracker_MoneyGoalName") || "Mục tiêu tích lũy",
        monthlyHourGoalName: localStorage.getItem("StudyTracker_MonthlyHourGoalName") || "Mục tiêu tháng"
    };
    return { version: 3, exportedAt: new Date().toISOString(), tasks, sessions, withdrawals, debts, settings };
}


export async function clearAllData() {
    await db.transaction("rw", db.tasks, db.sessions, db.withdrawals, db.debts, async () => {
        await db.tasks.clear();
        await db.sessions.clear();
        await db.withdrawals.clear();
        await db.debts.clear();
    });
}


export async function importData(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const payload = JSON.parse(e.target.result);
                const count = await importDataFromPayload(payload);
                resolve(count);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = reject;
        reader.readAsText(file);
    });
}
