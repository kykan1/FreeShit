import { SCHOOLS } from "@/lib/constants";
import type { School } from "@/lib/offerTypes";

export function SchoolSelect({
  value,
  onChange
}: {
  value: School;
  onChange: (school: School) => void;
}) {
  return (
    <label className="font-display flex flex-col gap-3 text-xs font-black uppercase text-ink/60">
      School
      <select
        value={value}
        onChange={(event) => onChange(event.target.value as School)}
        className="h-10 min-w-48 rounded-full border border-ink/25 bg-white/65 px-4 text-sm font-bold text-ink"
      >
        {SCHOOLS.map((school) => (
          <option key={school.value} value={school.value}>
            {school.label}
          </option>
        ))}
      </select>
    </label>
  );
}
