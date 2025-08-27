'use client';

import { useBudgetData } from '@/hooks/use-budget-data';
import { useMemo } from 'react';
import type { Spending, Transaction } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { InsightsCard } from './insights-card';
import { DollarSign, PiggyBank, Scale } from 'lucide-react';
import { SpendingChart } from './spending-chart';
import { BudgetGoalsList } from './budget-goals-list';
import { RecentTransactions } from './recent-transactions';

export function DashboardPage() {
  const { transactions, budgetGoals, loading } = useBudgetData();

  const { totalSpent, totalBudget, remainingBudget, spendingByCategory, recentTransactions } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);

    const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const totalBudget = budgetGoals.reduce((sum, b) => sum + b.amount, 0);
    const remainingBudget = totalBudget - totalSpent;

    const spendingByCategory: Spending[] = CATEGORIES.map(category => {
      const budget = budgetGoals.find(b => b.categoryId === category.id)?.amount || 0;
      const spent = monthlyTransactions
        .filter(t => t.categoryId === category.id)
        .reduce((sum, t) => sum + t.amount, 0);

      return {
        name: category.name,
        spent,
        budget,
        color: category.color,
      };
    });
    
    const recentTransactions = transactions.slice(0, 5);

    return { totalSpent, totalBudget, remainingBudget, spendingByCategory, recentTransactions };
  }, [transactions, budgetGoals]);

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
            <Skeleton className="h-32" />
        </div>
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
            <Skeleton className="h-[400px] lg:col-span-3" />
            <Skeleton className="h-[400px] lg:col-span-2" />
        </div>
        <Skeleton className="h-[300px]" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's your financial overview for this month.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <InsightsCard
          title="Total Spent (This Month)"
          value={totalSpent}
          icon={DollarSign}
          isCurrency
        />
        <InsightsCard
          title="Total Budget (This Month)"
          value={totalBudget}
          icon={PiggyBank}
          isCurrency
        />
        <InsightsCard
          title="Remaining Budget"
          value={remainingBudget}
          icon={Scale}
          isCurrency
          trend={remainingBudget >= 0 ? 'up' : 'down'}
        />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="lg:col-span-3">
          <SpendingChart data={spendingByCategory} />
        </div>
        <div className="lg:col-span-2">
          <BudgetGoalsList data={spendingByCategory} />
        </div>
      </div>
      <div>
        <RecentTransactions transactions={recentTransactions} />
      </div>
    </div>
  );
}
