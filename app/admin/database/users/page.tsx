'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthService } from '@/app/lib/services/adminAuthService'
import type { AdminUser } from '@/app/lib/types/admin'
import AdminLayout from '@/app/components/admin/AdminLayout'
import UsersDatabase from '@/app/components/admin/database/UsersDatabase'

export default function DatabaseUsersPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    checkAdminAuth()
  }, [])

  const checkAdminAuth = async () => {
    try {
      const authData = await adminAuthService.verifyToken()

      if (authData.valid) {
        setUser(authData.user)
        setPermissions(authData.permissions)

        // Solo usuarios admin pueden acceder a la gestión de usuarios
        if (authData.user.user_type !== 'admin') {
          router.push('/admin')
          return
        }
      } else {
        router.push('/admin/login')
      }

    } catch (error) {
      console.error('Error verificando autenticación admin:', error)
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 dark:border-indigo-400 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Cargando...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout user={user} permissions={permissions}>
      <UsersDatabase />
    </AdminLayout>
  )
}
