// src/components/CameraModal.jsx
import React, { useRef, useEffect, useState } from "react";
import { Camera, X, Check } from "lucide-react";

export default function CameraModal({ onConfirm, onCancel }) {
    const videoRef = useRef(null);
    const streamRef = useRef(null);
    const [hasStream, setHasStream] = useState(false);
    const [error, setError] = useState(null);
    const [flashing, setFlashing] = useState(false);

    useEffect(() => {
        startCamera();
        return () => stopCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" },
                audio: false,
            });
            streamRef.current = stream;
            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
            setHasStream(true);
        } catch (err) {
            setError("Không thể truy cập camera. Vui lòng cho phép quyền camera.");
            console.error("Camera error:", err);
        }
    };

    const stopCamera = () => {
        if (streamRef.current) {
            streamRef.current.getTracks().forEach((track) => track.stop());
            streamRef.current = null;
        }
    };

    const handleCapture = () => {
        setFlashing(true);
        setTimeout(() => {
            setFlashing(false);
            stopCamera();
            onConfirm(); // Timer starts
        }, 300);
    };

    const handleCancel = () => {
        stopCamera();
        onCancel();
    };

    return (
        <div className="modal-overlay" onClick={handleCancel}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <p className="modal-title">📸 Xác minh bắt đầu học</p>
                <p className="modal-subtitle">Chụp một ảnh để xác nhận bạn đã sẵn sàng!</p>

                {error ? (
                    <div style={{ padding: "24px", textAlign: "center", color: "var(--accent-danger)", fontSize: "14px" }}>
                        <Camera size={40} style={{ marginBottom: "12px", opacity: 0.5 }} />
                        <p>{error}</p>
                    </div>
                ) : (
                    <video
                        ref={videoRef}
                        autoPlay
                        playsInline
                        muted
                        className={`camera-preview ${flashing ? "capture-flash" : ""}`}
                    />
                )}

                <div style={{ display: "flex", gap: "12px" }}>
                    <button className="btn btn-ghost" style={{ flex: 1 }} onClick={handleCancel} id="btn-camera-cancel">
                        <X size={16} /> Huỷ
                    </button>
                    <button
                        className="btn btn-success"
                        style={{ flex: 1 }}
                        onClick={handleCapture}
                        disabled={!hasStream}
                        id="btn-camera-capture"
                    >
                        <Check size={16} /> Chụp & Bắt đầu
                    </button>
                </div>
            </div>
        </div>
    );
}
