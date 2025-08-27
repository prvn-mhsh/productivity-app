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

interface BudgetGoalsListProps {
  data: Spending[];
}

export function BudgetGoalsList({ data }: BudgetGoalsListProps) {
  const budgetData = data.filter(item => item.budget > 0);
  
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Budget Goals</CardTitle>
        <CardDescription>Your progress towards your monthly budget goals.</CardDescription>
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
                      ${item.spent.toFixed(2)} / ${item.budget.toFixed(2)}
                    </span>
                  </div>
                  <Progress value={progress} />
                </div>
              );
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center py-10">
            <p className="text-lg font-semibold">No budget goals set!</p>
            <p className="text-sm text-muted-foreground">Set budgets in settings to track your goals.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
