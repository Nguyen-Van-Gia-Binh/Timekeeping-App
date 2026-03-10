// src/services/financeService.js
// Withdrawals and debts CRUD
import { db } from "./db";

// ─── WITHDRAWALS ───────────────────────────────────────────────────────────────

export async function addWithdrawal(amount, reason) {
    return db.withdrawals.add({ amount, reason, timestamp: Date.now() });
}

export async function getWithdrawals() {
    return db.withdrawals.orderBy("timestamp").reverse().toArray();
}

// ─── DEBTS ─────────────────────────────────────────────────────────────────────

export async function addDebt(amount, reason) {
    return db.debts.add({ amount, reason, timestamp: Date.now(), isPaid: false });
}

export async function getUnpaidDebts() {
    const all = await db.debts.toArray();
    return all.filter((d) => !d.isPaid);
}

/**
 * Trả một phần hoặc toàn bộ khoản nợ.
 * Trả đủ: đánh dấu isPaid = true. Trả thiếu: giảm amount còn lại.
 */
export async function payDebt(debtId, amountToPay) {
    const debt = await db.debts.get(debtId);
    if (!debt) return 0;
    if (amountToPay >= debt.amount) {
        await db.debts.update(debtId, { isPaid: true, amount: 0 });
        return amountToPay - debt.amount; // trả dư
    }
    await db.debts.update(debtId, { amount: debt.amount - amountToPay });
    return 0;
}
