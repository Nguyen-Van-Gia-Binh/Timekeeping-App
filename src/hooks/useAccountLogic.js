// src/hooks/useAccountLogic.js
import { useState, useEffect, useCallback } from "react";
import { format } from "date-fns";
import {
    getWithdrawals,
    getAllDayRecords,
    getUnpaidDebts,
    addWithdrawal,
    addDebt,
    payDebt,
} from "../services/localService";
import { generateTransactionHistory, computeTotalBalance, formatCurrency } from "../utils/financeLogic";
import { useAppContext } from "../context/AppContext";
import { useToast } from "../components/Toast";

export function useAccountLogic() {
    const { refreshSignal, triggerRefresh } = useAppContext();
    const addToast = useToast();

    const [transactions, setTransactions] = useState([]);
    const [debts, setDebts] = useState([]);
    const [currentBalance, setCurrentBalance] = useState(0);
    const [totalDebtAmount, setTotalDebtAmount] = useState(0);

    const [showWithdrawModal, setShowWithdrawModal] = useState(false);
    const [showDebtModal, setShowDebtModal] = useState(false);
    const [showPayDebtModal, setShowPayDebtModal] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);

    const load = useCallback(async () => {
        const [records, withdrawals, unpaidDebts] = await Promise.all([
            getAllDayRecords(),
            getWithdrawals(),
            getUnpaidDebts(),
        ]);

        const history = generateTransactionHistory(records, withdrawals);
        setTransactions(history);

        // Dùng cùng logic với Dashboard để đảm bảo số dư đồng bộ
        const totalIncome = computeTotalBalance(records);
        const totalWithdrawnAmt = withdrawals.reduce((acc, w) => acc + w.amount, 0);
        setCurrentBalance(totalIncome - totalWithdrawnAmt);

        setDebts(unpaidDebts);
        setTotalDebtAmount(unpaidDebts.reduce((acc, d) => acc + d.amount, 0));
    }, []);

    useEffect(() => {
        load();
    }, [load, refreshSignal]);

    const handleWithdraw = async (amount, reason) => {
        await addWithdrawal(amount, reason);
        setShowWithdrawModal(false);
        load();
        triggerRefresh();
        addToast({ message: `💳 Rút ${formatCurrency(amount)} thành công!`, type: "info" });
    };

    const handleDebt = async (amount, reason) => {
        await addDebt(amount, reason);
        setShowDebtModal(false);
        load();
        triggerRefresh();
        addToast({ message: `💳 Đã tạm ứng ${formatCurrency(amount)}!`, type: "warning" });
    };

    const handlePayDebt = async (amountToPay, debt) => {
        if (!debt || amountToPay <= 0) return;
        await payDebt(debt.id, amountToPay);
        await addWithdrawal(amountToPay, `Trả nợ: ${debt.reason}`);
        setShowPayDebtModal(false);
        setSelectedDebt(null);
        load();
        triggerRefresh();
        addToast({ message: `✅ Đã trả ${formatCurrency(amountToPay)} cho khoản nợ!`, type: "success" });
    };

    const openPayDebt = (debt) => {
        if (currentBalance <= 0) {
            window.alert("❌ Số dư đang rỗng hoặc âm! Hãy học thêm để có tiền trả nợ nhé.");
            return;
        }
        setSelectedDebt(debt);
        setShowPayDebtModal(true);
    };

    return {
        // State
        transactions,
        debts,
        currentBalance,
        totalDebtAmount,
        showWithdrawModal,
        showDebtModal,
        showPayDebtModal,
        selectedDebt,
        // Setters
        setShowWithdrawModal,
        setShowDebtModal,
        setShowPayDebtModal,
        setSelectedDebt,
        // Handlers
        handleWithdraw,
        handleDebt,
        handlePayDebt,
        openPayDebt,
    };
}
