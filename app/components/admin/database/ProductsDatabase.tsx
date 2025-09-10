'use client'

import { useState, useEffect } from 'react'
import { 
  PlusIcon, 
  PencilIcon, 
  TrashIcon,
  MagnifyingGlassIcon,
  //AdjustmentsHorizontalIcon,
  ExclamationTriangleIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'
import { Product, ProductFilters, ProductModalState } from '@/app/lib/types/product'
import { productService } from '@/app/lib/services/productService'
import ProductFormModal from './ProductFormModal'
import DeleteConfirmModal from './DeleteConfirmModal'

export default function ProductsDatabase() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<ProductFilters>({
    search: '',
    category: 'all',
    status: 'all',
    is_featured: null,
    product_type: 'all',
    price_min: null,
    price_max: null
  })
  const [modalState, setModalState] = useState<ProductModalState>({
    isOpen: false,
    mode: 'create'
  })

  // Load products on component mount
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
    loadProducts() // Reload products after save
    handleCloseModal()
  }

  const handleProductDeleted = () => {
    loadProducts() // Reload products after delete
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

    const matchesProductType = filters.product_type === 'all' || product.product_type === filters.product_type

    const matchesPrice = (filters.price_min === null || product.price >= filters.price_min) &&
                        (filters.price_max === null || product.price <= filters.price_max)

    return matchesSearch && matchesStatus && matchesFeatured && matchesProductType && matchesPrice
  })

  const getUniqueProductTypes = () => {
    const types = [...new Set(products.map(p => p.product_type))]
    return types.filter(type => type && type.trim() !== '')
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-600">Cargando productos...</span>
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
            <h1 className="text-3xl font-bold text-gray-900">Gestión de Productos</h1>
            <p className="text-gray-600 mt-2">Administra el catálogo de productos de la tienda</p>
          </div>
          <button 
            onClick={handleCreateProduct}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nuevo Producto
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-md p-4 flex items-center">
          <ExclamationTriangleIcon className="h-5 w-5 text-red-400 mr-2" />
          <span className="text-red-700">{error}</span>
          <button 
            onClick={() => setError('')}
            className="ml-auto text-red-400 hover:text-red-600"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search */}
          <div className="lg:col-span-2">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos por nombre, SKU o descripción..."
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div>
            <select
              value={filters.status}
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activo</option>
              <option value="inactive">Inactivo</option>
              <option value="out_of_stock">Sin Stock</option>
            </select>
          </div>

          {/* Product Type Filter */}
          <div>
            <select
              value={filters.product_type}
              onChange={(e) => setFilters(prev => ({ ...prev, product_type: e.target.value }))}
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los tipos</option>
              {getUniqueProductTypes().map(type => (
                <option key={type} value={type}>{type}</option>
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
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Solo productos destacados</span>
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
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
              className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600">
          Mostrando {filteredProducts.length} de {products.length} productos
        </p>
        <button 
          onClick={loadProducts}
          className="text-sm text-blue-600 hover:text-blue-800"
        >
          Actualizar
        </button>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Producto
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Precio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Stock
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredProducts.map((product) => (
                <tr key={product.product_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {product.product_image ? (
                          <img
                            className="h-12 w-12 rounded-lg object-cover"
                            src={product.product_image}
                            alt={product.name}
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <div className="h-12 w-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400 text-xs">IMG</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900 max-w-xs truncate">
                          {product.name}
                          {product.is_featured && (
                            <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                              Destacado
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-gray-500">SKU: {product.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm font-medium text-gray-900">
                      {productService.formatPrice(product.price)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium ${
                      product.online_stock === 0 ? 'text-red-600' : 
                      product.online_stock < 10 ? 'text-yellow-600' : 'text-green-600'
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
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900">{product.product_type}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEditProduct(product)}
                        className="text-blue-600 hover:text-blue-900"
                        title="Editar producto"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(product)}
                        className="text-red-600 hover:text-red-900"
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
            <div className="text-gray-500">
              {products.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2">No hay productos</h3>
                  <p className="mb-4">Comienza creando tu primer producto.</p>
                  <button 
                    onClick={handleCreateProduct}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Crear Producto
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2">No se encontraron productos</h3>
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
          product={modalState.product}
          onClose={handleCloseModal}
          onConfirm={handleProductDeleted}
        />
      )}
    </div>
  )
}