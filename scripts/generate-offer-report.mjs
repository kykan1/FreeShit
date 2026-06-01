import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OFFERS_PATH = path.join(ROOT, "data", "offers.json");
const DEFAULT_OUTPUT = "offer-refresh-report.md";
const DAY_MS = 24 * 60 * 60 * 1000;

const staleAfterDays = {
  food: 30,
  events: 7,
  swag: 30,
  research: 60,
  devtools: 180,
  software: 180
};

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { links: null, output: DEFAULT_OUTPUT };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--links") {
      parsed.links = args[index + 1];
      index += 1;
    } else if (arg === "--output") {
      parsed.output = args[index + 1];
      index += 1;
    }
  }

  return parsed;
}

function dateTime(value) {
  if (!value) {
    return null;
  }

  const time = new Date(value).getTime();
  return Number.isNaN(time) ? null : time;
}

function getFreshness(offer, now = new Date()) {
  const nowTime = now.getTime();
  const expiryTime = dateTime(offer.expiry_datetime ?? offer.expiry_date);
  const verifiedTime = dateTime(offer.verified_at);
  const daysSinceVerified = verifiedTime === null ? Number.POSITIVE_INFINITY : (nowTime - verifiedTime) / DAY_MS;

  if (expiryTime !== null) {
    const daysUntilExpiry = (expiryTime - nowTime) / DAY_MS;

    return {
      expired: daysUntilExpiry < 0,
      urgent: daysUntilExpiry >= 0 && daysUntilExpiry <= 1,
      expiringSoon: daysUntilExpiry > 1 && daysUntilExpiry <= 7,
      stale: false,
      daysUntilExpiry,
      daysSinceVerified
    };
  }

  return {
    expired: false,
    urgent: false,
    expiringSoon: false,
    stale: daysSinceVerified > staleAfterDays[offer.category],
    daysUntilExpiry: null,
    daysSinceVerified
  };
}

function isEventLikeWithoutDatetime(offer) {
  const searchable = `${offer.title} ${offer.description} ${offer.one_liner}`.toLowerCase();
  const foodEventWords = ["event", "giveaway", "distribution", "schedule", "thursday", "holiday", "reserve"];

  return (
    !offer.expiry_datetime &&
    (offer.category === "events" ||
      (offer.category === "food" && foodEventWords.some((word) => searchable.includes(word))))
  );
}

function listItems(items, formatter) {
  if (!items.length) {
    return "- None\n";
  }

  return `${items.map(formatter).join("\n")}\n`;
}

function countBy(items, keyFn) {
  const counts = new Map();

  for (const item of items) {
    for (const key of keyFn(item)) {
      counts.set(key, (counts.get(key) ?? 0) + 1);
    }
  }

  return Array.from(counts.entries()).sort(([a], [b]) => a.localeCompare(b));
}

function readLinkReport(linkPath) {
  if (!linkPath) {
    return null;
  }

  const resolved = path.resolve(ROOT, linkPath);
  if (!fs.existsSync(resolved)) {
    return null;
  }

  return JSON.parse(fs.readFileSync(resolved, "utf8"));
}

const args = parseArgs();
const now = new Date();
const offers = JSON.parse(fs.readFileSync(OFFERS_PATH, "utf8"));
const linkReport = readLinkReport(args.links);
const freshness = offers.map((offer) => ({ offer, state: getFreshness(offer, now) }));

const expired = freshness.filter((item) => item.state.expired);
const urgent = freshness.filter((item) => item.state.urgent);
const expiringSoon = freshness.filter((item) => item.state.expiringSoon);
const stale = freshness.filter((item) => item.state.stale);
const missingExpiryDatetime = offers.filter(isEventLikeWithoutDatetime);
const categoryCounts = countBy(offers, (offer) => [offer.category]);
const schoolCounts = countBy(offers, (offer) => (offer.schools === "all" ? ["all"] : offer.schools));

const brokenLinks = linkReport?.results?.filter((result) => result.severity === "error") ?? [];
const linkWarnings = linkReport?.results?.filter((result) => result.severity === "warning") ?? [];

const lines = [
  "# Offer Refresh Report",
  "",
  `Generated: ${now.toISOString()}`,
  "",
  "## Summary",
  "",
  `- Total offers: ${offers.length}`,
  `- Expired offers: ${expired.length}`,
  `- Ends within 24h: ${urgent.length}`,
  `- Expiring soon: ${expiringSoon.length}`,
  `- Stale offers: ${stale.length}`,
  `- Event-like offers missing expiry_datetime: ${missingExpiryDatetime.length}`,
  `- Broken links: ${brokenLinks.length}`,
  `- Link warnings: ${linkWarnings.length}`,
  "",
  "## Expired Offers",
  "",
  listItems(expired, ({ offer }) => `- ${offer.id}: ${offer.title}`),
  "## Ends Within 24h",
  "",
  listItems(urgent, ({ offer, state }) => `- ${offer.id}: ${offer.title} (${state.daysUntilExpiry.toFixed(1)} days)`),
  "## Expiring Soon",
  "",
  listItems(expiringSoon, ({ offer, state }) => `- ${offer.id}: ${offer.title} (${state.daysUntilExpiry.toFixed(1)} days)`),
  "## Stale Offers",
  "",
  listItems(
    stale,
    ({ offer, state }) =>
      `- ${offer.id}: ${offer.title} (${Math.floor(state.daysSinceVerified)} days since verification, threshold ${staleAfterDays[offer.category]} days)`
  ),
  "## Missing expiry_datetime",
  "",
  listItems(missingExpiryDatetime, (offer) => `- ${offer.id}: ${offer.title} (${offer.category})`),
  "## Link Check",
  "",
  linkReport
    ? [
        `- Checked at: ${linkReport.checked_at}`,
        `- OK: ${linkReport.ok}`,
        `- Warnings: ${linkReport.warnings}`,
        `- Errors: ${linkReport.errors}`,
        "",
        "### Broken",
        "",
        listItems(brokenLinks, (result) => `- ${result.id}: ${result.http_status ?? result.status} ${result.url}`),
        "### Warnings",
        "",
        listItems(linkWarnings, (result) => `- ${result.id}: ${result.http_status ?? result.status} ${result.url}`)
      ].join("\n")
    : "- No link report supplied. Run `npm run check:offers -- --output offer-link-report.json` first.",
  "",
  "## Category Counts",
  "",
  listItems(categoryCounts, ([category, count]) => `- ${category}: ${count}`),
  "## School Counts",
  "",
  listItems(schoolCounts, ([school, count]) => `- ${school}: ${count}`)
];

const output = lines.join("\n");
fs.writeFileSync(path.resolve(ROOT, args.output), `${output}\n`);
console.log(`Wrote offer refresh report to ${args.output}.`);
