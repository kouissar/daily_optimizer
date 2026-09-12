import Link from 'next/link'
import { ThemeToggle } from './theme-toggle'
import { signout } from '@/app/login/actions'
import { createClient } from '@/utils/supabase/server'
import { Activity } from 'lucide-react'

export async function Header() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <header className="w-full bg-white dark:bg-neutral-900 shadow-sm sticky top-0 z-50">
      <div className="w-full max-w-5xl mx-auto flex justify-between items-center px-4 md:px-6 h-16 text-sm">
        <div className="flex gap-2 items-center font-bold text-lg text-indigo-600 dark:text-indigo-400">
          <Activity className="w-5 h-5" />
          <Link href="/">Optimizer</Link>
        </div>
        <div className="flex items-center gap-6">
          {user ? (
            <div className="flex items-center gap-6">
              <Link href="/progress" className="font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">
                Progress
              </Link>
              <Link href="/habits" className="font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors hidden sm:block">
                Manage Habits
              </Link>
              <form action={signout}>
                <button className="py-2 px-4 rounded-full font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950 transition-colors">
                  Logout
                </button>
              </form>
            </div>
          ) : (
            <Link
              href="/login"
              className="py-2 px-6 rounded-full font-medium bg-indigo-600 text-white hover:bg-indigo-700 transition-colors shadow-sm"
            >
              Login
            </Link>
          )}
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
