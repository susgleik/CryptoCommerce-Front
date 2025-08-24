'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';

interface User {
  username: string;
  user_type: 'common' | 'admin';
}

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userInfo = localStorage.getItem('userInfo');
    
    if (token && userInfo) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userInfo));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userInfo');
    setIsAuthenticated(false);
    setUser(null);
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
           {/* Logo link redirect to home / */}
            <div className="flex items-center">
              <Link 
                href="/" 
                className="flex items-center text-xl font-bold text-black"
              >
                /X
              </Link>
            </div>
            
            {/* links container items */}
          <div className="flex items-center gap-10">
            {/* Home link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Home
              </Link>
            </div>

            {/* Economy Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Economy
              </Link>
            </div>

            {/* Premium Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Premium
              </Link>
            </div>


            {/* Fast Drops Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Fast Drops
              </Link>
            </div>

            {/* Safety Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Safety Link
              </Link>
            </div>

            {/* FAQ Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                FAQ
              </Link>
            </div>

            {/* Contact Link */}
            <div className='flex items-center'>
              <Link 
                href="/" 
                className="text-black hover:text-blue-600 mr-6"
              >
                Contact Link
              </Link>
            </div>

            <Search className="w-5 h-5 text-black" />

          </div>



          <div className="flex items-center space-x-4">
            {/* Enlaces para administradores */}
            {user?.user_type === 'admin' && (
              <div className="hidden md:flex items-center space-x-4">
                <Link 
                  href="/home/books/create" 
                  className="text-gray-600 hover:text-blue-600"
                >
                  Crear Libro
                </Link>
              </div>
            )}

            {/* Si está autenticado */}
            {isAuthenticated && user ? (
              <div className="flex items-center space-x-4">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.username}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.user_type}</p>
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cerrar Sesión
                </button>
              </div>
            ) : (
              /* Si NO está autenticado */
              <div className="flex items-center space-x-3">
                <Link 
                  href="/auth/login" 
                  className="inline-flex items-center px-4 py-1.4 border-2 border-black text-sm font-medium rounded-2xl text-black bg-white hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  LOGIN
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}