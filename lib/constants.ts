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
  { value: "instant", label: "Instant", icon: "⚡" },
  { value: "quick", label: "Quick", icon: "⏱" },
  { value: "involved", label: "Involved", icon: "🔧" }
];

export const STUDENT_YEARS: Array<{ value: StudentYear; label: string }> = [
  { value: "freshman", label: "Freshman" },
  { value: "sophomore", label: "Sophomore" },
  { value: "junior", label: "Junior" },
  { value: "senior", label: "Senior" },
  { value: "grad", label: "Grad" }
];

export const SCHOOLS: Array<{ value: School; label: string }> = [
  { value: "ucla", label: "UCLA" }
];

export const DEFAULT_FRICTIONS: Friction[] = ["instant", "quick"];
export const BROKEN_OFFER_EMAIL = "freebies@example.com";
