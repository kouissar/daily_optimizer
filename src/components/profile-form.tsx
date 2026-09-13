'use client'

import { useState } from 'react'
import { updateProfile, updatePassword } from '@/app/actions/profile'

export function ProfileForm({ initialFirstName, initialLastName, email }: { initialFirstName: string, initialLastName: string, email: string }) {
  const [isSubmittingProfile, setIsSubmittingProfile] = useState(false)
  const [profileMsg, setProfileMsg] = useState({ type: '', text: '' })

  const [isSubmittingPassword, setIsSubmittingPassword] = useState(false)
  const [passwordMsg, setPasswordMsg] = useState({ type: '', text: '' })

  async function handleProfileUpdate(formData: FormData) {
    setIsSubmittingProfile(true)
    setProfileMsg({ type: '', text: '' })
    
    const res = await updateProfile(formData)
    if (res.error) {
      setProfileMsg({ type: 'error', text: res.error })
    } else {
      setProfileMsg({ type: 'success', text: 'Profile updated successfully!' })
    }
    setIsSubmittingProfile(false)
  }

  async function handlePasswordUpdate(formData: FormData) {
    setIsSubmittingPassword(true)
    setPasswordMsg({ type: '', text: '' })
    
    const res = await updatePassword(formData)
    if (res.error) {
      setPasswordMsg({ type: 'error', text: res.error })
    } else {
      setPasswordMsg({ type: 'success', text: 'Password updated successfully!' })
      // Clear password fields
      const form = document.getElementById('password-form') as HTMLFormElement
      if (form) form.reset()
    }
    setIsSubmittingPassword(false)
  }

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* Profile Section */}
      <section className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Personal Details</h2>
        <form action={handleProfileUpdate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-600 dark:text-slate-400">Email Address</label>
            <input 
              type="email" 
              value={email} 
              disabled 
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-slate-100 dark:bg-neutral-800/50 text-slate-500 cursor-not-allowed"
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">First Name</label>
              <input 
                name="firstName"
                defaultValue={initialFirstName}
                placeholder="John"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Last Name</label>
              <input 
                name="lastName"
                defaultValue={initialLastName}
                placeholder="Doe"
                className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
              />
            </div>
          </div>

          {profileMsg.text && (
            <p className={`text-sm mt-2 ${profileMsg.type === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {profileMsg.text}
            </p>
          )}

          <div className="mt-2 flex justify-end">
            <button 
              disabled={isSubmittingProfile}
              type="submit" 
              className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmittingProfile ? 'Saving...' : 'Save Details'}
            </button>
          </div>
        </form>
      </section>

      {/* Password Section */}
      <section className="bg-white dark:bg-neutral-900 border border-slate-200 dark:border-neutral-800 rounded-2xl p-6 shadow-sm">
        <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-6">Update Password</h2>
        <form id="password-form" action={handlePasswordUpdate} className="flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">New Password</label>
            <input 
              type="password" 
              name="password"
              placeholder="••••••••"
              required
              minLength={6}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>
          
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-slate-700 dark:text-slate-300">Confirm New Password</label>
            <input 
              type="password" 
              name="confirmPassword"
              placeholder="••••••••"
              required
              minLength={6}
              className="px-4 py-2 rounded-lg border border-slate-200 dark:border-neutral-700 bg-transparent focus:ring-2 focus:ring-indigo-600 outline-none"
            />
          </div>

          {passwordMsg.text && (
            <p className={`text-sm mt-2 ${passwordMsg.type === 'error' ? 'text-red-500' : 'text-green-600 dark:text-green-400'}`}>
              {passwordMsg.text}
            </p>
          )}

          <div className="mt-2 flex justify-end">
            <button 
              disabled={isSubmittingPassword}
              type="submit" 
              className="bg-indigo-600 text-white font-medium px-6 py-2.5 rounded-full hover:bg-indigo-700 transition-colors shadow-sm disabled:opacity-70"
            >
              {isSubmittingPassword ? 'Updating...' : 'Update Password'}
            </button>
          </div>
        </form>
      </section>
    </div>
  )
}
