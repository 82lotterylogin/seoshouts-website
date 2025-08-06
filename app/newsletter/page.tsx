import type { Metadata } from 'next'
import NewsletterPageForm from '../components/NewsletterPageForm'

export const metadata: Metadata = {
  title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
  description: 'Get the latest SEO news, tips, and strategies delivered to your inbox every week. Join 5,000+ digital marketers who trust SEOShouts for actionable SEO insights.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/newsletter',
  },
  openGraph: {
    title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
    description: 'Join 5,000+ digital marketers getting weekly SEO insights. Free actionable tips, case studies, and industry updates.',
    url: 'https://seoshouts.com/newsletter',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/newsletter-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEOShouts Newsletter - Weekly SEO Tips',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Newsletter - Free Weekly SEO Tips & Updates | SEO Shouts',
    description: 'Join 5,000+ digital marketers getting weekly SEO insights. Free actionable tips and case studies.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/newsletter-twitter-image.jpg'],
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

const newsletterBenefits = [
  {
    icon: '📈',
    title: 'Weekly SEO Updates',
    description: 'Latest algorithm changes, ranking factors, and search engine news delivered every Tuesday.'
  },
  {
    icon: '💡',
    title: 'Actionable Tips',
    description: 'Step-by-step SEO strategies you can implement immediately to improve your rankings.'
  },
  {
    icon: '📊',
    title: 'Case Studies',
    description: 'Real client results and behind-the-scenes looks at successful SEO campaigns.'
  },
  {
    icon: '🛠️',
    title: 'Free Tools & Resources',
    description: 'Exclusive access to SEO templates, checklists, and tools not available anywhere else.'
  },
  {
    icon: '🎯',
    title: 'Indian Market Focus',
    description: 'SEO strategies specifically tailored for Indian businesses and Hindi keyword optimization.'
  },
  {
    icon: '⚡',
    title: 'Quick Reads',
    description: 'Under 5 minutes to read each newsletter. No fluff, just actionable insights.'
  }
]

export default function NewsletterPage() {
  return (
    <>
      {/* Newsletter Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "SEO Newsletter",
            "description": "Weekly SEO tips and updates for digital marketers",
            "url": "https://seoshouts.com/newsletter",
            "mainEntity": {
              "@type": "Newsletter",
              "name": "SEOShouts Weekly",
              "description": "Weekly SEO insights, tips, and industry updates",
              "publisher": {
                "@type": "Organization",
                "name": "SEO Shouts",
                "url": "https://seoshouts.com"
              }
            }
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
                The SEO Newsletter That Actually Helps
              </h1>
              <p className="text-xl text-gray-600 mb-6">
                Join 5,000+ digital marketers getting weekly SEO insights, case studies, and actionable tips delivered every Tuesday.
              </p>
              
              {/* Newsletter Signup Form - USING EXISTING COMPONENT */}
              <NewsletterPageForm />

              <div className="flex flex-wrap justify-center gap-4">
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm font-medium">5,000+ Subscribers</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm font-medium">Every Tuesday</span>
                </div>
                <div className="flex items-center bg-white rounded-full px-4 py-2 shadow-md">
                  <span className="text-green-500 mr-2">✅</span>
                  <span className="text-sm font-medium">5-Min Read</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* What You'll Get Section */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              What You'll Get Every Week
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              No fluff. No outdated advice. Just practical SEO insights you can use immediately.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsletterBenefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow">
                <div className="text-4xl mb-4">{benefit.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{benefit.title}</h3>
                <p className="text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Sample Newsletter Content */}
        <section className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl mx-4 sm:mx-6 p-8 sm:p-12 text-white mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-center">
              📧 Sample Newsletter Content
            </h2>
            
            <div className="bg-white/10 rounded-xl p-6 mb-8">
              <h3 className="text-xl font-bold mb-4">🔍 This Week in SEO (Sample)</h3>
              <div className="space-y-4 text-blue-100">
                <div>
                  <h4 className="font-semibold text-white">📈 Algorithm Update Alert</h4>
                  <p className="text-sm">Google rolled out a minor core update affecting local search results. Here's what changed and how to adapt...</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">💡 Quick Win Tip</h4>
                  <p className="text-sm">Add FAQ schema to your product pages. Takes 10 minutes, can boost rankings by 15-20% (with step-by-step guide).</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">📊 Case Study</h4>
                  <p className="text-sm">How we increased a Mumbai restaurant's local search traffic by 300% in 60 days using these 3 tactics...</p>
                </div>
                <div>
                  <h4 className="font-semibold text-white">🛠️ Free Resource</h4>
                  <p className="text-sm">Download: "Technical SEO Checklist for Indian Websites" (exclusive for subscribers)</p>
                </div>
              </div>
            </div>
            
            <div className="text-center">
              <p className="text-xl mb-6">Like what you see? Get content like this every Tuesday.</p>
              <a
                href="#subscribe"
                className="inline-block px-8 py-4 bg-white text-blue-700 rounded-xl font-bold hover:bg-gray-100 transition shadow-xl"
              >
                📧 Subscribe Now - Free
              </a>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="container mx-auto px-4 sm:px-6">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">
              Newsletter FAQ
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How often do you send emails?</h3>
                <p className="text-gray-600 text-sm">Once a week, every Tuesday morning. No daily spam, no random promotional emails.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I unsubscribe anytime?</h3>
                <p className="text-gray-600 text-sm">Absolutely! One-click unsubscribe link in every email. No questions asked, no guilt trips.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Do you share my email address?</h3>
                <p className="text-gray-600 text-sm">Never. We hate spam as much as you do. Your email stays private and secure with us.</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Is the content India-specific?</h3>
                <p className="text-gray-600 text-sm">We cover global SEO trends but always include insights specific to Indian markets and Hindi SEO.</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
