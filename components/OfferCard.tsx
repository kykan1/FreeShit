import { formatMiles } from "@/lib/distance";
import type { DisplayOffer } from "@/lib/offerTypes";
import { Badge } from "./Badge";
import { BrokenOfferLink } from "./BrokenOfferLink";
import { ExpiryBadge } from "./ExpiryBadge";

const categoryLabel = {
  devtools: "Dev Tools",
  food: "Food",
  software: "Software",
  swag: "Swag",
  events: "Events",
  research: "Research"
};

const frictionLabel = {
  instant: "Instant",
  quick: "Quick",
  involved: "Involved"
};

export function OfferCard({
  offer,
  nearMeActive
}: {
  offer: DisplayOffer;
  nearMeActive: boolean;
}) {
  const showDistance = nearMeActive && offer.category === "food" && typeof offer.distanceMiles === "number";

  return (
    <article className="group flex min-h-[270px] flex-col justify-between border-2 border-ink bg-paper p-5 shadow-card transition duration-200 hover:-translate-y-1 hover:bg-white">
      <div className="space-y-4">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex flex-wrap gap-2">
            <Badge tone="category">{categoryLabel[offer.category]}</Badge>
            <Badge tone="friction">{frictionLabel[offer.friction]}</Badge>
          </div>
          {showDistance ? <Badge tone="muted">{formatMiles(offer.distanceMiles!)}</Badge> : null}
        </div>
        <div>
          <h3 className="font-display text-2xl font-black leading-tight text-ink">{offer.title}</h3>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/68">{offer.description}</p>
        </div>
        <p className="border-l-4 border-gold pl-3 text-base font-bold leading-6 text-ink">
          {offer.one_liner}
        </p>
        <ExpiryBadge expiryDate={offer.expiry_date} verifiedAt={offer.verified_at} />
      </div>

      <div className="mt-6 flex items-center justify-between gap-4 border-t border-ink/15 pt-4">
        <BrokenOfferLink id={offer.id} title={offer.title} />
        <a
          href={offer.redemption_url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Claim ${offer.title}`}
          className="font-display inline-flex h-11 items-center rounded-full border-2 border-ink bg-gold px-5 text-sm font-black text-ink transition group-hover:translate-x-1"
        >
          Claim →
        </a>
      </div>
    </article>
  );
}
