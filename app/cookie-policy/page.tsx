import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cookie Policy | SEO Shouts',
  description: 'Learn about the cookies and tracking technologies we use on seoshouts.com to enhance your experience and how you can manage them.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/cookie-policy',
  },
  openGraph: {
    title: 'Cookie Policy | SEO Shouts',
    description: 'Detailed information on our use of cookies, types, purposes, and your management options.',
    url: 'https://seoshouts.com/cookie-policy',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/cookie-policy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Cookie Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Cookie Policy | SEO Shouts',
    description: 'How we use cookies and tracking technologies at SEO Shouts.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/cookie-policy-twitter.jpg'],
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

export default function CookiePolicyPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
            Cookie Policy for SEOShouts
          </h1>
        </section>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <p className="text-gray-700 leading-relaxed">
            At SEOShouts (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India), we use cookies and similar tracking technologies to enhance your experience on our website, analyze site performance, and deliver personalized content. This Cookie Policy explains what cookies are, how we use them, the types we employ, and your choices for managing them. This policy complements our Privacy Policy, which details our broader data handling practices.
          </p>
          <p className="text-gray-700 leading-relaxed">
            We comply with applicable laws, including the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023 (DPDPA) in India, and the General Data Protection Regulation (GDPR) for users in the European Union. By continuing to use our website, you consent to our use of cookies as described. If you do not agree, please adjust your browser settings or discontinue use.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. What Are Cookies?</h2>
            <p className="text-gray-700 mb-4">
              Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They allow the site to recognize your device and remember information about your visit, such as preferences, login details, or browsing behavior. Cookies can be "persistent" (stored until they expire or are deleted) or "session" (temporary and deleted when you close your browser).
            </p>
            <p className="text-gray-700">
              We also use similar technologies like web beacons (small images that track interactions), pixels (embedded code for analytics), and local storage (browser-based data storage). These help us understand how users interact with our site and improve functionality.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Why Do We Use Cookies?</h2>
            <p className="text-gray-700 mb-4">
              We use cookies for essential operational purposes, to improve user experience, and for analytics and marketing. Specifically:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Functionality:</strong> To enable core site features, such as navigation, secure areas, and form submissions.</li>
              <li><strong>Performance and Analytics:</strong> To monitor site usage, identify issues, and optimize content based on visitor behavior.</li>
              <li><strong>Personalization:</strong> To remember your preferences (e.g., language or region) and provide tailored content.</li>
              <li><strong>Marketing and Advertising:</strong> To deliver relevant ads and measure campaign effectiveness.</li>
              <li><strong>Security:</strong> To detect and prevent fraudulent activity or unauthorized access.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not use cookies to collect sensitive personal information without your explicit consent.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. Types of Cookies We Use</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Essential Cookies</h3>
            <p className="text-gray-700 mb-4">
              These are necessary for the website to function properly and cannot be disabled in our systems. They are usually set in response to actions like logging in or filling out forms.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Examples:</strong> Session cookies for maintaining user sessions, security cookies for authentication.</li>
              <li><strong>Duration:</strong> Session-based (deleted when you close your browser).</li>
              <li><strong>Managed By:</strong> Us (first-party cookies).</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Performance and Analytics Cookies</h3>
            <p className="text-gray-700 mb-4">
              These collect anonymized data on how visitors use our site, helping us improve performance and content.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Examples:</strong> Google Analytics cookies tracking page views, bounce rates, and traffic sources.</li>
              <li><strong>Duration:</strong> Up to 2 years (persistent).</li>
              <li><strong>Managed By:</strong> Third parties like Google (with data processed anonymously).</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Marketing and Targeting Cookies</h3>
            <p className="text-gray-700 mb-4">
              These enable personalized advertising and track ad effectiveness across sites.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Examples:</strong> Google Ads or Facebook Pixel cookies for remarketing and conversion tracking.</li>
              <li><strong>Duration:</strong> Up to 2 years (persistent).</li>
              <li><strong>Managed By:</strong> Third parties like Google or Meta (with options to opt out).</li>
            </ul>

            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Functional Cookies</h3>
            <p className="text-gray-700 mb-4">
              These enhance site functionality by remembering your choices.
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Examples:</strong> Cookies storing your preferred language or region settings.</li>
              <li><strong>Duration:</strong> Up to 1 year (persistent).</li>
              <li><strong>Managed By:</strong> Us (first-party cookies).</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not use cookies for profiling or automated decision-making without your consent.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Third-Party Cookies</h2>
            <p className="text-gray-700 mb-4">
              Some cookies on our site are set by third-party services we use for analytics, advertising, or social media integration. These include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Google Analytics and Google Ads:</strong> For traffic analysis and ad personalization (Google's privacy policy: policies.google.com/privacy).</li>
              <li><strong>Facebook Pixel:</strong> For social media advertising and retargeting (Meta's privacy policy: facebook.com/privacy/policy).</li>
              <li><strong>Other Tools:</strong> Such as Hotjar for heatmaps or Mailchimp for email marketing.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              These third parties may combine data from our site with information from other sources. We do not control their practices and recommend reviewing their policies.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Your Choices and Cookie Management</h2>
            <p className="text-gray-700 mb-4">
              You have full control over cookies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Cookie Consent Banner:</strong> On your first visit, you'll see a banner allowing you to accept, reject, or customize cookie preferences (except essential cookies).</li>
              <li><strong>Browser Settings:</strong> Most browsers allow you to block or delete cookies. For instructions:</li>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Chrome: support.google.com/chrome/answer/95647</li>
                <li>Firefox: support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop</li>
                <li>Safari: support.apple.com/en-in/guide/safari/sfri11471/mac</li>
                <li>Edge: support.microsoft.com/en-us/microsoft-edge/delete-cookies-in-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09</li>
              </ul>
              <li><strong>Opt-Out Tools:</strong> Use tools like Google's opt-out (tools.google.com/dlpage/gaoptout) or the Network Advertising Initiative (optout.networkadvertising.org).</li>
              <li><strong>Do Not Track (DNT):</strong> We respect DNT signals where enabled in your browser.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Note: Disabling cookies may limit site functionality, such as personalized features or analytics-driven improvements.
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Data Security and Retention</h2>
            <p className="text-gray-700 mb-4">
              Cookies containing personal data are handled securely per our Privacy Policy. We retain cookie data only as long as necessary:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Essential cookies: For the session duration.</li>
              <li>Analytics cookies: Up to 2 years.</li>
              <li>Marketing cookies: Up to 2 years or until you withdraw consent.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Data is deleted or anonymized when no longer needed.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Children's Privacy</h2>
            <p className="text-gray-700">
              We do not knowingly collect cookie data from children under 18. If such data is identified, it is deleted immediately.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. International Data Transfers</h2>
            <p className="text-gray-700">
              For users outside India, cookie data may be transferred to our servers or third-party processors. We ensure compliance with DPDPA and GDPR through appropriate safeguards, such as Standard Contractual Clauses.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Changes to This Cookie Policy</h2>
            <p className="text-gray-700">
              We may update this policy to reflect changes in our practices or legal requirements. Updates will be posted here with a revised effective date. Significant changes will be notified via the website or email.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions or to exercise your rights regarding cookies, contact our Data Protection Officer:
            </p>
            <p className="text-gray-700">
              <strong>SEOShouts</strong><br />
              Udaipur, Rajasthan, India<br />
              Email: contact@seoshouts.com<br />
              Phone: +91 8094888157
            </p>
            <p className="text-gray-700 mt-4">
              This Cookie Policy is governed by Indian law.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
