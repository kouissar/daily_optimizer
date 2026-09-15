'use client'

import Link from 'next/link'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

export function Navbar({ hasUser }: { hasUser: boolean }) {
  const [isOpen, setIsOpen] = useState(false)

  if (!hasUser) return null;

  const links = [
    { name: 'Home', href: '/' },
    { name: 'Progress', href: '/progress' },
    { name: 'Manage Habits', href: '/habits' },
    { name: 'Profile', href: '/profile' },
  ]

  return (
    <>
      {/* Desktop */}
      <div className="hidden md:flex items-center gap-6">
        {links.map(link => (
          <Link key={link.name} href={link.href} className="font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
            {link.name}
          </Link>
        ))}
      </div>

      {/* Mobile Toggle */}
      <button className="md:hidden p-2 text-slate-600 dark:text-slate-300" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="absolute top-16 left-0 w-full bg-white dark:bg-neutral-900 border-b border-slate-200 dark:border-neutral-800 flex flex-col px-6 py-6 gap-6 md:hidden shadow-lg animate-in slide-in-from-top-2">
          {links.map(link => (
            <Link 
              key={link.name} 
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="font-bold text-lg text-slate-700 dark:text-slate-200 hover:text-indigo-600 dark:hover:text-indigo-400"
            >
              {link.name}
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
