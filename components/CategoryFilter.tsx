import { CATEGORIES } from "@/lib/constants";
import type { OfferCategory } from "@/lib/offerTypes";
import { PillToggle } from "./PillToggle";

export function CategoryFilter({
  selected,
  onToggle,
  onClear
}: {
  selected: OfferCategory[];
  onToggle: (category: OfferCategory) => void;
  onClear: () => void;
}) {
  return (
    <section aria-labelledby="category-filter-label" className="space-y-3">
      <h2 id="category-filter-label" className="font-display text-xs font-black uppercase text-ink/60">
        Category
      </h2>
      <div className="flex flex-wrap gap-2">
        <PillToggle label="All" selected={selected.length === 0} onPressedChange={onClear} />
        {CATEGORIES.map((category) => (
          <PillToggle
            key={category.value}
            label={category.label}
            selected={selected.includes(category.value)}
            onPressedChange={() => onToggle(category.value)}
          />
        ))}
      </div>
    </section>
  );
}
