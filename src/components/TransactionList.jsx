// src/components/TransactionList.jsx
import React from "react";
import { format } from "date-fns";
import { formatCurrency } from "../utils/financeLogic";

/**
 * Danh sách lịch sử biến động số dư (Income = xanh, Expense = đỏ).
 */
export default function TransactionList({ transactions }) {
    return (
        <div className="card">
            <p className="card-title">📊 Lịch sử biến động số dư</p>
            {transactions.length === 0 ? (
                <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-secondary)" }}>
                    Chưa có giao dịch nào.
                </div>
            ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 16 }}>
                    {transactions.map((t) => (
                        <div
                            key={t.id}
                            style={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                                padding: "10px 14px",
                                borderRadius: 8,
                                backgroundColor: "var(--bg-secondary)",
                                border: "1px solid var(--border)",
                            }}
                        >
                            <div>
                                <p style={{ fontWeight: 500, margin: 0, fontSize: 14 }}>{t.reason}</p>
                                <p style={{ fontSize: 11, color: "var(--text-secondary)", margin: "3px 0 0 0" }}>
                                    {format(new Date(t.timestamp), "HH:mm dd/MM/yyyy")}
                                </p>
                            </div>
                            <div style={{
                                fontWeight: 700,
                                fontSize: 15,
                                color: t.type === "INCOME" ? "var(--accent-success)" : "var(--accent-danger)",
                            }}>
                                {t.type === "INCOME" ? "+" : "-"}{formatCurrency(t.amount)}
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
