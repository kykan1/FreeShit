import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const OFFERS_PATH = path.join(ROOT, "data", "offers.json");
const DEFAULT_TIMEOUT_MS = 12000;

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = { output: null, timeout: DEFAULT_TIMEOUT_MS };

  for (let index = 0; index < args.length; index += 1) {
    const arg = args[index];
    if (arg === "--output") {
      parsed.output = args[index + 1];
      index += 1;
    } else if (arg === "--timeout") {
      parsed.timeout = Number(args[index + 1]);
      index += 1;
    }
  }

  return parsed;
}

function classifyStatus(status) {
  if (status >= 200 && status < 300) {
    return { status: "ok", severity: "ok" };
  }

  if (status >= 300 && status < 400) {
    return { status: "redirect", severity: "ok" };
  }

  if (status === 401 || status === 403) {
    return { status: "auth_required", severity: "warning" };
  }

  if (status === 404 || status === 410) {
    return { status: "broken", severity: "error" };
  }

  if (status === 429) {
    return { status: "rate_limited", severity: "warning" };
  }

  if (status >= 500) {
    return { status: "temporary_failure", severity: "warning" };
  }

  return { status: "unexpected_status", severity: "warning" };
}

async function checkOffer(offer, timeout) {
  const startedAt = Date.now();

  try {
    const response = await fetch(offer.redemption_url, {
      method: "GET",
      redirect: "manual",
      signal: AbortSignal.timeout(timeout),
      headers: {
        "user-agent": "college-free-stuff-dashboard-link-checker/1.0"
      }
    });
    const classification = classifyStatus(response.status);

    return {
      id: offer.id,
      title: offer.title,
      url: offer.redemption_url,
      http_status: response.status,
      redirect_location: response.headers.get("location"),
      elapsed_ms: Date.now() - startedAt,
      ...classification
    };
  } catch (error) {
    return {
      id: offer.id,
      title: offer.title,
      url: offer.redemption_url,
      http_status: null,
      redirect_location: null,
      elapsed_ms: Date.now() - startedAt,
      status: error?.name === "TimeoutError" ? "timeout" : "network_error",
      severity: "warning",
      message: error?.message ?? String(error)
    };
  }
}

const args = parseArgs();
const offers = JSON.parse(fs.readFileSync(OFFERS_PATH, "utf8"));
const checkedAt = new Date().toISOString();
const results = [];

for (const offer of offers) {
  results.push(await checkOffer(offer, args.timeout));
}

const report = {
  checked_at: checkedAt,
  total: results.length,
  ok: results.filter((result) => result.severity === "ok").length,
  warnings: results.filter((result) => result.severity === "warning").length,
  errors: results.filter((result) => result.severity === "error").length,
  results
};

const json = `${JSON.stringify(report, null, 2)}\n`;

if (args.output) {
  fs.writeFileSync(path.resolve(ROOT, args.output), json);
  console.log(`Wrote link check report to ${args.output}.`);
} else {
  process.stdout.write(json);
}

if (report.errors > 0) {
  process.exitCode = 1;
}
