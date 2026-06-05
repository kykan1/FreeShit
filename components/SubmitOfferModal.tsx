"use client";

import { FormEvent, useEffect, useState } from "react";
import { CATEGORIES, FRICTIONS, SCHOOLS } from "@/lib/constants";
import { communityEnabled, submitOffer, type SubmissionInput } from "@/lib/community";
import type { Friction, OfferCategory, School } from "@/lib/offerTypes";

const fieldClass =
  "w-full border-2 border-ink bg-white px-3 py-2 text-sm font-semibold text-ink outline-none focus:border-bru";

function characterCount(value: string): number {
  return value.trim().length;
}

function validateSubmission(input: SubmissionInput): string[] {
  const errors: string[] = [];

  if (characterCount(input.title) < 3 || characterCount(input.title) > 90) {
    errors.push("Title must be 3-90 characters.");
  }

  if (characterCount(input.description) < 12 || characterCount(input.description) > 260) {
    errors.push("Description must be 12-260 characters. Add what the offer is and who it is for.");
  }

  if (characterCount(input.one_liner) < 8 || characterCount(input.one_liner) > 140) {
    errors.push("One-liner must be 8-140 characters. Try a short benefit like \"Free student plan with .edu email.\"");
  }

  if (!/^https?:\/\//i.test(input.redemption_url)) {
    errors.push("Claim URL must start with http:// or https://.");
  }

  if (characterCount(input.source_note) < 3 || characterCount(input.source_note) > 500) {
    errors.push("Source or proof must be 3-500 characters. Add where you found the offer.");
  }

  if (input.submitted_by_email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(input.submitted_by_email)) {
    errors.push("Email must look like name@example.com, or leave it blank.");
  }

  return errors;
}

function friendlySubmissionError(error: unknown): string {
  const message = error instanceof Error ? error.message : "";

  if (message.includes("offer_submissions_description_check")) {
    return "Description needs to be 12-260 characters.";
  }

  if (message.includes("offer_submissions_one_liner_check")) {
    return "One-liner needs to be 8-140 characters.";
  }

  if (message.includes("offer_submissions_title_check")) {
    return "Title needs to be 3-90 characters.";
  }

  if (message.includes("offer_submissions_source_note_check")) {
    return "Source or proof needs to be 3-500 characters.";
  }

  if (message.includes("offer_submissions_redemption_url_check")) {
    return "Claim URL must start with http:// or https://.";
  }

  if (message.includes("row-level security")) {
    return "Supabase rejected the submission. Check that the public insert policy exists for pending offers.";
  }

  if (message.includes("Failed to fetch")) {
    return "Could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL and your internet connection.";
  }

  if (message.includes("Invalid API key") || message.includes("JWT")) {
    return "Supabase rejected the API key. Check NEXT_PUBLIC_SUPABASE_ANON_KEY in .env.local, then restart the dev server.";
  }

  return message || "Submission failed.";
}

