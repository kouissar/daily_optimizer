import { login, signup } from './actions'
import { ThemeToggle } from '@/components/theme-toggle'

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ message: string }>
}) {
  const { message } = await searchParams;
  
  return (
    <div className="w-full min-h-screen flex bg-white dark:bg-neutral-950">
      {/* Left Pane - Visual */}
      <div className="hidden lg:flex lg:w-1/2 relative bg-neutral-900 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src="/login-bg.jpg" 
            alt="Productivity background" 
            className="w-full h-full object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        <div className="relative z-10 flex flex-col justify-end p-16 text-white h-full pb-24">
          <div className="mb-auto mt-4">
            <h2 className="text-2xl font-bold tracking-widest text-white/90">OPTIMIZER</h2>
          </div>
          <h1 className="text-5xl font-black mb-6 tracking-tight leading-tight">Master Your Day.<br/>Optimize Your Life.</h1>
          <p className="text-xl text-neutral-200 font-medium max-w-lg leading-relaxed">
            Join thousands of users building better habits, tracking their progress seamlessly, and achieving their goals.
          </p>
        </div>
      </div>

      {/* Right Pane - Form */}
      <div className="flex-1 flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 relative">
        <div className="absolute top-6 right-6">
          <ThemeToggle />
        </div>
        
        <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-slate-50 tracking-tight">Welcome Back</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Enter your details to access your dashboard.</p>
          </div>
          
          <form className="flex flex-col gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="email">
                Email Address
              </label>
              <input
                className="rounded-xl px-4 py-3.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
                name="email"
                placeholder="you@example.com"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700 dark:text-slate-300" htmlFor="password">
                Password
              </label>
              <input
                className="rounded-xl px-4 py-3.5 bg-slate-50 dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all text-slate-900 dark:text-slate-50 placeholder:text-slate-400"
                type="password"
                name="password"
                placeholder="••••••••"
                required
              />
            </div>
            
            <div className="flex flex-col gap-3 mt-4">
              <button
                formAction={login}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl px-4 py-3.5 shadow-md shadow-indigo-600/20 transition-all active:scale-[0.98]"
              >
                Sign In
              </button>
              <button
                formAction={signup}
                className="w-full bg-white dark:bg-neutral-950 border-2 border-slate-200 dark:border-neutral-800 text-slate-700 dark:text-slate-300 font-bold rounded-xl px-4 py-3.5 hover:bg-slate-50 dark:hover:bg-neutral-900 transition-all active:scale-[0.98]"
              >
                Create Account
              </button>
            </div>
            
            {message && (
              <div className="mt-4 p-4 rounded-xl bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30 text-red-600 dark:text-red-400 text-sm text-center font-bold animate-in zoom-in duration-300">
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  )
}
