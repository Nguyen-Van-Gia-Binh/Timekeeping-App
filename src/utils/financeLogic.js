// src/utils/financeLogic.js
// Pure financial calculation functions (no React dependencies)
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
} from "date-fns";

/**
 * Tính tổng thu nhập từ giờ học và thưởng hoàn thành task.
 * +10k/giờ học đầy đủ, +20k mỗi ngày hoàn thành tất cả task.
 */
export function calculateBalance(dayRecords) {
    let balance = 0;
    for (const day of dayRecords) {
        balance += Math.floor((day.studySeconds || 0) / 3600) * 10000;
        if (day.completedAll) balance += 20000;
    }
    return balance;
}

/**
 * Tính thưởng/phạt theo tuần (Mon–Sun).
 * Tuần hoàn hảo (7/7 ngày): +100k. Lười ≥5 task missed: -20k.
 */
export function calculateWeeklyAdjustments(dayRecords) {
    if (!dayRecords?.length) return { bonus: 0, penalty: 0 };

    const weekMap = {};
    for (const day of dayRecords) {
        const weekStart = format(startOfWeek(new Date(day.date), { weekStartsOn: 1 }), "yyyy-MM-dd");
        if (!weekMap[weekStart]) weekMap[weekStart] = { missedCount: 0, completedAllDays: true, dayCount: 0 };
        weekMap[weekStart].missedCount += day.missedCount || 0;
        if (!day.completedAll) weekMap[weekStart].completedAllDays = false;
        weekMap[weekStart].dayCount++;
    }

    let totalBonus = 0, totalPenalty = 0;
    for (const week of Object.values(weekMap)) {
        if (week.completedAllDays && week.dayCount === 7) totalBonus += 100000;
        if (week.missedCount >= 5) totalPenalty += 20000;
    }
    return { bonus: totalBonus, penalty: totalPenalty };
}

/**
 * Tính thưởng/phạt theo tháng.
 * Tháng hoàn hảo (đủ ngày): +700k. Lười ≥25 task missed: -200k.
 */
export function calculateMonthlyAdjustments(dayRecords) {
    if (!dayRecords?.length) return { bonus: 0, penalty: 0 };

    const monthMap = {};
    for (const day of dayRecords) {
        const d = new Date(day.date);
        const monthKey = format(d, "yyyy-MM");
        const daysInMonth = eachDayOfInterval({ start: startOfMonth(d), end: endOfMonth(d) }).length;
        if (!monthMap[monthKey]) monthMap[monthKey] = { missedCount: 0, completedAllDays: true, dayCount: 0, daysInMonth };
        monthMap[monthKey].missedCount += day.missedCount || 0;
        if (!day.completedAll) monthMap[monthKey].completedAllDays = false;
        monthMap[monthKey].dayCount++;
    }

    let totalBonus = 0, totalPenalty = 0;
    for (const month of Object.values(monthMap)) {
        if (month.completedAllDays && month.dayCount === month.daysInMonth) totalBonus += 700000;
        if (month.missedCount >= 25) totalPenalty += 200000;
    }
    return { bonus: totalBonus, penalty: totalPenalty };
}

/**
 * Tổng số dư từ tất cả bản ghi (học tập + thưởng tuần/tháng).
 */
export function computeTotalBalance(dayRecords) {
    const base = calculateBalance(dayRecords);
    const weekly = calculateWeeklyAdjustments(dayRecords);
    const monthly = calculateMonthlyAdjustments(dayRecords);
    return base + weekly.bonus - weekly.penalty + monthly.bonus - monthly.penalty;
}

/**
 * Sinh mảng giao dịch ảo từ dayRecords + withdrawals.
 * Mỗi item: { id, timestamp, type: 'INCOME'|'EXPENSE', amount, reason }
 */
export function generateTransactionHistory(dayRecords, withdrawals) {
    const transactions = [];
    let virtualId = 1;

    const addTx = (timestamp, type, amount, reason) => {
        if (amount > 0) transactions.push({ id: `virtual-${virtualId++}`, timestamp, type, amount, reason });
    };

    // 1. Từng ngày: thu nhập học tập + thưởng hoàn thành
    for (const day of dayRecords) {
        const tDate = new Date(`${day.date}T12:00:00`).getTime();
        const studyHours = (day.studySeconds || 0) / 3600;
        addTx(tDate + 1, "INCOME", Math.floor(studyHours) * 10000, `📚 Học ${studyHours.toFixed(1)} giờ`);
        if (day.completedAll) addTx(tDate + 2, "INCOME", 20000, `✅ Hoàn thành tất cả nhiệm vụ ngày`);
    }

    // 2. Thưởng/phạt tuần & tháng
    if (dayRecords.length > 0) {
        const weekMap = {}, monthMap = {};
        for (const day of dayRecords) {
            const d = new Date(day.date);
            const weekStart = format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
            const monthKey = format(d, "yyyy-MM");
            const daysInMonth = eachDayOfInterval({ start: startOfMonth(d), end: endOfMonth(d) }).length;

            if (!weekMap[weekStart]) weekMap[weekStart] = { missedCount: 0, completedAllDays: true, dayCount: 0, lastDate: day.date };
            if (!monthMap[monthKey]) monthMap[monthKey] = { missedCount: 0, completedAllDays: true, dayCount: 0, daysInMonth, lastDate: day.date };

            weekMap[weekStart].missedCount += day.missedCount || 0;
            if (!day.completedAll) weekMap[weekStart].completedAllDays = false;
            weekMap[weekStart].dayCount++;
            weekMap[weekStart].lastDate = day.date;

            monthMap[monthKey].missedCount += day.missedCount || 0;
            if (!day.completedAll) monthMap[monthKey].completedAllDays = false;
            monthMap[monthKey].dayCount++;
            monthMap[monthKey].lastDate = day.date;
        }

        for (const [week, data] of Object.entries(weekMap)) {
            const tDate = new Date(`${data.lastDate}T23:59:00`).getTime();
            if (data.completedAllDays && data.dayCount === 7) addTx(tDate, "INCOME", 100000, `🏆 Thưởng tuần hoàn hảo (Tuần ${week})`);
        }
        for (const [month, data] of Object.entries(monthMap)) {
            const tDate = new Date(`${data.lastDate}T23:59:59`).getTime();
            if (data.completedAllDays && data.dayCount === data.daysInMonth) addTx(tDate, "INCOME", 700000, `🎉 Thưởng tháng xuất sắc (${month})`);
        }
    }

    // 3. Rút tiền / nợ
    for (const w of withdrawals) {
        addTx(w.timestamp, "EXPENSE", w.amount, `💸 ${w.reason}`);
    }

    return transactions.sort((a, b) => b.timestamp - a.timestamp);
}

/**
 * Format số tiền theo định dạng VND Việt Nam.
 */
export function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}
