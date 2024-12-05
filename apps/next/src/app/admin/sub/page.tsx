'use client'

import React, { useMemo, useState } from 'react'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'
import { Input } from '@/components/ui/input'
import { useToast } from '@/hooks/use-toast'
import { SubscriptionStatusEnum } from '@workspace/data'

const SubscriptionsPage: React.FC = () => {
  const client = useQueryClientContext()
  const { data, refetch } = client.adminSubscription.getSubscriptionsAsync.useQuery(['getSubscriptionsAsync'])

  const [searchTerm, setSearchTerm] = useState('')

  const { toast } = useToast()

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value)
  }

  const { mutate: approveSubscription } = client.adminSubscription.approveSubscriptionAsync.useMutation({
    onSuccess: () => {
      toast({ description: 'Subscription approved' })
      refetch()
    },
    onError: () => {
      toast({ description: 'Subscription failed to approve' })
    },
  })

  const { mutate: revokeSubscription } = client.adminSubscription.revokeSubscriptionAsync.useMutation({
    onSuccess: () => {
      toast({ description: 'Subscription revoked' })
      refetch()
    },
    onError: () => {
      toast({ description: 'Subscription failed to revoke' })
    },
  })

  const handleApprove = (id: number) => {
    console.log(`Approve ID: ${id}`)
    approveSubscription({ params: { id: id.toString() } })
  }

  const handleRevoke = (id: number) => {
    console.log(`Revoke ID: ${id}`)
    revokeSubscription({ params: { id: id.toString() } })
  }

  const APPROVED = SubscriptionStatusEnum.options[1]
  const REVOKED = SubscriptionStatusEnum.options[2]

  const filteredSubscriptions = useMemo(() => {
    return (data?.body || []).filter((subscription) => {
      const nameMatch =
        subscription.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        subscription.user?.surname.toLowerCase().includes(searchTerm.toLowerCase())
      const aisIdMatch = subscription.user?.aisId
        ?.toString()
        .includes(searchTerm.toLowerCase())
      return nameMatch || aisIdMatch
    })
  }, [data?.body, searchTerm])

  return (
    <div className="container mx-auto p-4 text-gray-100 min-h-screen">
      <div className="flex flex-col sm:flex-row items-center justify-between mb-6">
        <h1 className="text-3xl font-bold text-white">Subscriptions</h1>
        <Input
          placeholder="Search by name or ais id"
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-1/3"
        />
      </div>

      <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-700 rounded-lg shadow-sm bg-gray-800">
        <thead className="bg-gray-700">
        <tr>
          <th className="border border-gray-700 px-4 py-3 text-left text-gray-300">Full Name</th>
          <th className="border border-gray-700 px-4 py-3 text-left text-gray-300">AIS ID</th>
          <th className="border border-gray-700 px-4 py-3 text-left text-gray-300">Variable Symbol</th>
          <th className="border border-gray-700 px-4 py-3 text-left text-gray-300">Period</th>
          <th className="border border-gray-700 px-4 py-3 text-left text-gray-300">Status</th>
          <th className="border border-gray-700 px-4 py-3 text-center text-gray-300">Actions</th>
        </tr>
        </thead>

        <tbody>
        {filteredSubscriptions && filteredSubscriptions.length > 0 ? (
          filteredSubscriptions
            .sort((a, b) => a.id - b.id) //ascending
            .map((subscription) => (
              <tr key={subscription.id} className="even:bg-gray-850 hover:bg-gray-600">
                <td className="border border-gray-700 px-4 py-3">
                  {subscription.user ? `${subscription.user.name} ${subscription.user.surname}` : 'N/A'}
                </td>
                <td className="border border-gray-700 px-4 py-3">
                  {subscription.user?.aisId ?? 'N/A'}
                </td>
                <td className="border border-gray-700 px-4 py-3">{subscription.variableSymbol}</td>
                <td className="border border-gray-700 px-4 py-3">{subscription.subscriptionPeriod}</td>
                <td className="border border-gray-700 px-4 py-3 capitalize">{subscription.status}</td>
                <td className="border border-gray-700 px-4 py-3 text-center">
                  <button
                    onClick={() => handleApprove(subscription.id)}
                    className={`mr-2 px-3 py-1 rounded ${
                      subscription.status === APPROVED
                        ? 'bg-green-500 cursor-not-allowed opacity-50'
                        : 'bg-green-600 text-white hover:bg-green-700'
                    }`}
                    disabled={subscription.status === APPROVED}
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleRevoke(subscription.id)}
                    className={`px-3 py-1 rounded ${
                      subscription.status === REVOKED
                        ? 'bg-red-500 cursor-not-allowed opacity-50'
                        : 'bg-red-600 text-white hover:bg-red-700'
                    }`}
                    disabled={subscription.status === REVOKED}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))
        ) : (
          <tr>
            <td colSpan={6} className="text-center text-gray-400 py-6">
              No subscriptions found
            </td>
          </tr>
        )}
        </tbody>
      </table>
      </div>
    </div>

  )
}

export default SubscriptionsPage
