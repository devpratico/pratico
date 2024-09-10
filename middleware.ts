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


// This is the middleware provided by next-intl library
const nextIntlMiddleware = createMiddleware({
    locales: intlConfig.locales,
    defaultLocale: intlConfig.defaultLocale,
})


/**
* This middleware revalidates the user's session
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
export async function middleware(request: NextRequest) {

    const response = nextIntlMiddleware(request);

    const publicURLs = [ '/auth/update-password' ];

    if (publicURLs.includes(request.nextUrl.pathname)) {
        return (response);
    }

	const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return request.cookies.getAll()
                },
                setAll(cookiesToSet) {
                    cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
                    cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options))
                },
            },
        }
    )

    try { 
        const { data: { user }, error} = await supabase.auth.getUser()
        if (!user || error) logger.log('next:middleware', 'getUser returned null', error?.message)
    } catch (error) { // This catch may be useless
        logger.log('next:middleware', 'getUser throw error:', error)
    }


    // TODO: When going to a capsule page, we need to chack if a room is open, and redirect to the room page if it is

    /*
    const locale = response.headers.get('x-middleware-request-x-next-intl-locale')

    if (
        !user &&
        !request.nextUrl.pathname.startsWith('/auth') &&
        !request.nextUrl.pathname.startsWith(`/${locale}/auth`) &&
        !request.nextUrl.pathname.startsWith('/form') &&
        !request.nextUrl.pathname.startsWith(`/${locale}/form`)

    ) {
        // no user, respond by redirecting to the login page
        const url = request.nextUrl.clone()
        url.pathname = '/auth'
        return NextResponse.redirect(url)
    }
    */

    return response;
}




