const fs = require('fs');
const { format, addDays, getYear, getMonth, getDate, differenceInDays } = require('date-fns');

// Config
const startDate = new Date('2024-01-01T00:00:00');
const endDate = new Date('2025-12-31T23:59:59');
const totalDays = differenceInDays(endDate, startDate) + 1;

console.log(`Generating data for ${totalDays} days (from ${format(startDate, 'yyyy-MM-dd')} to ${format(endDate, 'yyyy-MM-dd')})`);

const tasks = [];
const sessions = [];
const withdrawals = [];
const debts = [];

let taskIdCounter = 1;
let sessionIdCounter = 1;
let withdrawIdCounter = 1;
let debtIdCounter = 1;

let currentBalance = 0; // tracking balance loosely to create debts/withdrawals

for (let i = 0; i < totalDays; i++) {
    const d = addDays(startDate, i);
    const dateStr = format(d, 'yyyy-MM-dd');
    const dayOfWeek = d.getDay(); // 0 is Sunday, 1 is Monday ... 6 is Saturday

    // -- Generate Tasks
    // 3 tasks per day on average
    const numTasks = 3;
    let completedCount = 0;

    // Simulate behavior: weekend (0, 6) = lower completion chance, weekday = high completion chance
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const completionChance = isWeekend ? 0.6 : 0.9;

    for (let t = 0; t < numTasks; t++) {
        const isCompleted = Math.random() < completionChance;
        if (isCompleted) completedCount++;

        tasks.push({
            id: taskIdCounter++,
            dateKey: dateStr,
            text: `Task ${t + 1} for ${dateStr}`,
            completed: isCompleted,
            timestamp: d.getTime() + t * 1000,
        });
    }

    const allCompleted = completedCount === numTasks;

    // -- Generate Session (Study Time)
    // 1-4 hours on weekdays, 0-2 hours on weekends
    let studyHours = 0;
    if (isWeekend) {
        studyHours = Math.random() < 0.3 ? 0 : (Math.random() * 2 + 0.5); // 0 to 2.5 hours
    } else {
        studyHours = Math.random() < 0.1 ? 0 : (Math.random() * 3 + 1); // 1 to 4 hours
    }

    const studySeconds = Math.floor(studyHours * 3600);

    if (studySeconds > 0) {
        sessions.push({
            id: sessionIdCounter++,
            dateKey: dateStr,
            durationSeconds: studySeconds,
            startedAt: d.getTime(),
            endedAt: d.getTime() + studySeconds * 1000,
        });
    }

    // -- Calculate earnings loosely
    currentBalance += Math.floor(studySeconds / 3600) * 10000;
    if (allCompleted) currentBalance += 20000;

    // Monthly bonus logic (rough approx just to have money)
    if (getDate(d) === 28) {
        currentBalance += 700000; // pretend they got monthly bonus
    }

    // -- Generate Withdrawals
    // Chance to withdraw money contextually
    if (currentBalance > 100000 && Math.random() < 0.05) { // 5% chance per day if > 100k
        const amount = Math.floor(Math.random() * 5 + 1) * 20000; // 20k to 100k
        withdrawals.push({
            id: withdrawIdCounter++,
            amount: amount,
            reason: `Chi tiêu cá nhân ngày ${dateStr}`,
            timestamp: d.getTime() + 1000 * 7200,
        });
        currentBalance -= amount;
    }

    // -- Generate Debts
    // 1% chance per day to take a debt
    if (Math.random() < 0.01) {
        const amount = Math.floor(Math.random() * 10 + 1) * 50000; // 50k to 500k
        debts.push({
            id: debtIdCounter++,
            amount: amount,
            reason: `Vay tiền mua sắm tháng ${getMonth(d) + 1}`,
            timestamp: d.getTime() + 1000 * 8000,
            isPaid: false,
        });
    }
}

// Pay some debts back randomly over time (we'll just mark some past ones as paid)
debts.forEach(debt => {
    if (Math.random() < 0.7) { // 70% chance it's paid
        debt.isPaid = true;
        debt.amount = 0;
        // add a withdrawal for the payment
        withdrawals.push({
            id: withdrawIdCounter++,
            amount: 100000, // fake amount
            reason: `Trả nợ: ${debt.reason}`,
            timestamp: debt.timestamp + 86400000 * 5, // paid 5 days later
        });
    }
});

const payload = {
    version: 5,
    exportedAt: new Date().toISOString(),
    tasks,
    sessions,
    withdrawals,
    debts,
    settings: {
        moneyGoal: "20000000", // 20 million
        monthlyHourGoal: "60",
        moneyGoalName: "Mua Laptop mới",
        monthlyHourGoalName: "Kỷ luật 60h/tháng"
    }
};

const path = require('path');
const outPath = path.join(__dirname, 'TestData', 'test-data-2-years.json');
fs.mkdirSync(path.join(__dirname, 'TestData'), { recursive: true });
fs.writeFileSync(outPath, JSON.stringify(payload, null, 2), 'utf-8');
console.log('✅ Generated', outPath);
console.log(`Stats: ${tasks.length} tasks, ${sessions.length} sessions, ${withdrawals.length} withdrawals, ${debts.length} debts`);
