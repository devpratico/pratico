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
export async function middleware(request: NextRequest, intlResponse: NextResponse) {

    const response = nextIntlMiddleware(request);

    const supabase = createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                get(name: string) {
                    return request.cookies.get(name)?.value;
                },
                set(name: string, value: string, options: CookieOptions) {
                    request.cookies.set({ name, value, ...options });
                    response.cookies.set({ name, value, ...options });
                },
                remove(name: string, options: CookieOptions) {
                    request.cookies.set({ name, value: '', ...options });
                    response.cookies.set({ name, value: '', ...options });
                }
            }
        }
    );

    await supabase.auth.getUser();
    return response;
}




