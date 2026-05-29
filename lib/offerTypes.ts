export type OfferCategory = "devtools" | "food" | "software" | "swag" | "events" | "research";
export type Friction = "instant" | "quick" | "involved";
export type School = "ucla";
export type StudentYear = "freshman" | "sophomore" | "junior" | "senior" | "grad";

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
  verified_at: string;
  lat: number | null;
  lng: number | null;
};

export type DisplayOffer = Offer & {
  distanceMiles?: number;
};
