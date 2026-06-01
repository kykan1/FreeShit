import type { Friction, OfferCategory, School, StudentYear } from "./offerTypes";

export const CATEGORIES: Array<{ value: OfferCategory; label: string }> = [
  { value: "devtools", label: "Dev Tools" },
  { value: "food", label: "Food" },
  { value: "software", label: "Software" },
  { value: "swag", label: "Swag" },
  { value: "events", label: "Events" },
  { value: "research", label: "Research" }
];

export const FRICTIONS: Array<{ value: Friction; label: string; icon: string }> = [
  { value: "instant", label: "Instant", icon: "\u26A1" },
  { value: "quick", label: "Quick", icon: "\u23F1" },
  { value: "involved", label: "Involved", icon: "\uD83D\uDD27" }
];

export const STUDENT_YEARS: Array<{ value: StudentYear; label: string }> = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "grad", label: "Grad" }
];

export const SCHOOLS: Array<{ value: School; label: string; shortLabel: string }> = [
  { value: "ucla", label: "UCLA", shortLabel: "UCLA" },
  { value: "usc", label: "USC", shortLabel: "USC" },
  { value: "berkeley", label: "UC Berkeley", shortLabel: "Berkeley" },
  { value: "stanford", label: "Stanford", shortLabel: "Stanford" },
  { value: "ucsd", label: "UC San Diego", shortLabel: "UCSD" },
  { value: "uci", label: "UC Irvine", shortLabel: "UCI" },
  { value: "ucsb", label: "UC Santa Barbara", shortLabel: "UCSB" },
  { value: "ucdavis", label: "UC Davis", shortLabel: "Davis" },
  { value: "ucsc", label: "UC Santa Cruz", shortLabel: "UCSC" },
  { value: "ucr", label: "UC Riverside", shortLabel: "UCR" },
  { value: "calpoly", label: "Cal Poly SLO", shortLabel: "Cal Poly" },
  { value: "sdsu", label: "San Diego State", shortLabel: "SDSU" },
  { value: "sjsu", label: "San Jose State", shortLabel: "SJSU" },
  { value: "csulb", label: "Cal State Long Beach", shortLabel: "CSULB" }
];

export const DEFAULT_FRICTIONS: Friction[] = ["instant", "quick"];
export const BROKEN_OFFER_EMAIL = "freebies@example.com";
export const SUBMIT_OFFER_EMAIL = "freebies@example.com";
