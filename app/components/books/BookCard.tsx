'use client';

import { useState, useEffect } from 'react';
import { Book } from '@/app/lib/types/book';
import EditBookForm from './EditBookForm';

interface BookCardProps {
  book: Book;
  isAdmin?: boolean;
  onBookUpdate?: (updatedBook: Book) => void;
}

export default function BookCard({ book, isAdmin = false, onBookUpdate }: BookCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [currentBook, setCurrentBook] = useState<Book>(book);
  const [showAdminControls, setShowAdminControls] = useState(false);

  useEffect(() => {
    setShowAdminControls(isAdmin);
  }, [isAdmin]);

  const handleEditSuccess = (updatedBook: Book) => {
    setCurrentBook(updatedBook);
    setIsEditing(false);
    if (onBookUpdate) {
      onBookUpdate(updatedBook);
    }
  };

  if (isEditing) {
    return (
      <EditBookForm 
        bookId={currentBook.book_id} 
        onCancel={() => setIsEditing(false)}
        onSuccess={handleEditSuccess}
      />
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900">{currentBook.title}</h3>
        <p className="text-sm text-gray-600">{currentBook.author_name}</p>
        <p className="text-lg font-bold text-blue-600 mt-2">${currentBook.price}</p>
        <p className="text-sm text-gray-500 mt-1">Stock: {currentBook.stock}</p>
        {currentBook.description && (
          <p className="text-sm text-gray-600 mt-2">{currentBook.description}</p>
        )}
        {currentBook.categories.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {currentBook.categories.map(category => (
              <span
                key={category.category_id}
                className="inline-block px-2 py-0.5 text-xs font-medium bg-blue-100 text-blue-800 rounded-full"
              >
                {category.name}
              </span>
            ))}
          </div>
        )}
        {showAdminControls && (
          <div className="mt-4 space-y-2">
            <button
              onClick={() => setIsEditing(true)}
              className="w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Editar Libro
            </button>
          </div>
        )}
      </div>
    </div>
  );
}