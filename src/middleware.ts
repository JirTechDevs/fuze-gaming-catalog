import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { getSupabasePublishableKey, getSupabaseUrl } from "@/lib/supabase/env";

const VISITOR_COOKIE = "fvz_sid";
// Persistent anonymous visitor identity (~2 years), NOT a short-lived session.
const VISITOR_TTL = 60 * 60 * 24 * 365 * 2;

const PROTECTED_PATH_PREFIXES = ["/dashboard", "/admin"];
const STOREFRONT_EXCLUDED_PATH_PREFIXES = ["/login", "/api", "/catalog"];

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

  // Stamp a persistent anonymous visitor cookie. Setting it on the request
  // before building the response lets the downstream Server Component read it
  // on this very first request (fixing the first-visit NULL session bug).
  if (!user && !request.cookies.get(VISITOR_COOKIE)) {
    request.cookies.set(VISITOR_COOKIE, crypto.randomUUID());
  }

  const isExcludedStorefront = STOREFRONT_EXCLUDED_PATH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
  const shouldTrackStorefront = !isProtected && !isExcludedStorefront && !user;

  request.headers.set("x-fvz-path", pathname);
  request.headers.set("x-fvz-track", shouldTrackStorefront ? "1" : "0");

  const response = NextResponse.next({ request });

  for (const { name, value, options } of authCookieUpdates) {
    response.cookies.set(name, value, options);
  }

  const visitorId = request.cookies.get(VISITOR_COOKIE)?.value;
  if (!user && visitorId) {
    response.cookies.set(VISITOR_COOKIE, visitorId, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: VISITOR_TTL,
      path: "/",
      secure: process.env.NODE_ENV === "production",
    });
  }

  return response;
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|images/|api/public/).*)",
  ],
};
