export type SearchConsoleData = {
  clicks: number;
  impressions: number;
  ctr: number;
  position: number;
  topQueries: { query: string; clicks: number; impressions: number }[];
};

export async function getSearchConsoleData(): Promise<SearchConsoleData | null> {
  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;

  if (!credentialsJson || !siteUrl) return null;

  try {
    const credentials = JSON.parse(credentialsJson);

    // JWT auth via service account
    const now = Math.floor(Date.now() / 1000);
    const header = { alg: "RS256", typ: "JWT" };
    const payload = {
      iss: credentials.client_email,
      scope: "https://www.googleapis.com/auth/webmasters.readonly",
      aud: "https://oauth2.googleapis.com/token",
      iat: now,
      exp: now + 3600,
    };

    const encode = (obj: object) =>
      Buffer.from(JSON.stringify(obj)).toString("base64url");

    const unsigned = `${encode(header)}.${encode(payload)}`;

    // Sign with RS256 using Web Crypto
    const pemKey = credentials.private_key as string;
    const pemBody = pemKey.replace(/-----.*?-----/g, "").replace(/\s/g, "");
    const keyBuffer = Buffer.from(pemBody, "base64");
    const cryptoKey = await crypto.subtle.importKey(
      "pkcs8",
      keyBuffer,
      { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" },
      false,
      ["sign"],
    );
    const signatureBuffer = await crypto.subtle.sign(
      "RSASSA-PKCS1-v1_5",
      cryptoKey,
      Buffer.from(unsigned),
    );
    const signature = Buffer.from(signatureBuffer).toString("base64url");
    const jwt = `${unsigned}.${signature}`;

    // Exchange JWT for access token
    const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
        assertion: jwt,
      }),
    });
    const { access_token } = await tokenRes.json() as { access_token: string };

    // Query Search Console API — last 28 days
    const endDate = new Date().toISOString().split("T")[0];
    const startDate = new Date(Date.now() - 28 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split("T")[0];

    const [summaryRes, queriesRes] = await Promise.all([
      fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ startDate, endDate, dimensions: [] }),
        },
      ),
      fetch(
        `https://searchconsole.googleapis.com/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${access_token}`, "Content-Type": "application/json" },
          body: JSON.stringify({ startDate, endDate, dimensions: ["query"], rowLimit: 10 }),
        },
      ),
    ]);

    const summary = await summaryRes.json() as { rows?: { clicks: number; impressions: number; ctr: number; position: number }[] };
    const queries = await queriesRes.json() as { rows?: { keys: string[]; clicks: number; impressions: number }[] };

    const row = summary.rows?.[0];
    if (!row) return null;

    return {
      clicks: Math.round(row.clicks),
      impressions: Math.round(row.impressions),
      ctr: Math.round(row.ctr * 1000) / 10,
      position: row.position,
      topQueries: (queries.rows ?? []).map((r) => ({
        query: r.keys[0],
        clicks: Math.round(r.clicks),
        impressions: Math.round(r.impressions),
      })),
    };
  } catch {
    return null;
  }
}
