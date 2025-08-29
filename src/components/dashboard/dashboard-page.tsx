
'use client';

import { useBudgetData } from '@/hooks/use-budget-data';
import { useMemo, useState } from 'react';
import type { Spending, Transaction, Reminder, Note } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { Skeleton } from '@/components/ui/skeleton';
import { InsightsCard } from './insights-card';
import { DollarSign, PiggyBank, Scale, Bell, StickyNote } from 'lucide-react';
import { RecentTransactions } from './recent-transactions';
import { Button } from '../ui/button';
import { BudgetSettingsDialog } from '../budget-settings';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { format } from 'date-fns';
import { ScrollArea } from '../ui/scroll-area';
import Link from 'next/link';

export function DashboardPage() {
  const { transactions, totalBudget, reminders, notes, loading } = useBudgetData();
  const [isBudgetDialogOpen, setBudgetDialogOpen] = useState(false);

  const { totalSpent, remainingBudget, recentTransactions } = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    const monthlyTransactions = transactions.filter(t => new Date(t.date) >= startOfMonth);
    const totalSpent = monthlyTransactions.reduce((sum, t) => sum + t.amount, 0);
    const remainingBudget = totalBudget - totalSpent;
    const recentTransactions = transactions.slice(0, 3);
    
    return { totalSpent, remainingBudget, recentTransactions };
  }, [transactions, totalBudget]);
  
  const upcomingReminders = useMemo(() => {
    return reminders.slice(0, 3);
  }, [reminders]);

  const recentNotes = useMemo(() => {
    return notes.slice(0, 3);
  }, [notes]);


  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-48" />
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
          <Skeleton className="h-32" />
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  return (
    <>
      <ScrollArea className="h-full">
        <div className="flex flex-col gap-6 p-1">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back!</p>
            </div>
             <Button onClick={() => setBudgetDialogOpen(true)}>Set Budget</Button>
          </div>
          
          {/* Budget Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Budget Overview</CardTitle>
              <CardDescription>Your financial summary for this month.</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="grid gap-4 grid-cols-1 sm:grid-cols-3">
                     <InsightsCard
                        title="Total Spent"
                        value={totalSpent}
                        icon={DollarSign}
                        isCurrency
                    />
                    <InsightsCard
                        title="Remaining"
                        value={remainingBudget}
                        icon={Scale}
                        isCurrency
                        trend={remainingBudget >= 0 ? 'up' : 'down'}
                    />
                     <InsightsCard
                        title="Monthly Budget"
                        value={totalBudget}
                        icon={PiggyBank}
                        isCurrency
                    />
                </div>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Transactions */}
            <RecentTransactions transactions={recentTransactions} />
            
            {/* Upcoming Reminders */}
            <Card>
              <CardHeader>
                <CardTitle>Upcoming Reminders</CardTitle>
                 <Button variant="link" className="p-0 h-auto absolute top-6 right-4" asChild><Link href="/reminders">View All</Link></Button>
              </CardHeader>
              <CardContent>
                {upcomingReminders.length > 0 ? (
                  <ul className="space-y-4">
                    {upcomingReminders.map((reminder) => (
                      <li key={reminder.id} className="flex items-center p-3 bg-secondary rounded-lg">
                        <Bell className="w-5 h-5 mr-4 text-primary" />
                        <div className="flex-1">
                          <p className="font-semibold">{reminder.title}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(new Date(reminder.eventTime), "PPP, h:mm a")}
                          </p>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No upcoming reminders.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

           {/* Recent Notes */}
           <Card>
              <CardHeader>
                <CardTitle>Recent Notes</CardTitle>
                 <Button variant="link" className="p-0 h-auto absolute top-6 right-4" asChild><Link href="/notes">View All</Link></Button>
              </CardHeader>
              <CardContent>
                {recentNotes.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {recentNotes.map((note) => (
                      <div key={note.id} className="p-4 bg-secondary rounded-lg">
                        <h4 className="font-semibold truncate">{note.title}</h4>
                        <p className="text-sm text-muted-foreground line-clamp-2">{note.content}</p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground py-10">
                    <p>No recent notes.</p>
                  </div>
                )}
              </CardContent>
            </Card>

        </div>
      </ScrollArea>
      <BudgetSettingsDialog open={isBudgetDialogOpen} onOpenChange={setBudgetDialogOpen} />
    </>
  );
}
