import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Link Building Services - Earn High-Quality Backlinks That Move Rankings | SEO Shouts',
  description: 'Professional link building services by SEOShouts. Earn high-quality, relevant backlinks through relationship building and strategic outreach. No spam, no penalties - just sustainable authority building.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/link-building',
  },
  openGraph: {
    title: 'Link Building Services - Earn High-Quality Backlinks | SEO Shouts',
    description: 'Professional link building services that focus on earning high-quality, relevant backlinks through relationship building and strategic outreach.',
    url: 'https://seoshouts.com/services/link-building',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/link-building-service-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEOShouts Link Building Services - Quality Backlinks',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Link Building Services - Earn High-Quality Backlinks | SEO Shouts',
    description: 'Professional link building services focused on earning quality backlinks through relationship building.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/link-building-service-twitter.jpg'],
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

const linkTypes = [
  {
    title: 'Editorial Links from Industry Publications',
    description: 'Real mentions in legitimate industry publications where your audience actually spends time.',
    icon: '📰'
  },
  {
    title: 'Resource Page Inclusions',
    description: 'Getting featured on curated lists of industry tools, services, or resources.',
    icon: '📋'
  },
  {
    title: 'Broken Link Replacement',
    description: 'Finding broken links on relevant sites and suggesting your content as a replacement.',
    icon: '🔗'
  },
  {
    title: 'Data-Driven PR Links',
    description: 'Using your business data or research to earn coverage in relevant publications.',
    icon: '📊'
  },
  {
    title: 'Expert Roundup Participation',
    description: 'Contributing insights to industry roundups and collaborative content.',
    icon: '🎯'
  },
  {
    title: 'Strategic Guest Content',
    description: 'High-quality guest posts on sites that your target audience actually reads.',
    icon: '✍️'
  },
  {
    title: 'Business Partnership Links',
    description: 'Leveraging existing business relationships for natural link opportunities.',
    icon: '🤝'
  }
]

const processSteps = [
  {
    month: 'Month 1',
    title: 'Foundation and Strategy',
    description: 'We don\'t jump into outreach on day one. First, we understand your business and build a solid foundation.',
    activities: [
      'Deep dive into your industry, competitors, and link opportunities',
      'Content audit to identify what\'s worth promoting and what needs improvement',
      'Link profile analysis to understand your current authority and gaps',
      'Target list development of high-value prospects',
      'Outreach strategy creation tailored to your industry'
    ]
  },
  {
    month: 'Month 2-3',
    title: 'Strategic Outreach and Relationship Building',
    description: 'Now we start the real work - reaching out to relevant sites and building relationships.',
    activities: [
      'Personalized outreach to carefully researched prospects',
      'Value-first pitches that focus on their audience\'s needs',
      'Follow-up sequences that maintain relationships',
      'Content collaboration and co-creation opportunities',
      'Guest posting on truly relevant, high-quality sites'
    ]
  },
  {
    month: 'Month 4+',
    title: 'Scaling and Optimization',
    description: 'As we build momentum and relationships, we scale what\'s working and refine our approach.',
    activities: [
      'Expanding outreach to new prospect categories',
      'Leveraging existing relationships for additional opportunities',
      'Creating new link-worthy content based on what\'s working',
      'Monitoring and protecting your link profile',
      'Reporting on results and optimizing strategy'
    ]
  }
]

const faqs = [
  {
    question: 'How long does it take to see results from link building?',
    answer: 'Quality link building typically takes 3-6 months to show significant ranking improvements. We focus on sustainable growth, not quick fixes that backfire.'
  },
  {
    question: 'How many links do you build per month?',
    answer: 'We don\'t set arbitrary numbers. Some months we might earn 5 high-quality links, other months it might be 15. Quality always trumps quantity.'
  },
  {
    question: 'Do you guarantee specific links or publications?',
    answer: 'We can\'t guarantee specific placements, but we do guarantee professional outreach and relationship building. The best publications can\'t be bought - they have to be earned.'
  },
  {
    question: 'What if my industry is really competitive or boring?',
    answer: 'Every industry has stories to tell and value to provide. We\'ve built links for everything from accounting firms to wedding planners. It\'s about finding the right angle.'
  },
  {
    question: 'Can you help if my site has been penalized for bad links?',
    answer: 'Yes, we include link cleanup and disavowal as part of our process when needed. Sometimes you need to clean up before you can build up.'
  },
  {
    question: 'Do you work with new websites or just established ones?',
    answer: 'We work with businesses at all stages. New sites need a different approach than established ones, but both can benefit from strategic link building.'
  },
  {
    question: 'How do you avoid Google penalties?',
    answer: 'By following Google\'s guidelines, focusing on genuine value creation, and never trying to manipulate rankings through artificial means.'
  }
]

