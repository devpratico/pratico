import { type NextRequest, NextResponse } from 'next/server'
import { NextURL } from 'next/dist/server/web/next-url'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import config from './app/_intl/intl.config'
import logger from './app/_utils/logger'
import { redirect } from 'next/dist/server/api-utils'
 


/**
 * Prevent middleware from running on those specific paths:
 * - _next/static (static files)
 * - _next/image (image optimization files)
 * - favicon.ico (favicon file)
 * - public folder (public files)
 * - api (API routes)
 */
const baseBypassPaths = [
    '_next/static',
    '_next/image',
    'favicon.ico',
    'public',
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

    // If the request path matches the bypass regex, skip the middleware
    if (bypassPathsRegex.test(request.nextUrl.pathname)) {
        return response
    }
    
    // The default decision is to proceed normally.
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

    // If there's an error (no user), redirect to the login page   
    } catch (error) {
        logger.log('supabase:auth', '(Middleware) No user', `(${(error as Error).message})`)

        const originUrl = request.nextUrl
        const redirectUrl = originUrl.clone()
        redirectUrl.pathname = 'login' // Overwrite the pathname
        redirectUrl.searchParams.set('nextUrl', originUrl.pathname)
        logger.log('next:middleware', 'Redirecting to login page. Next URL:', originUrl.pathname)
        decision = NextResponse.redirect(redirectUrl)
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
        //logger.log('next:middleware', 'Bypassing intl middleware for path:', request.nextUrl.pathname)
        return NextResponse.next()
    }

    // This is the middleware provided by next-intl library
    const nextIntlMiddleware = createMiddleware({
        locales: config.locales,
        defaultLocale: config.defaultLocale,
    })

    const decision = nextIntlMiddleware(request)

    /*
    logger.log('next:middleware', 'Intl middleware:', {
        pathname: request.nextUrl.pathname,
        browserLanguages: request.headers.get("accept-language"),
        nextLocaleCookie: decision.headers.get("x-middleware-request-cookie")?.substring(12),
        chosenLocale: decision.headers.get("x-middleware-request-x-next-intl-locale"),
        redirection: decision.url,
    })*/

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