export function NearMeToggle({
  active,
  error,
  onToggle
}: {
  active: boolean;
  error: string | null;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <button
        type="button"
        aria-pressed={active}
        onClick={onToggle}
        className={`font-display h-10 rounded-full border px-4 text-sm font-black transition ${
          active
            ? "border-moss bg-moss text-white shadow-[inset_0_-3px_0_rgba(255,209,0,.8)]"
            : "border-ink/25 bg-white/65 text-ink hover:border-ink"
        }`}
      >
        Near me
      </button>
      {error ? (
        <p aria-live="polite" className="max-w-64 text-sm font-semibold text-clay">
          {error}
        </p>
      ) : null}
    </div>
  );
}
