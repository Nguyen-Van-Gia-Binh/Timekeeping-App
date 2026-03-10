// src/hooks/useDashboardStats.js
import { useState, useEffect, useCallback, useMemo } from "react";
import { format, isSameMonth, parseISO } from "date-fns";
import {
    getAllDayRecords,
    getSessionsForDate,
    getTasksForDate,
    getWithdrawals,
    getTaskStats,
} from "../services/localService";
import {
    computeTotalBalance,
    calculateWeeklyAdjustments,
    calculateMonthlyAdjustments,
} from "../utils/financeLogic";

export function useDashboardStats(refreshSignal) {
    const todayKey = format(new Date(), "yyyy-MM-dd");

    const [dayRecords, setDayRecords] = useState([]);
    const [todayStudySec, setTodayStudySec] = useState(0);
    const [todayTasks, setTodayTasks] = useState([]);
    const [withdrawals, setWithdrawals] = useState([]);
    const [taskStats, setTaskStats] = useState({ total: 0, done: 0 });

    const [moneyGoal, setMoneyGoalState] = useState(() => {
        const saved = localStorage.getItem("StudyTracker_MoneyGoal");
        return saved ? parseInt(saved, 10) : 10000000;
    });

    const [monthlyHourGoal, setMonthlyHourGoalState] = useState(() => {
        const saved = localStorage.getItem("StudyTracker_MonthlyHourGoal");
        return saved ? parseInt(saved, 10) : 50;
    });

    const [moneyGoalName, setMoneyGoalNameState] = useState(() =>
        localStorage.getItem("StudyTracker_MoneyGoalName") || "Mục tiêu tích lũy"
    );

    const [monthlyHourGoalName, setMonthlyHourGoalNameState] = useState(() =>
        localStorage.getItem("StudyTracker_MonthlyHourGoalName") || "Mục tiêu tháng"
    );

    const setMoneyGoal = useCallback((val) => {
        setMoneyGoalState(val);
        localStorage.setItem("StudyTracker_MoneyGoal", val.toString());
    }, []);

    const setMonthlyHourGoal = useCallback((val) => {
        setMonthlyHourGoalState(val);
        localStorage.setItem("StudyTracker_MonthlyHourGoal", val.toString());
    }, []);

    const setMoneyGoalName = useCallback((name) => {
        setMoneyGoalNameState(name);
        localStorage.setItem("StudyTracker_MoneyGoalName", name);
    }, []);

    const setMonthlyHourGoalName = useCallback((name) => {
        setMonthlyHourGoalNameState(name);
        localStorage.setItem("StudyTracker_MonthlyHourGoalName", name);
    }, []);

    const load = useCallback(async () => {
        const [records, sessions, tasks, wData, stats] = await Promise.all([
            getAllDayRecords(),
            getSessionsForDate(todayKey),
            getTasksForDate(todayKey),
            getWithdrawals(),
            getTaskStats(),
        ]);
        setDayRecords(records);
        setTodayStudySec(sessions.reduce((a, s) => a + (s.durationSeconds || 0), 0));
        setTodayTasks(tasks);
        setWithdrawals(wData);
        setTaskStats(stats);
    }, [todayKey]);

    useEffect(() => {
        // Đồng bộ lại từ localStorage (hữu ích khi vừa Import/Reset data)
        setMoneyGoalState(parseInt(localStorage.getItem("StudyTracker_MoneyGoal") || "10000000", 10));
        setMonthlyHourGoalState(parseInt(localStorage.getItem("StudyTracker_MonthlyHourGoal") || "50", 10));
        setMoneyGoalNameState(localStorage.getItem("StudyTracker_MoneyGoalName") || "Mục tiêu tích lũy");
        setMonthlyHourGoalNameState(localStorage.getItem("StudyTracker_MonthlyHourGoalName") || "Mục tiêu tháng");

        load();
    }, [load, refreshSignal]);

    // Build today's snapshot merged in
    const allRecords = useMemo(() => {
        const todayRecord = {
            date: todayKey,
            completedAll: todayTasks.length > 0 && todayTasks.every((t) => t.completed),
            missedCount: todayTasks.filter((t) => !t.completed).length,
            studySeconds: todayStudySec,
        };
        return [...dayRecords.filter((r) => r.date !== todayKey), todayRecord];
    }, [dayRecords, todayTasks, todayStudySec, todayKey]);

    const sortedRecords = useMemo(
        () => [...allRecords].sort((a, b) => a.date.localeCompare(b.date)),
        [allRecords]
    );

    const totalBalance = useMemo(() => computeTotalBalance(sortedRecords), [sortedRecords]);

    const totalWithdrawn = useMemo(
        () => withdrawals.reduce((acc, w) => acc + w.amount, 0),
        [withdrawals]
    );

    const currentBalance = totalBalance - totalWithdrawn;

    const totalStudyHoursCount = useMemo(
        () => (allRecords.reduce((sum, r) => sum + r.studySeconds, 0) / 3600).toFixed(1),
        [allRecords]
    );

    const longestStreak = useMemo(() => {
        let best = 0;
        let current = 0;
        for (const r of sortedRecords) {
            if (r.completedAll) {
                current++;
                if (current > best) best = current;
            } else {
                current = 0;
            }
        }
        return best;
    }, [sortedRecords]);

    const weekly = useMemo(() => calculateWeeklyAdjustments(allRecords), [allRecords]);
    const monthly = useMemo(() => calculateMonthlyAdjustments(allRecords), [allRecords]);

    const taskCompletionRate = useMemo(
        () => (taskStats.total > 0 ? Math.round((taskStats.done / taskStats.total) * 100) : 0),
        [taskStats]
    );

    const thisMonthHours = useMemo(
        () =>
            sortedRecords
                .filter((r) => isSameMonth(parseISO(r.date), new Date()))
                .reduce((sum, r) => sum + r.studySeconds, 0) / 3600,
        [sortedRecords]
    );

    const goalPercentage = useMemo(
        () => Math.min(100, Math.round((thisMonthHours / monthlyHourGoal) * 100)),
        [thisMonthHours, monthlyHourGoal]
    );

    const moneyGoalPercentage = useMemo(
        () => Math.min(100, Math.round((currentBalance / moneyGoal) * 100)) || 0,
        [currentBalance, moneyGoal]
    );

    const todayHours = Math.floor(todayStudySec / 3600);
    const todayMissed = todayTasks.filter((t) => !t.completed).length;
    const todayDone = todayTasks.length > 0 && todayMissed === 0;

    return {
        todayKey,
        allRecords,
        todayStudySec,
        todayTasks,
        withdrawals,
        taskStats,
        totalBalance,
        totalWithdrawn,
        currentBalance,
        totalStudyHoursCount,
        longestStreak,
        weekly,
        monthly,
        taskCompletionRate,
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
        load,
    };
}
