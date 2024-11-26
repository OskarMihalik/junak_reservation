"use client"

import React, {useState} from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClientContext } from "@/utils/providers/ReactQueryProvider";
import {useToast} from "@/hooks/use-toast";

const subscriptionPeriodSchema = z.number().int().positive();

const SubscriptionPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const { toast } = useToast()

  const client = useQueryClientContext();

  const { mutate } = client.subscription.approveSubscription.useMutation({
    onSuccess: function (data) {
      if (data.status === 200) {
        toast({ description: 'Subscription added successfully' })
        console.log(data.body);
        refetch()
      }
    },
    onError() {
      toast({ description: 'Subscription creation failed' })
    },
  });

  const { data, refetch } = client.subscription.getUserSubscription.useQuery(['getUserSubscription']);

  const handlePayClick = () => {
    try {
      const validatedPeriod = subscriptionPeriodSchema.parse(selectedPeriod);
      setValidationMessage(null);
      console.log(`Validated subscription period: ${validatedPeriod} month(s)`);
      mutate({ body: { subscriptionPeriod: validatedPeriod } });
    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationMessage("Please select a subscription period.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen text-gray-200 p-4">
      {data ? (
        data.body.map((subscription, index) => (
          <div key={index} className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg shadow-lg">
            <h2 className="text-lg font-semibold text-gray-100">Subscription Details</h2>
            <p>
              <span className="font-medium text-gray-400">Variable Symbol:</span> {subscription.variableSymbol}
            </p>
            <p>
              <span
                className="font-medium text-gray-400">Subscription Period:</span> {subscription.subscriptionPeriod}{" "}
              {subscription.subscriptionPeriod === 1 ? "month" : "months"}
            </p>
            <p>
              <span className="font-medium text-gray-400">Status: </span>
              <span
                className={`${
                  subscription.status === 'APPROVED' ? 'text-green-400' :
                    subscription.status === 'WAITING' ? 'text-yellow-400' :
                      subscription.status === 'REVOKED' ? 'text-red-400' : 'text-gray-500'
                }`}
              >
            {subscription.status}
          </span>
            </p>
            <p>
              <span className="font-medium text-gray-400">Generated At:</span>{" "}
              {new Date(subscription.generatedAt).toLocaleString()}
            </p>
          </div>
        ))
      ) : (
        <div className="mb-6 p-4 bg-gray-900 border border-gray-800 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-100">No Subscription Found</h2>
          <p className="text-gray-400">You don't have any active subscriptions yet.</p>
        </div>
      )}

      <Card className="w-full max-w-md bg-gray-900 shadow-lg border border-gray-800">
        <CardHeader>
          <CardTitle className="text-xl text-center text-gray-100">
            Select Subscription Period
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex justify-center space-x-4 my-4">
            {[1, 3, 6].map((period) => (
              <Button
                key={period}
                variant={selectedPeriod === period ? "default" : "outline"}
                className={`w-24 ${
                  selectedPeriod === period
                    ? "bg-blue-700 text-white hover:bg-blue-800"
                    : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                }`}
                onClick={() => setSelectedPeriod(period)}
              >
                {period} {period === 1 ? "Month" : "Months"}
              </Button>
            ))}
          </div>

          <div className="text-center my-4">
            {validationMessage ? (
              <p className="text-red-500 text-lg">{validationMessage}</p>
            ) : (
              <p className="text-lg font-medium">
                {selectedPeriod
                  ? `You selected: ${selectedPeriod} ${selectedPeriod === 1 ? "month" : "months"}`
                  : "Please select a subscription period"}
              </p>
            )}
          </div>

          <div className="text-center">
            <Button
              className="w-full bg-green-700 text-white hover:bg-green-800"
              onClick={handlePayClick}
            >
              Pay
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SubscriptionPage;
