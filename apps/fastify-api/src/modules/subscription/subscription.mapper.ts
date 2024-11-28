import { Subscription } from "./subscription.entity.js";
import { mapUserToDto } from '../user/user.mapper.js'

export function mapSubscriptionToDto(subscription: Subscription) {
  return {
    id: subscription.id,
    user: mapUserToDto(subscription.user),
    variableSymbol: subscription.variableSymbol,
    subscriptionPeriod: subscription.subscriptionPeriod,
    status: subscription.status,
    generatedAt: subscription.generatedAt.toISOString(),
    approvedAt: subscription.approvedAt?.toISOString() ?? null,
    approvedBy: subscription.approvedBy ? mapUserToDto(subscription.approvedBy) : null,
    expiresAt: subscription.expiresAt?.toISOString() ?? null,
    revokedAt: subscription.revokedAt?.toISOString() ?? null,
    revokedBy: subscription.revokedBy ? mapUserToDto(subscription.revokedBy) : null,
  }
}
