'use client'

import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { initQueryClient, TsRestReactQueryClient } from '@ts-rest/react-query'
import { apiContract, apiHelloContract } from '@workspace/contracts'
import { useState } from 'react'

import React, { createContext, useContext } from 'react'

const baseSettings = {
  baseUrl: '/api',
  baseHeaders: {},
  credentials: 'include' as RequestCredentials,
}

const QueryClientContext = createContext<TsRestReactQueryClient<typeof apiContract, typeof baseSettings> | null>(null)

const ReactQueryProvider = ({ children }: { children: React.ReactNode }) => {
  const [queryClient] = useState(() => new QueryClient())
  const client = initQueryClient(apiContract, baseSettings)

  return (
    <QueryClientContext.Provider value={client}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </QueryClientContext.Provider>
  )
}

export const useQueryClientContext = () => {
  const context = useContext(QueryClientContext)
  if (!context) {
    throw new Error('useQueryClientContext must be used within a ReactQueryProvider')
  }
  return context
}

export default ReactQueryProvider
