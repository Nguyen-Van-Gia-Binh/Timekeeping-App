// src/components/GoalEditModal.jsx
import React, { useState } from "react";

/**
 * Modal chỉnh sửa mục tiêu — cho phép đổi cả tên lẫn giá trị.
 * Props:
 *   title         — tiêu đề modal
 *   currentName   — tên mục tiêu hiện tại (string, có thể undefined)
 *   currentValue  — giá trị số hiện tại
 *   unit          — đơn vị hiển thị ("VNĐ" | "giờ")
 *   onConfirm(name, value) — callback khi xác nhận
 *   onCancel()    — callback khi hủy
 */
export default function GoalEditModal({
    title,
    currentName = "",
    currentValue,
    unit = "VNĐ",
    onConfirm,
    onCancel,
}) {
    const [nameInput, setNameInput] = useState(currentName);
    const [valueInput, setValueInput] = useState(currentValue?.toString() || "");
    const [error, setError] = useState("");

    const handleConfirm = () => {
        const val = parseInt(valueInput.replace(/[^0-9]/g, ""), 10);
        if (isNaN(val) || val <= 0) {
            setError("Vui lòng nhập số hợp lệ lớn hơn 0!");
            return;
        }
        onConfirm(nameInput.trim() || currentName, val);
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleConfirm();
        if (e.key === "Escape") onCancel();
    };

    return (
        <div className="modal-overlay" onClick={onCancel}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <p className="modal-title">🎯 {title}</p>
                <p className="modal-subtitle">Đổi tên và giá trị, rồi nhấn Xác nhận</p>

                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {/* Tên mục tiêu */}
                    <div>
                        <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>
                            📝 Tên mục tiêu
                        </label>
                        <input
                            autoFocus
                            type="text"
                            className="task-input"
                            value={nameInput}
                            onChange={(e) => setNameInput(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="VD: Mua xe, Học bổng, Du lịch..."
                            maxLength={40}
                        />
                    </div>

                    {/* Giá trị */}
                    <div>
                        <label style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600, display: "block", marginBottom: 6 }}>
                            🔢 Giá trị mục tiêu
                        </label>
                        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                            <input
                                type="text"
                                className="task-input"
                                style={{ flex: 1 }}
                                value={valueInput}
                                onChange={(e) => { setValueInput(e.target.value); setError(""); }}
                                onKeyDown={handleKeyDown}
                                placeholder={`Nhập ${unit}...`}
                            />
                            <span style={{ fontSize: 13, color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
                                {unit}
                            </span>
                        </div>
                        {error && (
                            <p style={{ fontSize: 12, color: "var(--accent-danger)", marginTop: 6 }}>
                                {error}
                            </p>
                        )}
                    </div>
                </div>

                <div style={{ display: "flex", gap: 10, justifyContent: "flex-end", marginTop: 4 }}>
                    <button className="btn btn-ghost" onClick={onCancel}>Hủy</button>
                    <button className="btn btn-primary" onClick={handleConfirm}>✔ Xác nhận</button>
                </div>
            </div>
        </div>
    );
}
