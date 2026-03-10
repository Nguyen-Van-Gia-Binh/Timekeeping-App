import React, { useMemo } from "react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { Flame } from "lucide-react";

export function StreakBar({ dayRecords }) {
    const today = new Date();
    const weekDays = eachDayOfInterval({
        start: startOfWeek(today, { weekStartsOn: 1 }),
        end: endOfWeek(today, { weekStartsOn: 1 }),
    });
    const dayNames = ["T2", "T3", "T4", "T5", "T6", "T7", "CN"];
    const doneMap = useMemo(() => {
        const m = {};
        for (const r of dayRecords) {
            if (r.completedAll) m[r.date] = true;
        }
        return m;
    }, [dayRecords]);

    return (
        <div className="streak-bar">
            {weekDays.map((d, i) => {
                const key = format(d, "yyyy-MM-dd");
                const isDone = doneMap[key];
                const isToday = key === format(today, "yyyy-MM-dd");
                return (
                    <div
                        key={key}
                        className={`streak-day ${isDone ? "done" : ""} ${isToday && !isDone ? "today" : ""}`}
                        title={format(d, "dd/MM")}
                    >
                        {isDone ? "✓" : dayNames[i]}
                    </div>
                );
            })}
        </div>
    );
}

export default function StreakCard({ allRecords, weekly }) {
    return (
        <div className="card">
            <div className="section-header">
                <p className="card-title" style={{ marginBottom: 0 }}>
                    <Flame size={14} style={{ display: "inline", marginRight: 6, color: "var(--accent-warning)" }} />
                    Chuỗi tuần này (T2–CN)
                </p>
                {weekly.bonus > 0 && <span className="badge badge-gold">🏆 Tuần hoàn hảo</span>}
            </div>
            <StreakBar dayRecords={allRecords} />
        </div>
    );
}
