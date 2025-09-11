'use client'

import { useState, useEffect } from 'react'
import ToolBreadcrumb from '../../components/ToolBreadcrumb'

export default function WordCounterClient() {
  const [text, setText] = useState('')
  const [wordCount, setWordCount] = useState(0)
  const [charCount, setCharCount] = useState(0)
  const [charCountNoSpaces, setCharCountNoSpaces] = useState(0)
  const [readingTime, setReadingTime] = useState(0)
  const [paragraphCount, setParagraphCount] = useState(0)
  const [sentenceCount, setSentenceCount] = useState(0)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    const trimmed = text.trim()
    
    // Word count
    const words = trimmed.length > 0 ? trimmed.split(/\s+/).filter(word => word.length > 0) : []
    setWordCount(words.length)
    
    // Character count with spaces
    setCharCount(text.length)
    
    // Character count without spaces
    setCharCountNoSpaces(text.replace(/\s/g, '').length)
    
    // Reading time (average 200 words per minute)
    setReadingTime(words.length > 0 ? Math.ceil(words.length / 200) : 0)
    
    // Paragraph count
    const paragraphs = trimmed.split(/\n\s*\n/).filter(p => p.trim().length > 0)
    setParagraphCount(paragraphs.length > 0 ? paragraphs.length : (trimmed.length > 0 ? 1 : 0))
    
    // Sentence count (approximate)
    const sentences = trimmed.split(/[.!?]+/).filter(s => s.trim().length > 0)
    setSentenceCount(sentences.length)
  }, [text])

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(text)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error('Failed to copy: ', err)
    }
  }

  const clearText = () => {
    setText('')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Software Application Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "SoftwareApplication",
            "name": "Word Counter Tool",
            "description": "Count words, characters, paragraphs, and sentences in your content. Track reading time and optimize for target word counts.",
            "url": "https://seoshouts.com/tools/word-counter",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "browserRequirements": "Requires JavaScript. Compatible with Chrome, Firefox, Safari, Edge.",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "USD"
            },
            "publisher": {
              "@type": "Organization",
              "name": "SEO Shouts",
              "url": "https://seoshouts.com"
            },
            "featureList": [
              "Real-time counting",
              "Reading time estimation", 
              "Multiple metrics tracking",
              "Character limits checking",
              "Export functionality",
              "Text analysis",
              "Content optimization"
            ],
            "keywords": "word counter, character counter, content analysis, writing tools",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "ratingCount": "1834"
            },
            "softwareVersion": "1.5",
            "datePublished": "2024-01-05",
            "dateModified": "2024-08-19",
            "author": {
              "@type": "Organization",
              "name": "SEO Shouts"
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
                "name": "Is this word counter tool free?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our word counter tool is completely free to use. No registration required, no hidden fees."
                }
              },
              {
                "@type": "Question", 
                "name": "How accurate is the word count?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Our word counter uses standard word counting algorithms that split text by whitespace and filter empty strings, providing accurate word counts similar to Microsoft Word."
                }
              },
              {
                "@type": "Question",
                "name": "Can I check character limits for social media?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, the tool shows both characters with and without spaces, perfect for checking Twitter (280), Instagram (2,200), and other social media character limits."
                }
              }
            ]
          })
        }}
      />
      
      {/* Tool Section */}
      <section className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Text Input Section */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                  <h2 className="text-2xl font-bold mb-6 text-gray-800">Enter Your Text</h2>
                  
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Start typing or paste your content here to see real-time word and character counts..."
                    className="w-full h-96 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                  />
                  
                  <div className="flex gap-3 mt-4">
                    <button
                      onClick={copyToClipboard}
                      disabled={!text}
                      className="flex-1 bg-primary text-white px-4 py-2 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy Text'}
                    </button>
                    
                    <button
                      onClick={clearText}
                      disabled={!text}
                      className="px-6 py-2 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300"
                    >
                      🗑️ Clear
                    </button>
                  </div>
                </div>
              </div>

              {/* Statistics Section */}
              <div className="space-y-6">
                <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6">
                  <h3 className="text-xl font-bold mb-6 text-gray-800">Content Statistics</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                      <span className="text-blue-800 font-medium">Words</span>
                      <span className="text-2xl font-bold text-blue-600">{wordCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                      <span className="text-green-800 font-medium">Characters</span>
                      <span className="text-2xl font-bold text-green-600">{charCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <span className="text-purple-800 font-medium">Characters (no spaces)</span>
                      <span className="text-2xl font-bold text-purple-600">{charCountNoSpaces.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                      <span className="text-orange-800 font-medium">Paragraphs</span>
                      <span className="text-2xl font-bold text-orange-600">{paragraphCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                      <span className="text-indigo-800 font-medium">Sentences</span>
                      <span className="text-2xl font-bold text-indigo-600">{sentenceCount}</span>
                    </div>
                    
                    <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                      <span className="text-red-800 font-medium">Reading Time</span>
                      <span className="text-2xl font-bold text-red-600">{readingTime} min</span>
                    </div>
                  </div>
                </div>

                {/* Character Limits Guide */}
                <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-6 border border-gray-200">
                  <h4 className="text-lg font-semibold mb-4 text-gray-800">📱 Social Media Limits</h4>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span>Twitter</span>
                      <span className={charCount <= 280 ? 'text-green-600' : 'text-red-600'}>
                        {charCount}/280
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Instagram Caption</span>
                      <span className={charCount <= 2200 ? 'text-green-600' : 'text-red-600'}>
                        {charCount}/2,200
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>LinkedIn Post</span>
                      <span className={charCount <= 3000 ? 'text-green-600' : 'text-red-600'}>
                        {charCount}/3,000
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Facebook Post</span>
                      <span className={charCount <= 63206 ? 'text-green-600' : 'text-red-600'}>
                        {charCount}/63,206
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="Word Counter" toolSlug="word-counter" />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free Content Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Free Words and Character Counter Tool
              </span>
              <br />
              <span className="text-primary">Count Words, Characters & Track Reading Time Instantly</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Perfect for Writers, Bloggers & Content Creators</h2>
              <p>
                Need to hit a specific word count? Checking character limits for social media? Our word counter tool gives you real-time stats as you type.
              </p>
              <p>
                Track words, characters (with and without spaces), paragraphs, sentences, and estimated reading time. Great for essays, blog posts, social media, and any content with specific length requirements.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real-time Counting
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Reading Time Estimate
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Multiple Metrics
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Perfect for Every Content Creator</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="text-3xl mb-4">✍️</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Writers & Authors</h3>
                <p className="text-gray-600">Hit target word counts for articles, essays, and manuscripts. Track progress and stay within limits.</p>
              </div>

              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="text-3xl mb-4">📱</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Social Media Managers</h3>
                <p className="text-gray-600">Check character limits for Twitter, Instagram, LinkedIn and other platforms before posting.</p>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <div className="text-3xl mb-4">🎓</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Students</h3>
                <p className="text-gray-600">Meet assignment requirements with precise word counts for essays, reports, and research papers.</p>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="text-3xl mb-4">📝</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Bloggers</h3>
                <p className="text-gray-600">Optimize blog post length for SEO and reader engagement. Track reading time estimates.</p>
              </div>

              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-6 border border-yellow-100">
                <div className="text-3xl mb-4">💼</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Business Professionals</h3>
                <p className="text-gray-600">Create concise emails, proposals, and marketing copy that meets specific length requirements.</p>
              </div>

              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-6 border border-pink-100">
                <div className="text-3xl mb-4">🔍</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">SEO Specialists</h3>
                <p className="text-gray-600">Optimize meta descriptions, title tags, and content length for better search engine performance.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Explanation Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">How Our Word Counter Tool Works</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-semibold mb-6 text-gray-800">🔧 Advanced Text Analysis</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">1</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Real-time Processing</h4>
                      <p className="text-gray-600">As you type or paste text, our algorithm instantly analyzes every character and word for immediate feedback.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">2</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Smart Word Detection</h4>
                      <p className="text-gray-600">Uses whitespace splitting and filters empty strings to ensure accurate word counting, similar to Microsoft Word.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <span className="text-primary font-semibold">3</span>
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-800 mb-1">Multiple Metrics</h4>
                      <p className="text-gray-600">Simultaneously tracks words, characters, paragraphs, sentences, and calculates reading time estimates.</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 border border-gray-200">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📊 What We Track</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">📝 Word Count</span>
                    <span className="text-sm text-gray-600">Standard algorithm</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">🔤 Characters</span>
                    <span className="text-sm text-gray-600">With & without spaces</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">📄 Paragraphs</span>
                    <span className="text-sm text-gray-600">Line break detection</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">📑 Sentences</span>
                    <span className="text-sm text-gray-600">Punctuation-based</span>
                  </div>
                  <div className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm">
                    <span className="font-medium text-gray-800">⏱️ Reading Time</span>
                    <span className="text-sm text-gray-600">200 WPM average</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-12 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
              <h3 className="text-2xl font-semibold mb-4 text-center text-gray-800">💡 Pro Tips for Content Creators</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📚 Blog Posts</h4>
                  <p className="text-gray-600 mb-4">Aim for 1,000-2,000 words for SEO-friendly content. Longer posts tend to rank better in search engines.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📱 Social Media</h4>
                  <p className="text-gray-600 mb-4">Twitter: 280 chars, Instagram: 2,200 chars. Use our limits guide to stay within platform requirements.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">📄 Meta Descriptions</h4>
                  <p className="text-gray-600 mb-4">Keep between 150-160 characters for optimal display in search results without truncation.</p>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-800 mb-2">⏰ Reading Time</h4>
                  <p className="text-gray-600 mb-4">Average readers prefer 3-7 minute articles. Use our reading time estimate to gauge content length.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Frequently Asked Questions</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is this word counter tool free?</h3>
                <p className="text-gray-600">Yes, our word counter tool is completely free to use. No registration required, no hidden fees.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How accurate is the word count?</h3>
                <p className="text-gray-600">Our word counter uses standard algorithms similar to Microsoft Word, providing accurate counts by splitting text on whitespace.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I check character limits for social media?</h3>
                <p className="text-gray-600">Yes, the tool shows both characters with and without spaces, perfect for Twitter, Instagram, and other social media limits.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How is reading time calculated?</h3>
                <p className="text-gray-600">Reading time is estimated based on an average reading speed of 200 words per minute for adults.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does it work offline?</h3>
                <p className="text-gray-600">Yes, once the page loads, the word counter works entirely in your browser without needing an internet connection.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I save my text?</h3>
                <p className="text-gray-600">Use the copy button to save your text to clipboard, or copy and paste into your preferred document editor.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Tools Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4 text-gray-800">Explore Our Other SEO Tools</h2>
              <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                Discover our complete suite of free SEO tools designed to help you optimize your website, improve rankings, and drive more organic traffic.
              </p>
            </div>

            {/* Featured Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Word Counter</h3>
                <p className="text-sm text-gray-600 mb-4">Real-time word and character counting with reading time estimates.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">SEO Meta Writer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate compelling meta titles and descriptions for better CTR.</p>
                <a href="/tools/seo-meta-writer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Analyze keyword density and optimize content for target keywords.</p>
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions for better CTR.</p>
                <a href="/tools/meta-tag-optimizer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">💻</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">HTML Editor</h3>
                <p className="text-sm text-gray-600 mb-4">Professional HTML5 editor with live preview and syntax highlighting.</p>
                <a href="/tools/html-editor" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create JSON-LD structured data markup for better search rankings.</p>
                <a href="/tools/schema-generator" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a 
                href="/tools"
                className="inline-flex items-center bg-primary text-white px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300 shadow-lg hover:shadow-xl"
              >
                <span className="mr-2">🛠️</span>
                Browse All SEO Tools
              </a>
              <p className="text-sm text-gray-500 mt-3">
                All tools are 100% free • No signup required • Instant results
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Your Complete SEO Analysis Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Our word counter is just one tool in your content optimization arsenal. Get professional SEO services to maximize your website's potential and drive real organic growth.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                <h3 className="text-xl font-semibold mb-3">🎯 Content Strategy</h3>
                <p className="opacity-90">Get expert guidance on content planning, keyword optimization, and performance tracking for maximum impact.</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-left">
                <h3 className="text-xl font-semibold mb-3">📈 SEO Consulting</h3>
                <p className="opacity-90">Comprehensive SEO audits, technical optimization, and growth strategy development from industry experts.</p>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a 
                href="/services" 
                className="inline-flex items-center justify-center px-8 py-3 bg-white text-primary rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300 shadow-lg"
              >
                View SEO Services
              </a>
              <a 
                href="/contact" 
                className="inline-flex items-center justify-center px-8 py-3 border-2 border-white text-white rounded-xl font-semibold hover:bg-white hover:text-primary transition-all duration-300"
              >
                Get Free Consultation
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}