import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'SEO Services - Professional SEO Solutions for Indian Businesses | SEO Shouts',
  description: 'Comprehensive SEO services including Local SEO, eCommerce SEO, Technical SEO Audits, Link Building, SEO Website Development and Consulting. Get results that matter.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services',
  },
  openGraph: {
    title: 'SEO Services - Professional SEO Solutions for Indian Businesses | SEO Shouts',
    description: 'Comprehensive SEO services including Local SEO, eCommerce SEO, Technical SEO Audits, Link Building, and more. Results-driven SEO for Indian businesses.',
    url: 'https://seoshouts.com/services',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/services-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Services - Professional SEO Solutions',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Services - Professional SEO Solutions | SEO Shouts',
    description: 'Comprehensive SEO services for Indian businesses. Local SEO, eCommerce SEO, Technical Audits, and more.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/services-twitter-image.jpg'],
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

const services = [
  {
    id: 1,
    title: 'Local SEO',
    shortDescription: 'Dominate local search results in your city',
    description: 'Get found by customers in your area when they search for your services. Perfect for restaurants, clinics, salons, and local service businesses.',
    features: [
      'Google Business Profile optimization',
      'Local keyword research & targeting',
      'NAP consistency across directories',
      'Local citation building',
      'Review management strategy',
      'Local link building',
      'Google Maps ranking optimization',
      'Multi-location SEO (if applicable)'
    ],
    href: '/services/local-seo',
    icon: '📍',
    gradient: 'from-green-500 to-emerald-600',
    popular: false
  },
  {
    id: 2,
    title: 'eCommerce SEO',
    shortDescription: 'Boost online sales & product visibility',
    description: 'Optimize your online store to rank higher for product searches and drive more qualified traffic that converts into sales.',
    features: [
      'Product page optimization',
      'Category page SEO strategy',
      'Technical eCommerce SEO',
      'Product schema markup',
      'Internal linking optimization',
      'Site architecture planning',
      'Conversion rate optimization',
      'Shopping feed optimization'
    ],
    href: '/services/ecommerce-seo',
    icon: '🛒',
    gradient: 'from-blue-500 to-purple-600',
    popular: true
  },
  {
    id: 3,
    title: 'SEO Website Development',
    shortDescription: 'Build websites that rank & convert',
    description: 'Get a website designed from the ground up with SEO best practices, fast loading speeds, and conversion optimization built-in.',
    features: [
      'SEO-first website architecture',
      'Mobile-first responsive design',
      'Page speed optimization',
      'Technical SEO implementation',
      'Content management systems',
      'Schema markup integration',
      'Analytics & tracking setup',
      'Conversion optimization'
    ],
    href: '/services/seo-website-development',
    icon: '💻',
    gradient: 'from-purple-500 to-pink-600',
    popular: false
  },
  {
    id: 4,
    title: 'Technical SEO Audit',
    shortDescription: 'Uncover hidden issues killing your rankings',
    description: 'Comprehensive technical analysis to identify and fix the issues preventing your website from ranking higher in search results.',
    features: [
      'Complete site crawl & analysis',
      'Core Web Vitals assessment',
      'Mobile usability testing',
      'Site speed optimization report',
      'Schema markup audit',
      'URL structure analysis',
      'Internal linking review',
      'Actionable recommendations'
    ],
    href: '/services/technical-seo-audit',
    icon: '🔧',
    gradient: 'from-orange-500 to-red-600',
    popular: false
  },
  {
    id: 5,
    title: 'Link Building',
    shortDescription: 'High-quality backlink acquisition',
    description: 'Earn authoritative backlinks that boost your domain authority and search rankings through ethical, white-hat link building strategies.',
    features: [
      'Competitor backlink analysis',
      'High-quality link prospecting',
      'Guest posting opportunities',
      'Resource page link building',
      'Broken link building',
      'Digital PR & outreach',
      'Link quality assessment',
      'Monthly reporting & analysis'
    ],
    href: '/services/link-building',
    icon: '🔗',
    gradient: 'from-teal-500 to-cyan-600',
    popular: false
  },
  {
    id: 6,
    title: 'SEO Consulting',
    shortDescription: 'Strategic SEO guidance & team training',
    description: 'Get expert SEO advice, strategy development, and team training to build your internal SEO capabilities and avoid costly mistakes.',
    features: [
      'SEO strategy development',
      'Competitive analysis',
      'Keyword research & planning',
      'Content strategy guidance',
      'Team training & workshops',
      'SEO process documentation',
      'Monthly strategy calls',
      'Ongoing support & guidance'
    ],
    href: '/services/seo-consulting',
    icon: '💡',
    gradient: 'from-indigo-500 to-blue-600',
    popular: false
  }
]

