'use client'
import { useState } from 'react'

const staticFeatures = [
  "Up to 5 custom-designed pages with <strong>proven SEO architecture</strong>",
  "Google Core Web Vitals optimisation (tested across Indian devices and networks)",
  "<strong>SEO-friendly web development</strong> using strategies refined over years",
  "Mobile-first responsive design optimised for Indian smartphone usage patterns",
  "Secure HTTPS/SSL implementation with Indian hosting considerations",
  "Schema markup for better Google India snippet visibility",
  "Google Search Console setup with Indian market focus",
  "Image and code optimisation for budget smartphones popular in India",
  "30 days post-launch support with <strong>expert SEO guidance</strong>"
]

const backendFeatures = [
  "Custom content management system designed with <strong>SEO best practices</strong>",
  "Blog/news section optimised for Indian local searches and \"near me\" queries",
  "Advanced internal linking architecture based on <strong>long-term link equity strategies</strong>",
  "User access management for Indian teams with SEO workflow integration",
  "Advanced security, anti-spam features, and Indian privacy compliance",
  "Built-in analytics dashboard showing <strong>SEO metrics that matter</strong> from long-term client reporting",
  "60 days extended support with <strong>ongoing SEO guidance</strong>"
]

const ecommerceFeatures = [
  "All features from previous packages with <strong>enterprise-grade SEO implementation</strong>",
  "Custom-built online store with <strong>conversion optimisation strategies</strong> proven over the years",
  "Product catalogue with SEO-optimised descriptions targeting Indian buyer behaviour",
  "Secure cart and checkout with Indian payment gateways (UPI, Paytm, net banking)",
  "<strong>Advanced product schema</strong> for Google Shopping visibility (techniques refined over years of eCommerce SEO)",
  "Inventory management optimised for Indian seasonal shopping patterns (Diwali, festivals)",
  "90 days premium support including <strong>ongoing SEO optimisation</strong> and performance reviews"
]

interface PackageCardProps {
  title: string
  badge: string
  badgeColor: string
  price: string
  description: string
  features: string[]
  bgGradient: string
  borderColor: string
  textColor: string
  buttonBg: string
  buttonHover: string
  isPopular?: boolean
}

function PackageCard({
  title,
  badge,
  badgeColor,
  price,
  description,
  features,
  bgGradient,
  borderColor,
  textColor,
  buttonBg,
  buttonHover,
  isPopular = false
}: PackageCardProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleFeatures = showAll ? features : features.slice(0, 3)
  const hasMore = features.length > 3

  return (
    <div className="group relative flex-shrink-0 w-[320px] sm:w-[360px] lg:w-auto">
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
          <div className="inline-flex items-center gap-1.5 px-4 py-1.5 bg-gradient-to-r from-amber-400 to-orange-400 rounded-full shadow-lg">
            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
            </svg>
            <span className="text-xs font-bold text-white uppercase tracking-wide">Most Popular</span>
          </div>
        </div>
      )}

      <div className="absolute inset-0 bg-gradient-to-br from-slate-200/50 to-slate-300/50 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
      <div className={`relative ${bgGradient} border-2 ${borderColor} rounded-2xl p-8 hover:shadow-2xl transition-all duration-300 h-full flex flex-col`}>

        <div className="mb-6">
          <div className={`inline-flex items-center gap-2 px-3 py-1 ${badgeColor} rounded-full mb-4`}>
            <span className={`text-xs font-semibold ${textColor} uppercase tracking-wide`}>{badge}</span>
          </div>
          <h3 className={`text-2xl font-bold ${textColor} mb-2`}>{title}</h3>
          <p className={`${textColor} text-sm opacity-90`}><strong>Perfect for:</strong> {description}</p>
        </div>

        <div className="mb-6">
          <div className="flex items-baseline gap-1">
            <span className={`text-5xl font-bold ${textColor}`}>{price}</span>
            <span className={`${textColor} text-sm opacity-75`}>/one-time</span>
          </div>
        </div>

        <p className={`text-sm font-semibold ${textColor} mb-4 opacity-90`}>What extensive SEO experience delivers:</p>

        <ul className="space-y-3 mb-6 flex-1">
          {visibleFeatures.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <svg className={`w-5 h-5 ${isPopular ? 'text-white' : 'text-blue-600'} flex-shrink-0 mt-0.5`} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span className={`text-sm ${textColor} opacity-90`} dangerouslySetInnerHTML={{ __html: feature }} />
            </li>
          ))}
        </ul>

        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className={`w-full text-center py-3 mb-4 ${
              isPopular
                ? 'bg-white/10 text-white hover:bg-white/20 border border-white/20'
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100 border border-blue-200'
            } rounded-lg text-sm font-semibold transition-all duration-300`}
          >
            {showAll ? '− Show Less' : `+ Show ${features.length - 3} More Features`}
          </button>
        )}

        <a
          href="/contact/"
          className={`block w-full text-center px-6 py-3.5 ${buttonBg} rounded-lg font-semibold ${buttonHover} transition-all duration-300 hover:shadow-lg`}
        >
          Get Started
        </a>
      </div>
    </div>
  )
}

export default function PricingPackagesIndia() {
  return (
    <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0 pt-4">
      <div className="flex lg:grid lg:grid-cols-3 gap-8 max-w-7xl mx-auto min-w-max lg:min-w-0">

        {/* Static Package */}
        <PackageCard
          title="SEO Optimised Static Website"
          badge="Starter"
          badgeColor="bg-slate-100"
          price="₹8,500"
          description="Startups, solo entrepreneurs, consultants, and small business owners needing a results-driven web presence."
          features={staticFeatures}
          bgGradient="bg-white"
          borderColor="border-slate-200"
          textColor="text-slate-900"
          buttonBg="bg-slate-900 text-white"
          buttonHover="hover:bg-slate-800"
        />

        {/* Backend Package */}
        <PackageCard
          title="SEO Optimised Website with Backend"
          badge="Professional"
          badgeColor="bg-white/20 backdrop-blur-sm"
          price="₹21,000"
          description="Growing companies, service providers, and professionals who need content management capabilities with enterprise-level SEO."
          features={backendFeatures}
          bgGradient="bg-gradient-to-br from-blue-600 to-indigo-600"
          borderColor="border-blue-400"
          textColor="text-white"
          buttonBg="bg-white text-blue-600"
          buttonHover="hover:bg-blue-50"
          isPopular={true}
        />

        {/* eCommerce Package */}
        <PackageCard
          title="SEO Optimised eCommerce Website"
          badge="Enterprise"
          badgeColor="bg-blue-100"
          price="₹42,000"
          description="Indian eCommerce brands, D2C companies, retail stores, and exporters ready to dominate online sales."
          features={ecommerceFeatures}
          bgGradient="bg-white"
          borderColor="border-slate-200"
          textColor="text-slate-900"
          buttonBg="bg-blue-600 text-white"
          buttonHover="hover:bg-blue-700"
        />

      </div>
    </div>
  )
}
