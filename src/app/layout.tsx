import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppShell } from '@/components/layout/app-shell';
import { BudgetProvider } from '@/hooks/use-budget-data';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
});

export const metadata: Metadata = {
  title: 'ClarityBudgets',
  description: 'A budgeting and expense tracking app with spending categories, charts and budget goals.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-body antialiased h-full">
        <BudgetProvider>
          <AppShell>{children}</AppShell>
        </BudgetProvider>
        <Toaster />
      </body>
    </html>
  );
}
