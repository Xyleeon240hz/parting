import { NextRequest, NextResponse } from 'next/server'

// Specify protected and public routes
const protectedRoutes = ['/dashboard']
const publicRoutes = ['/login', '/register', '/']

export default async function middleware(req: NextRequest) {
    try {
        const path = req.nextUrl.pathname
        const isProtectedRoute = protectedRoutes.includes(path) || path.startsWith('/dashboard')
        const isPublicRoute = publicRoutes.includes(path)

        // Check if session cookie exists (simple check without JWT verification)
        const sessionCookie = req.cookies.get('session')?.value
        const hasSession = !!sessionCookie

        // Redirect to /login if the user is not authenticated
        if (isProtectedRoute && !hasSession) {
            return NextResponse.redirect(new URL('/login', req.nextUrl))
        }

        // Redirect to /dashboard if the user is authenticated
        if (isPublicRoute && hasSession && path !== '/dashboard') {
            return NextResponse.redirect(new URL('/dashboard', req.nextUrl))
        }

        return NextResponse.next()
    } catch (error) {
        // On any error, allow the request to proceed
        return NextResponse.next()
    }
}

// Use experimental edge runtime for middleware
export const runtime = 'experimental-edge'

// Routes Middleware should not run on
export const config = {
    matcher: ['/((?!api|_next/static|_next/image|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|css|js)$).*)'],
}