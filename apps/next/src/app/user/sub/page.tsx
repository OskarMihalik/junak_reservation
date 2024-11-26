"use client"

import React, {useState} from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQueryClientContext } from "@/utils/providers/ReactQueryProvider";

const subscriptionPeriodSchema = z.number().int().positive();

interface SubscriptionData {
  id: number;
  userId: number;
  variableSymbol: number;
  subscriptionPeriod: number;
  status: "WAITING" | "APPROVED" | "REVOKED" | "EXPIRED";
  generatedAt: string;
  approvedAt: string | null;
  approvedBy: number | null;
  expiresAt: string | null;
  revokedAt: string | null;
  revokedBy: number | null;
}


const SubscriptionPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);
  const [subscriptionData, setSubscriptionData] = useState<SubscriptionData | null>(null);

  const client = useQueryClientContext();
  const { mutate } = client.subscription.approveSubscription.useMutation({
    onSuccess: function (data) {
      if (data.status === 200) {
        console.log(data.body);
        setSubscriptionData(data.body as SubscriptionData);
      }
    },
    onError(_error) {
      console.log(_error);
    },
  });

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
    <div className="flex flex-col items-center min-h-screen bg-gray-900 text-gray-100 p-4">
      {subscriptionData ? (
        <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold text-gray-100">Subscription Details</h2>
          <p>
            <span className="font-medium text-gray-400">Variable Symbol:</span>{" "}
            {subscriptionData.variableSymbol}
          </p>
          <p>
            <span className="font-medium text-gray-400">Subscription Period:</span>{" "}
            {subscriptionData.subscriptionPeriod}{" "}
            {subscriptionData.subscriptionPeriod === 1 ? "month" : "months"}
          </p>
          <p>
            <span className="font-medium text-gray-400">Status:</span> {subscriptionData.status}
          </p>
          <p>
            <span className="font-medium text-gray-400">Generated At:</span>{" "}
            {new Date(subscriptionData.generatedAt).toLocaleString()}
          </p>
        </div>
      ) : (
        <div className="mb-6 p-4 bg-gray-800 border border-gray-700 rounded-lg shadow-lg text-center">
          <h2 className="text-lg font-semibold text-gray-100">No Subscription Found</h2>
          <p className="text-gray-400">You dont have an active subscription yet.</p>
        </div>
      )}

      <Card className="w-full max-w-md bg-gray-800 shadow-lg border border-gray-700">
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
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-gray-700 text-gray-100 hover:bg-gray-600"
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
              className="w-full bg-green-600 text-white hover:bg-green-700"
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
