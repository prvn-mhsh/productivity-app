'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Transaction, BudgetGoal } from '@/lib/types';
import { UNCATEGORIZED_ID } from '@/lib/constants';

interface BudgetContextType {
  transactions: Transaction[];
  budgetGoals: BudgetGoal[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  setBudgetGoal: (goal: BudgetGoal) => void;
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isServer) return;
    try {
      const storedTransactions = localStorage.getItem('transactions');
      const storedBudgets = localStorage.getItem('budgetGoals');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedBudgets) {
        setBudgetGoals(JSON.parse(storedBudgets));
      }
    } catch (error) {
      console.error('Failed to load data from localStorage', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem('transactions', JSON.stringify(transactions));
    } catch (error) {
      console.error('Failed to save transactions to localStorage', error);
    }
  }, [transactions, loading]);
  
  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem('budgetGoals', JSON.stringify(budgetGoals));
    } catch (error) {
      console.error('Failed to save budget goals to localStorage', error);
    }
  }, [budgetGoals, loading]);

  const addTransaction = (transaction: Omit<Transaction, 'id'| 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      categoryId: transaction.categoryId || UNCATEGORIZED_ID,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  const setBudgetGoal = (goal: BudgetGoal) => {
    setBudgetGoals(prev => {
      const existingIndex = prev.findIndex(g => g.categoryId === goal.categoryId);
      if (existingIndex > -1) {
        const updatedGoals = [...prev];
        updatedGoals[existingIndex] = goal;
        return updatedGoals;
      }
      return [...prev, goal];
    });
  };

  const value = useMemo(() => ({
    transactions,
    budgetGoals,
    loading,
    addTransaction,
    setBudgetGoal,
  }), [transactions, budgetGoals, loading]);

  return <BudgetContext.Provider value={value}>{children}</BudgetContext.Provider>;
}

export const useBudgetData = () => {
  const context = useContext(BudgetContext);
  if (context === undefined) {
    throw new Error('useBudgetData must be used within a BudgetProvider');
  }
  return context;
};
