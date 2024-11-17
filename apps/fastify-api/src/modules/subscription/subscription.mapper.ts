import { Subscription } from "./subscription.entity";

export function mapSubscriptionToDto(subscription: Subscription) {
  return {
    id: subscription.id,
    userId: subscription.user.id,
    variableSymbol: subscription.variableSymbol,
    subscriptionPeriod: subscription.subscriptionPeriod,
    status: subscription.status,
    generatedAt: subscription.generatedAt.toISOString(),
    approvedAt: subscription.approvedAt?.toISOString() ?? null,
    approvedBy: subscription.approvedBy ?? null,
    expiresAt: subscription.expiresAt?.toISOString() ?? null,
    revokedAt: subscription.revokedAt?.toISOString() ?? null,
    revokedBy: subscription.revokedBy ?? null,
  }
}
