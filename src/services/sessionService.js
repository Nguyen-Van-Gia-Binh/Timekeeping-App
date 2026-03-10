// src/services/sessionService.js
// CRUD and aggregation for study sessions
import { db } from "./db";
import { format } from "date-fns";

export async function addStudySession(durationSeconds) {
    const dateKey = format(new Date(), "yyyy-MM-dd");
    return db.sessions.add({
        dateKey,
        durationSeconds,
        startedAt: Date.now() - durationSeconds * 1000,
        endedAt: Date.now(),
    });
}

export async function getSessionsForDate(dateKey) {
    return db.sessions.where("dateKey").equals(dateKey).toArray();
}

/**
 * Tổng hợp toàn bộ task và session thành day records để tính toán thu nhập.
 * Returns: [{ date, missedCount, completedAll, studySeconds }]
 */
export async function getAllDayRecords() {
    const [allTasks, allSessions] = await Promise.all([
        db.tasks.toArray(),
        db.sessions.toArray(),
    ]);

    const dayMap = {};
    for (const task of allTasks) {
        if (!dayMap[task.dateKey]) dayMap[task.dateKey] = { tasks: [], sessions: [] };
        dayMap[task.dateKey].tasks.push(task);
    }
    for (const s of allSessions) {
        if (!dayMap[s.dateKey]) dayMap[s.dateKey] = { tasks: [], sessions: [] };
        dayMap[s.dateKey].sessions.push(s);
    }

    return Object.entries(dayMap).map(([date, { tasks, sessions }]) => ({
        date,
        completedAll: tasks.length > 0 && tasks.every((t) => t.completed),
        missedCount: tasks.filter((t) => !t.completed).length,
        studySeconds: sessions.reduce((acc, s) => acc + (s.durationSeconds || 0), 0),
    }));
}
