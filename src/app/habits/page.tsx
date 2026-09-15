import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { HabitManager } from '@/components/habit-manager'

export default async function HabitsPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch categories and habits
  const { data: categories } = await supabase.from('categories').select('*').order('created_at')
  const { data: habits } = await supabase.from('habits').select('*').order('created_at')

  return (
    <div className="flex-1 w-full flex flex-col items-center min-h-screen bg-slate-50 dark:bg-neutral-950">
      <Header />
      
      <main className="flex-1 flex flex-col gap-8 w-full max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Manage Habits</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Add, organize, or remove categories and habits.</p>
        </div>
        
        <HabitManager categories={categories || []} habits={habits || []} />
      </main>
    </div>
  )
}
