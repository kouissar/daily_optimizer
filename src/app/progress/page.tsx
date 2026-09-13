import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { ProgressCharts } from '@/components/progress-charts'

export default async function ProgressPage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  // Fetch all habits to know the denominator
  const { data: habits } = await supabase.from('habits').select('*')
  
  // Fetch all logs to know what was completed
  const { data: logs } = await supabase.from('daily_logs').select('*').order('date', { ascending: true })

  return (
    <div className="flex-1 w-full flex flex-col items-center min-h-screen bg-slate-50 dark:bg-neutral-950">
      <Header />
      
      <main className="flex-1 flex flex-col gap-8 w-full max-w-5xl px-4 py-10">
        <div className="flex flex-col gap-1 mb-2">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Your Progress</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Track your consistency and metrics over time.</p>
        </div>
        
        {(!habits || habits.length === 0) ? (
          <div className="border rounded-lg p-8 text-center flex flex-col items-center gap-4 bg-white dark:bg-neutral-900">
            <h2 className="text-xl font-semibold">No Data Yet</h2>
            <p className="text-muted-foreground">You need to add some habits first!</p>
          </div>
        ) : (
          <ProgressCharts habits={habits} logs={logs || []} />
        )}
      </main>
    </div>
  )
}
