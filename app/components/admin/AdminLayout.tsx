'use client'

import type { AdminUser } from '@/app/lib/types/admin'
import AdminNav from '@/app/components/admin/AdminNav'

interface AdminLayoutProps {
  children: React.ReactNode
  user: AdminUser
  permissions: string[]
}

export default function AdminLayout({ children, user, permissions }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="flex h-screen">
        {/* Sidebar Navigation - Incluye ThemeToggle integrado */}
        <AdminNav user={user} permissions={permissions} />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900">
            {children}
          </main>
        </div>
      </div>
    </div>
  )
}