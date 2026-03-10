import React, { useState } from 'react';
import { ChevronDown, ChevronRight, BookOpen } from 'lucide-react';
import { helpSections } from '../data/helpConfig';

export default function HelpTab() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="card help-tab" style={{ marginTop: 24, marginBottom: 24, padding: "16px 24px" }}>
            <div
                className="help-tab-header"
                onClick={() => setIsOpen(!isOpen)}
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    userSelect: 'none'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <BookOpen size={18} style={{ color: "var(--accent-info)" }} />
                    <span style={{ fontSize: 16, fontWeight: 600, color: "var(--text-primary)" }}>
                        Hướng dẫn & Luật hệ thống
                    </span>
                </div>
                <div style={{ color: "var(--text-secondary)", transition: "transform 0.3s ease", transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                    <ChevronDown size={20} />
                </div>
            </div>

            {isOpen && (
                <div className="help-tab-content" style={{ marginTop: 20, animation: "slideDown 0.3s ease-out" }}>
                    <div className="help-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                        gap: 20
                    }}>
                        {helpSections.map((section) => (
                            <div key={section.id} className="help-section" style={{
                                background: "rgba(255, 255, 255, 0.03)",
                                padding: 16,
                                borderRadius: "var(--radius-md)",
                                border: "1px solid var(--border)"
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                                    {section.icon}
                                    <h4 style={{ margin: 0, fontSize: 14, color: "var(--text-primary)", fontWeight: 600 }}>
                                        {section.title}
                                    </h4>
                                </div>
                                {section.content}
                            </div>
                        ))}
                    </div>

                    <div style={{
                        marginTop: 20,
                        padding: 12,
                        background: "rgba(99, 179, 237, 0.1)",
                        borderLeft: "4px solid var(--accent-primary)",
                        borderRadius: "0 var(--radius-sm) var(--radius-sm) 0",
                        fontSize: 13,
                        color: "var(--text-secondary)"
                    }}>
                        💡 <strong>Mẹo nhỏ:</strong> Tiền thưởng học tập được cộng ngay mỗi khi bạn lưu phiên, phần thưởng chuỗi ngày hoàn hảo sẽ được tổng kết vào cuối tuần/cuối tháng. Tab Tài khoản là nơi bạn "tất toán" và theo dõi dòng tiền!
                    </div>
                </div>
            )}
        </div>
    );
}
