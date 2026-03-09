import React, { useState } from "react";

export default function DebtModal({ onConfirm, onCancel }) {
    const [amount, setAmount] = useState("");
    const [reason, setReason] = useState("");

    const handleConfirm = () => {
        const val = parseInt(amount, 10);
        if (!val || val <= 0) {
            alert("Vui lòng nhập số tiền hợp lệ!");
            return;
        }
        if (!reason.trim()) {
            alert("Vui lòng nhập lý do vay nợ!");
            return;
        }
        onConfirm(val, reason.trim());
    };

    return (
        <div className="modal-overlay modal-fade-in">
            <div className="modal-content" style={{ maxWidth: 400 }}>
                <h3 style={{ marginTop: 0, marginBottom: "16px", color: "var(--accent-danger)" }}>
                    💳 Tạm ứng (Vay nợ)
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: "16px" }}>
                    Tạm ứng trước một số tiền khi bạn chưa đủ ngân sách, và cày cuốc học tập để trả sau.
                </p>

                <div style={{ marginBottom: 16 }}>
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Số tiền muốn vay (VNĐ)</label>
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
                    <label style={{ display: "block", fontSize: 13, marginBottom: 6 }}>Lý do vay</label>
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
                    <button className="btn btn-danger" onClick={handleConfirm} style={{ padding: "8px 16px" }}>
                        Xác nhận Vay
                    </button>
                </div>
            </div>
        </div>
    );
}
