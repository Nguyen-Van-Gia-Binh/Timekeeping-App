// src/components/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { TrendingUp, BookOpen, Calendar, CheckCircle, Flame } from "lucide-react";
import { format, startOfWeek, endOfWeek, eachDayOfInterval } from "date-fns";
import { formatCurrency } from "../hooks/useBonusLogic";
import { addWithdrawal, addDebt } from "../services/localService";
import { useAppContext } from "../context/AppContext";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useToast } from "./Toast";
import WithdrawModal from "./WithdrawModal";
import DebtModal from "./DebtModal";
import GoalEditModal from "./GoalEditModal";
import SettingsModal from "./SettingsModal";
import { Settings as SettingsIcon } from "lucide-react";

const QUOTES = [
    "Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu!",
    "Hệ thống đã sẵn sàng, còn bạn thì sao?",
    "Một giờ học tập hôm nay, một bước lùi của sự tầm thường ngày mai.",
    "Bạn không cần phải hoàn hảo để bắt đầu, nhưng phải bắt đầu để trở nên hoàn hảo.",
    "Đừng dừng lại khi bạn mệt, hãy dừng lại khi bạn xong!"
];

/* ─── Streak Bar ─────────────────────────────────────────────────────── */
function StreakBar({ dayRecords }) {
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

/* ─── Dashboard ──────────────────────────────────────────────────────── */
export default function Dashboard() {
    const { refreshSignal, triggerRefresh } = useAppContext();
    const addToast = useToast();
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showMoneyGoalModal, setShowMoneyGoalModal] = useState(false);
    const [showHourGoalModal, setShowHourGoalModal] = useState(false);
    const [showSettingsModal, setShowSettingsModal] = useState(false);

    const quoteIndex = useMemo(() => new Date().getDate() % QUOTES.length, []);

    const {
        allRecords,
        withdrawals,
        currentBalance,
        totalBalance,
        totalWithdrawn,
        totalStudyHoursCount,
        longestStreak,
        weekly,
        monthly,
        taskCompletionRate,
        taskStats,
        thisMonthHours,
        goalPercentage,
        moneyGoal,
        setMoneyGoal,
        moneyGoalName,
        setMoneyGoalName,
        monthlyHourGoal,
        setMonthlyHourGoal,
        monthlyHourGoalName,
        setMonthlyHourGoalName,
        moneyGoalPercentage,
        todayHours,
        todayMissed,
        todayDone,
        todayTasks,
        debts,
        totalDebtAmount,
        isDailyFeeEnabled,
        setIsDailyFeeEnabled,
        isTargetPenaltyEnabled,
        setIsTargetPenaltyEnabled,
        load,
    } = useDashboardStats(refreshSignal);

    const handleWithdraw = async (amount, reason) => {
        await addWithdrawal(amount, reason);
        setShowWithdrawModal(false);
        load();
        triggerRefresh();
        addToast({ message: `💳 Rút ${formatCurrency(amount)} thành công!`, type: "info" });
    };

    const handleDebt = async (amount, reason) => {
        await addDebt(amount, reason);
        setShowDebtModal(false);
        load();
        triggerRefresh();
        addToast({ message: `💳 Đã tạm ứng ${formatCurrency(amount)}! Hãy cố gắng học để trả nợ nhé.`, type: "warning" });
    };

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Daily Quote & Settings */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div className="quote-banner" style={{ flex: 1, margin: 0 }}>
                    "{QUOTES[quoteIndex]}"
                </div>
                <button
                    className="btn btn-outline"
                    onClick={() => setShowSettingsModal(true)}
                    style={{ padding: "8px 12px", display: "flex", alignItems: "center", gap: 6, borderColor: "var(--border)", height: 48 }}
                >
                    <SettingsIcon size={16} /> <span className="hide-mobile">Cài đặt Động lực</span>
                </button>
            </div>

            {/* Balance Card */}
            <div className="card balance-card" style={{ position: "relative" }}>
                <p className="card-title">💰 {moneyGoalName}</p>

                <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                    <div className={`balance-amount ${currentBalance >= 0 ? "positive" : "negative"}`}>
                        {formatCurrency(currentBalance)}
                    </div>
                    {totalDebtAmount > 0 && (
                        <div style={{ color: "var(--accent-danger)", fontSize: 16, fontWeight: 600 }}>
                            (Nợ: -{formatCurrency(totalDebtAmount)})
                        </div>
                    )}
                </div>

                <p className="balance-subtitle">
                    Tổng thu nhập: {formatCurrency(totalBalance)} | Đã rút: {formatCurrency(totalWithdrawn)}
                </p>
                <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: 8 }}>
                    <button
                        className="btn btn-outline"
                        style={{ padding: "8px 16px", borderColor: "var(--accent-danger)", color: "var(--accent-danger)" }}
                        onClick={() => setShowDebtModal(true)}
                    >
                        Tạm ứng
                    </button>
                    <button
                        className="btn btn-primary"
                        style={{ padding: "8px 16px" }}
                        onClick={() => setShowWithdrawModal(true)}
                        id="btn-withdraw"
                    >
                        💳 Rút tiền
                    </button>
                </div>

                {/* Money Goal Progress */}
                <div className="balance-goal-section">
                    <div className="balance-goal-header">
                        <p className="balance-goal-label">
                            🎯 {moneyGoalName}:{" "}
                            <strong style={{ color: "var(--text-primary)" }}>{formatCurrency(moneyGoal)}</strong>
                            <span
                                className="balance-goal-edit"
                                onClick={() => setShowMoneyGoalModal(true)}
                            >
                                Sửa
                            </span>
                        </p>
                        <p className="balance-goal-pct">Đạt {moneyGoalPercentage}%</p>
                    </div>
                    <div className="progress-track">
                        <div
                            className="progress-fill"
                            style={{ width: `${moneyGoalPercentage}%`, background: "var(--accent-success)" }}
                        />
                    </div>
                    {currentBalance < moneyGoal && (
                        <p className="balance-goal-remaining">
                            Cố lên! Còn thiếu {formatCurrency(moneyGoal - currentBalance)} nữa.
                        </p>
                    )}
                </div>
            </div>

            {/* Stats Grid */}
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

            {/* Advanced Stats */}
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
                            onClick={() => setShowHourGoalModal(true)}
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

            {/* Streak */}
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

            {/* Withdraw History */}
            {withdrawals.length > 0 && (
                <div className="card">
                    <p className="card-title">🧾 Lịch sử rút tiền</p>
                    <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                        {withdrawals.map((w) => (
                            <div key={w.id} className="withdraw-history-item">
                                <div>
                                    <div style={{ fontWeight: 500 }}>{w.reason}</div>
                                    <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                        {format(new Date(w.timestamp), "dd/MM/yyyy HH:mm")}
                                    </div>
                                </div>
                                <div style={{ fontWeight: 600, color: "var(--accent-warning)" }}>
                                    -{formatCurrency(w.amount)}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Modals */}
            {showWithdrawModal && (
                <WithdrawModal
                    maxAmount={currentBalance}
                    onConfirm={handleWithdraw}
                    onCancel={() => setShowWithdrawModal(false)}
                />
            )}
            {showDebtModal && (
                <DebtModal
                    onConfirm={handleDebt}
                    onCancel={() => setShowDebtModal(false)}
                />
            )}
            {showMoneyGoalModal && (
                <GoalEditModal
                    title="Chỉnh mục tiêu tiền thưởng"
                    currentName={moneyGoalName}
                    currentValue={moneyGoal}
                    unit="VNĐ"
                    onConfirm={(name, val) => {
                        setMoneyGoal(val);
                        setMoneyGoalName(name);
                        setShowMoneyGoalModal(false);
                        addToast({ message: `🎯 "${name}": ${formatCurrency(val)}`, type: "success" });
                    }}
                    onCancel={() => setShowMoneyGoalModal(false)}
                />
            )}
            {showHourGoalModal && (
                <GoalEditModal
                    title="Chỉnh mục tiêu giờ học tháng"
                    currentName={monthlyHourGoalName}
                    currentValue={monthlyHourGoal}
                    unit="giờ"
                    onConfirm={(name, val) => {
                        setMonthlyHourGoal(val);
                        setMonthlyHourGoalName(name);
                        setShowHourGoalModal(false);
                        addToast({ message: `🏆 "${name}": ${val} giờ`, type: "success" });
                    }}
                    onCancel={() => setShowHourGoalModal(false)}
                />
            )}
            {showSettingsModal && (
                <SettingsModal
                    isDailyFeeEnabled={isDailyFeeEnabled}
                    setIsDailyFeeEnabled={setIsDailyFeeEnabled}
                    isTargetPenaltyEnabled={isTargetPenaltyEnabled}
                    setIsTargetPenaltyEnabled={setIsTargetPenaltyEnabled}
                    onClose={() => setShowSettingsModal(false)}
                />
            )}
        </div>
    );
}
