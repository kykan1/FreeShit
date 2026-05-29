import type { Offer, StudentYear } from "./offerTypes";

export function isYearEligible(offer: Offer, year: StudentYear | null): boolean {
  if (!year || offer.year_eligibility === "all") {
    return true;
  }

  return offer.year_eligibility.includes(year);
}
