import { Product } from "../types/product";

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

// public get - dont require auth
export const getProducts = async (skip: number = 0, limit: number = 100): Promise<Product[]> => {
    try{
        const response = await fetch(`${API_URL}/api/v1/products/?skip=${skip}&limit=${limit}`, {
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
        const response = await fetch(`${API_URL}/api/v1/products/${productId}`, {
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

