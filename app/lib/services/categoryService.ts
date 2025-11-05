import {
  Category,
  CategoryTree,
  CreateCategoryDTO,
  UpdateCategoryDTO,
  CategoryProductCount,
  BulkDeactivateRequest,
  BulkDeactivateResponse,
  CategoryStatusResponse,
  CategoryDeleteResponse,
} from '../types/category';

const API_URL = '/api/categories';

const createAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

// ========== PUBLIC ENDPOINTS (No Auth Required) ==========

// GET: Obtener todas las categorías
export const getCategories = async (
  skip: number = 0,
  limit: number = 100,
  filters?: {
    name?: string;
    is_active?: boolean;
    parent_category_id?: number;
  }
): Promise<Category[]> => {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    if (filters?.name) params.append('name', filters.name);
    if (filters?.is_active !== undefined) params.append('is_active', filters.is_active.toString());
    if (filters?.parent_category_id) params.append('parent_category_id', filters.parent_category_id.toString());

    const response = await fetch(`${API_URL}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    throw error;
  }
};

// GET: Obtener categoría por ID
export const getCategoryById = async (categoryId: number): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category by id:', error);
    throw error;
  }
};

// GET: Obtener subcategorías
export const getSubcategories = async (
  categoryId: number,
  skip: number = 0,
  limit: number = 100,
  is_active?: boolean
): Promise<Category[]> => {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
    });

    if (is_active !== undefined) params.append('is_active', is_active.toString());

    const response = await fetch(`${API_URL}/${categoryId}/subcategories?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching subcategories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subcategories:', error);
    throw error;
  }
};

// GET: Obtener categorías raíz
export const getRootCategories = async (
  skip: number = 0,
  limit: number = 100,
  is_active: boolean = true
): Promise<Category[]> => {
  try {
    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      is_active: is_active.toString(),
    });

    const response = await fetch(`${API_URL}/root/all?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching root categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching root categories:', error);
    throw error;
  }
};

// GET: Buscar categorías
export const searchCategories = async (
  searchTerm: string,
  skip: number = 0,
  limit: number = 50,
  is_active: boolean = true
): Promise<Category[]> => {
  try {
    if (searchTerm.length < 2) {
      throw new Error('Search term must be at least 2 characters long');
    }

    const params = new URLSearchParams({
      skip: skip.toString(),
      limit: limit.toString(),
      is_active: is_active.toString(),
    });

    const response = await fetch(`${API_URL}/search/${encodeURIComponent(searchTerm)}?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error searching categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching categories:', error);
    throw error;
  }
};

// GET: Contar productos de una categoría
export const getCategoryProductsCount = async (
  categoryId: number,
  include_inactive: boolean = false
): Promise<CategoryProductCount> => {
  try {
    const params = new URLSearchParams({
      include_inactive: include_inactive.toString(),
    });

    const response = await fetch(`${API_URL}/${categoryId}/products-count?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching products count: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products count:', error);
    throw error;
  }
};

// GET: Obtener árbol de categorías
export const getCategoryTree = async (
  categoryId: number,
  max_depth: number = 3
): Promise<CategoryTree> => {
  try {
    const params = new URLSearchParams({
      max_depth: max_depth.toString(),
    });

    const response = await fetch(`${API_URL}/${categoryId}/tree?${params.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Error fetching category tree: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching category tree:', error);
    throw error;
  }
};

// ========== ADMIN ENDPOINTS (Auth Required) ==========

// POST: Crear categoría
export const createCategory = async (categoryData: CreateCategoryDTO): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error creating category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating category:', error);
    throw error;
  }
};

// PUT: Actualizar categoría completa
export const updateCategory = async (
  categoryId: number,
  categoryData: CreateCategoryDTO
): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error updating category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating category:', error);
    throw error;
  }
};

// PATCH: Actualizar parcialmente
export const patchCategory = async (
  categoryId: number,
  categoryData: UpdateCategoryDTO
): Promise<Category> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
      body: JSON.stringify(categoryData),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error patching category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error patching category:', error);
    throw error;
  }
};

// PUT: Mover categoría
export const moveCategory = async (
  categoryId: number,
  newParentId?: number | null
): Promise<Category> => {
  try {
    const params = new URLSearchParams();
    if (newParentId !== undefined && newParentId !== null) {
      params.append('new_parent_id', newParentId.toString());
    }

    const response = await fetch(`${API_URL}/${categoryId}/move?${params.toString()}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error moving category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error moving category:', error);
    throw error;
  }
};

// PATCH: Cambiar estado
export const toggleCategoryStatus = async (categoryId: number): Promise<CategoryStatusResponse> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}/toggle-status`, {
      method: 'PATCH',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error toggling category status: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error toggling category status:', error);
    throw error;
  }
};

// DELETE: Desactivar categoría (soft delete)
export const deactivateCategory = async (categoryId: number): Promise<CategoryDeleteResponse> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error deactivating category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error deactivating category:', error);
    throw error;
  }
};

