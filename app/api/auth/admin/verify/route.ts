import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Obtener token desde cookies
    const adminToken = request.cookies.get('admin_token')?.value;
    
    console.log('Verificando token admin:', adminToken ? 'Token encontrado' : 'Token no encontrado');
    
    if (!adminToken) {
      console.log('No admin token found in cookies');
      return NextResponse.json(
        { error: 'No admin token found' },
        { status: 401 }
      );
    }

    console.log('Haciendo request a backend con token:', adminToken.substring(0, 20) + '...');

    const response = await fetch('http://localhost:8000/api/v1/auth/admin/verify-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('Response status del backend:', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.log('Error del backend:', errorData);
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Verificación exitosa:', data);

    // IMPORTANTE: Mapear user_id a id para consistencia con el frontend
    const mappedData = {
      valid: data.valid,
      user: {
        id: data.user.user_id || data.user.id, // Manejar ambos casos
        username: data.user.username,
        email: data.user.email,
        user_type: data.user.user_type,
        is_active: data.user.is_active,
        last_login: data.user.last_login
      },
      permissions: data.permissions
    };

    return NextResponse.json(mappedData);

  } catch (error) {
    console.error('Error verifying admin token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
