import { Subscription } from "./subscription.entity";

export function mapSubscriptionToDto(subscription: Subscription) {
  return {
    id: subscription.id,
    userId: subscription.user.id,
    variableSymbol: subscription.variableSymbol,
    subscriptionPeriod: subscription.subscriptionPeriod,
    status: subscription.status,
    generatedAt: subscription.generatedAt.toDateString(),
    approvedAt: subscription.approvedAt?.toDateString() ?? "N/A",
    approvedBy: subscription.approvedBy ?? null,
    expiresAt: subscription.expiresAt?.toDateString() ?? "N/A",
    revokedAt: subscription.revokedAt?.toDateString() ?? "N/A",
    revokedBy: subscription.revokedBy ?? null,
  }
}
