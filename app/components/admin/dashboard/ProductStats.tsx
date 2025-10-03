'use client'

import { useState } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  AdjustmentsHorizontalIcon
} from '@heroicons/react/24/outline'

interface Product {
  id: string
  name: string
  author: string
  category: string
  price: number
  stock: number
  status: 'active' | 'inactive' | 'out_of_stock'
  createdAt: string
}

export default function ProductsDatabase() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')

  const mockProducts: Product[] = [
    {
      id: '1',
      name: 'El Quijote de la Mancha',
      author: 'Miguel de Cervantes',
      category: 'Clásicos',
      price: 25.99,
      stock: 45,
      status: 'active',
      createdAt: '2024-01-15'
    },
    {
      id: '2',
      name: 'Cien Años de Soledad',
      author: 'Gabriel García Márquez',
      category: 'Literatura',
      price: 22.50,
      stock: 0,
      status: 'out_of_stock',
      createdAt: '2024-01-14'
    },
    {
      id: '3',
      name: 'La Casa de los Espíritus',
      author: 'Isabel Allende',
      category: 'Literatura',
      price: 19.99,
      stock: 23,
      status: 'active',
      createdAt: '2024-01-13'
    },
    {
      id: '4',
      name: 'El Principito',
      author: 'Antoine de Saint-Exupéry',
      category: 'Infantil',
      price: 15.00,
      stock: 67,
      status: 'inactive',
      createdAt: '2024-01-12'
    }
  ]

  const categories = ['all', 'Clásicos', 'Literatura', 'Infantil', 'Ciencia Ficción', 'Historia']
  const statuses = ['all', 'active', 'inactive', 'out_of_stock']

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Activo'
      case 'inactive': return 'Inactivo'
      case 'out_of_stock': return 'Sin Stock'
      default: return 'Todos'
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
      case 'inactive': return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
      case 'out_of_stock': return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
      default: return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300'
    }
  }

  const filteredProducts = mockProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.author.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || product.status === selectedStatus

    return matchesSearch && matchesCategory && matchesStatus
  })

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Administra el catálogo de productos de la tienda</p>
          </div>
          <button className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors">
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-wrap items-center gap-4">
          {/* Search */}
          <div className="flex-1 min-w-64">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {categories.map(category => (
                <option key={category} value={category}>
                  {category === 'all' ? 'Todas las categorías' : category}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              {statuses.map(status => (
                <option key={status} value={status}>
                  {getStatusLabel(status)}
                </option>
              ))}
            </select>
          </div>

          <button className="flex items-center px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-900 dark:text-gray-100">
            <AdjustmentsHorizontalIcon className="h-5 w-5 mr-2" />
            Más filtros
          </button>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredProducts.length} de {mockProducts.length} productos
        </p>
      </div>

      {/* Products Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{product.name}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{product.author}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.category}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">${product.price}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.stock === 0 ? 'text-red-600 dark:text-red-400' : 
                      product.stock < 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {product.stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(product.status)}`}>
                      {getStatusLabel(product.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300">
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        <TrashIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No se encontraron productos con los filtros seleccionados.</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-6 flex items-center justify-between">
        <div className="text-sm text-gray-500 dark:text-gray-400">
          Mostrando 1 a {filteredProducts.length} de {mockProducts.length} resultados
        </div>
        <div className="flex space-x-1">
          <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-900 dark:text-gray-100" disabled>
            Anterior
          </button>
          <button className="px-3 py-2 text-sm bg-blue-600 dark:bg-blue-700 text-white rounded-md">
            1
          </button>
          <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 text-gray-900 dark:text-gray-100" disabled>
            Siguiente
          </button>
        </div>
      </div>
    </div>
  )
}