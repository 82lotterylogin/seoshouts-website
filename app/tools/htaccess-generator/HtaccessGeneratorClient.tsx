'use client'

import type { ReactNode } from 'react'
import { useEffect, useMemo, useState } from 'react'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

type ToolTab = 'redirects' | 'security' | 'gzip' | 'caching' | 'error-pages' | 'php'
type RedirectType = '301' | '302' | '307' | '308'
type PresetKey = 'none' | 'wordpress' | 'shopify' | 'laravel' | 'joomla'

interface RedirectRule {
  from: string
  to: string
  type: RedirectType
}

interface SecuritySettings {
  disableDirectoryListing: boolean
  blockXssAttacks: boolean
  preventHotlinking: boolean
  blockBadBots: boolean
  forceHttps: boolean
  hstsEnabled: boolean
  clickjackingProtection: boolean
  contentTypeSniffing: boolean
  referrerPolicy: boolean
}

interface GzipSettings {
  enabled: boolean
  compressHtml: boolean
  compressCss: boolean
  compressJs: boolean
  compressXml: boolean
  compressFonts: boolean
  compressImages: boolean
}

interface CachingSettings {
  enabled: boolean
  htmlExpiry: string
  cssJsExpiry: string
  imagesExpiry: string
  fontsExpiry: string
  customExpiry: string
}

interface ErrorPageSettings {
  enabled: boolean
  error400: string
  error401: string
  error403: string
  error404: string
  error500: string
}

interface PhpSettings {
  enabled: boolean
  uploadMaxSize: string
  postMaxSize: string
  memoryLimit: string
  maxExecutionTime: string
  displayErrors: boolean
  outputBuffering: boolean
}

const CACHE_EXPIRY_OPTIONS = ['1 hour', '12 hours', '1 day', '1 week', '2 weeks', '1 month', '3 months', '6 months', '1 year']

const REDIRECT_TYPE_OPTIONS: Array<{ value: RedirectType; label: string }> = [
  { value: '301', label: '301 - Permanent' },
  { value: '302', label: '302 - Temporary' },
  { value: '307', label: '307 - Temporary (Preserve Method)' },
  { value: '308', label: '308 - Permanent (Preserve Method)' },
]

const DEFAULT_SECURITY: SecuritySettings = {
  disableDirectoryListing: true,
  blockXssAttacks: true,
  preventHotlinking: false,
  blockBadBots: false,
  forceHttps: false,
  hstsEnabled: false,
  clickjackingProtection: true,
  contentTypeSniffing: true,
  referrerPolicy: false,
}

const DEFAULT_GZIP: GzipSettings = {
  enabled: false,
  compressHtml: true,
  compressCss: true,
  compressJs: true,
  compressXml: true,
  compressFonts: true,
  compressImages: false,
}

const DEFAULT_CACHING: CachingSettings = {
  enabled: false,
  htmlExpiry: '1 hour',
  cssJsExpiry: '1 week',
  imagesExpiry: '1 month',
  fontsExpiry: '1 year',
  customExpiry: '',
}

const DEFAULT_ERROR_PAGES: ErrorPageSettings = {
  enabled: false,
  error400: '',
  error401: '',
  error403: '/403.html',
  error404: '/404.html',
  error500: '/500.html',
}

const DEFAULT_PHP: PhpSettings = {
  enabled: false,
  uploadMaxSize: '64M',
  postMaxSize: '64M',
  memoryLimit: '256M',
  maxExecutionTime: '300',
  displayErrors: false,
  outputBuffering: true,
}

const TAB_ITEMS: Array<{ key: ToolTab; label: string }> = [
  { key: 'redirects', label: 'Redirects' },
  { key: 'security', label: 'Security' },
  { key: 'gzip', label: 'GZIP' },
  { key: 'caching', label: 'Caching' },
  { key: 'error-pages', label: 'Error Pages' },
  { key: 'php', label: 'PHP' },
]

const PRESET_APPEND_RULES: Record<PresetKey, string> = {
  none: '',
  wordpress: `# WordPress Rewrite Rules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule ^index\\.php$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.php [L]
</IfModule>`,
  shopify: `# Shopify Proxy Rules (adjust subdirectory as needed)
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteCond %{HTTP_HOST} ^yourdomain\\.com$ [NC]
RewriteRule ^shop/(.*)$ https://yourstore.myshopify.com/$1 [P,L]
</IfModule>`,
  laravel: `# Laravel Public Directory Rewrite
<IfModule mod_rewrite.c>
<IfModule mod_negotiation.c>
    Options -MultiViews -Indexes
</IfModule>
RewriteEngine On
RewriteCond %{HTTP:Authorization} .
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteCond %{REQUEST_FILENAME} !-d
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.php [L]
</IfModule>`,
  joomla: `# Joomla Rewrite Rules
<IfModule mod_rewrite.c>
RewriteEngine On
RewriteBase /
RewriteRule .* - [E=HTTP_AUTHORIZATION:%{HTTP:Authorization}]
RewriteCond %{REQUEST_URI} !^/index\\.php
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule .* index.php [L]
</IfModule>`,
}

