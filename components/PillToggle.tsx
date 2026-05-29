import type { ReactNode } from "react";

export function PillToggle({
  label,
  selected,
  onPressedChange,
  icon
}: {
  label: string;
  selected: boolean;
  onPressedChange: () => void;
  icon?: ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPressedChange}
      className={`font-display inline-flex h-10 items-center gap-2 rounded-full border px-4 text-sm font-bold transition duration-200 ${
        selected
          ? "border-ink bg-ink text-paper shadow-[inset_0_-3px_0_rgba(255,209,0,.75)]"
          : "border-ink/25 bg-white/55 text-ink hover:-translate-y-0.5 hover:border-ink"
      }`}
    >
      {icon ? <span aria-hidden="true">{icon}</span> : null}
      {label}
    </button>
  );
}
