// src/context/AppContext.jsx
import React, { createContext, useCallback, useContext, useState } from "react";

const AppContext = createContext(null);

export function AppProvider({ children }) {
    const [refreshSignal, setRefreshSignal] = useState(0);

    const triggerRefresh = useCallback(() => {
        setRefreshSignal((s) => s + 1);
    }, []);

    return (
        <AppContext.Provider value={{ refreshSignal, triggerRefresh }}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    const ctx = useContext(AppContext);
    if (!ctx) throw new Error("useAppContext must be used within AppProvider");
    return ctx;
}
