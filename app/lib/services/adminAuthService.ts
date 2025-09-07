class AdminAuthService {
  private baseUrl = '/api/auth/admin';

  async login(email: string, password: string) {
    console.log('AdminAuthService: Intentando login para', email);
    
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Importante para cookies
    });

    const data = await response.json();
    console.log('AdminAuthService: Response status', response.status);

    if (!response.ok) {
      console.error('AdminAuthService: Login failed', data);
      throw new Error(data.error || 'Error en login de administrador');
    }

    console.log('AdminAuthService: Login exitoso');
    return data;
  }

  async verifyToken() {
    console.log('AdminAuthService: Verificando token admin');
    
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('AdminAuthService: Verify response status', response.status);

    if (!response.ok) {
      const errorData = await response.json();
      console.error('AdminAuthService: Token verification failed', errorData);
      throw new Error(errorData.error || 'Token inválido');
    }

    const data = await response.json();
    console.log('AdminAuthService: Token verification successful', data);
    return data;
  }

  async logout(): Promise<void> {
    console.log('AdminAuthService: Logout');
    
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      console.error('AdminAuthService: Logout failed');
      throw new Error('Error en logout');
    }

    console.log('AdminAuthService: Logout exitoso');
  }

  // Helper para verificar permisos
  hasPermission(permission: string, userPermissions: string[]): boolean {
    return userPermissions.includes(permission);
  }

  // Helper para verificar si es admin
  isAdmin(userType: string): boolean {
    return userType === 'admin';
  }

  // Helper para verificar si es staff
  isStaff(userType: string): boolean {
    return userType === 'store_staff';
  }
}

export const adminAuthService = new AdminAuthService();