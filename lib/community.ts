import type {
  Friction,
  Offer,
  OfferCategory,
  OfferSignal,
  OfferSignalSummary,
  OfferSignalType,
  OfferSource,
  OfferSubmission,
  School
} from "./offerTypes";

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const MODERATION_TOKEN = process.env.NEXT_PUBLIC_MODERATION_TOKEN;
const FINGERPRINT_KEY = "offer_voter_fingerprint";

export type SubmissionInput = {
  school: School;
  title: string;
  description: string;
  one_liner: string;
  category: OfferCategory;
  friction: Friction;
  redemption_url: string;
  requires_edu_email: boolean;
  expiry_date: string | null;
  submitted_by_email: string | null;
  source_note: string;
};

export type SignalInput = {
  offerId: string;
  offerSource: OfferSource;
  school: School;
  signal: OfferSignalType;
};

export function communityEnabled(): boolean {
  return Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
}

export function moderationEnabled(): boolean {
  return communityEnabled() && Boolean(MODERATION_TOKEN);
}

function endpoint(path: string): string {
  if (!SUPABASE_URL) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL");
  }

  return `${SUPABASE_URL.replace(/\/$/, "")}/rest/v1/${path}`;
}

async function supabaseFetch<T>(path: string, init?: RequestInit): Promise<T> {
  if (!SUPABASE_ANON_KEY) {
    throw new Error("Missing NEXT_PUBLIC_SUPABASE_ANON_KEY");
  }

  const response = await fetch(endpoint(path), {
    ...init,
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
      "Content-Type": "application/json",
      ...init?.headers
    }
  });

  const responseText = await response.text();

  if (!response.ok) {
    throw new Error(responseText || `Supabase request failed with ${response.status}`);
  }

  if (!responseText) {
    return undefined as T;
  }

  return JSON.parse(responseText) as T;
}

export function getVoterFingerprint(): string | null {
  try {
    const existing = window.localStorage.getItem(FINGERPRINT_KEY);
    if (existing) {
      return existing;
    }

    const fingerprint =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    window.localStorage.setItem(FINGERPRINT_KEY, fingerprint);
    return fingerprint;
  } catch {
    return null;
  }
}

export async function fetchApprovedSubmissions(): Promise<OfferSubmission[]> {
  if (!communityEnabled()) {
    return [];
  }

  return supabaseFetch<OfferSubmission[]>(
    "offer_submissions?status=eq.approved&select=*&order=created_at.desc"
  );
}

export async function fetchPendingSubmissions(token: string): Promise<OfferSubmission[]> {
  if (!communityEnabled()) {
    return [];
  }

  return supabaseFetch<OfferSubmission[]>(
    "offer_submissions?status=eq.pending&select=*&order=created_at.asc",
    { headers: { "x-moderation-token": token } }
  );
}

export async function submitOffer(input: SubmissionInput): Promise<void> {
  await supabaseFetch("offer_submissions", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      ...input,
      expiry_datetime: input.expiry_date ? `${input.expiry_date}T23:59:59-07:00` : null,
      status: "pending"
    })
  });
}

export async function submitSignal(input: SignalInput): Promise<void> {
  await supabaseFetch("offer_signals", {
    method: "POST",
    headers: { Prefer: "return=minimal" },
    body: JSON.stringify({
      offer_id: input.offerId,
      offer_source: input.offerSource,
      school: input.school,
      signal: input.signal,
      voter_fingerprint: getVoterFingerprint()
    })
  });
}

export async function updateSubmissionStatus(
  id: string,
  status: "approved" | "rejected",
  token: string
): Promise<void> {
  await supabaseFetch(`offer_submissions?id=eq.${encodeURIComponent(id)}`, {
    method: "PATCH",
    headers: {
      Prefer: "return=minimal",
      "x-moderation-token": token
    },
    body: JSON.stringify({
      status,
      reviewed_at: new Date().toISOString()
    })
  });
}

export async function fetchSignals(): Promise<OfferSignal[]> {
  if (!communityEnabled()) {
    return [];
  }

  return supabaseFetch<OfferSignal[]>("offer_signals?select=*&order=created_at.desc&limit=2000");
}

export function communitySubmissionToOffer(submission: OfferSubmission): Offer {
  return {
    id: `community:${submission.id}`,
    title: submission.title,
    description: submission.description,
    category: submission.category,
    friction: submission.friction,
    redemption_url: submission.redemption_url,
    one_liner: submission.one_liner,
    schools: [submission.school],
    year_eligibility: "all",
    requires_edu_email: submission.requires_edu_email,
    expiry_date: submission.expiry_date,
    expiry_datetime: submission.expiry_datetime,
    verified_at: submission.created_at,
    lat: null,
    lng: null
  };
}

export function buildSignalSummaries(signals: OfferSignal[]): Record<string, OfferSignalSummary> {
  const summaries: Record<string, OfferSignalSummary> = {};
  const recentCutoff = Date.now() - 30 * 24 * 60 * 60 * 1000;

  for (const signal of signals) {
    const key = signal.offer_source === "community" ? `community:${signal.offer_id}` : signal.offer_id;
    const summary =
      summaries[key] ??
      {
        works: 0,
        flags: 0,
        broken: 0,
        expired: 0,
        duplicate: 0,
        scammy: 0,
        recentlyConfirmed: false,
        communityVerified: false,
        needsReview: false
      };

    if (signal.signal === "works") {
      summary.works += 1;
      summary.recentlyConfirmed =
        summary.recentlyConfirmed || new Date(signal.created_at).getTime() >= recentCutoff;
    } else {
      summary.flags += 1;
      summary[signal.signal] += 1;
    }

    summary.communityVerified = summary.works >= 3;
    summary.needsReview = summary.flags >= 3 && summary.flags > summary.works;
    summaries[key] = summary;
  }

  return summaries;
}

export function defaultSignalSummary(): OfferSignalSummary {
  return {
    works: 0,
    flags: 0,
    broken: 0,
    expired: 0,
    duplicate: 0,
    scammy: 0,
    recentlyConfirmed: false,
    communityVerified: false,
    needsReview: false
  };
}

export function readModerationTokenFromUrl(): string {
  if (typeof window === "undefined") {
    return "";
  }

  return new URLSearchParams(window.location.search).get("token") ?? "";
}

export function validModerationToken(token: string): boolean {
  return moderationEnabled() && token === MODERATION_TOKEN;
}
