// src/components/WalletSection.jsx
import React from "react";
import { Wallet, ArrowUpCircle, CreditCard } from "lucide-react";
import { formatCurrency } from "../utils/financeLogic";

/**
 * Hiển thị số dư và các nút hành động tài chính (Rút tiền / Tạm ứng).
 */
export default function WalletSection({ currentBalance, totalDebtAmount, onWithdraw, onDebt }) {
    return (
        <div className="card balance-card">
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                <Wallet size={18} style={{ color: "var(--accent-success)" }} />
                <p className="card-title" style={{ margin: 0 }}>Ví của tôi</p>
            </div>

            <div className={`balance-amount ${currentBalance >= 0 ? "positive" : "negative"}`}>
                {formatCurrency(currentBalance)}
            </div>

            {totalDebtAmount > 0 && (
                <p style={{ color: "var(--accent-danger)", fontSize: 14, fontWeight: 600, marginTop: 4 }}>
                    Đang nợ: -{formatCurrency(totalDebtAmount)}
                </p>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: 20 }}>
                <button
                    id="btn-withdraw"
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "10px 16px", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={onWithdraw}
                >
                    <ArrowUpCircle size={16} /> Rút tiền
                </button>
                <button
                    id="btn-borrow"
                    className="btn btn-outline"
                    style={{ flex: 1, padding: "10px 16px", borderColor: "var(--accent-danger)", color: "var(--accent-danger)", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}
                    onClick={onDebt}
                >
                    <CreditCard size={16} /> Tạm ứng
                </button>
            </div>
        </div>
    );
}
