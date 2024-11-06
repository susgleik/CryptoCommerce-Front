// app/page.txx
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Bienvenido a Book Store</h1>
      <div className="flex gap-4">
        <Link 
          href="/auth/login" 
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Iniciar Sesión
        </Link>
        <Link 
          href="/auth/register" 
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Registrarse
        </Link>
      </div>
    </main>
  )
}