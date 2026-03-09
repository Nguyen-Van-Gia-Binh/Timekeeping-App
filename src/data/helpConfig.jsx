/* src/data/helpConfig.js */
import React from 'react';
import { Target, CheckCircle, Clock, Coffee, ShieldAlert, Award } from 'lucide-react';

export const helpSections = [
    {
        id: 'tasks',
        title: 'Nhiệm vụ hàng ngày',
        icon: <CheckCircle size={18} style={{ color: "var(--accent-success)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Thêm và hoàn thành các task để nhận thưởng (+20.000đ/ngày nếu xong hết).</li>
                <li>Mỗi task chưa hoàn thành có thể bị trừ tiền (tuỳ thuộc Cài đặt Động lực).</li>
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
                <li>Giờ học sẽ tự động cộng dồn vào Mục tiêu Tháng.</li>
            </ul>
        )
    },
    {
        id: 'debt',
        title: 'Hệ thống Tạm ứng (Nợ)',
        icon: <Coffee size={18} style={{ color: "var(--accent-warning)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li>Bạn có thể tạm ứng tiền khi cần gấp, hệ thống sẽ ghi nhận Nợ.</li>
                <li>Để trả nợ, hãy chăm chỉ học tập và hoàn thành task để kiếm tiền bù vào. Số dư sẽ bị trừ vào khoản Nợ ưu tiên trước.</li>
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
                <li>Khi số dư vượt qua Mục tiêu Tiền Thưởng, thanh tiến trình hiển thị sẽ đầy 100%.</li>
            </ul>
        )
    },
    {
        id: 'rules',
        title: 'Luật (Chống lười)',
        icon: <ShieldAlert size={18} style={{ color: "var(--accent-danger)" }} />,
        content: (
            <ul style={{ paddingLeft: 20, margin: 0, color: "var(--text-secondary)", fontSize: 13, lineHeight: 1.6 }}>
                <li><strong>Phí duy trì (2.000đ/ngày):</strong> Trừ tự động mỗi ngày (nếu đang bật trong cài đặt).</li>
                <li><strong>Phạt Chưa Đạt Mục Tiêu:</strong> Nếu cuối tuần/tháng không đạt tiến độ, bạn sẽ bị phạt trừ tiền thẳng vào tài khoản. Cố gắng giữ tỷ lệ trên 70% nhé!</li>
            </ul>
        )
    }
];
