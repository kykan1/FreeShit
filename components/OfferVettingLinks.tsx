"use client";

import { useState } from "react";
import type { DisplayOffer, OfferSignalType } from "@/lib/offerTypes";

export function OfferVettingLinks({
  offer,
  onSignal
}: {
  offer: DisplayOffer;
  onSignal: (offer: DisplayOffer, signal: OfferSignalType) => Promise<void>;
}) {
  const [busySignal, setBusySignal] = useState<OfferSignalType | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  async function sendSignal(signal: OfferSignalType) {
    setBusySignal(signal);
    setMessage(null);

    try {
      await onSignal(offer, signal);
      setMessage(signal === "works" ? "Confirmed" : "Flag sent");
    } catch {
      setMessage("Could not save");
    } finally {
      setBusySignal(null);
    }
  }

  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => sendSignal("works")}
        disabled={Boolean(busySignal)}
        className="font-display rounded-full border border-moss px-3 py-1 text-xs font-bold uppercase text-moss transition hover:bg-moss hover:text-white disabled:cursor-wait disabled:opacity-60"
      >
        {busySignal === "works" ? "Saving" : "Works"}
      </button>
      <select
        aria-label={`Flag ${offer.title}`}
        disabled={Boolean(busySignal)}
        defaultValue=""
        onChange={(event) => {
          const signal = event.target.value as OfferSignalType;
          event.target.value = "";
          if (signal) {
            void sendSignal(signal);
          }
        }}
        className="font-display h-8 rounded-full border border-ink/30 bg-white px-2 text-xs font-bold uppercase text-ink/65 disabled:cursor-wait disabled:opacity-60"
      >
        <option value="" disabled>
          Flag
        </option>
        <option value="broken">Broken</option>
        <option value="expired">Expired</option>
        <option value="duplicate">Duplicate</option>
        <option value="scammy">Scammy</option>
      </select>
      {message ? <span className="font-display text-xs font-bold uppercase text-ink/50">{message}</span> : null}
    </div>
  );
}
