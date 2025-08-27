
'use client';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarTrigger,
  SidebarFooter,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LayoutDashboard, Settings, PlusCircle, PiggyBank, Bell } from 'lucide-react';
import React from 'react';
import Link from 'next/link';
import { AddTransactionDialog } from '../add-transaction-dialog';
import { useIsMobile } from '@/hooks/use-mobile';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isDialogOpen, setIsDialogOpen] = React.useState(false);
  const isMobile = useIsMobile();
  const pathname = usePathname();
  
  const addTransactionButton = (
     <Button size="lg" className="w-full" onClick={() => setIsDialogOpen(true)}>
        <PlusCircle className="mr-2" />
        Add Transaction
      </Button>
  );

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-background">
        <Sidebar>
          <SidebarHeader className="p-4">
            <div className="flex items-center gap-2">
              <PiggyBank className="w-8 h-8 text-primary" />
              <span className="text-xl font-semibold">Clarity</span>
            </div>
          </SidebarHeader>
          <SidebarContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/'}>
                  <Link href="/">
                    <LayoutDashboard />
                    Budget
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton asChild isActive={pathname === '/reminders'}>
                  <Link href="/reminders">
                    <Bell />
                    Reminders
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarContent>
          <SidebarFooter className="p-4">
             {pathname === '/' && addTransactionButton}
          </SidebarFooter>
        </Sidebar>

        <SidebarInset>
          <header className="flex items-center justify-between h-16 px-4 border-b shrink-0 md:justify-end">
            <SidebarTrigger className="md:hidden" />
            <div className="flex items-center gap-4">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-5 h-5" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                    <SheetHeader>
                        <SheetTitle>Settings</SheetTitle>
                    </SheetHeader>
                    <div className="py-4">
                        Settings content goes here.
                    </div>
                </SheetContent>
              </Sheet>
              <Avatar>
                <AvatarImage src="https://picsum.photos/100" alt="User" data-ai-hint="person avatar" />
                <AvatarFallback>CB</AvatarFallback>
              </Avatar>
            </div>
          </header>
          <main className="flex-1 p-4 overflow-auto lg:p-6">
            {children}
          </main>
        </SidebarInset>
      </div>
      <AddTransactionDialog open={isDialogOpen} onOpenChange={setIsDialogOpen} />
    </SidebarProvider>
  );
}
