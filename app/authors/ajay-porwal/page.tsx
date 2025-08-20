import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Ajay Porwal — Digital Marketing Expert & Ads Specialist | SEOShouts',
  description: 'Ajay Porwal is a digital marketing expert and ads specialist at SEOShouts. Expert in paid advertising, social media marketing, and data-driven campaign optimization with proven ROI results.',
  keywords: 'Ajay Porwal digital marketing, ads specialist, paid advertising expert, social media marketing, PPC expert, Google Ads specialist, Facebook Ads expert, digital marketing consultant',
  authors: [{ name: 'Ajay Porwal' }],
  creator: 'Ajay Porwal',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: '/authors/ajay-porwal',
  },
  openGraph: {
    title: 'Ajay Porwal — Digital Marketing Expert & Ads Specialist | SEOShouts',
    description: 'Ajay Porwal is a digital marketing expert and ads specialist at SEOShouts. Expert in paid advertising, social media marketing, and data-driven campaign optimization.',
    url: '/authors/ajay-porwal',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/ajay-porwal.jpg',
        width: 400,
        height: 400,
        alt: 'Ajay Porwal — Digital Marketing Expert & Ads Specialist',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'Ajay Porwal — Digital Marketing Expert & Ads Specialist | SEOShouts',
    description: 'Ajay Porwal is a digital marketing expert and ads specialist at SEOShouts. Expert in paid advertising, social media marketing, and data-driven campaign optimization.',
    images: ['/images/team/ajay-porwal.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
}

import { getAllStories } from '../../lib/storyblok'

export default async function AjayPorwalAuthorPage() {
  // Get actual articles from Storyblok
  const allBlogPosts = await getAllStories("blog_post");
  // Filter articles by Ajay Porwal
  const ajayArticles = allBlogPosts.filter((post: any) => 
    post.content.author?.content?.name === "Ajay Porwal" || 
    post.content.author?.content?.slug === "ajay-porwal"
  );

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          {/* Author Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              
              {/* Author Image & Basic Info */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="/images/team/ajay-porwal.jpg"
                    alt="Ajay Porwal"
                    className="w-32 h-32 lg:w-40 lg:h-40 rounded-full object-cover border-4 border-white/20 shadow-xl"
                  />
                  <div className="absolute -bottom-2 -right-2">
                    <div className="w-8 h-8 bg-green-500 border-3 border-white rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd"></path>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Author Details */}
              <div className="flex-1">
                <div className="mb-4">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-600 text-white">
                    Digital Marketing Expert
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  Ajay Porwal
                </h1>
                
                <p className="text-xl text-purple-100 mb-6 leading-relaxed max-w-3xl">
                  Passionate digital marketing expert specializing in paid advertising, social media marketing, 
                  and data-driven campaign optimization. Expert in turning ad spend into measurable ROI and 
                  building profitable marketing funnels for businesses.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-white">8+</div>
                    <div className="text-sm text-purple-200">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">50+</div>
                    <div className="text-sm text-purple-200">Clients Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{ajayArticles.length}</div>
                    <div className="text-sm text-purple-200">Articles Published</div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="mailto:ajay@seoshouts.com"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email
                  </a>
                  <a 
                    href="https://linkedin.com/in/ajayporwal/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                    </svg>
                    LinkedIn
                  </a>
                  <a 
                    href="tel:+918094888157"
                    className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 rounded-lg font-semibold hover:bg-white/20 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content - Two Column Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Content - Articles */}
          <div className="lg:col-span-2">
            {/* Articles Header */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest Articles</h2>
              <p className="text-gray-600">Expert insights on digital marketing, paid advertising, and social media strategy.</p>
            </div>

            {/* Real Articles from Storyblok */}
            {ajayArticles.length > 0 ? (
              <div className="space-y-8">
                {ajayArticles.map((article: any, index) => (
                  <article key={article.uuid} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        {index === 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800">
                            Latest
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                          {article.content.category || 'Digital Marketing'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-purple-600 transition-colors">
                        <a href={`/blog/${article.slug}`}>{article.content.title}</a>
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.content.excerpt || 'Expert insights on digital marketing and paid advertising strategies.'}
                      </p>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <time dateTime={article.first_published_at || article.created_at}>
                          {new Date(article.first_published_at || article.created_at).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </time>
                        <span>5 min read</span>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 text-center">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Articles Coming Soon</h3>
                <p className="text-gray-600">Ajay is working on publishing expert digital marketing insights and strategies. Check back soon!</p>
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-purple-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar - Author Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              
              {/* Author Bio */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About Ajay</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Passionate digital marketing expert specializing in paid advertising, social media marketing, 
                  and data-driven campaign optimization. Expert in turning ad spend into measurable ROI.
                </p>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span className="text-gray-600">Rajasthan, India</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2m-8 0v10a2 2 0 002 2h4a2 2 0 002-2V6"></path>
                    </svg>
                    <span className="text-gray-600">8+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-gray-600">Digital Marketing Expert, SEOShouts</span>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {['Paid Advertising', 'Google Ads', 'Facebook Ads', 'Social Media Marketing', 'Campaign Optimization', 'ROI Analysis'].map((skill) => (
                    <span key={skill} className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Favorite Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Google Ads', 'Facebook Ads Manager', 'Google Analytics', 'Google Tag Manager', 'Hootsuite', 'Canva'].map((tool) => (
                    <span key={tool} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>

              {/* Experience Highlights */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Career Highlights</h3>
                <div className="space-y-3">
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Digital Marketing Expert</div>
                    <div className="text-gray-600">SEOShouts</div>
                    <div className="text-gray-500">2020 - Present</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">PPC Specialist</div>
                    <div className="text-gray-600">Digital Marketing Agency</div>
                    <div className="text-gray-500">2018 - 2020</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Social Media Manager</div>
                    <div className="text-gray-600">Marketing Solutions Inc.</div>
                    <div className="text-gray-500">2016 - 2018</div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg border border-purple-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Need help with digital marketing campaigns or paid advertising? Let's discuss your project.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:ajay@seoshouts.com"
                    className="flex items-center justify-center gap-2 w-full bg-purple-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-purple-700 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email Me
                  </a>
                  <a 
                    href="tel:+918094888157"
                    className="flex items-center justify-center gap-2 w-full bg-white border border-purple-200 text-purple-600 px-4 py-2 rounded-lg font-semibold hover:bg-purple-50 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                    </svg>
                    Call Me
                  </a>
                </div>
              </div>

            </div>
          </aside>
        </div>
      </div>


      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Person",
            "name": "Ajay Porwal",
            "jobTitle": "Digital Marketing Expert & Ads Specialist",
            "worksFor": {
              "@type": "Organization",
              "name": "SEOShouts"
            },
            "url": "https://seoshouts.com/authors/ajay-porwal",
            "image": "https://seoshouts.com/images/team/ajay-porwal.jpg",
            "description": "Passionate digital marketing expert specializing in paid advertising, social media marketing, and data-driven campaign optimization. Expert in turning ad spend into measurable ROI.",
            "knowsAbout": [
              "Paid Advertising",
              "Google Ads",
              "Facebook Ads",
              "Social Media Marketing",
              "Campaign Optimization",
              "ROI Analysis",
              "Digital Marketing Strategy"
            ],
            "email": "ajay@seoshouts.com",
            "telephone": "+918094888157",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://linkedin.com/in/ajayporwal/"
            ]
          })
        }}
      />
    </div>
  )
}