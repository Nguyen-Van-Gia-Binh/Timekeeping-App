import React from "react";
import { formatCurrency } from "../utils/financeLogic";

export default function BalanceCard({
    moneyGoalName,
    currentBalance,
    totalBalance,
    totalWithdrawn,
    moneyGoal,
    moneyGoalPercentage,
    onShowMoneyGoalModal
}) {
    return (
        <div className="card balance-card">
            <p className="card-title">💰 {moneyGoalName}</p>

            <div className={`balance-amount ${currentBalance >= 0 ? "positive" : "negative"}`}>
                {formatCurrency(currentBalance)}
            </div>

            <p className="balance-subtitle">
                Tổng thu nhập: {formatCurrency(totalBalance)} | Đã rút: {formatCurrency(totalWithdrawn)}
            </p>

            {/* Money Goal Progress */}
            <div className="balance-goal-section">
                <div className="balance-goal-header">
                    <p className="balance-goal-label">
                        🎯 {moneyGoalName}:{" "}
                        <strong style={{ color: "var(--text-primary)" }}>{formatCurrency(moneyGoal)}</strong>
                        <span
                            className="balance-goal-edit"
                            onClick={onShowMoneyGoalModal}
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
    );
}
