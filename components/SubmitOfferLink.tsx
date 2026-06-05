import type { School } from "@/lib/offerTypes";

export function SubmitOfferLink({
  school,
  compact = false,
  onOpen
}: {
  school: School;
  compact?: boolean;
  onOpen: (school: School) => void;
}) {
  return (
    <button
      type="button"
      onClick={() => onOpen(school)}
      className={
        compact
          ? "font-display text-xs font-black uppercase text-bru underline decoration-bru/35 underline-offset-4 hover:text-clay"
          : "font-display inline-flex h-11 items-center rounded-full border-2 border-ink bg-ink px-5 text-sm font-black text-paper shadow-card transition hover:-translate-y-0.5 hover:bg-clay"
      }
    >
      Submit offer
    </button>
  );
}
