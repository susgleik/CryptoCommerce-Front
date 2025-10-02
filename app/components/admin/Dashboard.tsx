'use client'

import ProductStats from './dashboard/ProductStats'
import ActivityStats from './dashboard/ActivityStats'
import ReviewsSection from './dashboard/ReviewsSection'

export default function Dashboard() {
  return (
    <div className="p-6">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-2">Resumen general de la actividad de la tienda</p>
      </div>

      {/* Top Row - Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <ProductStats />
        <ActivityStats />
      </div>

      {/* Bottom Row - Reviews */}
      <div className="mb-8">
        <ReviewsSection />
      </div>
    </div>
  )
}