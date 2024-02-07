import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'


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

    // Otherwise, apply the middleware
    return nextIntlMiddleware(request)
}

// This is the middleware provided by next-intl library
const nextIntlMiddleware = createMiddleware({
    // Define the supported locales
    locales: ['en', 'fr'],
    // Define the default locale
    defaultLocale: 'fr',
})