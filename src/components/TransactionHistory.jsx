import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { getAllDayRecords, getWithdrawals } from "../services/localService";
import { formatCurrency, generateTransactionHistory } from "../hooks/useBonusLogic";

export default function TransactionHistory() {
    const [transactions, setTransactions] = useState([]);

    useEffect(() => {
        const load = async () => {
            const records = await getAllDayRecords();
            const withdraws = await getWithdrawals();
            const settings = {
                isTargetPenaltyEnabled: localStorage.getItem("StudyTracker_IsTargetPenaltyEnabled") === "true",
                dailyTargetHours: 2,
                penaltyPerHour: 10000,
                isDailyFeeEnabled: localStorage.getItem("StudyTracker_IsDailyFeeEnabled") === "true",
                dailyFeeAmount: 10000,
                todayKey: format(new Date(), "yyyy-MM-dd")
            };

            const history = generateTransactionHistory(records, withdraws, settings);
            setTransactions(history);
        };
        load();
    }, []);

    if (transactions.length === 0) {
        return (
            <div className="card" style={{ textAlign: "center", padding: "40px" }}>
                <p style={{ color: "var(--text-secondary)" }}>Chưa có giao dịch nào.</p>
            </div>
        );
    }

    return (
        <div className="card">
            <h2 className="card-title" style={{ marginBottom: "20px" }}>Lịch sử biến động số dư</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {transactions.map(t => (
                    <div
                        key={t.id}
                        style={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            padding: "12px",
                            borderRadius: "8px",
                            backgroundColor: "var(--bg-secondary)",
                            border: "1px solid var(--border)"
                        }}
                    >
                        <div>
                            <p style={{ fontWeight: 600, margin: 0 }}>{t.reason}</p>
                            <p style={{ fontSize: "12px", color: "var(--text-secondary)", margin: "4px 0 0 0" }}>
                                {format(new Date(t.timestamp), "HH:mm dd/MM/yyyy")}
                            </p>
                        </div>
                        <div
                            style={{
                                fontWeight: "bold",
                                color: t.type === 'INCOME' ? "var(--accent-success)" : "var(--accent-danger)"
                            }}
                        >
                            {t.type === 'INCOME' ? "+" : "-"}{formatCurrency(t.amount)}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
