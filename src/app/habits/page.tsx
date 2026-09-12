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
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <Header />
      
      <main className="flex-1 flex flex-col gap-6 w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">Manage Habits</h1>
        <p className="text-muted-foreground">Add, edit, or remove categories and habits.</p>
        
        <HabitManager categories={categories || []} habits={habits || []} />
      </main>
    </div>
  )
}
