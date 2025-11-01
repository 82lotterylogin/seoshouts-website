'use client'
import { useState } from 'react'
import * as Tooltip from '@radix-ui/react-tooltip'

type SeoFactor = {
  num: number
  icon: string
  title: string
  desc: string
  tooltip: string
}

type Category = {
  id: string
  icon: string
  title: string
  description: string
  color: string
  borderColor: string
  factors: SeoFactor[]
}

const categories: Category[] = [
  {
    id: 'technical',
    icon: '🔧',
    title: 'Technical SEO Foundation',
    description: 'Core technical elements that help Google crawl, understand, and index your Michigan website effectively.',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-600',
    factors: [
      {
        num: 1,
        icon: '🔧',
        title: 'Title Tag',
        desc: 'Main headline for Google with CA keywords',
        tooltip: 'The title tag is the most important on-page SEO element. It appears as the clickable headline in search results and tells both users and search engines what your page is about.'
      },
      {
        num: 2,
        icon: '📄',
        title: 'Meta Description',
        desc: 'Crafted to make Michigan users click',
        tooltip: 'The meta description is the snippet of text that appears below your title in search results. While not a direct ranking factor, it significantly impacts click-through rates.'
      },
      {
        num: 3,
        icon: '🔗',
        title: 'Canonical Tag',
        desc: 'Avoids duplicate content across CA pages',
        tooltip: 'Canonical tags tell search engines which version of a page is the "master" copy when you have similar or duplicate content, preventing SEO dilution.'
      },
      {
        num: 4,
        icon: '🌐',
        title: 'Hreflang Tag',
        desc: 'Shows right CA page by region/language',
        tooltip: 'Hreflang tags help Google serve the correct language or regional version of your page to users in different locations, essential for multi-regional sites.'
      },
      {
        num: 5,
        icon: '🔤',
        title: 'URL Structure',
        desc: 'Clean, readable URLs with keywords',
        tooltip: 'SEO-friendly URLs are short, descriptive, and include relevant keywords. They help both users and search engines understand page content before clicking.'
      },
      {
        num: 6,
        icon: '📋',
        title: 'Heading Tags (H1-H6)',
        desc: 'Logical CA location & keyword hierarchy',
        tooltip: 'Heading tags create a content hierarchy that helps search engines understand the structure and main topics of your page. H1 is the main heading, H2-H6 are subheadings.'
      },
      {
        num: 7,
        icon: '💻',
        title: 'HTML5 Semantic Tags',
        desc: 'Modern code Google understands',
        tooltip: 'Semantic HTML5 tags like <header>, <nav>, <article>, and <footer> give meaning to your page structure, making it easier for search engines to parse your content.'
      },
      {
        num: 8,
        icon: '🤖',
        title: 'Robots Meta Tags',
        desc: 'Instructions for Google indexing',
        tooltip: 'Robots meta tags control how search engines crawl and index individual pages. You can use them to prevent indexing of duplicate content or control snippet display.'
      },
    ]
  },
  {
    id: 'content',
    icon: '📝',
    title: 'Content & Keywords',
    description: 'Strategic content optimization targeting Michigan search intent with natural keyword integration.',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-600',
    factors: [
      {
        num: 9,
        icon: '✍️',
        title: 'Content Quality',
        desc: 'Original content for CA tech-savvy audience',
        tooltip: 'High-quality content is original, comprehensive, well-researched, and provides real value to users. It directly impacts rankings and user engagement.'
      },
      {
        num: 10,
        icon: '🔍',
        title: 'Keyword Optimization',
        desc: 'CA-specific keywords targeting search intent',
        tooltip: 'Strategic placement of primary and related keywords throughout your content in a natural way. Includes semantic keywords and long-tail variations.'
      },
      {
        num: 11,
        icon: '🔗',
        title: 'Internal Linking',
        desc: 'Strategic links between CA pages',
        tooltip: 'Internal links connect your pages together, helping distribute ranking authority, improve navigation, and help search engines discover and understand your site structure.'
      },
      {
        num: 12,
        icon: '📊',
        title: 'Schema Markup',
        desc: 'Structured data with CA location info',
        tooltip: 'Schema markup is code that helps search engines understand your content better and can enable rich results like star ratings, FAQs, and local business information in search results.'
      },
    ]
  },
  {
    id: 'media',
    icon: '🖼️',
    title: 'Images & Media',
    description: 'Image optimization for fast loading on Michigan 5G networks while maintaining SEO value.',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-600',
    factors: [
      {
        num: 13,
        icon: '🖼️',
        title: 'Image Optimization',
        desc: 'Compressed for CA 5G with SEO filenames',
        tooltip: 'Optimized images load faster (improving Core Web Vitals) while maintaining quality. Includes compression, proper formats (WebP), and descriptive file names.'
      },
      {
        num: 14,
        icon: '🏷️',
        title: 'Alt Text for Images',
        desc: 'Every image described for search & accessibility',
        tooltip: 'Alt text describes images for search engines and visually impaired users. It helps images rank in Google Image Search and provides context when images fail to load.'
      },
      {
        num: 15,
        icon: '⭐',
        title: 'Favicon',
        desc: 'Your mini CA brand logo in browser tabs',
        tooltip: 'A favicon is the small icon that appears in browser tabs and bookmarks. While minor for SEO, it enhances brand recognition and user experience.'
      },
    ]
  },
  {
    id: 'performance',
    icon: '⚡',
    title: 'Performance & UX',
    description: 'Lightning-fast loading optimized for Michigan networks with perfect mobile experience.',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-600',
    factors: [
      {
        num: 16,
        icon: '⚡',
        title: 'Core Web Vitals',
        desc: 'Lightning-fast on CA networks',
        tooltip: 'Core Web Vitals measure loading speed (LCP), interactivity (FID), and visual stability (CLS). These are official Google ranking factors affecting user experience.'
      },
      {
        num: 17,
        icon: '📱',
        title: 'Mobile Responsiveness',
        desc: 'Perfect on iOS/Android in CA mobile market',
        tooltip: 'Mobile-first responsive design ensures your site looks and works perfectly on all devices. Critical since Google uses mobile-first indexing for all websites.'
      },
      {
        num: 18,
        icon: '🧭',
        title: 'Structured Navigation',
        desc: 'Simple menus aligned with CA user behavior',
        tooltip: 'Clear, intuitive navigation helps users find what they need quickly and helps search engines understand your site structure and page relationships.'
      },
      {
        num: 19,
        icon: '🍞',
        title: 'Breadcrumbs Markup',
        desc: 'Shows CA state→city path for navigation',
        tooltip: 'Breadcrumbs show users their location within your site hierarchy. When marked up properly, they can appear in search results, improving click-through rates.'
      },
      {
        num: 20,
        icon: '📑',
        title: 'Pagination Tags',
        desc: 'Makes long CA location lists easy to navigate',
        tooltip: 'Pagination tags (rel=next/prev) help search engines understand the relationship between paginated content, preventing duplicate content issues.'
      },
    ]
  },
  {
    id: 'security',
    icon: '🔒',
    title: 'Security & Social',
    description: 'HTTPS security with CCPA compliance and optimized social media integration for Michigan.',
    color: 'from-blue-600 to-blue-700',
    borderColor: 'border-blue-600',
    factors: [
      {
        num: 21,
        icon: '🔒',
        title: 'HTTPS Security',
        desc: 'SSL-enabled with CCPA compliance',
        tooltip: 'HTTPS encryption (SSL certificate) is a Google ranking factor and essential for user trust. It encrypts data between your site and visitors, protecting sensitive information.'
      },
      {
        num: 22,
        icon: '🗺️',
        title: 'Sitemap & Robots.txt',
        desc: 'Ensures Google discovers all CA pages',
        tooltip: 'XML sitemaps list all your important pages for search engines. Robots.txt controls which pages search engines can crawl. Both are essential for proper indexing.'
      },
      {
        num: 23,
        icon: '📱',
        title: 'Open Graph Tags',
        desc: 'Optimizes CA business previews on social',
        tooltip: 'Open Graph tags control how your content appears when shared on Facebook, LinkedIn, and other social platforms, improving social engagement and traffic.'
      },
      {
        num: 24,
        icon: '🐦',
        title: 'Twitter Card Tags',
        desc: 'Custom display for links shared by CA audiences',
        tooltip: 'Twitter Card tags customize how your links appear when shared on Twitter/X, with options for images, titles, and descriptions to maximize engagement.'
      },
      {
        num: 25,
        icon: '📢',
        title: 'Social Sharing Buttons',
        desc: 'Easy sharing to LinkedIn, Facebook, Instagram',
        tooltip: 'Social sharing buttons make it easy for visitors to share your content, increasing reach and potentially generating backlinks and social signals.'
      },
      {
        num: 26,
        icon: '🎯',
        title: 'Engagement CTAs',
        desc: 'CA-specific actions with region parameters',
        tooltip: 'Call-to-action buttons strategically placed throughout your site to guide users toward desired actions (contact, purchase, sign-up), improving conversion rates.'
      },
    ]
  },
]

