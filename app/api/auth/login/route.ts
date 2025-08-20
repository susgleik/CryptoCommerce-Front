import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LoginSchema } from '@/app/lib/validation/auth-schemas';
import type { LoginResponse } from '@/app/lib/types/auth';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const response = await fetch('http://localhost:8000/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(validatedData)
    });

    const data = await response.json() as LoginResponse;
    console.log('Response URL:', data);

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Credenciales inválidas' },
        { status: response.status }
      );
    }

     if (data.access_token) {
      // Crear respuesta con cookies
      const nextResponse = NextResponse.json({
        access_token: data.access_token,  // Incluir el token
        user: data.user,                 // Incluir datos del usuario
        message: 'Login exitoso'
      }, { status: 200 });

      // Establecer cookie httpOnly
      nextResponse.cookies.set('token', data.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // 7 días
      });

      return nextResponse;
    }

    return NextResponse.json(
      { error: 'Error en la autenticación' },
      { status: 401 }
    );

    return NextResponse.json(
      { error: 'Error en la autenticación' },
      { status: 401 }
    );

  } catch (error) {
    console.error('Error en login:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}