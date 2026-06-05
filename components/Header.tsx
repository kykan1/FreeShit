import { SCHOOLS } from "@/lib/constants";
import type { School, StudentYear } from "@/lib/offerTypes";
import { SubmitOfferLink } from "./SubmitOfferLink";

export function Header({
  selectedSchool,
  selectedYear,
  onChangeYear,
  onSubmitOffer,
  offerCount
}: {
  selectedSchool: School;
  selectedYear: StudentYear | null;
  onChangeYear: () => void;
  onSubmitOffer: (school: School) => void;
  offerCount: number;
}) {
  const school = SCHOOLS.find((item) => item.value === selectedSchool);
  const schoolLabel = school?.shortLabel ?? "California";

  return (
    <header className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="font-display mb-3 inline-flex border-2 border-ink bg-gold px-3 py-1 text-xs font-black uppercase">
          {"California pilot \u00B7 community leads"}
        </p>
        <h1 className="font-display text-5xl font-black leading-[.92] text-ink sm:text-7xl">
          College Free Stuff
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-ink/70">
          A fast board for free food, campus essentials, student software, dev tools, events, and research help at big California schools.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 border-l-4 border-bru bg-white/55 px-4 py-3">
        <span className="font-display text-4xl font-black">{offerCount}</span>
        <span className="font-display text-xs font-black uppercase text-ink/60">{schoolLabel} matches</span>
        <button
          type="button"
          onClick={onChangeYear}
          className="font-display text-sm font-black text-bru underline decoration-bru/35 underline-offset-4 hover:text-clay"
        >
          {selectedYear ? `Change year (${selectedYear})` : "Set your year"}
        </button>
        <SubmitOfferLink school={selectedSchool} compact onOpen={onSubmitOffer} />
      </div>
    </header>
  );
}
