import { NextResponse } from 'next/server';

export async function POST() {
  try {
    const response = NextResponse.json({ message: 'Admin logout exitoso' });
    
    // Eliminar cookies de admin
    response.cookies.delete('admin_token');
    response.cookies.delete('admin_permissions');
    
    return response;
  } catch (error) {
    console.error('Error en admin logout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}