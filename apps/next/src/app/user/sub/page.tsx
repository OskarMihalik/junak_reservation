"use client"

import React, { useState } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const subscriptionPeriodSchema = z.number().positive();

const SubscriptionPage: React.FC = () => {
  const [selectedPeriod, setSelectedPeriod] = useState<number | null>(null);
  const [validationMessage, setValidationMessage] = useState<string | null>(null);

  const handlePayClick = () => {
    try {
      const validatedPeriod = subscriptionPeriodSchema.parse(selectedPeriod);
      setValidationMessage(null);
      console.log(`Validated subscription period: ${validatedPeriod} month(s)`);

    } catch (err) {
      if (err instanceof z.ZodError) {
        setValidationMessage("Please select a subscription period.");
      }
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-900 text-gray-100 p-4">
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
