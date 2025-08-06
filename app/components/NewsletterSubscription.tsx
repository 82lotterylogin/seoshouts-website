// app/components/NewsletterSubscription.tsx
'use client'

import { useState } from 'react'

interface NewsletterSubscriptionProps {
  theme?: 'blue' | 'white' | 'gray'
  size?: 'small' | 'medium' | 'large'
  title?: string
  description?: string
  className?: string
}

export default function NewsletterSubscription({ 
  theme = 'blue',
  size = 'medium',
  title = 'Get SEO Insights',
  description = 'Join 10,000+ marketers receiving weekly SEO strategies and tips directly in their inbox.',
  className = ''
}: NewsletterSubscriptionProps) {
  const [form, setForm] = useState({
    email: '',
    isLoading: false,
    isSubscribed: false,
    error: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!form.email) {
      setForm(prev => ({ ...prev, error: 'Please enter your email address' }))
      return
    }

    setForm(prev => ({ ...prev, isLoading: true, error: '' }))

    try {
      const response = await fetch('/api/newsletter-subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setForm(prev => ({ 
          ...prev, 
          isLoading: false, 
          isSubscribed: true,
          email: '' 
        }))
        
        // Reset success message after 5 seconds
        setTimeout(() => {
          setForm(prev => ({ ...prev, isSubscribed: false }))
        }, 5000)
      } else {
        throw new Error(data.error || 'Subscription failed')
      }
    } catch (error) {
      setForm(prev => ({ 
        ...prev, 
        isLoading: false, 
        error: error instanceof Error ? error.message : 'Subscription failed. Please try again.' 
      }))
    }
  }

  // Theme classes
  const themeClasses = {
    blue: {
      container: 'bg-gradient-to-r from-blue-600 to-blue-800 text-white',
      input: 'bg-white/20 backdrop-blur-sm border border-white/30 text-white placeholder-blue-200 focus:ring-white/50 focus:border-white/50',
      button: 'bg-white text-blue-600 hover:bg-blue-50',
      text: 'text-blue-100'
    },
    white: {
      container: 'bg-white text-gray-800 border border-gray-200',
      input: 'bg-gray-50 border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      text: 'text-gray-600'
    },
    gray: {
      container: 'bg-gray-100 text-gray-800',
      input: 'bg-white border border-gray-300 text-gray-900 placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500',
      button: 'bg-blue-600 text-white hover:bg-blue-700',
      text: 'text-gray-600'
    }
  }

  // Size classes
  const sizeClasses = {
    small: {
      container: 'p-4',
      title: 'text-lg font-bold mb-2',
      description: 'text-sm mb-4',
      input: 'px-3 py-2 text-sm',
      button: 'px-4 py-2 text-sm font-semibold'
    },
    medium: {
      container: 'p-6',
      title: 'text-xl font-bold mb-2',
      description: 'text-base mb-4',
      input: 'px-4 py-3',
      button: 'px-6 py-3 font-semibold'
    },
    large: {
      container: 'p-8',
      title: 'text-2xl font-bold mb-2',
      description: 'text-lg mb-6',
      input: 'px-4 py-3 text-lg',
      button: 'px-6 py-3 text-lg font-semibold'
    }
  }

  const currentTheme = themeClasses[theme]
  const currentSize = sizeClasses[size]

  return (
    <div className={`${currentTheme.container} ${currentSize.container} rounded-lg shadow-lg ${className}`}>
      <div className="max-w-md mx-auto text-center">
        <h3 className={currentSize.title}>{title}</h3>
        <p className={`${currentTheme.text} ${currentSize.description}`}>
          {description}
        </p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm(prev => ({ ...prev, email: e.target.value, error: '' }))}
              placeholder="Enter your email address"
              className={`flex-1 ${currentTheme.input} ${currentSize.input} rounded-lg focus:outline-none focus:ring-2 transition-all duration-200`}
              required
              disabled={form.isLoading}
            />
            <button
              type="submit"
              disabled={form.isLoading}
              className={`${currentTheme.button} ${currentSize.button} rounded-lg transition-all duration-200 hover:shadow-lg transform hover:scale-105 disabled:opacity-70 disabled:cursor-not-allowed min-w-fit`}
            >
              {form.isLoading ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Subscribing...
                </span>
              ) : (
                'Subscribe Free'
              )}
            </button>
          </div>
          
          {/* Success Message */}
          {form.isSubscribed && (
            <div className="bg-green-500/20 border border-green-300/30 rounded-lg p-3 text-sm">
              ✅ Thank you! You've been successfully subscribed to our newsletter.
            </div>
          )}
          
          {/* Error Message */}
          {form.error && (
            <div className="bg-red-500/20 border border-red-300/30 rounded-lg p-3 text-sm">
              {form.error}
            </div>
          )}
        </form>

        <p className={`text-xs ${currentTheme.text} mt-3`}>
          ✓ No spam, ever ✓ Unsubscribe anytime ✓ Expert SEO tips
        </p>
      </div>
    </div>
  )
}