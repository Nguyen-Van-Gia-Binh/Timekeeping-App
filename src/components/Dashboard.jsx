// src/components/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { formatCurrency } from "../hooks/useBonusLogic";
import { addWithdrawal, addDebt, payDebt } from "../services/localService";
import { useAppContext } from "../context/AppContext";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useToast } from "./Toast";

// Existing modals & tabs
import WithdrawModal from "./WithdrawModal";
import DebtModal from "./DebtModal";
import PayDebtModal from "./PayDebtModal";
import GoalEditModal from "./GoalEditModal";
import SettingsModal from "./SettingsModal";
import HelpTab from "./HelpTab";
import { Settings as SettingsIcon } from "lucide-react";

// New extracted components
import BalanceCard from "./BalanceCard";
import BasicStats from "./BasicStats";
import AdvancedStats from "./AdvancedStats";
import StreakCard from "./StreakCard";
import WithdrawHistory from "./WithdrawHistory";

const QUOTES = [
    "Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu!",
    "Hệ thống đã sẵn sàng, còn bạn thì sao?",
    "Một giờ học tập hôm nay, một bước lùi của sự tầm thường ngày mai.",
    "Bạn không cần phải hoàn hảo để bắt đầu, nhưng phải bắt đầu để trở nên hoàn hảo.",
    "Đừng dừng lại khi bạn mệt, hãy dừng lại khi bạn xong!"
];

export default function Dashboard() {
    const { refreshSignal, triggerRefresh } = useAppContext();
    const addToast = useToast();
    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showPayDebtModal, setShowPayDebtModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
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

    const handlePayDebt = async (amountToPay, debt) => {
        if (!debt || amountToPay <= 0) return;

        await payDebt(debt.id, amountToPay);
        await addWithdrawal(amountToPay, `Trả nợ: ${debt.reason}`);

        setShowPayDebtModal(false);
        setSelectedDebt(null);
        load();
        triggerRefresh();
        addToast({ message: `✅ Đã trả ${formatCurrency(amountToPay)} cho khoản nợ!`, type: "success" });
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

            <BalanceCard
                moneyGoalName={moneyGoalName}
                currentBalance={currentBalance}
                totalDebtAmount={totalDebtAmount}
                debts={debts}
                totalBalance={totalBalance}
                totalWithdrawn={totalWithdrawn}
                moneyGoal={moneyGoal}
                moneyGoalPercentage={moneyGoalPercentage}
                onShowDebtModal={() => setShowDebtModal(true)}
                onShowWithdrawModal={() => setShowWithdrawModal(true)}
                onShowPayDebtModal={(debt) => {
                    setSelectedDebt(debt);
                    setShowPayDebtModal(true);
                }}
                onShowMoneyGoalModal={() => setShowMoneyGoalModal(true)}
            />

            <BasicStats
                todayHours={todayHours}
                todayDone={todayDone}
                todayTasks={todayTasks}
                todayMissed={todayMissed}
                weekly={weekly}
                monthly={monthly}
            />

            <AdvancedStats
                longestStreak={longestStreak}
                totalStudyHoursCount={totalStudyHoursCount}
                taskCompletionRate={taskCompletionRate}
                taskStats={taskStats}
                monthlyHourGoalName={monthlyHourGoalName}
                monthlyHourGoal={monthlyHourGoal}
                goalPercentage={goalPercentage}
                thisMonthHours={thisMonthHours}
                onShowHourGoalModal={() => setShowHourGoalModal(true)}
            />

            <StreakCard
                allRecords={allRecords}
                weekly={weekly}
            />

            <WithdrawHistory withdrawals={withdrawals} />

            <HelpTab />

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
            {showPayDebtModal && (
                <PayDebtModal
                    currentBalance={currentBalance}
                    debt={selectedDebt}
                    onConfirm={handlePayDebt}
                    onCancel={() => {
                        setShowPayDebtModal(false);
                        setSelectedDebt(null);
                    }}
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
