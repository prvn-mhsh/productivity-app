
import type { LucideProps } from 'lucide-react';
import type React from 'react';

export type Category = {
  id: string;
  name: string;
  icon: React.ComponentType<LucideProps>;
  color: string;
};

export type Transaction = {
  id: string;
  description: string;
  amount: number;
  date: string; // ISO string
  categoryId: string;
};

export type BudgetGoal = {
  categoryId: string;
  amount: number;
};

export type Spending = {
  name: string;
  spent: number;
  budget: number;
  color: string;
};

export type Reminder = {
  id: string;
  title: string;
  eventTime: string; // ISO string
};

export type Note = {
    id: string;
    title: string;
    content: string;
};
