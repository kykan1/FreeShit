import { getDistanceMiles, type GeoPoint } from "./distance";
import { isOfferExpired } from "./freshness";
import { isYearEligible } from "./yearEligibility";
import type { DisplayOffer, Friction, Offer, OfferCategory, School, StudentYear } from "./offerTypes";

export type ApplyOfferFiltersInput = {
  offers: Offer[];
  categories: OfferCategory[];
  frictions: Friction[];
  school: School;
  userYear: StudentYear | null;
  nearMeActive: boolean;
  userLocation: GeoPoint | null;
};

function matchesSchool(offer: Offer, school: School): boolean {
  return offer.schools === "all" || offer.schools.includes(school);
}

export function applyOfferFilters({
  offers,
  categories,
  frictions,
  school,
  userYear,
  nearMeActive,
  userLocation
}: ApplyOfferFiltersInput): DisplayOffer[] {
  const filtered = offers.filter((offer) => {
    const categoryMatch = categories.length === 0 || categories.includes(offer.category);
    const frictionMatch = frictions.length === 0 || frictions.includes(offer.friction);

    return (
      !isOfferExpired(offer) &&
      categoryMatch &&
      frictionMatch &&
      matchesSchool(offer, school) &&
      isYearEligible(offer, userYear)
    );
  });

  const withDistance: DisplayOffer[] = filtered.map((offer) => {
    if (
      nearMeActive &&
      userLocation &&
      offer.category === "food" &&
      offer.lat !== null &&
      offer.lng !== null
    ) {
      return {
        ...offer,
        distanceMiles: getDistanceMiles(userLocation, { lat: offer.lat, lng: offer.lng })
      };
    }

    return offer;
  });

  if (!nearMeActive || !userLocation) {
    return withDistance;
  }

  const food = withDistance
    .filter((offer) => offer.category === "food")
    .sort((a, b) => (a.distanceMiles ?? Number.POSITIVE_INFINITY) - (b.distanceMiles ?? Number.POSITIVE_INFINITY));
  const rest = withDistance.filter((offer) => offer.category !== "food");

  return [...food, ...rest];
}