export default function SeoChecklist() {
  const [activeCategory, setActiveCategory] = useState<string>('technical')

  const currentCategory = categories.find(cat => cat.id === activeCategory) || categories[0]

  return (
    <Tooltip.Provider delayDuration={200}>
      <section className="relative py-8 sm:py-12 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-20 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 left-0 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 sm:px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl mb-6 shadow-lg shadow-blue-600/20">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
            </svg>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 bg-clip-text text-transparent">
              Our Web Dev On-Page SEO Perfection Checklist
            </span>
          </h2>
          <p className="text-lg text-slate-700 max-w-3xl mx-auto mb-2">
            Every Michigan website we build includes the complete suite of <strong>26 technical and SEO on-page factors</strong> as standard.
          </p>
          <p className="text-base text-slate-600 max-w-3xl mx-auto">
            These aren't add-ons—this is what genuine SEO website development service means for your Michigan business.
          </p>
        </div>

        {/* Two Column Layout - 45/55 Split */}
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-[45%_55%] gap-8">

            {/* Left Column - 45% - Category Info & Navigation */}
            <div className="bg-white rounded-2xl p-4 sm:p-8 shadow-lg border border-slate-200">
              {/* Active Category Display */}
              <div className="mb-6 sm:mb-8">
                <div className="flex items-center gap-3 sm:gap-4 mb-3 sm:mb-4">
                  <div className={`w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br ${currentCategory.color} rounded-2xl flex items-center justify-center text-2xl sm:text-3xl shadow-lg flex-shrink-0`}>
                    {currentCategory.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-2xl font-bold text-slate-900 mb-1">
                      {currentCategory.title}
                    </h3>
                  </div>
                </div>
                <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
                  {currentCategory.description}
                </p>
              </div>

              {/* Category Navigation */}
              <div className="space-y-2 sm:space-y-3">
                <p className="text-xs sm:text-sm font-semibold text-slate-500 uppercase tracking-wider mb-2 sm:mb-3">
                  Select Category
                </p>
                {categories.map((category) => {
                  const isActive = category.id === activeCategory
                  return (
                    <button
                      key={category.id}
                      onClick={() => setActiveCategory(category.id)}
                      className={`w-full flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all duration-300 ${
                        isActive
                          ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg scale-105'
                          : 'bg-slate-50 text-slate-700 hover:bg-slate-100 hover:shadow-md'
                      }`}
                    >
                      <span className="text-xl sm:text-2xl">{category.icon}</span>
                      <span className="text-left flex-1 text-xs sm:text-sm">{category.title}</span>
                      <span className={`text-xs sm:text-sm font-bold ${isActive ? 'text-white' : 'text-slate-400'}`}>
                        {category.factors.length}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>

            {/* Right Column - 55% - Factor Cards in Two Columns */}
            <div className="relative overflow-visible">
              <div key={currentCategory.id} className="grid grid-cols-1 sm:grid-cols-2 gap-4 animate-fadeIn">
                {currentCategory.factors.map((factor, index) => (
                  <Tooltip.Root key={factor.num} delayDuration={200}>
                    <Tooltip.Trigger asChild>
                      <button
                        className={`bg-white rounded-xl p-3 sm:p-4 border-2 ${currentCategory.borderColor} shadow-sm hover:shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer relative z-10 w-full text-left`}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="flex items-start gap-2 sm:gap-3">
                          {/* Icon */}
                          <div className={`w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br ${currentCategory.color} rounded-lg flex items-center justify-center shadow-md flex-shrink-0`}>
                            <span className="text-lg sm:text-xl">{factor.icon}</span>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            {/* Number */}
                            <span className="text-[10px] sm:text-xs font-bold text-slate-400 block mb-0.5 sm:mb-1">
                              #{factor.num}
                            </span>

                            {/* Title Only */}
                            <h4 className="font-bold text-slate-900 text-xs sm:text-sm leading-tight">
                              {factor.title}
                            </h4>
                          </div>
                        </div>
                      </button>
                    </Tooltip.Trigger>

                    <Tooltip.Portal>
                      <Tooltip.Content
                        className="tooltip-content bg-slate-900 text-white text-xs sm:text-sm rounded-lg p-3 sm:p-4 shadow-2xl border border-slate-700 max-w-[280px] sm:max-w-xs z-[100]"
                        sideOffset={8}
                        side="bottom"
                      >
                        <p className="leading-relaxed">{factor.tooltip}</p>
                        <Tooltip.Arrow className="fill-slate-900" />
                      </Tooltip.Content>
                    </Tooltip.Portal>
                  </Tooltip.Root>
                ))}
              </div>
            </div>

          </div>

          {/* Bottom Summary - Premium */}
          <div className="relative group mt-16">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600 rounded-3xl blur-2xl opacity-30 group-hover:opacity-40 transition-opacity duration-500"></div>
            <div className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 rounded-3xl p-10 sm:p-12 border border-white/10 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl"></div>

              <div className="relative text-center">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 mb-6">
                  <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-blue-300 uppercase tracking-wide">Complete Package</span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-4">
                  All 26 Factors Included, No Exceptions
                </h3>
                <p className="text-lg sm:text-xl text-blue-100 leading-relaxed max-w-4xl mx-auto">
                  <strong className="text-white">Every single item above is handled for you</strong>, explained in plain language, and documented in your Michigan project report. That's why <span className="text-blue-300">Michigan businesses and market leaders</span> trust our developer-led SEO approach.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }

        /* Radix UI Tooltip Animations */
        @keyframes tooltipSlideDownAndFade {
          from {
            opacity: 0;
            transform: translateY(-4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tooltipSlideUpAndFade {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes tooltipSlideRightAndFade {
          from {
            opacity: 0;
            transform: translateX(-4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes tooltipSlideLeftAndFade {
          from {
            opacity: 0;
            transform: translateX(4px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        .tooltip-content[data-state='delayed-open'][data-side='top'] {
          animation: tooltipSlideDownAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tooltip-content[data-state='delayed-open'][data-side='bottom'] {
          animation: tooltipSlideUpAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tooltip-content[data-state='delayed-open'][data-side='right'] {
          animation: tooltipSlideLeftAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }

        .tooltip-content[data-state='delayed-open'][data-side='left'] {
          animation: tooltipSlideRightAndFade 0.2s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </section>
    </Tooltip.Provider>
  )
}
