// src/components/StatisticsChart.jsx
import React from "react";
import {
    LineChart, Line, BarChart, Bar,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";

const TOOLTIP_STYLE = {
    contentStyle: { background: "#1f2937", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 8 },
    labelStyle: { color: "#9ca3af", marginBottom: 4 },
};

const AXIS_PROPS = {
    stroke: "#9ca3af",
    fontSize: 12,
    tickLine: false,
    axisLine: false,
};

/**
 * Chỉ vẽ biểu đồ Recharts dựa trên data và metric đầu vào.
 */
export default function StatisticsChart({ chartData, metric }) {
    const isHours = metric === "hours";
    const dataKey = isHours ? "hours" : "tasks";
    const color = isHours ? "#63b3ed" : "#68d391";

    return (
        <ResponsiveContainer width="100%" height="100%">
            {isHours ? (
                <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" {...AXIS_PROPS} dy={10} />
                    <YAxis {...AXIS_PROPS} tickFormatter={(v) => `${v}h`} />
                    <Tooltip
                        {...TOOLTIP_STYLE}
                        itemStyle={{ color, fontWeight: 600 }}
                        formatter={(v) => [`${v} giờ`, "Thời gian học"]}
                    />
                    <Line
                        type="monotone" dataKey={dataKey} stroke={color} strokeWidth={3}
                        dot={{ fill: "#1f2937", stroke: color, strokeWidth: 2, r: 4 }}
                        activeDot={{ r: 6, strokeWidth: 0, fill: color }}
                    />
                </LineChart>
            ) : (
                <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                    <XAxis dataKey="name" {...AXIS_PROPS} dy={10} />
                    <YAxis {...AXIS_PROPS} allowDecimals={false} />
                    <Tooltip
                        {...TOOLTIP_STYLE}
                        itemStyle={{ color, fontWeight: 600 }}
                        formatter={(v) => [`${v} ngày`, "Ngày hoàn thành task"]}
                    />
                    <Bar dataKey={dataKey} fill={color} radius={[4, 4, 0, 0]} />
                </BarChart>
            )}
        </ResponsiveContainer>
    );
}
