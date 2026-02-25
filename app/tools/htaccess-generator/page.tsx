import { Metadata } from 'next'
import HtaccessGeneratorClient from './HtaccessGeneratorClient'

const faqItems = [
  {
    question: 'What is an .htaccess file?',
    answer:
      "An .htaccess file is a directory-level configuration file for Apache web servers. It controls how your server handles requests including redirects, security, compression, and caching without requiring changes to the main server configuration. The file name starts with a dot and has no extension: it must be saved as exactly `.htaccess`.",
  },
  {
    question: 'Is .htaccess supported on my hosting?',
    answer:
      'Most shared hosting providers support .htaccess. Nginx servers do not use .htaccess and VPS or dedicated servers may have .htaccess disabled if AllowOverride is set to None. Check with your hosting provider if unsure.',
  },
  {
    question: 'Can a wrong .htaccess file break my website?',
    answer:
      'Yes. A syntax error in your .htaccess file can cause a 500 Internal Server Error for your entire site. Always keep a backup of your current working .htaccess before making changes.',
  },
  {
    question: "What's the difference between 301 and 302 redirects?",
    answer:
      'A 301 redirect tells search engines the move is permanent and passes close to full link equity. A 302 redirect signals a temporary move and Google may continue indexing the original URL.',
  },
  {
    question: 'Does GZIP compression work with all browsers?',
    answer:
      'Yes. GZIP has been supported by all major browsers for many years. Browsers automatically decompress files before rendering.',
  },
  {
    question: 'How do I add .htaccess to a WordPress site?',
    answer:
      'Upload the generated file to your WordPress root directory (the folder containing wp-config.php). Use the WordPress preset to include the required WordPress rewrite rules and back up any existing .htaccess first.',
  },
  {
    question: "What's the difference between .htaccess and robots.txt?",
    answer:
      '.htaccess operates at the server level and controls what the server does when requests are received. robots.txt operates at the crawler level and tells bots which pages to crawl.',
  },
  {
    question: 'Can I use .htaccess if I am on Cloudflare?',
    answer:
      'Yes, but some rules may conflict with or duplicate Cloudflare settings. Cloudflare may already handle HTTPS, caching, and compression at the CDN level.',
  },
]

export const metadata: Metadata = {
  title: 'Free .htaccess Generator - Create Apache Rules Instantly | SEOShouts',
  description:
    'Generate .htaccess files instantly - 301 redirects, security headers, GZIP compression, browser caching & WordPress/Shopify presets. Free, no login required.',
  keywords:
    'htaccess generator, htaccess file generator, apache htaccess generator, create htaccess file, htaccess redirect generator, htaccess rules generator',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/htaccess-generator/',
  },
  openGraph: {
    title: 'Free .htaccess Generator - Create Apache Rules Instantly',
    description:
      'Generate .htaccess files with redirects, security headers, GZIP compression, browser caching rules, and CMS presets.',
    url: 'https://seoshouts.com/tools/htaccess-generator/',
    siteName: 'SEOShouts',
    type: 'website',
    images: [
      {
        url: 'https://seoshouts.com/images/htaccess-generator-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Free .htaccess Generator - SEOShouts',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free .htaccess Generator - Create Apache Rules Instantly',
    description:
      'Generate redirects, security headers, GZIP compression, browser caching rules, and CMS presets.',
    images: ['https://seoshouts.com/images/htaccess-generator-og.jpg'],
  },
  robots: {
    index: true,
    follow: true,
  },
  other: {
    language: 'en',
  },
}

export default function HtaccessGeneratorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'SoftwareApplication',
            name: '.htaccess Generator',
            url: 'https://seoshouts.com/tools/htaccess-generator/',
            applicationCategory: 'WebApplication',
            operatingSystem: 'Any',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'USD' },
            description:
              'Free .htaccess generator for Apache servers. Create redirects, security headers, GZIP compression, browser caching rules, and CMS-specific presets instantly.',
            featureList: [
              '301/302/307/308 Redirects',
              'Security Headers',
              'GZIP Compression',
              'Browser Caching',
              'CMS Presets',
              'Custom Error Pages',
              'PHP Settings',
            ],
            softwareVersion: '1.0',
            dateModified: '2026-02-24',
            publisher: {
              '@type': 'Organization',
              name: 'SEOShouts',
              url: 'https://seoshouts.com',
            },
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'FAQPage',
            mainEntity: faqItems.map((item) => ({
              '@type': 'Question',
              name: item.question,
              acceptedAnswer: {
                '@type': 'Answer',
                text: item.answer.replace(/`/g, ''),
              },
            })),
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'HowTo',
            name: 'How to Create and Upload Your .htaccess File',
            description:
              'Step-by-step guide to configuring redirects, security headers, compression, caching, and CMS presets with the SEOShouts .htaccess Generator.',
            totalTime: 'PT5M',
            tool: {
              '@type': 'HowToTool',
              name: 'SEOShouts .htaccess Generator',
            },
            step: [
              {
                '@type': 'HowToStep',
                position: 1,
                name: 'Select a CMS Preset',
                text: 'Choose WordPress, Shopify, Laravel, Joomla, or no preset to prefill the correct rewrite and optimization settings.',
              },
              {
                '@type': 'HowToStep',
                position: 2,
                name: 'Configure Redirects',
                text: 'Add redirect rules with source path, destination path, and redirect type (301/302/307/308).',
              },
              {
                '@type': 'HowToStep',
                position: 3,
                name: 'Enable Security and Performance Rules',
                text: 'Toggle security headers, GZIP compression, browser caching, error pages, and PHP settings as needed.',
              },
              {
                '@type': 'HowToStep',
                position: 4,
                name: 'Generate and Review Code',
                text: 'Generate the .htaccess file, review the commented output, then copy or download the final code.',
              },
              {
                '@type': 'HowToStep',
                position: 5,
                name: 'Upload and Test',
                text: 'Upload the file to your server root, confirm the website loads correctly, and test redirects and headers.',
              },
            ],
          }),
        }}
      />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BreadcrumbList',
            itemListElement: [
              {
                '@type': 'ListItem',
                position: 1,
                name: 'Home',
                item: 'https://seoshouts.com/',
              },
              {
                '@type': 'ListItem',
                position: 2,
                name: 'SEO Tools',
                item: 'https://seoshouts.com/tools/',
              },
              {
                '@type': 'ListItem',
                position: 3,
                name: '.htaccess Generator',
                item: 'https://seoshouts.com/tools/htaccess-generator/',
              },
            ],
          }),
        }}
      />

      <HtaccessGeneratorClient />
    </>
  )
}