const testimonials = [
  {
    name: "Priya Mehta",
    business: "Mehta Electronics, Mumbai",
    text: "Our local search traffic increased by 200% in just 3 months. Now we get calls directly from Google searches every day!",
    service: "Local SEO"
  },
  {
    name: "Rajesh Kumar",
    business: "Kumar Fashion Store",
    text: "SEOShouts transformed our online store. Sales from organic search increased by 150% in 6 months.",
    service: "eCommerce SEO"
  },
  {
    name: "Anjali Sharma",
    business: "Digital Marketing Agency",
    text: "The technical audit revealed issues we never knew existed. After fixes, our rankings improved significantly.",
    service: "Technical SEO Audit"
  }
]

export default function ServicesPage() {
  return (
    <>
      {/* Services Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            "name": "SEO Shouts",
            "url": "https://seoshouts.com",
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Services",
              "itemListElement": services.map(service => ({
                "@type": "Offer",
                "itemOffered": {
                  "@type": "Service",
                  "name": service.title,
                  "description": service.description
                }
              }))
            }
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
              SEO Services That Actually Work
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              No fluff. No empty promises. Just proven SEO strategies that help Indian businesses rank higher, get more traffic, and increase revenue.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <a
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl font-bold hover:scale-105 transition transform shadow-xl"
              >
                Get Your Free SEO Analysis
              </a>
              <a
                href="/meet-the-experts"
                className="px-8 py-4 bg-white border-2 border-blue-700 text-blue-700 rounded-xl font-bold hover:bg-blue-50 transition"
              >
                Meet Our Experts
              </a>
            </div>
            <p className="text-sm text-gray-500">
              ✅ Free analysis • ✅ No commitments • ✅ Actionable insights
            </p>
          </div>
        </section>

        {/* Services Grid */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service) => (
              <div
                key={service.id}
                className={`bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 overflow-hidden border-t-4 ${
                  service.popular ? 'border-purple-500 transform scale-105' : 'border-blue-500'
                } relative`}
              >
                {service.popular && (
                  <div className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    POPULAR
                  </div>
                )}
                
                <div className="p-8">
                  <div className={`w-16 h-16 bg-gradient-to-r ${service.gradient} rounded-xl flex items-center justify-center mb-6 mx-auto`}>
                    <span className="text-2xl">{service.icon}</span>
                  </div>
                  
                  <h3 className="text-2xl font-bold text-center mb-3 text-gray-900">
                    {service.title}
                  </h3>
                  
                  <p className="text-center text-gray-600 mb-4">
                    {service.shortDescription}
                  </p>
                  
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  
                  <div className="mb-6">
                    <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                    <ul className="space-y-2">
                      {service.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-start">
                          <span className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span className="text-sm text-gray-600">{feature}</span>
                        </li>
                      ))}
                      {service.features.length > 4 && (
                        <li className="text-sm text-blue-600 font-medium">
                          + {service.features.length - 4} more features
                        </li>
                      )}
                    </ul>
                  </div>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href={service.href}
                      className="w-full py-3 bg-blue-700 text-white rounded-lg font-semibold hover:bg-blue-800 transition text-center"
                    >
                      Learn More
                    </a>
                    <a
                      href="/contact"
                      className="w-full py-3 border-2 border-blue-700 text-blue-700 rounded-lg font-semibold hover:bg-blue-50 transition text-center"
                    >
                      Get Quote
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Why Choose Us Section */}
        <section className="bg-white py-16 mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Why Choose SEOShouts for Your SEO?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're not just another SEO agency. We're your partners in growth.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎯</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Results-Focused</h3>
                <p className="text-gray-600">We measure success by your business growth, not just rankings.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🇮🇳</span>
                </div>
                <h3 className="text-xl font-bold mb-2">India-Focused</h3>
                <p className="text-gray-600">We understand the Indian market, search behavior, and local competition.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">⚡</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Fast Results</h3>
                <p className="text-gray-600">See improvements in 30-90 days, not 6-12 months like others promise.</p>
              </div>
              
              <div className="text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">💬</span>
                </div>
                <h3 className="text-xl font-bold mb-2">Transparent</h3>
                <p className="text-gray-600">Monthly reports, regular calls, and honest communication always.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What Our Clients Say
            </h2>
            <p className="text-xl text-gray-600">
              Real results from real businesses across India
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div className="ml-4">
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-600">{testimonial.business}</p>
                  </div>
                </div>
                <p className="text-gray-700 mb-4 italic">"{testimonial.text}"</p>
                <div className="text-sm text-blue-600 font-semibold">
                  Service: {testimonial.service}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <section className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl mx-4 sm:mx-6 p-8 sm:p-12 text-center text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Dominate Search Results?
            </h2>
            <p className="text-xl mb-8 text-blue-100">
              Get a free SEO analysis and see exactly how we can help your business grow online.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="/contact"
                className="px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl"
              >
                🎯 Get Free Analysis
              </a>
              <a
                href="tel:+918094888157"
                className="px-8 py-4 bg-white/20 border border-white text-white rounded-xl font-bold hover:bg-white/30 transition"
              >
                📞 Call +91 8094888157
              </a>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
