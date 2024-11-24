"use client"

import React, { useState, useEffect } from "react";
import { z } from "zod";
import {zResponseSubscriptionDto} from "@workspace/data";

const generateMockSubscriptions = (): z.infer<typeof zResponseSubscriptionDto>[] => {
  return [
    {
      id: 1,
      userId: 101,
      variableSymbol: 123456,
      subscriptionPeriod: 12,
      status: "WAITING",
      generatedAt: new Date().toISOString(),
      approvedAt: null,
      approvedBy: null,
      expiresAt: new Date(new Date().setFullYear(new Date().getFullYear() + 1)).toISOString(),
      revokedAt: null,
      revokedBy: null,
    },
    {
      id: 2,
      userId: 102,
      variableSymbol: 654321,
      subscriptionPeriod: 6,
      status: "APPROVED",
      generatedAt: new Date("2024-06-15T14:45:00Z").toISOString(),
      approvedAt: new Date("2024-06-16T09:00:00Z").toISOString(),
      approvedBy: 201,
      expiresAt: new Date("2024-12-15T14:45:00Z").toISOString(),
      revokedAt: null,
      revokedBy: null,
    },
    {
      id: 3,
      userId: 103,
      variableSymbol: 789012,
      subscriptionPeriod: 3,
      status: "REVOKED",
      generatedAt: new Date("2024-09-10T10:20:00Z").toISOString(),
      approvedAt: new Date("2024-09-11T12:00:00Z").toISOString(),
      approvedBy: 202,
      expiresAt: null,
      revokedAt: new Date("2024-10-10T10:20:00Z").toISOString(),
      revokedBy: 303,
    },
    {
      id: 4,
      userId: 104,
      variableSymbol: 456789,
      subscriptionPeriod: 24,
      status: "WAITING",
      generatedAt: new Date("2024-10-01T07:00:00Z").toISOString(),
      approvedAt: null,
      approvedBy: null,
      expiresAt: new Date("2026-10-01T07:00:00Z").toISOString(),
      revokedAt: null,
      revokedBy: null,
    },
    {
      id: 5,
      userId: 105,
      variableSymbol: 123789,
      subscriptionPeriod: 1,
      status: "EXPIRED",
      generatedAt: new Date("2024-10-20T11:00:00Z").toISOString(),
      approvedAt: new Date("2024-10-21T15:00:00Z").toISOString(),
      approvedBy: 204,
      expiresAt: new Date("2024-11-20T11:00:00Z").toISOString(),
      revokedAt: null,
      revokedBy: null,
    },
  ];
};

const SubscriptionsPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<z.infer<typeof zResponseSubscriptionDto>[]>([]);

  useEffect(() => {
    setSubscriptions(generateMockSubscriptions());
  }, []);

  const handleApprove = (id: number) => {
    console.log(`Approve subscription with ID: ${id}`);
  };

  const handleRevoke = (id: number) => {
    console.log(`Revoke subscription with ID: ${id}`);
  };

  return (
    <div className="p-6 bg-gray-900 text-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4">Subscriptions</h1>
      <div className="overflow-auto max-h-[500px] border border-gray-700 rounded-md">
        <table className="table-auto w-full bg-gray-800 text-gray-100">
          <thead className="bg-gray-700 text-gray-300">
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">User ID</th>
            <th className="px-4 py-2">Symbol</th>
            <th className="px-4 py-2">Period</th>
            <th className="px-4 py-2">Status</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
          </thead>
          <tbody>
          {subscriptions.map((sub) => (
            <tr
              key={sub.id}
              className="border-t border-gray-700 hover:bg-gray-700 text-center"
            >
              <td className="px-4 py-2">{sub.id}</td>
              <td className="px-4 py-2">{sub.userId}</td>
              <td className="px-4 py-2">{sub.variableSymbol}</td>
              <td className="px-4 py-2">{sub.subscriptionPeriod} months</td>
              <td className="px-4 py-2">{sub.status}</td>
              <td className="px-4 py-2">
                {sub.status !== "APPROVED" && sub.status !== "EXPIRED" && (
                  <button
                    className="bg-green-500 text-white px-4 py-2 rounded-md mr-2 hover:bg-green-600"
                    onClick={() => handleApprove(sub.id)}
                  >
                    Approve
                  </button>
                )}
                {sub.status !== "REVOKED" && (
                  <button
                    className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600"
                    onClick={() => handleRevoke(sub.id)}
                  >
                    Revoke
                  </button>
                )}
              </td>
            </tr>
          ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionsPage;
