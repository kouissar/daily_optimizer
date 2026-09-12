'use client'

import { useMemo, useState } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'

type Habit = { id: string; name: string }
type Log = { id: string; date: string; habit_id: string; completed: boolean }

export function ProgressCharts({ habits, logs }: { habits: Habit[], logs: Log[] }) {
  const [view, setView] = useState<'daily' | 'weekly'>('daily')

  const chartData = useMemo(() => {
    const totalHabits = habits.length;
    if (totalHabits === 0) return [];

    // Group logs by date
    const dateGroups: Record<string, number> = {};
    
    logs.forEach(log => {
      if (!dateGroups[log.date]) {
        dateGroups[log.date] = 0;
      }
      if (log.completed) {
        dateGroups[log.date] += 1;
      }
    });

    const data = Object.keys(dateGroups).sort().map(date => {
      const completedCount = dateGroups[date];
      return {
        date,
        completionRate: Math.round((completedCount / totalHabits) * 100),
        completed: completedCount,
        total: totalHabits
      }
    });

    // In a full app, we would do more complex weekly/monthly aggregations here based on the 'view' state
    // For simplicity, we are showing the recent dates available in the logs.
    return data.slice(-14); // Show last 14 active days
  }, [habits, logs, view])

  return (
    <div className="flex flex-col gap-8 w-full">
      <div className="bg-card border rounded-lg p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">Completion Rate (Last 14 Active Days)</h2>
          <div className="flex gap-2">
            {/* Simple toggle placeholder for future expansion */}
            <button className="text-sm px-3 py-1 rounded bg-foreground text-background">Daily</button>
          </div>
        </div>
        
        <div className="h-72 w-full">
          {chartData.length === 0 ? (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              No data yet! Complete some habits to see your progress here.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} />
                <Tooltip 
                  formatter={(value: number) => [`${value}%`, 'Completed']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ backgroundColor: 'hsl(var(--background))', borderColor: 'hsl(var(--border))' }}
                />
                <Line type="monotone" dataKey="completionRate" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
