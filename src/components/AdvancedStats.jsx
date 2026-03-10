import React from "react";

export default function AdvancedStats({
    longestStreak,
    totalStudyHoursCount,
    taskCompletionRate,
    taskStats,
    monthlyHourGoalName,
    monthlyHourGoal,
    goalPercentage,
    thisMonthHours,
    onShowHourGoalModal
}) {
    return (
        <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4, 1fr)" }}>
            <div className="stat-card">
                <p className="stat-label">🔥 Kỷ lục chuỗi dài nhất</p>
                <p className="stat-value" style={{ color: "var(--accent-warning)" }}>{longestStreak} ngày</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Liên tiếp hoàn thành task</p>
            </div>
            <div className="stat-card">
                <p className="stat-label">⌛ Tổng giờ học trọn đời</p>
                <p className="stat-value blue">{totalStudyHoursCount} giờ</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>Tuyệt vời!</p>
            </div>
            <div className="stat-card">
                <p className="stat-label">🎯 Tỷ lệ hoàn thành task</p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <div className="progress-track" style={{ flex: 1 }}>
                        <div
                            className="progress-fill"
                            style={{ width: `${taskCompletionRate}%`, background: taskCompletionRate > 70 ? "var(--accent-success)" : "var(--accent-warning)" }}
                        />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{taskCompletionRate}%</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>{taskStats.done} / {taskStats.total} tasks</p>
            </div>
            <div className="stat-card">
                <p className="stat-label">
                    🏆 {monthlyHourGoalName} ({monthlyHourGoal}h){" "}
                    <span
                        style={{ color: "var(--accent-info)", cursor: "pointer", fontSize: 11, textDecoration: "underline" }}
                        onClick={onShowHourGoalModal}
                    >Sửa</span>
                </p>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 4 }}>
                    <div className="progress-track" style={{ flex: 1 }}>
                        <div className="progress-fill" style={{ width: `${goalPercentage}%`, background: "var(--accent-info)" }} />
                    </div>
                    <span style={{ fontSize: 16, fontWeight: 700 }}>{goalPercentage}%</span>
                </div>
                <p style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 6 }}>Đã học {thisMonthHours.toFixed(1)} giờ</p>
            </div>
        </div>
    );
}
