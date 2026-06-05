'use client'
import { useState } from 'react'

const staticFeatures = [
  "Up to 5 custom-designed pages with <strong>proven SEO architecture</strong>",
  "Google Core Web Vitals optimisation (tested across American devices and networks)",
  "<strong>SEO-friendly web development</strong> using strategies refined over years",
  "Mobile-first responsive design optimised for US smartphone usage patterns",
  "Secure HTTPS/SSL implementation with American hosting considerations",
  "Schema markup for better Google US snippet visibility",
  "Google Search Console setup with US market focus",
  "Image and code optimisation for optimal performance across all devices",
  "30 days post-launch support with <strong>expert SEO guidance</strong>"
]

const backendFeatures = [
  "Custom content management system designed with <strong>SEO best practices</strong>",
  "Blog/news section optimised for US local searches and \"near me\" queries",
  "Advanced internal linking architecture based on <strong>long-term link equity strategies</strong>",
  "User access management for US teams with SEO workflow integration",
  "Advanced security, anti-spam features, and US privacy compliance",
  "Built-in analytics dashboard showing <strong>SEO metrics that matter</strong> from long-term client reporting",
  "60 days extended support with <strong>ongoing SEO guidance</strong>"
]

const ecommerceFeatures = [
  "All features from previous packages with <strong>enterprise-grade SEO implementation</strong>",
  "Custom-built online store with <strong>conversion optimisation strategies</strong> proven over the years",
  "Product catalogue with SEO-optimised descriptions targeting American buyer behaviour",
  "Secure cart and checkout with US payment gateways (Stripe, PayPal, major credit cards)",
  "<strong>Advanced product schema</strong> for Google Shopping visibility (techniques refined over years of eCommerce SEO)",
  "Inventory management optimised for US seasonal shopping patterns (Black Friday, Cyber Monday, holidays)",
  "90 days premium support including <strong>ongoing SEO optimisation</strong> and performance reviews"
]

interface PackageCardProps {
  title: string
  badge: string
  price: string
  description: string
  features: string[]
  isHighlight?: boolean
}

function PackageCard({ title, badge, price, description, features, isHighlight = false }: PackageCardProps) {
  const [showAll, setShowAll] = useState(false)
  const visibleFeatures = showAll ? features : features.slice(0, 3)
  const hasMore = features.length > 3

  return (
    <div className={`wd-price-card${isHighlight ? ' wd-price-highlight' : ''}`}>
        {isHighlight && <div className="wd-price-popular">Most Popular</div>}
        <div className="wd-price-badge">{badge}</div>
        <div className="wd-price-title">{title}</div>
        <p className="wd-price-desc"><strong>Perfect for:</strong> {description}</p>
        <div className="wd-price-amount-row">
          <span className="wd-price-amount">{price}</span>
          <span className="wd-price-period">/one-time</span>
        </div>
        <div className="wd-price-list-label">What extensive SEO experience delivers:</div>
        <ul className="wd-price-list">
          {visibleFeatures.map((feature, index) => (
            <li key={index}><span dangerouslySetInnerHTML={{ __html: feature }} /></li>
          ))}
        </ul>
        {hasMore && (
          <button
            onClick={() => setShowAll(!showAll)}
            className="wd-price-toggle"
          >
            {showAll ? '− Show Less' : `+ Show ${features.length - 3} More Features`}
          </button>
        )}
        <a href="/contact/" className="wd-price-btn">Get Started</a>
      </div>
  )
}

