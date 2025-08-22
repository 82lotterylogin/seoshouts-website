import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Rohit Sharma — Founder of SEOShouts, SEO Strategist & Author',
  description: 'Rohit Sharma is the founder of SEOShouts and primary author behind its research, playbooks, and case notes. A results-driven SEO strategist with 10+ years of experience helping local, eCommerce, and B2B brands.',
  keywords: 'Rohit Sharma SEO, SEO strategist, SEOShouts founder, technical SEO expert, local SEO specialist, content strategy expert, Rajasthan SEO consultant',
  authors: [{ name: 'Rohit Sharma' }],
  creator: 'Rohit Sharma',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: '/authors/rohit-sharma',
  },
  openGraph: {
    title: 'Rohit Sharma — Founder of SEOShouts, SEO Strategist & Author',
    description: 'Rohit Sharma is the founder of SEOShouts and primary author behind its research, playbooks, and case notes. Results-driven SEO strategist with 10+ years of experience.',
    url: '/authors/rohit-sharma',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/rohit-sharma.jpg',
        width: 400,
        height: 400,
        alt: 'Rohit Sharma — Founder of SEOShouts, SEO Strategist & Author',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary',
    title: 'Rohit Sharma — Founder of SEOShouts, SEO Strategist & Author',
    description: 'Rohit Sharma is the founder of SEOShouts and primary author behind its research, playbooks, and case notes. Results-driven SEO strategist with 10+ years of experience.',
    images: ['/images/team/rohit-sharma.jpg'],
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

export default async function RohitSharmaAuthorPage() {
  // Get actual articles from Storyblok
  const allBlogPosts = await getAllStories("blog_post");
  // Filter articles by Rohit Sharma (adjust the filter logic based on your author field structure)
  const rohitArticles = allBlogPosts.filter((post: any) => 
    post.content.author?.content?.name === "Rohit Sharma" || 
    post.content.author?.content?.slug === "rohit-sharma" ||
    !post.content.author // If no author specified, assume it's Rohit's
  );
  
  // Mock articles data for display (keeping this structure but using real count)
  const articles = [
    {
      id: 1,
      title: "The Complete Guide to Technical SEO Audits in 2025",
      excerpt: "Learn how to conduct comprehensive technical SEO audits that identify critical issues and boost your search rankings.",
      slug: "complete-guide-technical-seo-audits-2025",
      publishedDate: "2025-01-15",
      readTime: "12 min read",
      category: "Technical SEO",
      featured: true
    },
    {
      id: 2,
      title: "Local SEO Strategies That Actually Work",
      excerpt: "Proven local SEO techniques to dominate local search results and drive more qualified leads to your business.",
      slug: "local-seo-strategies-that-work",
      publishedDate: "2025-01-10",
      readTime: "8 min read",
      category: "Local SEO"
    },
    {
      id: 3,
      title: "Content Strategy Framework for SEO Success",
      excerpt: "Build a content strategy that aligns with user intent and drives organic growth through strategic keyword targeting.",
      slug: "content-strategy-framework-seo",
      publishedDate: "2025-01-05",
      readTime: "15 min read",
      category: "Content Strategy"
    },
    {
      id: 4,
      title: "Core Web Vitals: The Ultimate Optimization Guide",
      excerpt: "Master Core Web Vitals optimization with practical techniques to improve page speed and user experience.",
      slug: "core-web-vitals-optimization-guide",
      publishedDate: "2024-12-28",
      readTime: "10 min read",
      category: "Technical SEO"
    }
  ];

  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section - Full Width */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative z-10">
          {/* Author Header */}
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-8">
            <div className="flex flex-col lg:flex-row items-start gap-8">
              
              {/* Author Image & Basic Info */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img
                    src="/images/team/rohit-sharma.jpg"
                    alt="Rohit Sharma"
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
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-600 text-white">
                    Founder & Author
                  </span>
                </div>
                
                <h1 className="text-4xl lg:text-5xl font-bold mb-4 tracking-tight">
                  Rohit Sharma
                </h1>
                
                <p className="text-xl text-blue-100 mb-6 leading-relaxed max-w-3xl">
                  Results-driven SEO strategist with 10+ years of experience helping local, eCommerce, and B2B brands 
                  turn search visibility into qualified leads and revenue. Founder of SEOShouts and primary author 
                  behind its research, playbooks, and case notes.
                </p>

                {/* Stats */}
                <div className="flex flex-wrap gap-8 mb-8">
                  <div>
                    <div className="text-2xl font-bold text-white">12+</div>
                    <div className="text-sm text-blue-200">Years Experience</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">65+</div>
                    <div className="text-sm text-blue-200">Clients Served</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{rohitArticles.length}</div>
                    <div className="text-sm text-blue-200">Articles Published</div>
                  </div>
                </div>

                {/* Contact Links */}
                <div className="flex flex-wrap gap-4">
                  <a 
                    href="mailto:rohit@seoshouts.com"
                    className="inline-flex items-center gap-2 bg-white text-slate-900 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email
                  </a>
                  <a 
                    href="https://linkedin.com/in/seowithrohitsharma/"
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
              <p className="text-gray-600">Expert insights on SEO strategy, technical optimization, and digital marketing.</p>
            </div>

            {/* Real Articles from Storyblok */}
            {rohitArticles.length > 0 ? (
              <div className="space-y-8">
                {rohitArticles.map((article: any, index) => (
                  <article key={article.uuid} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
                    <div className="p-6">
                      <div className="flex items-center gap-4 mb-3">
                        {index === 0 && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            Latest
                          </span>
                        )}
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-700">
                          {article.content.category || 'SEO'}
                        </span>
                      </div>
                      <h3 className="text-xl font-bold text-gray-900 mb-3 hover:text-blue-600 transition-colors">
                        <a href={`/blog/${article.slug}`}>{article.content.title}</a>
                      </h3>
                      <p className="text-gray-600 mb-4 leading-relaxed">
                        {article.content.excerpt || 'Expert insights on SEO strategy and digital marketing best practices.'}
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
                <p className="text-gray-600">Rohit is working on publishing expert SEO insights and strategies. Check back soon!</p>
              </div>
            )}

            {/* Load More Button */}
            <div className="text-center mt-12">
              <button className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
                Load More Articles
              </button>
            </div>
          </div>

          {/* Sidebar - Author Info */}
          <aside className="lg:col-span-1">
            <div className="sticky top-8 space-y-8">
              
              {/* Author Bio */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">About Rohit</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">
                  Results-driven SEO strategist with 10+ years of experience helping local, eCommerce, and B2B brands 
                  turn search visibility into qualified leads and revenue.
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
                    <span className="text-gray-600">12+ years experience</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
                    </svg>
                    <span className="text-gray-600">Founder, SEOShouts</span>
                  </div>
                </div>
              </div>

              {/* Expertise */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Areas of Expertise</h3>
                <div className="flex flex-wrap gap-2">
                  {['Technical SEO', 'Local SEO', 'Content Strategy', 'GBP Optimization', 'Authority Building', 'Analytics'].map((skill) => (
                    <span key={skill} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              {/* Tools */}
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Favorite Tools</h3>
                <div className="flex flex-wrap gap-2">
                  {['Ahrefs', 'SEMrush', 'GA4', 'Search Console', 'Screaming Frog', 'ChatGPT'].map((tool) => (
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
                    <div className="font-medium text-gray-900">SEO Manager</div>
                    <div className="text-gray-600">The Poised Media</div>
                    <div className="text-gray-500">2022 - Present</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">Senior SEO Account Manager</div>
                    <div className="text-gray-600">Aditadv Tech Pvt. Ltd.</div>
                    <div className="text-gray-500">2019 - 2022</div>
                  </div>
                  <div className="text-sm">
                    <div className="font-medium text-gray-900">SEO Executive & Team Leader</div>
                    <div className="text-gray-600">AIS Technolabs</div>
                    <div className="text-gray-500">2017 - 2019</div>
                  </div>
                </div>
              </div>

              {/* Contact CTA */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 p-6">
                <h3 className="text-lg font-bold text-gray-900 mb-4">Get in Touch</h3>
                <p className="text-gray-600 mb-4 text-sm">
                  Need SEO consultation or technical audit? Let's discuss your project.
                </p>
                <div className="space-y-3">
                  <a 
                    href="mailto:rohit@seoshouts.com"
                    className="flex items-center justify-center gap-2 w-full bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-sm"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Email Me
                  </a>
                  <a 
                    href="tel:+918094888157"
                    className="flex items-center justify-center gap-2 w-full bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors text-sm"
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
            "name": "Rohit Sharma",
            "jobTitle": "SEO Strategist & Founder",
            "worksFor": {
              "@type": "Organization",
              "name": "SEOShouts"
            },
            "url": "https://seoshouts.com/authors/rohit-sharma",
            "image": "https://seoshouts.com/images/team/rohit-sharma.jpg",
            "description": "Results-driven SEO strategist with 10+ years of experience helping local, eCommerce, and B2B brands turn search visibility into qualified leads and revenue.",
            "knowsAbout": [
              "Search Engine Optimization",
              "Local SEO",
              "Technical SEO",
              "Content Strategy",
              "Google Business Profile",
              "Authority Building"
            ],
            "alumniOf": "Techno India NJR Institute of Technology, Udaipur",
            "email": "rohit@seoshouts.com",
            "telephone": "+918094888157",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://linkedin.com/in/seowithrohitsharma/"
            ]
          })
        }}
      />
    </div>
  )
}