// DELETE: Eliminar permanentemente
export const hardDeleteCategory = async (
  categoryId: number,
  force: boolean = false
): Promise<CategoryDeleteResponse> => {
  try {
    const params = new URLSearchParams({
      force: force.toString(),
    });

    const response = await fetch(`${API_URL}/${categoryId}/hard?${params.toString()}`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error hard deleting category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error hard deleting category:', error);
    throw error;
  }
};

// DELETE: Desactivar múltiples categorías
export const bulkDeactivateCategories = async (
  categoryIds: number[]
): Promise<BulkDeactivateResponse> => {
  try {
    if (categoryIds.length === 0) {
      throw new Error('No category IDs provided');
    }

    if (categoryIds.length > 100) {
      throw new Error('Maximum 100 categories can be deactivated at once');
    }

    const requestBody: BulkDeactivateRequest = {
      category_ids: categoryIds,
    };

    const response = await fetch(`${API_URL}/bulk/deactivate`, {
      method: 'DELETE',
      headers: createAuthHeaders(),
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error bulk deactivating categories: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error bulk deactivating categories:', error);
    throw error;
  }
};

// POST: Restaurar categoría
export const restoreCategory = async (categoryId: number): Promise<CategoryStatusResponse> => {
  try {
    const response = await fetch(`${API_URL}/${categoryId}/restore`, {
      method: 'POST',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error restoring category: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error restoring category:', error);
    throw error;
  }
};

// GET: Admin - obtener todas las categorías (incluyendo inactivas)
export const getCategoriesAdmin = async (
  skip: number = 0,
  limit: number = 100
): Promise<Category[]> => {
  try {
    const response = await fetch(`${API_URL}?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: createAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Error fetching categories (admin): ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories (admin):', error);
    throw error;
  }
};

// ========== UTILITY FUNCTIONS ==========

export const categoryService = {
  // Public methods
  getCategories,
  getCategoryById,
  getSubcategories,
  getRootCategories,
  searchCategories,
  getCategoryProductsCount,
  getCategoryTree,

  // Admin methods
  getCategoriesAdmin,
  createCategory,
  updateCategory,
  patchCategory,
  moveCategory,
  toggleCategoryStatus,
  deactivateCategory,
  hardDeleteCategory,
  bulkDeactivateCategories,
  restoreCategory,

  // Validation
  validateCategoryData: (categoryData: CreateCategoryDTO | UpdateCategoryDTO): string[] => {
    const errors: string[] = [];

    if ('name' in categoryData && !categoryData.name?.trim()) {
      errors.push('El nombre de la categoría es requerido');
    }

    if ('name' in categoryData && categoryData.name && categoryData.name.length > 100) {
      errors.push('El nombre debe tener máximo 100 caracteres');
    }

    if ('name' in categoryData && categoryData.name && categoryData.name.length < 2) {
      errors.push('El nombre debe tener al menos 2 caracteres');
    }

    return errors;
  },

  // Formatting
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  },

  getStatusLabel: (category: Category): string => {
    return category.is_active ? 'Activa' : 'Inactiva';
  },

  getStatusColor: (category: Category): string => {
    return category.is_active
      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400';
  },

  // Tree helpers
  buildCategoryTreeFromFlat: (categories: Category[]): CategoryTree[] => {
    const categoryMap = new Map<number, CategoryTree>();
    const rootCategories: CategoryTree[] = [];

    // Initialize all categories with empty subcategories
    categories.forEach((cat) => {
      categoryMap.set(cat.category_id, { ...cat, subcategories: [] });
    });

    // Build tree structure
    categories.forEach((cat) => {
      const treeNode = categoryMap.get(cat.category_id)!;
      if (cat.parent_category_id === null) {
        rootCategories.push(treeNode);
      } else {
        const parent = categoryMap.get(cat.parent_category_id);
        if (parent) {
          parent.subcategories.push(treeNode);
        }
      }
    });

    return rootCategories;
  },

  getCategoryPath: (category: Category, allCategories: Category[]): string[] => {
    const path: string[] = [category.name];
    let currentCat = category;

    while (currentCat.parent_category_id !== null) {
      const parent = allCategories.find((c) => c.category_id === currentCat.parent_category_id);
      if (!parent) break;
      path.unshift(parent.name);
      currentCat = parent;
    }

    return path;
  },
};
