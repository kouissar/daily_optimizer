'use client'

import { useRouter } from 'next/navigation'

export function DatePicker({ currentDate }: { currentDate: string }) {
  const router = useRouter()

  return (
    <input
      type="date"
      value={currentDate}
      onChange={(e) => {
        if (e.target.value) {
          router.push(`/?date=${e.target.value}`)
        }
      }}
      className="inline-block ml-1 text-indigo-600 dark:text-indigo-400 bg-transparent font-bold cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
    />
  )
}
