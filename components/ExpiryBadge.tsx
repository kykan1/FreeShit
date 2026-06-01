import { getFreshnessState } from "@/lib/freshness";
import type { Offer } from "@/lib/offerTypes";
import { Badge } from "./Badge";

export function ExpiryBadge({
  expiryDate,
  expiryDatetime,
  category,
  verifiedAt
}: {
  expiryDate: string | null;
  expiryDatetime: string | null;
  category: Offer["category"];
  verifiedAt: string;
}) {
  const state = getFreshnessState({
    category,
    expiry_date: expiryDate,
    expiry_datetime: expiryDatetime,
    verified_at: verifiedAt
  });
  const badges = [];

  if (state.urgent) {
    badges.push(
      <Badge key="urgent" tone="warning">
        Ends within 24h
      </Badge>
    );
  }

  if (state.expiringSoon) {
    badges.push(
      <Badge key="expiring" tone="warning">
        Expiring soon
      </Badge>
    );
  }

  if (state.stale) {
    badges.push(
      <Badge key="outdated" tone="muted">
        May be outdated
      </Badge>
    );
  }

  if (!badges.length) {
    return null;
  }

  return <div className="flex flex-wrap gap-2">{badges}</div>;
}
