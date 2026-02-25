import type { Metadata } from 'next'
import DisavowFileGeneratorClient from './DisavowFileGeneratorClient'

const faqItems = [
  {
    question: 'What is a disavow file?',
    answer:
      'A disavow file is a plain text document submitted to Google Search Console listing domains or URLs whose backlinks you want Google to ignore. When submitted, Google excludes those links from its ranking calculations. The file uses a specific format: domain-level entries start with domain:, URL-level entries are plain URLs, and comments begin with #.',
  },
  {
    question: 'Does disavowing links actually work in 2026?',
    answer:
      "Google's Penguin algorithm has been running in real time since 2016, meaning many harmful links are automatically devalued. However, for sites that have received manual actions or have clear patterns of manipulative link building, the disavow tool remains effective. Google's John Mueller confirmed in 2023 that the tool is still actively used by Google's systems.",
  },
  {
    question: 'What format does Google Search Console require for disavow files?',
    answer:
      'The file must be plain UTF-8 text with a .txt extension. Domain entries use the format domain:example.com. URL entries are plain URLs. Lines starting with # are comments and are ignored. Maximum file size is 2MB. This generator produces output that meets all these requirements.',
  },
  {
    question: 'Should I disavow the entire domain or specific URLs?',
    answer:
      "Disavow the entire domain when the whole site is spam, a link farm, or a PBN. Use URL-level disavow only when a legitimate site has one problematic page linking to you. Google recommends domain-level disavow for the vast majority of spam cleanup cases because it covers all current and future links from that domain.",
  },
  {
    question: 'Will disavowing links hurt my good rankings?',
    answer:
      "Only if you accidentally disavow legitimate backlinks. This is why the whitelist feature is critical — use it to protect domains you know are sending you valuable links. Never disavow your most authoritative links. If you're uncertain about a domain, err on the side of not disavowing it.",
  },
  {
    question: 'How long does it take for Google to process a disavow file?',
    answer:
      'Google typically processes new or updated disavow files within a few days. However, ranking changes resulting from the disavow may take several weeks to months to manifest, depending on your crawl frequency and the severity of the link issues.',
  },
  {
    question: 'Can I update my disavow file after submitting?',
    answer:
      'Yes. Uploading a new disavow file replaces the previous one entirely — it does not add to it. Always maintain a master disavow file that you update and re-upload. Never submit a partial list expecting it to merge with your previous submission.',
  },
  {
    question: 'Do I need to disavow nofollow backlinks?',
    answer:
      'No. Nofollow links (rel="nofollow") are already ignored by Google for ranking purposes. Including them in your disavow file is harmless but unnecessary. The disavow tool is intended for followed links that pass PageRank.',
  },
]

const howToSteps = [
  'Export your complete backlink profile from Ahrefs, Semrush, Moz Link Explorer, or Google Search Console.',
  'Sort by domain rating/authority and manually review links from low-authority, high-spam, or foreign-language domains irrelevant to your niche.',
  'Paste the toxic URLs or domains into the generator and choose domain-level or URL-level mode.',
  'Add trusted domains to the whitelist field so they are excluded from the disavow output.',
  'Review processed entries, toggle exclusions as needed, and check stats (Raw vs Final count). Download disavow.txt.',
  'Upload the final file in Google Search Console: Links → Disavow links → Select your property → Upload disavow file.',
]

export const metadata: Metadata = {
  title: 'Free Disavow File Generator — Google Search Console Format | SEOShouts',
  description:
    'Generate Google-compliant disavow files instantly. Paste toxic backlinks, auto-extract domains, remove duplicates, and download in Google Search Console format. Free.',
  keywords:
    'disavow file generator, google disavow tool, disavow links generator, create disavow file, disavow txt generator, google search console disavow',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/tools/disavow-file-generator/',
  },
  openGraph: {
    title: 'Free Disavow File Generator - Google Search Console Format',
    description:
      'Paste toxic backlinks, auto-extract domains, remove duplicates, and download a Google-compliant disavow file.',
    url: 'https://seoshouts.com/tools/disavow-file-generator/',
    siteName: 'SEOShouts',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Free Disavow File Generator - Google Search Console Format',
    description:
      'Auto-extract domains, dedupe backlink exports, whitelist trusted domains, and download disavow.txt.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function DisavowFileGeneratorPage() {
  const softwareApplicationSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Disavow File Generator',
    url: 'https://seoshouts.com/tools/disavow-file-generator/',
    applicationCategory: 'WebApplication',
    operatingSystem: 'Any',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    description:
      'Free Google-compliant disavow file generator. Paste URLs or domains, auto-extract, remove duplicates, whitelist domains, and download in correct format for Google Search Console.',
    featureList: [
      'Domain-level disavow',
      'URL-level disavow',
      'Automatic deduplication',
      'Whitelist support',
      'Spreadsheet paste compatible',
      'Google Search Console format',
    ],
  }

  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqItems.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  }

  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to Build a Google Disavow File',
    description:
      'Step-by-step guide to building a Google-compliant disavow file from backlink exports using the SEOShouts Disavow File Generator.',
    totalTime: 'PT10M',
    tool: {
      '@type': 'HowToTool',
      name: 'SEOShouts Disavow File Generator',
    },
    step: howToSteps.map((text, index) => ({
      '@type': 'HowToStep',
      position: index + 1,
      name: `Step ${index + 1}`,
      text,
    })),
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareApplicationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      <DisavowFileGeneratorClient />
    </>
  )
}
