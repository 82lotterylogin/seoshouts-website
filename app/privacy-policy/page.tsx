import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Privacy Policy | SEO Shouts',
  description: 'Our commitment to protecting your privacy and handling your personal data with care. Learn how we collect, use, and safeguard your information.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/privacy-policy',
  },
  openGraph: {
    title: 'Privacy Policy | SEO Shouts',
    description: 'Detailed information on how SEO Shouts handles your personal data in compliance with Indian and international privacy laws.',
    url: 'https://seoshouts.com/privacy-policy',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/privacy-policy-og.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Shouts Privacy Policy',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Privacy Policy | SEO Shouts',
    description: 'How we protect your privacy and handle personal data at SEO Shouts.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/privacy-policy-twitter.jpg'],
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

export default function PrivacyPolicyPage() {
  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen pb-16 pt-12">
      <div className="container mx-auto px-4 sm:px-6 max-w-4xl">
        {/* Hero Header */}
        <section className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 via-blue-800 to-purple-700 bg-clip-text text-transparent mb-4">
            Privacy Policy
          </h1>
        </section>

        {/* Main Content */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-8">
          <p className="text-gray-700 leading-relaxed">
            At SEOShouts (operated under seoshouts.com, headquartered in Udaipur, Rajasthan, India), we are committed to protecting your privacy and handling your personal data with the utmost care and transparency. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, engage with our services, or interact with us in any way. We comply with applicable Indian laws, including the Information Technology Act, 2000, the Digital Personal Data Protection Act, 2023 (DPDPA), and relevant international standards such as the General Data Protection Regulation (GDPR) for users in the European Union.
          </p>
          <p className="text-gray-700 leading-relaxed">
            By accessing or using our website or services, you consent to the practices described in this Privacy Policy. If you do not agree with any part of this policy, please discontinue use of our site and services immediately.
          </p>

          {/* Section 1 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">1. Information We Collect</h2>
            <p className="text-gray-700 mb-4">
              We collect information that identifies, relates to, or could reasonably be linked with you as an individual ("Personal Data"). The types of information we may collect include:
            </p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Personal Identification Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Name, email address, phone number, postal address, and other contact details you provide when inquiring about services, subscribing to newsletters, or contacting us via forms on the website.</li>
              <li>Billing and payment information (e.g., credit card details, bank account information) if you engage in paid services, processed securely through third-party payment gateways.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Professional or Business-Related Information</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Company name, job title, industry, and business contact details shared during consultations or service engagements.</li>
              <li>Details about your website, SEO goals, or digital marketing needs provided in inquiries or project briefs.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Technical and Usage Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Device information, such as IP address, browser type, operating system, and device identifiers.</li>
              <li>Usage data, including pages visited, time spent on the site, referral sources, and navigation patterns.</li>
              <li>Log data, such as access times, error logs, and server interactions.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Marketing and Communication Data</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Preferences for receiving marketing communications from us.</li>
              <li>Responses to surveys, feedback forms, or promotional campaigns.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Sensitive Personal Data</h3>
            <p className="text-gray-700">
              We do not intentionally collect sensitive personal data (e.g., racial or ethnic origin, religious beliefs, health information, or biometric data) unless it is voluntarily provided by you for a specific purpose, such as in a client project. If such data is shared, we handle it with additional safeguards as required by law.
            </p>
            <p className="text-gray-700 mt-4">
              We do not collect Personal Data from individuals under 18 years of age. If we become aware that we have collected such data, we will promptly delete it.
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">2. How We Collect Information</h2>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Directly from You</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>When you fill out contact forms, request quotes, subscribe to our newsletter, or engage in consultations.</li>
              <li>During communications via email, phone, or our website's chat features.</li>
              <li>When you provide feedback, participate in surveys, or interact with our blog comments.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">Automatically Through Technology</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Cookies and Similar Technologies:</strong> We use cookies, web beacons, and tracking pixels to collect usage data. Essential cookies enable core site functionality, while analytics cookies help us improve user experience. You can manage cookie preferences through your browser settings. For details, see our Cookie Policy section below.</li>
              <li><strong>Analytics Tools:</strong> We use Google Analytics to track website performance and user behavior. This may include anonymized data about your visit duration and pages viewed.</li>
              <li><strong>Log Files:</strong> Our servers automatically log standard information for security and performance monitoring.</li>
            </ul>
            <h3 className="text-xl font-bold text-gray-900 mt-6 mb-2">From Third Parties</h3>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>From business partners, such as analytics providers (e.g., Google) or advertising networks, who may share aggregated data.</li>
              <li>From publicly available sources, such as social media profiles or business directories, when relevant to service delivery.</li>
              <li>From payment processors during transactions, ensuring secure handling.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">3. How We Use Your Information</h2>
            <p className="text-gray-700 mb-4">
              We use your Personal Data for legitimate business purposes, always in compliance with applicable laws. Primary uses include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Providing Services:</strong> To respond to inquiries, deliver SEO consulting, link building, or other services, and manage client relationships.</li>
              <li><strong>Website Operation and Improvement:</strong> To maintain site functionality, analyze usage patterns, and enhance user experience.</li>
              <li><strong>Marketing and Communications:</strong> To send newsletters, promotional offers, or updates about our services (with your consent where required). You can opt out at any time via unsubscribe links or by contacting us.</li>
              <li><strong>Legal Compliance and Security:</strong> To comply with legal obligations, prevent fraud, resolve disputes, and enforce our terms of service.</li>
              <li><strong>Analytics and Research:</strong> To generate anonymized insights that help us improve our services and understand market trends.</li>
              <li><strong>Personalization:</strong> To tailor content and recommendations based on your interactions and preferences.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              We do not use your data for automated decision-making that produces legal effects or significantly affects you without human oversight.
            </p>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">4. Sharing and Disclosure of Information</h2>
            <p className="text-gray-700 mb-4">
              We do not sell, rent, or trade your Personal Data. We may share information in the following limited circumstances:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Service Providers:</strong> With trusted third-party vendors (e.g., hosting providers, email services like Mailchimp, or analytics tools like Google Analytics) who assist in operating our website and services. These providers are contractually bound to use data only for specified purposes and maintain confidentiality.</li>
              <li><strong>Business Partners:</strong> With affiliates or partners for joint marketing or service delivery, always with your consent.</li>
              <li><strong>Legal Requirements:</strong> If required by law, court order, or government authority, or to protect our rights, property, or safety (e.g., in response to a subpoena or fraud investigation).</li>
              <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your data may be transferred as part of the business assets, with notice provided where required.</li>
              <li><strong>Aggregated or Anonymized Data:</strong> We may share non-personal, aggregated data for research or marketing purposes.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              For users in the EU/EEA, we ensure that any international data transfers comply with GDPR requirements, such as Standard Contractual Clauses.
            </p>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">5. Data Security Measures</h2>
            <p className="text-gray-700 mb-4">
              We implement robust security measures to protect your Personal Data from unauthorized access, alteration, disclosure, or destruction:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Technical Safeguards:</strong> Encryption (e.g., SSL/TLS for data in transit), firewalls, and secure servers hosted in compliant data centers.</li>
              <li><strong>Organizational Measures:</strong> Access controls limiting data to authorized personnel only, regular security audits, and employee training on data protection.</li>
              <li><strong>Physical Security:</strong> Secure facilities and restricted access to physical servers.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              While we strive to protect your data, no system is 100% secure. We cannot guarantee absolute security, but we commit to notifying you of any data breaches as required by law (e.g., within 72 hours under DPDPA or GDPR).
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">6. Your Rights and Choices</h2>
            <p className="text-gray-700 mb-4">
              Under applicable laws (e.g., DPDPA in India or GDPR in the EU), you have rights regarding your Personal Data:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Access:</strong> Request details about the data we hold about you.</li>
              <li><strong>Correction:</strong> Update or correct inaccurate information.</li>
              <li><strong>Deletion:</strong> Request removal of your data (subject to legal obligations).</li>
              <li><strong>Objection:</strong> Object to processing for certain purposes, such as marketing.</li>
              <li><strong>Portability:</strong> Receive your data in a structured, machine-readable format.</li>
              <li><strong>Withdrawal of Consent:</strong> Revoke consent at any time (this won't affect prior lawful processing).</li>
            </ul>
            <p className="text-gray-700 mt-4">
              To exercise these rights, contact us at seoshouts@gmail.com. We will respond within 30 days (extendable under DPDPA or GDPR if complex). For complaints, you may approach the Data Protection Authority in your jurisdiction.
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">7. Cookies and Tracking Technologies</h2>
            <p className="text-gray-700 mb-4">
              Our website uses cookies to enhance functionality and user experience:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li><strong>Essential Cookies:</strong> Required for basic site operation (e.g., session management).</li>
              <li><strong>Analytics Cookies:</strong> Track usage patterns (e.g., Google Analytics) to improve our site.</li>
              <li><strong>Marketing Cookies:</strong> Enable personalized ads (e.g., Google Ads remarketing).</li>
            </ul>
            <p className="text-gray-700 mt-4">
              You can manage cookies via your browser settings or our cookie consent banner. Note that disabling cookies may limit site functionality. For more details, view our Cookie Policy [link to separate page if available].
            </p>
            <p className="text-gray-700 mt-4">
              We do not track users across third-party sites without consent and respect Do Not Track (DNT) signals where applicable.
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">8. Data Retention</h2>
            <p className="text-gray-700 mb-4">
              We retain Personal Data only as long as necessary for the purposes outlined in this policy:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-gray-700">
              <li>Contact data: Up to 2 years after last interaction.</li>
              <li>Service-related data: For the duration of our business relationship plus 7 years for legal compliance.</li>
              <li>Analytics data: Anonymized and retained indefinitely for trend analysis.</li>
            </ul>
            <p className="text-gray-700 mt-4">
              Data is securely deleted or anonymized when no longer needed.
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-700">
              Our services are not directed to children under 18. We do not knowingly collect data from minors. If we discover such data, we will delete it immediately.
            </p>
          </section>

          {/* Section 10 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">10. Third-Party Links</h2>
            <p className="text-gray-700">
              Our website may contain links to third-party sites. We are not responsible for their privacy practices. We encourage reviewing their policies before providing information.
            </p>
          </section>

          {/* Section 11 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">11. Changes to This Privacy Policy</h2>
            <p className="text-gray-700">
              We may update this policy to reflect changes in our practices or legal requirements. Significant changes will be notified via email or website notice, with the updated effective date. Continued use after changes constitutes acceptance.
            </p>
          </section>

          {/* Section 12 */}
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">12. Contact Us</h2>
            <p className="text-gray-700 mb-4">
              For questions, rights requests, or concerns about this Privacy Policy, contact our Data Protection Officer:
            </p>
            <p className="text-gray-700">
              <strong>SEOShouts</strong><br />
              Udaipur, Rajasthan, India<br />
              Email: seoshouts@gmail.com<br />
              Phone: +91 8094888157
            </p>
            <p className="text-gray-700 mt-4">
              For EU/EEA users, our GDPR representative can be contacted at the above address.
            </p>
            <p className="text-gray-700 mt-4">
              This Privacy Policy is governed by Indian law. In case of disputes, jurisdiction lies with the courts in Udaipur, Rajasthan.
            </p>
          </section>
        </div>
      </div>
    </div>
  )
}
