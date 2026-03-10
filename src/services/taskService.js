// src/services/taskService.js
// CRUD operations on tasks table
import { db } from "./db";
import { format } from "date-fns";

export async function addTask(title) {
    const dateKey = format(new Date(), "yyyy-MM-dd");
    return db.tasks.add({ dateKey, title, completed: false, createdAt: Date.now() });
}

export async function updateTask(id, updates) {
    return db.tasks.update(id, updates);
}

export async function deleteTask(id) {
    return db.tasks.delete(id);
}

export async function getTasksForDate(dateKey) {
    return db.tasks.where("dateKey").equals(dateKey).toArray();
}

export async function getTaskStats() {
    const allTasks = await db.tasks.toArray();
    return { total: allTasks.length, done: allTasks.filter((t) => t.completed).length };
}
