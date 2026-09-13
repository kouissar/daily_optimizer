import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { Header } from '@/components/header'
import { ProfileForm } from '@/components/profile-form'

export default async function ProfilePage() {
  const supabase = await createClient()

  const { data: { user }, error } = await supabase.auth.getUser()
  if (error || !user) {
    redirect('/login')
  }

  return (
    <div className="flex-1 w-full flex flex-col items-center min-h-screen bg-slate-50 dark:bg-neutral-950">
      <Header />
      
      <main className="flex-1 flex flex-col gap-8 w-full max-w-2xl px-4 py-10">
        <div className="flex flex-col gap-1 mb-4">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-slate-50">Profile Settings</h1>
          <p className="text-lg text-slate-500 dark:text-slate-400">Update your personal details and password.</p>
        </div>

        <ProfileForm 
          initialFirstName={user.user_metadata?.first_name || ''} 
          initialLastName={user.user_metadata?.last_name || ''} 
          email={user.email || ''}
        />
      </main>
    </div>
  )
}