export default function LinkBuildingPage() {
  return (
    <>
      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "Link Building Services",
            "description": "Professional link building services that earn high-quality, relevant backlinks through relationship building and strategic outreach",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "areaServed": {
              "@type": "Country",
              "name": "India"
            },
            "serviceType": "Link Building Services"
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
            "mainEntity": faqs.map(faq => ({
              "@type": "Question",
              "name": faq.question,
              "acceptedAnswer": {
                "@type": "Answer",
                "text": faq.answer
              }
            }))
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-0 pt-12">
        {/* Hero Section */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900 mb-6 leading-tight">
              Link Building Services by SEOShouts — 
              <span className="bg-gradient-to-r from-blue-600 to-purple-700 bg-clip-text text-transparent">
                Earn High-Quality Backlinks That Actually Move Rankings
              </span>
            </h1>
            
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-6 mb-8 text-left">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">
                Stop Chasing Links That Don't Matter (And Start Building Authority That Does)
              </h2>
              <p className="text-gray-700 mb-4">
                Here's a story that'll make you cringe: Last year, a startup founder showed me his "link building report" from another agency. They'd built 500 backlinks in one month. Sounds impressive, right?
              </p>
              <p className="text-xl font-bold text-red-600 mb-2">Wrong.</p>
              <p className="text-gray-700 mb-4">
                When I dug deeper, I found links from Pakistani casino sites, Russian spam directories, and something called "best-cupcake-recipes-2019.blogspot.com" linking to their B2B software company.
              </p>
              <p className="text-gray-700 mb-4">His rankings? They'd actually dropped.</p>
              <p className="text-xl font-bold text-gray-900">That's not link building. That's link destruction.</p>
            </div>
            
            <p className="text-xl text-gray-600 mb-8">
              At <strong>SEOShouts</strong>, we've learned that earning one high-quality, relevant backlink is worth more than 100 garbage links that'll eventually get your site penalized.
            </p>
            
            <a
              href="/contact"
              className="inline-block px-8 py-4 bg-gradient-to-r from-blue-700 to-purple-700 text-white rounded-xl font-bold hover:scale-105 transition transform shadow-xl"
            >
              Let's Discuss Your Link Building Strategy →
            </a>
          </div>
        </section>

        {/* The Brutal Reality Section */}
        <section className="bg-white py-16 mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                The Brutal Reality About Most Link Building Services
              </h2>
              <p className="text-xl text-gray-700 mb-6">
                I've been doing this for 13+ years, and I'll tell you something most agencies won't: 
                <strong className="text-red-600"> 95% of "link building" services are just sophisticated spam operations.</strong>
              </p>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Here's what passes for "link building" these days:</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                  <h4 className="font-bold text-red-800 mb-2">❌ What Others Do</h4>
                  <ul className="text-red-700 space-y-2">
                    <li>• Buying links from "high DA" sites that Google has already devalued</li>
                    <li>• Guest posting on irrelevant blogs just to get a backlink</li>
                    <li>• Directory submissions to sites nobody visits</li>
                    <li>• Comment spam disguised as "engagement"</li>
                    <li>• Private blog networks that'll get you penalized</li>
                  </ul>
                </div>
                
                <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                  <h4 className="font-bold text-green-800 mb-2">✅ What We Do</h4>
                  <ul className="text-green-700 space-y-2">
                    <li>• Build relationships with real industry publications</li>
                    <li>• Create content worth linking to naturally</li>
                    <li>• Target sites your customers actually read</li>
                    <li>• Focus on relevance over vanity metrics</li>
                    <li>• Earn links through genuine value creation</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-gray-100 p-6 rounded-lg">
                <p className="text-lg font-semibold text-gray-800">
                  <strong>The result?</strong> Temporary ranking boosts followed by devastating penalties when Google's algorithms catch up.
                </p>
                <p className="text-lg text-blue-700 mt-2">
                  <strong>We do the opposite.</strong> We build relationships, create value, and earn links that search engines actually respect.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* How We Build Links Section */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              How We Actually Build Links That Matter
            </h2>
            
            <div className="space-y-12">
              {/* Content Worth Linking To */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We Start with Content Worth Linking To</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  You can't build a house without a foundation, and you can't build quality links without quality content.
                </p>
                <h4 className="font-bold text-gray-900 mb-3">Before we reach out to anyone, we make sure you have:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Original research or data that other sites want to reference</li>
                  <li>• Comprehensive guides that solve real problems</li>
                  <li>• Unique insights or case studies from your industry experience</li>
                  <li>• Visual content like infographics or tools that provide genuine value</li>
                </ul>
                <p className="text-blue-700 font-semibold mt-4">
                  <em>Why this matters:</em> Nobody wants to link to mediocre content. We create (or help you create) content that naturally attracts links.
                </p>
              </div>

              {/* Research Like Detectives */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🔍</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We Research Like Detectives, Not Robots</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Most agencies blast the same email template to thousands of sites. We dig deep to find the exact right prospects for your industry.
                </p>
                <h4 className="font-bold text-gray-900 mb-3">Our research process:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• We identify sites your competitors are getting links from (and find better ones they missed)</li>
                  <li>• We look for broken links on relevant sites that you could replace</li>
                  <li>• We find journalists and bloggers who regularly cover your industry</li>
                  <li>• We identify resource pages and link roundups where you actually belong</li>
                  <li>• We map out the real influencers in your space (not just people with high follower counts)</li>
                </ul>
                <p className="text-blue-700 font-semibold mt-4">
                  <em>The result:</em> We pitch to people who actually care about your industry and audience.
                </p>
              </div>

              {/* Build Relationships */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We Build Relationships, Not Just Links</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Here's what most people get wrong: they think link building is about the links. It's not. It's about the relationships.
                </p>
                <h4 className="font-bold text-gray-900 mb-3">How we approach outreach:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• We research each prospect personally and customize our approach</li>
                  <li>• We lead with value, not requests</li>
                  <li>• We build genuine connections that lead to ongoing opportunities</li>
                  <li>• We follow up professionally without being annoying</li>
                  <li>• We maintain relationships even after getting initial coverage</li>
                </ul>
                <p className="text-blue-700 font-semibold mt-4">
                  <em>Which means</em> you don't just get one-time links - you build a network of industry contacts who know and trust your brand.
                </p>
              </div>

              {/* Focus on Relevance */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We Focus on Relevance Over Vanity Metrics</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  Domain Authority is a nice number, but it doesn't pay your bills. We target links that actually drive business results.
                </p>
                <h4 className="font-bold text-gray-900 mb-3">What we prioritize:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Industry relevance and audience alignment</li>
                  <li>• Sites that actually send referral traffic</li>
                  <li>• Publications your customers and prospects actually read</li>
                  <li>• Links from sites that rank well for keywords you care about</li>
                  <li>• Editorial mentions that build brand awareness</li>
                </ul>
                <p className="text-blue-700 font-semibold mt-4">
                  <em>So you get</em> links that improve rankings AND bring qualified visitors to your site.
                </p>
              </div>

              {/* Track What Matters */}
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900">We Track What Actually Matters</h3>
                </div>
                <p className="text-gray-700 mb-4">
                  We don't just report on how many links we built. We track whether those links are actually helping your business grow.
                </p>
                <h4 className="font-bold text-gray-900 mb-3">Our tracking includes:</h4>
                <ul className="text-gray-700 space-y-2">
                  <li>• Ranking improvements for target keywords</li>
                  <li>• Referral traffic from new link sources</li>
                  <li>• Brand mention increases and sentiment</li>
                  <li>• Domain authority improvements over time</li>
                  <li>• Impact on overall organic visibility</li>
                </ul>
                <p className="text-blue-700 font-semibold mt-4">
                  <em>Because</em> the goal isn't just more links - it's better business results.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Our Process Section */}
        <section className="bg-white py-16 mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Our Link Building Process (How We Actually Do It)
              </h2>
              
              <div className="space-y-8">
                {processSteps.map((step, index) => (
                  <div key={index} className="bg-gray-50 rounded-2xl p-8">
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg mr-6">
                        {index + 1}
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-gray-900">{step.month}: {step.title}</h3>
                        <p className="text-gray-600 mt-2">{step.description}</p>
                      </div>
                    </div>
                    
                    <h4 className="font-bold text-gray-900 mb-3">What happens:</h4>
                    <ul className="text-gray-700 space-y-2">
                      {step.activities.map((activity, actIndex) => (
                        <li key={actIndex}>• {activity}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Types of Links Section */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="max-w-5xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Types of Links We Actually Build
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {linkTypes.map((link, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                  <div className="text-4xl mb-4">{link.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{link.title}</h3>
                  <p className="text-gray-600">{link.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* What We Don't Do Section */}
        <section className="bg-red-50 py-16 mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8 text-center">
                What We DON'T Do (The Link Building Red Flags)
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We won't buy links from link farms or PBNs</h3>
                  <p className="text-gray-700">These will hurt you more than help</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We don't do mass directory submissions</h3>
                  <p className="text-gray-700">Most directories are worthless in 2025</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We won't spam comment sections</h3>
                  <p className="text-gray-700">This isn't 2010, and it doesn't work</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We don't use automated outreach tools</h3>
                  <p className="text-gray-700">Real relationships require real conversations</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We won't promise overnight results</h3>
                  <p className="text-gray-700">Quality link building takes time and patience</p>
                </div>
                
                <div className="bg-white rounded-lg p-6 border-l-4 border-red-500">
                  <h3 className="font-bold text-red-800 mb-2">❌ We don't work with irrelevant sites</h3>
                  <p className="text-gray-700">A casino link won't help your dental practice</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Why Our Link Building Works */}
        <section className="container mx-auto px-4 sm:px-6 mb-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
              Why Our Link Building Actually Works
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ We Understand the Indian Market</h3>
                <p className="text-gray-700">
                  Working with Indian businesses for years, we know which international publications cover Indian companies and which local sites actually matter for SEO.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ We're Relationship-Focused, Not Transaction-Focused</h3>
                <p className="text-gray-700">
                  Many of our best links come from relationships we built months or even years ago. We play the long game.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ We Create Links That Last</h3>
                <p className="text-gray-700">
                  Our links don't disappear after a few months because they're based on genuine value, not paid placements.
                </p>
              </div>
              
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ We Know What Google Actually Values</h3>
                <p className="text-gray-700">
                  With 13+ years of experience, we understand the difference between links that help and links that hurt.
                </p>
              </div>
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <h3 className="text-xl font-bold text-green-600 mb-4">✅ We're Transparent About Everything</h3>
                <p className="text-gray-700">
                  You'll know exactly which sites we're targeting, what we're pitching, and how each outreach campaign is performing.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="bg-white py-16 mb-16">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-12 text-center">
                Frequently Asked Questions
              </h2>
              
              <div className="space-y-8">
                {faqs.map((faq, index) => (
                  <div key={index} className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{faq.question}</h3>
                    <p className="text-gray-700">{faq.answer}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose SEOShouts Section - Above Footer */}
        <section className="bg-white py-16 mb-0">
          <div className="container mx-auto px-4 sm:px-6">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Why Choose SEOShouts for Link Building?
                </h2>
                <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                  We're not just another link building agency. We're your partners in building sustainable authority.
                </p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🎯</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Quality Over Quantity</h3>
                  <p className="text-gray-600">We earn 5-15 high-quality links per month rather than hundreds of worthless ones.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🤝</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Relationship-First</h3>
                  <p className="text-gray-600">We build genuine relationships that lead to ongoing opportunities, not one-time transactions.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">🛡️</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Penalty-Proof</h3>
                  <p className="text-gray-600">13+ years of white-hat techniques that strengthen your authority, never risk it.</p>
                </div>
                
                <div className="text-center">
                  <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">Results-Driven</h3>
                  <p className="text-gray-600">We track rankings, traffic, and business impact - not just link counts.</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section - Exact Match to Local SEO */}
        <section className="py-16 sm:py-24 bg-gradient-to-br from-primary to-primary/80">
          <div className="container mx-auto px-4 sm:px-6 text-center">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                Ready to Build Links That Actually Strengthen Your Authority?
              </h2>
              <p className="text-lg sm:text-xl text-white/90 mb-8">
                Don't let another day pass while competitors build better backlink profiles. <strong>SEOShouts' link building experts</strong> are ready to develop a custom strategy that earns high-quality backlinks and boosts your search rankings across India.
              </p>
              <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 mb-8">
                <h3 className="text-2xl font-bold text-white mb-6">Get Started Today:</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">🎯</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Get Your Free Link Building Audit</p>
                      <p className="text-white/80 text-sm">Discover exactly what's holding back your backlink profile</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📞</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Call: +91 809488817</p>
                      <p className="text-white/80 text-sm">Speak directly with our link building team in Udaipur, Rajasthan</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">📧</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Email: contact@seoshouts.com</p>
                      <p className="text-white/80 text-sm">Discuss your link building goals with our specialists</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <span className="text-2xl">💬</span>
                    </div>
                    <div className="text-left">
                      <p className="text-white font-semibold">Schedule a Strategy Consultation</p>
                      <p className="text-white/80 text-sm">Get a custom link building roadmap for your business</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a 
                  href="/contact"
                  className="group px-8 py-4 bg-white text-primary rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl hover:bg-gray-100 transform hover:scale-105 transition-all duration-300 flex items-center justify-center"
                  aria-label="Get free Link Building audit from SEOShouts"
                >
                  🎯 Get Your Free Link Building Audit
                  <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </a>
                
                <a 
                  href="tel:+91809488817"
                  className="group px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl font-bold text-lg hover:bg-white hover:text-primary transition-all duration-300 flex items-center justify-center"
                  aria-label="Call SEOShouts for Link Building consultation"
                >
                  📞 Call +91 809488817
                </a>
              </div>

              <p className="text-white/80 mt-6">
                <strong>Serving businesses across India</strong>
              </p>
              
              <p className="text-white/70 mt-4 text-sm">
                <strong>Still have questions?</strong> Our link building specialists at SEOShouts are standing by to discuss your specific situation and goals. With 13+ years of SEO experience and deep understanding of Indian markets, we're ready to help your business build the authority it deserves.
              </p>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}
