import { AdminLoginResponse, AdminUser } from "../types/admin";

class AdminAuthService {
  private baseUrl = '/api/auth/admin';

  async login(email: string, password: string): Promise<AdminLoginResponse> {
    const response = await fetch(`${this.baseUrl}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
      credentials: 'include' // Importante para cookies
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Error en login de administrador');
    }

    return data;
  }

  async verifyToken(): Promise<{ valid: boolean; user: AdminUser; permissions: string[] }> {
    const response = await fetch(`${this.baseUrl}/verify`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Token inválido');
    }

    return response.json();
  }

  async logout(): Promise<void> {
    const response = await fetch(`${this.baseUrl}/logout`, {
      method: 'POST',
      credentials: 'include'
    });

    if (!response.ok) {
      throw new Error('Error en logout');
    }
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