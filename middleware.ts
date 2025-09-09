import { type NextRequest, NextResponse } from "next/server";
import {
  DEFAULT_LOCALE,
  isLocale,
  LOCALE_COOKIE,
  LOCALES,
  type Locale,
} from "@/lib/i18n/config";

function fromAcceptLanguage(header: string | null): Locale | undefined {
  if (!header) return undefined;
  return header
    .split(",")
    .map((part) => {
      const [tag, q] = part.trim().split(";q=");
      return { tag: tag.toLowerCase(), q: q ? Number(q) : 1 };
    })
    .sort((a, b) => b.q - a.q)
    .map(({ tag }) => tag.split("-")[0])
    .find(isLocale);
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const hasLocale = LOCALES.some(
    (locale) => pathname === `/${locale}` || pathname.startsWith(`/${locale}/`)
  );
  if (hasLocale) return;

  const cookie = request.cookies.get(LOCALE_COOKIE)?.value;
  const locale = isLocale(cookie)
    ? cookie
    : fromAcceptLanguage(request.headers.get("accept-language")) ??
      DEFAULT_LOCALE;

  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === "/" ? "" : pathname}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
