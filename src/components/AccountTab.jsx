// src/components/AccountTab.jsx
import React from "react";
import { useAccountLogic } from "../hooks/useAccountLogic";
import WalletSection from "./WalletSection";
import PendingDebtList from "./PendingDebtList";
import TransactionList from "./TransactionList";
import WithdrawModal from "./WithdrawModal";
import DebtModal from "./DebtModal";
import PayDebtModal from "./PayDebtModal";

export default function AccountTab() {
    const {
        transactions,
        debts,
        currentBalance,
        totalDebtAmount,
        showWithdrawModal,
        showDebtModal,
        showPayDebtModal,
        selectedDebt,
        setShowWithdrawModal,
        setShowDebtModal,
        setShowPayDebtModal,
        setSelectedDebt,
        handleWithdraw,
        handleDebt,
        handlePayDebt,
        openPayDebt,
    } = useAccountLogic();

    return (
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <WalletSection
                currentBalance={currentBalance}
                totalDebtAmount={totalDebtAmount}
                onWithdraw={() => setShowWithdrawModal(true)}
                onDebt={() => setShowDebtModal(true)}
            />

            <PendingDebtList
                debts={debts}
                onPayDebt={openPayDebt}
            />

            <TransactionList transactions={transactions} />

            {showWithdrawModal && (
                <WithdrawModal
                    maxAmount={currentBalance}
                    onConfirm={handleWithdraw}
                    onCancel={() => setShowWithdrawModal(false)}
                />
            )}
            {showDebtModal && (
                <DebtModal
                    onConfirm={handleDebt}
                    onCancel={() => setShowDebtModal(false)}
                />
            )}
            {showPayDebtModal && (
                <PayDebtModal
                    currentBalance={currentBalance}
                    debt={selectedDebt}
                    onConfirm={handlePayDebt}
                    onCancel={() => {
                        setShowPayDebtModal(false);
                        setSelectedDebt(null);
                    }}
                />
            )}
        </div>
    );
}
