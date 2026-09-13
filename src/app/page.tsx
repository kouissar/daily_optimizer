import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { Checklist } from '@/components/checklist'
import { seedDefaultHabits } from '@/app/actions/habits'
import { DatePicker } from '@/components/date-picker'

export default async function DashboardPage({
  searchParams,
}: {
  searchParams: Promise<{ date?: string }>
}) {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch categories and habits
  const { data: categories } = await supabase.from('categories').select('*').order('created_at')
  const { data: habits } = await supabase.from('habits').select('*').order('created_at')
  
  // Get date from URL or default to today's date
  const params = await searchParams;
  
  // A small trick: to get the local date string in YYYY-MM-DD instead of strict UTC, 
  // we can use a basic timezone offset, but for server components UTC is safest.
  // We'll let the user change it easily via the DatePicker.
  const today = params.date || new Date().toISOString().split('T')[0]
  
  const { data: logs } = await supabase
    .from('daily_logs')
    .select('*')
    .eq('date', today)

  const hasHabits = habits && habits.length > 0;
  
  const firstName = user.user_metadata?.first_name;
  const greeting = firstName ? `Hey ${firstName}, ` : '';

  return (
    <div className="flex-1 w-full flex flex-col items-center min-h-screen bg-slate-50 dark:bg-neutral-950">
      <Header />
      
      <main className="flex-1 flex flex-col gap-6 w-full max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">{greeting}Your Daily Routine</h1>
          <div className="text-lg text-slate-500 dark:text-slate-400 flex items-center flex-wrap">
            Check off your habits for: <DatePicker currentDate={today} />
          </div>
        </div>
        
        {!hasHabits ? (
          <div className="border rounded-lg p-8 text-center flex flex-col items-center gap-4">
            <h2 className="text-xl font-semibold">Welcome to Daily Optimizer!</h2>
            <p className="text-muted-foreground">You don't have any routines set up yet.</p>
            <form action={async () => {
              'use server';
              await seedDefaultHabits();
            }}>
              <button className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm">
                Load Default Habits
              </button>
            </form>
          </div>
        ) : (
          <Checklist key={today} categories={categories || []} habits={habits || []} logs={logs || []} date={today} />
        )}
      </main>
    </div>
  )
}
