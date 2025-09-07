import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const adminToken = request.cookies.get('admin_token')?.value;
    
    if (!adminToken) {
      return NextResponse.json(
        { error: 'No admin token found' },
        { status: 401 }
      );
    }

    const response = await fetch('http://localhost:8000/api/v1/auth/admin/verify-token', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${adminToken}`,
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Invalid admin token' },
        { status: response.status }
      );
    }

    return NextResponse.json({
      valid: data.valid,
      user: data.user,
      permissions: data.permissions
    });

  } catch (error) {
    console.error('Error verifying admin token:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}