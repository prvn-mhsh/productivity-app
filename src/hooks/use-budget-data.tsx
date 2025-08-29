
'use client';

import type React from 'react';
import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import type { Transaction, BudgetGoal, Reminder, Note } from '@/lib/types';
import { UNCATEGORIZED_ID } from '@/lib/constants';

interface AppDataContextType {
  transactions: Transaction[];
  totalBudget: number;
  reminders: Reminder[];
  notes: Note[];
  loading: boolean;
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  deleteTransaction: (transactionId: string) => void;
  setTotalBudget: (amount: number) => void;
  addReminder: (reminder: Omit<Reminder, 'id'>) => void;
  addNote: (note: Omit<Note, 'id'>) => void;
  updateNote: (note: Note) => void;
  deleteNote: (noteId: string) => void;
}

const AppDataContext = createContext<AppDataContextType | undefined>(undefined);

const isServer = typeof window === 'undefined';

export function BudgetProvider({ children }: { children: React.ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [totalBudget, setTotalBudget] = useState<number>(0);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isServer) return;
    try {
      const storedTransactions = localStorage.getItem('transactions');
      const storedTotalBudget = localStorage.getItem('totalBudget');
      const storedReminders = localStorage.getItem('reminders');
      const storedNotes = localStorage.getItem('notes');
      if (storedTransactions) {
        setTransactions(JSON.parse(storedTransactions));
      }
      if (storedTotalBudget) {
        setTotalBudget(JSON.parse(storedTotalBudget));
      }
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
      if (storedNotes) {
        setNotes(JSON.parse(storedNotes));
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
      localStorage.setItem('totalBudget', JSON.stringify(totalBudget));
    } catch (error) {
      console.error('Failed to save total budget to localStorage', error);
    }
  }, [totalBudget, loading]);

  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('Failed to save reminders to localStorage', error);
    }
  }, [reminders, loading]);

  useEffect(() => {
    if (loading) return;
    try {
      localStorage.setItem('notes', JSON.stringify(notes));
    } catch (error) {
      console.error('Failed to save notes to localStorage', error);
    }
  }, [notes, loading]);

  const addTransaction = (transaction: Omit<Transaction, 'id'| 'date'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: crypto.randomUUID(),
      date: new Date().toISOString(),
      categoryId: transaction.categoryId || UNCATEGORIZED_ID,
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };
  
  const deleteTransaction = (transactionId: string) => {
    setTransactions(prev => prev.filter(t => t.id !== transactionId));
  };


  const addReminder = (reminder: Omit<Reminder, 'id'>) => {
    const newReminder: Reminder = {
      ...reminder,
      id: crypto.randomUUID(),
    };
    setReminders(prev => [...prev, newReminder].sort((a,b) => new Date(a.eventTime).getTime() - new Date(b.eventTime).getTime()));
  };

  const addNote = (note: Omit<Note, 'id'>) => {
    const newNote: Note = {
      ...note,
      id: crypto.randomUUID(),
    };
    setNotes(prev => [newNote, ...prev]);
  };

  const updateNote = (note: Note) => {
    setNotes(prev => prev.map(n => n.id === note.id ? note : n));
  };

  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(n => n.id !== noteId));
  };

  const value = useMemo(() => ({
    transactions,
    totalBudget,
    reminders,
    notes,
    loading,
    addTransaction,
    deleteTransaction,
    setTotalBudget,
    addReminder,
    addNote,
    updateNote,
    deleteNote,
  }), [transactions, totalBudget, reminders, notes, loading]);

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>;
}

export const useBudgetData = () => {
  const context = useContext(AppDataContext);
  if (context === undefined) {
    throw new Error('useBudgetData must be used within a BudgetProvider');
  }
  return context;
};
