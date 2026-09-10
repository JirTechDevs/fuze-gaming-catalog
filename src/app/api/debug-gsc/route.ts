import { getSearchConsoleData } from "@/features/analytics/search-console";
import { requireAuthenticatedUser } from "@/features/admin-auth/guards";

export async function GET() {
  try {
    await requireAuthenticatedUser();
  } catch {
    return Response.json({ error: "unauthorized" }, { status: 401 });
  }

  const credentialsJson = process.env.GOOGLE_SERVICE_ACCOUNT_JSON;
  const siteUrl = process.env.GOOGLE_SEARCH_CONSOLE_SITE_URL;

  const envCheck = {
    hasCredentials: !!credentialsJson,
    credentialsLength: credentialsJson?.length ?? 0,
    hasSiteUrl: !!siteUrl,
    siteUrl: siteUrl ?? null,
    validJson: false,
    hasPrivateKey: false,
    hasClientEmail: false,
  };

  if (credentialsJson) {
    try {
      const parsed = JSON.parse(credentialsJson);
      envCheck.validJson = true;
      envCheck.hasPrivateKey = !!parsed.private_key;
      envCheck.hasClientEmail = !!parsed.client_email;
    } catch {
      // invalid json
    }
  }

  const data = await getSearchConsoleData();

  return Response.json({ envCheck, data: data ? "OK" : null });
}
