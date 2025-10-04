'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Product, CreateProductDTO, UpdateProductDTO, ProductFormErrors } from '@/app/lib/types/product'
import { productService } from '@/app/lib/services/productService'

interface ProductFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit' | 'view'
  product?: Product
  onClose: () => void
  onSave: () => void
}

export default function ProductFormModal({ isOpen, mode, product, onClose, onSave }: ProductFormModalProps) {
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    description: '',
    online_stock: '',
    sku: '',
    release_date: '',
    is_featured: false,
    is_active: true,
    product_type: 'general',
    product_image: '',
    supplier_id: ''
  })
  const [errors, setErrors] = useState<ProductFormErrors>({})
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && product) {
        setFormData({
          name: product.name,
          price: product.price.toString(),
          description: product.description,
          online_stock: product.online_stock.toString(),
          sku: product.sku,
          release_date: product.release_date.split('T')[0],
          is_featured: product.is_featured,
          is_active: product.is_active,
          product_type: product.product_type,
          product_image: product.product_image || '',
          supplier_id: product.supplier_id?.toString() || ''
        })
      } else {
        setFormData({
          name: '',
          price: '',
          description: '',
          online_stock: '',
          sku: '',
          release_date: new Date().toISOString().split('T')[0],
          is_featured: false,
          is_active: true,
          product_type: 'general',
          product_image: '',
          supplier_id: ''
        })
      }
      setErrors({})
    }
  }, [isOpen, mode, product])

  const validateForm = (): boolean => {
    const newErrors: ProductFormErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = 'El nombre es requerido'
    }

    if (!formData.price || isNaN(parseFloat(formData.price)) || parseFloat(formData.price) < 0) {
      newErrors.price = 'El precio debe ser un número válido mayor o igual a 0'
    }

    if (!formData.online_stock || isNaN(parseInt(formData.online_stock)) || parseInt(formData.online_stock) < 0) {
      newErrors.online_stock = 'El stock debe ser un número válido mayor o igual a 0'
    }

    if (!formData.sku.trim()) {
      newErrors.sku = 'El SKU es requerido'
    }

    if (!formData.release_date) {
      newErrors.release_date = 'La fecha de lanzamiento es requerida'
    }

    if (formData.product_image && !isValidUrl(formData.product_image)) {
      newErrors.product_image = 'La URL de la imagen debe ser válida'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string)
      return true
    } catch (_) {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const productData = {
        name: formData.name.trim(),
        price: parseFloat(formData.price),
        description: formData.description.trim(),
        online_stock: parseInt(formData.online_stock),
        sku: formData.sku.trim(),
        release_date: new Date(formData.release_date).toISOString(),
        is_featured: formData.is_featured,
        is_active: formData.is_active,
        product_type: formData.product_type,
        product_image: formData.product_image.trim() || undefined,
        supplier_id: formData.supplier_id ? parseInt(formData.supplier_id) : null,
        category_ids: []
      }

      if (mode === 'create') {
        await productService.createProduct(productData as CreateProductDTO)
      } else if (mode === 'edit' && product) {
        await productService.updateProduct(product.product_id, productData as UpdateProductDTO)
      }

      onSave()
    } catch (error) {
      console.error('Error saving product:', error)
      setErrors({ general: 'Error al guardar el producto. Por favor intenta de nuevo.' })
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    
    if (errors[field as keyof ProductFormErrors]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        {/* Backdrop */}
        <div className="fixed inset-0 bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-80 transition-opacity" onClick={onClose}></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full sm:p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">
              {mode === 'create' ? 'Crear Nuevo Producto' : 'Editar Producto'}
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* General Error */}
          {errors.general && (
            <div className="mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
              <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Nombre del Producto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 ${
                    errors.name ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="Ingresa el nombre del producto"
                />
                {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
              </div>

              {/* Price */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Precio *
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.price}
                  onChange={(e) => handleInputChange('price', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.price ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0.00"
                />
                {errors.price && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.price}</p>}
              </div>

              {/* Stock */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Stock *
                </label>
                <input
                  type="number"
                  min="0"
                  value={formData.online_stock}
                  onChange={(e) => handleInputChange('online_stock', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.online_stock ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="0"
                />
                {errors.online_stock && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.online_stock}</p>}
              </div>

              {/* SKU */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  SKU *
                </label>
                <input
                  type="text"
                  value={formData.sku}
                  onChange={(e) => handleInputChange('sku', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.sku ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="SKU único del producto"
                />
                {errors.sku && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.sku}</p>}
              </div>

              {/* Release Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Fecha de Lanzamiento *
                </label>
                <input
                  type="date"
                  value={formData.release_date}
                  onChange={(e) => handleInputChange('release_date', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.release_date ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                />
                {errors.release_date && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.release_date}</p>}
              </div>

              {/* Product Type */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Tipo de Producto
                </label>
                <select
                  value={formData.product_type}
                  onChange={(e) => handleInputChange('product_type', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                >
                  <option value="general">General</option>
                  <option value="electronics">Electrónicos</option>
                  <option value="clothing">Ropa</option>
                  <option value="books">Libros</option>
                  <option value="sports">Deportes</option>
                  <option value="home">Hogar</option>
                </select>
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Descripción
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
                  placeholder="Descripción del producto..."
                />
              </div>

              {/* Product Image */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  URL de Imagen
                </label>
                <input
                  type="url"
                  value={formData.product_image}
                  onChange={(e) => handleInputChange('product_image', e.target.value)}
                  className={`w-full border rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 ${
                    errors.product_image ? 'border-red-300 dark:border-red-700' : 'border-gray-300 dark:border-gray-600'
                  }`}
                  placeholder="https://ejemplo.com/imagen.jpg"
                />
                {errors.product_image && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.product_image}</p>}
              </div>

              {/* Supplier ID */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  ID del Proveedor
                </label>
                <input
                  type="number"
                  value={formData.supplier_id}
                  onChange={(e) => handleInputChange('supplier_id', e.target.value)}
                  className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  placeholder="ID del proveedor (opcional)"
                />
              </div>

              {/* Checkboxes */}
              <div className="md:col-span-2 space-y-3">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => handleInputChange('is_active', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Producto activo</span>
                </label>

                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.is_featured}
                    onChange={(e) => handleInputChange('is_featured', e.target.checked)}
                    className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Producto destacado</span>
                </label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 dark:bg-blue-700 border border-transparent rounded-md hover:bg-blue-700 dark:hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Guardando...' : mode === 'create' ? 'Crear Producto' : 'Guardar Cambios'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}