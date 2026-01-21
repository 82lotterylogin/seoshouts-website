'use client'

interface Tool {
  name: string
  description: string
  url: string
  icon: string
}

interface RelatedToolsProps {
  currentTool: string
}

export default function RelatedTools({ currentTool }: RelatedToolsProps) {
  const allTools: Record<string, Tool[]> = {
    'internal-link-checker': [
      { name: 'On-Page SEO Analyzer', description: 'Analyze 100+ ranking factors with Core Web Vitals', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'Keyword Density Analyzer', description: 'Optimize keyword usage and density', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
      { name: 'Meta Tag Optimizer', description: 'Perfect your titles and meta descriptions', url: '/tools/meta-tag-optimizer/', icon: '📝' },
    ],
    'on-page-seo-analyzer': [
      { name: 'Internal Link Checker', description: 'Analyze anchor text with word cloud visualization', url: '/tools/internal-link-checker/', icon: '🔗' },
      { name: 'Schema Generator', description: 'Generate 39+ schema types for rich snippets', url: '/tools/schema-generator/', icon: '📋' },
      { name: 'Robots.txt Generator', description: 'Create SEO-friendly robots.txt files', url: '/tools/robots-txt-generator/', icon: '🤖' },
    ],
    'schema-generator': [
      { name: 'On-Page SEO Analyzer', description: 'Comprehensive on-page SEO analysis', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'XML Sitemap Generator', description: 'Generate XML sitemaps for search engines', url: '/tools/xml-sitemap-generator/', icon: '🗺️' },
      { name: 'Robots.txt Generator', description: 'Control search engine crawling', url: '/tools/robots-txt-generator/', icon: '🤖' },
    ],
    'keyword-density-analyzer': [
      { name: 'On-Page SEO Analyzer', description: 'Complete page optimization analysis', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'Meta Tag Optimizer', description: 'Optimize meta titles and descriptions', url: '/tools/meta-tag-optimizer/', icon: '📝' },
      { name: 'Word Counter', description: 'Count words and characters instantly', url: '/tools/word-counter/', icon: '📏' },
    ],
    'robots-txt-generator': [
      { name: 'XML Sitemap Generator', description: 'Create XML sitemaps for better indexing', url: '/tools/xml-sitemap-generator/', icon: '🗺️' },
      { name: 'On-Page SEO Analyzer', description: 'Check technical SEO health', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'Schema Generator', description: 'Add structured data markup', url: '/tools/schema-generator/', icon: '📋' },
    ],
    'xml-sitemap-generator': [
      { name: 'Robots.txt Generator', description: 'Control crawler access', url: '/tools/robots-txt-generator/', icon: '🤖' },
      { name: 'On-Page SEO Analyzer', description: 'Analyze technical SEO factors', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'Schema Generator', description: 'Enhance search results with structured data', url: '/tools/schema-generator/', icon: '📋' },
    ],
    'meta-tag-optimizer': [
      { name: 'Keyword Density Analyzer', description: 'Analyze keyword usage in content', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
      { name: 'On-Page SEO Analyzer', description: 'Complete SEO health check', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
      { name: 'Schema Generator', description: 'Add rich snippet markup', url: '/tools/schema-generator/', icon: '📋' },
    ],
    'keyword-difficulty-checker': [
      { name: 'Long Tail Keyword Generator', description: 'Find low-competition keywords', url: '/tools/long-tail-keyword-generator/', icon: '🎯' },
      { name: 'Keyword Density Analyzer', description: 'Optimize keyword usage', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
      { name: 'On-Page SEO Analyzer', description: 'Analyze page optimization', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
    ],
    'long-tail-keyword-generator': [
      { name: 'Keyword Difficulty Checker', description: 'Check keyword competition', url: '/tools/keyword-difficulty-checker/', icon: '📈' },
      { name: 'Keyword Density Analyzer', description: 'Analyze keyword frequency', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
      { name: 'Blog Ideas Generator', description: 'Generate content ideas from keywords', url: '/tools/blog-ideas-generator/', icon: '💡' },
    ],
    'word-counter': [
      { name: 'Keyword Density Analyzer', description: 'Check keyword usage and density', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
      { name: 'HTML Editor', description: 'Edit and format content', url: '/tools/html-editor/', icon: '✏️' },
      { name: 'AI Copywriter', description: 'Generate SEO-optimized content', url: '/tools/ai-copywriter/', icon: '🤖' },
    ],
    'html-editor': [
      { name: 'Word Counter', description: 'Count words in your content', url: '/tools/word-counter/', icon: '📏' },
      { name: 'Meta Tag Optimizer', description: 'Optimize HTML meta tags', url: '/tools/meta-tag-optimizer/', icon: '📝' },
      { name: 'On-Page SEO Analyzer', description: 'Analyze HTML structure', url: '/tools/on-page-seo-analyzer/', icon: '📊' },
    ],
    'ai-copywriter': [
      { name: 'Blog Ideas Generator', description: 'Generate content topics', url: '/tools/blog-ideas-generator/', icon: '💡' },
      { name: 'SEO Meta Writer', description: 'Create SEO-friendly meta tags', url: '/tools/seo-meta-writer/', icon: '✍️' },
      { name: 'Word Counter', description: 'Check content length', url: '/tools/word-counter/', icon: '📏' },
    ],
    'blog-ideas-generator': [
      { name: 'AI Copywriter', description: 'Write full blog posts', url: '/tools/ai-copywriter/', icon: '🤖' },
      { name: 'Long Tail Keyword Generator', description: 'Find keyword opportunities', url: '/tools/long-tail-keyword-generator/', icon: '🎯' },
      { name: 'Keyword Density Analyzer', description: 'Optimize content keywords', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
    ],
    'seo-meta-writer': [
      { name: 'Meta Tag Optimizer', description: 'Analyze and improve meta tags', url: '/tools/meta-tag-optimizer/', icon: '📝' },
      { name: 'AI Copywriter', description: 'Generate SEO content', url: '/tools/ai-copywriter/', icon: '🤖' },
      { name: 'Keyword Density Analyzer', description: 'Check keyword optimization', url: '/tools/keyword-density-analyzer/', icon: '🔍' },
    ],
  }

  const relatedTools = allTools[currentTool] || []

  if (relatedTools.length === 0) {
    return null
  }

  return (
    <section className="bg-gray-50 py-16">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4 text-gray-900">
              Related SEO Tools
            </h2>
            <p className="text-lg text-gray-600">
              Complete your SEO workflow with these complementary tools
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedTools.map((tool, index) => (
              <a
                key={index}
                href={tool.url}
                className="group bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-primary/30"
              >
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-300">
                    <span className="text-2xl">{tool.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-lg mb-2 text-gray-900 group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {tool.description}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-primary font-medium text-sm">
                  Try it now
                  <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