export function SubmitOfferModal({
  open,
  school,
  onClose
}: {
  open: boolean;
  school: School;
  onClose: () => void;
}) {
  const [selectedSchool, setSelectedSchool] = useState<School>(school);
  const [status, setStatus] = useState<"idle" | "saving" | "sent" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (open) {
      setSelectedSchool(school);
      setStatus("idle");
      setError(null);
      setValidationErrors([]);
    }
  }, [open, school]);

  if (!open) {
    return null;
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formElement = event.currentTarget;
    setStatus("saving");
    setError(null);

    const form = new FormData(formElement);
    const input: SubmissionInput = {
      school: selectedSchool,
      title: String(form.get("title") ?? "").trim(),
      description: String(form.get("description") ?? "").trim(),
      one_liner: String(form.get("one_liner") ?? "").trim(),
      category: String(form.get("category") ?? "software") as OfferCategory,
      friction: String(form.get("friction") ?? "quick") as Friction,
      redemption_url: String(form.get("redemption_url") ?? "").trim(),
      requires_edu_email: form.get("requires_edu_email") === "on",
      expiry_date: String(form.get("expiry_date") ?? "").trim() || null,
      submitted_by_email: String(form.get("submitted_by_email") ?? "").trim() || null,
      source_note: String(form.get("source_note") ?? "").trim()
    };

    const nextValidationErrors = validateSubmission(input);
    if (nextValidationErrors.length > 0) {
      setStatus("error");
      setValidationErrors(nextValidationErrors);
      setError("Fix the highlighted submission details and try again.");
      return;
    }

    if (!communityEnabled()) {
      setStatus("error");
      setValidationErrors([]);
      setError("Community submissions are not configured yet.");
      return;
    }

    try {
      await submitOffer(input);
      setStatus("sent");
      setValidationErrors([]);
      formElement.reset();
    } catch (submissionError) {
      setStatus("error");
      setValidationErrors([]);
      setError(friendlySubmissionError(submissionError));
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/45 px-4 py-6">
      <div className="max-h-full w-full max-w-2xl overflow-y-auto border-2 border-ink bg-paper shadow-card">
        <div className="sticky top-0 flex items-center justify-between border-b-2 border-ink bg-paper px-5 py-4">
          <div>
            <h2 className="font-display text-2xl font-black text-ink">Submit offer</h2>
            <p className="text-sm font-semibold text-ink/60">New leads start pending until reviewed.</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close submit offer"
            className="font-display flex h-9 w-9 items-center justify-center border-2 border-ink bg-white text-xl font-black text-ink hover:bg-gold"
          >
            x
          </button>
        </div>

        {status === "sent" ? (
          <div className="p-6">
            <div className="border-2 border-moss bg-white p-5">
              <h3 className="font-display text-2xl font-black text-moss">Submitted for review</h3>
              <p className="mt-2 text-sm font-semibold leading-6 text-ink/70">
                Thanks. Once approved, it can appear alongside the curated offers.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="font-display mt-5 h-11 rounded-full border-2 border-ink bg-gold px-5 text-sm font-black text-ink"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="grid gap-4 p-5 sm:grid-cols-2">
            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">School</span>
              <select className={fieldClass} value={selectedSchool} onChange={(event) => setSelectedSchool(event.target.value as School)}>
                {SCHOOLS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">Claim URL</span>
              <input className={fieldClass} name="redemption_url" type="url" required placeholder="https://..." />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="font-display text-xs font-black uppercase text-ink/60">Title</span>
              <input className={fieldClass} name="title" required minLength={3} maxLength={90} />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="font-display text-xs font-black uppercase text-ink/60">Description</span>
              <textarea className={fieldClass} name="description" required rows={3} minLength={12} maxLength={260} />
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="font-display text-xs font-black uppercase text-ink/60">One-liner</span>
              <input className={fieldClass} name="one_liner" required minLength={8} maxLength={140} />
            </label>

            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">Category</span>
              <select className={fieldClass} name="category" defaultValue="software">
                {CATEGORIES.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">Friction</span>
              <select className={fieldClass} name="friction" defaultValue="quick">
                {FRICTIONS.map((item) => (
                  <option key={item.value} value={item.value}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">Expiry date</span>
              <input className={fieldClass} name="expiry_date" type="date" />
            </label>

            <label className="space-y-1">
              <span className="font-display text-xs font-black uppercase text-ink/60">Your email</span>
              <input className={fieldClass} name="submitted_by_email" type="email" placeholder="optional" />
            </label>

            <label className="flex items-center gap-3 border-2 border-ink/20 bg-white/60 px-3 py-2 sm:col-span-2">
              <input name="requires_edu_email" type="checkbox" className="h-5 w-5 accent-[#2774ae]" />
              <span className="text-sm font-bold text-ink/75">Requires a .edu email</span>
            </label>

            <label className="space-y-1 sm:col-span-2">
              <span className="font-display text-xs font-black uppercase text-ink/60">Source or proof</span>
              <textarea className={fieldClass} name="source_note" required rows={2} minLength={3} maxLength={500} />
            </label>

            {(error || validationErrors.length > 0) ? (
              <div className="border-2 border-clay bg-white px-4 py-3 sm:col-span-2">
                {error ? <p className="text-sm font-black text-clay">{error}</p> : null}
                {validationErrors.length > 0 ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm font-bold leading-6 text-ink/75">
                    {validationErrors.map((validationError) => (
                      <li key={validationError}>{validationError}</li>
                    ))}
                  </ul>
                ) : null}
              </div>
            ) : null}

            <div className="flex items-center justify-end gap-3 sm:col-span-2">
              <button
                type="button"
                onClick={onClose}
                className="font-display h-11 rounded-full border-2 border-ink bg-white px-5 text-sm font-black text-ink"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={status === "saving"}
                className="font-display h-11 rounded-full border-2 border-ink bg-gold px-5 text-sm font-black text-ink disabled:cursor-wait disabled:opacity-65"
              >
                {status === "saving" ? "Submitting" : "Submit"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
