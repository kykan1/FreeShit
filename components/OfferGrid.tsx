import type { DisplayOffer } from "@/lib/offerTypes";
import type { School } from "@/lib/offerTypes";
import { EmptyState } from "./EmptyState";
import { OfferCard } from "./OfferCard";

export function OfferGrid({
  offers,
  nearMeActive,
  hasYear,
  selectedSchool
}: {
  offers: DisplayOffer[];
  nearMeActive: boolean;
  hasYear: boolean;
  selectedSchool: School;
}) {
  if (!offers.length) {
    return <EmptyState hasYear={hasYear} selectedSchool={selectedSchool} />;
  }

  return (
    <section aria-label="Offers" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard key={offer.id} offer={offer} nearMeActive={nearMeActive} />
      ))}
    </section>
  );
}
