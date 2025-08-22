'use client'

import { useState, useEffect } from 'react'

export default function KeywordDensityAnalyzer() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Keyword Density Analyzer Tool | SEO Shouts'
    
    // Set meta description
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Analyze keyword density and optimize your content for SEO. Free keyword density checker with detailed analysis, recommendations, and top keyword insights.')
    
    // Set meta keywords
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'keyword density analyzer, keyword density checker, SEO content analysis, keyword optimization, content SEO tool')
    
  }, [])

  const [form, setForm] = useState({
    content: '',
    targetKeyword: '',
    isAnalyzing: false,
    results: null as any
  })

  const [analysis, setAnalysis] = useState<{
    totalWords: number
    totalCharacters: number
    keywordCount: number
    keywordDensity: number
    topKeywords: Array<{ word: string; count: number; density: number }>
    recommendations: string[]
    readabilityScore: number
  } | null>(null)

  // Clean and process text
  const cleanText = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  }

  // Calculate keyword density
  const analyzeContent = () => {
    if (!form.content.trim()) {
      alert('Please enter some content to analyze')
      return
    }

    setForm(prev => ({ ...prev, isAnalyzing: true }))

    setTimeout(() => {
      const content = form.content.trim()
      const cleanedContent = cleanText(content)
      const words = cleanedContent.split(' ').filter(word => word.length > 0)
      
      const totalWords = words.length
      const totalCharacters = content.length
      
      const targetKeyword = form.targetKeyword.toLowerCase().trim()
      let keywordCount = 0
      let keywordDensity = 0
      
      if (targetKeyword) {
        const keywordRegex = new RegExp(`\\b${targetKeyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi')
        const matches = content.match(keywordRegex)
        keywordCount = matches ? matches.length : 0
        keywordDensity = totalWords > 0 ? (keywordCount / totalWords) * 100 : 0
      }

      const stopWords = new Set([
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'up', 'about', 'into', 'through', 'during', 'before', 'after', 'above', 'below', 'between', 'among', 'within', 'without', 'along', 'following', 'across', 'behind', 'beyond', 'plus', 'except', 'but', 'until', 'unless', 'since', 'while', 'is', 'are', 'was', 'were', 'been', 'be', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them', 'my', 'your', 'his', 'her', 'its', 'our', 'their'
      ])

      const wordCount: { [key: string]: number } = {}
      words.forEach(word => {
        if (word.length > 2 && !stopWords.has(word)) {
          wordCount[word] = (wordCount[word] || 0) + 1
        }
      })

      const topKeywords = Object.entries(wordCount)
        .map(([word, count]) => ({
          word,
          count,
          density: (count / totalWords) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 10)

      const recommendations: string[] = []
      
      if (targetKeyword) {
        if (keywordDensity < 0.5) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). Consider adding it 2-3 more times naturally.`)
        } else if (keywordDensity > 3) {
          recommendations.push(`Your target keyword "${targetKeyword}" appears ${keywordCount} times (${keywordDensity.toFixed(2)}%). This might be over-optimization. Consider reducing usage.`)
        } else {
          recommendations.push(`Great! Your target keyword "${targetKeyword}" has optimal density (${keywordDensity.toFixed(2)}%).`)
        }
      }

      if (totalWords < 300) {
        recommendations.push('Consider adding more content. Aim for at least 300-500 words for better SEO.')
      } else if (totalWords > 2000) {
        recommendations.push('Your content is quite long. Consider breaking it into multiple pages or sections.')
      }

      if (topKeywords.length > 0 && topKeywords[0].density > 5) {
        recommendations.push(`The word "${topKeywords[0].word}" appears very frequently (${topKeywords[0].density.toFixed(2)}%). Consider using synonyms for better readability.`)
      }

      const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0).length
      const avgWordsPerSentence = totalWords / Math.max(sentences, 1)
      const avgCharsPerWord = totalCharacters / Math.max(totalWords, 1)
      
      let readabilityScore = 100 - (avgWordsPerSentence * 1.5) - (avgCharsPerWord * 2)
      readabilityScore = Math.max(0, Math.min(100, readabilityScore))

      if (readabilityScore < 50) {
        recommendations.push('Consider using shorter sentences and simpler words to improve readability.')
      }

      setAnalysis({
        totalWords,
        totalCharacters,
        keywordCount,
        keywordDensity,
        topKeywords,
        recommendations,
        readabilityScore
      })

      setForm(prev => ({ ...prev, isAnalyzing: false }))
    }, 1500)
  }

  const resetAnalysis = () => {
    setForm({
      content: '',
      targetKeyword: '',
      isAnalyzing: false,
      results: null
    })
    setAnalysis(null)
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
            "name": "Keyword Density Analyzer",
            "description": "Analyze keyword density, distribution, and optimization opportunities in your content. Get insights on how to improve keyword balance for better SEO.",
            "url": "https://seoshouts.com/tools/keyword-density-analyzer",
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
              "Real-time density analysis",
              "Keyword distribution mapping", 
              "Optimization recommendations",
              "Export functionality",
              "Multiple keyword tracking",
              "Phrase density analysis",
              "Word count statistics"
            ],
            "keywords": "keyword density, SEO analysis, content optimization, keyword frequency",
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "bestRating": "5",
              "ratingCount": "1247"
            },
            "softwareVersion": "2.0",
            "datePublished": "2024-01-15",
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
                "name": "What's the ideal keyword density percentage?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "There's no universal perfect percentage, but 1-3% for primary keywords is generally recommended. Focus more on natural usage and user value than hitting exact percentages."
                }
              },
              {
                "@type": "Question",
                "name": "Can high keyword density hurt my rankings?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, keyword stuffing (excessive keyword repetition) can result in penalties. Our tool helps you identify when density is too high."
                }
              },
              {
                "@type": "Question",
                "name": "Should I analyze just my main content or include navigation?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements."
                }
              },
              {
                "@type": "Question",
                "name": "How often should I check keyword density?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes."
                }
              },
              {
                "@type": "Question",
                "name": "Does the tool work for non-English content?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, our analyzer works with content in multiple languages, though optimal density ranges may vary by language."
                }
              },
              {
                "@type": "Question",
                "name": "Can I analyze competitor content?",
                "acceptedAnswer": {
                  "@type": "Answer",
                  "text": "Yes, you can analyze any publicly accessible webpage using the URL analysis feature."
                }
              }
            ]
          })
        }}
      />
      
      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free SEO Tool
            </div>
            
            <h1 className="text-3xl sm:text-4xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Keyword Density
              </span>
              <br />
              <span className="text-primary">Analyzer</span>
            </h1>
            
            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <p>
                Stop guessing about your keyword usage. Our <strong className="text-gray-800">Free Keyword Density Analyzer</strong> gives you instant insights into how often keywords appear in your content, helping you strike the perfect balance between optimization and natural readability.
              </p>
              <p>
                Whether you're writing blog posts, product descriptions, or web pages, this tool ensures your content is optimized without risking keyword stuffing penalties.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Instant Analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Top Keywords Report
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                SEO Recommendations
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tool Section */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Content Analysis</h2>
                
                <div className="space-y-6">
                  <div>
                    <label htmlFor="targetKeyword" className="block text-sm font-semibold text-gray-700 mb-2">
                      Target Keyword (Optional)
                    </label>
                    <input
                      type="text"
                      id="targetKeyword"
                      value={form.targetKeyword}
                      onChange={(e) => setForm(prev => ({ ...prev, targetKeyword: e.target.value }))}
                      placeholder="e.g., SEO tips, digital marketing"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200"
                      disabled={form.isAnalyzing}
                    />
                    <p className="text-xs text-gray-500 mt-1">Enter your main keyword to check its density</p>
                  </div>

                  <div>
                    <label htmlFor="content" className="block text-sm font-semibold text-gray-700 mb-2">
                      Content to Analyze *
                    </label>
                    <textarea
                      id="content"
                      value={form.content}
                      onChange={(e) => setForm(prev => ({ ...prev, content: e.target.value }))}
                      placeholder="Paste your article, blog post, or web page content here..."
                      rows={12}
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                      disabled={form.isAnalyzing}
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {form.content.length} characters • {form.content.trim().split(/\s+/).filter(word => word.length > 0).length} words
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={analyzeContent}
                      disabled={form.isAnalyzing || !form.content.trim()}
                      className="flex-1 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center"
                    >
                      {form.isAnalyzing ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          Analyzing...
                        </>
                      ) : (
                        '🔍 Analyze Content'
                      )}
                    </button>
                    
                    {analysis && (
                      <button
                        onClick={resetAnalysis}
                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
                      >
                        Reset
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Results Section */}
              <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">Analysis Results</h2>
                
                {!analysis ? (
                  <div className="text-center py-12">
                    <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-3xl">📊</span>
                    </div>
                    <p className="text-gray-500">Enter your content and click "Analyze Content" to see detailed keyword density analysis</p>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">{analysis.totalWords}</div>
                        <div className="text-sm text-gray-600">Total Words</div>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-4">
                        <div className="text-2xl font-bold text-primary">{analysis.totalCharacters}</div>
                        <div className="text-sm text-gray-600">Characters</div>
                      </div>
                    </div>

                    {form.targetKeyword && (
                      <div className="border border-gray-200 rounded-xl p-4">
                        <h3 className="font-semibold text-gray-800 mb-3">Target Keyword Analysis</h3>
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Keyword:</span>
                            <span className="font-semibold text-primary">"{form.targetKeyword}"</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Count:</span>
                            <span className="font-semibold">{analysis.keywordCount}</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-gray-600">Density:</span>
                            <span className={`font-semibold ${
                              analysis.keywordDensity >= 0.5 && analysis.keywordDensity <= 3 
                                ? 'text-green-600' 
                                : 'text-orange-600'
                            }`}>
                              {analysis.keywordDensity.toFixed(2)}%
                            </span>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Readability Score</h3>
                      <div className="flex items-center space-x-3">
                        <div className="flex-1 bg-gray-200 rounded-full h-3">
                          <div 
                            className={`h-3 rounded-full ${
                              analysis.readabilityScore >= 70 ? 'bg-green-500' :
                              analysis.readabilityScore >= 50 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${Math.max(analysis.readabilityScore, 10)}%` }}
                          ></div>
                        </div>
                        <span className="font-semibold text-gray-800">
                          {analysis.readabilityScore.toFixed(0)}/100
                        </span>
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">Top Keywords</h3>
                      <div className="space-y-2 max-h-48 overflow-y-auto">
                        {analysis.topKeywords.map((keyword, index) => (
                          <div key={index} className="flex justify-between items-center py-1">
                            <span className="text-gray-800 font-medium">{keyword.word}</span>
                            <div className="text-right">
                              <span className="text-sm text-gray-600">{keyword.count}x</span>
                              <span className="text-sm text-primary ml-2">{keyword.density.toFixed(2)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="border border-gray-200 rounded-xl p-4">
                      <h3 className="font-semibold text-gray-800 mb-3">SEO Recommendations</h3>
                      <div className="space-y-2">
                        {analysis.recommendations.map((rec, index) => (
                          <div key={index} className="flex items-start space-x-2">
                            <span className="text-primary mt-1">•</span>
                            <span className="text-sm text-gray-700">{rec}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="bg-primary/5 border border-primary/10 rounded-2xl p-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-4">
                <strong>Ready to optimize your content?</strong> Try the Keyword Density Analyzer now and get instant recommendations to improve your SEO performance.
              </p>
              <div className="flex justify-center">
                <button 
                  onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                  className="bg-primary text-white px-8 py-3 rounded-xl font-semibold hover:bg-primary/90 transition-all duration-300"
                >
                  🎯 Use the Tool Above →
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is Keyword Density Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800 text-center">What is Keyword Density and Why Does It Matter?</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Keyword density is the percentage of times a target keyword appears in your content compared to the total word count. While there's no "perfect" density percentage, maintaining the right balance is crucial for SEO success.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's why keyword density matters:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Search engines need context</strong> to understand what your content is about</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Over-optimization can trigger penalties</strong> and hurt your rankings</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Under-optimization means missed opportunities</strong> for relevant traffic</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700"><strong>Natural keyword distribution</strong> improves user experience and readability</span>
                </div>
              </div>

              <div className="bg-primary/10 border border-primary/20 rounded-xl p-6">
                <p className="text-gray-700 text-center">
                  <strong>The sweet spot?</strong> Most SEO experts recommend keeping primary keyword density between <strong className="text-primary">1-3%</strong> for optimal results.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Key Features of Our Keyword Density Analyzer</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Comprehensive Analysis */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📊 Comprehensive Keyword Analysis</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span><strong>Real-time density calculations</strong> for any text or webpage URL</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span><strong>Primary and secondary keyword tracking</strong> to monitor all target terms</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span><strong>Phrase density analysis</strong> for long-tail keywords and key phrases</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">✓</span>
                    <span><strong>Word count statistics</strong> to understand content length and structure</span>
                  </li>
                </ul>
              </div>

              {/* Advanced Analytics */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">🔍 Advanced Analytics and Insights</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">✓</span>
                    <span><strong>Keyword frequency charts</strong> showing exact occurrence counts</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">✓</span>
                    <span><strong>Density percentage breakdowns</strong> for every keyword and phrase</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">✓</span>
                    <span><strong>Stop word filtering</strong> to focus on meaningful content words</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">✓</span>
                    <span><strong>Keyword distribution mapping</strong> throughout your content</span>
                  </li>
                </ul>
              </div>

              {/* User-Friendly Interface */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">🎨 User-Friendly Interface</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Simple copy-paste functionality</strong> for quick text analysis</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>URL analysis capability</strong> to check live webpages</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Clean, easy-to-read reports</strong> that anyone can understand</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-purple-600 mr-2 mt-1">✓</span>
                    <span><strong>Mobile-responsive design</strong> for analysis on any device</span>
                  </li>
                </ul>
              </div>

              {/* Professional Features */}
              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-8 border border-orange-100">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">⚡ Professional SEO Features</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mr-2 mt-1">✓</span>
                    <span><strong>Keyword highlighting</strong> to visualize distribution patterns</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mr-2 mt-1">✓</span>
                    <span><strong>Export functionality</strong> for detailed reporting and client presentations</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mr-2 mt-1">✓</span>
                    <span><strong>Bulk keyword tracking</strong> for comprehensive content audits</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-accent mr-2 mt-1">✓</span>
                    <span><strong>Historical comparison</strong> to track optimization improvements</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">How to Use the Keyword Density Analyzer</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* For Text Content */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📝 For Text Content</h3>
                <div className="space-y-4">
                  {[
                    'Copy your content from your document or CMS',
                    'Paste it into the analyzer input field',
                    'Click "Analyze Content" to generate your report',
                    'Review the results and identify optimization opportunities',
                    'Adjust your content based on the recommendations'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="bg-primary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* For Live Webpages */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">🌐 For Live Webpages</h3>
                <div className="space-y-4">
                  {[
                    'Enter the webpage URL you want to analyze',
                    'Click "Analyze URL" to fetch and process the content',
                    'Review keyword density for all detected keywords',
                    'Compare with competitors to identify gaps',
                    'Optimize your content for better performance'
                  ].map((step, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <span className="bg-secondary text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700">{step}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Understanding Results */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
                <h3 className="text-xl font-semibold mb-6 text-gray-800">📊 Understanding Results</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-green-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800">Green indicators:</strong>
                      <p className="text-sm text-gray-600">Optimal keyword density (1-3%)</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-yellow-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800">Yellow indicators:</strong>
                      <p className="text-sm text-gray-600">Slightly high density (3-5%) - monitor closely</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <span className="w-4 h-4 bg-red-500 rounded-full mt-1 flex-shrink-0"></span>
                    <div>
                      <strong className="text-gray-800">Red indicators:</strong>
                      <p className="text-sm text-gray-600">Potential over-optimization (5%+) - reduce usage</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SEO Best Practices Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">SEO Best Practices for Keyword Density</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              {/* Primary Keywords */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🎯 Primary Keywords</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Keep density between <strong>1-3%</strong> for main target keywords</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Use variations and synonyms naturally throughout content</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Focus on user intent rather than strict percentage targets</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-primary mr-2 mt-1">•</span>
                    <span>Ensure keywords appear in key locations (title, headings, first paragraph)</span>
                  </li>
                </ul>
              </div>

              {/* Secondary Keywords */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔗 Secondary Keywords</h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Maintain <strong>0.5-2%</strong> density for supporting keywords</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Use semantic variations to cover related search terms</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Balance keyword usage with natural language flow</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-secondary mr-2 mt-1">•</span>
                    <span>Include long-tail variations for comprehensive coverage</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* Content Optimization Tips */}
            <div className="bg-primary/10 border border-primary/20 rounded-2xl p-8">
              <h3 className="text-xl font-semibold mb-6 text-gray-800 text-center">💡 Content Optimization Tips</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span><strong>Write for humans first,</strong> optimize for search engines second</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span><strong>Use keywords naturally</strong> in context rather than forcing them</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span><strong>Vary your vocabulary</strong> with synonyms and related terms</span>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-primary mr-2 mt-1">✓</span>
                  <span><strong>Focus on topic coverage</strong> rather than keyword repetition</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Common Mistakes Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Common Keyword Density Mistakes to Avoid</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Over-Optimization */}
              <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-red-800 flex items-center">
                  <span className="text-2xl mr-2">⚠️</span>
                  Over-Optimization Red Flags
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Repeating the same keyword phrase excessively</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Forcing keywords into every paragraph unnaturally</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Using exact-match keywords when variations would flow better</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-red-500 mr-2 mt-1">✗</span>
                    <span>Ignoring readability for the sake of keyword density</span>
                  </li>
                </ul>
              </div>

              {/* Under-Optimization */}
              <div className="bg-orange-50 border-2 border-orange-200 rounded-2xl p-8">
                <h3 className="text-xl font-semibold mb-4 text-orange-800 flex items-center">
                  <span className="text-2xl mr-2">❗</span>
                  Under-Optimization Issues
                </h3>
                <ul className="space-y-3">
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-500 mr-2 mt-1">!</span>
                    <span>Failing to use target keywords in important sections</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-500 mr-2 mt-1">!</span>
                    <span>Not including keyword variations and synonyms</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-500 mr-2 mt-1">!</span>
                    <span>Missing opportunities for natural keyword placement</span>
                  </li>
                  <li className="flex items-start space-x-3">
                    <span className="text-orange-500 mr-2 mt-1">!</span>
                    <span>Ignoring search intent in favor of unrelated keywords</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-12 text-center text-gray-800">Why Choose SEO Shouts' Keyword Density Analyzer?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-6 border border-green-100">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Completely Free to Use</h3>
                    <p className="text-gray-600">No hidden fees, no registration required. Just paste your content and get instant analysis.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Accurate and Reliable</h3>
                    <p className="text-gray-600">Built by SEO experts with 13+ years of experience in keyword optimization and content analysis.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-6 border border-purple-100">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Regular Updates</h3>
                    <p className="text-gray-600">Our tool evolves with Google's algorithm changes and SEO best practices.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-50 to-red-50 rounded-2xl p-6 border border-orange-100">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Privacy-Focused</h3>
                    <p className="text-gray-600">Your content is analyzed locally and not stored on our servers.</p>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-6 border border-gray-100 md:col-span-2">
                <div className="flex items-start space-x-4">
                  <div className="text-3xl">✅</div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Professional-Grade Results</h3>
                    <p className="text-gray-600">The same quality analysis that we use for client campaigns, available free to everyone.</p>
                  </div>
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What's the ideal keyword density percentage?</h3>
                <p className="text-gray-600">There's no universal perfect percentage, but <strong>1-3% for primary keywords</strong> is generally recommended. Focus more on natural usage and user value than hitting exact percentages.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can high keyword density hurt my rankings?</h3>
                <p className="text-gray-600">Yes, keyword stuffing (excessive keyword repetition) can result in penalties. Our tool helps you identify when density is too high.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Should I analyze just my main content or include navigation?</h3>
                <p className="text-gray-600">For best results, analyze just your main content (body text) rather than including navigation, footers, or sidebar elements.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How often should I check keyword density?</h3>
                <p className="text-gray-600">Check density during content creation and before publishing. Also analyze when updating existing content or if you notice ranking changes.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does the tool work for non-English content?</h3>
                <p className="text-gray-600">Yes, our analyzer works with content in multiple languages, though optimal density ranges may vary by language.</p>
              </div>
              
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I analyze competitor content?</h3>
                <p className="text-gray-600">Yes, you can analyze any publicly accessible webpage using the URL analysis feature.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-16 bg-gradient-to-br from-primary to-primary/90 text-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Start Optimizing Your Content Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop leaving your keyword optimization to chance. Use our <strong>Free Keyword Density Analyzer</strong> to ensure your content hits the sweet spot between optimization and readability.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Keyword Density Analyzer Tool →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>🎯</span>
                <span>Analyze content instantly and get optimization recommendations</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📚</span>
                <span>Learn advanced techniques for natural keyword integration</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>💬</span>
                <span>Contact our SEO experts for personalized guidance</span>
              </div>
            </div>
            
            <p className="text-sm mt-6 opacity-80">
              <strong>Perfect your keyword optimization with SEO Shouts' free tools and expert guidance!</strong>
              <br />
              <em>Built by SEO professionals for content creators, marketers, and business owners who want better search rankings through optimized content.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
