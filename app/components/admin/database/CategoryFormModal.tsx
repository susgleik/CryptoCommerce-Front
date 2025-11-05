'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { Category, CreateCategoryDTO, CategoryFormErrors } from '@/app/lib/types/category'
import { categoryService } from '@/app/lib/services/categoryService'

interface CategoryFormModalProps {
  isOpen: boolean
  mode: 'create' | 'edit' | 'move'
  category?: Category
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

export default function CategoryFormModal({
  isOpen,
  mode,
  category,
  categories,
  onClose,
  onSave
}: CategoryFormModalProps) {
  const [formData, setFormData] = useState<CreateCategoryDTO>({
    name: '',
    description: '',
    category_image: '',
    parent_category_id: null,
    is_active: true
  })
  const [errors, setErrors] = useState<CategoryFormErrors>({})
  const [loading, setLoading] = useState(false)
  const [moveToParentId, setMoveToParentId] = useState<number | null>(null)

  useEffect(() => {
    if (mode === 'edit' && category) {
      setFormData({
        name: category.name,
        description: category.description,
        category_image: category.category_image || '',
        parent_category_id: category.parent_category_id,
        is_active: category.is_active
      })
    } else if (mode === 'move' && category) {
      setMoveToParentId(category.parent_category_id)
    } else {
      setFormData({
        name: '',
        description: '',
        category_image: '',
        parent_category_id: null,
        is_active: true
      })
    }
    setErrors({})
  }, [mode, category, isOpen])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target

    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              name === 'parent_category_id' ? (value === '' ? null : parseInt(value)) :
              value
    }))

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = (): boolean => {
    const validationErrors = categoryService.validateCategoryData(formData)

    if (validationErrors.length > 0) {
      setErrors({ general: validationErrors[0] })
      return false
    }

    // Validar que no se elija a sí misma como padre
    if (mode === 'edit' && category && formData.parent_category_id === category.category_id) {
      setErrors({ parent_category_id: 'Una categoría no puede ser su propia categoría padre' })
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (mode === 'move') {
      await handleMove()
      return
    }

    if (!validateForm()) return

    setLoading(true)
    setErrors({})

    try {
      if (mode === 'create') {
        await categoryService.createCategory(formData)
      } else if (mode === 'edit' && category) {
        await categoryService.updateCategory(category.category_id, formData)
      }
      onSave()
    } catch (error) {
      console.error('Error saving category:', error)
      setErrors({
        general: error instanceof Error ? error.message : 'Error al guardar la categoría'
      })
    } finally {
      setLoading(false)
    }
  }

  const handleMove = async () => {
    if (!category) return

    setLoading(true)
    setErrors({})

    try {
      await categoryService.moveCategory(category.category_id, moveToParentId)
      onSave()
    } catch (error) {
      console.error('Error moving category:', error)
      setErrors({
        general: error instanceof Error ? error.message : 'Error al mover la categoría'
      })
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  // Filtrar categorías que pueden ser padre (excluyendo la actual y sus subcategorías en modo edit)
  const availableParentCategories = categories.filter(cat => {
    if (mode === 'edit' && category) {
      // No puede ser su propia categoría
      if (cat.category_id === category.category_id) return false
      // No puede ser una de sus subcategorías
      // Aquí podrías implementar lógica más compleja para evitar ciclos
    }
    if (mode === 'move' && category) {
      if (cat.category_id === category.category_id) return false
    }
    return true
  })

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Overlay */}
        <div
          className="fixed inset-0 transition-opacity bg-gray-500 dark:bg-gray-900 bg-opacity-75 dark:bg-opacity-75"
          onClick={onClose}
        ></div>

        {/* Modal */}
        <div className="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full">
          {/* Header */}
          <div className="bg-white dark:bg-gray-800 px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {mode === 'create' && 'Crear Nueva Categoría'}
                {mode === 'edit' && 'Editar Categoría'}
                {mode === 'move' && 'Mover Categoría'}
              </h3>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="bg-white dark:bg-gray-800 px-6 py-4 space-y-4">
              {/* Error General */}
              {errors.general && (
                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md p-3">
                  <p className="text-sm text-red-600 dark:text-red-400">{errors.general}</p>
                </div>
              )}

              {mode !== 'move' ? (
                <>
                  {/* Nombre */}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Nombre <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                      required
                    />
                    {errors.name && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.name}</p>}
                  </div>

                  {/* Descripción */}
                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Descripción
                    </label>
                    <textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={3}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* URL de Imagen */}
                  <div>
                    <label htmlFor="category_image" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      URL de Imagen
                    </label>
                    <input
                      type="url"
                      id="category_image"
                      name="category_image"
                      value={formData.category_image}
                      onChange={handleChange}
                      placeholder="https://ejemplo.com/imagen.jpg"
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    />
                  </div>

                  {/* Categoría Padre */}
                  <div>
                    <label htmlFor="parent_category_id" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Categoría Padre
                    </label>
                    <select
                      id="parent_category_id"
                      name="parent_category_id"
                      value={formData.parent_category_id || ''}
                      onChange={handleChange}
                      className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                    >
                      <option value="">Sin categoría padre (Raíz)</option>
                      {availableParentCategories.map(cat => (
                        <option key={cat.category_id} value={cat.category_id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                    {errors.parent_category_id && (
                      <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.parent_category_id}</p>
                    )}
                  </div>

                  {/* Estado Activo */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        name="is_active"
                        checked={formData.is_active}
                        onChange={handleChange}
                        className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500 dark:bg-gray-700"
                      />
                      <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">Categoría activa</span>
                    </label>
                  </div>
                </>
              ) : (
                /* Modo mover categoría */
                <div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                    Estás moviendo la categoría: <strong>{category?.name}</strong>
                  </p>
                  <label htmlFor="move_parent" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Nueva Categoría Padre
                  </label>
                  <select
                    id="move_parent"
                    value={moveToParentId || ''}
                    onChange={(e) => setMoveToParentId(e.target.value === '' ? null : parseInt(e.target.value))}
                    className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value="">Sin categoría padre (Raíz)</option>
                    {availableParentCategories.map(cat => (
                      <option key={cat.category_id} value={cat.category_id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 flex justify-end space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={loading}
              >
                {loading ? 'Guardando...' : mode === 'move' ? 'Mover' : 'Guardar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
