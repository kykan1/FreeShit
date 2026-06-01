import { SUBMIT_OFFER_EMAIL } from "@/lib/constants";
import type { School } from "@/lib/offerTypes";

export function SubmitOfferLink({
  school,
  compact = false
}: {
  school: School;
  compact?: boolean;
}) {
  const subject = encodeURIComponent(`New free offer for ${school}`);
  const body = encodeURIComponent(
    [
      `School: ${school}`,
      "Offer title:",
      "Claim URL:",
      "Category:",
      "Why it is free for students:",
      "Expiration date/time, if known:",
      "Source or proof:"
    ].join("\n")
  );

  return (
    <a
      href={`mailto:${SUBMIT_OFFER_EMAIL}?subject=${subject}&body=${body}`}
      className={
        compact
          ? "font-display text-xs font-black uppercase text-bru underline decoration-bru/35 underline-offset-4 hover:text-clay"
          : "font-display inline-flex h-11 items-center rounded-full border-2 border-ink bg-ink px-5 text-sm font-black text-paper shadow-card transition hover:-translate-y-0.5 hover:bg-clay"
      }
    >
      Submit offer
    </a>
  );
}
