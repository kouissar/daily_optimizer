'use client'

import { useState } from 'react'
import { toggleHabitLog } from '@/app/actions/habits'
import { Check } from 'lucide-react'

type Category = { id: string; name: string }
type Habit = { id: string; category_id: string; name: string; description: string; type: string; unit: string }
type Log = { id: string; habit_id: string; completed: boolean; value: number }

export function Checklist({ categories, habits, logs, date }: { categories: Category[], habits: Habit[], logs: Log[], date: string }) {
  const [localLogs, setLocalLogs] = useState<Record<string, Log>>(
    logs.reduce((acc, log) => ({ ...acc, [log.habit_id]: log }), {})
  )

  const handleToggle = async (habitId: string, completed: boolean) => {
    setLocalLogs(prev => ({
      ...prev,
      [habitId]: { ...prev[habitId], completed } as Log
    }))
    await toggleHabitLog(habitId, date, completed)
  }

  const handleValueChange = async (habitId: string, value: number) => {
    const completed = value > 0;
    setLocalLogs(prev => ({
      ...prev,
      [habitId]: { ...prev[habitId], value, completed } as Log
    }))
    await toggleHabitLog(habitId, date, completed, value)
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {categories.map(category => {
        const categoryHabits = habits.filter(h => h.category_id === category.id)
        if (categoryHabits.length === 0) return null

        return (
          <div key={category.id} className="flex flex-col gap-3">
            <h2 className="text-lg font-bold tracking-tight text-slate-800 dark:text-slate-200 ml-1">{category.name}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {categoryHabits.map(habit => {
                const log = localLogs[habit.id]
                const isCompleted = log?.completed || false
                const currentValue = log?.value || ''

                return (
                  <div 
                    key={habit.id} 
                    className={`flex flex-col p-3 rounded-xl border transition-all duration-200 ${
                      isCompleted 
                        ? 'bg-indigo-50/50 dark:bg-indigo-950/20 border-indigo-200 dark:border-indigo-900 shadow-sm' 
                        : 'bg-white dark:bg-neutral-900 border-slate-200 dark:border-neutral-800 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 w-full">
                      <div 
                        className="flex items-start gap-3 flex-1 cursor-pointer"
                        onClick={() => handleToggle(habit.id, !isCompleted)}
                      >
                        <div className={`mt-0.5 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors ${
                          isCompleted 
                            ? 'bg-indigo-600 border-indigo-600 text-white' 
                            : 'border-slate-300 dark:border-slate-600 bg-transparent'
                        }`}>
                          {isCompleted && <Check className="w-3.5 h-3.5" strokeWidth={3} />}
                        </div>
                        <div className="flex flex-col">
                          <p className={`font-semibold text-sm transition-colors ${isCompleted ? 'text-slate-500 dark:text-slate-400 line-through' : 'text-slate-800 dark:text-slate-100'}`}>
                            {habit.name}
                          </p>
                          {habit.description && (
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{habit.description}</p>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {habit.type === 'value' && (
                      <div className="mt-2 pt-2 border-t border-slate-100 dark:border-neutral-800 flex items-center justify-between">
                        <span className="text-xs font-medium text-slate-500">Record your {habit.unit}</span>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            value={currentValue}
                            onChange={(e) => handleValueChange(habit.id, parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            className="w-16 px-2 py-1 text-right text-sm border border-slate-200 dark:border-neutral-700 rounded-md bg-slate-50 dark:bg-neutral-800 focus:ring-2 focus:ring-indigo-600 focus:outline-none transition-shadow"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })}
    </div>
  )
}
