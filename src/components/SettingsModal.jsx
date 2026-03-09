import React from "react";

export default function SettingsModal({
    isDailyFeeEnabled,
    setIsDailyFeeEnabled,
    isTargetPenaltyEnabled,
    setIsTargetPenaltyEnabled,
    onClose
}) {
    return (
        <div className="modal-overlay modal-fade-in" onClick={onClose}>
            <div className="modal-content" style={{ maxWidth: 450 }} onClick={(e) => e.stopPropagation()}>
                <h3 style={{ marginTop: 0, marginBottom: "16px" }}>⚙️ Cài đặt Động Lực</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", marginBottom: "20px" }}>
                    Bật các cơ chế kỷ luật thép để ép bản thân học tập nếu bạn là người hay trì hoãn.
                </p>

                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {/* Cơ chế 2: Phí Sinh Hoạt */}
                    <label className="settings-item">
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>💸 Phí Sinh Hoạt (Cơ chế 2)</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                Mỗi ngày bạn sẽ bị trừ đi 10.000đ như một khoản "phí sinh hoạt". Nếu bạn không học chí ít 1 giờ/ngày để gỡ lại, số dư của bạn sẽ bị ăn mòn và có nguy cơ âm.
                            </div>
                        </div>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={isDailyFeeEnabled}
                                onChange={(e) => setIsDailyFeeEnabled(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </div>
                    </label>

                    {/* Cơ chế 3: KPI khắt khe */}
                    <label className="settings-item">
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 14 }}>⚖️ Hình Phạt Kỷ Luật (Cơ chế 3)</div>
                            <div style={{ fontSize: 12, color: "var(--text-secondary)", marginTop: 4 }}>
                                Bắt buộc mỗi ngày phải học đủ 2 giờ. Mỗi giờ học thiếu sẽ bị phạt 10.000đ (tính cả những ngày không mở ứng dụng).
                            </div>
                        </div>
                        <div className="toggle-switch">
                            <input
                                type="checkbox"
                                checked={isTargetPenaltyEnabled}
                                onChange={(e) => setIsTargetPenaltyEnabled(e.target.checked)}
                            />
                            <span className="slider round"></span>
                        </div>
                    </label>
                </div>

                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
                    <button className="btn btn-primary" onClick={onClose} style={{ padding: "8px 24px" }}>Đóng</button>
                </div>
            </div>
        </div>
    );
}
