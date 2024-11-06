'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  username: string;
  user_type: 'common' | 'admin';
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    router.push('/auth/login');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link 
              href="/home" 
              className="flex items-center text-xl font-bold text-blue-600"
            >
              📚 Book Store
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {user?.user_type === 'admin' && (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/home/books/create" 
                  className="text-gray-600 hover:text-blue-600"
                >
                  Crear Libro
                </Link>
                <Link 
                  href="/home/books" 
                  className="text-gray-600 hover:text-blue-600 hidden"
                >
                  Administrar Libros
                </Link>
              </div>
            )}

            <div className="flex items-center space-x-4">
              {user && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                </div>
              )}
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}