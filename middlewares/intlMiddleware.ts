import createMiddleware from 'next-intl/middleware'
import { NextResponse, type NextRequest } from 'next/server'


/**
 * This middleware handle internationalization
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
export default function intlMiddleware(request: NextRequest) {

    // Match only internationalized pathnames
    const internationalizedPathnameRegex = /^\/(en|fr)(\/|$)/ ///^\/(de|en)($|\/.*)/

    // If it doesn't match, do nothing
    if (!internationalizedPathnameRegex.test(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // Otherwise, apply the middleware
    return nextIntlMiddleware(request)
}

// This is the middleware provided by next-intl library
const nextIntlMiddleware = createMiddleware({
    // Define the supported locales
    locales: ['en', 'fr'],
    // Define the default locale
    defaultLocale: 'en',
})