// src/components/Statistics.jsx
import React, { useState, useEffect, useMemo } from "react";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import {
    format, startOfWeek, endOfWeek,
    eachDayOfInterval, startOfMonth, endOfMonth,
    parseISO, subDays
} from "date-fns";
import { vi } from "date-fns/locale";
import { getAllDayRecords } from "../services/localService";

import { useAppContext } from "../context/AppContext";

const TIME_TABS = [
    { id: "day", label: "14 ngày" },
    { id: "week", label: "8 tuần" },
    { id: "month", label: "12 tháng" },
    { id: "year", label: "Theo năm" },
];

const METRIC_TABS = [
    { id: "hours", label: "📚 Giờ học" },
    { id: "tasks", label: "✅ Task hoàn thành" },
];

export default function Statistics() {
    const { refreshSignal } = useAppContext();
    const [dayRecords, setDayRecords] = useState([]);
    const [timeRange, setTimeRange] = useState("day");
    const [metric, setMetric] = useState("hours");

    useEffect(() => {
        async function loadData() {
            const records = await getAllDayRecords();
            setDayRecords(records);
        }
        loadData();
    }, [refreshSignal]);

    const chartData = useMemo(() => {
        const today = new Date();
        const records = dayRecords || [];

        if (timeRange === "day") {
            const start = subDays(today, 13);
            const days = eachDayOfInterval({ start, end: today });
            return days.map(d => {
                const key = format(d, "yyyy-MM-dd");
                const record = records.find(r => r.date === key);
                return {
                    name: format(d, "dd/MM"),
                    hours: record ? Number((record.studySeconds / 3600).toFixed(1)) : 0,
                    tasks: record ? (record.missedCount === 0 && record.completedAll ? 1 : 0) : 0,
                    tasksLabel: record?.completedAll ? "✓" : "✗",
                };
            });
        }

        if (timeRange === "week") {
            const data = [];
            for (let i = 7; i >= 0; i--) {
                const d = subDays(today, i * 7);
                const wStart = startOfWeek(d, { weekStartsOn: 1 });
                const wEnd = endOfWeek(d, { weekStartsOn: 1 });
                const weekRecs = records.filter(r => { const rd = parseISO(r.date); return rd >= wStart && rd <= wEnd; });
                const weekSeconds = weekRecs.reduce((sum, r) => sum + (r.studySeconds || 0), 0);
                const completedDays = weekRecs.filter(r => r.completedAll).length;
                data.push({
                    name: `${format(wStart, "dd/MM")}`,
                    hours: Number((weekSeconds / 3600).toFixed(1)),
                    tasks: completedDays,
                });
            }
            return data;
        }

        if (timeRange === "month") {
            // 12 tháng gần nhất tính từ tháng hiện tại
            const data = [];
            for (let i = 11; i >= 0; i--) {
                const d = new Date(today.getFullYear(), today.getMonth() - i, 1);
                const mStart = startOfMonth(d);
                const mEnd = endOfMonth(d);
                const monthRecs = records.filter(r => {
                    const rd = parseISO(r.date);
                    return rd >= mStart && rd <= mEnd;
                });
                const monthSecs = monthRecs.reduce((sum, r) => sum + (r.studySeconds || 0), 0);
                const completedDays = monthRecs.filter(r => r.completedAll).length;
                const yearSuffix = d.getFullYear() !== today.getFullYear() ? `'${format(d, "yy")}` : "";
                const label = `T${format(d, "MM")}${yearSuffix}`;
                data.push({
                    name: label,
                    hours: Number((monthSecs / 3600).toFixed(1)),
                    tasks: completedDays,
                });
            }
            return data;
        }

        if (timeRange === "year") {
            const currentYear = today.getFullYear();
            let firstYear = currentYear - 4; // Hiển thị mặc định 5 năm đổ lại nếu không có data

            if (records.length > 0) {
                const dates = records.map(r => parseISO(r.date)).sort((a, b) => a - b);
                const dataFirstYear = dates[0].getFullYear();
                if (dataFirstYear < firstYear) firstYear = dataFirstYear;
            }

            const data = [];
            for (let y = firstYear; y <= currentYear; y++) {
                const yearRecs = records.filter(r => parseISO(r.date).getFullYear() === y);
                const yearSecs = yearRecs.reduce((sum, r) => sum + (r.studySeconds || 0), 0);
                const completedDays = yearRecs.filter(r => r.completedAll).length;
                data.push({
                    name: y.toString(),
                    hours: Number((yearSecs / 3600).toFixed(1)),
                    tasks: completedDays,
                });
            }
            return data;
        }

        return [];
    }, [dayRecords, timeRange]);

    const summaryStats = useMemo(() => {
        const totalHours = (dayRecords.reduce((sum, r) => sum + r.studySeconds, 0) / 3600).toFixed(1);
        const completedDays = dayRecords.filter(r => r.completedAll).length;
        let longestStreak = 0, cur = 0;
        const sorted = [...dayRecords].sort((a, b) => a.date.localeCompare(b.date));
        for (const r of sorted) {
            if (r.completedAll) { cur++; if (cur > longestStreak) longestStreak = cur; }
            else cur = 0;
        }
        const totalVisible = metric === "hours"
            ? chartData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)
            : chartData.reduce((sum, d) => sum + d.tasks, 0);
        return { totalHours, completedDays, longestStreak, totalVisible };
    }, [dayRecords, chartData, metric]);

    const isHours = metric === "hours";
    const dataKey = isHours ? "hours" : "tasks";
    const color = isHours ? "#63b3ed" : "#68d391";

    return (
        <div className="card" style={{ height: "100%", display: "flex", flexDirection: "column", gap: 20 }}>

            {/* Summary Cards */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
                {[
                    { label: "📚 Tổng giờ học", value: `${summaryStats.totalHours}h` },
                    { label: "✅ Ngày hoàn thành", value: `${summaryStats.completedDays} ngày` },
                    { label: "🔥 Streak dài nhất", value: `${summaryStats.longestStreak} ngày` },
                ].map((s) => (
                    <div key={s.label} style={{
                        background: "var(--bg-secondary)",
                        border: "1px solid var(--border)",
                        borderRadius: "var(--radius-md)",
                        padding: "12px 16px",
                        textAlign: "center",
                    }}>
                        <p style={{ fontSize: 11, color: "var(--text-secondary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 }}>{s.label}</p>
                        <p style={{ fontSize: 20, fontWeight: 700, color: "var(--text-primary)" }}>{s.value}</p>
                    </div>
                ))}
            </div>

            {/* Controls */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 12 }}>
                <div>
                    <p className="card-title" style={{ marginBottom: 4 }}>📈 Thống kê chi tiết</p>
                    <p style={{ fontSize: 13, color: "var(--text-secondary)" }}>
                        Tổng kỳ này:{" "}
                        <strong style={{ color: "var(--accent-info)" }}>
                            {summaryStats.totalVisible}{isHours ? " giờ" : " ngày hoàn thành"}
                        </strong>
                    </p>
                </div>

                <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-end" }}>
                    {/* Metric toggle */}
                    <div style={{ display: "flex", gap: "6px", background: "var(--bg-secondary)", padding: 3, borderRadius: 8 }}>
                        {METRIC_TABS.map((t) => (
                            <button key={t.id} onClick={() => setMetric(t.id)} style={{
                                background: metric === t.id ? color : "transparent",
                                color: metric === t.id ? "#0a0e1a" : "var(--text-secondary)",
                                border: "none", padding: "5px 12px", borderRadius: 6,
                                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                            }}>{t.label}</button>
                        ))}
                    </div>
                    {/* Time range toggle */}
                    <div style={{ display: "flex", gap: "6px", background: "var(--bg-secondary)", padding: 3, borderRadius: 8 }}>
                        {TIME_TABS.map((t) => (
                            <button key={t.id} onClick={() => setTimeRange(t.id)} style={{
                                background: timeRange === t.id ? "var(--accent-info)" : "transparent",
                                color: timeRange === t.id ? "#fff" : "var(--text-secondary)",
                                border: "none", padding: "5px 10px", borderRadius: 6,
                                fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s",
                            }}>{t.label}</button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Chart */}
            <div style={{ flex: 1, minHeight: 280 }}>
                <ResponsiveContainer width="100%" height="100%">
                    {isHours ? (
                        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
                            <Tooltip
                                contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                itemStyle={{ color, fontWeight: 600 }}
                                labelStyle={{ color: "#9ca3af", marginBottom: 4 }}
                                formatter={(v) => [`${v} giờ`, "Thời gian học"]}
                            />
                            <Line type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3}
                                dot={{ fill: "#1f2937", stroke: color, strokeWidth: 2, r: 4 }}
                                activeDot={{ r: 6, strokeWidth: 0, fill: color }} />
                        </LineChart>
                    ) : (
                        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                            <XAxis dataKey="name" stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                            <YAxis stroke="#9ca3af" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                            <Tooltip
                                contentStyle={{ background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 }}
                                itemStyle={{ color, fontWeight: 600 }}
                                labelStyle={{ color: "#9ca3af", marginBottom: 4 }}
                                formatter={(v) => [`${v} ngày`, "Ngày hoàn thành task"]}
                            />
                            <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                        </BarChart>
                    )}
                </ResponsiveContainer>
            </div>
        </div>
    );
}
