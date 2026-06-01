import { BROKEN_OFFER_EMAIL } from "@/lib/constants";

export function OfferVettingLinks({
  id,
  title
}: {
  id: string;
  title: string;
}) {
  const worksSubject = encodeURIComponent(`Offer works: ${title}`);
  const worksBody = encodeURIComponent(`Offer ID: ${id}\nThis offer worked for me.`);
  const brokenSubject = encodeURIComponent(`Broken offer: ${title}`);
  const brokenBody = encodeURIComponent(`Offer ID: ${id}\nThis offer appears to be broken, expired, or inaccurate.`);

  return (
    <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
      <a
        className="font-display text-xs font-bold uppercase text-moss underline decoration-moss/25 underline-offset-4 hover:text-bru"
        href={`mailto:${BROKEN_OFFER_EMAIL}?subject=${worksSubject}&body=${worksBody}`}
      >
        Works
      </a>
      <a
        className="font-display text-xs font-bold uppercase text-ink/55 underline decoration-ink/25 underline-offset-4 hover:text-clay"
        href={`mailto:${BROKEN_OFFER_EMAIL}?subject=${brokenSubject}&body=${brokenBody}`}
      >
        Flag broken
      </a>
    </div>
  );
}
