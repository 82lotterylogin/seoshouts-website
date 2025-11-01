import type { Metadata } from 'next'
import SeoChecklist from './SeoChecklist'
import PricingPackages from './PricingPackages'
import FaqSection from './FaqSection'
import CoreWebVitalsQuickCheck from './CoreWebVitalsQuickCheck'
import CoreWebVitalsScore from './CoreWebVitalsScore'

// Fetch latest blog posts from database
async function fetchLatestBlogPosts() {
  try {
    const { getDatabase } = await import('../../../lib/database');
    const db = getDatabase();

    const articles = db.prepare(`
      SELECT
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        a.created_at,
        auth.name as author_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 3
    `).all() as any[];

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featured_image: article.featured_image,
      published_at: article.published_at,
      created_at: article.created_at,
      author: {
        name: article.author_name
      }
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'SEO Website Development Washington | Fast, Search-Ready Sites That Rank',
  description: "Partner with Washington's leading SEO Website Development Company building lightning-fast, search-optimized sites that rank, convert, and scale. Get a free performance check today.",
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/usa/washington/seo-website-development/',
  },
  openGraph: {
    title: 'SEO Website Development Company in Washington – High-Performance Websites That Rank',
    description: '98% client satisfaction. 6+ years of web projects delivered. All sites launch with "Good" Core Web Vitals scores and full Google Search Console indexation.',
    url: 'https://seoshouts.com/usa/washington/seo-website-development/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/images/services/washington-seo-website-development-service.jpg',
        width: 1200,
        height: 630,
        alt: 'Washington SEO Website Development Services by SEOShouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Washington SEO Website Development – Build High-Performance Sites',
    description: '98% client satisfaction. 10+ years delivering optimized websites for Washington businesses.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/images/services/washington-seo-website-development-service.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

// FAQ data for Washington market

export default async function WashingtonSEOWebsiteDevelopmentPage() {
  // Fetch latest blog posts from database
  const blogPosts = await fetchLatestBlogPosts();

  return (
    <>
      {/* Breadcrumb Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Home",
                "item": "https://seoshouts.com/"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "USA",
                "item": "https://seoshouts.com/usa/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "Washington",
                "item": "https://seoshouts.com/usa/washington/seo-website-development/"
              }
            ]
          })
        }}
      />

      {/* LocalBusiness Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "ProfessionalService",
            "name": "SEOShouts - Washington SEO Website Development",
            "description": "Expert SEO website development services for Washington businesses with 6+ years of proven expertise serving Washington and the competitive Washington market.",
            "url": "https://seoshouts.com/usa/washington/seo-website-development/",
            "areaServed": {
              "@type": "State",
              "name": "Washington",
              
            },
            "provider": {
              "@type": "Organization",
              "name": "SEOShouts"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.9",
              "reviewCount": "127"
            }
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Washington SEO Website Development Services",
            "description": "Professional SEO website development for Washington businesses including mobile-first design, AI optimization, Core Web Vitals enhancement, and enterprise-grade technical SEO.",
            "image": "https://seoshouts.com/images/services/washington-seo-website-development-service.jpg",
            "provider": {
              "@type": "Organization",
              "name": "SEOShouts"
            },
            "areaServed": {
              "@type": "State",
              "name": "Washington"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Packages",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized Static Website"
                  },
                  "price": "100",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized Website with Backend"
                  },
                  "price": "199",
                  "priceCurrency": "USD"
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO Optimized eCommerce Website"
                  },
                  "price": "299",
                  "priceCurrency": "USD"
                }
              ]
            }
          })
        }}
      />

      {/* Organization Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SEOShouts",
            "url": "https://seoshouts.com/",
            "logo": "https://seoshouts.com/logo.png",
            "description": "Professional SEO and website development services",
            "address": {
              "@type": "PostalAddress",
              "addressCountry": "US"
            },
            "contactPoint": {
              "@type": "ContactPoint",
              "contactType": "Customer Service",
              "email": "seoshouts@gmail.com"
            },
            "sameAs": [
              "https://twitter.com/seo_shouts"
            ]
          })
        }}
      />

      {/* WebPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "SEO Website Development Washington",
            "description": "Partner with Washington's leading SEO Website Development Company building lightning-fast, search-optimized sites that rank, convert, and scale.",
            "url": "https://seoshouts.com/usa/washington/seo-website-development/",
            "inLanguage": "en-US",
            "isPartOf": {
              "@type": "WebSite",
              "name": "SEOShouts",
              "url": "https://seoshouts.com/"
            }
          })
        }}
      />

      {/* FAQPage Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "How is SEO website development different from regular website development?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO website development ensures that SEO is integrated directly into the website's structure, content, and design from the very beginning. Unlike regular websites, which may need SEO optimization later, an SEO-developed website is built to rank from day one, with optimized URL structures, mobile-first design, fast load times, and SEO-friendly coding practices tailored for Washington businesses."
                }
              },
              {
                "@type": "Question",
                "name": "Will you help optimize my website for mobile users?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! All our websites are designed with mobile-first in mind. With a majority of internet traffic coming from mobile devices, we ensure that your Washington-focused website is responsive, loads quickly, and provides an optimal experience across all screen sizes and devices."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure that my website ranks well on Google?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our SEO website development process includes optimizing your site for critical SEO factors like page speed, core web vitals, structured data (schema markup), and internal linking. We also ensure your content is optimized for both user intent and Google's algorithms to help you rank higher for relevant search queries in Washington markets."
                }
              },
              {
                "@type": "Question",
                "name": "Will the website be optimized for local SEO and location-based searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We focus on local SEO optimization, which is crucial for Washington businesses targeting customers in specific geographic locations. From integrating location-based keywords to optimizing your Google My Business profile and creating location-specific landing pages, we ensure that your website ranks well for relevant local searches in Washington."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to develop an SEO-optimized website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The development timeline depends on the complexity of your website, but typically, it takes about 4-6 weeks for a fully SEO-optimized website to be completed. This includes stages like research, design, development, content optimization, and testing. We'll keep you updated throughout the process to ensure the website aligns with your Washington business goals."
                }
              },
              {
                "@type": "Question",
                "name": "Do you also handle the technical aspects of SEO for my website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, technical SEO is a crucial part of the SEO website development process. We focus on optimizing the back-end structure of your website, ensuring that it's crawlable, fast-loading, secure (with HTTPS), and follows best practices for technical SEO. This includes creating an XML sitemap, optimizing robots.txt, and setting up structured data to help search engines understand your website better."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure that my website is fast and optimized for performance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Website speed is crucial for SEO and user experience. We use a combination of image compression, code minification, caching strategies, and CDN integration to ensure your website loads quickly. Additionally, we optimize your website for Core Web Vitals, which is an important ranking factor for Google."
                }
              },
              {
                "@type": "Question",
                "name": "Will you provide support after my website is developed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We provide post-launch support to ensure your Washington business website continues to perform well. This includes monitoring SEO performance, troubleshooting any issues, and offering guidance on how to update or add new content to maintain your rankings."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide content for the website, or should I supply it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can assist with SEO-optimized content creation, including writing compelling copy with targeted keywords, meta descriptions, and headlines for Washington audiences. However, if you already have content, we can work with your existing material to optimize it for both SEO and user engagement."
                }
              },
              {
                "@type": "Question",
                "name": "Will my website be built with future SEO updates in mind?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We build websites with scalability and future-proofing in mind, ensuring they remain optimized even as SEO trends and Google algorithms evolve. Whether it's adopting new SEO techniques or preparing for major algorithm changes, your Washington business website will be ready for the future."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section - Premium Modern Design */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-10 sm:py-14 lg:py-18">
          {/* Sophisticated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

          {/* Gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="max-w-6xl mx-auto">

              {/* Premium Badge */}
              <div className="flex justify-center mb-8 animate-fade-in">
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 backdrop-blur-xl rounded-full border border-white/10 shadow-lg">
                  <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse shadow-lg shadow-blue-400/50"></div>
                  <span className="text-sm font-medium text-white/90 tracking-wide">Trusted by 100+ Businesses</span>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span className="text-sm font-medium text-blue-300">98% Satisfaction Rate</span>
                </div>
              </div>

              {/* Main Heading - Clean & Professional */}
              <div className="text-center mb-12 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                    SEO Website Development
                  </span>
                  <span className="block text-white mt-3">
                    Washington
                  </span>
                </h1>

                <p className="text-xl sm:text-2xl text-slate-300 font-light max-w-3xl mx-auto leading-relaxed">
                  Build high-performance websites that <span className="text-white font-medium">rank</span>, <span className="text-white font-medium">convert</span>, and <span className="text-white font-medium">scale</span>
                </p>

                <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto">
                  Technically optimized, lightning-fast websites for Washington businesses ready to dominate search results from day one
                </p>
              </div>

              {/* CTA Buttons - Modern Design */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
                <a
                  href="#core-web-vitals-check"
                  className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-lg font-semibold text-lg hover:from-blue-500 hover:to-blue-400 transition-all duration-300 shadow-xl shadow-blue-900/50 hover:shadow-2xl hover:shadow-blue-900/60 hover:-translate-y-0.5 inline-flex items-center gap-3"
                >
                  <span>Get a Free Performance Check</span>
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                <a
                  href="#pricing"
                  className="px-8 py-4 bg-white/5 backdrop-blur-xl text-white border border-white/10 rounded-lg font-semibold text-lg hover:bg-white/10 transition-all duration-300 hover:-translate-y-0.5"
                >
                  View Pricing & Packages
                </a>
              </div>

              {/* Trust Metrics - Clean Card Design */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {[
                  { value: "100+", label: "Websites Delivered", icon: "🚀" },
                  { value: "98%", label: "Client Satisfaction", icon: "⭐" },
                  { value: "90%", label: "Page 1 in 90 Days", icon: "📈" },
                  { value: "13+ Years", label: "Industry Experience", icon: "🏆" }
                ].map((metric, index) => (
                  <div key={index} className="relative group">
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-indigo-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                    <div className="relative bg-white/5 backdrop-blur-xl border border-white/10 rounded-xl p-6 text-center hover:bg-white/10 transition-all duration-300">
                      <div className="text-3xl mb-2">{metric.icon}</div>
                      <div className="text-3xl sm:text-4xl font-bold text-white mb-2">{metric.value}</div>
                      <div className="text-sm text-slate-400 font-medium">{metric.label}</div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Additional Trust Line */}
              <div className="mt-12 text-center">
                <p className="text-sm text-slate-400">
                  <span className="inline-flex items-center gap-2 bg-white/5 backdrop-blur-xl border border-white/10 rounded-full px-4 py-2">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                    </svg>
                    All sites launch with "Good" Core Web Vitals & full Google Search Console indexation
                  </span>
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Quick Core Web Vitals Check */}
        <CoreWebVitalsQuickCheck />

        {/* Why Washington Businesses Choose Our SEO Development Services */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Washington's Choice</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  Why Washington Businesses Choose<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Our SEO Development Services
                  </span>
                </h2>
              </div>

              {/* Content */}
              <div className="max-w-4xl mx-auto text-center">
                <div className="space-y-6 text-lg sm:text-xl text-slate-700 leading-relaxed mb-12">
                  <p>
                    In Washington's hyper-competitive digital landscape—from <strong className="text-slate-900">Washington startups</strong> to <strong className="text-slate-900">Washington e-commerce brands</strong> and <strong className="text-slate-900">Washington service providers</strong>—your website is your most critical marketing asset.
                  </p>
                  <p>
                    We're not just another <strong className="text-blue-600">SEO development company</strong>. We're specialists in building search-ready, AI-friendly websites that combine cutting-edge design, clean code, and comprehensive technical SEO—including <strong className="text-blue-600">AI SEO strategies, Generative SEO markup, and content structures</strong> designed for SGE, Gemini, Perplexity, and other GenAI search systems.
                  </p>
                </div>

                {/* Feature Highlights */}
                <div className="grid sm:grid-cols-3 gap-8 max-w-3xl mx-auto">
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">AI-Ready Development</p>
                      <p className="text-sm text-slate-600">Built for GenAI search systems</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Clean Code</p>
                      <p className="text-sm text-slate-600">Technical SEO excellence</p>
                    </div>
                  </div>
                  <div className="flex flex-col items-center text-center gap-3">
                    <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                      <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd"/>
                      </svg>
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 mb-1">Washington Focused</p>
                      <p className="text-sm text-slate-600">Local market expertise</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Core Web Vitals Perfect Score Section */}
        <CoreWebVitalsScore />

        {/* Why Choose Section - Premium Modern Design */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-slate-100 rounded-full mb-6">
                  <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Why Choose Us</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  What Makes Us Washington's<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Top SEO Web Development Company
                  </span>
                </h2>
              </div>

              {/* Two Column Layout - 50/50 Split */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">

                {/* Left Column */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Proven Track Record:</h3>
                  <ul className="space-y-3 mb-8">
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Successfully delivered <strong>100+ optimized business websites</strong> for clients</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Consistent Core Web Vitals "Good" scores (LCP, INP, CLS) for every launch</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>90% of sites are fully indexed by Google within 72 hours of Search Console submission</span>
                    </li>
                  </ul>

                  <h3 className="text-2xl font-bold text-slate-900 mb-4">Next-Gen Technical Excellence:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Every site passes Google's mobile-friendliness test and delivers perfect Core Web Vitals at launch</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Clean, semantic HTML5 and CSS for crawlability and fast load speeds</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Comprehensive schema markup—including LocalBusiness, Organization, Service, FAQ, and AI-rich entity blocks—built for both Google and AI answer engines</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>XML sitemaps, robots.txt, canonical tags, internal link maps, and hierarchical, SEO-optimized URL structures from day one</span>
                    </li>
                  </ul>
                </div>

                {/* Right Column */}
                <div>
                  <h3 className="text-2xl font-bold text-slate-900 mb-4">E-E-A-T and AI/Generative SEO-Driven Content Architecture:</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Embedded Expertise, Experience, Authoritativeness, and Trustworthiness signals on every page</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Programmatic, scalable content structures for Washington cities/services with entity optimization for AI/SGE</span>
                    </li>
                    <li className="flex items-start gap-3 text-slate-700">
                      <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                      </svg>
                      <span>Internal linking strategies proven to boost geo and topical authority—including "AI-citable" blocks and FAQs</span>
                    </li>
                  </ul>
                </div>

              </div>

            </div>
          </div>
        </section>

        {/* Pricing Section - Premium Design */}
        <section id="pricing" className="py-12 sm:py-16 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-20">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8.433 7.418c.155-.103.346-.196.567-.267v1.698a2.305 2.305 0 01-.567-.267C8.07 8.34 8 8.114 8 8c0-.114.07-.34.433-.582zM11 12.849v-1.698c.22.071.412.164.567.267.364.243.433.468.433.582 0 .114-.07.34-.433.582a2.305 2.305 0 01-.567.267z"/>
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Transparent Pricing</span>
                </div>
                <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                  SEO Development Plans Built for<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Washington Success
                  </span>
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Professional SEO web development with no hidden fees. Choose the package that matches your business goals.
                </p>
              </div>

              {/* Pricing Cards Grid - Horizontal Scroll on Mobile */}
              <PricingPackages />

              <div className="mt-12 text-center">
                <p className="text-slate-600">
                  <strong>Note:</strong> All prices transparently listed with no hidden fees. Professional invoicing for Washington business accounting.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 py-12 sm:py-16">
          {/* Sophisticated background pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiMyNTYzZWIiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAtNC40MTggMy41ODItOCA4LThzOCAzLjU4MiA4IDgtMy41ODIgOC04IDgtOC0zLjU4Mi04LTh6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-40"></div>

          {/* Gradient overlays */}
          <div className="absolute inset-0">
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-7xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">

                {/* Left Side - Content */}
                <div>
                  <div className="mb-6">
                    <span className="text-sm font-bold text-blue-400 uppercase tracking-wider">TEAM</span>
                  </div>
                  <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                    Experts SEO developers who deliver results.
                  </h2>
                  <p className="text-lg text-blue-100 leading-relaxed">
                    Meet the dedicated professionals behind your Washington SEO success. Our team combines technical expertise with deep market knowledge to build websites that rank and convert.
                  </p>
                </div>

                {/* Right Side - Team Members */}
                <div className="grid grid-cols-2 gap-6 max-w-lg mx-auto lg:ml-auto lg:mr-0">

                  {/* Rohit Sharma */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="overflow-hidden h-48 sm:h-56">
                      <img
                        src="/images/team/rohit-sharma.jpg"
                        alt="Rohit Sharma"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center bg-white">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Rohit Sharma</h3>
                      <p className="text-sm text-blue-600 font-medium leading-tight">SEO Developer, Strategist & Founder</p>
                    </div>
                  </div>

                  {/* Ajay Porwal */}
                  <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group">
                    <div className="overflow-hidden h-48 sm:h-56">
                      <img
                        src="/images/team/ajay-porwal.jpg"
                        alt="Ajay Porwal"
                        className="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="p-4 text-center bg-white">
                      <h3 className="text-lg font-bold text-slate-900 mb-1">Ajay Porwal</h3>
                      <p className="text-sm text-blue-600 font-medium">Digital Marketing Expert</p>
                    </div>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>

        {/* Comprehensive Development Process Section */}
        <section className="py-8 sm:py-12 bg-gradient-to-b from-white to-slate-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                  <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Our Process</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    Our Comprehensive SEO Friendly Web Development Process
                  </span>
                </h2>
                <p className="text-lg text-slate-600 max-w-3xl mx-auto">
                  We follow a battle-tested methodology for <strong>SEO friendly web development</strong> that ensures your Washington business launches with maximum search visibility.
                </p>
              </div>

              {/* Phase 1 */}
              <div className="group relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl blur opacity-50"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        1
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Phase 1: Strategic SEO Development Planning & Audit</h3>
                      <p className="text-blue-600 font-semibold">Discovery & Market Analysis</p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                        Discovery & Market Analysis:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Comprehensive keyword research targeting Washington search intent and user behavior
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Competitive gap analysis across your specific Washington market segments
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Technical site architecture planning using programmatic SEO principles
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Schema markup strategy tailored to your industry and local markets
                        </li>
                      </ul>
                    </div>

                    <div className="pt-4 border-t border-slate-200">
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-indigo-600 rounded-full"></div>
                        What You Get:
                      </h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:border-blue-300 transition-colors">
                          <p className="text-sm text-slate-700 leading-relaxed">Detailed keyword map with search volumes and competition analysis</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:border-blue-300 transition-colors">
                          <p className="text-sm text-slate-700 leading-relaxed">Site structure blueprint optimized for crawlability and user experience</p>
                        </div>
                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-5 border border-blue-200/50 hover:border-blue-300 transition-colors">
                          <p className="text-sm text-slate-700 leading-relaxed">Technical specifications document outlining all SEO requirements</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 2 */}
              <div className="group relative mb-12">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-indigo-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl blur opacity-50"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-indigo-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        2
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Phase 2: Expert SEO Friendly Website Development & Build</h3>
                      <p className="text-indigo-600 font-semibold">Professional Development by Washington-Focused Teams</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
                        Professional Development:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Mobile-first, responsive design tested across all devices and browsers
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Performance optimization: image compression, lazy loading, minified code for sub-2-second load times
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          LocalBusiness schema implementation with precise Washington geo-coordinates
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Structured internal linking supporting both user journeys and search engine authority signals
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-indigo-600 to-blue-600 rounded-full"></div>
                        Technical SEO Fundamentals:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="flex-1">Clean hierarchical URL structure</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="flex-1">Proper heading hierarchy (H1, H2, H3) with natural keyword integration</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="flex-1">Optimized meta titles and descriptions under 60/155 characters</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="flex-1">Alt text for all images, Open Graph tags for social sharing</span>
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          <span className="flex-1">Core Web Vitals optimization (LCP &lt; 2.5s, CLS &lt; 0.1, INP &lt; 200ms)</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              {/* Phase 3 */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-blue-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-500 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white border border-slate-200 rounded-2xl p-8 hover:border-blue-300 hover:shadow-xl transition-all duration-300">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="relative">
                      <div className="absolute inset-0 bg-gradient-to-br from-blue-600 to-blue-600 rounded-2xl blur opacity-50"></div>
                      <div className="relative w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-600 rounded-2xl flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                        3
                      </div>
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900 mb-1">Phase 3: Launch, Validation & Search Engine Handover</h3>
                      <p className="text-blue-600 font-semibold">Pre-Launch Quality Assurance & Search Engine Submission</p>
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-600 rounded-full"></div>
                        Pre-Launch Quality Assurance:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Google Structured Data Testing Tool validation
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          PageSpeed Insights testing (mobile and desktop)
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Cross-browser compatibility testing (Chrome, Safari, Firefox, Edge)
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Broken link checks and redirect validation
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Mobile usability verification
                        </li>
                      </ul>
                    </div>

                    <div>
                      <h4 className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                        <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-blue-600 rounded-full"></div>
                        Search Engine Submission & Support:
                      </h4>
                      <ul className="space-y-3">
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          XML sitemap generation and Search Console submission
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Robots.txt configuration for optimal crawl budget
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Initial indexation verification within 72 hours
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          Performance baseline documentation
                        </li>
                        <li className="flex items-start gap-3 text-slate-700">
                          <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                          </svg>
                          30-day technical support included with all packages
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* On-Page SEO Checklist Section - Interactive Two-Column */}
        <SeoChecklist />

        {/* FAQs Section with Form */}
        <FaqSection />

        {/* Washington Cities Section - Accordion Design */}
        

        {/* Latest from the Blog Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/5 rounded-full mb-6">
                  <span className="text-sm font-semibold text-primary">Expert SEO Insights</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Latest SEO
                  </span>
                  <br />
                  <span className="text-primary">
                    Strategies & Tips
                  </span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed px-4">
                  Stay ahead with cutting-edge SEO strategies and marketing insights from industry experts
                </p>
              </div>

              {/* Blog Posts Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                {blogPosts.length > 0 ? (
                  blogPosts.map((post: any, index: number) => (
                    <article key={post.id} className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      {/* Featured Image */}
                      <div className="relative overflow-hidden h-48 sm:h-56">
                        {post.featured_image ? (
                          <img
                            src={post.featured_image}
                            alt={post.title || 'Blog post image'}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          />
                        ) : (
                          <div className="w-full h-full bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl" aria-hidden="true">
                              {index === 0 ? '📈' : index === 1 ? '🎯' : '📊'}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                          {index === 0 ? 'LATEST' : index === 1 ? 'FEATURED' : 'POPULAR'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          {post.excerpt || 'Expert SEO insights and strategies to help your business grow online.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">
                                {(post.author?.name || 'SEO Expert').split(' ').map((n: string) => n[0]).join('').substring(0, 2)}
                              </span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">
                                {post.author?.name || 'SEO Expert'}
                              </p>
                              <p className="text-xs text-gray-500">
                                {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', {
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <a
                            href={`/blog/${post.slug}/`}
                            className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-primary/20 text-sm"
                            aria-label={`Read ${post.title}`}
                          >
                            Read More
                          </a>
                        </div>
                      </div>
                    </article>
                  ))
                ) : (
                  // Fallback content when no blog posts are available
                  <>
                    <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-primary/20 to-secondary/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">📈</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-primary text-white text-xs font-semibold rounded-full">
                          LATEST
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-primary transition-colors duration-300 leading-tight">
                          Expert SEO Insights Coming Soon
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Master the latest SEO techniques with our comprehensive guides covering technical optimization and content strategy.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">SE</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">SEO Expert</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-primary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-primary/20 text-sm"
                            aria-label="Visit our blog"
                          >
                            Visit Blog
                          </a>
                        </div>
                      </div>
                    </article>

                    <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-secondary/20 to-accent/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">🎯</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-xs font-semibold rounded-full">
                          FEATURED
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-secondary transition-colors duration-300 leading-tight">
                          SEO Strategies & Tips
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Discover the latest SEO strategies that are driving organic traffic and conversions for businesses worldwide.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">SS</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">SEO Strategist</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-secondary rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-secondary/20 text-sm"
                            aria-label="Visit our blog"
                          >
                            Visit Blog
                          </a>
                        </div>
                      </div>
                    </article>

                    <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100">
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-accent/20 to-primary/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">📊</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-accent text-white text-xs font-semibold rounded-full">
                          POPULAR
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-accent transition-colors duration-300 leading-tight">
                          Digital Marketing Insights
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Stay informed about the latest digital marketing trends and tactics that deliver measurable results.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">DM</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">Digital Marketer</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-accent rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-accent/20 text-sm"
                            aria-label="Visit our blog"
                          >
                            Visit Blog
                          </a>
                        </div>
                      </div>
                    </article>
                  </>
                )}
              </div>

              {/* View All Button */}
              <div className="text-center mt-12">
                <a
                  href="/blog/"
                  className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  View All Articles
                  <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </a>
              </div>

            </div>
          </div>
        </section>

        {/* Final CTA Section - Modern Design */}
        <section className="relative py-8 sm:py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Launch Your Washington Business with Our Expert SEO Website Developers?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Don't settle for a website that just looks good. Partner with Washington's specialist <strong className="text-white">SEO web development company</strong> that delivers measurable results.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-10 mb-8 max-w-5xl mx-auto border border-white/20">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">What Happens Next:</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4 text-left">
                    <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-lg">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 text-base sm:text-lg">Free 30-Minute Strategy Call</h4>
                      <p className="text-sm sm:text-base text-blue-100 leading-relaxed">We analyze your current situation, discuss your Washington market goals, and outline a custom SEO development roadmap.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-left">
                    <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-lg">2</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 text-base sm:text-lg">Transparent Project Proposal</h4>
                      <p className="text-sm sm:text-base text-blue-100 leading-relaxed">Detailed scope, timeline, and investment with no hidden fees or surprises.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-left">
                    <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-lg">3</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 text-base sm:text-lg">Dedicated Development Team</h4>
                      <p className="text-sm sm:text-base text-blue-100 leading-relaxed">Your assigned SEO web developer and strategist begin immediately with clear communication throughout.</p>
                    </div>
                  </div>
                  <div className="flex gap-4 text-left">
                    <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-lg">4</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 text-base sm:text-lg">Launch & Results Tracking</h4>
                      <p className="text-sm sm:text-base text-blue-100 leading-relaxed">Watch your rankings, traffic, and conversions improve month over month with transparent reporting.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row justify-center gap-4 mb-8">
                <a
                  href="/contact/?region=ca"
                  className="group px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  🎯 Get Your Expert Washington SEO Consultation
                  <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
              </div>

              <div className="flex flex-wrap justify-center gap-6 text-white">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Free Washington Market Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Washington Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Proven 825% ROI</span>
                </div>
              </div>
            </div>
          </div>
        </section>

      </div>
    </>
  )
}
