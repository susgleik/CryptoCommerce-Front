import { Category } from '../types/book';

export async function getCategories(): Promise<Category[]> {
  const token = localStorage.getItem('token');
  
  try {
    const response = await fetch(
      'http://3.94.122.163/api/v1/categories',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    if (!response.ok) {
      throw new Error('Error al obtener las categorías');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}