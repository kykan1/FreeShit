import type { School } from "@/lib/offerTypes";
import { SubmitOfferLink } from "./SubmitOfferLink";

export function EmptyState({
  hasYear,
  selectedSchool
}: {
  hasYear: boolean;
  selectedSchool: School;
}) {
  return (
    <div className="mx-auto max-w-2xl border-2 border-dashed border-ink/30 bg-white/55 p-8 text-center shadow-card">
      <h2 className="font-display text-3xl font-black text-ink">No offers match this view.</h2>
      <p className="mt-3 text-base font-semibold leading-7 text-ink/65">
        {hasYear
          ? "Try loosening the filters, or send in a campus-specific lead."
          : "Choose your year first so the dashboard can show eligible offers."}
      </p>
      {hasYear ? (
        <div className="mt-6">
          <SubmitOfferLink school={selectedSchool} />
        </div>
      ) : null}
    </div>
  );
}
