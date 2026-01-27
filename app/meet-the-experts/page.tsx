import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
  description: 'Meet Rohit Sharma and Ajay Porwal, the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies for your business growth.',
  keywords: 'SEO experts, digital marketing team, Rohit Sharma SEO, Ajay Porwal, SEO consultants India, SEO agency team, local SEO experts',
  authors: [{ name: 'SEO Shouts Team' }],
  creator: 'SEO Shouts',
  publisher: 'SEO Shouts',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: '/meet-the-experts/',
  },
  openGraph: {
    title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
    description: 'Meet Rohit Sharma and Ajay Porwal, the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies.',
    url: '/meet-the-experts/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: '/images/team/rohit-sharma.jpg',
        width: 400,
        height: 400,
        alt: 'Rohit Sharma - SEO Expert',
      },
      {
        url: '/images/team/ajay-porwal.jpg', 
        width: 400,
        height: 400,
        alt: 'Ajay Porwal - Digital Marketing Expert',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'Meet Our SEO Experts - Rohit & Ajay | SEO Shouts Team',
    description: 'Meet the SEO experts behind SEO Shouts. Real results, honest advice, and proven digital marketing strategies for business growth.',
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

export default function MeetTheExperts() {
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
                "name": "Meet Our Experts",
                "item": "https://seoshouts.com/meet-the-experts/"
              }
            ]
          })
        }}
      />

      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
      <div className="max-w-5xl mx-auto px-4">

        {/* HERO */}
        <section className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-3">
            Meet the Humans Behind Your Results
          </h1>
          <p className="mt-3 text-xl font-semibold text-gray-700">
            The SEOShouts Team — Real Results. Real Conversation. No Agency Nonsense.
          </p>
          
          <p className="max-w-xl mx-auto text-gray-600 mt-4">
            We’re Rohit and Ajay. No suits. No buzzwords. Just two passionate digital marketers who deliver what matters: real growth and honest advice.
          </p>
          <div className="mt-6">
            <a
              href="/contact/"
              className="inline-block px-8 py-3 bg-gradient-to-r from-blue-700 to-purple-700 shadow-xl text-white rounded-full font-bold uppercase tracking-wide hover:scale-105 hover:bg-blue-800 transition"
            >
              Let's Chat &rarr;
            </a>
          </div>
        </section>

        {/* TEAM PROFILES */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-14">
          {/* Rohit */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl border-t-8 border-blue-700 transition-all duration-300 flex flex-col items-center px-6 py-8 relative">
            {/* === SWAP THIS URL WITH YOUR REAL PHOTO LATER === */}
            <img
              src="/images/team/rohit-sharma.jpg"
              alt="Rohit Sharma"
              className="w-32 h-32 rounded-full mb-4 shadow-lg border-4 border-white object-cover"
            />
            <h2 className="font-bold text-2xl text-blue-800 mb-0">Rohit Sharma</h2>
            <span className="text-xs uppercase font-semibold text-blue-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M12 20l9-5-9-5-9 5 9 5zm0-5V4m4 4H8"/></svg>
              SEO Guy Who Ranks
            </span>
            <div className="bg-blue-50 px-4 py-2 rounded-xl font-semibold text-blue-900 mt-1 mb-1 text-[15px]">
              SEO Developer &bull; Local SEO &bull; Global SEO &bull; eCommerce SEO
            </div>
            <p className="text-gray-600 text-sm mt-2 mb-2">
              Built SEOShouts out of frustration. Now, I build growth engines for businesses with practical, battle-tested SEO. No magic. Just strategies that outlive Google updates.
            </p>
            <ul className="text-left text-blue-900/90 text-sm space-y-1 mb-2">
              <li>
                <b>&#9733; Local & International SEO</b>
              </li>
              <li>
                <b>&#9733; Clear, jargon-free communication</b>
              </li>
              <li>
                <b>&#9733; WordPress rescue specialist</b>
              </li>
            </ul>
            <p className="text-gray-400 italic text-xs">Udaipur, Rajasthan</p>
            <a
              href="/authors/rohit-sharma/"
              className="mt-4 inline-flex items-center text-blue-700 hover:text-purple-600 text-sm font-semibold underline"
            >
              Know more about Rohit <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>

          {/* Ajay */}
          <div className="bg-white rounded-3xl shadow-xl hover:shadow-2xl border-t-8 border-purple-700 transition-all duration-300 flex flex-col items-center px-6 py-8 relative">
            {/* === SWAP THIS URL WITH YOUR REAL PHOTO LATER === */}
            <img
              src="/images/team/ajay-porwal.jpg"
              alt="Ajay Porwal"
              className="w-32 h-32 rounded-full mb-4 shadow-lg border-4 border-white object-cover"
            />
            <h2 className="font-bold text-2xl text-purple-800 mb-0">Ajay Porwal</h2>
            <span className="text-xs uppercase font-semibold text-purple-700 mb-2 flex items-center gap-1">
              <svg className="w-4 h-4 inline" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M3 12l2-2a4 4 0 015.657 0l2.121 2.121a4 4 0 005.657 0L21 12"/></svg>
              Ads & Social Guy
            </span>
            <div className="bg-blue-50 px-4 py-2 rounded-xl font-semibold text-blue-900 mt-1 mb-1 text-[15px]">
              Facebook Ads &bull; Google Ads
            </div>
            <p className="text-gray-700 text-sm mt-2 mb-2">
              Passionate about what truly makes people click. I run ads that perform, not just "spend," and turn social into a profit channel, not just a pretty page.
            </p>
            <ul className="text-left text-purple-900/90 text-sm space-y-1 mb-2">
              <li>
                <b>&#9733; Profit-focused ad campaigns</b>
              </li>
              <li>
                <b>&#9733; Data-driven social strategy</b>
              </li>
              <li>
                <b>&#9733; Relentless testing & improvement</b>
              </li>
            </ul>
            <p className="text-gray-400 italic text-xs">Udaipur, Rajasthan</p>
            <a
              href="/authors/ajay-porwal"
              className="mt-4 inline-flex items-center text-purple-700 hover:text-blue-700 text-sm font-semibold underline"
            >
              Know more about Ajay <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24"><path d="M9 5l7 7-7 7" /></svg>
            </a>
          </div>
        </div>

        {/* WHY WE WORK TOGETHER */}
        <div className="flex flex-col gap-6 mb-14">
          <h2 className="text-center text-xl sm:text-2xl font-bold mb-2 text-gray-900">
            Why We Actually Work (Really) Well Together
          </h2>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 justify-center items-stretch">
            <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 rounded-2xl p-5 shadow-sm">
              <span className="font-bold text-blue-800 text-lg block mb-1">Specialized</span>
              Rohit = Organic. Ajay = Paid. No ego, no blurring, double the impact.
            </div>
            <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 rounded-2xl p-5 shadow-sm">
              <span className="font-bold text-blue-800 text-lg block mb-1">Collaborative</span>
              Constant communication: SEO and ads fuel each other—testing, feedback, wins.
            </div>
            <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 rounded-2xl p-5 shadow-sm">
              <span className="font-bold text-blue-800 text-lg block mb-1">Transparent</span>
              You always know what’s working (& what’s not). We care about YOUR profits.
            </div>
            <div className="flex-1 bg-blue-50 border-l-4 border-blue-500 rounded-2xl p-5 shadow-sm">
              <span className="font-bold text-blue-800 text-lg block mb-1">Simple</span>
              No jargon, no fluff reports. Straight facts and real strategy.
            </div>
          </div>
        </div>

        {/* PROCESS STEPS */}
        <div className="mb-20">
          <h2 className="font-bold text-center text-blue-800 text-xl mb-6">What It’s Like to Work With Us</h2>
          <div className="flex flex-col sm:flex-row gap-8 items-center justify-center">
            <div className="flex-1 text-center bg-gradient-to-b from-white to-blue-50 rounded-2xl p-6 shadow border-blue-100 border mb-4 sm:mb-0">
              <h3 className="font-bold text-lg mb-1 text-blue-700">Month 1: Deep Dive</h3>
              <p className="text-gray-600">We go deep into your business, goals, and competition—no templates, no assumptions.</p>
            </div>
            <div className="flex-1 text-center bg-gradient-to-b from-white to-purple-50 rounded-2xl p-6 shadow border-blue-100 border mb-4 sm:mb-0">
              <h3 className="font-bold text-lg mb-1 text-purple-700">Month 2-3: Build & Action</h3>
              <p className="text-gray-600">Rohit builds SEO foundation. Ajay gets ads and social delivering results. Fast but strategic.</p>
            </div>
            <div className="flex-1 text-center bg-gradient-to-b from-white to-blue-50 rounded-2xl p-6 shadow border-blue-100 border">
              <h3 className="font-bold text-lg mb-1 text-blue-700">Month 4+: Optimize & Scale</h3>
              <p className="text-gray-600">Data, reporting, and constant improvement—double down where it’s working.</p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="bg-gradient-to-r from-blue-700 to-purple-700 rounded-2xl p-9 text-center mb-8 shadow-xl">
          <h2 className="font-bold text-2xl mb-3 text-white">Ready to Work With Experts Who Care?</h2>
          <p className="text-blue-100 mb-5 text-lg max-w-xl mx-auto">No fluff. No upsells. Just an honest conversation about helping your business grow. Let's bring clarity and real results to your digital strategy.</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-2">
            <a
              href="/contact/"
              className="font-bold px-7 py-3 bg-white text-blue-700 rounded-xl shadow hover:bg-blue-50 hover:text-blue-900 transition"
            >
              🎯 Book a Strategy Call
            </a>
            <a
              href="mailto:seoshouts@gmail.com"
              className="font-bold px-7 py-3 bg-white/20 border border-white rounded-xl text-white hover:bg-white hover:text-blue-700 transition"
              target="_blank" rel="noopener noreferrer"
            >
              📧 Email Us
            </a>
            <a
              href="tel:+918094888157"
              className="font-bold px-7 py-3 border-2 border-white rounded-xl text-white hover:bg-white hover:text-blue-700 transition"
            >
              📞 +91 8094888157
            </a>
          </div>
          <div className="mt-3 text-blue-100 text-sm">Helping businesses across India and beyond</div>
        </div>

        <div className="text-center text-xs text-gray-500">
          Rohit &amp; Ajay – The SEOShouts Team | Real Results | No BS | Actually Located in India
        </div>
      </div>
    </div>
    </>
  );
}
