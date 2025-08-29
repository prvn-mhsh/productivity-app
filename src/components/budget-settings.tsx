
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useBudgetData } from '@/hooks/use-budget-data';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

const budgetSchema = z.object({
  totalBudget: z.coerce
    .number()
    .min(0, 'Budget must be a positive number'),
});

type BudgetFormValues = z.infer<typeof budgetSchema>;

interface BudgetSettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BudgetSettingsDialog({
  open,
  onOpenChange,
}: BudgetSettingsDialogProps) {
  const { totalBudget, setTotalBudget } = useBudgetData();
  const { toast } = useToast();

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetSchema),
    defaultValues: {
      totalBudget: totalBudget || 0,
    },
  });
  
  React.useEffect(() => {
    if (open) {
      form.reset({ totalBudget: totalBudget || 0 });
    }
  }, [open, totalBudget, form]);


  const onSubmit = (values: BudgetFormValues) => {
    setTotalBudget(values.totalBudget);
    toast({
      title: 'Budget Updated',
      description: 'Your new monthly budget has been saved.',
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Set Monthly Budget</DialogTitle>
          <DialogDescription>
            Enter your total budget for the month. This will be used to
            track your overall spending.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="totalBudget"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Total Monthly Budget</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-muted-foreground">
                        ₹
                      </span>
                      <Input
                        type="number"
                        {...field}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit">Save Budget</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
