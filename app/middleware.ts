// app/middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/auth');
  const isHomePage = request.nextUrl.pathname.startsWith('/Home');

  // Si el usuario no está autenticado y trata de acceder a /Home
  if (!token && isHomePage) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si el usuario está autenticado y trata de acceder a /auth
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/Home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Home/:path*', '/auth/:path*']
};