/**
 * Generates a unique variable symbol for online payments as a positive integer.
 * @param aisID - The AIS ID (5, 6, or 7 digits)
 * @param subscriptionPeriod - Subscription period (1, 3 or 6)
 * @returns A positive integer representing the variable symbol.
 */
export const generateVariableSymbol = (aisID: number, subscriptionPeriod: number): number => {
  const subscriptionPeriodString = subscriptionPeriod.toString()
  const aisIDString = aisID.toString()
  const timestampPartString = (new Date().getFullYear() % 100).toString();

  const variableSymbol = subscriptionPeriodString + timestampPartString + aisIDString;

  return Math.abs(Number(variableSymbol));
};
