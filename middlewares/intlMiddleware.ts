import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'
import config from '../intl/intl.config'


/**
 * This middleware handle internationalization
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
export default function intlMiddleware(request: NextRequest) {

    /**
    * Bypass middleware for specific paths:
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * Feel free to modify this pattern to include more paths.
    * @see https://next-intl-docs.vercel.app/docs/routing/middleware#matcher-no-prefix
    */
    const bypassPathsRegex = /^\/(_next\/static|_next\/image|favicon.ico)/
    if (bypassPathsRegex.test(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    /*
    // Match only internationalized pathnames
    //const internationalizedPathnameRegex = /^\/(en|fr)(\/|$)/
    const internationalizedPathnameRegex = /^\/(fr|en)($|\/.*)/

    // If it doesn't match, do nothing
    if (!internationalizedPathnameRegex.test(request.nextUrl.pathname)) {
        return NextResponse.next()
    }
    */

    const decision = nextIntlMiddleware(request)

    /*
    console.log({
        tags: ["internationalization", "middleware", "next-intl", "i18n", "intlMiddleware"],
        pathname: request.nextUrl.pathname,
        browserLanguages: request.headers.get("accept-language"),
        nextLocaleCookie: decision.headers.get("x-middleware-request-cookie")?.substring(12),
        chosenLocale: decision.headers.get("x-middleware-request-x-next-intl-locale")
    })
    */

    return decision
}

// This is the middleware provided by next-intl library
const nextIntlMiddleware = createMiddleware({
    locales: config.locales,
    defaultLocale: config.defaultLocale,
})