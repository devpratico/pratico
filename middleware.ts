import { type NextRequest } from 'next/server'
import { createServerClient } from '@supabase/ssr'
import createMiddleware from 'next-intl/middleware';
import { routing } from './app/(frontend)/_intl/routing';
import logger from './app/_utils/logger'
 

export const config = {
    // Match all pathnames except for
    // - … if they start with `/api`, `/trpc`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    matcher: '/((?!api|trpc|_next|_vercel|.*\\..*).*)'
};


// This is the middleware provided by next-intl library
const nextIntlMiddleware = createMiddleware(routing);



/**
* This middleware revalidates the user's session
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
export async function middleware(request: NextRequest) {

    const response = nextIntlMiddleware(request);

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

    const { data: { user }, error} = await supabase.auth.getUser()
    if (!user || error) logger.log('next:middleware', 'no user', `(${error?.message})`)

    return response;
}




