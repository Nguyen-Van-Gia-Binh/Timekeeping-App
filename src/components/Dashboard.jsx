// src/components/Dashboard.jsx
import React, { useState, useMemo } from "react";
import { formatCurrency } from "../utils/financeLogic";
import { useAppContext } from "../context/AppContext";
import { useDashboardStats } from "../hooks/useDashboardStats";
import { useToast } from "./Toast";

// Modals & tabs
import GoalEditModal from "./GoalEditModal";
import HelpTab from "./HelpTab";

// Extracted components
import BalanceCard from "./BalanceCard";
import BasicStats from "./BasicStats";
import AdvancedStats from "./AdvancedStats";
import StreakCard from "./StreakCard";

const QUOTES = [
    "Ky luat la cay cau noi giua muc tieu va thanh tuu!",
    "He thong da san sang, con ban thi sao?",
    "Mot gio hoc tap hom nay, mot buoc lui cua su tam thuong ngay mai.",
    "Ban khong can phai hoan hao de bat dau, nhung phai bat dau de tro nen hoan hao.",
    "Dung dung lai khi ban met, hay dung lai khi ban xong!"
];

const QUOTES_DISPLAY = [
    "Kỷ luật là cây cầu nối giữa mục tiêu và thành tựu!",
    "Hệ thống đã sẵn sàng, còn bạn thì sao?",
    "Một giờ học tập hôm nay, một bước lùi của sự tầm thường ngày mai.",
    "Bạn không cần phải hoàn hảo để bắt đầu, nhưng phải bắt đầu để trở nên hoàn hảo.",
    "Đừng dừng lại khi bạn mệt, hãy dừng lại khi bạn xong!"
];

export default function Dashboard() {
    const { refreshSignal } = useAppContext();
    const addToast = useToast();
    const [showMoneyGoalModal, setShowMoneyGoalModal] = useState(false);
    const [showHourGoalModal, setShowHourGoalModal] = useState(false);

    const quoteIndex = useMemo(() => new Date().getDate() % QUOTES_DISPLAY.length, []);

    const {
        allRecords,
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
        load,
    } = useDashboardStats(refreshSignal);

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>

            {/* Daily Quote */}
            <div className="quote-banner">
                "{QUOTES_DISPLAY[quoteIndex]}"
            </div>

            <BalanceCard
                moneyGoalName={moneyGoalName}
                currentBalance={currentBalance}
                totalBalance={totalBalance}
                totalWithdrawn={totalWithdrawn}
                moneyGoal={moneyGoal}
                moneyGoalPercentage={moneyGoalPercentage}
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

            <HelpTab />

            {/* Goal Modals */}
            {showMoneyGoalModal && (
                <GoalEditModal
                    title="Chinh muc tieu tien thuong"
                    currentName={moneyGoalName}
                    currentValue={moneyGoal}
                    unit="VND"
                    onConfirm={(name, val) => {
                        setMoneyGoal(val);
                        setMoneyGoalName(name);
                        setShowMoneyGoalModal(false);
                        addToast({ message: `Muc tieu: "${name}" - ${formatCurrency(val)}`, type: "success" });
                    }}
                    onCancel={() => setShowMoneyGoalModal(false)}
                />
            )}
            {showHourGoalModal && (
                <GoalEditModal
                    title="Chinh muc tieu gio hoc thang"
                    currentName={monthlyHourGoalName}
                    currentValue={monthlyHourGoal}
                    unit="gio"
                    onConfirm={(name, val) => {
                        setMonthlyHourGoal(val);
                        setMonthlyHourGoalName(name);
                        setShowHourGoalModal(false);
                        addToast({ message: `Muc tieu: "${name}" - ${val} gio`, type: "success" });
                    }}
                    onCancel={() => setShowHourGoalModal(false)}
                />
            )}
        </div>
    );
}
