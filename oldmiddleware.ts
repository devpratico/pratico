import { type NextRequest, NextResponse } from 'next/server'
import { createServerClient, type CookieOptions } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware'
import intlConfig from './app/_intl/intl.config'
import logger from './app/_utils/logger'
 

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: ['/((?!api|_next|_vercel|.*\\..*).*)']
};


/**
* This middleware revalidates the user's session
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
async function authMiddleware(request: NextRequest, intlResponse: NextResponse) {

    // If the request path is the login page, we don't need to check the user's session yet.
    if (request.nextUrl.pathname.includes('/login')) {
        return intlResponse
    }

    // If the intlResponse is a redirect, we don't need to check the user's session yet.
    // We'll do it in the next round
    if (intlResponse.status === 307) {
        return intlResponse
    }


    let authResponse = NextResponse.next({request: {headers: request.headers}})
    
    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {cookies: {
            get(name: string) {
                return request.cookies.get(name)?.value
            },
            set(name: string, value: string, options: CookieOptions) {
                request.cookies.set( {name, value, ...options})
                authResponse = NextResponse.next({request: {headers: request.headers}})
                authResponse.cookies.set({name, value, ...options})
                //logger.log('next:middleware', 'Setting cookie', name)
            },
            remove(name: string, options: CookieOptions) {
                request.cookies.set( {name, value: '', ...options})
                authResponse = NextResponse.next({ request: {headers: request.headers } })
                authResponse.cookies.set({name, value: '', ...options})
            },
        }}
    )
       
    try {
        const {data:{user}, error} = await supabase.auth.getUser()
        if (error) { throw error }
        if (!user) { throw new Error('getUser returned null') }
        //logger.log('next:middleware', 'Signed in as', user.id)

    } catch (error1) {
        try {
            const { data:{user}, error: _error } = await supabase.auth.signInAnonymously()
            if (_error) { throw _error }
            if (!user) { throw new Error('Supabase returned null') }
            logger.log('next:middleware', 'Signed in anonymously', user.id, `because "${(error1 as Error).message}"`)
            //return NextResponse.redirect(request.url)
        
        } catch (error2) {
            logger.error('next:middleware', 'Failed to sign in anonymously, redirecting to login page', `(${(error2 as Error).message})`)
            return NextResponse.redirect(new URL('/login', request.url))
        }
    }


    // The following monstrosity is used to combine the intl response with the auth response.
    // I couldn't find a way to successfully combine middlewares from supabase and next-intl, as both documentations are not compatible.

    // Get intl response elements needed for the final response
    const intlCookies = intlResponse.cookies.getAll()
    const intlLocale = intlResponse.headers.get('x-middleware-request-x-next-intl-locale')

    // Put them in the auth response
    intlCookies.forEach((value, name) => { authResponse.cookies.set(value)})
    if (intlLocale) { authResponse.headers.set('x-middleware-request-x-next-intl-locale', intlLocale) }

    // Both responses have a slightly different value for this header.
    // Add the missing value to the auth response
    authResponse.headers.set('x-middleware-override-headers', authResponse.headers.get('x-middleware-override-headers') + ', x-next-intl-locale')
    
    //logger.log('next:middleware', `Auth response for ${request.url}`, authResponse)
    return authResponse
}






/**
 * This middleware handles internationalization
 * @see https://next-intl-docs.vercel.app/docs/getting-started/app-router
 */
function intlMiddleware(request: NextRequest) {
    // This is the middleware provided by next-intl library
    const nextIntlMiddleware = createMiddleware({
        locales: intlConfig.locales,
        defaultLocale: intlConfig.defaultLocale,
    })

    const decision = nextIntlMiddleware(request)

    if (decision.status === 307) {
        logger.log('next:middleware', 'Redirecting from', request.url, 'to', decision.headers.get('Location'))
    }

    return decision
}







// Middleware is used to make decisions about how to respond to a request.
export default async function middleware(request: NextRequest) {

    // Internationalization middleware
    const intlResponse = intlMiddleware(request)

    // Auth middleware
    const authResponse = await authMiddleware(request, intlResponse)

    return authResponse
}