'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useBudgetData } from '@/hooks/use-budget-data';
import { CATEGORIES } from '@/lib/constants';
import { suggestCategoryAction } from '@/actions/suggest-category';
import { useState, useEffect, useTransition } from 'react';
import { Loader2, Wand2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const transactionSchema = z.object({
  description: z.string().min(1, 'Description is required'),
  amount: z.coerce.number().positive('Amount must be positive'),
  categoryId: z.string().min(1, 'Category is required'),
});

type TransactionFormValues = z.infer<typeof transactionSchema>;

interface AddTransactionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddTransactionDialog({ open, onOpenChange }: AddTransactionDialogProps) {
  const { addTransaction } = useBudgetData();
  const { toast } = useToast();
  const form = useForm<TransactionFormValues>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      description: '',
      amount: 0,
      categoryId: '',
    },
  });

  const [suggestedCategory, setSuggestedCategory] = useState<string | null>(null);
  const [isSuggesting, startSuggestionTransition] = useTransition();

  const descriptionValue = form.watch('description');

  useEffect(() => {
    setSuggestedCategory(null);
    if (descriptionValue.length < 3) return;

    const handler = setTimeout(() => {
      startSuggestionTransition(async () => {
        const categoryId = await suggestCategoryAction(descriptionValue);
        if (categoryId) {
          setSuggestedCategory(categoryId);
        }
      });
    }, 500);

    return () => clearTimeout(handler);
  }, [descriptionValue]);

  const onSubmit = (values: TransactionFormValues) => {
    addTransaction(values);
    toast({
        title: "Transaction Added",
        description: `Successfully added "${values.description}".`
    })
    form.reset();
    onOpenChange(false);
  };
  
  const handleUseSuggestion = () => {
    if (suggestedCategory) {
      form.setValue('categoryId', suggestedCategory);
      setSuggestedCategory(null);
    }
  };
  
  useEffect(() => {
    if (!open) {
      form.reset();
      setSuggestedCategory(null);
    }
  }, [open, form]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Transaction</DialogTitle>
          <DialogDescription>
            Enter the details of your transaction below. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Coffee with friends" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input type="number" placeholder="0.00" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                   <div className="relative">
                    <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {CATEGORIES.map(category => (
                                <SelectItem key={category.id} value={category.id}>
                                    {category.name}
                                </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </FormControl>
                    </div>
                  <FormMessage />
                  {isSuggesting && <p className="text-xs text-muted-foreground mt-1 flex items-center"><Loader2 className="mr-1 h-3 w-3 animate-spin" />Thinking...</p>}
                  {suggestedCategory && (
                    <Button type="button" variant="outline" size="sm" onClick={handleUseSuggestion} className="mt-2">
                        <Wand2 className="mr-2 h-4 w-4" />
                        Use suggestion: {CATEGORIES.find(c => c.id === suggestedCategory)?.name}
                    </Button>
                  )}
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" disabled={form.formState.isSubmitting}>
                Save Transaction
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
