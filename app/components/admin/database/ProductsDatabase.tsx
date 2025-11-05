'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Product, ProductFilters, ProductModalState } from '@/app/lib/types/product'
import { productService } from '@/app/lib/services/productService'
import ProductFormModal from './ProductFormModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import Image from 'next/image'


export default function ProductsDatabase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    status: 'all',
    is_featured: null,
    price_min: null,
    price_max: null
  })
  const [modalState, setModalState] = useState<ProductModalState>({
    isOpen: false,
    mode: 'create'
  })

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await productService.getProductsAdmin()
      setProducts(data)
    } catch (err) {
      console.error('Error loading products:', err)
      setError('Error al cargar los productos')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProduct = () => {
    setModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleEditProduct = (product: Product) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      product
    })
  }

  const handleDeleteProduct = (product: Product) => {
    setModalState({
      isOpen: true,
      mode: 'delete',
      product
    })
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create'
    })
  }

  const handleProductSaved = () => {
    loadProducts()
    handleCloseModal()
  }

  const handleProductDeleted = () => {
    loadProducts()
    handleCloseModal()
  }

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.sku.toLowerCase().includes(filters.search.toLowerCase()) ||
                         product.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'active' && product.is_active && product.online_stock > 0) ||
      (filters.status === 'inactive' && !product.is_active) ||
      (filters.status === 'out_of_stock' && product.is_active && product.online_stock === 0)

    const matchesFeatured = filters.is_featured === null || product.is_featured === filters.is_featured

    const matchesCategory = filters.category === 'all' ||
      (product.categories && product.categories.some(cat => cat.name === filters.category))

    const matchesPrice = (filters.price_min === null || product.price >= filters.price_min) &&
                        (filters.price_max === null || product.price <= filters.price_max)

    return matchesSearch && matchesStatus && matchesFeatured && matchesCategory && matchesPrice
  })

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando productos...</span>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Productos</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Administra el catálogo de productos de la tienda</p>
          </div>
          <button 
            onClick={handleCreateProduct}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-4 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 dark:text-red-500 mr-2" />
          <span className="text-red-700 dark:text-red-400">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 dark:text-red-500 hover:text-red-600 dark:hover:text-red-300"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar productos por nombre, SKU o descripción..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as 'all' | 'active' | 'inactive' | 'out_of_stock' }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="out_of_stock">Sin Stock</option>
            </select>
          </div>

          {/* Category Filter */}
          <div>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todas las categorías</option>
              {[...new Set(products.flatMap(p => p.categories?.map(c => c.name) || []))].map(categoryName => (
                <option key={categoryName} value={categoryName}>{categoryName}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Additional Filters Row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <div>
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={filters.is_featured === true}
                onChange={(e) => setFilters(prev => ({ 
                  ...prev, 
                  is_featured: e.target.checked ? true : null 
                }))}
                className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
              />
              <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Solo productos destacados</span>
            </label>
          </div>

          <div>
            <input
              type="number"
              placeholder="Precio mínimo"
              value={filters.price_min || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                price_min: e.target.value ? parseFloat(e.target.value) : null 
              }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>

          <div>
            <input
              type="number"
              placeholder="Precio máximo"
              value={filters.price_max || ''}
              onChange={(e) => setFilters(prev => ({ 
                ...prev, 
                price_max: e.target.value ? parseFloat(e.target.value) : null 
              }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
        <button 
          onClick={loadProducts}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Actualizar
        </button>
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
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categorías
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.product_image ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.product_image}
                            alt={product.name}
                            width={48}
                            height={48}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 dark:text-gray-500 text-xs">IMG</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 dark:text-white max-w-xs truncate">
                          {product.name}
                          {product.is_featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-400">
                              Destacado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {productService.formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.online_stock === 0 ? 'text-red-600 dark:text-red-400' : 
                      product.online_stock < 10 ? 'text-yellow-600 dark:text-yellow-400' : 'text-green-600 dark:text-green-400'
                    }`}>
                      {product.online_stock}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      productService.getStatusColor(product)
                    }`}>
                      {productService.getStatusLabel(product)}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1 max-w-xs">
                      {product.categories && product.categories.length > 0 ? (
                        product.categories.map((category, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400"
                          >
                            {category.name}
                          </span>
                        ))
                      ) : (
                        <span className="text-xs text-gray-500 dark:text-gray-400 italic">Sin categoría</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Editar producto"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Eliminar producto"
                      >
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
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {products.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No hay productos</h3>
                  <p className="mb-4">Comienza creando tu primer producto.</p>
                  <button 
                    onClick={handleCreateProduct}
                    className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Crear Producto
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No se encontraron productos</h3>
                  <p>Ajusta los filtros para ver más resultados.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.isOpen && modalState.mode !== 'delete' && (
        <ProductFormModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          product={modalState.product}
          onClose={handleCloseModal}
          onSave={handleProductSaved}
        />
      )}

      {modalState.isOpen && modalState.mode === 'delete' && modalState.product && (
        <DeleteConfirmModal
          isOpen={modalState.isOpen}
          item={modalState.product}
          itemType="product"
          onClose={handleCloseModal}
          onConfirm={handleProductDeleted}
        />
      )}
    </div>
  )
}