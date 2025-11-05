'use client'

import { useState, useEffect } from 'react'
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  MagnifyingGlassIcon,
  ExclamationTriangleIcon,
  XMarkIcon,
  ArrowsRightLeftIcon
} from '@heroicons/react/24/outline'
import { Category, CategoryFilters, CategoryModalState } from '@/app/lib/types/category'
import { categoryService } from '@/app/lib/services/categoryService'
import CategoryFormModal from './CategoryFormModal'
import DeleteConfirmModal from './DeleteConfirmModal'
import Image from 'next/image'

export default function CategoriesDatabase() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filters, setFilters] = useState<CategoryFilters>({
    search: '',
    status: 'all',
    parent_category: 'all'
  })
  const [modalState, setModalState] = useState<CategoryModalState>({
    isOpen: false,
    mode: 'create'
  })

  useEffect(() => {
    loadCategories()
  }, [])

  const loadCategories = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await categoryService.getCategoriesAdmin()
      setCategories(data)
    } catch (err) {
      console.error('Error loading categories:', err)
      setError('Error al cargar las categorías')
    } finally {
      setLoading(false)
    }
  }

  const handleCreateCategory = () => {
    setModalState({
      isOpen: true,
      mode: 'create'
    })
  }

  const handleEditCategory = (category: Category) => {
    setModalState({
      isOpen: true,
      mode: 'edit',
      category
    })
  }

  const handleDeleteCategory = (category: Category) => {
    setModalState({
      isOpen: true,
      mode: 'delete',
      category
    })
  }

  const handleMoveCategory = (category: Category) => {
    setModalState({
      isOpen: true,
      mode: 'move',
      category
    })
  }

  const handleCloseModal = () => {
    setModalState({
      isOpen: false,
      mode: 'create'
    })
  }

  const handleCategorySaved = () => {
    loadCategories()
    handleCloseModal()
  }

  const handleCategoryDeleted = () => {
    loadCategories()
    handleCloseModal()
  }

  const filteredCategories = categories.filter(category => {
    const matchesSearch = category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                         category.description.toLowerCase().includes(filters.search.toLowerCase())

    const matchesStatus = filters.status === 'all' ||
      (filters.status === 'active' && category.is_active) ||
      (filters.status === 'inactive' && !category.is_active)

    const matchesParent = filters.parent_category === 'all' ||
      (filters.parent_category === 'root' && category.parent_category_id === null) ||
      (filters.parent_category === 'subcategory' && category.parent_category_id !== null)

    return matchesSearch && matchesStatus && matchesParent
  })

  const getCategoryParentName = (parentId: number | null): string => {
    if (parentId === null) return 'Raíz'
    const parent = categories.find(c => c.category_id === parentId)
    return parent?.name || 'Desconocida'
  }

  const isValidImageUrl = (url: string | null): boolean => {
    if (!url || url.trim() === '' || url === 'string') return false
    try {
      new URL(url)
      return true
    } catch {
      return false
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400"></div>
          <span className="ml-3 text-gray-600 dark:text-gray-400">Cargando categorías...</span>
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
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Gestión de Categorías</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Administra las categorías de productos de la tienda</p>
          </div>
          <button
            onClick={handleCreateCategory}
            className="bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center transition-colors"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Nueva Categoría
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-1">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 dark:text-gray-500" />
              <input
                type="text"
                placeholder="Buscar categorías..."
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
              onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activas</option>
              <option value="inactive">Inactivas</option>
            </select>
          </div>

          {/* Parent Category Filter */}
          <div>
            <select
              value={filters.parent_category}
              onChange={(e) => setFilters(prev => ({ ...prev, parent_category: e.target.value }))}
              className="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:ring-blue-500 focus:border-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
            >
              <option value="all">Todas las categorías</option>
              <option value="root">Solo raíz</option>
              <option value="subcategory">Solo subcategorías</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Info */}
      <div className="mb-4 flex justify-between items-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Mostrando {filteredCategories.length} de {categories.length} categorías
        </p>
        <button
          onClick={loadCategories}
          className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
        >
          Actualizar
        </button>
      </div>

      {/* Categories Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-900">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Categoría Padre
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
              {filteredCategories.map((category) => (
                <tr key={category.category_id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-12 w-12">
                        {isValidImageUrl(category.category_image) ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={category.category_image!}
                            alt={category.name}
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
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {category.name}
                        </div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">ID: {category.category_id}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-100 max-w-xs truncate block">
                      {category.description || 'Sin descripción'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {getCategoryParentName(category.parent_category_id)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      categoryService.getStatusColor(category)
                    }`}>
                      {categoryService.getStatusLabel(category)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditCategory(category)}
                        className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                        title="Editar categoría"
                      >
                        <PencilIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleMoveCategory(category)}
                        className="text-purple-600 dark:text-purple-400 hover:text-purple-900 dark:hover:text-purple-300"
                        title="Mover categoría"
                      >
                        <ArrowsRightLeftIcon className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category)}
                        className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300"
                        title="Eliminar categoría"
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

        {filteredCategories.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-500 dark:text-gray-400">
              {categories.length === 0 ? (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No hay categorías</h3>
                  <p className="mb-4">Comienza creando tu primera categoría.</p>
                  <button
                    onClick={handleCreateCategory}
                    className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-600 text-white px-4 py-2 rounded-md"
                  >
                    Crear Categoría
                  </button>
                </div>
              ) : (
                <div>
                  <h3 className="text-lg font-medium mb-2 text-gray-900 dark:text-white">No se encontraron categorías</h3>
                  <p>Ajusta los filtros para ver más resultados.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {modalState.isOpen && (modalState.mode === 'create' || modalState.mode === 'edit' || modalState.mode === 'move') && (
        <CategoryFormModal
          isOpen={modalState.isOpen}
          mode={modalState.mode}
          category={modalState.category}
          categories={categories}
          onClose={handleCloseModal}
          onSave={handleCategorySaved}
        />
      )}

      {modalState.isOpen && modalState.mode === 'delete' && modalState.category && (
        <DeleteConfirmModal
          isOpen={modalState.isOpen}
          item={modalState.category}
          itemType="category"
          onClose={handleCloseModal}
          onConfirm={handleCategoryDeleted}
        />
      )}
    </div>
  )
}
