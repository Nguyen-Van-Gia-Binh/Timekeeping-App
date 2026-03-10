// src/hooks/useTimerLogic.js
import { useState, useEffect, useRef } from "react";

/**
 * Custom hook quản lý logic đếm giờ: setInterval, running/elapsed state.
 */
export function useTimerLogic() {
    const [running, setRunning] = useState(false);
    const [elapsed, setElapsed] = useState(0);
    const intervalRef = useRef(null);
    const startTimeRef = useRef(null);

    useEffect(() => {
        if (running) {
            startTimeRef.current = Date.now() - elapsed * 1000;
            intervalRef.current = setInterval(() => {
                setElapsed(Math.floor((Date.now() - startTimeRef.current) / 1000));
            }, 1000);
        } else {
            clearInterval(intervalRef.current);
        }
        return () => clearInterval(intervalRef.current);
    }, [running]);

    const start = () => setRunning(true);
    const stop = () => {
        setRunning(false);
        const snapshot = elapsed; // capture before reset
        setElapsed(0);
        return snapshot;
    };
    const reset = () => setElapsed(0);

    return { running, elapsed, start, stop, reset };
}
