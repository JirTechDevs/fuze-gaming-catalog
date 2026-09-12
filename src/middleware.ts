import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";
import { ADMIN_DEVICE_COOKIE, VISITOR_COOKIE } from "@/features/analytics/track-visit";

// Persistent anonymous visitor identity (~2 years), NOT a short-lived session.
const COOKIE_TTL = 60 * 60 * 24 * 365 * 2;

const PROTECTED_PATH_PREFIXES = ["/dashboard", "/admin"];

type CookieUpdate = { name: string; value: string; options: CookieOptions };

export async function middleware(request: NextRequest) {
  const authCookieUpdates: CookieUpdate[] = [];

  const supabase = createServerClient(
    getSupabaseUrl(),
    getSupabasePublishableKey(),
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            authCookieUpdates.push({ name, value, options });
          });
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;
  const isProtected = PROTECTED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

  if (isProtected && !user) {
    const loginUrl = new URL("/login", request.url);
    return NextResponse.redirect(loginUrl);
  }

  const response = NextResponse.next({ request });

  for (const { name, value, options } of authCookieUpdates) {
    response.cookies.set(name, value, options);
  }

  const cookieOptions: Partial<CookieOptions> = {
    httpOnly: true,
    sameSite: "lax",
    maxAge: COOKIE_TTL,
    path: "/",
    secure: process.env.NODE_ENV === "production",
  };

  if (user) {
    // Marks this device as admin for good (survives logout), so the owner
    // browsing the storefront logged-out is never counted as a visitor.
    response.cookies.set(ADMIN_DEVICE_COOKIE, "1", cookieOptions);
  } else {
    // Minted on page loads only; /api/public/track (outside the matcher)
    // requires the browser to send it back.
    const visitorId = request.cookies.get(VISITOR_COOKIE)?.value ?? crypto.randomUUID();
    response.cookies.set(VISITOR_COOKIE, visitorId, cookieOptions);
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|api/public/).*)",
  ],
};
