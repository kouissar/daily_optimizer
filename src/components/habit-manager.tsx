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
    <div className="flex flex-col gap-12 w-full">
      {/* Category Management */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add a Category</h2>
        <form onSubmit={handleAddCategory} className="flex gap-4">
          <input
            type="text"
            value={newCatName}
            onChange={e => setNewCatName(e.target.value)}
            placeholder="e.g. Finance, Hobbies"
            className="flex-1 rounded-md px-4 py-2 border bg-background"
            required
          />
          <button disabled={isSubmitting} type="submit" className="bg-foreground text-background px-4 py-2 rounded-md hover:opacity-90">
            Add Category
          </button>
        </form>
      </section>

      {/* Habit Management */}
      <section className="bg-card border rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Add a New Habit</h2>
        <form onSubmit={handleAddHabit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Category</label>
            <select
              value={newHabit.categoryId}
              onChange={e => setNewHabit({...newHabit, categoryId: e.target.value})}
              className="rounded-md px-4 py-2 border bg-background"
              required
            >
              <option value="">Select a category</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Habit Name</label>
            <input
              type="text"
              value={newHabit.name}
              onChange={e => setNewHabit({...newHabit, name: e.target.value})}
              placeholder="e.g. Read a book"
              className="rounded-md px-4 py-2 border bg-background"
              required
            />
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium">Description (Optional)</label>
            <input
              type="text"
              value={newHabit.description}
              onChange={e => setNewHabit({...newHabit, description: e.target.value})}
              placeholder="e.g. Read for 20 minutes before bed"
              className="rounded-md px-4 py-2 border bg-background"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1 flex flex-col gap-2">
              <label className="text-sm font-medium">Tracking Type</label>
              <select
                value={newHabit.type}
                onChange={e => setNewHabit({...newHabit, type: e.target.value})}
                className="rounded-md px-4 py-2 border bg-background"
              >
                <option value="boolean">Done / Not Done</option>
                <option value="value">Number / Value (e.g. minutes, pages)</option>
              </select>
            </div>
            {newHabit.type === 'value' && (
              <div className="flex-1 flex flex-col gap-2">
                <label className="text-sm font-medium">Unit</label>
                <input
                  type="text"
                  value={newHabit.unit}
                  onChange={e => setNewHabit({...newHabit, unit: e.target.value})}
                  placeholder="e.g. pages, mins, reps"
                  className="rounded-md px-4 py-2 border bg-background"
                  required
                />
              </div>
            )}
          </div>

          <button disabled={isSubmitting} type="submit" className="bg-foreground text-background px-4 py-2 rounded-md hover:opacity-90 mt-4">
            Add Habit
          </button>
        </form>
      </section>

      {/* Existing Habits List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Your Current Habits</h2>
        <div className="flex flex-col gap-6">
          {categories.map(category => {
            const catHabits = habits.filter(h => h.category_id === category.id)
            if (catHabits.length === 0) return null
            return (
              <div key={category.id} className="border p-4 rounded-lg bg-card">
                <h3 className="font-semibold text-lg border-b pb-2 mb-3">{category.name}</h3>
                <ul className="flex flex-col gap-2">
                  {catHabits.map(habit => (
                    <li key={habit.id} className="flex justify-between items-center py-2">
                      <div>
                        <span className="font-medium">{habit.name}</span>
                        {habit.type === 'value' && <span className="text-xs ml-2 text-muted-foreground border rounded px-1 py-0.5">{habit.unit}</span>}
                      </div>
                      <button 
                        onClick={() => handleDeleteHabit(habit.id)}
                        className="text-red-500 hover:text-red-700 text-sm px-2 py-1 rounded bg-red-50 dark:bg-red-950"
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
