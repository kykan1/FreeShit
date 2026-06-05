"use client";

import { useEffect, useState } from "react";
import {
  fetchSignals,
  fetchPendingSubmissions,
  readModerationTokenFromUrl,
  updateSubmissionStatus,
  validModerationToken
} from "@/lib/community";
import { CATEGORIES, FRICTIONS, SCHOOLS } from "@/lib/constants";
import type { OfferSignal, OfferSubmission } from "@/lib/offerTypes";

const categoryLabels = Object.fromEntries(CATEGORIES.map((item) => [item.value, item.label]));
const frictionLabels = Object.fromEntries(FRICTIONS.map((item) => [item.value, item.label]));
const schoolLabels = Object.fromEntries(SCHOOLS.map((item) => [item.value, item.label]));

export default function ModerationPage() {
  const [token, setToken] = useState("");
  const [submissions, setSubmissions] = useState<OfferSubmission[]>([]);
  const [signals, setSignals] = useState<OfferSignal[]>([]);
  const [status, setStatus] = useState<"loading" | "ready" | "blocked" | "error">("loading");
  const [message, setMessage] = useState<string | null>(null);

  async function loadPending(nextToken: string) {
    if (!validModerationToken(nextToken)) {
      setStatus("blocked");
      return;
    }

    try {
      setStatus("loading");
      const [pending, recentSignals] = await Promise.all([
        fetchPendingSubmissions(nextToken),
        fetchSignals()
      ]);
      setSubmissions(pending);
      setSignals(recentSignals.slice(0, 30));
      setStatus("ready");
    } catch (error) {
      setStatus("error");
      setMessage(error instanceof Error ? error.message : "Could not load pending submissions.");
    }
  }

  useEffect(() => {
    const nextToken = readModerationTokenFromUrl();
    setToken(nextToken);
    void loadPending(nextToken);
  }, []);

  async function reviewSubmission(id: string, nextStatus: "approved" | "rejected") {
    try {
      setMessage(null);
      await updateSubmissionStatus(id, nextStatus, token);
      setSubmissions((current) => current.filter((submission) => submission.id !== id));
      setMessage(nextStatus === "approved" ? "Submission approved." : "Submission rejected.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Moderation action failed.");
    }
  }

  return (
    <main className="mx-auto min-h-screen max-w-5xl px-4 py-8 sm:px-6">
      <div className="mb-8 border-l-4 border-bru bg-white/60 px-4 py-3">
        <p className="font-display text-xs font-black uppercase text-ink/55">Community vetting</p>
        <h1 className="font-display text-4xl font-black text-ink">Moderation</h1>
      </div>

      {status === "blocked" ? (
        <div className="border-2 border-clay bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl font-black text-clay">Token required</h2>
          <p className="mt-2 text-sm font-semibold leading-6 text-ink/70">
            Add a valid moderation token in the URL as <code>?token=...</code>.
          </p>
        </div>
      ) : null}

      {status === "loading" ? (
        <div className="border-2 border-ink bg-white p-6 shadow-card">
          <p className="font-display text-sm font-black uppercase text-ink/60">Loading pending submissions</p>
        </div>
      ) : null}

      {message ? (
        <p className="mb-4 border-2 border-ink bg-gold px-4 py-3 text-sm font-black text-ink">{message}</p>
      ) : null}

      {status === "error" ? (
        <div className="border-2 border-clay bg-white p-6 shadow-card">
          <h2 className="font-display text-2xl font-black text-clay">Could not load moderation queue</h2>
        </div>
      ) : null}

      {status === "ready" && submissions.length === 0 ? (
        <div className="border-2 border-dashed border-ink/30 bg-white/60 p-8 text-center shadow-card">
          <h2 className="font-display text-3xl font-black text-ink">No pending submissions.</h2>
        </div>
      ) : null}

      <section className="grid gap-4">
        {submissions.map((submission) => (
          <article key={submission.id} className="border-2 border-ink bg-white p-5 shadow-card">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <p className="font-display text-xs font-black uppercase text-ink/50">
                  {schoolLabels[submission.school]} &middot; {categoryLabels[submission.category]} &middot; {frictionLabels[submission.friction]}
                </p>
                <h2 className="font-display mt-1 text-3xl font-black text-ink">{submission.title}</h2>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => reviewSubmission(submission.id, "approved")}
                  className="font-display h-10 rounded-full border-2 border-ink bg-gold px-4 text-sm font-black text-ink"
                >
                  Approve
                </button>
                <button
                  type="button"
                  onClick={() => reviewSubmission(submission.id, "rejected")}
                  className="font-display h-10 rounded-full border-2 border-ink bg-white px-4 text-sm font-black text-ink hover:bg-clay hover:text-white"
                >
                  Reject
                </button>
              </div>
            </div>

            <p className="mt-4 text-sm font-semibold leading-6 text-ink/72">{submission.description}</p>
            <p className="mt-3 border-l-4 border-gold pl-3 text-base font-bold leading-6 text-ink">
              {submission.one_liner}
            </p>
            <dl className="mt-4 grid gap-3 text-sm font-semibold text-ink/70 sm:grid-cols-2">
              <div>
                <dt className="font-display text-xs font-black uppercase text-ink/45">Claim URL</dt>
                <dd className="break-all">
                  <a className="text-bru underline" href={submission.redemption_url} target="_blank" rel="noreferrer">
                    {submission.redemption_url}
                  </a>
                </dd>
              </div>
              <div>
                <dt className="font-display text-xs font-black uppercase text-ink/45">Submitted by</dt>
                <dd>{submission.submitted_by_email ?? "Anonymous"}</dd>
              </div>
              <div>
                <dt className="font-display text-xs font-black uppercase text-ink/45">Expiry</dt>
                <dd>{submission.expiry_date ?? "Unknown"}</dd>
              </div>
              <div>
                <dt className="font-display text-xs font-black uppercase text-ink/45">Source</dt>
                <dd>{submission.source_note}</dd>
              </div>
            </dl>
          </article>
        ))}
      </section>

      {status === "ready" ? (
        <section className="mt-8 border-2 border-ink bg-white p-5 shadow-card">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="font-display text-xs font-black uppercase text-ink/50">Trust signals</p>
              <h2 className="font-display text-3xl font-black text-ink">Recent works and flags</h2>
            </div>
            <span className="font-display text-xs font-black uppercase text-ink/50">
              Last {signals.length}
            </span>
          </div>

          {signals.length === 0 ? (
            <p className="text-sm font-semibold text-ink/65">No offer signals yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[680px] border-collapse text-left text-sm">
                <thead>
                  <tr className="border-b-2 border-ink">
                    <th className="font-display px-2 py-2 text-xs font-black uppercase text-ink/55">Signal</th>
                    <th className="font-display px-2 py-2 text-xs font-black uppercase text-ink/55">Offer</th>
                    <th className="font-display px-2 py-2 text-xs font-black uppercase text-ink/55">Source</th>
                    <th className="font-display px-2 py-2 text-xs font-black uppercase text-ink/55">School</th>
                    <th className="font-display px-2 py-2 text-xs font-black uppercase text-ink/55">When</th>
                  </tr>
                </thead>
                <tbody>
                  {signals.map((signal) => (
                    <tr key={signal.id} className="border-b border-ink/10">
                      <td className="px-2 py-2 font-bold text-ink">{signal.signal}</td>
                      <td className="px-2 py-2 font-semibold text-ink/70">{signal.offer_id}</td>
                      <td className="px-2 py-2 font-semibold text-ink/70">{signal.offer_source}</td>
                      <td className="px-2 py-2 font-semibold text-ink/70">{schoolLabels[signal.school]}</td>
                      <td className="px-2 py-2 font-semibold text-ink/70">
                        {new Date(signal.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      ) : null}
    </main>
  );
}
