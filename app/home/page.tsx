'use client';

import { useEffect, useState } from 'react';
import { Book } from '@/app/lib/types/book';
import { getBooks } from '@/app/lib/services/bookService';
import BookCard from '@/app/components/books/BookCard';

interface User {
  username: string;
  user_type: 'common' | 'admin';
}

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Obtener información del usuario
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }

    // Obtener libros
    const fetchBooks = async () => {
      try {
        const response = await getBooks();
        setBooks(response.items);
        setError(null);
      } catch (err) {
        setError('Error al cargar los libros');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, []);

  const handleBookUpdate = (updatedBook: Book) => {
    setBooks(prevBooks => 
      prevBooks.map(book => 
        book.book_id === updatedBook.book_id ? updatedBook : book
      )
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando libros...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {books.map((book) => (
          <BookCard 
            key={book.book_id} 
            book={book} 
            isAdmin={user?.user_type === 'admin'}
            onBookUpdate={handleBookUpdate}
          />
        ))}
      </div>
    </div>
  );
}