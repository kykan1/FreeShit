import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OFFERS_PATH = path.join(ROOT, "data", "offers.json");

const categories = new Set(["devtools", "food", "software", "swag", "events", "research"]);
const frictions = new Set(["instant", "quick", "involved"]);
const schools = new Set([
  "ucla",
  "usc",
  "berkeley",
  "stanford",
  "ucsd",
  "uci",
  "ucsb",
  "ucdavis",
  "ucsc",
  "ucr",
  "calpoly",
  "sdsu",
  "sjsu",
  "csulb"
]);
const years = new Set(["freshman", "sophomore", "junior", "senior", "grad"]);

const requiredFields = [
  "id",
  "title",
  "description",
  "category",
  "friction",
  "redemption_url",
  "one_liner",
  "schools",
  "year_eligibility",
  "requires_edu_email",
  "expiry_date",
  "expiry_datetime",
  "verified_at",
  "lat",
  "lng"
];

function readOffers() {
  return JSON.parse(fs.readFileSync(OFFERS_PATH, "utf8"));
}

function isDateOnly(value) {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }

  const date = new Date(`${value}T00:00:00Z`);
  return !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value;
}

function isIsoDatetime(value) {
  if (
    typeof value !== "string" ||
    !/^\d{4}-\d{2}-\d{2}T.+(?:Z|[+-]\d{2}:\d{2})$/.test(value)
  ) {
    return false;
  }

  return !Number.isNaN(new Date(value).getTime());
}

function isHttpUrl(value) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function validateSchoolList(value) {
  return value === "all" || (Array.isArray(value) && value.length > 0 && value.every((item) => schools.has(item)));
}

function validateYearList(value) {
  return value === "all" || (Array.isArray(value) && value.length > 0 && value.every((item) => years.has(item)));
}

function validateOffer(offer, index, seenIds) {
  const prefix = offer && typeof offer.id === "string" ? offer.id : `offer[${index}]`;
  const errors = [];

  if (!offer || typeof offer !== "object" || Array.isArray(offer)) {
    return [`offer[${index}] must be an object.`];
  }

  for (const field of requiredFields) {
    if (!(field in offer)) {
      errors.push(`${prefix}: missing required field "${field}".`);
    }
  }

  if (typeof offer.id !== "string" || !/^[a-z0-9-]+$/.test(offer.id)) {
    errors.push(`${prefix}: id must be a lowercase kebab-case string.`);
  } else if (seenIds.has(offer.id)) {
    errors.push(`${prefix}: duplicate id.`);
  } else {
    seenIds.add(offer.id);
  }

  for (const field of ["title", "description", "one_liner", "redemption_url", "verified_at"]) {
    if (typeof offer[field] !== "string" || offer[field].trim() === "") {
      errors.push(`${prefix}: ${field} must be a non-empty string.`);
    }
  }

  if (typeof offer.description === "string" && offer.description.length > 80) {
    errors.push(`${prefix}: description must be 80 characters or fewer.`);
  }

  if (typeof offer.one_liner === "string" && offer.one_liner.length > 80) {
    errors.push(`${prefix}: one_liner must be 80 characters or fewer.`);
  }

  if (!categories.has(offer.category)) {
    errors.push(`${prefix}: category must be one of ${Array.from(categories).join(", ")}.`);
  }

  if (!frictions.has(offer.friction)) {
    errors.push(`${prefix}: friction must be one of ${Array.from(frictions).join(", ")}.`);
  }

  if (!isHttpUrl(offer.redemption_url)) {
    errors.push(`${prefix}: redemption_url must be a valid http(s) URL.`);
  }

  if (!validateSchoolList(offer.schools)) {
    errors.push(`${prefix}: schools must be "all" or a non-empty array of known schools.`);
  }

  if (!validateYearList(offer.year_eligibility)) {
    errors.push(`${prefix}: year_eligibility must be "all" or a non-empty array of known years.`);
  }

  if (typeof offer.requires_edu_email !== "boolean") {
    errors.push(`${prefix}: requires_edu_email must be boolean.`);
  }

  if (offer.expiry_date !== null && !isDateOnly(offer.expiry_date)) {
    errors.push(`${prefix}: expiry_date must be YYYY-MM-DD or null.`);
  }

  if (offer.expiry_datetime !== null && !isIsoDatetime(offer.expiry_datetime)) {
    errors.push(`${prefix}: expiry_datetime must be an ISO datetime with timezone or null.`);
  }

  if (!isDateOnly(offer.verified_at)) {
    errors.push(`${prefix}: verified_at must be YYYY-MM-DD.`);
  }

  const latIsNull = offer.lat === null;
  const lngIsNull = offer.lng === null;
  const latIsNumber = typeof offer.lat === "number" && Number.isFinite(offer.lat);
  const lngIsNumber = typeof offer.lng === "number" && Number.isFinite(offer.lng);

  if (!((latIsNull && lngIsNull) || (latIsNumber && lngIsNumber))) {
    errors.push(`${prefix}: lat and lng must both be null or both finite numbers.`);
  }

  if (latIsNumber && (offer.lat < -90 || offer.lat > 90)) {
    errors.push(`${prefix}: lat must be between -90 and 90.`);
  }

  if (lngIsNumber && (offer.lng < -180 || offer.lng > 180)) {
    errors.push(`${prefix}: lng must be between -180 and 180.`);
  }

  return errors;
}

const offers = readOffers();
const errors = [];
const seenIds = new Set();

if (!Array.isArray(offers)) {
  errors.push("data/offers.json must contain a top-level array.");
} else {
  offers.forEach((offer, index) => {
    errors.push(...validateOffer(offer, index, seenIds));
  });
}

if (errors.length) {
  console.error(`Offer validation failed with ${errors.length} issue(s):`);
  for (const error of errors) {
    console.error(`- ${error}`);
  }
  process.exit(1);
}

console.log(`Validated ${offers.length} offers.`);
