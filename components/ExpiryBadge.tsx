import { Badge } from "./Badge";

const DAY_MS = 24 * 60 * 60 * 1000;

export function ExpiryBadge({
  expiryDate,
  verifiedAt
}: {
  expiryDate: string | null;
  verifiedAt: string;
}) {
  const now = new Date();
  const badges = [];

  if (expiryDate) {
    const expires = new Date(expiryDate);
    const daysUntilExpiry = (expires.getTime() - now.getTime()) / DAY_MS;

    if (daysUntilExpiry >= 0 && daysUntilExpiry <= 7) {
      badges.push(
        <Badge key="expiring" tone="warning">
          Expiring soon
        </Badge>
      );
    }
  }

  const verified = new Date(verifiedAt);
  const daysSinceVerified = (now.getTime() - verified.getTime()) / DAY_MS;

  if (daysSinceVerified > 60) {
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
