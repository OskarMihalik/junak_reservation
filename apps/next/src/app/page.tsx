'use client'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { initQueryClient } from '@ts-rest/react-query'
import { apiContract, apiHelloContract } from '@workspace/contracts'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
export default function Home() {
  return (
    <div className='grid min-h-screen grid-rows-[20px_1fr_20px] items-center justify-items-center gap-16 p-8 pb-20 font-[family-name:var(--font-geist-sans)] sm:p-20'>
      <main className='row-start-2 flex flex-col items-center justify-center gap-8 sm:items-start'>
        <Image
          className='dark:invert ml-auto mr-auto'
          src='/muscle.svg'
          alt='Junak logo'
          width={180}
          height={38}
          priority
        />
        This is your place to reserve your place in best gym in BA
        <div className='flex flex-col items-center gap-4 sm:flex-row justify-center'>
          <Link
            className='mb-4 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-1xl lg:text-3xl dark:text-white'
            href='/auth/login'
          >
            Login
          </Link>
          <Link
            className='mb-4 text-1xl font-extrabold leading-none tracking-tight text-gray-900 md:text-1xl lg:text-3xl dark:text-white'
            href='/auth/register'
          >
            Register
          </Link>
        </div>
      </main>
      <footer className='row-start-3 flex flex-wrap items-center justify-center gap-6'>
        <p></p>
      </footer>
    </div>
  )
}
