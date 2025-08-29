
'use client';
import { AppShell } from '@/components/layout/app-shell';
import { useAuth } from '@/context/auth-context';
import { DashboardPage } from '@/components/dashboard/dashboard-page';
import WelcomePage from './welcome/page';

export default function Home() {
  const { user } = useAuth();
  
  if (!user) {
    return <WelcomePage />
  }

  return (
    <AppShell>
      <DashboardPage />
    </AppShell>
  );
}
