// src/hooks/useToast.js
import { useState, useCallback, useRef } from "react";

let idCounter = 0;

export function useToast() {
    const [toasts, setToasts] = useState([]);
    const timers = useRef({});

    const dismiss = useCallback((id) => {
        clearTimeout(timers.current[id]);
        delete timers.current[id];
        setToasts((prev) => prev.filter((t) => t.id !== id));
    }, []);

    const addToast = useCallback(
        ({ message, type = "success", duration = 3000 }) => {
            const id = ++idCounter;
            setToasts((prev) => [...prev, { id, message, type }]);
            timers.current[id] = setTimeout(() => dismiss(id), duration);
        },
        [dismiss]
    );

    return { toasts, addToast, dismiss };
}
