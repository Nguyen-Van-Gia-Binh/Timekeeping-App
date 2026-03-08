// src/components/ErrorBoundary.jsx
import React from "react";

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, info) {
        console.error("[ErrorBoundary]", error, info);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    height: "100vh",
                    gap: 16,
                    background: "#0a0e1a",
                    color: "#f0f4ff",
                    fontFamily: "Inter, sans-serif",
                    padding: 24,
                    textAlign: "center",
                }}>
                    <div style={{ fontSize: 48 }}>⚠️</div>
                    <h2 style={{ fontSize: 22, fontWeight: 700, color: "#fc8181" }}>
                        Đã xảy ra lỗi không mong muốn
                    </h2>
                    <p style={{ fontSize: 14, color: "#a0aec0", maxWidth: 480 }}>
                        Ứng dụng gặp sự cố. Điều này có thể xảy ra nếu trình duyệt đang ở chế độ riêng tư hoặc bộ nhớ đã đầy.
                    </p>
                    <p style={{ fontSize: 12, color: "#4a5568", fontFamily: "monospace", background: "#0f1629", padding: "8px 16px", borderRadius: 8 }}>
                        {this.state.error?.message}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        style={{
                            background: "#63b3ed",
                            color: "#0a0e1a",
                            border: "none",
                            borderRadius: 8,
                            padding: "10px 24px",
                            fontWeight: 600,
                            fontSize: 14,
                            cursor: "pointer",
                            marginTop: 8,
                        }}
                    >
                        🔄 Tải lại ứng dụng
                    </button>
                </div>
            );
        }
        return this.props.children;
    }
}
