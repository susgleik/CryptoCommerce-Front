'use client'
import { useState, useEffect  } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { adminAuthService } from '@/app/lib/services/adminAuthService'
import type { AdminUser } from '@/app/lib/types/admin'
import { ThemeToggle } from '@/app/components/common/ThemeToggle'
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

interface AdminNavProps {
    user: AdminUser,
    permissions: string[]
}

interface MenuItem {
  name: string
  icon: React.ComponentType<{ className?: string }>
  href?: string
  subItems?: MenuItem[]
}

export default function AdminNav({ user, permissions}: AdminNavProps) {
    const pathname = usePathname()
    const router = useRouter()
    const [expandedSections, setExpandedSections] = useState<string[]>([])

    const navigation: MenuItem[] = [
        {
            name: 'Home',
            icon: HomeIcon,
            href: '/admin'
        },
        {
            name: 'Database',
            icon: CircleStackIcon,
            subItems: [
                { name: 'Productos', icon: HomeIcon, href: '/admin/database/products' },
                { name: 'Categorías', icon: HomeIcon, href: '/admin/database/categories' },
                { name: 'Usuarios', icon: HomeIcon, href: '/admin/database/users' }
            ]
        },
        {
            name: 'Analytics',
            icon: ChartBarIcon,
            subItems: [
                { name: 'Ventas', icon: HomeIcon, href: '/admin/analytics/sales' },
                { name: 'Usuarios', icon: HomeIcon, href: '/admin/analytics/users' },
                { name: 'Productos', icon: HomeIcon, href: '/admin/analytics/products' }
            ]
        },
        {
            name: 'Settings',
            icon: CogIcon,
            subItems: [
                { name: 'General', icon: HomeIcon, href: '/admin/settings/general' },
                { name: 'Permisos', icon: HomeIcon, href: '/admin/settings/permissions' },
                { name: 'Integraciones', icon: HomeIcon, href: '/admin/settings/integrations' }
            ]
        },
        {
            name: 'Support',
            icon: QuestionMarkCircleIcon,
            href: '/admin/support'

        }
    ]


    // cheack if route is active
    const isRouteActive = (href?: string, subItems?: MenuItem[]) => {
        if ( href ){
            // exact match like /admin
            if ( href === '/admin'){
                return pathname === '/admin' || pathname === '/admin/dashboard'
            }
            // for other routes 
            return pathname.startsWith(href)
        }

        if (subItems) {
            return subItems.some(subItem => subItem.href && pathname.startsWith(subItem.href))
        }

        return false
    }

    // cheack if sub route is active
    const isSubRouteActive = (href?: string) => {
        if (!href) return false
        return pathname === href || pathname.startsWith(href + '/')
    }

    // Auto expand sections in the actual route
    useEffect(() =>{
        const sectionsToExpand: string[] = []

        navigation.forEach(item => {
            if (item.subItems && isRouteActive(item.href, item.subItems)){
                sectionsToExpand.push(item.name.toLocaleLowerCase())
            }
        })

        setExpandedSections(sectionsToExpand)
    }, [pathname])

    const toggleSection = (sectionName: string) => {
        setExpandedSections(prev =>
            prev.includes(sectionName)
            ? prev.filter(s => s !== sectionName)
            : [...prev, sectionName]
        )
    }

    const handleLogout = async () => {
        try {
            await adminAuthService.logout()
            router.push('/admin/login')
        } catch (error) {
            console.error('Error en logout:', error)
            router.push('/admin/login')
        }
    }

    const getRoleDisplayName = (userType: string) => {
        switch (userType){
            case 'admin':
                return 'Administrador'
            case 'store_staff':
                return 'staff de Tienda'
            default:
                return userType
        }
    }

    const hasPermission = (permission: string) => {
        return adminAuthService.hasPermission(permission, permissions)
    }

     return (
    <div className="flex flex-col w-64 bg-gray-900 dark:bg-gray-950">
      {/* Header */}
      <div className="flex items-center justify-between h-16 px-4 bg-gray-800 dark:bg-gray-900">
        <div className="flex items-center">
          <h1 className="text-white text-lg font-bold">MyDROPs v1.0</h1>
        </div>
        <ThemeToggle/>
      </div>

      {/* User Info */}
      <div className="px-4 py-3 bg-gray-800 dark:bg-gray-900 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center">
          <div className="flex-shrink-0">
            <div className="w-8 h-8 bg-indigo-500 dark:bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white font-medium text-sm">
                {user.username.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div className="ml-3">
            <p className="text-sm font-medium text-white">Welcome, {user.username}</p>
            <p className="text-xs text-gray-300 dark:text-gray-400">{getRoleDisplayName(user.user_type)}</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          // Verificar permisos para Database
          if (item.name === 'Database' && !hasPermission('manage_books')) {
            return null
          }

          const isActive = isRouteActive(item.href, item.subItems)
          
          return (
            <div key={item.name}>
              {item.subItems ? (
                <div>
                  <button
                    onClick={() => toggleSection(item.name.toLowerCase())}
                    className={`${
                      isActive
                        ? 'bg-gray-800 dark:bg-gray-800 text-white'
                        : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
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
                          className={`${
                            isSubRouteActive(subItem.href)
                              ? 'bg-gray-700 dark:bg-gray-800 text-white'
                              : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
                          } group flex items-center px-9 py-2 text-sm font-medium rounded-md transition-colors`}
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
                  className={`${
                    isActive
                      ? 'bg-gray-800 dark:bg-gray-800 text-white'
                      : 'text-gray-300 dark:text-gray-400 hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white'
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
      <div className="p-4 border-t border-gray-700 dark:border-gray-800">
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-2 py-2 text-sm font-medium text-gray-300 dark:text-gray-400 rounded-md hover:bg-gray-700 dark:hover:bg-gray-800 hover:text-white transition-colors"
        >
          <ArrowRightOnRectangleIcon className="mr-3 h-5 w-5" />
          Cerrar Sesión
        </button>
      </div>
    </div>
  )

}