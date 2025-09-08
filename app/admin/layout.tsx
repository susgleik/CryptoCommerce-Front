import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'MyDrops v1.0 - Admin Panel',
  description: 'Panel de administración para MyDROPs',
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}