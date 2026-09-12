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
    <div className="flex-1 w-full flex flex-col gap-8 items-center">
      <Header />
      
      <main className="flex-1 flex flex-col gap-6 w-full max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold">Your Progress</h1>
        <p className="text-muted-foreground">Track your consistency over time.</p>
        
        {(!habits || habits.length === 0) ? (
          <p>You need to add some habits first!</p>
        ) : (
          <ProgressCharts habits={habits} logs={logs || []} />
        )}
      </main>
    </div>
  )
}
