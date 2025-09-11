'use client'

interface CoreWebVitalMetric {
  value: number
  status: 'good' | 'needs-improvement' | 'poor'
}

interface CoreWebVitalsData {
  LCP: CoreWebVitalMetric
  INP: CoreWebVitalMetric
  CLS: CoreWebVitalMetric
}

interface CoreWebVitalsCardProps {
  title: string
  score: number
  coreWebVitals: CoreWebVitalsData
  device: 'desktop' | 'mobile'
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'good':
      return {
        bg: 'bg-green-50',
        text: 'text-green-700',
        border: 'border-green-200',
        icon: 'text-green-500'
      }
    case 'needs-improvement':
      return {
        bg: 'bg-yellow-50',
        text: 'text-yellow-700',
        border: 'border-yellow-200',
        icon: 'text-yellow-500'
      }
    case 'poor':
      return {
        bg: 'bg-red-50',
        text: 'text-red-700',
        border: 'border-red-200',
        icon: 'text-red-500'
      }
    default:
      return {
        bg: 'bg-gray-50',
        text: 'text-gray-700',
        border: 'border-gray-200',
        icon: 'text-gray-500'
      }
  }
}

const getScoreColor = (score: number) => {
  if (score >= 90) return 'text-green-600'
  if (score >= 50) return 'text-yellow-600'
  return 'text-red-600'
}

const formatMetricValue = (metric: string, value: number) => {
  switch (metric) {
    case 'LCP':
      return `${(value / 1000).toFixed(1)}s`
    case 'INP':
      return `${Math.round(value)}ms`
    case 'CLS':
      return value.toFixed(3)
    default:
      return value.toString()
  }
}

const getMetricDescription = (metric: string) => {
  switch (metric) {
    case 'LCP':
      return 'Largest Contentful Paint'
    case 'INP':
      return 'Interaction to Next Paint'
    case 'CLS':
      return 'Cumulative Layout Shift'
    default:
      return metric
  }
}

const getDeviceIcon = (device: string) => {
  if (device === 'mobile') {
    return (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a1 1 0 001-1V4a1 1 0 00-1-1H8a1 1 0 00-1 1v16a1 1 0 001 1z" />
      </svg>
    )
  }
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  )
}

export default function CoreWebVitalsCard({ title, score, coreWebVitals, device }: CoreWebVitalsCardProps) {
  const scoreColor = getScoreColor(score)

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
              {getDeviceIcon(device)}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
              <p className="text-sm text-gray-600 capitalize">{device} Performance</p>
            </div>
          </div>
          <div className="text-right">
            <div className={`text-3xl font-bold ${scoreColor}`}>{score}</div>
            <div className="text-sm text-gray-500">Performance Score</div>
          </div>
        </div>
      </div>

      {/* Core Web Vitals Metrics */}
      <div className="p-6">
        <div className="mb-4">
          <h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center">
            <svg className="w-4 h-4 mr-2 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Core Web Vitals
          </h4>
        </div>

        <div className="space-y-4">
          {Object.entries(coreWebVitals).map(([metric, data]) => {
            const colors = getStatusColor(data.status)
            return (
              <div key={metric} className={`${colors.bg} ${colors.border} border rounded-lg p-4`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`w-8 h-8 ${colors.bg} rounded-lg flex items-center justify-center`}>
                      <div className={`w-3 h-3 rounded-full ${colors.icon === 'text-green-500' ? 'bg-green-500' : colors.icon === 'text-yellow-500' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">{metric}</div>
                      <div className="text-sm text-gray-600">{getMetricDescription(metric)}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-lg font-semibold ${colors.text}`}>
                      {formatMetricValue(metric, data.value)}
                    </div>
                    <div className={`text-xs font-medium ${colors.text} capitalize`}>
                      {data.status.replace('-', ' ')}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Performance Insights */}
        <div className="mt-6 pt-4 border-t border-gray-100">
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <h5 className="text-sm font-medium text-gray-900 mb-1">Performance Insight</h5>
              <p className="text-sm text-gray-600">
                {score >= 90 
                  ? `Excellent ${device} performance! Your page loads quickly and provides a great user experience.`
                  : score >= 50
                  ? `Good ${device} performance with room for improvement. Focus on optimizing Core Web Vitals.`
                  : `Poor ${device} performance detected. Immediate optimization needed for better user experience.`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}