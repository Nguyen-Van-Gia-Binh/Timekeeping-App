// src/components/TaskSection.jsx
import React, { useState, useEffect, useRef } from "react";
import { Plus, Trash2, Check } from "lucide-react";
import { addTask, updateTask, deleteTask, getTasksForDate } from "../services/localService";
import { format } from "date-fns";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";

export default function TaskSection({ dateKey }) {
    const { refreshSignal, triggerRefresh } = useAppContext();
    const addToast = useToast();
    const [tasks, setTasks] = useState([]);
    const [inputValue, setInputValue] = useState("");
    const mountedRef = useRef(true);

    useEffect(() => {
        mountedRef.current = true;
        loadTasks();
        return () => { mountedRef.current = false; };
    }, [dateKey, refreshSignal]);

    async function loadTasks() {
        const data = await getTasksForDate(dateKey);
        data.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
        if (mountedRef.current) setTasks(data);
    }

    const handleAdd = async () => {
        const title = inputValue.trim();
        if (!title) return;
        setInputValue("");
        await addTask(title);
        await loadTasks();
        triggerRefresh();
    };

    const handleToggle = async (task) => {
        await updateTask(task.id, { completed: !task.completed });
        await loadTasks();
        triggerRefresh();
        // Check if all done after toggle
        const updated = await getTasksForDate(dateKey);
        const allDone = updated.length > 0 && updated.every((t) => t.completed);
        if (!task.completed && allDone) {
            addToast({ message: "🎉 Hoàn thành tất cả nhiệm vụ hôm nay! +20,000đ", type: "success", duration: 4000 });
        }
    };

    const handleDelete = async (id) => {
        await deleteTask(id);
        await loadTasks();
        triggerRefresh();
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleAdd();
    };

    const completedCount = tasks.filter((t) => t.completed).length;
    const allDone = tasks.length > 0 && completedCount === tasks.length;

    return (
        <div className="card">
            <div className="section-header">
                <div>
                    <p className="card-title" style={{ marginBottom: 4 }}>📋 Nhiệm vụ hôm nay</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        {completedCount}/{tasks.length} hoàn thành
                        {allDone && tasks.length > 0 && (
                            <span className="badge badge-success" style={{ marginLeft: 8 }}>
                                🎉 Hoàn tất ngày! +20,000đ
                            </span>
                        )}
                    </p>
                </div>
                <span className="badge badge-info">
                    {format(new Date(dateKey + "T00:00:00"), "dd/MM")}
                </span>
            </div>

            <div className="task-input-row">
                <input
                    className="task-input"
                    id="input-new-task"
                    type="text"
                    placeholder="Thêm nhiệm vụ mới…"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
                <button
                    className="btn btn-primary btn-icon"
                    style={{ width: 40, height: 40 }}
                    onClick={handleAdd}
                    disabled={!inputValue.trim()}
                    id="btn-add-task"
                    title="Thêm task"
                >
                    <Plus size={18} />
                </button>
            </div>

            {tasks.length === 0 ? (
                <div className="empty-state">
                    <p>Chưa có nhiệm vụ nào hôm nay.</p>
                    <p style={{ marginTop: 4 }}>Hãy thêm task đầu tiên! 🚀</p>
                </div>
            ) : (
                <div>
                    {tasks.map((task) => (
                        <div key={task.id} className={`task-item ${task.completed ? "completed" : ""}`}>
                            <div
                                className={`task-checkbox ${task.completed ? "checked" : ""}`}
                                onClick={() => handleToggle(task)}
                                id={`checkbox-task-${task.id}`}
                            >
                                {task.completed && <Check size={12} strokeWidth={3} color="#1a2e1a" />}
                            </div>
                            <span className={`task-name ${task.completed ? "done" : ""}`}>{task.title}</span>
                            <button
                                className="task-delete-btn"
                                onClick={() => handleDelete(task.id)}
                                id={`btn-delete-task-${task.id}`}
                                title="Xóa task"
                            >
                                <Trash2 size={14} />
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
