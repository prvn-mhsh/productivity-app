'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
} from '@/components/ui/chart';
import type { Spending } from '@/lib/types';
import { Pie, PieChart, Cell } from 'recharts';
import type { ChartConfig } from '@/components/ui/chart';

interface SpendingChartProps {
  data: Spending[];
}

export function SpendingChart({ data }: SpendingChartProps) {
  const chartData = data.filter(item => item.spent > 0);

  const chartConfig = data.reduce((acc, item) => {
    acc[item.name] = {
      label: item.name,
      color: item.color,
    };
    return acc;
  }, {} as ChartConfig);

  const totalSpent = chartData.reduce((acc, item) => acc + item.spent, 0);

  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle>Spending by Category</CardTitle>
        <CardDescription>This month's spending distribution.</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 flex items-center justify-center">
        {chartData.length > 0 ? (
          <ChartContainer config={chartConfig} className="min-h-[200px] w-full max-w-[400px]">
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie data={chartData} dataKey="spent" nameKey="name" innerRadius={60} strokeWidth={5}>
                {chartData.map((entry) => (
                    <Cell key={`cell-${entry.name}`} fill={entry.color} />
                ))}
              </Pie>
              <ChartLegend content={<ChartLegendContent nameKey="name" />} />
            </PieChart>
          </ChartContainer>
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <p className="text-lg font-semibold">No spending data yet!</p>
            <p className="text-sm text-muted-foreground">Add a transaction to see your spending chart.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
