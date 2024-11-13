import { BooksResponse, Book, CreateBookDTO } from '../types/book';

// Función auxiliar para obtener el token y los headers
const getAuthHeaders = () => {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No hay token de autenticación');
  }
  return {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };
};

export async function getBooks(page: number = 1, itemsPerPage: number = 10): Promise<BooksResponse> {
  try {
    const response = await fetch(
      `http://54.205.8.73/api/v1/books/?page=${page}&items_per_page=${itemsPerPage}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al obtener los libros');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getBookById(bookId: number): Promise<Book> {
  try {
    const response = await fetch(
      `http://54.205.8.73/api/v1/books/${bookId}`,
      {
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      throw new Error('Error al obtener el libro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function updateBook(bookId: number, bookData: CreateBookDTO): Promise<Book> {
  try {
    const response = await fetch(
      `http://54.205.8.73/api/v1/books/${bookId}`,
      {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      const errorData = await response.json() as { message: string };
      throw new Error(errorData.message || 'Error al actualizar el libro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function createBook(bookData: CreateBookDTO): Promise<Book> {
  try {
    const response = await fetch(
      'http://54.205.8.73/api/v1/books/',
      {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(bookData),
      }
    );

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('No autorizado');
      }
      const errorData = await response.json() as { message: string };
      throw new Error(errorData.message || 'Error al crear el libro');
    }

    return await response.json();
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}