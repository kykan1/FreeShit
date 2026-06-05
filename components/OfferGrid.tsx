import type { DisplayOffer } from "@/lib/offerTypes";
import type { OfferSignalSummary, OfferSignalType, School } from "@/lib/offerTypes";
import { EmptyState } from "./EmptyState";
import { OfferCard } from "./OfferCard";

export function OfferGrid({
  offers,
  nearMeActive,
  hasYear,
  selectedSchool,
  signalSummaries,
  onSignal,
  onSubmitOffer
}: {
  offers: DisplayOffer[];
  nearMeActive: boolean;
  hasYear: boolean;
  selectedSchool: School;
  signalSummaries: Record<string, OfferSignalSummary>;
  onSignal: (offer: DisplayOffer, signal: OfferSignalType) => Promise<void>;
  onSubmitOffer: (school: School) => void;
}) {
  if (!offers.length) {
    return <EmptyState hasYear={hasYear} selectedSchool={selectedSchool} onSubmitOffer={onSubmitOffer} />;
  }

  return (
    <section aria-label="Offers" className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {offers.map((offer) => (
        <OfferCard
          key={offer.id}
          offer={offer}
          nearMeActive={nearMeActive}
          signalSummary={signalSummaries[offer.id]}
          onSignal={onSignal}
        />
      ))}
    </section>
  );
}
