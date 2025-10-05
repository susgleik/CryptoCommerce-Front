import { CreateProductDTO, Product, UpdateProductDTO } from "../types/product";

const API_URL = '/api/products'; // ← Apunta a tus rutas Next.js

const createAuthHeaders = (): HeadersInit => {
  return {
    'Content-Type': 'application/json',
  };
};

// public get - dont require auth
export const getProducts = async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
    try{
        const response = await fetch(`${API_URL}?skip=${skip}&limit=${limit}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
        if (!response.ok) {
            throw new Error(`Error fetching products: ${response.statusText}`);
        }
        const data = await response.json();
        return data

    }catch (error) {
        console.error('Error fetching products:', error);
        throw error;
    }
}

// public get by id - dont require auth
export const getProductById = async (productId: number): Promise<Product> => {
    try{
        const response = await fetch(`${API_URL}/${productId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });
        if (!response.ok){
            throw new Error(`Error fetching product by id: ${response.statusText}`);
        }
        const data = await response.json();
        return data;

    }catch (error) {
        console.error('Error fetching product by id:', error);
        throw error
    }
};

// GET only active products (filter on the client side)
export const getActiveProducts = async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
  try {
    const products = await getProducts(skip, limit);
    return products.filter(product => product.is_active);
  } catch (error) {
    console.error('Error fetching active products:', error);
    throw error;
  }
};

// GET only featured products (filter on the client side)
export const getFeaturedProducts = async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
  try {
    const products = await getProducts(skip, limit);
    return products.filter(product => product.is_featured && product.is_active);
  } catch (error) {
    console.error('Error fetching featured products:', error);
    throw error;
  }
};

// CREATE product - requieres admin auth
export const createProduct = async (productData: CreateProductDTO): Promise<Product> => {
  try {
    const response = await fetch(`${API_URL}`, {
      method: 'POST',
      headers: createAuthHeaders(),
      body: JSON.stringify(productData)
    });

    if (!response.ok){
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error creating product: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error){
    console.error('Error creating product:', error);
    throw error;
  }
}

// UPDATE product - requires admin auth
export const updateProduct = async (productId: number, productData: UpdateProductDTO): Promise<Product> => {
  try {
    const updateData = {
      ...productData, 
      supplier: undefined,
      categories: undefined,
      created_at: undefined,
      updated_at: undefined,
      product_id: undefined
    };

    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'PUT',
      headers: createAuthHeaders(),
      body: JSON.stringify(updateData)
    });

    if (!response.ok){
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error updating product: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// DELETE product - requires admin auth 
export const deleteProduct = async (productId: number) : Promise<boolean> => {
  try{
    const response = await fetch(`${API_URL}/${productId}`, {
      method: 'DELETE',
      headers: createAuthHeaders()
    });

    if (!response.ok){
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || `Error deleting product: ${response.statusText}`);
    }

    return true;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ADMIN: Get all products with admin auth (for admin panel)
export const getProductsAdmin = async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
  try {
    const response = await fetch(`${API_URL}?skip=${skip}&limit=${limit}`, {
      method: 'GET',
      headers: createAuthHeaders()
    });
    
    if (!response.ok) {
      throw new Error(`Error fetching products: ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products (admin):', error);
    throw error;
  }
};

// El resto del código permanece igual...
export const productService = {
  getProducts,
  getProductById,
  getActiveProducts,
  getFeaturedProducts,
  getProductsAdmin,
  createProduct,
  updateProduct,
  deleteProduct,
  
  validateProductData: (productData: CreateProductDTO | UpdateProductDTO): string[] => {
    const errors: string[] = [];
    
    if ('name' in productData && !productData.name?.trim()) {
      errors.push('El nombre del producto es requerido');
    }
    
    if ('price' in productData && (productData.price === undefined || productData.price < 0)) {
      errors.push('El precio debe ser mayor o igual a 0');
    }
    
    if ('online_stock' in productData && (productData.online_stock === undefined || productData.online_stock < 0)) {
      errors.push('El stock debe ser mayor o igual a 0');
    }
    
    if ('sku' in productData && !productData.sku?.trim()) {
      errors.push('El SKU es requerido');
    }
    
    return errors;
  },
  
  formatPrice: (price: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  },
  
  formatDate: (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  },
  
  getStatusLabel: (product: Product): string => {
    if (!product.is_active) return 'Inactivo';
    if (product.online_stock === 0) return 'Sin Stock';
    return 'Activo';
  },
  
  getStatusColor: (product: Product): string => {
    if (!product.is_active) return 'bg-gray-100 text-gray-800';
    if (product.online_stock === 0) return 'bg-red-100 text-red-800';
    return 'bg-green-100 text-green-800';
  }
};