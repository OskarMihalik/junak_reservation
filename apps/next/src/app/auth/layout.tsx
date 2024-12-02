'use client'

import Header from '@/components/ui/header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center h-screen w-full'>
      <section className='w-full'>
        <Header
          items={[
            {
              title: 'Home',
              href: '/',
            },
          ]}
          logout={false}
        />
      </section>
      <section className='flex-grow flex items-center justify-center w-full'>{children}</section>
    </div>
  )
}
