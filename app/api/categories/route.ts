// app/api/categories/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function GET(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;

  const { searchParams } = new URL(request.url);

  // Build query parameters
  const params = new URLSearchParams();
  const skip = searchParams.get('skip');
  const limit = searchParams.get('limit');
  const name = searchParams.get('name');
  const is_active = searchParams.get('is_active');
  const parent_category_id = searchParams.get('parent_category_id');

  if (skip) params.append('skip', skip);
  if (limit) params.append('limit', limit);
  if (name) params.append('name', name);
  if (is_active) params.append('is_active', is_active);
  if (parent_category_id) params.append('parent_category_id', parent_category_id);

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  if (adminToken) {
    headers['Authorization'] = `Bearer ${adminToken}`;
  }

  try {
    const response = await fetch(
      `${API_URL}/api/v1/categories/?${params.toString()}`,
      {
        method: 'GET',
        headers
      }
    );

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Error fetching categories' },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en get de categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const cookieStore = await cookies();
  const adminToken = cookieStore.get('admin_token')?.value;

  if (!adminToken) {
    return NextResponse.json(
      { error: 'No autorizado' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();

    const response = await fetch(`${API_URL}/api/v1/categories/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${adminToken}`
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        errorData,
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error en post de categories:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
