export type OfferCategory = "devtools" | "food" | "software" | "swag" | "events" | "research";
export type Friction = "instant" | "quick" | "involved";
export type School =
  | "ucla"
  | "usc"
  | "berkeley"
  | "stanford"
  | "ucsd"
  | "uci"
  | "ucsb"
  | "ucdavis"
  | "ucsc"
  | "ucr"
  | "calpoly"
  | "sdsu"
  | "sjsu"
  | "csulb";
export type StudentYear = "freshman" | "sophomore" | "junior" | "senior" | "grad";
export type OfferSource = "seed" | "community";
export type SubmissionStatus = "pending" | "approved" | "rejected";
export type OfferSignalType = "works" | "broken" | "expired" | "duplicate" | "scammy";

export type Offer = {
  id: string;
  title: string;
  description: string;
  category: OfferCategory;
  friction: Friction;
  redemption_url: string;
  one_liner: string;
  schools: School[] | "all";
  year_eligibility: StudentYear[] | "all";
  requires_edu_email: boolean;
  expiry_date: string | null;
  expiry_datetime: string | null;
  verified_at: string;
  lat: number | null;
  lng: number | null;
};

export type DisplayOffer = Offer & {
  distanceMiles?: number;
  offer_source?: OfferSource;
  submission_id?: string;
};

export type OfferSubmission = {
  id: string;
  school: School;
  title: string;
  description: string;
  one_liner: string;
  category: OfferCategory;
  friction: Friction;
  redemption_url: string;
  requires_edu_email: boolean;
  expiry_date: string | null;
  expiry_datetime: string | null;
  submitted_by_email: string | null;
  source_note: string;
  status: SubmissionStatus;
  created_at: string;
  reviewed_at: string | null;
};

export type OfferSignal = {
  id: string;
  offer_id: string;
  offer_source: OfferSource;
  school: School;
  signal: OfferSignalType;
  voter_fingerprint: string | null;
  created_at: string;
};

export type OfferSignalSummary = {
  works: number;
  flags: number;
  broken: number;
  expired: number;
  duplicate: number;
  scammy: number;
  recentlyConfirmed: boolean;
  communityVerified: boolean;
  needsReview: boolean;
};
