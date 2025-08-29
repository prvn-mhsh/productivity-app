
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = ['/', '/budget', '/reminders', '/notes', '/documents'];
const publicRoutes = ['/login', '/signup', '/welcome'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get('firebase-auth-token');

  // If the user is authenticated
  if (token) {
    // If they try to access a public route, redirect to home
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.redirect(new URL('/', request.url));
    }
  } 
  // If the user is not authenticated
  else {
    // If they try to access a protected route, redirect to welcome
    if (protectedRoutes.includes(pathname)) {
      return NextResponse.redirect(new URL('/welcome', request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}
