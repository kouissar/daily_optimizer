'use client'

import { useMemo, useState } from 'react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { Activity, TrendingUp, Award, Target } from 'lucide-react'

type Habit = { id: string; name: string; type: string; unit: string }
type Log = { id: string; date: string; habit_id: string; completed: boolean; value?: number }

export function ProgressCharts({ habits, logs }: { habits: Habit[], logs: Log[] }) {
  const [selectedHabitId, setSelectedHabitId] = useState<string>(habits[0]?.id || '')
  const [daysFilter, setDaysFilter] = useState<number>(14)

  // Calculate Metrics
  const metrics = useMemo(() => {
    if (habits.length === 0 || logs.length === 0) return null;

    // Unique dates
    const uniqueDates = Array.from(new Set(logs.map(l => l.date))).sort()
    
    // Overall completion trend
    const dateGroups: Record<string, number> = {}
    logs.forEach(log => {
      if (!dateGroups[log.date]) dateGroups[log.date] = 0
      if (log.completed) dateGroups[log.date] += 1
    })

    const overallTrend = uniqueDates.slice(-daysFilter).map(date => ({
      date,
      rate: Math.round((dateGroups[date] / habits.length) * 100)
    }))

    // Habit specific stats
    const habitStats = habits.map(habit => {
      const habitLogs = logs.filter(l => l.habit_id === habit.id)
      const completed = habitLogs.filter(l => l.completed).length
      const rate = uniqueDates.length > 0 ? Math.round((completed / uniqueDates.length) * 100) : 0
      return { ...habit, completed, rate, habitLogs }
    }).sort((a, b) => b.rate - a.rate)

    const bestHabit = habitStats[0]
    const needsWorkHabit = habitStats[habitStats.length - 1]
    
    // Average completion over all time
    const totalCompletions = logs.filter(l => l.completed).length
    const totalPossible = uniqueDates.length * habits.length
    const avgRate = totalPossible > 0 ? Math.round((totalCompletions / totalPossible) * 100) : 0

    return { overallTrend, habitStats, bestHabit, needsWorkHabit, avgRate, uniqueDates }
  }, [habits, logs, daysFilter])

  // Selected Habit Data
  const selectedHabitData = useMemo(() => {
    if (!metrics || !selectedHabitId) return []
    const habit = metrics.habitStats.find(h => h.id === selectedHabitId)
    if (!habit) return []

    return metrics.uniqueDates.slice(-daysFilter).map(date => {
      const log = habit.habitLogs.find(l => l.date === date)
      return {
        date,
        completed: log?.completed ? 100 : 0,
        value: log?.value || 0
      }
    })
  }, [metrics, selectedHabitId, daysFilter])

  if (!metrics) {
    return (
      <div className="flex items-center justify-center h-64 text-slate-500 bg-white dark:bg-neutral-900 rounded-2xl border border-slate-200 dark:border-neutral-800 shadow-sm">
        Not enough data yet. Complete some habits to see your progress!
      </div>
    )
  }

  const selectedHabitInfo = habits.find(h => h.id === selectedHabitId)

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Stats Row (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-indigo-100 dark:bg-indigo-900/30 p-3 rounded-xl text-indigo-600 dark:text-indigo-400">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Avg Completion</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.avgRate}%</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-emerald-100 dark:bg-emerald-900/30 p-3 rounded-xl text-emerald-600 dark:text-emerald-400">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Active Days</p>
            <p className="text-2xl font-bold text-slate-900 dark:text-slate-50">{metrics.uniqueDates.length}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-amber-100 dark:bg-amber-900/30 p-3 rounded-xl text-amber-600 dark:text-amber-400">
            <Award className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Best Habit</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50 truncate">{metrics.bestHabit?.name}</p>
          </div>
        </div>

        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="bg-rose-100 dark:bg-rose-900/30 p-3 rounded-xl text-rose-600 dark:text-rose-400">
            <Target className="w-6 h-6" />
          </div>
          <div className="overflow-hidden">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">Needs Work</p>
            <p className="text-lg font-bold text-slate-900 dark:text-slate-50 truncate">{metrics.needsWorkHabit?.name}</p>
          </div>
        </div>
      </div>

      {/* Middle Row (2 Columns: Main Chart & Top Performers) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">
        {/* Main Overall Trend Chart */}
        <div className="lg:col-span-2 bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Overall Consistency</h2>
            <select 
              className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
              value={daysFilter}
              onChange={(e) => setDaysFilter(Number(e.target.value))}
            >
              <option value={7}>Last 7 days</option>
              <option value={14}>Last 14 days</option>
              <option value={21}>Last 21 days</option>
              <option value={28}>Last 28 days</option>
            </select>
          </div>
          <div className="flex-1 w-full min-h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={metrics.overallTrend} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tickFormatter={(val) => `${val}%`} tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value}%`, 'Completed']}
                  labelFormatter={(label) => `Date: ${label}`}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="rate" stroke="#4f46e5" strokeWidth={4} dot={{ r: 4, strokeWidth: 2 }} activeDot={{ r: 6, strokeWidth: 0 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Top Habits List */}
        <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Habit Leaderboard</h2>
          <div className="flex-1 overflow-y-auto pr-2 space-y-4">
            {metrics.habitStats.slice(0, 6).map(habit => (
              <div key={habit.id} className="flex flex-col gap-1.5">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-slate-700 dark:text-slate-200 truncate pr-2">{habit.name}</span>
                  <span className="font-bold text-indigo-600 dark:text-indigo-400">{habit.rate}%</span>
                </div>
                <div className="w-full bg-slate-100 dark:bg-neutral-800 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-indigo-500 h-full rounded-full transition-all duration-1000" 
                    style={{ width: `${habit.rate}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Row: Individual Habit Tracker */}
      <div className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">Deep Dive: Individual Habits</h2>
            <p className="text-sm text-slate-500">Track the performance of a specific habit.</p>
          </div>
          <select 
            className="px-4 py-2 rounded-xl border border-slate-200 dark:border-neutral-700 bg-slate-50 dark:bg-neutral-800 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600"
            value={selectedHabitId}
            onChange={(e) => setSelectedHabitId(e.target.value)}
          >
            {habits.map(h => (
              <option key={h.id} value={h.id}>{h.name}</option>
            ))}
          </select>
        </div>

        <div className="h-64 w-full">
          {selectedHabitInfo?.type === 'value' ? (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedHabitData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [`${value} ${selectedHabitInfo.unit}`, 'Logged']}
                  labelFormatter={(label) => `Date: ${label}`}
                  cursor={{ fill: 'rgba(79, 70, 229, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="value" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={selectedHabitData} margin={{ top: 5, right: 10, bottom: 5, left: -20 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" strokeOpacity={0.5} />
                <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#888' }} axisLine={false} tickLine={false} dy={10} />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12, fill: '#888' }} tickFormatter={() => ''} axisLine={false} tickLine={false} />
                <Tooltip 
                  formatter={(value: any) => [value > 0 ? 'Completed' : 'Missed', 'Status']}
                  labelFormatter={(label) => `Date: ${label}`}
                  cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Bar dataKey="completed" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>
    </div>
  )
}
