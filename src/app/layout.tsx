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
  title: 'Productivity Assistant',
  description: 'A productivity app with budgeting, reminders, and notes.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="font-sans antialiased h-full">
        <BudgetProvider>
          <AppShell>{children}</AppShell>
        </BudgetProvider>
        <Toaster />
      </body>
    </html>
  );
}
