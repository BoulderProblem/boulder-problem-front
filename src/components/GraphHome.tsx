'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card.tsx';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/components/ui/chart.tsx';
import useAuth from '@/services/useAuth.tsx';

const chartConfig = {
  users: {
    prefix: "d'",
    label: 'Utilisateurs',
    color: 'hsl(var(--chart-1))',
  },
  gerants: {
    prefix: 'de ',
    label: 'Gérants',
    color: 'hsl(var(--chart-2))',
  },
  posts: {
    prefix: 'de ',
    label: 'Posts',
    color: 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

export function GraphHome() {
  const { stats } = useAuth();
  const [activeChart, setActiveChart] =
    React.useState<keyof typeof chartConfig>('users');

  return (
    <div>
      {stats ? (
        <Card>
          <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
            <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6">
              <CardTitle>
                Statistiques du nombre {chartConfig[activeChart].prefix}
                {chartConfig[activeChart].label.toLowerCase()}
              </CardTitle>
              <CardDescription>
                nombre de créationation {chartConfig[activeChart].prefix}
                {chartConfig[activeChart].label.toLowerCase()} sur l'année
                courante
              </CardDescription>
            </div>
            <div className="flex">
              {['users', 'gerants', 'posts'].map((key) => {
                const chart = key as keyof typeof chartConfig;
                return (
                  <button
                    key={chart}
                    data-active={activeChart === chart}
                    className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left even:border-l data-[active=true]:bg-muted/50 sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
                    onClick={() => setActiveChart(chart)}
                  >
                    <span className="text-xs text-muted-foreground">
                      {chartConfig[chart].label}
                    </span>
                    <span className="text-lg font-bold leading-none sm:text-3xl">
                      {stats[chart]}
                    </span>
                  </button>
                );
              })}
            </div>
          </CardHeader>
          <CardContent className="px-2 sm:p-6">
            <ChartContainer
              config={chartConfig}
              className="aspect-auto h-[250px] w-full"
            >
              <BarChart
                accessibilityLayer
                data={stats.daysOfYear}
                margin={{
                  left: 12,
                  right: 12,
                }}
              >
                <CartesianGrid vertical={false} />
                <XAxis
                  dataKey="date"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  minTickGap={32}
                  tickFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString('fr-FR', {
                      month: 'short',
                      year: 'numeric',
                    });
                  }}
                />
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      className="w-[150px]"
                      nameKey="views"
                      labelFormatter={(value) => {
                        return new Date(value).toLocaleDateString('fr-FR', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        });
                      }}
                    />
                  }
                />
                <Bar
                  dataKey={activeChart}
                  fill={`var(--color-${activeChart})`}
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      ) : (
        <div></div>
      )}
    </div>
  );
}
