// src/hooks/useBonusLogic.js
import {
    startOfWeek,
    endOfWeek,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    format,
    isSameDay,
} from "date-fns";

/**
 * Given an array of dayRecords (each having { date: Date, tasks: [], completedAll: bool, missedCount: number, studySeconds: number }),
 * calculate total balance.
 */
export function calculateBalance(dayRecords) {
    let balance = 0;

    for (const day of dayRecords) {
        // +10k per hour of study
        const studyHours = (day.studySeconds || 0) / 3600;
        balance += Math.floor(studyHours) * 10000;

        // Per-task penalty: -10k each missed task
        balance -= (day.missedCount || 0) * 10000;

        // Daily completion bonus: +20k
        if (day.completedAll) {
            balance += 20000;
        }
    }

    return balance;
}

/**
 * Weekly bonuses/penalties.
 * Week is Mon–Sun.
 * Returns an array of weekly adjustments { weekLabel, bonus, penalty }
 */
export function calculateWeeklyAdjustments(dayRecords) {
    if (!dayRecords || dayRecords.length === 0) return { bonus: 0, penalty: 0 };

    // Group records by ISO week (Mon-Sun)
    const weekMap = {};
    for (const day of dayRecords) {
        const d = new Date(day.date);
        const weekStart = format(startOfWeek(d, { weekStartsOn: 1 }), "yyyy-MM-dd");
        if (!weekMap[weekStart]) {
            weekMap[weekStart] = { missedCount: 0, completedAllDays: true, dayCount: 0 };
        }
        weekMap[weekStart].missedCount += day.missedCount || 0;
        if (!day.completedAll) weekMap[weekStart].completedAllDays = false;
        weekMap[weekStart].dayCount++;
    }

    let totalBonus = 0;
    let totalPenalty = 0;

    for (const week of Object.values(weekMap)) {
        if (week.completedAllDays && week.dayCount === 7) {
            totalBonus += 100000; // +100k for perfect week
        }
        if (week.missedCount >= 5) {
            totalPenalty += 20000; // -20k if 5+ tasks missed in week
        }
    }

    return { bonus: totalBonus, penalty: totalPenalty };
}

/**
 * Monthly bonuses/penalties.
 * Calendar month.
 */
export function calculateMonthlyAdjustments(dayRecords) {
    if (!dayRecords || dayRecords.length === 0) return { bonus: 0, penalty: 0 };

    // Group records by month (yyyy-MM)
    const monthMap = {};
    for (const day of dayRecords) {
        const d = new Date(day.date);
        const monthKey = format(d, "yyyy-MM");
        const daysInMonth = eachDayOfInterval({
            start: startOfMonth(d),
            end: endOfMonth(d),
        }).length;

        if (!monthMap[monthKey]) {
            monthMap[monthKey] = { missedCount: 0, completedAllDays: true, dayCount: 0, daysInMonth };
        }
        monthMap[monthKey].missedCount += day.missedCount || 0;
        if (!day.completedAll) monthMap[monthKey].completedAllDays = false;
        monthMap[monthKey].dayCount++;
    }

    let totalBonus = 0;
    let totalPenalty = 0;

    for (const month of Object.values(monthMap)) {
        // Only award monthly bonus if all days of the month are recorded as complete
        if (month.completedAllDays && month.dayCount === month.daysInMonth) {
            totalBonus += 700000;
        }
        if (month.missedCount >= 25) {
            totalPenalty += 200000;
        }
    }

    return { bonus: totalBonus, penalty: totalPenalty };
}

/**
 * Grand total balance from all records.
 */
export function computeTotalBalance(dayRecords) {
    const base = calculateBalance(dayRecords);
    const weekly = calculateWeeklyAdjustments(dayRecords);
    const monthly = calculateMonthlyAdjustments(dayRecords);
    return base + weekly.bonus - weekly.penalty + monthly.bonus - monthly.penalty;
}

export function formatCurrency(amount) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(amount);
}
