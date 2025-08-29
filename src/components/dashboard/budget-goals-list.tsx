
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import type { Spending } from '@/lib/types';
import { IndianRupee } from 'lucide-react';

interface BudgetGoalsListProps {
  data: Spending[];
}

export function BudgetGoalsList({ data }: BudgetGoalsListProps) {
  const budgetData = data.filter(item => item.spent > 0);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Spending Summary</CardTitle>
        <CardDescription>Your spending breakdown by category for this month.</CardDescription>
      </CardHeader>
      <CardContent>
        {budgetData.length > 0 ? (
          <div className="space-y-4">
            {budgetData.map(item => {
              const progress = item.budget > 0 ? (item.spent / item.budget) * 100 : 0;
              return (
                <div key={item.name}>
                  <div className="flex justify-between mb-1">
                    <span className="text-sm font-medium">{item.name}</span>
                    <span className="text-sm text-muted-foreground">
                      ₹{item.spent.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
             <IndianRupee className="mx-auto h-12 w-12 text-muted-foreground" />
            <p className="text-lg mt-4 font-semibold">No spending yet!</p>
            <p className="text-sm text-muted-foreground">Add a transaction to see your summary.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
