// src/App.jsx
import React, { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import TaskSection from "./components/TaskSection";
import StudyTimer from "./components/StudyTimer";
import Statistics from "./components/Statistics";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { Calendar } from "lucide-react";
import { isDatabaseEmpty, importDataFromPayload, clearAllData } from "./services/localService";
import { useAppContext } from "./context/AppContext";

/* ─── Loading Screen ────────────────────────────────────────────────── */
function LoadingScreen() {
  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      background: "#0a0e1a",
      gap: 20,
      fontFamily: "Inter, sans-serif",
    }}>
      <div style={{
        width: 56,
        height: 56,
        background: "linear-gradient(135deg, #63b3ed 0%, #b794f4 50%, #68d391 100%)",
        borderRadius: 16,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 28,
        animation: "spin 1.5s ease-in-out infinite",
      }}>
        ⏱️
      </div>
      <div style={{ textAlign: "center" }}>
        <p style={{
          fontSize: 20,
          fontWeight: 700,
          background: "linear-gradient(135deg, #63b3ed 0%, #b794f4 50%, #68d391 100%)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          marginBottom: 6,
        }}>
          StudyTracker
        </p>
        <p style={{ fontSize: 13, color: "#a0aec0" }}>Đang khởi tạo ứng dụng...</p>
      </div>
      <style>{`
        @keyframes spin {
          0%, 100% { transform: rotate(-5deg) scale(1); }
          50% { transform: rotate(5deg) scale(1.08); }
        }
      `}</style>
    </div>
  );
}

/* ─── App ───────────────────────────────────────────────────────────── */
export default function App() {
  const [activePage, setActivePage] = useState("today");
  const [isInitializing, setIsInitializing] = useState(true);
  const { triggerRefresh } = useAppContext();

  const todayKey = format(new Date(), "yyyy-MM-dd");
  const todayLabel = format(new Date(), "EEEE, dd/MM/yyyy", { locale: vi });

  // ─── Before Unload: hộp thoại nhắc nhở tránh bấm nhầm ─────────────
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      e.preventDefault();
      e.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Auto-load default data if database is empty
  useEffect(() => {
    async function initData() {
      try {
        const empty = await isDatabaseEmpty();
        if (empty) {
          const res = await fetch("/data/Data.json");
          if (res.ok) {
            const payload = await res.json();
            await importDataFromPayload(payload);
            triggerRefresh();
          }
        }
      } catch (err) {
        console.error("Error initializing data:", err);
      } finally {
        setIsInitializing(false);
      }
    }
    initData();
  }, [triggerRefresh]);

  if (isInitializing) return <LoadingScreen />;

  return (
    <div className="app-layout">
      <Sidebar
        activePage={activePage}
        setActivePage={setActivePage}
      />
      <main className="main-content">
        {activePage === "dashboard" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Tổng quan kết quả học tập & phần thưởng</p>
              </div>
              <div className="date-badge">
                <Calendar size={13} />
                {todayLabel}
              </div>
            </div>
            <Dashboard />
          </>
        )}

        {activePage === "today" && (
          <>
            <div className="page-header">
              <div>
                <h1 className="page-title">Hôm nay</h1>
                <p className="page-subtitle">{todayLabel}</p>
              </div>
              <div className="date-badge">
                <Calendar size={13} />
                {todayKey}
              </div>
            </div>
            <div className="two-col">
              <TaskSection dateKey={todayKey} />
              <StudyTimer />
            </div>
          </>
        )}

        {activePage === "statistics" && (
          <div style={{ height: "100%", paddingBottom: "32px", boxSizing: "border-box" }}>
            <Statistics />
          </div>
        )}
      </main>
    </div>
  );
}
