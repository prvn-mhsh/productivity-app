
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Transaction, BudgetGoal, Reminder } from '@/lib/types';
import { UNCATEGORIZED_ID } from '@/lib/constants';

interface AppDataContextType {
  transactions: Transaction[];
  budgetGoals: BudgetGoal[];
  reminders: Reminder[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  setBudgetGoal: (goal: BudgetGoal) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isServer) return;
    try {
      const storedTransactions = localStorage.getItem('transactions');
      const storedBudgets = localStorage.getItem('budgetGoals');
      const storedReminders = localStorage.getItem('reminders');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedBudgets) {
        setBudgetGoals(JSON.parse(storedBudgets));
      }
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
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

  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders to localStorage', error);
    }
  }, [reminders, loading]);

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

  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
    };
    setReminders(prev => [...prev, newReminder].sort((a,b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()));
  };

  const value = useMemo(() => ({
    transactions,
    budgetGoals,
    reminders,
    loading,
    addTransaction,
    setBudgetGoal,
    addReminder,
  }), [transactions, budgetGoals, reminders, loading]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useBudgetData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useBudgetData must be used within a BudgetProvider');
  }
  return context;
};
