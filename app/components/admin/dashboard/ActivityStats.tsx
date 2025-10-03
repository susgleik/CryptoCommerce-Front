'use client'

import { useState } from 'react'
import { 
  UserGroupIcon, 
  EyeIcon, 
  ClockIcon,
  ArrowTrendingUpIcon 
} from '@heroicons/react/24/outline'

type FilterPeriod = 'day' | 'month' | 'year'

export default function ActivityStats() {
  const [selectedPeriod, setSelectedPeriod] = useState<FilterPeriod>('month')

  // Datos simulados - aquí irían los datos reales de la API
  const mockData = {
    day: {
      activeUsers: 45,
      totalVisits: 234,
      avgSessionDuration: '4:23',
      newUsers: 12
    },
    month: {
      activeUsers: 1250,
      totalVisits: 15600,
      avgSessionDuration: '6:47',
      newUsers: 320
    },
    year: {
      activeUsers: 8900,
      totalVisits: 125000,
      avgSessionDuration: '5:34',
      newUsers: 2100
    }
  }

  const currentData = mockData[selectedPeriod]

  const getPeriodLabel = (period: FilterPeriod) => {
    switch (period) {
      case 'day': return 'Hoy'
      case 'month': return 'Este Mes'
      case 'year': return 'Este Año'
    }
  }

  const activityMetrics = [
    {
      title: 'Usuarios Activos',
      value: currentData.activeUsers.toLocaleString(),
      icon: UserGroupIcon,
      color: 'purple',
      change: '+12%'
    },
    {
      title: 'Total Visitas',
      value: currentData.totalVisits.toLocaleString(),
      icon: EyeIcon,
      color: 'blue',
      change: '+8%'
    },
    {
      title: 'Duración Promedio',
      value: currentData.avgSessionDuration,
      icon: ClockIcon,
      color: 'green',
      change: '+5%'
    },
    {
      title: 'Nuevos Usuarios',
      value: currentData.newUsers.toLocaleString(),
      icon: ArrowTrendingUpIcon,
      color: 'orange',
      change: '+23%'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors = {
      purple: {
        bg: 'bg-purple-50 dark:bg-purple-900/20',
        icon: 'bg-purple-100 dark:bg-purple-800/50 text-purple-600 dark:text-purple-400',
        text: 'text-purple-700 dark:text-purple-300'
      },
      blue: {
        bg: 'bg-blue-50 dark:bg-blue-900/20',
        icon: 'bg-blue-100 dark:bg-blue-800/50 text-blue-600 dark:text-blue-400',
        text: 'text-blue-700 dark:text-blue-300'
      },
      green: {
        bg: 'bg-green-50 dark:bg-green-900/20',
        icon: 'bg-green-100 dark:bg-green-800/50 text-green-600 dark:text-green-400',
        text: 'text-green-700 dark:text-green-300'
      },
      orange: {
        bg: 'bg-orange-50 dark:bg-orange-900/20',
        icon: 'bg-orange-100 dark:bg-orange-800/50 text-orange-600 dark:text-orange-400',
        text: 'text-orange-700 dark:text-orange-300'
      }
    }
    return colors[color as keyof typeof colors] || colors.blue
  }


  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <UserGroupIcon className="h-6 w-6 text-purple-600 dark:text-purple-400 mr-2" />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Actividad de Usuarios</h2>
        </div>
        
        {/* Filter Buttons */}
        <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
          {(['day', 'month', 'year'] as FilterPeriod[]).map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedPeriod === period
                  ? 'bg-white dark:bg-gray-600 text-purple-600 dark:text-purple-400 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400'
              }`}
            >
              {getPeriodLabel(period)}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-2 gap-4 mb-6">
        {activityMetrics.map((metric, index) => {
          const colorClasses = getColorClasses(metric.color)
          return (
            <div key={index} className={`${colorClasses.bg} rounded-lg p-4`}>
              <div className="flex items-center justify-between mb-2">
                <div className={`${colorClasses.icon} rounded-full p-2`}>
                  <metric.icon className="h-5 w-5" />
                </div>
                <span className="text-xs font-medium text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/50 px-2 py-1 rounded-full">
                  {metric.change}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400 font-medium">{metric.title}</p>
                <p className={`text-xl font-bold ${colorClasses.text}`}>{metric.value}</p>
              </div>
            </div>
          )
        })}
      </div>

      {/* Activity Timeline */}
      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
          Actividad Reciente - {getPeriodLabel(selectedPeriod)}
        </h3>
        <div className="space-y-3">
          {[
            { time: '10:30 AM', action: 'Nuevo usuario registrado', user: 'user@email.com' },
            { time: '10:15 AM', action: 'Compra realizada', user: 'cliente@email.com' },
            { time: '09:45 AM', action: 'Producto agregado al carrito', user: 'comprador@email.com' },
            { time: '09:30 AM', action: 'Usuario inició sesión', user: 'usuario@email.com' }
          ].map((activity, index) => (
            <div key={index} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div className="flex-shrink-0 w-2 h-2 bg-purple-500 rounded-full mr-3"></div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900 dark:text-white">{activity.action}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">{activity.user}</p>
              </div>
              <span className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart Placeholder */}
      <div className="p-8 bg-gray-50 dark:bg-gray-700/50 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
        <div className="text-center">
          <UserGroupIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Gráfico de Actividad</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aquí se mostrará el gráfico de actividad de usuarios
          </p>
        </div>
      </div>
    </div>
  )
}