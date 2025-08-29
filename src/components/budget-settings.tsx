
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudgetData } from '@/hooks/use-budget-data';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { CATEGORIES } from '@/lib/constants';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';

const budgetSettingsSchema = z.object({
  budgets: z.array(z.object({
    categoryId: z.string(),
    amount: z.coerce.number().min(0, 'Budget must be a positive number'),
  })),
});

type BudgetSettingsFormValues = z.infer<typeof budgetSettingsSchema>;

export function BudgetSettings() {
  const { budgetGoals, setBudgetGoal } = useBudgetData();
  const { toast } = useToast();

  const defaultValues = CATEGORIES.map(category => {
    const existingGoal = budgetGoals.find(g => g.categoryId === category.id);
    return {
      categoryId: category.id,
      amount: existingGoal?.amount || 0,
    };
  });

  const form = useForm<BudgetSettingsFormValues>({
    resolver: zodResolver(budgetSettingsSchema),
    defaultValues: {
      budgets: defaultValues,
    },
  });

  const onSubmit = (values: BudgetSettingsFormValues) => {
    values.budgets.forEach(budget => {
      setBudgetGoal({
        categoryId: budget.categoryId,
        amount: budget.amount,
      });
    });
    toast({
      title: 'Budgets Updated',
      description: 'Your new budget limits have been saved.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Budgets</CardTitle>
        <CardDescription>
          Set your monthly spending limits for each category.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              {form.getValues('budgets').map((budget, index) => {
                const category = CATEGORIES.find(c => c.id === budget.categoryId);
                if (!category) return null;
                return (
                  <FormField
                    key={category.id}
                    control={form.control}
                    name={`budgets.${index}.amount`}
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                            <FormLabel>{category.name}</FormLabel>
                            <div className="w-2/5">
                                <FormControl>
                                    <div className="relative">
                                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">$</span>
                                        <Input type="number" {...field} className="pl-7"/>
                                    </div>
                                </FormControl>
                            </div>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                );
              })}
            </div>
            <Button type="submit" className="w-full">Save Budgets</Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
