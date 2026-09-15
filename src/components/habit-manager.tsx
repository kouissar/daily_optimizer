'use client'

import { useState } from 'react'
import { addCategory, addHabit, deleteHabit } from '@/app/actions/habits'

type Category = { id: string; name: string }
type Habit = { id: string; category_id: string; name: string; description: string; type: string; unit: string }

export function HabitManager({ categories, habits }: { categories: Category[], habits: Habit[] }) {
  const [newCatName, setNewCatName] = useState('')
  const [newHabit, setNewHabit] = useState({ categoryId: '', name: '', description: '', type: 'boolean', unit: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newCatName) return
    setIsSubmitting(true)
    await addCategory(newCatName)
    setNewCatName('')
    setIsSubmitting(false)
  }

  const handleAddHabit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newHabit.categoryId || !newHabit.name) return
    setIsSubmitting(true)
    await addHabit(newHabit.categoryId, newHabit.name, newHabit.description, newHabit.type as 'boolean' | 'value', newHabit.unit)
    setNewHabit({ categoryId: newHabit.categoryId, name: '', description: '', type: 'boolean', unit: '' })
    setIsSubmitting(false)
  }

  const handleDeleteHabit = async (habitId: string) => {
    if (confirm('Are you sure you want to delete this habit?')) {
      await deleteHabit(habitId)
    }
  }

  return (
    <div className="flex flex-col gap-8 w-full animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Category Management */}
      <section className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Add a Category</h2>
        <form onSubmit={handleAddCategory} className="flex flex-col sm:flex-row gap-4 items-end">
          <div className="flex flex-col gap-2 flex-1 w-full">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category Name</label>
            <input
              type="text"
              value={newCatName}
              onChange={e => setNewCatName(e.target.value)}
              placeholder="e.g. Finance, Hobbies"
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none w-full"
              required
            />
          </div>
          <button disabled={isSubmitting} type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto">
            Add Category
          </button>
        </form>
      </section>

      {/* Habit Management */}
      <section className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-6 rounded-2xl shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Add a New Habit</h2>
        <form onSubmit={handleAddHabit} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Category</label>
            <select
              value={newHabit.categoryId}
              onChange={e => setNewHabit({...newHabit, categoryId: e.target.value})}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Habit Name</label>
              <input
                type="text"
                value={newHabit.name}
                onChange={e => setNewHabit({...newHabit, name: e.target.value})}
                placeholder="e.g. Read a book"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Description (Optional)</label>
              <input
                type="text"
                value={newHabit.description}
                onChange={e => setNewHabit({...newHabit, description: e.target.value})}
                placeholder="e.g. 20 minutes before bed"
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-5">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Tracking Type</label>
              <select
                value={newHabit.type}
                onChange={e => setNewHabit({...newHabit, type: e.target.value})}
                className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
              >
                <option value="boolean">Done / Not Done</option>
                <option value="value">Number / Value Tracking</option>
              </select>
            </div>
            {newHabit.type === 'value' && (
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Measurement Unit</label>
                <input
                  type="text"
                  value={newHabit.unit}
                  onChange={e => setNewHabit({...newHabit, unit: e.target.value})}
                  placeholder="e.g. pages, mins, reps"
                  className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
                  required
                />
              </div>
            )}
          </div>

          <div className="mt-2 flex justify-end">
            <button disabled={isSubmitting} type="submit" className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70 w-full sm:w-auto">
              Add Habit
            </button>
          </div>
        </form>
      </section>

      {/* Existing Habits List */}
      <section>
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-4 ml-1">Your Current Habits</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {categories.map(category => {
            const catHabits = habits.filter(h => h.category_id === category.id)
            if (catHabits.length === 0) return null
            return (
              <div key={category.id} className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 p-5 rounded-2xl shadow-sm">
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200 border-b border-slate-100 dark:border-neutral-800 pb-3 mb-3">{category.name}</h3>
                <ul className="flex flex-col gap-2">
                  {catHabits.map(habit => (
                    <li key={habit.id} className="flex justify-between items-center py-2 px-1 hover:bg-slate-50 dark:hover:bg-neutral-800/50 rounded-lg transition-colors group">
                      <div className="flex flex-col">
                        <span className="font-medium text-slate-700 dark:text-slate-300">{habit.name}</span>
                        {habit.type === 'value' && <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Tracks: {habit.unit}</span>}
                      </div>
                      <button 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-500 hover:text-white hover:bg-red-500 text-sm px-3 py-1.5 rounded-full font-medium transition-colors opacity-100 md:opacity-0 md:group-hover:opacity-100 bg-red-50 dark:bg-red-950/30"
                      >
                        Delete
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>
      </section>
    </div>
  )
}
