// app/lib/utils/auth.ts
import { LoginFormData, RegisterFormData, LoginResponse, AuthResponse } from '../types/auth';

export async function loginUser(data: LoginFormData): Promise<LoginResponse> {
  try {
    const response = await fetch('http://3.94.122.163/api/login', {  // Llamada directa a la API backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(data),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON válido');
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Error en la autenticación');
    }

    return responseData;
  } catch (error) {
    console.error('Error en login:', error);
    return { 
      error: error instanceof Error 
        ? error.message
        : 'Error al conectar con el servidor' 
    };
  }
}

export async function registerUser(data: RegisterFormData): Promise<AuthResponse> {
  try {
    const response = await fetch('http://3.94.122.163/api/register', {  // Llamada directa a la API backend
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        email: data.email,
        username: data.username,
        password: data.password,
        user_type: data.user_type
      }),
    });

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new Error('La respuesta del servidor no es JSON válido');
    }

    const responseData = await response.json();

    if (!response.ok) {
      throw new Error(responseData.error || 'Error en el registro');
    }

    return responseData;
  } catch (error) {
    console.error('Error en registro:', error);
    return { 
      error: error instanceof Error 
        ? error.message
        : 'Error al conectar con el servidor' 
    };
  }
}