function ToggleSwitch({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (value: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl border border-gray-200 bg-white p-4">
      <div>
        <div className="font-medium text-gray-900">{label}</div>
        {description ? <p className="mt-1 text-sm text-gray-600">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-6 w-11 items-center rounded-full ${checked ? 'bg-primary' : 'bg-gray-300'}`}
      >
        <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-1'}`} />
      </button>
    </div>
  )
}

function FieldLabel({ children }: { children: ReactNode }) {
  return <label className="block text-sm font-semibold text-gray-700 mb-2">{children}</label>
}

function LongFormContent() {
  const faq = [
    ['What is an .htaccess file?', 'An .htaccess file is a directory-level configuration file for Apache web servers. It controls redirects, security, compression, and caching without editing the main server config.'],
    ['Is .htaccess supported on my hosting?', 'Most shared hosts support .htaccess. Nginx servers do not use .htaccess, and some VPS/dedicated setups disable it if AllowOverride is None.'],
    ['Can a wrong .htaccess file break my website?', 'Yes. A syntax error can trigger a 500 error across the site. Always back up the existing file before replacing it.'],
    ['What is the difference between 301 and 302 redirects?', '301 is for permanent moves and is the correct default for migrations and URL changes. 302 is for temporary moves.'],
    ['Does GZIP compression work with all browsers?', 'Yes. Modern browsers support GZIP and automatically decompress responses.'],
    ['How do I add .htaccess to a WordPress site?', 'Upload it to the WordPress root directory (the folder with wp-config.php). Back up the existing file before replacing or merging rules.'],
    ['What is the difference between .htaccess and robots.txt?', '.htaccess controls server behavior; robots.txt controls crawler access directives.'],
    ['Can I use .htaccess if I am on Cloudflare?', 'Yes, but some rules may be redundant or conflict with Cloudflare-level HTTPS, caching, or compression settings.'],
  ] as const

  return (
    <>
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 sm:p-8">
              <div className="flex items-start space-x-4">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-2xl font-bold">RS</span>
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-3">
                    Built by Rohit Sharma - Technical SEO & Apache Configuration Experience
                  </h3>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    "I&apos;ve fixed hundreds of Apache server misconfigurations for clients who did not know what an
                    .htaccess file was - let alone how to write one correctly. This tool generates safe,
                    production-tested rules so you do not have to guess."
                  </p>
                  <p className="text-gray-800 font-medium">
                    - Rohit Sharma, Founder of SEOShouts |{' '}
                    <a href="/meet-the-experts/" className="text-primary hover:underline">
                      Meet Our Experts
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                What Is an .htaccess File and Why Does It Matter for SEO?
              </span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed">
              <p>
                An .htaccess file is a directory-level Apache configuration file that lets you control redirects,
                security headers, compression, and caching from your site root. Apache reads it before serving matching
                requests.
              </p>
              <p>
                For SEO, this file controls some of the most important technical behaviors: URL migrations, HTTP to
                HTTPS redirects, redirect-chain cleanup, compression, and browser caching. Getting these wrong can hurt
                crawling, indexing, and page speed.
              </p>
              <p>
                The challenge is syntax. Apache rules are unforgiving, and one typo can produce a site-wide 500 error.
                This generator outputs structured, commented rules so you can review and upload with less risk.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Key Features of Our .htaccess Generator
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                ['🔁', 'Complete Redirect Builder', 'Create 301, 302, 307, and 308 redirects with multiple rows and clean Apache output.'],
                ['🛡️', 'Security Headers Suite', 'Toggle XSS protection, clickjacking protection, content-type sniffing protection, HSTS, and more.'],
                ['⚡', 'GZIP Compression', 'Enable compression for HTML, CSS, JS, XML, and fonts to reduce transfer size.'],
                ['🗂️', 'Browser Caching Rules', 'Set cache expiries for HTML, CSS/JS, images, and fonts with practical presets.'],
                ['🧩', 'CMS Presets', 'WordPress, Shopify, Laravel, and Joomla presets prefill common settings and rewrite blocks.'],
                ['🧰', 'Error Pages + PHP Settings', 'Add ErrorDocument routes and optional php_value/php_flag overrides when hosting allows them.'],
              ].map(([icon, title, desc]) => (
                <div key={title} className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm text-left">
                  <div className="flex items-center mb-3">
                    <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-white text-xl" aria-hidden="true">{icon}</span>
                    </div>
                    <h3 className="font-bold text-gray-900">{title}</h3>
                  </div>
                  <p className="text-sm text-gray-700 leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                How to Create and Upload Your .htaccess File (Step-by-Step)
              </span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['🧩', '1', 'Select Your CMS Preset', 'Choose WordPress, Shopify, Laravel, Joomla, or no preset. This loads common rewrite and optimization defaults.'],
                ['🔁', '2', 'Configure Redirects', 'Add redirects for moved URLs. Use 301 for permanent changes, migrations, and HTTPS upgrades.'],
                ['🛡️', '3', 'Enable Security Headers', 'Turn on X-XSS-Protection, X-Frame-Options, X-Content-Type-Options, and other relevant headers.'],
                ['⚡', '4', 'Configure Performance Rules', 'Enable GZIP compression and browser caching to improve page speed and repeat-visit performance.'],
                ['📥', '5', 'Generate, Download, and Upload', 'Generate the file, review the commented output, download as `.htaccess`, upload to your server root, and test immediately.'],
              ].map(([icon, step, title, desc]) => (
                <div key={step} className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
                  <h3 className="text-lg font-bold mb-2 text-gray-800 flex items-center">
                    <span className="text-2xl mr-3" aria-hidden="true">{icon}</span>
                    {title}
                  </h3>
                  <p className="text-xs font-semibold uppercase tracking-wide text-primary mb-2">Step {step}</p>
                  <p className="text-gray-700 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto space-y-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                .htaccess Redirect Best Practices for SEO
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Always Use 301 for Permanent Moves</h3>
              <p className="text-gray-700 leading-relaxed">
                Use 301 redirects for permanent URL changes, rebrands, migrations, and HTTP to HTTPS upgrades. Reserve
                302 for temporary changes such as campaign pages or short-term maintenance flows.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Avoid Redirect Chains</h3>
              <p className="text-gray-700 leading-relaxed mb-4">
                Redirect chains (A -&gt; B -&gt; C) add latency and create crawling inefficiency. Redirect the original
                URL directly to the final destination whenever possible.
              </p>
              <p className="text-gray-700 leading-relaxed">
                Validate your live pages with the{' '}
                <a href="/tools/on-page-seo-analyzer/" className="text-primary hover:underline">
                  On-Page SEO Analyzer
                </a>{' '}
                after deploying new redirects.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Do Not Redirect Everything to the Homepage</h3>
              <p className="text-gray-700 leading-relaxed">
                Redirect deleted URLs to the most relevant replacement page. Homepage redirects are a poor substitute
                for page-level relevance and can behave like soft 404s.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="text-2xl font-bold mb-4 text-gray-800">Redirect Directive vs mod_rewrite</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm">{`Redirect 301 /old-page/ https://yourdomain.com/new-page/`}</pre>
                <pre className="bg-gray-900 text-green-400 rounded-xl p-4 overflow-x-auto text-sm">{`RewriteRule ^old-page/(.*)$ /new-page/$1 [R=301,L]`}</pre>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                GZIP Compression and Core Web Vitals
              </span>
            </h2>
            <div className="space-y-6 text-lg text-gray-700 leading-relaxed mb-8">
              <p>
                GZIP is one of the highest-ROI performance optimizations you can apply via .htaccess. It compresses
                text-based resources before they are sent to the browser.
              </p>
              <p>
                Combined with browser caching, it can significantly reduce transfer size and repeat-load overhead,
                supporting faster pages and stronger Core Web Vitals.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="px-6 py-4 text-left font-bold">Resource Type</th>
                      <th className="px-6 py-4 text-left font-bold">Average Size Reduction</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ['HTML', '70-80%'],
                      ['CSS', '60-75%'],
                      ['JavaScript', '60-75%'],
                      ['XML/SVG', '65-80%'],
                      ['Web Fonts', '30-50%'],
                      ['Images (JPEG/PNG)', '<5% (usually not recommended)'],
                    ].map(([a, b]) => (
                      <tr key={a}>
                        <td className="px-6 py-4 text-gray-700">{a}</td>
                        <td className="px-6 py-4 text-gray-700">{b}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-gray-800">
              Pair server configuration with crawler and indexing controls using our{' '}
              <a href="/tools/robots-txt-generator/" className="text-primary hover:underline">
                Robots.txt Generator
              </a>{' '}
              and{' '}
              <a href="/tools/xml-sitemap-generator/" className="text-primary hover:underline">
                XML Sitemap Generator
              </a>
              .
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                SEOShouts vs Other .htaccess Generators
              </span>
            </h2>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gradient-to-r from-primary to-blue-600 text-white">
                      <th className="px-4 py-4 text-left text-sm font-bold">Feature</th>
                      <th className="px-4 py-4 text-left text-sm font-bold">SEOShouts</th>
                      <th className="px-4 py-4 text-left text-sm font-bold">Others (typical)</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {[
                      ['CMS Presets', 'Yes (4 presets)', 'Often missing'],
                      ['Security Headers', 'Yes (6 toggles)', 'Basic or missing'],
                      ['GZIP + Caching', 'Yes (configurable)', 'Basic or missing'],
                      ['Custom Error Pages', 'Yes', 'Often missing'],
                      ['PHP Settings', 'Yes', 'Rarely included'],
                      ['Commented Output', 'Yes', 'Usually no'],
                    ].map(([a, b, c]) => (
                      <tr key={a}>
                        <td className="px-4 py-3 text-sm font-semibold text-gray-900">{a}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{b}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{c}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section className="py-16 bg-gradient-to-br from-white to-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-bold mb-8 text-center text-gray-900">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                .htaccess Checklist (2026)
              </span>
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed mb-8 text-center">
              Use this checklist after generating and uploading your file. Verify technical behavior before and after deployment.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[
                ['🔁', 'Redirects', ['All permanent changes use 301', 'HTTP to HTTPS redirect is in place', 'No redirect chains (A->B->C)', 'No homepage redirects for unrelated pages']],
                ['🛡️', 'Security', ['X-XSS-Protection enabled', 'X-Frame-Options SAMEORIGIN', 'X-Content-Type-Options nosniff', 'Directory listing disabled', 'HSTS only if fully HTTPS-ready']],
                ['⚡', 'Performance', ['GZIP enabled for HTML/CSS/JS/XML/fonts', 'Browser caching configured', 'Reasonable expiries for HTML/CSS/JS/images/fonts', 'Re-test PageSpeed/Core Web Vitals']],
                ['✅', 'After Upload', ['Root domain loads correctly', 'No www/non-www loops', 'HTTPS redirect works cleanly', 'Custom error pages display correctly']],
              ].map(([icon, title, items]) => (
                <div key={title as string} className="bg-gray-50 rounded-2xl shadow-sm border border-gray-200 p-6">
                  <h3 className="text-xl font-bold mb-4 text-gray-800 flex items-center">
                    <span className="text-2xl mr-3" aria-hidden="true">{icon as string}</span>
                    {title as string}
                  </h3>
                  <ul className="space-y-3">
                    {(items as string[]).map((item) => (
                      <li key={item} className="flex items-start">
                        <span className="mr-3 mt-0.5 text-primary">•</span>
                        <span className="text-sm text-gray-700">{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-3 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-center text-gray-600 mb-10">Everything you need to know about .htaccess files and Apache rules</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:grid-flow-row-dense">
              {faq.map(([q, a]) => (
                <details key={q} className="group bg-gradient-to-br from-gray-50 to-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-all self-start">
                  <summary className="cursor-pointer p-4 font-semibold text-gray-900 flex items-center justify-between">
                    <span className="text-base flex items-center"><span className="text-primary mr-2">▸</span>{q}</span>
                    <span className="text-primary text-xl group-open:rotate-90 transition-transform">+</span>
                  </summary>
                  <div className="px-4 pb-4 text-gray-700 text-sm leading-relaxed border-t border-gray-100 pt-3 mt-2">
                    {q === 'What is the difference between .htaccess and robots.txt?' ? (
                      <>
                        .htaccess controls server behavior while robots.txt controls crawler directives. Use our{' '}
                        <a href="/tools/robots-txt-generator/" className="text-primary hover:underline">Robots.txt Generator</a>{' '}
                        for crawler access rules.
                      </>
                    ) : a}
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-800">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Explore Our Other Free SEO Tools
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">⚙️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">.htaccess Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate Apache server rules for redirects, security headers, and access control.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔬</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">On-Page SEO Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Audit redirects, status codes, crawlability, and 150+ technical SEO factors after deploying .htaccess rules.</p>
                <a href="/tools/on-page-seo-analyzer/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Pair server-level Apache rules with crawler directives for a complete technical SEO setup.</p>
                <a href="/tools/robots-txt-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">XML Sitemap Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Rebuild your XML sitemap after migrations so redirected or removed URLs are handled correctly.</p>
                <a href="/tools/xml-sitemap-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🚫</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Disavow File Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate Google-compliant disavow files from any backlink export format with dedupe and whitelist.</p>
                <a href="/tools/disavow-file-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏗️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Combine server optimization with structured data to improve how search engines understand your pages.</p>
                <a href="/tools/schema-generator/" className="text-primary font-medium hover:underline">Try Tool →</a>
              </div>
            </div>

            <div className="text-center">
              <a
                href="/tools/"
                className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛠️</span>
                Browse All 17 Free SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free - No signup required - Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-br from-primary to-blue-600 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto text-center">
            <h2 className="text-3xl sm:text-4xl font-bold mb-6">
              <span className="bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                Stop Guessing Apache Syntax
              </span>
            </h2>
            <p className="text-lg mb-8 opacity-90 leading-relaxed">
              Generate a production-ready .htaccess file in under 2 minutes.
            </p>
            <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="inline-flex items-center bg-white text-primary px-8 py-4 rounded-xl font-bold text-lg hover:bg-gray-50 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:scale-105">
              Generate Your .htaccess File Now
            </button>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span aria-hidden="true">⚡</span>
                <span>Instant results - no account required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span aria-hidden="true">🧾</span>
                <span>Tested, commented Apache syntax</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span aria-hidden="true">📥</span>
                <span>Download as ready-to-upload .htaccess</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default function HtaccessGeneratorClient() {
  const [activeSection, setActiveSection] = useState<ToolTab>('redirects')
  const [selectedPreset, setSelectedPreset] = useState<PresetKey>('none')
  const [redirects, setRedirects] = useState<RedirectRule[]>([{ from: '', to: '', type: '301' }])
  const [security, setSecurity] = useState<SecuritySettings>(DEFAULT_SECURITY)
  const [gzip, setGzip] = useState<GzipSettings>(DEFAULT_GZIP)
  const [caching, setCaching] = useState<CachingSettings>(DEFAULT_CACHING)
  const [errorPages, setErrorPages] = useState<ErrorPageSettings>(DEFAULT_ERROR_PAGES)
  const [phpSettings, setPhpSettings] = useState<PhpSettings>(DEFAULT_PHP)
  const [generatedCode, setGeneratedCode] = useState('')
  const [copySuccess, setCopySuccess] = useState(false)

  const validRedirectCount = useMemo(
    () => redirects.filter((r) => r.from.trim() && r.to.trim()).length,
    [redirects]
  )

  const validateRedirect = (from: string, to: string) => {
    const errors: string[] = []
    if (from.trim() && !from.startsWith('/') && !from.startsWith('http')) {
      errors.push('From path should start with / or be a full URL')
    }
    if (to.trim() && !to.startsWith('/') && !to.startsWith('http')) {
      errors.push('To path should start with / or be a full URL')
    }
    if (from.trim() && to.trim() && from.trim() === to.trim()) {
      errors.push('From and To cannot be the same')
    }
    return errors
  }

  const resetToDefaults = () => {
    setRedirects([{ from: '', to: '', type: '301' }])
    setSecurity({ ...DEFAULT_SECURITY })
    setGzip({ ...DEFAULT_GZIP })
    setCaching({ ...DEFAULT_CACHING })
    setErrorPages({ ...DEFAULT_ERROR_PAGES })
    setPhpSettings({ ...DEFAULT_PHP })
  }

  const applyPreset = (preset: PresetKey) => {
    setSelectedPreset(preset)
    resetToDefaults()
    if (preset === 'wordpress') {
      setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
      setGzip((prev) => ({ ...prev, enabled: true }))
      setCaching((prev) => ({ ...prev, enabled: true }))
      setErrorPages((prev) => ({ ...prev, enabled: true, error404: '/404' }))
    }
    if (preset === 'shopify') setSecurity((prev) => ({ ...prev, forceHttps: true, hstsEnabled: true }))
    if (preset === 'laravel') {
      setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
      setGzip((prev) => ({ ...prev, enabled: true }))
    }
    if (preset === 'joomla') setSecurity((prev) => ({ ...prev, forceHttps: true, disableDirectoryListing: true }))
  }

  const addRedirect = () => setRedirects((prev) => [...prev, { from: '', to: '', type: '301' }])
  const removeRedirect = (index: number) => setRedirects((prev) => prev.filter((_, i) => i !== index))
  const updateRedirect = <K extends keyof RedirectRule>(index: number, field: K, value: RedirectRule[K]) => {
    setRedirects((prev) => prev.map((row, i) => (i === index ? { ...row, [field]: value } : row)))
  }

  const generateHtaccess = () => {
    const lines: string[] = []
    const push = (line: string) => lines.push(line)
    const blank = () => lines.push('')
    const comment = (t: string) => lines.push(`# ${t}`)
    const divider = () => lines.push('# ==================================================')

    push('# Generated by SEOShouts .htaccess Generator')
    push(`# Generated on: ${new Date().toISOString().split('T')[0]}`)
    push('# https://seoshouts.com/tools/htaccess-generator/')
    blank()

    if (security.forceHttps) {
      divider()
      comment('Force HTTPS')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTPS} off')
      push('  RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]')
      push('</IfModule>')
      blank()
    }

    if (security.hstsEnabled) {
      divider()
      comment('HSTS')
      push('<IfModule mod_headers.c>')
      push('  Header always set Strict-Transport-Security "max-age=31536000; includeSubDomains; preload"')
      push('</IfModule>')
      blank()
    }

    if (security.disableDirectoryListing) {
      divider()
      comment('Disable Directory Listing')
      push('Options -Indexes')
      blank()
    }

    const hasSecurityHeaders =
      security.blockXssAttacks || security.clickjackingProtection || security.contentTypeSniffing || security.referrerPolicy
    if (hasSecurityHeaders) {
      divider()
      comment('Security Headers')
      push('<IfModule mod_headers.c>')
      if (security.blockXssAttacks) push('  Header set X-XSS-Protection "1; mode=block"')
      if (security.clickjackingProtection) push('  Header always append X-Frame-Options SAMEORIGIN')
      if (security.contentTypeSniffing) push('  Header set X-Content-Type-Options "nosniff"')
      if (security.referrerPolicy) push('  Header set Referrer-Policy "strict-origin-when-cross-origin"')
      push('</IfModule>')
      blank()
    }

    if (security.blockBadBots) {
      divider()
      comment('Block Common Bad Bots')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTP_USER_AGENT} (AhrefsBot|MJ12bot|DotBot|SemrushBot|ia_archiver|Majestic) [NC]')
      push('  RewriteRule .* - [F,L]')
      push('</IfModule>')
      blank()
    }

    if (security.preventHotlinking) {
      divider()
      comment('Prevent Image Hotlinking')
      push('<IfModule mod_rewrite.c>')
      push('  RewriteEngine On')
      push('  RewriteCond %{HTTP_REFERER} !^$')
      push('  RewriteCond %{HTTP_REFERER} !^https?://(www\\.)?%{HTTP_HOST} [NC]')
      push('  RewriteRule \\.(jpg|jpeg|png|gif|webp|svg)$ - [NC,F,L]')
      push('</IfModule>')
      blank()
    }

    const validRedirects = redirects.filter((r) => r.from.trim() && r.to.trim())
    if (validRedirects.length) {
      divider()
      comment('Redirects')
      validRedirects.forEach((r) => {
        const from = r.from.startsWith('/') || r.from.startsWith('http') ? r.from.trim() : `/${r.from.trim()}`
        push(`Redirect ${r.type} ${from} ${r.to.trim()}`)
      })
      blank()
    }

    if (gzip.enabled) {
      divider()
      comment('Enable GZIP Compression')
      push('<IfModule mod_deflate.c>')
      if (gzip.compressHtml) push('  AddOutputFilterByType DEFLATE text/html text/plain')
      if (gzip.compressCss) push('  AddOutputFilterByType DEFLATE text/css')
      if (gzip.compressJs) push('  AddOutputFilterByType DEFLATE application/javascript application/x-javascript text/javascript')
      if (gzip.compressXml) push('  AddOutputFilterByType DEFLATE text/xml application/xml application/xhtml+xml')
      if (gzip.compressFonts) push('  AddOutputFilterByType DEFLATE font/truetype font/opentype application/x-font-ttf application/vnd.ms-fontobject image/svg+xml')
      if (gzip.compressImages) push('  AddOutputFilterByType DEFLATE image/x-icon')
      push('</IfModule>')
      blank()
    }

    if (caching.enabled) {
      divider()
      comment('Browser Caching')
      push('<IfModule mod_expires.c>')
      push('  ExpiresActive On')
      push(`  ExpiresByType text/html "access plus ${caching.htmlExpiry}"`)
      push(`  ExpiresByType text/css "access plus ${caching.cssJsExpiry}"`)
      push(`  ExpiresByType application/javascript "access plus ${caching.cssJsExpiry}"`)
      push(`  ExpiresByType image/jpeg "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/png "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/webp "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType image/gif "access plus ${caching.imagesExpiry}"`)
      push(`  ExpiresByType font/truetype "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType font/opentype "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType application/x-font-ttf "access plus ${caching.fontsExpiry}"`)
      push(`  ExpiresByType font/woff2 "access plus ${caching.fontsExpiry}"`)
      if (caching.customExpiry.trim()) {
        comment('Custom cache directives')
        caching.customExpiry.split('\n').map((l) => l.trim()).filter(Boolean).forEach((l) => push(`  ${l}`))
      }
      push('</IfModule>')
      blank()
    }

    if (errorPages.enabled) {
      divider()
      comment('Custom Error Pages')
      if (errorPages.error400) push(`ErrorDocument 400 ${errorPages.error400}`)
      if (errorPages.error401) push(`ErrorDocument 401 ${errorPages.error401}`)
      if (errorPages.error403) push(`ErrorDocument 403 ${errorPages.error403}`)
      if (errorPages.error404) push(`ErrorDocument 404 ${errorPages.error404}`)
      if (errorPages.error500) push(`ErrorDocument 500 ${errorPages.error500}`)
      blank()
    }

    if (phpSettings.enabled) {
      divider()
      comment('PHP Configuration')
      push(`php_value upload_max_filesize ${phpSettings.uploadMaxSize}`)
      push(`php_value post_max_size ${phpSettings.postMaxSize}`)
      push(`php_value memory_limit ${phpSettings.memoryLimit}`)
      push(`php_value max_execution_time ${phpSettings.maxExecutionTime}`)
      push(`php_flag display_errors ${phpSettings.displayErrors ? 'on' : 'off'}`)
      push(`php_flag output_buffering ${phpSettings.outputBuffering ? 'on' : 'off'}`)
      blank()
    }

    if (selectedPreset !== 'none' && PRESET_APPEND_RULES[selectedPreset]) {
      divider()
      comment(`CMS Preset: ${selectedPreset}`)
      push(PRESET_APPEND_RULES[selectedPreset])
      blank()
    }

    setGeneratedCode(lines.join('\n').trim() + '\n')
  }

  useEffect(() => {
    generateHtaccess()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedPreset, redirects, security, gzip, caching, errorPages, phpSettings])

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(generatedCode)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch {
      setCopySuccess(false)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([generatedCode], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = '.htaccess'
    a.click()
    URL.revokeObjectURL(url)
  }

  const renderTabContent = () => {
    if (activeSection === 'redirects') {
      return (
        <div className="space-y-4">
          <div className="rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
            Add 301/302/307/308 redirect rules. Use 301 for permanent SEO-safe URL changes.
          </div>
          {redirects.map((rule, index) => {
            const errors = validateRedirect(rule.from, rule.to)
            return (
              <div key={index} className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div>
                    <FieldLabel>Type</FieldLabel>
                    <select value={rule.type} onChange={(e) => updateRedirect(index, 'type', e.target.value as RedirectType)} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm">
                      {REDIRECT_TYPE_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                  </div>
                  <div>
                    <FieldLabel>From</FieldLabel>
                    <input value={rule.from} onChange={(e) => updateRedirect(index, 'from', e.target.value)} placeholder="/old-page/" className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <FieldLabel>To</FieldLabel>
                    <input value={rule.to} onChange={(e) => updateRedirect(index, 'to', e.target.value)} placeholder="/new-page/ or https://..." className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm" />
                  </div>
                  <div className="flex items-end">
                    <button type="button" onClick={() => removeRedirect(index)} disabled={redirects.length === 1} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm disabled:opacity-50">Remove</button>
                  </div>
                </div>
                {errors.length > 0 ? <ul className="mt-2 text-xs text-red-700 space-y-1">{errors.map((e, i) => <li key={i}>- {e}</li>)}</ul> : null}
              </div>
            )
          })}
          <div className="flex flex-col sm:flex-row gap-3">
            <button type="button" onClick={addRedirect} className="rounded-xl bg-primary text-white px-4 py-2 font-medium">Add Redirect Row</button>
            <div className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm text-gray-600">{validRedirectCount} valid redirect rule{validRedirectCount === 1 ? '' : 's'} ready</div>
          </div>
        </div>
      )
    }
    if (activeSection === 'security') {
      return (
        <div className="space-y-4">
          <ToggleSwitch label="Disable Directory Listing" checked={security.disableDirectoryListing} onChange={(v) => setSecurity((p) => ({ ...p, disableDirectoryListing: v }))} />
          <ToggleSwitch label="Block XSS Attacks" checked={security.blockXssAttacks} onChange={(v) => setSecurity((p) => ({ ...p, blockXssAttacks: v }))} />
          <ToggleSwitch label="Prevent Hotlinking" checked={security.preventHotlinking} onChange={(v) => setSecurity((p) => ({ ...p, preventHotlinking: v }))} />
          <ToggleSwitch label="Block Bad Bots" checked={security.blockBadBots} onChange={(v) => setSecurity((p) => ({ ...p, blockBadBots: v }))} />
          <ToggleSwitch label="Force HTTPS" checked={security.forceHttps} onChange={(v) => setSecurity((p) => ({ ...p, forceHttps: v }))} />
          <ToggleSwitch label="Enable HSTS" description="Only enable if all traffic and subdomains are HTTPS-ready." checked={security.hstsEnabled} onChange={(v) => setSecurity((p) => ({ ...p, hstsEnabled: v }))} />
          <ToggleSwitch label="Clickjacking Protection" checked={security.clickjackingProtection} onChange={(v) => setSecurity((p) => ({ ...p, clickjackingProtection: v }))} />
          <ToggleSwitch label="Content-Type Sniffing Protection" checked={security.contentTypeSniffing} onChange={(v) => setSecurity((p) => ({ ...p, contentTypeSniffing: v }))} />
          <ToggleSwitch label="Referrer Policy" checked={security.referrerPolicy} onChange={(v) => setSecurity((p) => ({ ...p, referrerPolicy: v }))} />
        </div>
      )
    }
    if (activeSection === 'gzip') {
      return (
        <div className="space-y-4">
          <ToggleSwitch label="Enable GZIP Compression" checked={gzip.enabled} onChange={(v) => setGzip((p) => ({ ...p, enabled: v }))} />
          <ToggleSwitch label="Compress HTML" checked={gzip.compressHtml} onChange={(v) => setGzip((p) => ({ ...p, compressHtml: v }))} />
          <ToggleSwitch label="Compress CSS" checked={gzip.compressCss} onChange={(v) => setGzip((p) => ({ ...p, compressCss: v }))} />
          <ToggleSwitch label="Compress JavaScript" checked={gzip.compressJs} onChange={(v) => setGzip((p) => ({ ...p, compressJs: v }))} />
          <ToggleSwitch label="Compress XML" checked={gzip.compressXml} onChange={(v) => setGzip((p) => ({ ...p, compressXml: v }))} />
          <ToggleSwitch label="Compress Fonts" checked={gzip.compressFonts} onChange={(v) => setGzip((p) => ({ ...p, compressFonts: v }))} />
          <ToggleSwitch label="Compress Images (usually not needed)" checked={gzip.compressImages} onChange={(v) => setGzip((p) => ({ ...p, compressImages: v }))} />
        </div>
      )
    }
    if (activeSection === 'caching') {
      return (
        <div className="space-y-4">
          <ToggleSwitch label="Enable Browser Caching" checked={caching.enabled} onChange={(v) => setCaching((p) => ({ ...p, enabled: v }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <FieldLabel>HTML Expiry</FieldLabel>
              <select value={caching.htmlExpiry} onChange={(e) => setCaching((p) => ({ ...p, htmlExpiry: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>CSS/JS Expiry</FieldLabel>
              <select value={caching.cssJsExpiry} onChange={(e) => setCaching((p) => ({ ...p, cssJsExpiry: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Images Expiry</FieldLabel>
              <select value={caching.imagesExpiry} onChange={(e) => setCaching((p) => ({ ...p, imagesExpiry: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
            <div>
              <FieldLabel>Fonts Expiry</FieldLabel>
              <select value={caching.fontsExpiry} onChange={(e) => setCaching((p) => ({ ...p, fontsExpiry: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                {CACHE_EXPIRY_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>
          <div>
            <FieldLabel>Custom Expires Directives (Optional)</FieldLabel>
            <textarea value={caching.customExpiry} onChange={(e) => setCaching((p) => ({ ...p, customExpiry: e.target.value }))} rows={4} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm font-mono" placeholder='ExpiresByType application/json "access plus 1 hour"' />
          </div>
        </div>
      )
    }
    if (activeSection === 'error-pages') {
      return (
        <div className="space-y-4">
          <ToggleSwitch label="Enable Custom Error Pages" checked={errorPages.enabled} onChange={(v) => setErrorPages((p) => ({ ...p, enabled: v }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {([
              ['error400', '400'],
              ['error401', '401'],
              ['error403', '403'],
              ['error404', '404'],
              ['error500', '500'],
            ] as Array<[keyof ErrorPageSettings, string]>).map(([field, label]) => (
              <div key={field}>
                <FieldLabel>{label} ErrorDocument</FieldLabel>
                <input value={errorPages[field]} onChange={(e) => setErrorPages((p) => ({ ...p, [field]: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm" />
              </div>
            ))}
          </div>
        </div>
      )
    }
    if (activeSection === 'php') {
      return (
        <div className="space-y-4">
          <ToggleSwitch label="Enable PHP Settings" description="Requires hosting support for php_value/php_flag in .htaccess." checked={phpSettings.enabled} onChange={(v) => setPhpSettings((p) => ({ ...p, enabled: v }))} />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div><FieldLabel>Upload Max Size</FieldLabel><input value={phpSettings.uploadMaxSize} onChange={(e) => setPhpSettings((p) => ({ ...p, uploadMaxSize: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm" /></div>
            <div><FieldLabel>Post Max Size</FieldLabel><input value={phpSettings.postMaxSize} onChange={(e) => setPhpSettings((p) => ({ ...p, postMaxSize: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm" /></div>
            <div><FieldLabel>Memory Limit</FieldLabel><input value={phpSettings.memoryLimit} onChange={(e) => setPhpSettings((p) => ({ ...p, memoryLimit: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm" /></div>
            <div><FieldLabel>Max Execution Time</FieldLabel><input value={phpSettings.maxExecutionTime} onChange={(e) => setPhpSettings((p) => ({ ...p, maxExecutionTime: e.target.value }))} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm" /></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <ToggleSwitch label="Display Errors" checked={phpSettings.displayErrors} onChange={(v) => setPhpSettings((p) => ({ ...p, displayErrors: v }))} />
            <ToggleSwitch label="Output Buffering" checked={phpSettings.outputBuffering} onChange={(v) => setPhpSettings((p) => ({ ...p, outputBuffering: v }))} />
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 text-center leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free .htaccess Generator: Redirects, Security Headers, GZIP & Caching Rules
              </span>
            </h1>
            <div className="max-w-4xl mx-auto mb-8">
              <p className="text-base sm:text-lg text-gray-700 leading-relaxed text-center bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
                An .htaccess generator creates Apache server configuration files that control redirects, security headers, GZIP compression, and browser caching rules for your website. SEOShouts&apos; free tool generates production-ready .htaccess code with WordPress, Shopify, Laravel, and Joomla presets - no server knowledge required.
              </p>
            </div>
            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-4 sm:p-6 lg:p-8">
              <div className="text-center mb-6">
                <h2 className="text-xl sm:text-2xl font-bold mb-2 text-gray-900">Configure Your .htaccess Rules Below</h2>
                <p className="text-sm sm:text-base text-gray-600">Download or copy your file - ready to upload to your server root</p>
              </div>
              <div className="mb-6 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                <FieldLabel>CMS Preset</FieldLabel>
                <select value={selectedPreset} onChange={(e) => applyPreset(e.target.value as PresetKey)} className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm">
                  <option value="none">No Preset</option>
                  <option value="wordpress">WordPress</option>
                  <option value="shopify">Shopify (Subdirectory Proxy)</option>
                  <option value="laravel">Laravel</option>
                  <option value="joomla">Joomla</option>
                </select>
              </div>
              <div className="border-b border-gray-200 mb-6">
                <nav className="flex overflow-x-auto scrollbar-hide">
                  {TAB_ITEMS.map((tab) => (
                    <button key={tab.key} type="button" onClick={() => setActiveSection(tab.key)} className={`px-4 py-3 text-sm font-medium whitespace-nowrap ${activeSection === tab.key ? 'text-white bg-primary rounded-t-xl' : 'text-gray-600 hover:text-primary hover:bg-gray-50 rounded-t-xl'}`}>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6 lg:gap-8">
                <div className="space-y-4">{renderTabContent()}</div>
                <div className="lg:sticky lg:top-24 h-fit">
                  <div className="rounded-2xl border border-gray-200 bg-white shadow-lg overflow-hidden">
                    <div className="border-b border-gray-200 bg-gray-50 px-4 py-3 flex items-center justify-between gap-3">
                      <div>
                        <h3 className="font-semibold text-gray-900">Generated .htaccess Output</h3>
                        <p className="text-xs text-gray-500">Commented Apache rules, ready to review and upload</p>
                      </div>
                      {copySuccess ? <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">Copied</span> : null}
                    </div>
                    <div className="p-4 space-y-4">
                      <textarea readOnly value={generatedCode} rows={22} className="w-full resize-none font-mono text-sm bg-gray-900 text-green-400 p-4 rounded-lg border border-gray-800" />
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <button type="button" onClick={generateHtaccess} className="sm:col-span-3 inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-xl hover:shadow-xl transition-all duration-300">Generate .htaccess File</button>
                        <button type="button" onClick={handleCopy} className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium">Copy</button>
                        <button type="button" onClick={handleDownload} className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium">Download</button>
                        <button type="button" onClick={() => applyPreset('none')} className="px-4 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 font-medium">Reset</button>
                      </div>
                      <div className="rounded-xl border border-yellow-200 bg-yellow-50 p-3 text-sm text-yellow-800">Test your site immediately after upload. A syntax error can trigger a site-wide 500 error.</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="mt-10 pt-8 border-t border-gray-200">
                <h3 className="text-lg font-semibold mb-6 text-gray-900 text-center">Key Features</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                  {[
                    ['🔁', '301/302/307/308 Redirect Rules', 'Set up any redirect type in seconds'],
                    ['🛡️', 'Security Headers', 'Block XSS, clickjacking, and content sniffing attacks'],
                    ['⚡', 'GZIP + Browser Caching', 'Improve Core Web Vitals with one click'],
                    ['🧩', 'CMS Presets', 'WordPress, Shopify, Laravel & Joomla rules pre-loaded'],
                  ].map(([, title, desc]) => (
                    <div key={title} className="flex items-start">
                      <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center mr-3 mt-0.5 flex-shrink-0" aria-hidden="true">
                        <span className="text-white text-xs">&#10003;</span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">{title}</div>
                        <div className="text-gray-600">{desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <ToolBreadcrumb toolName=".htaccess Generator" toolSlug="htaccess-generator" />
      <LongFormContent />
    </div>
  )
}
