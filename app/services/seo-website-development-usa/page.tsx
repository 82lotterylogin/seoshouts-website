import type { Metadata } from 'next'
import SeoChecklist from './SeoChecklist'
import PricingPackagesUSA from './PricingPackagesUSA'
import FaqSectionUSA from './FaqSectionUSA'
import CoreWebVitalsQuickCheck from './CoreWebVitalsQuickCheck'
import CoreWebVitalsScore from './CoreWebVitalsScore'
import AdvancedFeaturesSection from './AdvancedFeaturesSection'
import USAStatesSection from './USAStatesSection'

// Fetch latest blog posts from database
async function fetchLatestBlogPosts() {
  try {
    const { getDatabase } = await import('../../lib/database');
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
  title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
  description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services for American businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development-usa/',
  },
  openGraph: {
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services.',
    url: 'https://seoshouts.com/services/seo-website-development-usa/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-usa-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services USA by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-website-development-usa-twitter-image.jpg'],
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

export default async function SEOWebsiteDevelopmentServicePage() {
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
                "name": "Services",
                "item": "https://seoshouts.com/services/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "SEO Website Development USA",
                "item": "https://seoshouts.com/services/seo-website-development-usa/"
              }
            ]
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
            "name": "SEO Website Development Services United States",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for American businesses.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "SEO Website Development Services",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO-Optimized Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "eCommerce Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile-First Responsive Design"
                  }
                }
              ]
            }
          })
        }}
      />

      {/* FAQ Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes SEO website development different from regular web design?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Regular web design focuses on visuals; SEO website development focuses on visibility. We build every site structure, URL, and content block for speed, indexing, and conversions — ensuring design and SEO work hand in hand."
                }
              },
              {
                "@type": "Question",
                "name": "Why is SEO-first development important for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Without SEO foundations, your site might look great but remain invisible in search. SEO-first development ensures that your investment starts driving organic traffic and qualified leads from day one."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer SEO-friendly development for WordPress, Shopify, or custom builds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We work with WordPress, Shopify, and custom PHP/Next.js frameworks — all optimized for performance, Core Web Vitals, and structured data. You get both flexibility and ranking power."
                }
              },
              {
                "@type": "Question",
                "name": "How is SEO website development different from regular website development?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO website development ensures that SEO is integrated directly into the website's structure, content, and design from the very beginning. Unlike regular websites, which may need SEO optimization later, an SEO-developed website is built to rank from day one, with optimized URL structures, mobile-first design, fast load times, and SEO-friendly coding practices tailored for American businesses."
                }
              },
              {
                "@type": "Question",
                "name": "Will you help optimize my website for mobile users?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! All our websites are designed with mobile-first in mind. With a majority of internet traffic coming from mobile devices, we ensure that your US-focused website is responsive, loads quickly, and provides an optimal experience across all screen sizes and devices."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure that my website ranks well on Google?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our SEO website development process includes optimizing your site for critical SEO factors like page speed, core web vitals, structured data (schema markup), and internal linking. We also ensure your content is optimized for both user intent and Google's algorithms to help you rank higher for relevant search queries in American markets."
                }
              },
              {
                "@type": "Question",
                "name": "Will the website be optimized for local SEO and location-based searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We focus on local SEO optimization, which is crucial for American businesses targeting customers in specific geographic locations. From integrating location-based keywords to optimizing your Google My Business profile and creating location-specific landing pages, we ensure that your website ranks well for relevant local searches in the United States."
                }
              },
              {
                "@type": "Question",
                "name": "How do you optimize websites for Core Web Vitals and speed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We build lightweight pages, compress media, preload critical CSS, and use clean code. Our goal: a Lighthouse score of 90+ and <2.5s LCP — even on 4G networks in the United States."
                }
              },
              {
                "@type": "Question",
                "name": "Do you implement schema markup and structured data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We add JSON-LD schema for services, FAQs, breadcrumbs, and local business. This improves click-through rates and visibility in Google's rich results."
                }
              },
              {
                "@type": "Question",
                "name": "Can you migrate my existing site without losing SEO rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Definitely. We audit your old URLs, set up 301 redirects, preserve meta data, and ensure seamless indexing — so you keep your traffic while upgrading to a faster, cleaner site."
                }
              },
              {
                "@type": "Question",
                "name": "Do you build mobile-first websites?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Every site we create is fully responsive and optimized for mobile speed. With over 80% of American traffic on smartphones, this is a must for SEO success."
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
                "name": "What's included in each SEO website package and what's extra?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Each plan covers full design, development, and on-page SEO. Higher tiers include backend integration, eCommerce setup, and extended support. Extra costs apply only for add-ons like custom plugins, premium themes, or content writing."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to complete an SEO-optimized website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Typically 4–6 weeks, depending on features and content volume. You'll receive a detailed timeline after the audit."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to develop an SEO-optimized website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The development timeline depends on the complexity of your website, but typically, it takes about 4-6 weeks for a fully SEO-optimized website to be completed. This includes stages like research, design, development, content optimization, and testing. We'll keep you updated throughout the process to ensure the website aligns with your American business goals."
                }
              },
              {
                "@type": "Question",
                "name": "What kind of support do you offer after launch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Every project includes post-launch support — 30 days for static, 60 for dynamic, and 90 for eCommerce sites. You'll get technical assistance, minor edits, and SEO health checks."
                }
              },
              {
                "@type": "Question",
                "name": "Will you provide support after my website is developed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We provide post-launch support to ensure your American business website continues to perform well. This includes monitoring SEO performance, troubleshooting any issues, and offering guidance on how to update or add new content to maintain your rankings."
                }
              },
              {
                "@type": "Question",
                "name": "What payment options are available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Stripe, and wire transfers for US-based clients."
                }
              },
              {
                "@type": "Question",
                "name": "Will you help with SEO content and keyword research?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — we can handle everything from keyword strategy to SEO-optimized copywriting. Every page is crafted around real search intent and semantic keywords to boost visibility."
                }
              },
              {
                "@type": "Question",
                "name": "How can I track my website's performance after it goes live?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You'll receive Google Analytics and Search Console setup along with monthly reports highlighting impressions, clicks, rankings, and Core Web Vitals metrics."
                }
              },
              {
                "@type": "Question",
                "name": "Do you design websites optimized for local SEO and 'near me' searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We integrate Google Business Profile, NAP data, and local schema to help you rank for city- and region-specific searches."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide content for the website, or should I supply it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can assist with SEO-optimized content creation, including writing compelling copy with targeted keywords, meta descriptions, and headlines for American audiences. However, if you already have content, we can work with your existing material to optimize it for both SEO and user engagement."
                }
              },
              {
                "@type": "Question",
                "name": "Will my website be built with future SEO updates in mind?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We build websites with scalability and future-proofing in mind, ensuring they remain optimized even as SEO trends and Google algorithms evolve. Whether it's adopting new SEO techniques or preparing for major algorithm changes, your American business website will be ready for the future."
                }
              }
            ]
          })
        }}
      />

      <div className="min-h-screen bg-white">
        {/* Hero Section */}
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
                  <span className="text-sm font-medium text-white/90 tracking-wide">Expert Developer-Led Team</span>
                  <div className="w-px h-4 bg-white/20"></div>
                  <span className="text-sm font-medium text-blue-300">Over 13 Years of SEO Expertise in the United States</span>
                </div>
              </div>

              {/* Main Heading - Clean & Professional */}
              <div className="text-center mb-12 space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] tracking-tight">
                  <span className="block bg-gradient-to-r from-blue-400 via-blue-300 to-blue-400 bg-clip-text text-transparent">
                    SEO Website Development
                  </span>
                  <span className="block text-white mt-3">
                    Services USA – Build Websites That Rank and Convert
                  </span>
                </h1>

                <div className="space-y-4 text-base sm:text-lg text-slate-300 max-w-5xl mx-auto leading-relaxed">
                  <p>
                    Are you frustrated by <strong className="text-white">websites that look beautiful but never get found on Google USA</strong>?
                  </p>
                  <p>
                    Looking for genuine <strong className="text-white">SEO website development</strong> that delivers measurable results for your American business?
                  </p>
                  <p>
                    At SEOShouts, you don't just get a web developer—you work directly with an experienced SEO expert who brings <strong className="text-white">over 13 years of proven SEO expertise</strong> specifically for American and global markets.
                  </p>
                  <p>
                    Unlike typical agencies that design first and worry about SEO later, our <strong className="text-white">over a decade of hands-on SEO experience</strong> has taught us to build search optimisation into every line of code from Day 1.
                  </p>
                  <p>
                    We've witnessed Google's evolution, weathered algorithm updates, and consistently delivered ranking websites that drive real business growth across the United States.
                  </p>
                </div>
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

        {/* What Is SEO Website Development Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-white via-blue-50/30 to-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">The Foundation</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-slate-900">What Is</span>
                  <br/>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">SEO Website Development?</span>
                </h2>
              </div>

              {/* Content - Center Aligned */}
              <div className="max-w-5xl mx-auto space-y-6 mb-10 text-center">
                <p className="text-lg sm:text-xl text-gray-600 leading-relaxed">
                  SEO website development means creating a website that's built to rank — right from the code level.
                </p>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Instead of designing first and "doing SEO later," we combine smart coding, content architecture, and search-intent mapping during development itself.
                  Every page structure, heading tag, and line of code is optimized for speed, crawlability, and conversion.
                </p>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  From Core Web Vitals and schema markup to mobile responsiveness and internal linking, our goal is simple: <strong className="text-slate-900">build a site that both Google and your visitors love.</strong>
                </p>

                <p className="text-base sm:text-lg text-gray-600 leading-relaxed">
                  Whether you're a startup or a scaling brand, SEO-first development ensures your site loads fast, indexes correctly, and drives leads organically — without endless ad spend.
                </p>
              </div>

            </div>
          </div>
        </section>

        {/* Quick Core Web Vitals Check */}
        <CoreWebVitalsQuickCheck />

        {/* What Sets Us Apart Section */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-gray-50">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                  <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                  </svg>
                  <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">What Makes Us Different</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                  <span className="text-slate-900">What Sets Our SEO Website Development</span>
                  <br/>
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Apart in the United States?</span>
                </h2>
                <p className="text-lg sm:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
                  Over <strong>a decade of SEO practice</strong>, we've analysed and rebuilt hundreds of American business websites.
                </p>
                <p className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto mt-4 leading-relaxed">
                  Most were held back by the same recurring issues—slow loading on American mobile networks, missing schema markup, poor URL structures, and content that doesn't match American search behaviour.
                </p>
              </div>

              {/* Problems vs Solutions Grid */}
              <div className="grid lg:grid-cols-2 gap-8">
                {/* Problems Column */}
                <div className="relative">
                  <div className="absolute -top-4 -left-4 w-24 h-24 bg-red-200/30 rounded-full blur-2xl"></div>
                  <div className="bg-white rounded-3xl p-8 shadow-xl border border-red-100 relative z-10 h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">❌</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-red-700">Common Problems</h3>
                    </div>

                    <p className="text-sm font-semibold text-red-600 mb-6 uppercase tracking-wide">Issues we've solved over the years:</p>

                    <div className="space-y-5">
                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Sites taking <strong className="text-red-700">12+ seconds</strong> to load on US mobile networks <span className="text-red-600">(Google gives up after 3 seconds)</span></p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Beautiful designs that <strong className="text-red-700">Google's bots can't understand</strong> or crawl properly</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-red-700">Zero local SEO</strong> optimisation for American cities and "near me" searches</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Missing <strong className="text-red-700">Core Web Vitals</strong> optimisation for American smartphone users</p>
                        </div>
                      </div>

                      <div className="group bg-red-50/50 hover:bg-red-50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-red-100/50">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-red-600 font-bold text-xl">⚠️</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5">Content written for <strong className="text-red-700">global audiences</strong>, not American search intent</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Solutions Column */}
                <div className="relative">
                  <div className="absolute -top-4 -right-4 w-24 h-24 bg-blue-200/30 rounded-full blur-2xl"></div>
                  <div className="bg-gradient-to-br from-blue-50 to-white rounded-3xl p-8 shadow-xl border border-blue-200 relative z-10 h-full">
                    <div className="flex items-center gap-3 mb-8">
                      <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
                        <span className="text-2xl">✅</span>
                      </div>
                      <h3 className="text-2xl sm:text-3xl font-bold text-blue-700">Our Solutions</h3>
                    </div>

                    <p className="text-sm font-semibold text-blue-600 mb-6 uppercase tracking-wide">With SEOShouts' over a decade of SEO expertise:</p>

                    <div className="space-y-5">
                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">⚡</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Lightning-fast loading</strong> optimised for American 4G/5G networks</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">📱</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Fully mobile-first design</strong> tested on popular American smartphone brands</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🔗</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Clean, SEO-ready URLs</strong> using American English and local search terms</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🎯</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Complete technical SEO foundation</strong> built from over a decade of proven strategies</p>
                        </div>
                      </div>

                      <div className="group bg-white hover:bg-blue-50/50 rounded-xl p-4 transition-all duration-300 hover:shadow-md border border-blue-100">
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                            <span className="text-blue-600 font-bold text-xl">🔒</span>
                          </div>
                          <p className="text-gray-700 leading-relaxed pt-1.5"><strong className="text-blue-700">Robust security, HTTPS</strong> implementation, and American privacy compliance</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom Stats Bar */}
              <div className="mt-12 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-8 shadow-xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center text-white">
                  <div className="pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">100+</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Websites Delivered</div>
                  </div>
                  <div className="pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">98%</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Client Satisfaction</div>
                  </div>
                  <div className="pb-6 md:pb-0">
                    <div className="text-4xl font-bold mb-2">90%</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Page 1 in 90 Days</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold mb-2">13+ Years</div>
                    <div className="text-blue-100 text-sm uppercase tracking-wide">Industry Experience</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Core Web Vitals Perfect Score Section */}
        <CoreWebVitalsScore />

        {/* Pricing Section */}
        <section id="pricing" className="py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50">
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
                  Transparent Pricing That Reflects<br />
                  <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    True SEO Value
                  </span>
                </h2>
                <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                  Transparent pricing with expert SEO built into every package
                </p>
              </div>

              {/* Pricing Cards Grid - Horizontal Scroll on Mobile */}
              <PricingPackagesUSA />

              <div className="mt-12 text-center">
                <p className="text-slate-600">
                  <strong>Note:</strong> All prices are clearly mentioned with no hidden costs. Proper invoicing provided for your business records.
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
                    Meet the dedicated professionals behind your USA SEO success. Our team combines technical expertise with deep market knowledge to build websites that rank and convert.
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

        {/* Development Process Section */}
        <section className="relative py-16 sm:py-24 bg-white overflow-hidden">
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Our Process</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className="text-slate-900">Our Proven SEO Website</span>
                <br/>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Development Process</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-2">
                Refined Over the Years
              </p>
              <p className="text-base text-gray-500 max-w-2xl mx-auto">
                A transparent, step-by-step process that puts your business goals first
              </p>
            </div>

            {/* Timeline Container */}
            <div className="max-w-6xl mx-auto relative">
              {/* Vertical Timeline Line - Hidden on mobile, visible on lg */}
              <div className="hidden lg:block absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-gradient-to-b from-blue-200 via-blue-400 to-blue-200"></div>

              <div className="space-y-16">
                {/* Phase 1 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          1
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Strategic Foundation</h3>
                          <p className="text-sm text-blue-600 font-semibold">Built on Years of Experience</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our <strong>seo development company</strong> approach begins with comprehensive research:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🎯</span>
                          <p className="text-gray-700 lg:text-right"><strong>Comprehensive competitor analysis</strong> using advanced SEO tools</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔍</span>
                          <p className="text-gray-700 lg:text-right"><strong>Local keyword research</strong> incorporating Hindi/vernacular trends</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏗️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Site architecture planning</strong> using proven principles</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">📊</span>
                    </div>
                  </div>
                </div>

                {/* Phase 2 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Icon - Left */}
                  <div className="hidden lg:flex lg:justify-end lg:pr-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">💻</span>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content - Right */}
                  <div className="lg:pl-12">
                    <div className="inline-block bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          2
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Expert Development</h3>
                          <p className="text-sm text-blue-600 font-semibold">Implementation</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Where our <strong>seo website developer</strong> expertise converges:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚙️</span>
                          <p className="text-gray-700"><strong>Standards-compliant coding</strong> with SEO considerations</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🗄️</span>
                          <p className="text-gray-700"><strong>Custom database design</strong> optimised for speed</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📱</span>
                          <p className="text-gray-700"><strong>Mobile-first responsive design</strong> tested across devices</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 3 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          3
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Content & SEO Integration</h3>
                          <p className="text-sm text-blue-600 font-semibold">Expertise Applied</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Our <strong>web dev seo</strong> specialists ensure ranking success:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">✍️</span>
                          <p className="text-gray-700 lg:text-right"><strong>SEO-optimised content creation</strong> using proven methodologies</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🏷️</span>
                          <p className="text-gray-700 lg:text-right"><strong>Meta tag optimisation</strong> based on CTR patterns</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">📍</span>
                          <p className="text-gray-700 lg:text-right"><strong>Local SEO implementation</strong> with "near me" strategies</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">📝</span>
                    </div>
                  </div>
                </div>

                {/* Phase 4 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Icon - Left */}
                  <div className="hidden lg:flex lg:justify-end lg:pr-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-50 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">✅</span>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Content - Right */}
                  <div className="lg:pl-12">
                    <div className="inline-block bg-white rounded-3xl p-8 shadow-xl border-2 border-blue-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          4
                        </div>
                        <div>
                          <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">Quality Assurance</h3>
                          <p className="text-sm text-blue-600 font-semibold">Testing Protocols</p>
                        </div>
                      </div>

                      <p className="text-gray-600 mb-4 text-sm leading-relaxed">Rigorous testing ensures flawless <strong>seo friendly web development</strong>:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🧪</span>
                          <p className="text-gray-700"><strong>Cross-device compatibility</strong> testing across American devices</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">⚡</span>
                          <p className="text-gray-700"><strong>Core Web Vitals optimisation</strong> using proven techniques</p>
                        </div>
                        <div className="flex items-start gap-3 bg-blue-50/50 rounded-lg p-3">
                          <span className="text-blue-600 text-lg flex-shrink-0">🔒</span>
                          <p className="text-gray-700"><strong>Security vulnerability scanning</strong> and compliance checks</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Phase 5 */}
                <div className="relative grid lg:grid-cols-2 gap-8 items-center">
                  {/* Content - Left */}
                  <div className="lg:text-right lg:pr-12">
                    <div className="inline-block lg:float-right bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 max-w-xl">
                      <div className="flex lg:flex-row-reverse items-start gap-4 mb-4">
                        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm text-white rounded-2xl flex items-center justify-center font-bold text-2xl shadow-lg flex-shrink-0">
                          5
                        </div>
                        <div className="lg:text-right">
                          <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Launch & Optimisation</h3>
                          <p className="text-sm text-blue-100 font-semibold">Lifetime SEO Partnership</p>
                        </div>
                      </div>

                      <p className="text-blue-50 mb-4 text-sm leading-relaxed">Your <strong>website development and seo</strong> journey continues:</p>

                      <div className="space-y-2.5 text-sm">
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🚀</span>
                          <p className="text-white lg:text-right"><strong>Strategic launch monitoring</strong> with expert protocols</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">📈</span>
                          <p className="text-white lg:text-right"><strong>Performance tracking setup</strong> with metrics that matter</p>
                        </div>
                        <div className="flex lg:flex-row-reverse items-start gap-3 bg-white/10 backdrop-blur-sm rounded-lg p-3">
                          <span className="text-white text-lg flex-shrink-0">🔄</span>
                          <p className="text-white lg:text-right"><strong>Continuous optimisation</strong> adapted to Google updates</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Timeline Dot */}
                  <div className="hidden lg:flex absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-blue-600 rounded-full border-4 border-white shadow-lg z-10"></div>

                  {/* Icon - Right */}
                  <div className="hidden lg:flex lg:pl-12">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-3xl flex items-center justify-center shadow-lg">
                      <span className="text-5xl">🎯</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* SEO Checklist Section */}
        <SeoChecklist />

        {/* Success Stories Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">American Client Success Stories</h2>
              <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                Real results from real American businesses
              </p>
            </div>

            {/* Horizontal scroll on mobile */}
            <div className="overflow-x-auto scrollbar-hide -mx-4 px-4 sm:mx-0 sm:px-0">
              <div className="flex md:grid md:grid-cols-3 gap-8 min-w-max md:min-w-0">
              {/* AGP Nature Villa */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex-shrink-0 w-[320px] sm:w-[360px] md:w-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">🏡</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-agpnaturevilla-com/wn1w46uas0?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">AGP Nature Villa</h3>
                <p className="text-gray-600 mb-6">Successfully developed and optimized with proven SEO strategies for the American real estate market.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">86</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '86%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">96</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '96%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Calcshark */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-blue-200 flex-shrink-0 w-[320px] sm:w-[360px] md:w-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-calcshark-com/spkdcuvhgh?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">Calcshark</h3>
                <p className="text-gray-600 mb-6">Built with enterprise-grade SEO architecture to dominate their industry niche in American markets.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-blue-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">97</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '97%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* SEOShouts */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 border-2 border-gray-200 flex-shrink-0 w-[320px] sm:w-[360px] md:w-auto">
                <div className="flex items-center justify-between mb-6">
                  <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center">
                    <span className="text-2xl text-white">🚀</span>
                  </div>
                  <a href="https://pagespeed.web.dev/analysis/https-seoshouts-com-services-ecommerce-seo/0c2nuniv9k?form_factor=desktop" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:text-blue-700 text-sm font-semibold flex items-center gap-1">
                    Check Score →
                  </a>
                </div>
                <h3 className="text-2xl font-bold mb-3">SEOShouts</h3>
                <p className="text-gray-600 mb-6">Our own website showcases SEO expertise, ranking for competitive keywords across the United States.</p>

                {/* Core Web Vitals Scores */}
                <div className="bg-white rounded-xl p-4 border border-gray-200">
                  <h4 className="text-sm font-bold text-gray-700 mb-4">Core Web Vitals Score</h4>

                  {/* Mobile Score */}
                  <div className="mb-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">📱 Mobile</span>
                      <span className="text-lg font-bold text-green-600">94</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '94%'}}></div>
                    </div>
                  </div>

                  {/* Desktop Score */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-semibold text-gray-600">💻 Desktop</span>
                      <span className="text-lg font-bold text-green-600">100</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-green-500 to-green-600 h-3 rounded-full transition-all duration-500" style={{width: '100%'}}></div>
                    </div>
                  </div>
                </div>
              </div>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Section - Modern Design */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-slate-50 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-20 right-0 w-96 h-96 bg-blue-200/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-0 w-96 h-96 bg-indigo-200/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            {/* Header */}
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-sm shadow-sm rounded-full mb-6 border border-slate-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Why Choose Us</span>
              </div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-6 leading-tight">
                SEOShouts vs.<br />
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                  Typical Agency
                </span>
              </h2>
              <p className="text-xl text-slate-600 max-w-3xl mx-auto">
                See why over 13 years of experience makes all the difference in SEO website development
              </p>
            </div>

            {/* Comparison Cards Grid */}
            <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

              {/* Card 1 - SEO Experience */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">SEO Experience</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> 13+ years proven track record</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Often 1-3 years, no portfolio</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 2 - Developer Leadership */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Developer Leadership</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> Coding + SEO expertise combined</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Designers with basic SEO knowledge</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 3 - Algorithm Updates */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Algorithm Updates</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> Thrived through years of Google changes</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Struggle with each update</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 4 - American Market Knowledge */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">American Market Expertise</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> Deep local expertise from years of practice</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Generic global strategies</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 5 - Custom Development */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Custom Development</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> 100% custom, no platform limitations</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Template-based with SEO plugins</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card 6 - Pricing Transparency */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-400/20 to-indigo-400/20 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-slate-200 h-full">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-3">Pricing Transparency</h3>
                  <div className="space-y-3">
                    <div className="flex items-start gap-2">
                      <span className="text-green-500 text-xl flex-shrink-0">✓</span>
                      <p className="text-sm text-slate-700"><strong className="text-blue-600">SEOShouts:</strong> Clear upfront pricing, no surprises</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <span className="text-red-500 text-xl flex-shrink-0">✗</span>
                      <p className="text-sm text-slate-500"><strong>Others:</strong> Hidden costs and surprise fees</p>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Bottom CTA */}
            <div className="mt-16 text-center">
              <div className="inline-flex flex-col sm:flex-row items-center gap-4">
                <a
                  href="#pricing"
                  className="px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold text-lg hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 inline-flex items-center gap-2"
                >
                  <span>See Our Packages</span>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"/>
                  </svg>
                </a>
                <a
                  href="/contact/"
                  className="px-8 py-4 bg-white text-slate-900 border-2 border-slate-300 rounded-xl font-semibold text-lg hover:border-blue-600 hover:text-blue-600 transition-all duration-300 hover:-translate-y-0.5"
                >
                  Contact Us
                </a>
              </div>
            </div>

          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="py-16 sm:py-24 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-white shadow-sm rounded-full mb-6 border border-slate-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                </svg>
                <span className="text-sm font-semibold text-slate-700 uppercase tracking-wide">Why Choose Us</span>
              </div>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className="text-slate-900">Why Choose SEOShouts Web Development Expertise</span>
                <br/>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">Over Generic Agencies?</span>
              </h2>
            </div>

            <div className="max-w-5xl mx-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
                {/* Unmatched Technical Authority */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Unmatched Technical and SEO Authority</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Coding</strong> foundation combined with <strong>over a decade of hands-on SEO experience</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>No platform dependencies</strong> – 100% custom solutions without licensing fees or template limitations</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>American market specialisation</strong> developed through <strong>years of local client success stories</strong></span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Algorithm update experience</strong> – we've successfully navigated every major Google change over the years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Direct communication</strong> in plain American English with <strong>expert-level technical guidance</strong></span></li>
                  </ul>
                </div>

                {/* Proven Track Record */}
                <div className="bg-blue-50 rounded-2xl p-8 border border-blue-200">
                  <h3 className="text-2xl font-bold mb-6 text-blue-800">Proven Track Record</h3>
                  <ul className="space-y-3">
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Hundreds of successful websites</strong> launched and optimised for American businesses</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Consistent ranking improvements</strong> achieved through algorithm updates and market changes</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Long-term client relationships</strong> built on <strong>sustained SEO performance</strong> over years</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Industry expertise</strong> across multiple verticals gained through years of diverse projects</span></li>
                    <li className="flex items-start"><span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span><span className="text-gray-700"><strong>Documented case studies</strong> showing <strong>measurable ROI</strong> from SEO website development investments</span></li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced Features Section - Interactive */}
        <AdvancedFeaturesSection />

        {/* Custom Development Advantages Section */}
        <section className="relative py-16 sm:py-24 bg-gradient-to-br from-slate-50 via-white to-slate-50 overflow-hidden">
          {/* Background decorative elements */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-blue-100/20 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-indigo-100/20 rounded-full blur-3xl"></div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-full mb-6 border border-blue-200">
                <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd"/>
                </svg>
                <span className="text-sm font-semibold text-blue-700 uppercase tracking-wide">Custom Development</span>
              </div>
              <h2 className="text-4xl sm:text-5xl font-bold mb-6 leading-tight">
                <span className="text-slate-900">Custom Development Advantages for</span>
                <br/>
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">American Businesses</span>
              </h2>
            </div>

            <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Complete Control */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 to-indigo-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 hover:border-blue-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Complete Control & Flexibility</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">No platform limitations</strong> or feature restrictions that hurt SEO</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Unlimited customisation</strong> possibilities based on your business needs</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">No monthly licensing fees</strong> or subscription costs (only domain and hosting if needed)</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Full ownership</strong> of code and functionality</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Custom integrations</strong> with American business tools, and payment gateways.</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Scalable architecture</strong> that adapts to business growth and seasonal demands</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Superior Performance */}
              <div className="group relative">
                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 rounded-2xl blur-xl group-hover:blur-2xl transition-all duration-300 opacity-0 group-hover:opacity-100"></div>
                <div className="relative bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-slate-200 hover:border-indigo-300">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/>
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-900">Superior Performance for American Networks</h3>
                  </div>
                  <ul className="space-y-4">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Optimised codebase</strong> without bloated plugins that slow American connections</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Faster loading times</strong> through efficient coding and American CDN integration</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Better security</strong> with custom-built protection against common threats</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Unique functionality</strong> that competitors using templates can't replicate</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                        <svg className="w-4 h-4 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"/>
                        </svg>
                      </div>
                      <span className="text-slate-700 leading-relaxed"><strong className="text-slate-900">Direct database optimisation</strong> for complex queries and high-traffic periods</span>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <FaqSectionUSA />

        {/* Latest from the Blog Section */}
        <section className="py-12 sm:py-16 bg-white">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-7xl mx-auto">

              {/* Section Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/5 rounded-full mb-6">
                  <span className="text-sm font-semibold text-blue-600">Expert SEO Insights</span>
                </div>
                <h2 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6">
                  <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                    Latest SEO
                  </span>
                  <br />
                  <span className="text-blue-600">
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
                          <div className="w-full h-full bg-gradient-to-br from-blue-600/20 to-green-600/20 flex items-center justify-center">
                            <span className="text-4xl sm:text-5xl" aria-hidden="true">
                              {index === 0 ? '📈' : index === 1 ? '🎯' : '📊'}
                            </span>
                          </div>
                        )}
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          {index === 0 ? 'LATEST' : index === 1 ? 'FEATURED' : 'POPULAR'}
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight line-clamp-2">
                          {post.title}
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          {post.excerpt || 'Expert SEO insights and strategies to help your business grow online.'}
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
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
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-600/20 text-sm"
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
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-blue-600/20 to-green-600/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">📈</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-blue-600 text-white text-xs font-semibold rounded-full">
                          LATEST
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-blue-600 transition-colors duration-300 leading-tight">
                          Expert SEO Insights Coming Soon
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Master the latest SEO techniques with our comprehensive guides covering technical optimization and content strategy.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">SE</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">SEO Expert</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-blue-600/20 text-sm"
                            aria-label="Visit our blog"
                          >
                            Visit Blog
                          </a>
                        </div>
                      </div>
                    </article>

                    <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 ">
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-green-600/20 to-red-600/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">🎯</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-green-600 text-white text-xs font-semibold rounded-full">
                          FEATURED
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-green-600 transition-colors duration-300 leading-tight">
                          Website Performance Optimization
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Learn how to optimize your website's Core Web Vitals and achieve lightning-fast page speeds for better rankings.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">WO</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">Web Optimizer</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-green-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-green-600/20 text-sm"
                            aria-label="Visit our blog"
                          >
                            Visit Blog
                          </a>
                        </div>
                      </div>
                    </article>

                    <article className="group relative bg-gray-50 rounded-2xl sm:rounded-3xl overflow-hidden hover:shadow-2xl transition-all duration-500 border border-gray-100 ">
                      <div className="relative overflow-hidden h-48 sm:h-56 bg-gradient-to-br from-orange-600/20 to-red-600/20 flex items-center justify-center">
                        <span className="text-4xl sm:text-5xl" aria-hidden="true">📊</span>
                        <div className="absolute top-4 right-4 px-3 py-1 bg-red-600 text-white text-xs font-semibold rounded-full">
                          POPULAR
                        </div>
                      </div>
                      <div className="p-6 sm:p-8">
                        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-3 group-hover:text-red-600 transition-colors duration-300 leading-tight">
                          Digital Marketing Insights
                        </h3>
                        <p className="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base line-clamp-3">
                          Stay informed about the latest digital marketing trends and tactics that deliver measurable results.
                        </p>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                              <span className="text-white text-xs font-bold">DM</span>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm">Digital Marketer</p>
                              <p className="text-xs text-gray-500">Publishing Soon</p>
                            </div>
                          </div>
                          <a
                            href="/blog/"
                            className="px-4 py-2 bg-white text-red-600 rounded-lg font-semibold hover:shadow-lg transform hover:scale-105 transition-all duration-300 border border-red-600/20 text-sm"
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

        {/* USA States Coverage Section */}
        <USAStatesSection />

        {/* Final CTA Section - Modern Design */}
        <section className="relative py-8 sm:py-12 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden opacity-10">
            <div className="absolute -top-40 -right-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
            <div className="absolute -bottom-40 -left-32 w-96 h-96 bg-blue-400 rounded-full blur-3xl"></div>
          </div>

          <div className="container mx-auto px-4 sm:px-6 relative z-10">
            <div className="max-w-6xl mx-auto text-center">
              <h2 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
                Ready to Launch Your American Business with Our Expert SEO Website Developers?
              </h2>
              <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-3xl mx-auto">
                Don't settle for a website that just looks good. Partner with the United States' specialist <strong className="text-white">SEO web development company</strong> that delivers measurable results.
              </p>

              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 sm:p-10 mb-8 max-w-5xl mx-auto border border-white/20">
                <h3 className="text-2xl sm:text-3xl font-bold text-white mb-8">What Happens Next:</h3>
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="flex gap-4 text-left">
                    <div className="w-12 h-12 bg-white text-blue-900 rounded-lg flex items-center justify-center font-bold flex-shrink-0 shadow-lg text-lg">1</div>
                    <div className="flex-1">
                      <h4 className="font-bold text-white mb-2 text-base sm:text-lg">Free 30-Minute Strategy Call</h4>
                      <p className="text-sm sm:text-base text-blue-100 leading-relaxed">We analyze your current situation, discuss your American market goals, and outline a custom SEO development roadmap.</p>
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
                  href="/contact/"
                  className="group px-8 py-4 bg-yellow-400 text-gray-900 rounded-xl font-bold hover:bg-yellow-300 transition-all duration-300 shadow-2xl hover:shadow-yellow-400/50 hover:scale-105 inline-flex items-center justify-center gap-2"
                >
                  🎯 Get Your Expert USA SEO Consultation
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
                  <span>Free USA Market Audit</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>13+ Years Expertise</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                  </svg>
                  <span>Proven Results</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
