import { login, signup } from './actions'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  
  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2 mx-auto mt-20">
      <div className="absolute top-4 right-4">
        <ThemeToggle />
      </div>
      
      <form className="animate-in flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <h1 className="text-2xl font-bold text-center mb-6">Daily Optimizer</h1>
        
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />
        
        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        
        <button
          formAction={login}
          className="bg-green-700 rounded-md px-4 py-2 text-white mb-2 hover:bg-green-600 transition-colors"
        >
          Sign In
        </button>
        <button
          formAction={signup}
          className="border border-foreground/20 rounded-md px-4 py-2 text-foreground mb-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          Sign Up
        </button>
        
        {message && (
          <p className="mt-4 p-4 bg-foreground/10 text-foreground text-center">
            {message}
          </p>
        )}
      </form>
    </div>
  )
}
