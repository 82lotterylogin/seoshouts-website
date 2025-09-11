'use client'

interface SEOMetricCardProps {
  title: string
  score: number
  maxScore?: number
  status: 'excellent' | 'good' | 'warning' | 'error' | 'info'
  icon: React.ReactNode
  description: string
  details?: string[]
  recommendations?: string[]
  loading?: boolean
}

const getStatusConfig = (status: string, score?: number, maxScore?: number) => {
  const percentage = maxScore ? (score! / maxScore) * 100 : score!
  
  switch (status) {
    case 'excellent':
      return {
        bg: 'bg-green-50',
        border: 'border-green-200',
        text: 'text-green-700',
        iconBg: 'bg-green-100',
        iconColor: 'text-green-600',
        scoreColor: 'text-green-600',
        badgeColor: 'bg-green-100 text-green-800'
      }
    case 'good':
      return {
        bg: 'bg-blue-50',
        border: 'border-blue-200',
        text: 'text-blue-700',
        iconBg: 'bg-blue-100',
        iconColor: 'text-blue-600',
        scoreColor: 'text-blue-600',
        badgeColor: 'bg-blue-100 text-blue-800'
      }
    case 'warning':
      return {
        bg: 'bg-yellow-50',
        border: 'border-yellow-200',
        text: 'text-yellow-700',
        iconBg: 'bg-yellow-100',
        iconColor: 'text-yellow-600',
        scoreColor: 'text-yellow-600',
        badgeColor: 'bg-yellow-100 text-yellow-800'
      }
    case 'error':
      return {
        bg: 'bg-red-50',
        border: 'border-red-200',
        text: 'text-red-700',
        iconBg: 'bg-red-100',
        iconColor: 'text-red-600',
        scoreColor: 'text-red-600',
        badgeColor: 'bg-red-100 text-red-800'
      }
    case 'info':
    default:
      return {
        bg: 'bg-gray-50',
        border: 'border-gray-200',
        text: 'text-gray-700',
        iconBg: 'bg-gray-100',
        iconColor: 'text-gray-600',
        scoreColor: 'text-gray-600',
        badgeColor: 'bg-gray-100 text-gray-800'
      }
  }
}

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'excellent':
      return 'Excellent'
    case 'good':
      return 'Good'
    case 'warning':
      return 'Needs Attention'
    case 'error':
      return 'Critical Issue'
    case 'info':
      return 'Information'
    default:
      return 'Unknown'
  }
}

export default function SEOMetricCard({
  title,
  score,
  maxScore = 100,
  status,
  icon,
  description,
  details = [],
  recommendations = [],
  loading = false
}: SEOMetricCardProps) {
  const config = getStatusConfig(status, score, maxScore)
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : score

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="animate-pulse">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-32"></div>
                <div className="h-3 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="w-16 h-8 bg-gray-200 rounded"></div>
          </div>
          <div className="space-y-2">
            <div className="h-3 bg-gray-200 rounded w-full"></div>
            <div className="h-3 bg-gray-200 rounded w-3/4"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`bg-white rounded-xl shadow-lg border ${config.border} transition-all duration-200 hover:shadow-xl`}>
      {/* Header */}
      <div className={`${config.bg} px-6 py-4 rounded-t-xl border-b ${config.border}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className={`w-12 h-12 ${config.iconBg} rounded-lg flex items-center justify-center ${config.iconColor}`}>
              {icon}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${config.badgeColor}`}>
                {getStatusLabel(status)}
              </span>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-2xl font-bold ${config.scoreColor}`}>
              {maxScore > 1 ? `${score}/${maxScore}` : `${percentage}%`}
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Description */}
        <p className="text-gray-600 mb-4">{description}</p>

        {/* Progress Bar for percentage scores */}
        {maxScore > 1 && (
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 mb-1">
              <span>Progress</span>
              <span>{percentage}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full transition-all duration-500 ${
                  percentage >= 80 ? 'bg-green-500' : 
                  percentage >= 60 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${Math.min(percentage, 100)}%` }}
              ></div>
            </div>
          </div>
        )}

        {/* Details */}
        {details.length > 0 && (
          <div className="mb-4">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Details
            </h4>
            <ul className="space-y-1">
              {details.map((detail, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-gray-400 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <h4 className="text-sm font-semibold text-gray-700 mb-2 flex items-center">
              <svg className="w-4 h-4 mr-1 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommendations
            </h4>
            <ul className="space-y-1">
              {recommendations.map((recommendation, index) => (
                <li key={index} className="flex items-start text-sm text-gray-600">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></span>
                  {recommendation}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}