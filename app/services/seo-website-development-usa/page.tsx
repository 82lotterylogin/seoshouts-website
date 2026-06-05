import type { Metadata } from 'next'
import SeoWebDevUSAPageContent from './SeoWebDevUSAPageContent'

// Fetch latest blog posts from database
async function fetchLatestBlogPosts() {
  try {
    const { getDatabase } = await import('../../lib/database');
    const db = getDatabase();

    const articles = db.prepare(`
      SELECT
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        a.created_at,
        auth.name as author_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      WHERE a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 3
    `).all() as any[];

    return articles.map(article => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      featured_image: article.featured_image,
      published_at: article.published_at,
      created_at: article.created_at,
      author: {
        name: article.author_name
      }
    }));
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return [];
  }
}

export const metadata: Metadata = {
  title: 'SEO Website Development Services USA | SEO Shouts',
  description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services for American businesses.',
  metadataBase: new URL('https://seoshouts.com'),
  alternates: {
    canonical: 'https://seoshouts.com/services/seo-website-development-usa/',
  },
  openGraph: {
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States. Professional SEO website development services.',
    url: 'https://seoshouts.com/services/seo-website-development-usa/',
    siteName: 'SEO Shouts',
    images: [
      {
        url: 'https://seoshouts.com/seo-website-development-usa-og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'SEO Website Development Services USA by SEO Shouts',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SEO Website Development Services USA - Build Websites That Rank & Convert | SEO Shouts',
    description: 'Expert Developer-Led Team | Over 13 Years of SEO Expertise in the United States.',
    site: '@seo_shouts',
    creator: '@seo_shouts',
    images: ['https://seoshouts.com/seo-website-development-usa-twitter-image.jpg'],
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

export default async function SEOWebsiteDevelopmentServicePage() {
  // Fetch latest blog posts from database
  const blogPosts = await fetchLatestBlogPosts();

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
                "name": "Services",
                "item": "https://seoshouts.com/services/"
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": "SEO Website Development USA",
                "item": "https://seoshouts.com/services/seo-website-development-usa/"
              }
            ]
          })
        }}
      />

      {/* Service Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Service",
            "name": "SEO Website Development Services United States",
            "description": "Professional SEO website development services including mobile-first design, performance optimization, eCommerce development, and conversion-focused builds for American businesses.",
            "provider": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com/"
            },
            "serviceType": "SEO Website Development Services",
            "areaServed": {
              "@type": "Country",
              "name": "United States"
            },
            "hasOfferCatalog": {
              "@type": "OfferCatalog",
              "name": "SEO Website Development Services",
              "itemListElement": [
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "SEO-Optimized Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "eCommerce Website Development"
                  }
                },
                {
                  "@type": "Offer",
                  "itemOffered": {
                    "@type": "Service",
                    "name": "Mobile-First Responsive Design"
                  }
                }
              ]
            }
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
            "mainEntity": [
              {
                "@type": "Question",
                "name": "What makes SEO website development different from regular web design?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Regular web design focuses on visuals; SEO website development focuses on visibility. We build every site structure, URL, and content block for speed, indexing, and conversions — ensuring design and SEO work hand in hand."
                }
              },
              {
                "@type": "Question",
                "name": "Why is SEO-first development important for my business?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Without SEO foundations, your site might look great but remain invisible in search. SEO-first development ensures that your investment starts driving organic traffic and qualified leads from day one."
                }
              },
              {
                "@type": "Question",
                "name": "Do you offer SEO-friendly development for WordPress, Shopify, or custom builds?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We work with WordPress, Shopify, and custom PHP/Next.js frameworks — all optimized for performance, Core Web Vitals, and structured data. You get both flexibility and ranking power."
                }
              },
              {
                "@type": "Question",
                "name": "How is SEO website development different from regular website development?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "SEO website development ensures that SEO is integrated directly into the website's structure, content, and design from the very beginning. Unlike regular websites, which may need SEO optimization later, an SEO-developed website is built to rank from day one, with optimized URL structures, mobile-first design, fast load times, and SEO-friendly coding practices tailored for American businesses."
                }
              },
              {
                "@type": "Question",
                "name": "Will you help optimize my website for mobile users?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! All our websites are designed with mobile-first in mind. With a majority of internet traffic coming from mobile devices, we ensure that your US-focused website is responsive, loads quickly, and provides an optimal experience across all screen sizes and devices."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure that my website ranks well on Google?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our SEO website development process includes optimizing your site for critical SEO factors like page speed, core web vitals, structured data (schema markup), and internal linking. We also ensure your content is optimized for both user intent and Google's algorithms to help you rank higher for relevant search queries in American markets."
                }
              },
              {
                "@type": "Question",
                "name": "Will the website be optimized for local SEO and location-based searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We focus on local SEO optimization, which is crucial for American businesses targeting customers in specific geographic locations. From integrating location-based keywords to optimizing your Google My Business profile and creating location-specific landing pages, we ensure that your website ranks well for relevant local searches in the United States."
                }
              },
              {
                "@type": "Question",
                "name": "How do you optimize websites for Core Web Vitals and speed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We build lightweight pages, compress media, preload critical CSS, and use clean code. Our goal: a Lighthouse score of 90+ and <2.5s LCP — even on 4G networks in the United States."
                }
              },
              {
                "@type": "Question",
                "name": "Do you implement schema markup and structured data?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes. We add JSON-LD schema for services, FAQs, breadcrumbs, and local business. This improves click-through rates and visibility in Google's rich results."
                }
              },
              {
                "@type": "Question",
                "name": "Can you migrate my existing site without losing SEO rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Definitely. We audit your old URLs, set up 301 redirects, preserve meta data, and ensure seamless indexing — so you keep your traffic while upgrading to a faster, cleaner site."
                }
              },
              {
                "@type": "Question",
                "name": "Do you build mobile-first websites?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Every site we create is fully responsive and optimized for mobile speed. With over 80% of American traffic on smartphones, this is a must for SEO success."
                }
              },
              {
                "@type": "Question",
                "name": "Do you also handle the technical aspects of SEO for my website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, technical SEO is a crucial part of the SEO website development process. We focus on optimizing the back-end structure of your website, ensuring that it's crawlable, fast-loading, secure (with HTTPS), and follows best practices for technical SEO. This includes creating an XML sitemap, optimizing robots.txt, and setting up structured data to help search engines understand your website better."
                }
              },
              {
                "@type": "Question",
                "name": "How do you ensure that my website is fast and optimized for performance?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Website speed is crucial for SEO and user experience. We use a combination of image compression, code minification, caching strategies, and CDN integration to ensure your website loads quickly. Additionally, we optimize your website for Core Web Vitals, which is an important ranking factor for Google."
                }
              },
              {
                "@type": "Question",
                "name": "What's included in each SEO website package and what's extra?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Each plan covers full design, development, and on-page SEO. Higher tiers include backend integration, eCommerce setup, and extended support. Extra costs apply only for add-ons like custom plugins, premium themes, or content writing."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to complete an SEO-optimized website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Typically 4–6 weeks, depending on features and content volume. You'll receive a detailed timeline after the audit."
                }
              },
              {
                "@type": "Question",
                "name": "How long does it take to develop an SEO-optimized website?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "The development timeline depends on the complexity of your website, but typically, it takes about 4-6 weeks for a fully SEO-optimized website to be completed. This includes stages like research, design, development, content optimization, and testing. We'll keep you updated throughout the process to ensure the website aligns with your American business goals."
                }
              },
              {
                "@type": "Question",
                "name": "What kind of support do you offer after launch?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Every project includes post-launch support — 30 days for static, 60 for dynamic, and 90 for eCommerce sites. You'll get technical assistance, minor edits, and SEO health checks."
                }
              },
              {
                "@type": "Question",
                "name": "Will you provide support after my website is developed?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes! We provide post-launch support to ensure your American business website continues to perform well. This includes monitoring SEO performance, troubleshooting any issues, and offering guidance on how to update or add new content to maintain your rankings."
                }
              },
              {
                "@type": "Question",
                "name": "What payment options are available?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We accept all major credit cards (Visa, MasterCard, American Express), PayPal, Stripe, and wire transfers for US-based clients."
                }
              },
              {
                "@type": "Question",
                "name": "Will you help with SEO content and keyword research?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes — we can handle everything from keyword strategy to SEO-optimized copywriting. Every page is crafted around real search intent and semantic keywords to boost visibility."
                }
              },
              {
                "@type": "Question",
                "name": "How can I track my website's performance after it goes live?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "You'll receive Google Analytics and Search Console setup along with monthly reports highlighting impressions, clicks, rankings, and Core Web Vitals metrics."
                }
              },
              {
                "@type": "Question",
                "name": "Do you design websites optimized for local SEO and 'near me' searches?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We integrate Google Business Profile, NAP data, and local schema to help you rank for city- and region-specific searches."
                }
              },
              {
                "@type": "Question",
                "name": "Do you provide content for the website, or should I supply it?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "We can assist with SEO-optimized content creation, including writing compelling copy with targeted keywords, meta descriptions, and headlines for American audiences. However, if you already have content, we can work with your existing material to optimize it for both SEO and user engagement."
                }
              },
              {
                "@type": "Question",
                "name": "Will my website be built with future SEO updates in mind?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Absolutely. We build websites with scalability and future-proofing in mind, ensuring they remain optimized even as SEO trends and Google algorithms evolve. Whether it's adopting new SEO techniques or preparing for major algorithm changes, your American business website will be ready for the future."
                }
              }
            ]
          })
        }}
      />

      <SeoWebDevUSAPageContent blogPosts={blogPosts} />
    </>
  );
}
