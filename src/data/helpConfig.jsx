/* src/data/helpConfig.js */
import React from 'react';
import { Target, CheckCircle, Clock, Coffee, Award } from 'lucide-react';

export const helpSections = [
    {
        id: 'tasks',
        title: 'Nhiệm vụ hàng ngày',
        icon: <CheckCircle size={18} style={{ color: "var(--accent-success)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Thêm và hoàn thành các task để ghi nhận tiến độ bản thân.</li>
                <li>Hoàn thành tất cả task trong ngày sẽ được nhận thưởng nóng +20.000đ.</li>
            </ul>
        )
    },
    {
        id: 'study',
        title: 'Giờ học tập',
        icon: <Clock size={18} style={{ color: "var(--accent-primary)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Bấm bắt đầu trong tab Đồng hồ để ghi nhận thời gian học (1 giờ = 10.000đ).</li>
                <li>Học càng nhiều, tiền thưởng càng tăng.</li>
            </ul>
        )
    },
    {
        id: 'account',
        title: 'Hệ thống Tài khoản & Tạm ứng',
        icon: <Coffee size={18} style={{ color: "var(--accent-warning)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Bạn có thể Rút Tiền từ số dư kiếm được để đi chơi, hoặc Tạm Ứng tiền mặt khi cần gấp (hệ thống sẽ ghi nhận Nợ).</li>
                <li>Các tiện ích này chuyển dịch hoàn toàn vào mục <strong>Tài khoản</strong>.</li>
            </ul>
        )
    },
    {
        id: 'goals',
        title: 'Mục tiêu (Goals)',
        icon: <Target size={18} style={{ color: "var(--accent-info)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Bạn có thể đặt tên, thay đổi số liệu của các mục tiêu Tiền Thưởng, Giờ Học cho phù hợp với bản thân.</li>
                <li>Kiểm tra tiến độ thường xuyên trên Dashboard.</li>
            </ul>
        )
    },
    {
        id: 'bonuses',
        title: 'Thưởng chuỗi ngày (Streak)',
        icon: <Award size={18} style={{ color: "var(--accent-success)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li><strong>Tuần hoàn hảo:</strong> Hoàn thành 100% nhiệm vụ trong 7 ngày liên tiếp để nhận thưởng +100.000đ.</li>
                <li><strong>Tháng hoàn hảo:</strong> Kiên trì cả tháng sẽ mang lại phần thưởng lớn +700.000đ!</li>
            </ul>
        )
    }
];