export default function PricingPackagesUSA() {
  return (
    <>
      <style>{`
        .wd-price-grid { display: grid; grid-template-columns: repeat(3,1fr); border: 1px solid var(--line); margin-top: 2.5rem; }
        .wd-price-card { padding: 2.5rem 2.25rem 2rem; border-right: 1px solid var(--line); background: #fff; display: flex; flex-direction: column; position: relative; }
        .wd-price-card:last-child { border-right: none; }
        .wd-price-card.wd-price-highlight { background: var(--ink); border-right-color: rgba(255,255,255,0.08); }
        .wd-price-badge { display: inline-flex; align-items: center; font-size: 0.68rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--blue); margin-bottom: 1.25rem; }
        .wd-price-card.wd-price-highlight .wd-price-badge { color: var(--blue-light); }
        .wd-price-popular { position: absolute; top: -1px; left: 50%; transform: translateX(-50%); background: var(--blue); color: #fff; font-size: 0.65rem; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase; padding: 4px 14px; }
        .wd-price-title { font-size: 1.1rem; font-weight: 700; color: var(--ink); margin-bottom: 0.5rem; line-height: 1.3; }
        .wd-price-card.wd-price-highlight .wd-price-title { color: #fff; }
        .wd-price-desc { font-size: 0.8rem; color: var(--gray-5); line-height: 1.6; margin-bottom: 1.5rem; }
        .wd-price-card.wd-price-highlight .wd-price-desc { color: rgba(255,255,255,0.52); }
        .wd-price-amount-row { display: flex; align-items: baseline; gap: 4px; margin-bottom: 1.5rem; padding-bottom: 1.5rem; border-bottom: 1px solid var(--line); }
        .wd-price-card.wd-price-highlight .wd-price-amount-row { border-bottom-color: rgba(255,255,255,0.08); }
        .wd-price-amount { font-family: 'Space Grotesk', sans-serif; font-size: 2.75rem; font-weight: 800; color: var(--ink); line-height: 1; letter-spacing: -0.04em; }
        .wd-price-card.wd-price-highlight .wd-price-amount { color: #fff; }
        .wd-price-period { font-size: 0.78rem; color: var(--gray-5); font-weight: 500; }
        .wd-price-card.wd-price-highlight .wd-price-period { color: rgba(255,255,255,0.42); }
        .wd-price-list-label { font-size: 0.7rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--gray-5); margin-bottom: 0.875rem; }
        .wd-price-card.wd-price-highlight .wd-price-list-label { color: rgba(255,255,255,0.38); }
        .wd-price-list { list-style: none; margin: 0 0 1rem; padding: 0; display: flex; flex-direction: column; gap: 0.625rem; flex: 1; }
        .wd-price-list li { font-size: 0.825rem; color: var(--ink-2); line-height: 1.55; display: flex; align-items: flex-start; gap: 8px; }
        .wd-price-card.wd-price-highlight .wd-price-list li { color: rgba(255,255,255,0.62); }
        .wd-price-list li::before { content: '→'; color: var(--blue); font-weight: 700; flex-shrink: 0; line-height: 1.55; }
        .wd-price-list li strong { font-weight: 600; color: var(--ink); }
        .wd-price-card.wd-price-highlight .wd-price-list li strong { color: rgba(255,255,255,0.88); }
        .wd-price-toggle { width: 100%; padding: 10px; font-size: 0.78rem; font-weight: 700; letter-spacing: 0.06em; text-transform: uppercase; border: 1px solid var(--line); background: transparent; color: var(--blue); cursor: pointer; margin-bottom: 1rem; transition: background 0.18s; }
        .wd-price-toggle:hover { background: var(--gray-1); }
        .wd-price-card.wd-price-highlight .wd-price-toggle { border-color: rgba(255,255,255,0.12); color: rgba(255,255,255,0.62); }
        .wd-price-card.wd-price-highlight .wd-price-toggle:hover { background: rgba(255,255,255,0.05); }
        .wd-price-btn { display: block; width: 100%; text-align: center; padding: 13px 20px; font-size: 0.9rem; font-weight: 700; text-decoration: none; transition: background 0.2s, color 0.2s; margin-top: auto; background: var(--ink); color: #fff; border: 1px solid var(--ink); }
        .wd-price-btn:hover { background: #1a2030; }
        .wd-price-card.wd-price-highlight .wd-price-btn { background: #fff; color: var(--ink); border-color: #fff; }
        .wd-price-card.wd-price-highlight .wd-price-btn:hover { background: var(--gray-1); }
        @media (max-width: 900px) {
          .wd-price-grid { grid-template-columns: 1fr; }
          .wd-price-card { border-right: none; border-bottom: 1px solid var(--line); }
          .wd-price-card.wd-price-highlight { border-bottom-color: rgba(255,255,255,0.08); }
          .wd-price-card:last-child { border-bottom: none; }
        }
      `}</style>
      <div className="wd-price-grid">
      <PackageCard
        title="SEO Optimised Static Website"
        badge="Starter"
        price="$100"
        description="Startups, solo entrepreneurs, consultants, and small business owners needing a results-driven web presence."
        features={staticFeatures}
      />
      <PackageCard
        title="SEO Optimised Website with Backend"
        badge="Professional"
        price="$250"
        description="Growing companies, service providers, and professionals who need content management capabilities with enterprise-level SEO."
        features={backendFeatures}
        isHighlight={true}
      />
      <PackageCard
        title="SEO Optimised eCommerce Website"
        badge="Enterprise"
        price="$500"
        description="American eCommerce brands, D2C companies, retail stores, and online sellers ready to dominate online sales."
        features={ecommerceFeatures}
      />
    </div>
    </>
  )
}
