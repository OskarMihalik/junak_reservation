'use client'

import Header from '@/components/ui/header'

export default function DashboardLayout({
                                          children,
                                        }: {
  children: React.ReactNode
}) {
  return (
      <section className="flex-grow flex items-center justify-center w-full mt-2">
        {children}
      </section>
  )
}
