import { User, UsersResponse } from "../types/user";

const API_URL = '/api/users'; // Apunta a tus rutas Next.js

const createAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

// GET users - requires admin auth
export const getUsers = async (
  page: number = 1,
  itemsPerPage: number = 10
): Promise<UsersResponse> => {
  try {
    const response = await fetch(
      `${API_URL}?page=${page}&items_per_page=${itemsPerPage}`,
      {
        method: 'GET',
        headers: createAuthHeaders()
      }
    );

    if (!response.ok) {
      throw new Error(`Error fetching users: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

// GET user by ID - requires admin auth
export const getUserById = async (userId: number): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}/${userId}`, {
      method: 'GET',
      headers: createAuthHeaders()
    });

    if (!response.ok) {
      throw new Error(`Error fetching user by id: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching user by id:', error);
    throw error;
  }
};

// Helper functions for UI
export const userService = {
  getUsers,
  getUserById,

  getUserTypeLabel: (userType: string): string => {
    switch (userType) {
      case 'admin':
        return 'Administrador';
      case 'store_staff':
        return 'Staff de Tienda';
      case 'common':
        return 'Usuario Común';
      default:
        return userType;
    }
  },

  getUserTypeColor: (userType: string): string => {
    switch (userType) {
      case 'admin':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
      case 'store_staff':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'common':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  },

  getStatusLabel: (isActive: boolean): string => {
    return isActive ? 'Activo' : 'Inactivo';
  },

  getStatusColor: (isActive: boolean): string => {
    return isActive
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
  },

  formatDate: (dateString: string | null): string => {
    if (!dateString) return 'Nunca';

    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  },

  formatDateShort: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  }
};
