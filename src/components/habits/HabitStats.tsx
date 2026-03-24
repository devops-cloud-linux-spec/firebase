"use client";

import { useMemo } from "react";
import { Habit, HabitLog } from "@/lib/types";
import { 
  Bar, 
  BarChart, 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer,
  Line,
  LineChart,
  Pie,
  PieChart,
  Cell
} from "recharts";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent,
  type ChartConfig
} from "@/components/ui/chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format, subDays, eachDayOfInterval } from "date-fns";

interface HabitStatsProps {
  habits: Habit[];
  logs: HabitLog[];
}

export function HabitStats({ habits, logs }: HabitStatsProps) {
  // 1. Weekly Completion Data (Last 7 Days)
  const weeklyData = useMemo(() => {
    const last7Days = eachDayOfInterval({
      start: subDays(new Date(), 6),
      end: new Date(),
    });

    return last7Days.map((day) => {
      const dateStr = format(day, "yyyy-MM-dd");
      const completedCount = logs.filter((l) => l.date === dateStr && l.completed).length;
      return {
        date: format(day, "MMM dd"),
        completions: completedCount,
      };
    });
  }, [logs]);

  // 2. Category Distribution Data
  const categoryData = useMemo(() => {
    const counts: Record<string, number> = {};
    habits.forEach((h) => {
      counts[h.category] = (counts[h.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [habits]);

  const COLORS = ["#4D7A1F", "#0284c7", "#ea580c", "#9333ea", "#A6F25A"];

  const chartConfig = {
    completions: {
      label: "Completions",
      color: "hsl(var(--primary))",
    },
  } satisfies ChartConfig;

  if (habits.length === 0) {
    return (
      <Card className="border-muted bg-muted/20">
        <CardContent className="h-[300px] flex items-center justify-center text-muted-foreground italic text-center p-6">
          <p>Start tracking habits to see your progress visualizations here!</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Daily Completions (7D)</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <BarChart data={weeklyData}>
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar 
                  dataKey="completions" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]} 
                />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="border-muted">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Consistency Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px] w-full">
              <LineChart data={weeklyData}>
                <CartesianGrid vertical={false} strokeOpacity={0.1} />
                <XAxis 
                  dataKey="date" 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  fontSize={10} 
                  tickLine={false} 
                  axisLine={false}
                  allowDecimals={false}
                  tick={{ fill: 'hsl(var(--muted-foreground))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Line 
                  type="monotone" 
                  dataKey="completions" 
                  stroke="hsl(var(--accent))" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: "hsl(var(--accent))", strokeWidth: 2, stroke: "white" }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card className="border-muted">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Habit Distribution by Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center justify-around gap-8 py-4">
            <div className="h-[200px] w-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryData}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {categoryData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} stroke="white" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              {categoryData.map((item, index) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-sm" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                  <div className="flex flex-col">
                    <span className="text-xs font-bold leading-none">{item.name}</span>
                    <span className="text-[10px] text-muted-foreground">{item.value} {item.value === 1 ? 'habit' : 'habits'}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
