import type { StudentYear } from "@/lib/offerTypes";

export function Header({
  selectedYear,
  onChangeYear,
  offerCount
}: {
  selectedYear: StudentYear | null;
  onChangeYear: () => void;
  offerCount: number;
}) {
  return (
    <header className="mx-auto flex max-w-7xl flex-col gap-8 px-4 py-8 sm:px-6 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="font-display mb-3 inline-flex border-2 border-ink bg-gold px-3 py-1 text-xs font-black uppercase">
          UCLA only · static dashboard
        </p>
        <h1 className="font-display text-5xl font-black leading-[.92] text-ink sm:text-7xl">
          College Free Stuff
        </h1>
        <p className="mt-5 max-w-2xl text-lg font-semibold leading-8 text-ink/70">
          A fast Bruin board for free food, campus essentials, student software, dev tools, events, and research help.
        </p>
      </div>
      <div className="flex flex-col items-start gap-3 border-l-4 border-bru bg-white/55 px-4 py-3">
        <span className="font-display text-4xl font-black">{offerCount}</span>
        <span className="font-display text-xs font-black uppercase text-ink/60">matching offers</span>
        <button
          type="button"
          onClick={onChangeYear}
          className="font-display text-sm font-black text-bru underline decoration-bru/35 underline-offset-4 hover:text-clay"
        >
          {selectedYear ? `Change year (${selectedYear})` : "Set your year"}
        </button>
      </div>
    </header>
  );
}
