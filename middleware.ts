import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import config from './app/_intl/intl.config'
 


/**
 * Prevent middleware from running on those specific paths:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * - api (API routes)
 */
const baseBypassPaths = [
    '_next/static',
    '_next/image',
    'favicon.ico',
    'api',
];


/**
* This middleware revalidates the user's session
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
async function authMiddleware(request: NextRequest, response: NextResponse) {
    
    // Bypass middleware for specific paths

    // Optional locale pattern: matches alphanumeric and hyphen characters followed by a slash
    // This is flexible enough to match locales like 'en', 'fr', 'en-US', etc.
    const optionalLocalePattern = '(?:[a-zA-Z0-9-]+/)?';

    // Login path with optional locale prefix
    const loginPath = `${optionalLocalePattern}login`;


    const combinedPaths = [...baseBypassPaths, loginPath].join('|');
    const bypassPathsRegex = new RegExp(`^/(${combinedPaths})`);

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
        console.warn('supabase:auth', '(Middleware) No user:', (error as Error).message)
        const url = request.nextUrl.clone()
        url.pathname = 'fr/login'
        decision = NextResponse.redirect(url)
    }
    
    return decision
}






/**
 * This middleware handles internationalization
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
export default function intlMiddleware(request: NextRequest) {

    const bypassPathsRegex = new RegExp(`^/(${baseBypassPaths.join('|')})`)
    if (bypassPathsRegex.test(request.nextUrl.pathname)) {
        return NextResponse.next()
    }

    // This is the middleware provided by next-intl library
    const nextIntlMiddleware = createMiddleware({
        locales: config.locales,
        defaultLocale: config.defaultLocale,
    })

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







// Middleware is used to make decisions about how to respond to a request.
export async function middleware(request: NextRequest) {

    // Internationalization middleware
    const intlResponse = intlMiddleware(request)

    // Auth middleware
    const authResponse = await authMiddleware(request, intlResponse)

    return authResponse
}