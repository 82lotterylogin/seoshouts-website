import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Terms of Service | SEO Shouts',
  description: 'Read the terms and conditions governing your use of SEOShouts services, website, and related content.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/terms-and-conditions',
  },
  openGraph: {
    title: 'Terms of Service | SEO Shouts',
    description: 'Detailed terms of service for using SEO Shouts website and services.',
    url: 'https://seoshouts.com/terms-and-conditions',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/terms-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Terms of Service',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Terms of Service | SEO Shouts',
    description: 'Terms governing the use of SEO Shouts services and website.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/terms-twitter-image.jpg'],
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

export default function TermsAndConditionsPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
            Terms of Service for SEOShouts
          </h1>
          <p className="text-xl text-gray-600">
            Last Updated: August 1, 2025
          </p>
        </section>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <p className="text-gray-700 leading-relaxed">
            Welcome to SEOShouts (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India). These Terms and Conditions ("Terms") govern your access to and use of our website, services, and any related content or features (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms, which form a legally binding agreement between you ("User," "Client," or "You") and SEOShouts ("We," "Us," or "Our").
          </p>
          <p className="text-gray-700 leading-relaxed">
            If you do not agree with any part of these Terms, please do not use our Services. We reserve the right to update these Terms at any time, with changes posted on this page. Continued use after updates constitutes acceptance of the revised Terms.
          </p>
          <p className="text-gray-700 leading-relaxed">
            These Terms are governed by the laws of India, including the Indian Contract Act, 1872, and the Information Technology Act, 2000. In case of disputes, jurisdiction lies exclusively with the courts in Udaipur, Rajasthan.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Acceptance of Terms</h2>
            <p className="text-gray-700 mb-4">
              By using our Services, you confirm that:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>You are at least 18 years old or have the legal capacity to enter into contracts under applicable law.</li>
              <li>You will comply with these Terms and all applicable local, state, national, and international laws.</li>
              <li>You are not prohibited from using our Services under any applicable laws or regulations.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We may refuse service, terminate accounts, or cancel orders at our discretion if we believe these Terms have been violated.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. Description of Services</h2>
            <p className="text-gray-700 mb-4">
              SEOShouts provides digital marketing services, including but not limited to:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Search Engine Optimization (SEO) consulting, audits, and implementation.</li>
              <li>Link building and authority development strategies.</li>
              <li>Website development and optimization.</li>
              <li>PPC (Pay-Per-Click) advertising and social media marketing.</li>
              <li>Related consulting, training, and support services.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Services are provided on a project or ongoing basis as agreed upon in a separate service agreement or proposal. We do not guarantee specific results, rankings, or outcomes due to the dynamic nature of search engines and external factors beyond our control.
            </p>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. User Accounts and Responsibilities</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Account Creation</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>To access certain Services, you may need to create an account with accurate and complete information.</li>
              <li>You are responsible for maintaining the confidentiality of your account credentials and for all activities under your account.</li>
              <li>Notify us immediately of any unauthorized access or security breach.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">User Obligations</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Provide accurate, current, and complete information during registration, inquiries, or service engagements.</li>
              <li>Use Services only for lawful purposes and in compliance with these Terms.</li>
              <li>Not engage in any activity that interferes with or disrupts the Services, such as hacking, spamming, or distributing malware.</li>
              <li>Not reproduce, duplicate, copy, sell, or exploit any part of the Services without our express written permission.</li>
              <li>Respect intellectual property rights and not infringe on third-party copyrights, trademarks, or patents.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Violation of these obligations may result in immediate termination of Services and potential legal action.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Payment and Billing</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Services are provided upon agreement to a proposal or contract, which outlines scope, deliverables, and payment terms.</li>
              <li>Payments are due as specified in the invoice or contract (e.g., upfront, milestone-based, or monthly).</li>
              <li>All payments are non-refundable except as explicitly stated in a service agreement.</li>
              <li>We accept payments via bank transfer, credit card, or other methods specified. All transactions are processed securely through third-party gateways.</li>
              <li>Late payments may incur fees or result in suspension of Services. Taxes, if applicable, are your responsibility.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We reserve the right to modify payment terms with notice.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Intellectual Property Rights</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Our Intellectual Property</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>All content on our website (text, graphics, logos, images, software, etc.) is owned by SEOShouts or our licensors and protected by copyright, trademark, and other intellectual property laws.</li>
              <li>You may not copy, modify, distribute, or use our intellectual property without prior written consent.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Your Content and Submissions</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Any content you provide (e.g., project briefs, feedback, or materials for services) grants us a non-exclusive, royalty-free license to use it for delivering Services.</li>
              <li>You retain ownership of your content but warrant that it does not infringe on third-party rights.</li>
              <li>We may use anonymized case studies or results from our work with you for marketing purposes, unless otherwise agreed.</li>
            </ul>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Service Delivery and Limitations</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>We strive to deliver Services as described, but timelines may vary due to factors like client feedback delays or external dependencies.</li>
              <li>Services are provided "as is" without warranties of any kind, express or implied, including fitness for a particular purpose or non-infringement.</li>
              <li>We do not guarantee specific SEO results, traffic increases, or rankings, as these depend on search engine algorithms and external factors.</li>
              <li>You acknowledge that digital marketing involves risks, such as algorithm changes or competitive shifts, and we are not liable for such outcomes.</li>
            </ul>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Limitations of Liability</h2>
            <p className="text-gray-700 mb-4">
              To the fullest extent permitted by law:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>SEOShouts, its affiliates, employees, and agents shall not be liable for any indirect, incidental, consequential, special, or punitive damages arising from or related to the Services, even if advised of the possibility of such damages.</li>
              <li>Our total liability shall not exceed the amount paid by you for the specific Services giving rise to the claim.</li>
              <li>This limitation applies to all claims, including contract, tort, negligence, or strict liability.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We are not responsible for losses due to events beyond our control, such as natural disasters, cyber-attacks, or third-party service failures.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Indemnification</h2>
            <p className="text-gray-700 mb-4">
              You agree to indemnify, defend, and hold harmless SEOShouts, its officers, directors, employees, and agents from any claims, liabilities, damages, losses, or expenses (including legal fees) arising from:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Your violation of these Terms or applicable laws.</li>
              <li>Your content or use of Services infringing on third-party rights.</li>
              <li>Any negligent or willful misconduct on your part.</li>
            </ul>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Termination</h2>
            <p className="text-gray-700 mb-4">
              We may terminate or suspend your access to Services at any time, without notice, for reasons including:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Violation of these Terms.</li>
              <li>Non-payment or breach of contract.</li>
              <li>Legal requirements or business decisions.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Upon termination, you must cease using Services, and any outstanding payments remain due. Provisions surviving termination include intellectual property, limitations of liability, and indemnification.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Dispute Resolution</h2>
            <p className="text-gray-700">
              Any disputes arising from these Terms or Services shall be resolved through good-faith negotiations. If unresolved, they will be submitted to binding arbitration in Udaipur, Rajasthan, under the Arbitration and Conciliation Act, 1996. The arbitrator's decision is final and enforceable in court.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Governing Law and Jurisdiction</h2>
            <p className="text-gray-700">
              These Terms are governed by the laws of India, without regard to conflict of laws principles. Exclusive jurisdiction for disputes lies with the courts in Udaipur, Rajasthan.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Force Majeure</h2>
            <p className="text-gray-700">
              We are not liable for delays or failures due to events beyond our reasonable control, such as acts of God, war, terrorism, pandemics, or government actions.
            </p>
          </section>

          {/* Section 13 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">13. Miscellaneous</h2>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Severability:</strong> If any provision is deemed invalid, the remaining Terms remain in effect.</li>
              <li><strong>Waiver:</strong> Failure to enforce any right does not constitute a waiver.</li>
              <li><strong>Assignment:</strong> We may assign these Terms without notice; you may not assign without our consent.</li>
              <li><strong>Entire Agreement:</strong> These Terms, along with any service agreements, constitute the full understanding between parties.</li>
              <li><strong>Notices:</strong> Communications will be via email or posted on the website.</li>
            </ul>
          </section>

          {/* Section 14 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">14. Changes to Terms</h2>
            <p className="text-gray-700">
              We may update these Terms at any time. Changes will be posted here with a revised effective date. Significant changes will be notified via email or website notice. Continued use constitutes acceptance.
            </p>
          </section>

          {/* Section 15 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">15. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions or concerns about these Terms, contact us at:
            </p>
            <p className="text-gray-700">
              <strong>SEOShouts</strong><br />
              Udaipur, Rajasthan, India<br />
              Email: contact@seoshouts.com<br />
              Phone: +91 8094888157
            </p>
            <p className="text-gray-700 mt-4">
              Thank you for choosing SEOShouts. We look forward to serving you!
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
