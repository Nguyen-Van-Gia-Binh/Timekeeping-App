import React from "react";
import { format } from "date-fns";
import { formatCurrency } from "../hooks/useBonusLogic";

export default function WithdrawHistory({ withdrawals }) {
    if (!withdrawals || withdrawals.length === 0) return null;

    return (
        <div className="card">
            <p className="card-title">🧾 Lịch sử rút tiền</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                {withdrawals.map((w) => (
                    <div key={w.id} className="withdraw-history-item">
                        <div>
                            <div style={{ fontWeight: 500 }}>{w.reason}</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                {format(new Date(w.timestamp), "dd/MM/yyyy HH:mm")}
                            </div>
                        </div>
                        <div style={{ fontWeight: 600, color: "var(--accent-warning)" }}>
                            -{formatCurrency(w.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
