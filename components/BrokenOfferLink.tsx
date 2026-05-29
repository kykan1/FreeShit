import { BROKEN_OFFER_EMAIL } from "@/lib/constants";

export function BrokenOfferLink({
  id,
  title
}: {
  id: string;
  title: string;
}) {
  const subject = encodeURIComponent(`Broken offer: ${title}`);
  const body = encodeURIComponent(`Offer ID: ${id} appears to be broken.`);

  return (
    <a
      className="font-display text-xs font-bold uppercase text-ink/55 underline decoration-ink/25 underline-offset-4 hover:text-clay"
      href={`mailto:${BROKEN_OFFER_EMAIL}?subject=${subject}&body=${body}`}
    >
      Flag as broken
    </a>
  );
}
