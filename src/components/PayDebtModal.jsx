import React, { useState, useEffect } from "react";
import { formatCurrency } from "../utils/financeLogic";

export default function PayDebtModal({ currentBalance, debt, onConfirm, onCancel }) {
    const [amount, setAmount] = useState("");

    // By default, suggest paying the full debt amount or whatever balance they have, whichever is smaller.
    useEffect(() => {
        if (debt && currentBalance > 0) {
            setAmount(Math.min(currentBalance, debt.amount).toString());
        }
    }, [debt, currentBalance]);

    const val = parseInt(amount || "0", 10);
    const maxPayable = Math.min(currentBalance, debt ? debt.amount : 0);
    const isInvalid = val <= 0 || val > maxPayable;

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <h2 style={{ marginBottom: 16 }}>Thanh toán nợ</h2>

                <div style={{ backgroundColor: "var(--bg-secondary)", padding: 12, borderRadius: 8, marginBottom: 16 }}>
                    <p style={{ margin: 0, fontSize: 14 }}>Khoản nợ: <strong>{debt?.reason}</strong></p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 14 }}>Cần trả: <strong style={{ color: "var(--accent-danger)" }}>{formatCurrency(debt?.amount || 0)}</strong></p>
                    <p style={{ margin: "4px 0 0 0", fontSize: 14 }}>Số dư tối đa bạn có thể trả: <strong style={{ color: "var(--accent-success)" }}>{formatCurrency(maxPayable)}</strong></p>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", marginBottom: 8, fontSize: 14 }}>Số tiền muốn trả (VNĐ):</label>
                    <input
                        type="number"
                        className="task-input"
                        placeholder="Ví dụ: 5000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        autoFocus
                    />
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button className="btn btn-outline" onClick={onCancel}>Hủy</button>
                    <button
                        className="btn btn-primary"
                        disabled={isInvalid}
                        onClick={() => {
                            if (!isInvalid) onConfirm(val, debt);
                        }}
                    >
                        Xác nhận trả {formatCurrency(val)}
                    </button>
                </div>
            </div>
        </div>
    );
}
