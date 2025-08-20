// app/api/auth/register/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { RegisterSchema } from '@/app/lib/validation/auth-schemas';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = RegisterSchema.parse(body);

    const response = await fetch('http://localhost:8000/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(validatedData)
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        { error: data.error || 'Error en el registro' },
        { status: response.status }
      );
    }

    return NextResponse.json(
      { message: 'Registro exitoso' },
      { status: 201 }
    );

  } catch (error) {
    console.error('Error en registro:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}