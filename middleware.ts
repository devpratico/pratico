import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import config from './intl/intl.config'
    
/**
 * Prevent middleware from running on those specific paths:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * - api (API routes)
 */
const bypassPathsRegex = /^\/(_next\/static|_next\/image|favicon.ico|api)/


/**
* This middleware revalidates the user's session
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
async function authMiddleware(request: NextRequest, response: NextResponse) {
    
    /*
    * Bypass middleware for specific paths:
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * Feel free to modify this pattern to include more paths.
    */
    if (bypassPathsRegex.test(request.nextUrl.pathname)) {
        //return NextResponse.next()
        return response
    }
    
    // The default decision is to proceed normally.
    //let decision = NextResponse.next()
    let decision = response
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
                request.cookies.set( {name, value, ...options})
                decision.cookies.set({name,value,...options})
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.set( {name, value: '', ...options})
                decision.cookies.set({name,value: '',...options})
            },
        }}
    )
       
    try {
        const {data:{user}, error} = await supabase.auth.getUser()
        if (error) throw error
        if (!user) throw new Error('Supabase returned null')
    } catch (error) {
            console.error('supabase:auth', '(Middleware) No user:', (error as Error).message)
        //decision = NextResponse.redirect('/login')
    }
    
    return decision
}






/**
 * This middleware handles internationalization
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





// Middleware is used to make decisions about how to respond to a request.
export async function middleware(request: NextRequest) {

    // Internationalization middleware
    const intlResponse = intlMiddleware(request)

    // Auth middleware
    const authResponse = await authMiddleware(request, intlResponse)

    return authResponse
}