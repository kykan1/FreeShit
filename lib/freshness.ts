import type { Offer, OfferCategory } from "./offerTypes";

const DAY_MS = 24 * 60 * 60 * 1000;

type FreshnessOffer = Pick<Offer, "category" | "expiry_date" | "expiry_datetime" | "verified_at">;

export const STALE_AFTER_DAYS: Record<OfferCategory, number> = {
  food: 30,
  events: 7,
  swag: 30,
  research: 60,
  devtools: 180,
  software: 180
};

export type FreshnessState = {
  expired: boolean;
  urgent: boolean;
  expiringSoon: boolean;
  stale: boolean;
  daysUntilExpiry: number | null;
  daysSinceVerified: number;
};

function getTime(value: string | null): number | null {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

export function getFreshnessState(offer: FreshnessOffer, now = new Date()): FreshnessState {
  const nowTime = now.getTime();
  const expiryTime = getTime(offer.expiry_datetime ?? offer.expiry_date);
  const verifiedTime = getTime(offer.verified_at);
  const daysSinceVerified = verifiedTime === null ? Number.POSITIVE_INFINITY : (nowTime - verifiedTime) / DAY_MS;

  if (expiryTime !== null) {
    const daysUntilExpiry = (expiryTime - nowTime) / DAY_MS;

    return {
      expired: daysUntilExpiry < 0,
      urgent: daysUntilExpiry >= 0 && daysUntilExpiry <= 1,
      expiringSoon: daysUntilExpiry > 1 && daysUntilExpiry <= 7,
      stale: false,
      daysUntilExpiry,
      daysSinceVerified
    };
  }

  return {
    expired: false,
    urgent: false,
    expiringSoon: false,
    stale: daysSinceVerified > STALE_AFTER_DAYS[offer.category],
    daysUntilExpiry: null,
    daysSinceVerified
  };
}

export function isOfferExpired(offer: Offer, now = new Date()): boolean {
  return getFreshnessState(offer, now).expired;
}
