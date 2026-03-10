import React from "react";
import { formatCurrency } from "../hooks/useBonusLogic";

export default function BalanceCard({
    moneyGoalName,
    currentBalance,
    totalDebtAmount,
    debts,
    totalBalance,
    totalWithdrawn,
    moneyGoal,
    moneyGoalPercentage,
    onShowDebtModal,
    onShowWithdrawModal,
    onShowPayDebtModal,
    onShowMoneyGoalModal
}) {
    return (
        <div className="card balance-card" style={{ position: "relative" }}>
            <p className="card-title">💰 {moneyGoalName}</p>

            <div style={{ display: "flex", alignItems: "baseline", gap: 12 }}>
                <div className={`balance-amount ${currentBalance >= 0 ? "positive" : "negative"}`}>
                    {formatCurrency(currentBalance)}
                </div>
                {totalDebtAmount > 0 && (
                    <div style={{ color: "var(--accent-danger)", fontSize: 16, fontWeight: 600, display: "flex", alignItems: "center", gap: 8 }}>
                        (Nợ: -{formatCurrency(totalDebtAmount)})
                        <button
                            className="btn btn-primary"
                            style={{ padding: "4px 8px", fontSize: 12, height: "auto" }}
                            onClick={() => {
                                if (currentBalance <= 0) {
                                    window.alert("❌ Số dư của bạn đang rỗng hoặc âm! Hãy hoàn thành nhiệm vụ và học tập để có tiền trả nợ nhé.");
                                    return;
                                }
                                if (debts.length > 0) {
                                    onShowPayDebtModal(debts[0]);
                                }
                            }}
                        >
                            Trả nợ
                        </button>
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
                    onClick={onShowDebtModal}
                >
                    Tạm ứng
                </button>
                <button
                    className="btn btn-primary"
                    style={{ padding: "8px 16px" }}
                    onClick={onShowWithdrawModal}
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
