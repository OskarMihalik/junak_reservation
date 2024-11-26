'use client'

import Header from '@/components/ui/header'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className='flex flex-col items-center justify-center w-full p-10'>
      <section className='w-full'>
        <Header
          items={[
            {
              title: 'Home',
              href: '/',
            },
            {
              title: 'Schedule',
              href: '/admin/createSchedule',
            },
          ]}
        />
      </section>
      <section className='flex-grow flex items-center justify-center w-full'>{children}</section>
    </div>
  )
}
