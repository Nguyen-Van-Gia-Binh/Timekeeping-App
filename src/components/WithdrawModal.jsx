import React, { useState } from "react";
import { formatCurrency } from "../utils/financeLogic";

export default function WithdrawModal({ maxAmount, onConfirm, onCancel }) {
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        const val = parseInt(amount, 10);
        if (!val || val <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ!");
            return;
        }
        if (val > maxAmount) {
            alert("Số dư không đủ để rút!");
            return;
        }
        if (!reason.trim()) {
            alert("Vui lòng nhập lý do rút tiền!");
            return;
        }
        onConfirm(val, reason.trim());
    };

    return (
        <div className="modal-overlay modal-fade-in">
            <div className="modal-content" style={{ maxWidth: 400 }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px" }}>💸 Rút tiền</h3>

                <div style={{ marginBottom: 12 }}>
                    <label style={{ display: "block", fontSize: 12, color: "var(--text-secondary)", marginBottom: 4 }}>
                        Số dư tối đa có thể rút
                    </label>
                    <div style={{ fontWeight: 600, color: "var(--accent-success)", fontSize: 16 }}>
                        {formatCurrency(maxAmount)}
                    </div>
                </div>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Số tiền cần rút (VNĐ)</label>
                    <input
                        type="number"
                        className="task-input"
                        placeholder="Ví dụ: 50000"
                        value={amount}
                        onChange={(e) => setAmount(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: 8, fontSize: 14 }}
                    />
                </div>

                <div style={{ marginBottom: 24 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Lý do rút</label>
                    <input
                        type="text"
                        className="task-input"
                        placeholder="Ví dụ: Mua trà sữa..."
                        value={reason}
                        onChange={(e) => setReason(e.target.value)}
                        style={{ width: "100%", padding: "10px", borderRadius: 8, fontSize: 14 }}
                    />
                </div>

                <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end" }}>
                    <button className="btn" onClick={onCancel} style={{ padding: "8px 16px" }}>Hủy</button>
                    <button className="btn btn-primary" onClick={handleConfirm} style={{ padding: "8px 16px" }}>
                        Xác nhận
                    </button>
                </div>
            </div>
        </div>
    );
}
