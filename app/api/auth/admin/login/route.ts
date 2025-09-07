import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

interface AdminLoginRequest {
  email: string;
  password: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdminLoginRequest = await request.json();

    const response = await fetch('http://localhost:8000/api/v1/auth/admin/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(body)
    });

    const data = await response.json();
    console.log('Admin login response:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.detail || 'Credenciales de administrador inválidas' },
        { status: response.status }
      );
    }

    if (data.access_token) {
      // Crear respuesta con cookies para admin
      const nextResponse = NextResponse.json({
        access_token: data.access_token,
        user: data.user,
        permissions: data.permissions,
        message: 'Login de administrador exitoso'
      }, { status: 200 });

      // Establecer cookie httpOnly específica para admin
      nextResponse.cookies.set('admin_token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2, // 2 horas (menos tiempo que usuario normal)
        path: '/admin' // Cookie solo disponible en rutas admin
      });

      // Cookie adicional para permissions
      nextResponse.cookies.set('admin_permissions', JSON.stringify(data.permissions), {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 2,
        path: '/admin'
      });

      return nextResponse;
    }

    return NextResponse.json(
      { error: 'Error en la autenticación de administrador' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Error en admin login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}