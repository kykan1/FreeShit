export function EmptyState({
  hasYear
}: {
  hasYear: boolean;
}) {
  return (
    <div className="mx-auto max-w-2xl border-2 border-dashed border-ink/30 bg-white/55 p-8 text-center">
      <h2 className="font-display text-3xl font-black text-ink">No offers match this view.</h2>
      <p className="mt-3 text-base font-semibold leading-7 text-ink/65">
        {hasYear
          ? "Try loosening the category or friction filters."
          : "Choose your year first so the dashboard can show eligible offers."}
      </p>
    </div>
  );
}
