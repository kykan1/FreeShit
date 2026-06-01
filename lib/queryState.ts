import { CATEGORIES, DEFAULT_FRICTIONS, FRICTIONS, SCHOOLS } from "./constants";
import type { Friction, OfferCategory, School } from "./offerTypes";

const categoryValues = new Set(CATEGORIES.map((category) => category.value));
const frictionValues = new Set(FRICTIONS.map((friction) => friction.value));
const schoolValues = new Set<string>(SCHOOLS.map((school) => school.value));

export type FilterQueryState = {
  categories: OfferCategory[];
  frictions: Friction[];
  school: School;
};

function parseList<T extends string>(value: string | null, allowed: Set<string>): T[] {
  if (!value) {
    return [];
  }

  return value
    .split(",")
    .map((item) => item.trim())
    .filter((item): item is T => allowed.has(item));
}

export function readFiltersFromSearchParams(params: URLSearchParams): FilterQueryState {
  const categories = parseList<OfferCategory>(params.get("category"), categoryValues);
  const frictions = parseList<Friction>(params.get("friction"), frictionValues);
  const schoolParam = params.get("school");
  const school = schoolParam && schoolValues.has(schoolParam) ? (schoolParam as School) : "ucla";

  return {
    categories,
    frictions: frictions.length ? frictions : DEFAULT_FRICTIONS,
    school
  };
}

export function writeFiltersToUrl(filters: FilterQueryState): void {
  const params = new URLSearchParams();

  if (filters.categories.length) {
    params.set("category", filters.categories.join(","));
  }

  if (filters.frictions.length) {
    params.set("friction", filters.frictions.join(","));
  }

  params.set("school", filters.school);

  const query = params.toString();
  const nextUrl = query ? `${window.location.pathname}?${query}` : window.location.pathname;
  window.history.replaceState(null, "", nextUrl);
}
