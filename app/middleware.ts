import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Obtener tokens de las cookies
  const userToken = request.cookies.get('token')?.value;
  const adminToken = request.cookies.get('admin_token')?.value;
  
  // Definir tipos de rutas
  const isUserAuthPage = pathname.startsWith('/auth') && !pathname.startsWith('/auth/admin');
  const isAdminAuthPage = pathname.startsWith('/admin/login');
  const isUserHomePage = pathname.startsWith('/Home') || pathname.startsWith('/home');
  const isAdminArea = pathname.startsWith('/admin') && pathname !== '/admin/login';
  //const isPublicRoute = pathname === '/' || pathname.startsWith('/public');

  console.log('Middleware ejecutándose para:', pathname);
  console.log('Tokens:', { userToken: !!userToken, adminToken: !!adminToken });

  // ===== PROTECCIÓN DE RUTAS ADMIN =====
  
  // Si intenta acceder a área admin sin token admin
  if (isAdminArea && !adminToken) {
    console.log('Acceso a admin sin token admin - redirigiendo a login admin');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // Si tiene token admin válido y trata de acceder al login admin
  if (isAdminAuthPage && adminToken) {
    console.log('Admin ya autenticado intentando login - redirigiendo a dashboard');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // ===== PROTECCIÓN DE RUTAS USUARIO NORMAL =====
  
  // Si intenta acceder a Home sin token de usuario normal
  if (isUserHomePage && !userToken) {
    console.log('Acceso a Home sin token usuario - redirigiendo a login usuario');
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Si tiene token de usuario y trata de acceder a auth (excepto logout)
  if (isUserAuthPage && userToken && !pathname.includes('/logout')) {
    console.log('Usuario ya autenticado intentando login - redirigiendo a Home');
    return NextResponse.redirect(new URL('/Home', request.url));
  }

  // ===== PREVENIR CRUCES DE AUTENTICACIÓN =====
  
  // Si tiene solo token admin e intenta acceder a rutas de usuario
  if (isUserHomePage && adminToken && !userToken) {
    console.log('Admin intentando acceder a rutas usuario - redirigiendo a admin dashboard');
    return NextResponse.redirect(new URL('/admin/dashboard', request.url));
  }

  // Si tiene solo token usuario e intenta acceder directamente a admin (no login)
  if (isAdminArea && userToken && !adminToken) {
    console.log('Usuario normal intentando acceder a admin - redirigiendo a login admin');
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // ===== MANEJO DE RUTAS ESPECIALES =====
  
  // Redirección de raíz basada en autenticación
  if (pathname === '/') {
    if (adminToken) {
      console.log('Redirigiendo admin a dashboard desde raíz');
      return NextResponse.redirect(new URL('/admin/dashboard', request.url));
    } else if (userToken) {
      console.log('Redirigiendo usuario a Home desde raíz');
      return NextResponse.redirect(new URL('/Home', request.url));
    }
    // Si no tiene tokens, permitir acceso a la raíz (página de bienvenida)
  }

  // ===== VALIDACIÓN ADICIONAL DE TOKENS (OPCIONAL) =====
  
  // Aquí podrías agregar validación del token si necesitas verificar expiración
  // antes de llegar al servidor, pero generalmente es mejor manejarlo en las rutas API
  
  console.log('Middleware permitiendo acceso a:', pathname);
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.png$|.*\\.jpg$|.*\\.jpeg$|.*\\.gif$|.*\\.svg$).*)',
  ],
}