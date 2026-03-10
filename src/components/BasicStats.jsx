import React from "react";
import { TrendingUp, BookOpen, Calendar, CheckCircle } from "lucide-react";

export default function BasicStats({ todayHours, todayDone, todayTasks, todayMissed, weekly, monthly }) {
    return (
        <div className="stats-grid">
            <div className="stat-card">
                <p className="stat-label"><BookOpen size={12} style={{ display: "inline", marginRight: 4 }} />Hôm nay (giờ học)</p>
                <p className="stat-value blue">{todayHours} giờ</p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>+{(todayHours * 10000).toLocaleString("vi-VN")}đ</p>
            </div>
            <div className="stat-card">
                <p className="stat-label"><CheckCircle size={12} style={{ display: "inline", marginRight: 4 }} />Nhiệm vụ hôm nay</p>
                <p className={`stat-value ${todayDone ? "green" : "red"}`}>
                    {todayTasks.filter((t) => t.completed).length}/{todayTasks.length}
                </p>
                <p style={{ fontSize: 12, color: "var(--text-secondary)" }}>
                    {todayDone ? "+20,000đ 🎉" : todayMissed > 0 ? `-${(todayMissed * 10000).toLocaleString("vi-VN")}đ phạt` : "Chưa có task"}
                </p>
            </div>
            <div className="stat-card">
                <p className="stat-label"><TrendingUp size={12} style={{ display: "inline", marginRight: 4 }} />Thưởng tuần</p>
                <p className="stat-value green">+{weekly.bonus.toLocaleString("vi-VN")}đ</p>
                <p style={{ fontSize: 12, color: "var(--accent-danger)" }}>
                    {weekly.penalty > 0 ? `-${weekly.penalty.toLocaleString("vi-VN")}đ phạt` : "Chưa bị phạt 🔥"}
                </p>
            </div>
            <div className="stat-card">
                <p className="stat-label"><Calendar size={12} style={{ display: "inline", marginRight: 4 }} />Thưởng tháng</p>
                <p className="stat-value gold">+{monthly.bonus.toLocaleString("vi-VN")}đ</p>
                <p style={{ fontSize: 12, color: "var(--accent-danger)" }}>
                    {monthly.penalty > 0 ? `-${monthly.penalty.toLocaleString("vi-VN")}đ phạt` : "Chưa bị phạt 💪"}
                </p>
            </div>
        </div>
    );
}
