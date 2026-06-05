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

const STATUS_CONFIG: Record<string, { color: string; bg: string; label: string }> = {
  excellent: { color: '#059669', bg: 'rgba(5,150,105,0.06)',   label: 'Excellent'      },
  good:      { color: '#2563eb', bg: 'rgba(37,99,235,0.06)',   label: 'Good'           },
  warning:   { color: '#d97706', bg: 'rgba(217,119,6,0.06)',   label: 'Needs Attention'},
  error:     { color: '#dc2626', bg: 'rgba(220,38,38,0.06)',   label: 'Critical Issue' },
  info:      { color: '#64748b', bg: 'rgba(100,116,139,0.06)', label: 'Information'    },
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
  loading = false,
}: SEOMetricCardProps) {
  const cfg = STATUS_CONFIG[status] ?? STATUS_CONFIG.info
  const percentage = maxScore ? Math.round((score / maxScore) * 100) : score

  if (loading) {
    return (
      <div style={{ border: '1px solid var(--line)', background: 'var(--white)', padding: '1.25rem' }}>
        <div className="animate-pulse">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
              <div style={{ width: 40, height: 40, background: 'var(--line)' }} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
                <div style={{ width: 120, height: 14, background: 'var(--line)' }} />
                <div style={{ width: 80, height: 11, background: 'var(--line)' }} />
              </div>
            </div>
            <div style={{ width: 52, height: 28, background: 'var(--line)' }} />
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <div style={{ height: 11, background: 'var(--line)', width: '100%' }} />
            <div style={{ height: 11, background: 'var(--line)', width: '75%' }} />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ border: `1px solid ${cfg.color}22`, background: 'var(--white)', overflow: 'hidden', borderLeft: `3px solid ${cfg.color}` }}>
      {/* Header */}
      <div style={{ background: cfg.bg, padding: '0.875rem 1rem', borderBottom: '1px solid var(--line)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.625rem', minWidth: 0 }}>
          <div style={{ width: 36, height: 36, background: cfg.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, color: 'white' }}>
            {icon}
          </div>
          <div style={{ minWidth: 0 }}>
            <h3 style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--ink)', letterSpacing: '-0.01em', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{title}</h3>
            <span style={{ fontSize: '0.62rem', fontWeight: 700, padding: '1px 6px', background: cfg.color, color: 'white', display: 'inline-block', marginTop: 3 }}>
              {cfg.label}
            </span>
          </div>
        </div>
        <div style={{ textAlign: 'right', flexShrink: 0 }}>
          <div style={{ fontSize: '1.25rem', fontWeight: 800, color: cfg.color, letterSpacing: '-0.04em', lineHeight: 1 }}>
            {maxScore > 1 ? `${score}/${maxScore}` : `${percentage}%`}
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: '0.875rem 1rem' }}>
        <p style={{ margin: 0, fontSize: '0.78rem', color: 'var(--gray-5)', lineHeight: 1.6, marginBottom: '0.75rem' }}>{description}</p>

        {/* Progress Bar */}
        {maxScore > 1 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.68rem', color: 'var(--gray-5)', marginBottom: '0.25rem' }}>
              <span>Progress</span>
              <span style={{ fontWeight: 700, color: cfg.color }}>{percentage}%</span>
            </div>
            <div style={{ height: 3, background: 'var(--line)', width: '100%' }}>
              <div style={{ height: '100%', background: cfg.color, width: `${Math.min(percentage, 100)}%`, transition: 'width 0.5s ease' }} />
            </div>
          </div>
        )}

        {/* Details */}
        {details.length > 0 && (
          <div style={{ marginBottom: '0.75rem' }}>
            <h4 style={{ margin: 0, marginBottom: '0.375rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg style={{ width: 10, height: 10 }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Details
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {details.map((detail, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                  <span style={{ width: 4, height: 4, background: 'var(--gray-5)', flexShrink: 0, marginTop: '0.45rem', display: 'inline-block' }} />
                  {detail}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Recommendations */}
        {recommendations.length > 0 && (
          <div style={{ marginTop: '0.75rem', paddingTop: '0.75rem', borderTop: '1px solid var(--line)' }}>
            <h4 style={{ margin: 0, marginBottom: '0.375rem', fontSize: '0.68rem', fontWeight: 700, color: 'var(--ink)', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <svg style={{ width: 10, height: 10, color: 'var(--blue)' }} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Recommendations
            </h4>
            <ul style={{ margin: 0, padding: 0, listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
              {recommendations.map((rec, index) => (
                <li key={index} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.375rem', fontSize: '0.75rem', color: 'var(--gray-5)', lineHeight: 1.5 }}>
                  <span style={{ width: 4, height: 4, background: 'var(--blue)', flexShrink: 0, marginTop: '0.45rem', display: 'inline-block' }} />
                  {rec}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}
