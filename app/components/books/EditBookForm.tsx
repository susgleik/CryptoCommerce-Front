'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Category, Book } from '@/app/lib/types/book';
import { updateBook, getBookById } from '@/app/lib/services/bookService';
import { getCategories } from '@/app/lib/services/categoryService';

interface EditBookFormProps {
    bookId: number;
    onCancel: () => void;
    onSuccess: (updatedBook: Book) => void;
  }

  export default function EditBookForm({ bookId, onCancel, onSuccess }: EditBookFormProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    author_name: '',
    isbn: '',
    price: '',
    publication_date: '',
    description: '',
    stock: '',
    category_ids: [] as number[]
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookData, categoriesData] = await Promise.all([
          getBookById(bookId),
          getCategories()
        ]);

        setCategories(categoriesData);
        setFormData({
          title: bookData.title,
          author_name: bookData.author_name,
          isbn: bookData.isbn || '',
          price: bookData.price.toString(),
          publication_date: bookData.publication_date || '',
          description: bookData.description || '',
          stock: bookData.stock.toString(),
          category_ids: bookData.categories.map(cat => cat.category_id)
        });
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Error al cargar los datos';
        setError(errorMessage);
        
        if (errorMessage === 'No autorizado') {
          // Redirigir al login si no está autorizado
          router.push('/auth/login');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [bookId, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const categoryId = parseInt(e.target.value);
    if (!isNaN(categoryId) && !formData.category_ids.includes(categoryId)) {
      setFormData(prev => ({
        ...prev,
        category_ids: [...prev.category_ids, categoryId]
      }));
    }
    e.target.value = '';
  };

  const removeCategory = (categoryId: number) => {
    setFormData(prev => ({
      ...prev,
      category_ids: prev.category_ids.filter(id => id !== categoryId)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const bookData = {
        ...formData,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock)
      };

      const updatedBook = await updateBook(bookId, bookData);
      onSuccess(updatedBook); // Llamar a onSuccess en lugar de redireccionar
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar el libro';
      setError(errorMessage);
      
      if (errorMessage === 'No autorizado') {
        router.push('/auth/login');
      }
    } finally {
      setLoading(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Editar Libro</h2>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Título
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Autor
            <input
              type="text"
              name="author_name"
              value={formData.author_name}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            ISBN
            <input
              type="text"
              name="isbn"
              value={formData.isbn}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Precio
            <input
              type="number"
              name="price"
              value={formData.price}
              onChange={handleChange}
              required
              step="0.01"
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Fecha de Publicación
            <input
              type="date"
              name="publication_date"
              value={formData.publication_date}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Stock
            <input
              type="number"
              name="stock"
              value={formData.stock}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Descripción
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={4}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            Categorías
          </label>
          <div className="mt-2 flex flex-wrap gap-2">
            {formData.category_ids.map(categoryId => {
              const category = categories.find(c => c.category_id === categoryId);
              return category && (
                <span
                  key={category.category_id}
                  className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                >
                  {category.name}
                  <button
                    type="button"
                    onClick={() => removeCategory(category.category_id)}
                    className="ml-1.5 inline-flex items-center justify-center w-4 h-4 rounded-full text-blue-400 hover:bg-blue-200 hover:text-blue-600 focus:outline-none"
                  >
                    ×
                  </button>
                </span>
              );
            })}
          </div>
          <select
            className="mt-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            onChange={handleCategoryChange}
            value=""
          >
            <option value="">Seleccionar categoría</option>
            {categories
              .filter(category => !formData.category_ids.includes(category.category_id))
              .map(category => (
                <option key={category.category_id} value={category.category_id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>

        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            Cancelar
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-blue-300"
          >
            {loading ? 'Guardando...' : 'Guardar Cambios'}
          </button>
        </div>
      </div>
    </form>
  );
}