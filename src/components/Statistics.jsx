// src/components/Statistics.jsx
import React, { useState } from "react";
import { useStatisticsData } from "../hooks/useStatisticsData";
import StatisticsChart from "./StatisticsChart";

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
    const [timeRange, setTimeRange] = useState("day");
    const [metric, setMetric] = useState("hours");

    const { chartData, summaryStats } = useStatisticsData(timeRange, metric);

    const isHours = metric === "hours";
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

            {/* Chart — delegated to StatisticsChart */}
            <div style={{ flex: 1, minHeight: 280 }}>
                <StatisticsChart chartData={chartData} metric={metric} />
            </div>
        </div>
    );
}
