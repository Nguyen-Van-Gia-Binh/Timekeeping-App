// src/components/Toast.jsx
import React, { useEffect, useContext, createContext, useCallback, useRef, useState } from "react";

/* ─── Internal Context ──────────────────────────────────────────────── */
const ToastContext = createContext(null);
let _idCounter = 0;

export function ToastProvider({ children }) {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        ({ message, type = "success", duration = 3000 }) => {
            const id = ++_idCounter;
            setToasts((prev) => [...prev, { id, message, type }]);
            timers.current[id] = setTimeout(() => dismiss(id), duration);
        },
        [dismiss]
    );

    return (
        <ToastContext.Provider value={addToast}>
            {children}
            <ToastContainer toasts={toasts} onDismiss={dismiss} />
        </ToastContext.Provider>
    );
}

export function useToast() {
    const ctx = useContext(ToastContext);
    if (!ctx) throw new Error("useToast must be used within ToastProvider");
    return ctx;
}

/* ─── Icons per type ────────────────────────────────────────────────── */
const ICONS = {
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️",
};

const COLORS = {
    success: { bg: "rgba(104,211,145,0.15)", border: "rgba(104,211,145,0.35)", text: "#68d391" },
    error: { bg: "rgba(252,129,129,0.15)", border: "rgba(252,129,129,0.35)", text: "#fc8181" },
    warning: { bg: "rgba(246,173,85,0.15)", border: "rgba(246,173,85,0.35)", text: "#f6ad55" },
    info: { bg: "rgba(99,179,237,0.15)", border: "rgba(99,179,237,0.35)", text: "#63b3ed" },
};

/* ─── Container ─────────────────────────────────────────────────────── */
function ToastContainer({ toasts, onDismiss }) {
    if (toasts.length === 0) return null;
    return (
        <div style={{
            position: "fixed",
            bottom: 24,
            right: 24,
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            gap: 10,
            pointerEvents: "none",
        }}>
            {toasts.map((t) => (
                <ToastItem key={t.id} toast={t} onDismiss={onDismiss} />
            ))}
        </div>
    );
}

function ToastItem({ toast, onDismiss }) {
    const [visible, setVisible] = useState(false);
    const c = COLORS[toast.type] || COLORS.success;

    useEffect(() => {
        // trigger enter animation
        const raf = requestAnimationFrame(() => setVisible(true));
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div
            onClick={() => onDismiss(toast.id)}
            style={{
                pointerEvents: "auto",
                background: c.bg,
                border: `1px solid ${c.border}`,
                borderRadius: 12,
                padding: "12px 16px",
                display: "flex",
                alignItems: "center",
                gap: 10,
                backdropFilter: "blur(12px)",
                boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
                cursor: "pointer",
                minWidth: 240,
                maxWidth: 360,
                transform: visible ? "translateX(0)" : "translateX(40px)",
                opacity: visible ? 1 : 0,
                transition: "transform 0.3s ease, opacity 0.3s ease",
                fontFamily: "Inter, sans-serif",
            }}
        >
            <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[toast.type] || "✅"}</span>
            <span style={{ fontSize: 14, color: c.text, fontWeight: 500, flex: 1 }}>
                {toast.message}
            </span>
        </div>
    );
}
