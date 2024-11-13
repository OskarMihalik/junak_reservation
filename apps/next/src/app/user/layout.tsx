'use client'

import Header from '@/components/ui/header'

export default function DashboardLayout({
  children, // will be a page or nested layout
}: {
  children: React.ReactNode
}) {
  return (
    <section>
      {/* Include shared UI here e.g. a header or sidebar */}
      <Header
        items={[
          {
            title: 'Home',
            href: '/',
          },
          {
            title: 'About',
            href: '/about',
          },
        ]}
      />
      {children}
    </section>
  )
}
