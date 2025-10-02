import { Metadata } from 'next'
import { ThemeProvider } from '@/app/providers/ThemeProvider'

export const metadata: Metadata = {
  title: 'MyDrops v1.0 - Admin Panel',
  description: 'Panel de administración para MyDROPs',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}