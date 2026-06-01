"use client";

import { useEffect, useRef } from "react";
import { STUDENT_YEARS } from "@/lib/constants";
import type { StudentYear } from "@/lib/offerTypes";

export function YearModal({
  open,
  selectedYear,
  onSelectYear,
  onClose
}: {
  open: boolean;
  selectedYear: StudentYear | null;
  onSelectYear: (year: StudentYear) => void;
  onClose?: () => void;
}) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const firstButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) {
      return;
    }

    const previous = document.activeElement as HTMLElement | null;
    firstButtonRef.current?.focus();

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && selectedYear) {
        onClose?.();
      }

      if (event.key !== "Tab" || !dialogRef.current) {
        return;
      }

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLButtonElement>("button:not([disabled])")
      );
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = "";
      previous?.focus();
    };
  }, [onClose, open, selectedYear]);

  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-ink/82 px-4 backdrop-blur-sm">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(255,209,0,.2),transparent_34%)]" />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="year-modal-title"
        aria-describedby="year-modal-description"
        className="relative w-full max-w-2xl border-2 border-ink bg-paper p-6 shadow-[12px_12px_0_rgba(255,209,0,1)] sm:p-8"
      >
        <div className="border-b-2 border-ink pb-4">
          <p className="font-display text-xs font-black uppercase text-bru">Required before browsing</p>
          <h2 id="year-modal-title" className="font-display mt-2 text-4xl font-black leading-none text-ink sm:text-5xl">
            What year are you?
          </h2>
          <p id="year-modal-description" className="mt-4 max-w-xl text-base font-semibold leading-7 text-ink/70">
            Pick your class year so the dashboard can hide offers you are not eligible for. This stays on this device only.
          </p>
        </div>
        <div className="mt-5 grid gap-2 sm:grid-cols-5">
          {STUDENT_YEARS.map((year, index) => (
            <button
              key={year.value}
              ref={index === 0 ? firstButtonRef : undefined}
              type="button"
              onClick={() => onSelectYear(year.value)}
              className={`font-display min-h-14 border-2 px-3 text-sm font-black uppercase transition hover:-translate-y-0.5 ${
                selectedYear === year.value
                  ? "border-ink bg-gold text-ink"
                  : "border-ink/30 bg-white/65 text-ink hover:border-ink"
              }`}
            >
              {year.label}
            </button>
          ))}
        </div>
        {selectedYear ? (
          <button
            type="button"
            onClick={onClose}
            className="font-display mt-5 text-sm font-black uppercase text-ink/60 underline underline-offset-4 hover:text-clay"
          >
            Keep current year
          </button>
        ) : null}
      </div>
    </div>
  );
}
