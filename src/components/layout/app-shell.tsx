
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  Bell,
  StickyNote,
  FolderArchive,
  Plus,
  LogOut,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddTransactionDialog } from '../add-transaction-dialog';
import NotesPage from '@/app/notes/page';
import RemindersPage from '@/app/reminders/page';
import BudgetPage from '@/app/budget/page';
import DocumentsPage from '@/app/documents/page';
import { DashboardPage } from '../dashboard/dashboard-page';
import { useAuth } from '@/context/auth-context';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useToast } from '@/hooks/use-toast';

const navItems = [
  { href: '/', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/budget', icon: LayoutDashboard, label: 'Budget' },
  { href: '/reminders', icon: Bell, label: 'Reminders' },
  { href: '/notes', icon: StickyNote, label: 'Notes' },
  { href: '/documents', icon: FolderArchive, label: 'Documents' },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isAddTransactionOpen, setAddTransactionOpen] = React.useState(false);
  const [isNoteFormOpen, setNoteFormOpen] = React.useState(false);
  const [isReminderFormOpen, setReminderFormOpen] = React.useState(false);

  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuth();
  const { toast } = useToast();

  const handleFabClick = () => {
    if (pathname.startsWith('/budget') || pathname === '/') setAddTransactionOpen(true);
    else if (pathname.startsWith('/notes')) setNoteFormOpen(true);
    else if (pathname.startsWith('/reminders')) setReminderFormOpen(true);
    else if (pathname.startsWith('/documents')) {
      // Future: Handle document upload
      toast({ title: "Coming Soon!", description: "Document uploads will be available in a future update."})
    } else {
        setAddTransactionOpen(true);
    }
  };
  
  const getFabTooltip = () => {
    if (pathname.startsWith('/budget')) return "Add Transaction";
    if (pathname.startsWith('/notes')) return "New Note";
    if (pathname.startsWith('/reminders')) return "New Reminder";
    if (pathname.startsWith('/documents')) return "Upload File";
    return "Add Transaction"
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast({ title: "Logged out", description: "You have been successfully logged out." });
      router.push('/login');
    } catch (error) {
      toast({ variant: 'destructive', title: "Logout Failed", description: "Something went wrong." });
    }
  }

  const renderPageContent = () => {
    // This logic is simplified because the root page.tsx now handles the main routing
    // and this component is only rendered for authenticated users.
    // The children prop will contain the correct page component.
    return children;
  };
  
  if (!user) {
    return <div className="flex h-screen w-full items-center justify-center">Redirecting...</div>
  }

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:hidden">
        <Link href="/" className="text-xl font-bold text-primary">
          ClarityBudgets
        </Link>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur-sm md:relative md:border-none">
        <div className="flex h-16 items-center justify-around max-w-lg mx-auto">
          {navItems.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-md text-muted-foreground transition-colors hover:text-primary',
                pathname === item.href && 'text-primary'
              )}
            >
              <item.icon className="w-6 h-6" />
              <span className="text-xs font-medium">{item.label}</span>
            </Link>
          ))}
            <button
              onClick={handleLogout}
              className={cn(
                'flex flex-col items-center gap-1 p-2 rounded-md text-muted-foreground transition-colors hover:text-primary'
              )}
            >
              <LogOut className="w-6 h-6" />
              <span className="text-xs font-medium">Logout</span>
            </button>
        </div>
      </nav>

        {/* FAB */}
        <div className="fixed bottom-20 right-6 z-20">
             <Button
                isFloating
                title={getFabTooltip()}
                onClick={handleFabClick}
                className="rounded-full shadow-lg"
            >
                <Plus className="w-6 h-6" />
            </Button>
        </div>


      <AddTransactionDialog open={isAddTransactionOpen} onOpenChange={setAddTransactionOpen} />
       <NotesPage isFormOpen={isNoteFormOpen} onFormOpenChange={setNoteFormOpen} onNoteCreate={() => {}} />
       <RemindersPage isFormOpen={isReminderFormOpen} onFormOpenChange={setReminderFormOpen} />
    </div>
  );
}
