import type { ReactNode } from "react";

const toneClass = {
  category: "border-bru/30 bg-bru text-white",
  friction: "border-ink/20 bg-ink text-paper",
  warning: "border-clay/40 bg-clay text-white",
  muted: "border-ink/20 bg-white/65 text-ink"
};

export function Badge({
  children,
  tone = "muted"
}: {
  children: ReactNode;
  tone?: keyof typeof toneClass;
}) {
  return (
    <span className={`inline-flex min-h-7 items-center rounded-sm border px-2.5 py-1 text-xs font-bold uppercase tracking-normal ${toneClass[tone]}`}>
      {children}
    </span>
  );
}
