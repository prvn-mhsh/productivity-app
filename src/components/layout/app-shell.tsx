
'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Bell,
  StickyNote,
  FolderArchive,
  PlusCircle,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { AddTransactionDialog } from '../add-transaction-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import NotesPage from '@/app/notes/page';
import RemindersPage from '@/app/reminders/page';
import BudgetPage from '@/app/budget/page';
import DocumentsPage from '@/app/documents/page';
import { DashboardPage } from '../dashboard/dashboard-page';

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
  const isMobile = useIsMobile();

  const handleFabClick = () => {
    if (pathname.startsWith('/budget')) setAddTransactionOpen(true);
    else if (pathname.startsWith('/notes')) setNoteFormOpen(true);
    else if (pathname.startsWith('/reminders')) setReminderFormOpen(true);
    else if (pathname.startsWith('/documents')) {
      // Future: Handle document upload
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

  const renderPageContent = () => {
    switch (pathname) {
        case '/': return <DashboardPage />;
        case '/budget': return <BudgetPage />;
        case '/notes': return <NotesPage isFormOpen={isNoteFormOpen} onFormOpenChange={setNoteFormOpen} onNoteCreate={() => setNoteFormOpen(true)} />;
        case '/reminders': return <RemindersPage isFormOpen={isReminderFormOpen} onFormOpenChange={setReminderFormOpen} />;
        case '/documents': return <DocumentsPage />;
        default: return children;
    }
  };
  
  const filteredNavItems = navItems.filter(item => {
    if (isMobile) return item.href !== '/'; // Hide Dashboard on mobile nav
    return true;
  });

  return (
    <div className="flex flex-col h-screen bg-background">
      <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:hidden">
        <Link href="/" className="text-xl font-bold text-primary">
          ClarityBudgets
        </Link>
      </header>

      <main className="flex-1 overflow-auto p-4 md:p-6 pb-20 md:pb-6">
        {renderPageContent()}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 z-10 border-t bg-background/95 backdrop-blur-sm md:relative md:border-none">
        <div className="flex h-16 items-center justify-around max-w-lg mx-auto">
          {filteredNavItems.map(item => (
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
    </div>
  );
}
