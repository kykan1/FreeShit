import { FRICTIONS } from "@/lib/constants";
import type { Friction } from "@/lib/offerTypes";
import { PillToggle } from "./PillToggle";

export function FrictionFilter({
  selected,
  onToggle
}: {
  selected: Friction[];
  onToggle: (friction: Friction) => void;
}) {
  return (
    <section aria-labelledby="friction-filter-label" className="space-y-3">
      <h2 id="friction-filter-label" className="font-display text-xs font-black uppercase text-ink/60">
        Friction
      </h2>
      <div className="flex flex-wrap gap-2">
        {FRICTIONS.map((friction) => (
          <PillToggle
            key={friction.value}
            label={friction.label}
            icon={friction.icon}
            selected={selected.includes(friction.value)}
            onPressedChange={() => onToggle(friction.value)}
          />
        ))}
      </div>
    </section>
  );
}
