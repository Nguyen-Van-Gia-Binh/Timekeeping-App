// src/components/StudyTimer.jsx
import React, { useState } from "react";
import { Play, Square, Clock, PlusCircle } from "lucide-react";
import CameraModal from "./CameraModal";
import { addStudySession } from "../services/localService";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";
import { useTimerLogic } from "../hooks/useTimerLogic";

function pad(n) { return String(n).padStart(2, "0"); }
function formatSeconds(total) {
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

export default function StudyTimer() {
    const { triggerRefresh } = useAppContext();
    const addToast = useToast();
    const { running, elapsed, start, stop } = useTimerLogic();
    const [showCamera, setShowCamera] = useState(false);
    const [manualHours, setManualHours] = useState("");

    const handleCameraConfirm = () => {
        setShowCamera(false);
        start();
    };

    const handleStop = async () => {
        const savedElapsed = stop();
        if (savedElapsed > 0) {
            await addStudySession(savedElapsed);
            const hrs = Math.floor(savedElapsed / 3600);
            const earned = hrs * 10000;
            addToast({
                message: earned > 0
                    ? `⏱️ Phiên học lưu thành công! +${earned.toLocaleString("vi-VN")}đ`
                    : "⏱️ Phiên học đã được lưu!",
                type: "success",
                duration: 4000,
            });
            triggerRefresh();
        }
    };

    const handleManualSubmit = async () => {
        const h = parseFloat(manualHours);
        if (h > 0) {
            const seconds = Math.floor(h * 3600);
            await addStudySession(seconds);
            const earned = Math.floor(h) * 10000;
            addToast({
                message: earned > 0
                    ? `📝 Đã ghi ${h} giờ học! +${earned.toLocaleString("vi-VN")}đ`
                    : `📝 Đã ghi ${h} giờ học!`,
                type: "success",
            });
            triggerRefresh();
            setManualHours("");
        }
    };

    const studyReward = Math.floor(elapsed / 3600) * 10000;
    const minsUntilNext = 60 - Math.floor((elapsed % 3600) / 60);

    return (
        <>
            {showCamera && (
                <CameraModal onConfirm={handleCameraConfirm} onCancel={() => setShowCamera(false)} />
            )}
            <div className="card">
                <p className="card-title" style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <Clock size={14} /> Đếm giờ học
                </p>

                <div className="timer-display">{formatSeconds(elapsed)}</div>
                <p className="timer-subtitle">
                    {running ? "⏳ Đang đếm giờ…" : "Sẵn sàng bắt đầu?"}
                </p>

                <div className="timer-buttons">
                    {!running ? (
                        <button
                            className="btn btn-primary"
                            style={{ minWidth: 140 }}
                            onClick={() => setShowCamera(true)}
                            id="btn-timer-start"
                        >
                            <Play size={16} /> Bắt đầu
                        </button>
                    ) : (
                        <button
                            className="btn btn-danger"
                            style={{ minWidth: 140 }}
                            onClick={handleStop}
                            id="btn-timer-stop"
                        >
                            <Square size={16} /> Dừng lại
                        </button>
                    )}
                </div>

                <p className="timer-reward">
                    {elapsed >= 3600
                        ? `🏆 Phần thưởng đã tích lũy: +${studyReward.toLocaleString("vi-VN")}đ`
                        : elapsed > 0
                            ? `Học thêm ${minsUntilNext} phút để đạt +10,000đ`
                            : ""}
                </p>

                <div style={{ marginTop: "24px", paddingTop: "16px", borderTop: "1px solid var(--border)" }}>
                    <p style={{ fontSize: "14px", color: "var(--text-secondary)", marginBottom: "8px" }}>
                        Hoặc nhập nhanh số giờ đã học:
                    </p>
                    <div style={{ display: "flex", gap: "8px" }}>
                        <input
                            type="number"
                            className="task-input"
                            style={{ flex: 1, minWidth: 0 }}
                            placeholder="Số giờ (VD: 2.5)"
                            value={manualHours}
                            onChange={(e) => setManualHours(e.target.value)}
                            min="0.1"
                            step="0.1"
                            disabled={running}
                        />
                        <button
                            className="btn btn-outline"
                            onClick={handleManualSubmit}
                            disabled={!manualHours || running || parseFloat(manualHours) <= 0}
                        >
                            <PlusCircle size={16} /> Lưu
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
