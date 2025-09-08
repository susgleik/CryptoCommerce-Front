'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { adminAuthService } from '@/app/lib/services/adminAuthService'
import type { AdminUser } from '@/app/lib/types/admin'
import AdminLayout from '@/app/components/admin/AdminLayout'
import Dashboard from '@/app/components/admin/Dashboard'

export default function AdminPage() {
  const [user, setUser] = useState<AdminUser | null>(null)
  const [permissions, setPermissions] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
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
      } else {
        router.push('/admin/login')
      }
      
    } catch (error: any) {
      console.error('Error verificando autenticación admin:', error)
      setError('Error verificando autenticación')
      router.push('/admin/login')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verificando permisos de administrador...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-600">{error}</p>
          <button 
            onClick={() => router.push('/admin/login')}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Ir al Login
          </button>
        </div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <AdminLayout user={user} permissions={permissions}>
      <Dashboard />
    </AdminLayout>
  )
}