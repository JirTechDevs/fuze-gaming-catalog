import { isBotUserAgent } from "@/features/analytics/bot";

export const VISITOR_COOKIE = "fvz_sid";
export const ADMIN_DEVICE_COOKIE = "fvz_admin";

const TRACKED_PATH = /^\/(jual-beli-akun\/[A-Za-z0-9-]{1,32})?$/;
const VISITOR_ID = /^[0-9a-f-]{36}$/i;

export type VisitSignal = {
  visitorId: string | undefined;
  isAdminDevice: boolean;
  fetchSite: string | null;
  userAgent: string;
  path: unknown;
};

// A visit counts only when every signal points at a real shopper's browser:
// - fvz_sid exists: it was minted on the HTML load and the client kept the
//   cookie (cookie-less bots arrive without it; this endpoint never mints one)
// - same-origin fetch: sent by our page's JS, not a script hitting the URL
// - not a bot UA, not a device that has ever logged into admin
// - homepage or account detail page only
export function shouldCountVisit(signal: VisitSignal): signal is VisitSignal & { visitorId: string; path: string } {
  return (
    VISITOR_ID.test(signal.visitorId ?? "") &&
    !signal.isAdminDevice &&
    signal.fetchSite === "same-origin" &&
    !isBotUserAgent(signal.userAgent) &&
    typeof signal.path === "string" &&
    TRACKED_PATH.test(signal.path)
  );
}
