import { NextResponse, type NextRequest } from 'next/server'
import intlMiddleware from './middlewares/intlMiddleware'
    
    
// Middleware is used to make decisions about how to respond to a request.
export async function middleware(request: NextRequest) {

    // Internationalization middleware
    const intlResponse = intlMiddleware(request)
    
    return intlResponse
}

/*
export const config = {
    matcher: [],
}
*/