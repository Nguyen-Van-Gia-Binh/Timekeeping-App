// src/components/PendingDebtList.jsx
import React from "react";
import { format } from "date-fns";
import { CheckCircle } from "lucide-react";
import { formatCurrency } from "../utils/financeLogic";

/**
 * Danh sách các khoản nợ đang chờ trả.
 */
export default function PendingDebtList({ debts, onPayDebt }) {
    if (!debts || debts.length === 0) return null;

    return (
        <div className="card">
            <p className="card-title">📋 Khoản nợ đang chờ trả</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {debts.map((debt) => (
                    <div
                        key={debt.id}
                        className="withdraw-history-item"
                        style={{ borderLeft: "3px solid var(--accent-danger)" }}
                    >
                        <div>
                            <div style={{ fontWeight: 500 }}>{debt.reason}</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                {format(new Date(debt.timestamp), "dd/MM/yyyy HH:mm")}
                            </div>
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ fontWeight: 600, color: "var(--accent-danger)" }}>
                                -{formatCurrency(debt.amount)}
                            </span>
                            <button
                                className="btn btn-primary"
                                style={{ padding: "4px 10px", fontSize: 12, height: "auto", display: "flex", alignItems: "center", gap: 4 }}
                                onClick={() => onPayDebt(debt)}
                            >
                                <CheckCircle size={12} /> Trả nợ
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
