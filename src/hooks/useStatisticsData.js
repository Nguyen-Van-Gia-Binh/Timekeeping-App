// src/hooks/useStatisticsData.js
import { useState, useEffect, useMemo } from "react";
import {
    format, startOfWeek, endOfWeek,
    eachDayOfInterval, startOfMonth, endOfMonth,
    parseISO, subDays
} from "date-fns";
import { getAllDayRecords } from "../services/localService";
import { useAppContext } from "../context/AppContext";

export function useStatisticsData(timeRange, metric) {
    const { refreshSignal } = useAppContext();
    const [dayRecords, setDayRecords] = useState([]);

    useEffect(() => {
        async function load() {
            const records = await getAllDayRecords();
            setDayRecords(records);
        }
        load();
    }, [refreshSignal]);

    const chartData = useMemo(() => {
        const today = new Date();
        const records = dayRecords || [];

        if (timeRange === "day") {
            const start = subDays(today, 13);
            return eachDayOfInterval({ start, end: today }).map(d => {
                const key = format(d, "yyyy-MM-dd");
                const record = records.find(r => r.date === key);
                return {
                    name: format(d, "dd/MM"),
                    hours: record ? Number((record.studySeconds / 3600).toFixed(1)) : 0,
                    tasks: record ? (record.missedCount === 0 && record.completedAll ? 1 : 0) : 0,
                };
            });
        }

        if (timeRange === "week") {
            return Array.from({ length: 8 }, (_, i) => {
                const d = subDays(today, (7 - i) * 7);
                const wStart = startOfWeek(d, { weekStartsOn: 1 });
                const wEnd = endOfWeek(d, { weekStartsOn: 1 });
                const weekRecs = records.filter(r => { const rd = parseISO(r.date); return rd >= wStart && rd <= wEnd; });
                return {
                    name: format(wStart, "dd/MM"),
                    hours: Number((weekRecs.reduce((s, r) => s + (r.studySeconds || 0), 0) / 3600).toFixed(1)),
                    tasks: weekRecs.filter(r => r.completedAll).length,
                };
            });
        }

        if (timeRange === "month") {
            return Array.from({ length: 12 }, (_, i) => {
                const d = new Date(today.getFullYear(), today.getMonth() - (11 - i), 1);
                const monthRecs = records.filter(r => {
                    const rd = parseISO(r.date);
                    return rd >= startOfMonth(d) && rd <= endOfMonth(d);
                });
                const yearSuffix = d.getFullYear() !== today.getFullYear() ? `'${format(d, "yy")}` : "";
                return {
                    name: `T${format(d, "MM")}${yearSuffix}`,
                    hours: Number((monthRecs.reduce((s, r) => s + (r.studySeconds || 0), 0) / 3600).toFixed(1)),
                    tasks: monthRecs.filter(r => r.completedAll).length,
                };
            });
        }

        if (timeRange === "year") {
            const currentYear = today.getFullYear();
            let firstYear = currentYear - 4;
            if (records.length > 0) {
                const dataFirstYear = Math.min(...records.map(r => parseISO(r.date).getFullYear()));
                if (dataFirstYear < firstYear) firstYear = dataFirstYear;
            }
            return Array.from({ length: currentYear - firstYear + 1 }, (_, i) => {
                const y = firstYear + i;
                const yearRecs = records.filter(r => parseISO(r.date).getFullYear() === y);
                return {
                    name: y.toString(),
                    hours: Number((yearRecs.reduce((s, r) => s + (r.studySeconds || 0), 0) / 3600).toFixed(1)),
                    tasks: yearRecs.filter(r => r.completedAll).length,
                };
            });
        }

        return [];
    }, [dayRecords, timeRange]);

    const summaryStats = useMemo(() => {
        const totalHours = (dayRecords.reduce((sum, r) => sum + r.studySeconds, 0) / 3600).toFixed(1);
        const completedDays = dayRecords.filter(r => r.completedAll).length;
        let longestStreak = 0, cur = 0;
        const sorted = [...dayRecords].sort((a, b) => a.date.localeCompare(b.date));
        for (const r of sorted) {
            if (r.completedAll) { cur++; if (cur > longestStreak) longestStreak = cur; }
            else cur = 0;
        }
        const totalVisible = metric === "hours"
            ? chartData.reduce((sum, d) => sum + d.hours, 0).toFixed(1)
            : chartData.reduce((sum, d) => sum + d.tasks, 0);
        return { totalHours, completedDays, longestStreak, totalVisible };
    }, [dayRecords, chartData, metric]);

    return { chartData, summaryStats };
}
