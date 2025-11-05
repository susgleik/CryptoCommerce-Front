'use client'

import { XMarkIcon } from '@heroicons/react/24/outline'
import { User } from '@/app/lib/types/user'
import { userService } from '@/app/lib/services/userService'

interface UserDetailModalProps {
  isOpen: boolean
  user: User
  onClose: () => void
}

export default function UserDetailModal({ isOpen, user, onClose }: UserDetailModalProps) {
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
              Detalles del Usuario
            </h3>
            <button
              onClick={onClose}
              className="text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* User Content */}
          <div className="space-y-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center space-x-4 pb-6 border-b border-gray-200 dark:border-gray-700">
              <div className="flex-shrink-0 h-20 w-20">
                <div className="h-20 w-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-2xl">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="flex-1">
                <h4 className="text-2xl font-bold text-gray-900 dark:text-white">
                  {user.username}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{user.email}</p>
                <div className="flex items-center space-x-2 mt-2">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    userService.getUserTypeColor(user.user_type)
                  }`}>
                    {userService.getUserTypeLabel(user.user_type)}
                  </span>
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    userService.getStatusColor(user.is_active)
                  }`}>
                    {userService.getStatusLabel(user.is_active)}
                  </span>
                </div>
              </div>
            </div>

            {/* User Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* ID */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  ID de Usuario
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.id}</p>
              </div>

              {/* Username */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Nombre de Usuario
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.username}</p>
              </div>

              {/* Email */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Correo Electrónico
                </label>
                <p className="text-gray-900 dark:text-white font-medium">{user.email}</p>
              </div>

              {/* User Type */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Tipo de Usuario
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userService.getUserTypeLabel(user.user_type)}
                </p>
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Estado
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userService.getStatusLabel(user.is_active)}
                </p>
              </div>

              {/* Created At */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Fecha de Creación
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userService.formatDate(user.created_at)}
                </p>
              </div>

              {/* Updated At */}
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Última Actualización
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userService.formatDate(user.updated_at)}
                </p>
              </div>

              {/* Last Login */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">
                  Último Inicio de Sesión
                </label>
                <p className="text-gray-900 dark:text-white font-medium">
                  {userService.formatDate(user.last_login)}
                </p>
              </div>
            </div>

            {/* Additional Info Box */}
            <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <h5 className="text-sm font-medium text-blue-900 dark:text-blue-300 mb-2">
                Información del Sistema
              </h5>
              <div className="space-y-1 text-sm text-blue-800 dark:text-blue-400">
                <p>• Este usuario fue creado el {userService.formatDateShort(user.created_at)}</p>
                <p>• Última modificación: {userService.formatDateShort(user.updated_at)}</p>
                {user.last_login ? (
                  <p>• Última sesión activa: {userService.formatDate(user.last_login)}</p>
                ) : (
                  <p>• Este usuario nunca ha iniciado sesión</p>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end pt-6 border-t border-gray-200 dark:border-gray-700 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
