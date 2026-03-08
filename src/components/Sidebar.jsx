// src/components/Sidebar.jsx
import React, { useState } from "react";
import { LayoutDashboard, ListChecks, Download, Upload, Menu, X, RotateCcw } from "lucide-react";
import { exportData, importData, clearAllData, importDataFromPayload } from "../services/localService";
import { useAppContext } from "../context/AppContext";
import { useToast } from "./Toast";

export default function Sidebar({ activePage, setActivePage }) {
    const { triggerRefresh } = useAppContext();
    const addToast = useToast();
    const fileInputRef = React.useRef(null);
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleExport = async () => {
        try {
            await exportData();
            addToast({ message: "📦 Xuất dữ liệu thành công!", type: "success" });
        } catch (e) {
            addToast({ message: "❌ Xuất dữ liệu thất bại!", type: "error" });
            console.error("Export failed:", e);
        }
    };

    const handleImportClick = () => fileInputRef.current?.click();

    const handleFileChange = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            const count = await importData(file);
            triggerRefresh();
            addToast({ message: `✅ Import thành công! ${count} bản ghi.`, type: "success", duration: 4000 });
        } catch (err) {
            addToast({ message: "❌ Import thất bại. File không hợp lệ.", type: "error" });
            console.error(err);
        }
        e.target.value = "";
    };

    const handleReset = async () => {
        const confirmed = window.confirm(
            "⚠️ Xác nhận xóa toàn bộ dữ liệu và nạp lại từ file mẫu?\nHành động này không thể hoàn tác!"
        );
        if (!confirmed) return;
        try {
            await clearAllData();
            const res = await fetch(`${import.meta.env.BASE_URL}data/Data.json`);
            if (res.ok) {
                const payload = await res.json();
                await importDataFromPayload(payload);
                triggerRefresh();
                addToast({ message: "🔄 Reset thành công! Đã nạp lại dữ liệu mẫu.", type: "success", duration: 4000 });
            } else {
                addToast({ message: "❌ Không tìm thấy file dữ liệu mẫu.", type: "error" });
            }
        } catch (err) {
            addToast({ message: "❌ Reset thất bại: " + err.message, type: "error" });
            console.error(err);
        }
    };

    const navigate = (page) => {
        setActivePage(page);
        setMobileOpen(false);
    };

    const navItems = [
        { id: "dashboard", label: "Dashboard", icon: <LayoutDashboard size={16} /> },
        { id: "today", label: "Hôm nay", icon: <ListChecks size={16} /> },
        {
            id: "statistics", label: "Thống kê", icon: (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" />
                </svg>
            )
        },
    ];

    return (
        <>
            {/* Mobile hamburger */}
            <button
                className="mobile-menu-btn"
                onClick={() => setMobileOpen((o) => !o)}
                aria-label="Toggle menu"
            >
                {mobileOpen ? <X size={22} /> : <Menu size={22} />}
            </button>

            {/* Overlay for mobile */}
            {mobileOpen && (
                <div className="sidebar-overlay" onClick={() => setMobileOpen(false)} />
            )}

            <nav className={`sidebar ${mobileOpen ? "mobile-open" : ""}`}>
                <div className="sidebar-logo">
                    <div className="sidebar-logo-icon">⏱️</div>
                    <span className="sidebar-logo-text">StudyTracker</span>
                </div>

                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`sidebar-nav-item ${activePage === item.id ? "active" : ""}`}
                        onClick={() => navigate(item.id)}
                        id={`nav-${item.id}`}
                    >
                        {item.icon} {item.label}
                    </button>
                ))}

                <div className="sidebar-footer">
                    <p style={{ fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", color: "var(--text-muted)", padding: "0 16px", marginBottom: 8 }}>
                        Dữ liệu
                    </p>
                    <button className="sidebar-nav-item" onClick={handleExport} id="btn-export">
                        <Upload size={16} /> Xuất dữ liệu
                    </button>
                    <button className="sidebar-nav-item" onClick={handleImportClick} id="btn-import">
                        <Download size={16} /> Nhập dữ liệu
                    </button>
                    <button
                        className="sidebar-nav-item"
                        onClick={handleReset}
                        id="btn-reset-data"
                        style={{ color: "var(--accent-danger)", marginTop: 8 }}
                    >
                        <RotateCcw size={16} /> Reset dữ liệu
                    </button>
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".json"
                        style={{ display: "none" }}
                        onChange={handleFileChange}
                        id="input-import-file"
                    />
                </div>
            </nav>
        </>
    );
}
