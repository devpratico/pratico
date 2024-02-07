import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'


/**
* This middleware checks if the user is authenticated.
* Unused at the moment.
* @see https://supabase.com/docs/guides/auth/server-side/nextjs
*/
export default async function authMiddleware(request: NextRequest) {
    
    /*
    * Bypass middleware for specific paths:
    * - _next/static (static files)
    * - _next/image (image optimization files)
    * - favicon.ico (favicon file)
    * Feel free to modify this pattern to include more paths.
    */
    const bypassPathsRegex = /^\/(_next\/static|_next\/image|favicon.ico)/
    if (bypassPathsRegex.test(request.nextUrl.pathname)) {
        return NextResponse.next()
    }
    
    // The default decision is to proceed normally.
    let decision = NextResponse.next()
    
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
        
    const {data:{user}, error} = await supabase.auth.getUser()
    
    /**
    * Conditionnaly do things
    * @see https://www.notion.so/praticolive/Middleware-62e7436f171d401d8e3cfb4678d19804?pvs=4
    */
    if (error || !user) {
        //console.error('Error getting user:', error)
        //decision = NextResponse.redirect('/login')
    }
    
    return decision
}