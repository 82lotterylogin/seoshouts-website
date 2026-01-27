import { Metadata } from 'next'
import { getAllStories } from '../lib/storyblok'

export const metadata: Metadata = {
  title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
  description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader, building scalable SEO solutions for businesses worldwide.',
  keywords: 'Rohit Sharma founder, SEOShouts CEO, SEO industry leader, entrepreneur story, digital marketing founder, SEO agency founder, India SEO expert',
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
    canonical: '/founder/',
  },
  openGraph: {
    title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
    description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader.',
    url: '/founder/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/rohit-sharma.jpg',
        width: 1200,
        height: 630,
        alt: 'Rohit Sharma — Founder & CEO of SEOShouts',
      },
    ],
    locale: 'en_US',
    type: 'profile',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Rohit Sharma — Founder & CEO | The Story Behind SEOShouts',
    description: 'Meet Rohit Sharma, the visionary founder and CEO behind SEOShouts. Discover his 13+ year journey from SEO trainee to industry leader.',
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

export default async function FounderPage() {
  // Get actual articles from Storyblok for dynamic count
  const allBlogPosts = await getAllStories("blog_post");
  const rohitArticles = allBlogPosts.filter((post: any) => 
    post.content.author?.content?.name === "Rohit Sharma" || 
    post.content.author?.content?.slug === "rohit-sharma" ||
    !post.content.author // If no author specified, assume it's Rohit's
  );
  return (
    <div className="bg-white">
      {/* Hero Section - Full Width */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 min-h-screen flex items-center">
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 to-indigo-600/5"></div>
          <div className="absolute top-0 left-0 w-full h-full opacity-30">
            <svg width="100%" height="100%" viewBox="0 0 100 100" preserveAspectRatio="none">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgb(59, 130, 246)" strokeWidth="0.5"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
        </div>
        
        <div className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
              
              {/* Content Side */}
              <div className="space-y-8">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                    <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    Founder & CEO
                  </div>
                  
                  <h1 className="text-5xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                    Meet
                    <span className="block bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      Rohit Sharma
                    </span>
                  </h1>
                  
                  <div className="text-2xl lg:text-3xl text-gray-600 font-medium">
                    The visionary behind SEOShouts
                  </div>
                </div>

                <p className="text-xl text-gray-700 leading-relaxed max-w-2xl">
                  From a curious SEO trainee in 2013 to building one of India's most trusted SEO platforms, 
                  Rohit's journey is a testament to persistence, innovation, and genuine passion for helping 
                  businesses succeed online.
                </p>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">13+</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">65+</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Happy Clients</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">150+</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Projects Completed</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">{rohitArticles.length}</div>
                    <div className="text-sm text-gray-600 uppercase tracking-wide">Articles Published</div>
                  </div>
                </div>

                {/* CTA Buttons */}
                <div className="flex flex-col sm:flex-row gap-4">
                  <a 
                    href="#story"
                    className="inline-flex items-center justify-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                    </svg>
                    Read My Story
                  </a>
                  <a
                    href="mailto:seoshouts@gmail.com"
                    className="inline-flex items-center justify-center gap-2 bg-white border-2 border-blue-600 text-blue-600 px-8 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-300"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                    </svg>
                    Get in Touch
                  </a>
                </div>
              </div>

              {/* Image Side */}
              <div className="relative flex justify-center lg:justify-end">
                <div className="relative">
                  <img
                    src="/images/team/rohit-sharma.jpg"
                    alt="Rohit Sharma - Founder & CEO of SEOShouts"
                    className="w-96 h-96 lg:w-[450px] lg:h-[450px] rounded-3xl shadow-2xl object-cover"
                  />
                  
                  {/* Background decoration only */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-400/10 rounded-3xl blur-3xl transform translate-x-6 translate-y-6 -z-10"></div>
                </div>
                
                {/* Stats Cards - Positioned outside image area */}
                <div className="absolute -right-8 top-8 bg-blue-600 text-white rounded-2xl px-6 py-4 shadow-lg border-4 border-white">
                  <div className="text-center">
                    <div className="text-2xl font-bold">95%</div>
                    <div className="text-sm font-medium">Success Rate</div>
                  </div>
                </div>
                
                <div className="absolute -left-8 bottom-8 bg-white rounded-2xl px-6 py-4 shadow-lg border border-blue-200">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
                    <span className="text-sm font-semibold text-gray-700">Available for Consulting</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Story Section */}
      <section id="story" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              The Journey That Started It All
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Every great company has an origin story. Here's how a curious mind and relentless 
              pursuit of SEO excellence led to the creation of SEOShouts.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div>
              <div className="prose prose-lg max-w-none">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">The Spark of Innovation</h3>
                <p className="text-gray-700 leading-relaxed mb-6">
                  Rohit Sharma is the founder of SEOShouts and the primary author behind its research, playbooks,
                  and case notes. A results-driven SEO strategist with 13+ years of experience, he helps local,
                  eCommerce, and B2B brands turn search visibility into qualified leads and revenue. His work
                  blends technical SEO, content strategy, and data-led execution.
                </p>
                <p className="text-gray-700 leading-relaxed">
                  As the lead author at SEOShouts, Rohit writes evidence-based guides on technical SEO, 
                  local search, and content-driven growth. His articles focus on practical frameworks, 
                  transparent reporting, and scalable processes that teams can implement quickly. 
                  He is known for bridging development, content, and business goals to ship changes that move KPIs.
                </p>
              </div>
            </div>
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-3xl p-8 border border-blue-100">
              <h4 className="text-xl font-bold text-blue-900 mb-6">Founder Snapshot</h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-900">Location:</span>
                    <span className="text-gray-700 ml-2">Rajasthan, India</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-900">Experience:</span>
                    <span className="text-gray-700 ml-2">2013–2024 (agency and in-house)</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-900">Specialties:</span>
                    <span className="text-gray-700 ml-2">Technical SEO, Local SEO (GBP), eCommerce SEO, SEO Development, Content Strategy, Authority Building</span>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 flex-shrink-0"></div>
                  <div>
                    <span className="font-semibold text-gray-900">Focus:</span>
                    <span className="text-gray-700 ml-2">Consulting, technical audits, growth retainers</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What I Do Section - Full Width */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Areas of Expertise
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Specialized skills and services developed through 13+ years of hands-on SEO experience
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "⚙️",
                title: "Technical SEO",
                description: "crawl/indexation fixes, site architecture, internal linking systems, structured data, migrations, Core Web Vitals guidance.",
                color: "blue"
              },
              {
                icon: "📍",
                title: "Local SEO",
                description: "GBP optimization, location pages, reviews strategy, local SERP growth for single and multi-location brands.",
                color: "green"
              },
              {
                icon: "📝",
                title: "Content Strategy",
                description: "topical mapping, SERP-aligned briefs, NLP-friendly formatting, editorial QA.",
                color: "purple"
              },
              {
                icon: "🔗",
                title: "Authority & Links",
                description: "white-hat acquisition, competitor gap analysis, digital PR angles.",
                color: "orange"
              },
              {
                icon: "📊",
                title: "Analytics & Reporting",
                description: "GA4/GSC diagnostics, KPI frameworks, action-focused reports.",
                color: "indigo"
              },
              {
                icon: "🤖",
                title: "AI-Powered SEO",
                description: "SERP synthesis, topical clustering, content briefs, schema automation using ChatGPT, Claude, and Perplexity.",
                color: "red"
              }
            ].map((service, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm hover:shadow-md transition-all duration-300 border border-gray-200">
                <div className="text-4xl mb-4">{service.icon}</div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{service.title}</h3>
                <p className="text-gray-600 leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Workflow Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              AI-Powered SEO Workflow
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              How I leverage cutting-edge AI tools to deliver superior SEO results
            </p>
          </div>

          <div className="bg-gradient-to-br from-slate-900 to-blue-900 rounded-3xl p-8 lg:p-12 text-white mb-12">
            <div className="grid lg:grid-cols-3 gap-8 mb-12">
              <div>
                <h3 className="text-xl font-bold mb-4 text-blue-300">AI Tools</h3>
                <div className="flex flex-wrap gap-3">
                  {['ChatGPT', 'Perplexity', 'Claude'].map((tool) => (
                    <span key={tool} className="bg-blue-600/30 text-blue-100 px-3 py-1 rounded-full text-sm font-medium">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
              <div className="lg:col-span-2">
                <h3 className="text-xl font-bold mb-4 text-blue-300">Applications</h3>
                <p className="text-blue-100">
                  SERP synthesis, topical clustering, content briefs, headings/meta variants, FAQs, 
                  internal linking ideas, schema stubs, tone refinement, analytics summarization.
                </p>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
              <h3 className="text-2xl font-bold mb-6 text-center">My AI-SEO Workflow</h3>
              <div className="grid md:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">1</span>
                  </div>
                  <h4 className="font-bold mb-2">Research</h4>
                  <p className="text-sm text-blue-100">Perplexity for rapid research and entity discovery</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">2</span>
                  </div>
                  <h4 className="font-bold mb-2">Structure</h4>
                  <p className="text-sm text-blue-100">Claude for outline and long-form content structure</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">3</span>
                  </div>
                  <h4 className="font-bold mb-2">Optimize</h4>
                  <p className="text-sm text-blue-100">ChatGPT for on-page iteration and schema generation</p>
                </div>
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-white font-bold text-lg">4</span>
                  </div>
                  <h4 className="font-bold mb-2">Verify</h4>
                  <p className="text-sm text-blue-100">Human QA for verification, originality, and E-E-A-T</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Timeline */}
      <section className="py-20 bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Professional Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From SEO trainee to industry leader - 13 years of continuous learning and growth
            </p>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-4 md:left-1/2 transform md:-translate-x-px h-full w-0.5 bg-blue-200"></div>
            
            <div className="space-y-12">
              {[
                {
                  year: "2022-2024",
                  title: "SEO Manager — The Poised Media",
                  description: "Leads technical, on-page, and off-page programs for B2B portfolios; aligns roadmaps with business outcomes; mentors teams; maintains rigorous reporting.",
                  side: "right",
                  color: "blue"
                },
                {
                  year: "2019-2022",
                  title: "Senior SEO Account Manager — Aditadv Tech Pvt. Ltd.",
                  description: "Managed 65+ local clients (US/Canada) and delivered ranking and conversion lifts through local and content strategies.",
                  side: "left",
                  color: "green"
                },
                {
                  year: "2017-2019",
                  title: "SEO Executive & Team Leader — AIS Technolabs Pvt. Ltd.",
                  description: "Drove four in-house projects with link-building, social integration, and comprehensive on-page optimization.",
                  side: "right",
                  color: "purple"
                },
                {
                  year: "2014-2016",
                  title: "SEO Executive — MindGrove eSolutions Pvt. Ltd.",
                  description: "Achieved first-page rankings in competitive niches via structured research and disciplined optimization.",
                  side: "left",
                  color: "orange"
                },
                {
                  year: "2013-2014",
                  title: "SEO Trainee — Internet Marketing Wizard",
                  description: "Marketplace SEO (Etsy, Amazon, eBay), blogging, and product reviews.",
                  side: "right",
                  color: "red"
                }
              ].map((item, index) => (
                <div key={index} className={`relative flex items-center ${item.side === 'left' ? 'md:flex-row-reverse' : ''}`}>
                  {/* Timeline Dot */}
                  <div className={`absolute left-4 md:left-1/2 transform md:-translate-x-1/2 w-4 h-4 bg-${item.color}-500 rounded-full border-4 border-white shadow-lg z-10`}></div>
                  
                  {/* Content */}
                  <div className={`ml-12 md:ml-0 md:w-1/2 ${item.side === 'left' ? 'md:pr-12 md:text-right' : 'md:pl-12'}`}>
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                      <div className={`text-sm font-semibold text-${item.color}-600 mb-2`}>{item.year}</div>
                      <h3 className="text-lg font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills & Tools */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              Skills & Technology Stack
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The tools and technologies that power world-class SEO strategies
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 border border-blue-200">
              <h3 className="text-lg font-bold text-blue-900 mb-4">Core SEO Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Technical SEO', 'On-Page', 'Off-Page', 'Local SEO (GBP)', 'Content Strategy', 'Analytics & Reporting', 'Project Management', 'Team Leadership'].map((skill) => (
                  <span key={skill} className="bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border border-green-200">
              <h3 className="text-lg font-bold text-green-900 mb-4">SEO Tools</h3>
              <div className="flex flex-wrap gap-2">
                {['GA4', 'Search Console', 'Google Tag Manager', 'Ahrefs', 'SEMrush', 'Screaming Frog', 'Keyword Planner'].map((tool) => (
                  <span key={tool} className="bg-green-200 text-green-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 border border-purple-200">
              <h3 className="text-lg font-bold text-purple-900 mb-4">Development</h3>
              <div className="flex flex-wrap gap-2">
                {['WordPress', 'Shopify', 'Wix', 'HTML/CSS', 'Custom Development'].map((tech) => (
                  <span key={tech} className="bg-purple-200 text-purple-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-6 border border-orange-200">
              <h3 className="text-lg font-bold text-orange-900 mb-4">Other Skills</h3>
              <div className="flex flex-wrap gap-2">
                {['Photoshop', 'Canva', 'Asana', 'Claude', 'Gemini', 'ChatGPT'].map((tool) => (
                  <span key={tool} className="bg-orange-200 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values & Approach */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
              My Approach & Values
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide every project and client relationship
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {[
              {
                icon: "🎯",
                title: "Strategy First",
                description: "clear goals, measurable KPIs, prioritized roadmaps."
              },
              {
                icon: "⚖️",
                title: "Technical + Editorial Balance",
                description: "clean architecture with SERP-aligned content."
              },
              {
                icon: "💬",
                title: "Transparent Communication",
                description: "actionable reports and consistent updates."
              },
              {
                icon: "🛡️",
                title: "Ethical SEO",
                description: "sustainable, standards-compliant, long-term growth."
              }
            ].map((value, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-sm border border-blue-200 hover:shadow-md transition-all duration-300">
                <div className="flex items-start gap-4">
                  <div className="text-4xl">{value.icon}</div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Education & Highlights */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            
            {/* Education */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Education</h2>
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <div className="flex items-start gap-4">
                  <div className="w-16 h-16 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"></path>
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Bachelor of Technology</h3>
                    <p className="text-gray-700 mb-1">Techno India NJR Institute of Technology, Udaipur</p>
                    <p className="text-gray-500">(2009–2013)</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Career Highlights */}
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-8">Career Highlights</h2>
              <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-8 border border-green-200">
                <div className="space-y-6">
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Led multi-client local SEO portfolios with consistent ranking and conversion gains.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Built scalable processes for audits, briefs, internal linking, and reporting to reduce time-to-impact.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Mentored teams to improve execution quality and delivery predictability.</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 flex-shrink-0"></div>
                    <p className="text-gray-700">Founded SEOShouts in 2016 to democratize access to professional SEO tools and insights.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">
            Ready to Transform Your SEO?
          </h2>
          <p className="text-xl text-blue-100 mb-12 max-w-3xl mx-auto leading-relaxed">
            Whether you need a comprehensive SEO audit, strategic consulting, or ongoing growth optimization, 
            I'm here to help you achieve sustainable organic growth with data-driven strategies.
          </p>

          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12">
            <a
              href="mailto:seoshouts@gmail.com"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Email Me</h3>
              <p className="text-blue-100">seoshouts@gmail.com</p>
            </a>

            <a 
              href="tel:+918094888157"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all">
                <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Call Direct</h3>
              <p className="text-blue-100">+91 809 488 8157</p>
            </a>

            <a 
              href="https://linkedin.com/in/seowithrohitsharma/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl p-6 hover:bg-white/20 transition-all duration-300 group"
            >
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-white/30 transition-all">
                <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.338 16.338H13.67V12.16c0-.995-.017-2.277-1.387-2.277-1.39 0-1.601 1.086-1.601 2.207v4.248H8.014v-8.59h2.559v1.174h.037c.356-.675 1.227-1.387 2.526-1.387 2.703 0 3.203 1.778 3.203 4.092v4.711zM5.005 6.575a1.548 1.548 0 11-.003-3.096 1.548 1.548 0 01.003 3.096zm-1.337 9.763H6.34v-8.59H3.667v8.59zM17.668 1H2.328C1.595 1 1 1.581 1 2.298v15.403C1 18.418 1.595 19 2.328 19h15.34c.734 0 1.332-.582 1.332-1.299V2.298C19 1.581 18.402 1 17.668 1z" clipRule="evenodd"></path>
                </svg>
              </div>
              <h3 className="font-bold text-xl mb-2">Connect</h3>
              <p className="text-blue-100">LinkedIn Profile</p>
            </a>
          </div>

          <div className="text-blue-200">
            <p className="mb-2">📍 Based in Rajasthan, India</p>
            <p>🌍 Available for projects worldwide</p>
          </div>
        </div>
      </section>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": ["Person", "Founder"],
            "name": "Rohit Sharma",
            "jobTitle": "Founder & CEO",
            "worksFor": {
              "@type": "Organization",
              "name": "SEOShouts",
              "foundingDate": "2016"
            },
            "foundingDate": "2016",
            "url": "https://seoshouts.com/founder/",
            "image": "https://seoshouts.com/images/team/rohit-sharma.jpg",
            "description": "Visionary founder and CEO behind SEOShouts. 13+ year journey from SEO trainee to industry leader, building scalable SEO solutions for businesses worldwide.",
            "knowsAbout": [
              "Search Engine Optimization",
              "Local SEO",
              "Technical SEO", 
              "Content Strategy",
              "Google Business Profile",
              "Authority Building",
              "AI-powered SEO",
              "Business Strategy"
            ],
            "hasOccupation": {
              "@type": "Occupation",
              "name": "SEO Strategist & Entrepreneur",
              "occupationLocation": {
                "@type": "Country",
                "name": "India"
              }
            },
            "alumniOf": "Techno India NJR Institute of Technology, Udaipur",
            "email": "seoshouts@gmail.com",
            "telephone": "+918094888157",
            "address": {
              "@type": "PostalAddress",
              "addressRegion": "Rajasthan",
              "addressCountry": "IN"
            },
            "sameAs": [
              "https://linkedin.com/in/seowithrohitsharma/",
              "https://seoshouts.com/authors/rohit-sharma/"
            ],
            "award": [
              "13+ Years SEO Excellence",
              "65+ Happy Clients Served",
              "150+ Projects Completed",
              "95% Client Success Rate"
            ]
          })
        }}
      />
    </div>
  )
}