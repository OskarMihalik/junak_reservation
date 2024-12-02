/**
 * v0 by Vercel.
 * @see https://v0.dev/t/FBccZ0IWtW0
 * Documentation: https://v0.dev/docs#integrating-generated-code-into-your-nextjs-app
 */
'use client'
import Link from 'next/link'
import { Button } from './button'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'

export type HeaderProps = {
  items: {
    title: string
    href: string
  }[]
  logout: boolean
}

export default function Header(props: HeaderProps) {
  const client = useQueryClientContext()
  const { toast } = useToast()
  const router = useRouter()

  const { mutate } = client.user.logoutUser.useMutation({
    onSuccess(data, variables, context) {
      if (data.status === 200) {
        toast({ description: 'User logged out successfully' })
        router.push('/auth/login')
      }
    },
  })

  return (
    <div className='container mx-auto px-4 md:px-6 lg:px-8'>
      <header className='flex h-20 w-full shrink-0 items-center px-4 md:px-6'>
        <div className='ml-auto flex gap-2'>
          {props.items.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className='group inline-flex h-9 w-max items-center justify-center rounded-md bg-white px-4 py-2 text-sm font-medium transition-colors hover:bg-gray-100 hover:text-gray-900 focus:bg-gray-100 focus:text-gray-900 focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-gray-100/50 data-[state=open]:bg-gray-100/50 dark:bg-gray-950 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:focus:bg-gray-800 dark:focus:text-gray-50 dark:data-[active]:bg-gray-800/50 dark:data-[state=open]:bg-gray-800/50'
              prefetch={false}
            >
              {item.title}
            </Link>
          ))}
          {props.logout && (
            <Button variant='outline' className='justify-self-end px-2 py-1 text-xs' onClick={() => mutate({})}>
              Log out
            </Button>
          )}
        </div>
      </header>
    </div>
  )
}
