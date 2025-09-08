'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthService } from '@/app/lib/services/adminAuthService'
import type { AdminUser } from '@/app/lib/types/admin'
import {
  HomeIcon,
  CircleStackIcon,
  ChartBarIcon,
  CogIcon,
  QuestionMarkCircleIcon,
  ArrowRightOnRectangleIcon,
  ChevronDownIcon,
  ChevronRightIcon
} from '@heroicons/react/24/outline'

interface AdminLayoutProps {
  children: React.ReactNode
  user: AdminUser
  permissions: string[]
}

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  current?: boolean
  subItems?: MenuItem[]
}

export default function AdminLayout({ children, user, permissions }: AdminLayoutProps) {
  const [activeSection, setActiveSection] = useState('home')
  const [expandedSections, setExpandedSections] = useState<string[]>([])
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await adminAuthService.logout()
      router.push('/admin/login')
    } catch (error) {
      console.error('Error en logout:', error)
      router.push('/admin/login')
    }
  }

  const toggleSection = (sectionName: string) => {
    setExpandedSections(prev => 
      prev.includes(sectionName) 
        ? prev.filter(s => s !== sectionName)
        : [...prev, sectionName]
    )
  }

  const navigation: MenuItem[] = [
    {
      name: 'Home',
      icon: HomeIcon,
      href: '/admin',
      current: activeSection === 'home'
    },
    {
      name: 'Database',
      icon: CircleStackIcon, // Corregido
      current: activeSection === 'database',
      subItems: [
        { name: 'Productos', icon: HomeIcon, href: '/admin/database/products' },
        { name: 'Categorías', icon: HomeIcon, href: '/admin/database/categories' },
        { name: 'Usuarios', icon: HomeIcon, href: '/admin/database/users' }
      ]
    },
    {
      name: 'Analytics',
      icon: ChartBarIcon,
      current: activeSection === 'analytics',
      subItems: [
        { name: 'Ventas', icon: HomeIcon, href: '/admin/analytics/sales' },
        { name: 'Usuarios', icon: HomeIcon, href: '/admin/analytics/users' },
        { name: 'Productos', icon: HomeIcon, href: '/admin/analytics/products' }
      ]
    },
    {
      name: 'Settings',
      icon: CogIcon,
      current: activeSection === 'settings',
      subItems: [
        { name: 'General', icon: HomeIcon, href: '/admin/settings/general' },
        { name: 'Permisos', icon: HomeIcon, href: '/admin/settings/permissions' },
        { name: 'Integraciones', icon: HomeIcon, href: '/admin/settings/integrations' }
      ]
    },
    {
      name: 'Support',
      icon: QuestionMarkCircleIcon,
      href: '/admin/support',
      current: activeSection === 'support'
    }
  ]

  const getRoleDisplayName = (userType: string) => {
    switch (userType) {
      case 'admin':
        return 'Administrador'
      case 'store_staff':
        return 'Staff de Tienda'
      default:
        return userType
    }
  }

  // Función para verificar permisos (usar la variable permissions)
  const hasPermission = (permission: string) => {
    return adminAuthService.hasPermission(permission, permissions)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className="flex flex-col w-64 bg-gray-900">
          {/* Header */}
          <div className="flex items-center justify-between h-16 px-4 bg-gray-800">
            <div className="flex items-center">
              <h1 className="text-white text-lg font-bold">MyDROPs v1.0</h1>
            </div>
          </div>

          {/* User Info */}
          <div className="px-4 py-3 bg-gray-800 border-b border-gray-700">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-indigo-500 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">
                    {user.username.charAt(0).toUpperCase()}
                  </span>
                </div>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">Welcome, {user.username}</p>
                <p className="text-xs text-gray-300">{getRoleDisplayName(user.user_type)}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
            {navigation.map((item) => {
              // Verificar permisos para mostrar/ocultar elementos del menú
              if (item.name === 'Database' && !hasPermission('manage_books')) {
                return null // No mostrar si no tiene permisos
              }
              
              return (
                <div key={item.name}>
                  {item.subItems ? (
                    <div>
                      <button
                        onClick={() => {
                          toggleSection(item.name.toLowerCase())
                          setActiveSection(item.name.toLowerCase())
                        }}
                        className={`${
                          item.current
                            ? 'bg-gray-800 text-white'
                            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                        } group flex w-full items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                      >
                        <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                        {item.name}
                        {expandedSections.includes(item.name.toLowerCase()) ? (
                          <ChevronDownIcon className="ml-auto h-4 w-4" />
                        ) : (
                          <ChevronRightIcon className="ml-auto h-4 w-4" />
                        )}
                      </button>
                      {expandedSections.includes(item.name.toLowerCase()) && (
                        <div className="mt-1 space-y-1">
                          {item.subItems.map((subItem) => (
                            <a
                              key={subItem.name}
                              href={subItem.href}
                              className="text-gray-300 hover:bg-gray-700 hover:text-white group flex items-center px-9 py-2 text-sm font-medium rounded-md transition-colors"
                            >
                              {subItem.name}
                            </a>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <a
                      href={item.href}
                      onClick={() => setActiveSection(item.name.toLowerCase())}
                      className={`${
                        item.current
                          ? 'bg-gray-800 text-white'
                          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                      } group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-colors`}
                    >
                      <item.icon className="mr-3 h-5 w-5 flex-shrink-0" />
                      {item.name}
                    </a>
                  )}
                </div>
              )
            })}
          </nav>

          {/* Logout Button */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 rounded-md hover:bg-gray-700 hover:text-white transition-colors"
            >
              <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" /> {/* Corregido */}
              Cerrar Sesión
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}