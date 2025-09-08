'use client'

import { useState } from 'react'
import { 
  StarIcon,
  ChatBubbleLeftRightIcon,
} from '@heroicons/react/24/outline'
import { StarIcon as StarIconSolid } from '@heroicons/react/24/solid'

type FilterPeriod = 'day' | 'week' | 'month' | 'year'
type RatingFilter = 'all' | '5' | '4' | '3' | '2' | '1'

interface Review {
  id: string
  userName: string
  productName: string
  rating: number
  comment: string
  date: string
  verified: boolean
}

export default function ReviewsSection() {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('month')
  const [selectedRating, setSelectedRating] = useState<RatingFilter>('all')

  // Datos simulados - aquí irían los datos reales de la API
  const mockReviews: Review[] = [
    {
      id: '1',
      userName: 'María González',
      productName: 'El Quijote de la Mancha',
      rating: 5,
      comment: 'Excelente edición, muy buena calidad del papel y encuadernación.',
      date: '2025-01-15',
      verified: true
    },
    {
      id: '2',
      userName: 'Carlos Rodriguez',
      productName: 'Cien Años de Soledad',
      rating: 4,
      comment: 'Gran libro, llegó en perfecto estado y muy rápido.',
      date: '2025-01-14',
      verified: true
    },
    {
      id: '3',
      userName: 'Ana López',
      productName: 'La Casa de los Espíritus',
      rating: 5,
      comment: 'Increíble historia, la recomiendo totalmente. Servicio impecable.',
      date: '2025-01-13',
      verified: false
    },
    {
      id: '4',
      userName: 'Pedro Martín',
      productName: 'El Principito',
      rating: 3,
      comment: 'El libro está bien, pero la entrega se demoró más de lo esperado.',
      date: '2025-01-12',
      verified: true
    },
    {
      id: '5',
      userName: 'Lucía Fernández',
      productName: 'Rayuela',
      rating: 5,
      comment: 'Perfecto estado, excelente precio. Muy satisfecha con la compra.',
      date: '2025-01-11',
      verified: true
    }
  ]

  const reviewStats = {
    total: 1247,
    average: 4.3,
    distribution: {
      5: 645,
      4: 312,
      3: 189,
      2: 67,
      1: 34
    }
  }

  const getPeriodLabel = (period: FilterPeriod) => {
    switch (period) {
      case 'day': return 'Hoy'
      case 'week': return 'Esta Semana'
      case 'month': return 'Este Mes'
      case 'year': return 'Este Año'
    }
  }

  const getRatingLabel = (rating: RatingFilter) => {
    if (rating === 'all') return 'Todas'
    return `${rating} ⭐`
  }

  const filteredReviews = mockReviews.filter(review => {
    if (selectedRating === 'all') return true
    return review.rating.toString() === selectedRating
  })

  const renderStars = (rating: number) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <StarIconSolid
            key={star}
            className={`h-4 w-4 ${
              star <= rating ? 'text-yellow-400' : 'text-gray-300'
            }`}
          />
        ))}
      </div>
    )
  }

  const getPercentage = (count: number) => {
    return Math.round((count / reviewStats.total) * 100)
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <ChatBubbleLeftRightIcon className="h-6 w-6 text-yellow-600 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900">Reviews de Productos</h2>
        </div>
        
        {/* Filters */}
        <div className="flex space-x-3">
          {/* Period Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['day', 'week', 'month', 'year'] as FilterPeriod[]).map((period) => (
              <button
                key={period}
                onClick={() => setSelectedPeriod(period)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedPeriod === period
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                {getPeriodLabel(period)}
              </button>
            ))}
          </div>

          {/* Rating Filter */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            {(['all', '5', '4', '3', '2', '1'] as RatingFilter[]).map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  selectedRating === rating
                    ? 'bg-white text-yellow-600 shadow-sm'
                    : 'text-gray-600 hover:text-yellow-600'
                }`}
              >
                {getRatingLabel(rating)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Stats Overview */}
        <div className="lg:col-span-1">
          <div className="bg-yellow-50 rounded-lg p-4 mb-4">
            <div className="text-center">
              <p className="text-3xl font-bold text-yellow-700">{reviewStats.average}</p>
              <div className="flex justify-center my-2">
                {renderStars(Math.round(reviewStats.average))}
              </div>
              <p className="text-sm text-yellow-600">
                Promedio de {reviewStats.total.toLocaleString()} reviews
              </p>
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="space-y-2">
            <h4 className="font-medium text-gray-900 mb-3">Distribución de Calificaciones</h4>
            {[5, 4, 3, 2, 1].map((rating) => (
              <div key={rating} className="flex items-center">
                <span className="text-sm text-gray-600 w-3">{rating}</span>
                <StarIconSolid className="h-4 w-4 text-yellow-400 mx-1" />
                <div className="flex-1 bg-gray-200 rounded-full h-2 mx-2">
                  <div
                    className="bg-yellow-400 h-2 rounded-full"
                    style={{ 
                      width: `${getPercentage(reviewStats.distribution[rating as keyof typeof reviewStats.distribution])}%` 
                    }}
                  ></div>
                </div>
                <span className="text-sm text-gray-600 w-8">
                  {getPercentage(reviewStats.distribution[rating as keyof typeof reviewStats.distribution])}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reviews */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">
              Reviews Recientes - {getPeriodLabel(selectedPeriod)}
              {selectedRating !== 'all' && ` (${selectedRating} estrellas)`}
            </h3>
            <span className="text-sm text-gray-500">
              {filteredReviews.length} de {mockReviews.length} reviews
            </span>
          </div>

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {filteredReviews.map((review) => (
              <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center mr-3">
                      <span className="text-white font-medium text-sm">
                        {review.userName.charAt(0)}
                      </span>
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 text-sm">
                        {review.userName}
                        {review.verified && (
                          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                            Verificado
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-gray-500">{review.productName}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    {renderStars(review.rating)}
                    <p className="text-xs text-gray-500 mt-1">
                      {new Date(review.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  {review.comment}
                </p>
              </div>
            ))}
          </div>

          {filteredReviews.length === 0 && (
            <div className="text-center py-8">
              <ChatBubbleLeftRightIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">No hay reviews</h3>
              <p className="mt-1 text-sm text-gray-500">
                No se encontraron reviews para los filtros seleccionados.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="mt-6 p-8 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
        <div className="text-center">
          <StarIcon className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900">Gráfico de Reviews</h3>
          <p className="mt-1 text-sm text-gray-500">
            Aquí se mostrará el gráfico de tendencias de reviews por período
          </p>
        </div>
      </div>
    </div>
  )}