
'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { Badge } from '@/components/ui/badge';
import type { Transaction } from '@/lib/types';
import { CATEGORIES } from '@/lib/constants';
import { format } from 'date-fns';
import { Button } from '../ui/button';
import { Trash2 } from 'lucide-react';
import { useBudgetData } from '@/hooks/use-budget-data';
import { useToast } from '@/hooks/use-toast';
import Link from 'next/link';

interface RecentTransactionsProps {
  transactions: Transaction[];
  showViewAll?: boolean;
}

export function RecentTransactions({ transactions, showViewAll = false }: RecentTransactionsProps) {
  const { deleteTransaction } = useBudgetData();
  const { toast } = useToast();
  const getCategory = (id: string) => CATEGORIES.find(c => c.id === id);

  const handleDelete = (transaction: Transaction) => {
    deleteTransaction(transaction.id);
    toast({
        title: "Transaction Deleted",
        description: `Successfully deleted "${transaction.description}".`
    })
  }

  return (
    <Card>
      <CardHeader className="relative">
        <CardTitle>Recent Transactions</CardTitle>
        {showViewAll && <Button variant="link" className="p-0 h-auto absolute top-6 right-4" asChild><Link href="/budget">View All</Link></Button>}
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Description</TableHead>
              <TableHead className='hidden sm:table-cell'>Category</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead className="text-right sr-only">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map(t => {
                const category = getCategory(t.categoryId);
                return (
                  <TableRow key={t.id}>
                    <TableCell className="font-medium">
                        <div>{t.description}</div>
                        <div className="text-xs text-muted-foreground sm:hidden">{category?.name}</div>
                    </TableCell>
                    <TableCell className='hidden sm:table-cell'>
                      {category && <Badge variant="outline">{category.name}</Badge>}
                    </TableCell>
                    <TableCell className="text-right">
                      ₹{t.amount.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                       <AlertDialog>
                        <AlertDialogTrigger asChild>
                           <Button variant="ghost" size="icon">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                              This action cannot be undone. This will permanently delete this transaction.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(t)}>Delete</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No transactions yet.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
