import type { Metadata } from 'next'
import ContactForm from '../components/ContactForm'

export const metadata: Metadata = {
  title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
  description: 'Ready to boost your search rankings? Contact SEO Shouts for a free SEO analysis. Call +91-809-488-8157 or email contact@seoshouts.com. Based in Rajasthan, serving globally.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/contact/',
  },
  openGraph: {
    title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
    description: 'Ready to boost your search rankings? Contact SEO Shouts for expert SEO services.',
    url: 'https://seoshouts.com/contact/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/contact-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Contact SEO Shouts - Professional SEO Services',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Contact Us - Get Your Free SEO Analysis | SEO Shouts',
    description: 'Ready to boost your search rankings? Contact SEO Shouts for expert SEO services.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/contact-twitter-image.jpg'],
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

export default function ContactPage() {
  return (
    <>
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
                "name": "How quickly will I see SEO results?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Most clients see improvements in 30-90 days, with significant results in 3-6 months. Timeline depends on competition and current website status."
                }
              },
              {
                "@type": "Question",
                "name": "Do you work with small businesses?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely! We work with businesses of all sizes, from local startups to large enterprises. Our strategies are tailored to your budget and goals."
                }
              },
              {
                "@type": "Question",
                "name": "What makes SEO Shouts different from other SEO agencies?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We focus on results, not just rankings. Based in India, we understand local markets while delivering global-standard SEO services with transparent reporting and honest communication."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer contracts or month-to-month SEO services?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We offer both options. Most clients prefer 6-month commitments for better results, but we also have month-to-month plans available."
                }
              }
            ]
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
              Ready to Dominate Search Results?
            </h1>
            <p className="text-xl text-gray-600 mb-6 max-w-3xl mx-auto">
              Get your free SEO analysis and discover exactly how we can help your business rank higher, get more traffic, and increase revenue.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm font-medium">Free Analysis</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm font-medium">No Commitments</span>
              </div>
              <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                <span className="text-green-500 mr-2">✅</span>
                <span className="text-sm font-medium">24hr Response</span>
              </div>
            </div>
          </div>
        </section>

        <div className="container mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            
            {/* Contact Form */}
            <div className="lg:col-span-2">
              <ContactForm />
            </div>

            {/* Contact Information */}
            <div className="lg:col-span-1 space-y-8">
              {/* Quick Contact */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Contact</h3>
                
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Call Us</h4>
                      <a href="tel:+918094888157" className="text-blue-600 hover:text-blue-800 font-medium">
                        +91-809-488-8157
                      </a>
                      <p className="text-sm text-gray-500 mt-1">Mon-Fri, 9 AM - 6 PM IST</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Email Us</h4>
                      <div className="space-y-1">
                        <div>
                          <a href="mailto:contact@seoshouts.com" className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                            contact@seoshouts.com
                          </a>
                        </div>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">24hr response time</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">Location</h4>
                      <p className="text-gray-600 text-sm">
                        Rajasthan, India
                      </p>
                      <p className="text-sm text-gray-500 mt-1">Serving clients globally</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-xl p-8">
                <h3 className="text-xl font-bold text-gray-900 mb-6">Connect With Us</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://www.facebook.com/seoshouts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-800">Facebook</span>
                  </a>

                  <a
                    href="https://www.linkedin.com/company/seoshouts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg hover:bg-blue-100 transition"
                  >
                    <div className="w-8 h-8 bg-blue-700 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-blue-800">LinkedIn</span>
                  </a>

                  <a
                    href="https://x.com/seo_shouts"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                  >
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-gray-800">X (Twitter)</span>
                  </a>

                  <a
                    href="https://www.reddit.com/r/seoshouts/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg hover:bg-orange-100 transition"
                  >
                    <div className="w-8 h-8 bg-orange-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0zm5.01 4.744c.688 0 1.25.561 1.25 1.249a1.25 1.25 0 0 1-2.498.056l-2.597-.547-.8 3.747c1.824.07 3.48.632 4.674 1.488.308-.309.73-.491 1.207-.491.968 0 1.754.786 1.754 1.754 0 .716-.435 1.333-1.01 1.614a3.111 3.111 0 0 1 .042.52c0 2.694-3.13 4.87-7.004 4.87-3.874 0-7.004-2.176-7.004-4.87 0-.183.015-.366.043-.534A1.748 1.748 0 0 1 4.028 12c0-.968.786-1.754 1.754-1.754.463 0 .898.196 1.207.49 1.207-.883 2.878-1.43 4.744-1.487l.885-4.182a.342.342 0 0 1 .14-.197.35.35 0 0 1 .238-.042l2.906.617a1.214 1.214 0 0 1 1.108-.701zM9.25 12C8.561 12 8 12.562 8 13.25c0 .687.561 1.248 1.25 1.248.687 0 1.248-.561 1.248-1.249 0-.688-.561-1.249-1.249-1.249zm5.5 0c-.687 0-1.248.561-1.248 1.25 0 .687.561 1.248 1.249 1.248.688 0 1.249-.561 1.249-1.249 0-.687-.562-1.249-1.25-1.249z"/>
                      </svg>
                    </div>
                    <span className="text-sm font-medium text-orange-800">Reddit</span>
                  </a>
                </div>
              </div>

              {/* Office Hours */}
              <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-8 text-white">
                <h3 className="text-xl font-bold mb-4">Office Hours</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Monday - Friday</span>
                    <span>9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Saturday</span>
                    <span>10:00 AM - 4:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Sunday</span>
                    <span>Closed</span>
                  </div>
                </div>
                <p className="text-sm text-blue-100 mt-4">
                  All times are in Indian Standard Time (IST)
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 sm:px-6 mt-16">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How quickly will I see results?</h3>
                <p className="text-gray-600 text-sm">Most clients see improvements in 30-90 days, with significant results in 3-6 months. Timeline depends on competition and current website status.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you work with small businesses?</h3>
                <p className="text-gray-600 text-sm">Absolutely! We work with businesses of all sizes, from local startups to large enterprises. Our strategies are tailored to your budget and goals.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What makes you different from other SEO agencies?</h3>
                <p className="text-gray-600 text-sm">We focus on results, not just rankings. Based in India, we understand local markets while delivering global-standard SEO services.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you offer contracts or month-to-month?</h3>
                <p className="text-gray-600 text-sm">We offer both options. Most clients prefer 6-month commitments for better results, but we also have month-to-month plans available.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
