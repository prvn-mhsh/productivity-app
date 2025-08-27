'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { LucideProps } from 'lucide-react';
import type React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface InsightsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<LucideProps>;
  isCurrency?: boolean;
  trend?: 'up' | 'down';
}

export function InsightsCard({ title, value, icon: Icon, isCurrency = false, trend }: InsightsCardProps) {
  const formattedValue = isCurrency
    ? new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value)
    : value.toLocaleString();

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="w-4 h-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{formattedValue}</div>
        {trend && (
          <p className={cn("text-xs text-muted-foreground flex items-center", trend === 'up' ? 'text-green-600' : 'text-red-600')}>
            {trend === 'up' ? 
              <TrendingUp className="w-4 h-4 mr-1" /> : 
              <TrendingDown className="w-4 h-4 mr-1" />
            }
            {trend === 'up' ? 'Looking good' : 'Over budget'}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
