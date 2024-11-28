'use client'
import React from 'react'
import { useQueryClientContext } from '@/utils/providers/ReactQueryProvider'

const SubscriptionsPage: React.FC = () => {
  const client = useQueryClientContext()
  const { data } = client.adminSubscription.getSubscriptionsAsync.useQuery(['getSubscriptionsAsync'])

  return (
    <div className="container mx-auto p-4 text-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-white">Subscriptions</h1>
      {data && data.body?.length ? (
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
          {data.body.map((subscription, index) => (
            <tr key={subscription.id || index} className="even:bg-gray-850 hover:bg-gray-700">
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
                <button className="mr-2 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700">
                  Approve
                </button>
                <button className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700">
                  Revoke
                </button>
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      ) : (
        <div className="text-gray-400">No subscriptions found</div>
      )}
    </div>
  )
}

export default SubscriptionsPage
