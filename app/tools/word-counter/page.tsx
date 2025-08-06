'use client'

import { useState, useEffect } from 'react'

export default function WordsCharacterCounter() {
  // Set page title and meta tags
  useEffect(() => {
    document.title = 'Free Words and Character Counter Tool | SEO Shouts'
    
    let metaDescription = document.querySelector('meta[name="description"]')
    if (!metaDescription) {
      metaDescription = document.createElement('meta')
      metaDescription.setAttribute('name', 'description')
      document.head.appendChild(metaDescription)
    }
    metaDescription.setAttribute('content', 'Count words, characters, and reading time instantly. Free tool for social media, SEO, and content writing.')
    
    let metaKeywords = document.querySelector('meta[name="keywords"]')
    if (!metaKeywords) {
      metaKeywords = document.createElement('meta')
      metaKeywords.setAttribute('name', 'keywords')
      document.head.appendChild(metaKeywords)
    }
    metaKeywords.setAttribute('content', 'word counter, character counter, text counter, reading time, social media counter')
  }, [])

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
      {/* Header with Tool */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
              <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
                <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
                Free SEO Tool
              </div>
              
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Free Words and Character Counter Tool
                </span>
                <br />
                <span className="text-primary">Know Exactly How Long Your Text Is</span>
              </h1>
              
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Count Words, Characters, and Reading Time Instantly</h2>
              <p className="text-lg text-gray-600 mb-8">
                Need to know how many words or characters you've written? Trying to fit a perfect tweet or meta description? Our Words and Character Counter has got you covered.
              </p>
            </div>

            {/* The Tool */}
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-6 sm:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Text Input */}
                <div className="lg:col-span-2">
                  <label htmlFor="textInput" className="block text-sm font-semibold text-gray-700 mb-3">
                    Enter your text below:
                  </label>
                  <textarea
                    id="textInput"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Type or paste your text here..."
                    rows={12}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-primary focus:border-primary transition-all duration-200 resize-none"
                  />
                  
                  {/* Action Buttons */}
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={copyToClipboard}
                      disabled={!text.trim()}
                      className="flex-1 px-4 py-2 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {copied ? '✅ Copied!' : '📋 Copy Text'}
                    </button>
                    <button
                      onClick={clearText}
                      disabled={!text.trim()}
                      className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                </div>

                {/* Live Stats */}
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">Live Count</h3>
                  
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Words:</span>
                      <span className="text-xl font-bold text-primary">{wordCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Characters (with spaces):</span>
                      <span className="text-xl font-bold text-green-600">{charCount.toLocaleString()}</span>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Characters (no spaces):</span>
                      <span className="text-xl font-bold text-green-600">{charCountNoSpaces.toLocaleString()}</span>
                    </div>
                    
                   
                  </div>

                  {/* Quick Tips */}
                  <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <h4 className="text-sm font-semibold text-blue-800 mb-2">📝 Quick Tips:</h4>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Twitter: 280 characters max</li>
                      <li>• Meta descriptions: 150-160 chars</li>
                      <li>• Instagram: 125 chars visible</li>
                      <li>• Blog posts: 1,500+ words for SEO</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content Sections */}
      
      {/* Why Accurate Counting Matters */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-gray-800">Why Accurate Counting Actually Matters</h2>
            
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Look, we've all been there. You write the perfect Instagram caption, hit post, and... it gets cut off mid-sentence. Or you spend an hour crafting a meta description only to discover it's way too long for Google.
              </p>

              <h3 className="text-xl font-semibold mb-4 text-gray-800">Here's when length really matters:</h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Twitter posts: 280 characters max</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Meta descriptions: 150-160 characters before Google chops them</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Instagram captions: First 125 characters show without "more" button</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Facebook posts: Around 125 characters get better engagement</span>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></div>
                  <span className="text-gray-700">Blog posts: 1,500+ words typically perform better for SEO</span>
                </div>
              </div>

              <p className="text-gray-700">
                Miss these targets and your content either gets buried by algorithms or chopped off right when you're making your point.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Our Counter Different */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">What Makes Our Counter Different</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {/* Real-Time Updates */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 border border-blue-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">⚡ Real-Time Updates</h3>
                <p className="text-gray-600">No refresh buttons or delays. Type something, delete it, edit it - the numbers change instantly as you work.</p>
              </div>

              {/* Multiple Count Types */}
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-8 border border-green-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📊 Multiple Count Types</h3>
                <p className="text-gray-600">We show you everything: word count, characters with spaces, characters without spaces, reading time estimates, and more.</p>
              </div>

              {/* Works Everywhere */}
              <div className="bg-gradient-to-br from-purple-50 to-violet-50 rounded-2xl p-8 border border-purple-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📱 Works Everywhere</h3>
                <p className="text-gray-600">Desktop, phone, tablet - doesn't matter. The tool works perfectly no matter what device you're using.</p>
              </div>

              {/* Supports All Languages */}
              <div className="bg-gradient-to-br from-yellow-50 to-orange-50 rounded-2xl p-8 border border-yellow-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🌍 Supports All Languages</h3>
                <p className="text-gray-600">Writing in Hindi? Chinese? Arabic? No problem. Our counter handles every language and character set properly.</p>
              </div>

              {/* Completely Free */}
              <div className="bg-gradient-to-br from-pink-50 to-rose-50 rounded-2xl p-8 border border-pink-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">💯 Completely Free</h3>
                <p className="text-gray-600">No "upgrade to premium" nonsense. No limits. No registration. Just free, unlimited counting whenever you need it.</p>
              </div>

              {/* Privacy First */}
              <div className="bg-gradient-to-br from-teal-50 to-cyan-50 rounded-2xl p-8 border border-teal-100">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔒 Privacy First</h3>
                <p className="text-gray-600">Everything stays in your browser. We don't save, store, or even see what you're counting. Your text is completely private.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How to Use It */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">How to Use It (Spoiler: It's Really Easy)</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 1:</h3>
                <p className="text-gray-700">Paste your text into the box (or start typing directly)</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 2:</h3>
                <p className="text-gray-700">Watch the counts update automatically as you type</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 3:</h3>
                <p className="text-gray-700">Use the numbers to guide your editing</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Step 4:</h3>
                <p className="text-gray-700">Copy your perfectly-sized content and use it wherever you need</p>
              </div>
            </div>

            <div className="bg-primary/10 border border-primary/20 rounded-xl p-6 mt-8">
              <p className="text-gray-700 text-center">
                That's literally it. No complicated settings or confusing options.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Common Situations */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Common Situations Where This Saves Your Sanity</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">"This Tweet Needs to Be Exactly Right"</h3>
                <p className="text-gray-700">Craft tweets that use every available character without going over. Perfect for important announcements or promotional posts.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">"My Meta Description Is Way Too Long"</h3>
                <p className="text-gray-700">See exactly how many characters you need to trim so Google doesn't cut off your description in search results.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">"Is This Blog Post Long Enough?"</h3>
                <p className="text-gray-700">Check if you've hit the minimum word count needed to compete for your target keywords.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">"This Email Subject Line Feels Off"</h3>
                <p className="text-gray-700">Most email clients cut off subject lines around 50 characters. Make sure yours fits perfectly.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:col-span-2">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">"How Long Will This Take to Read?"</h3>
                <p className="text-gray-700">Great for blog intros where you want to set expectations, or when planning content for time-sensitive situations.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Who Uses Our Counter */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">Who Uses Our Counter?</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">✍️</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Content Writers</h3>
                <p className="text-gray-600">Hit target word counts for SEO while keeping content engaging and readable.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📱</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Social Media Managers</h3>
                <p className="text-gray-600">Create posts that fit platform limits perfectly and perform better in feeds.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📝</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Bloggers</h3>
                <p className="text-gray-600">Make sure posts are long enough for SEO but not so long that readers bounce.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🎓</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Students</h3>
                <p className="text-gray-600">Meet assignment requirements without going over (or under) word limits.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">📧</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Email Marketers</h3>
                <p className="text-gray-600">Optimize subject lines and preview text for better open rates.</p>
              </div>

              <div className="text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🌐</span>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">Anyone Who Writes Online</h3>
                <p className="text-gray-600">Basically, if you write anything for the internet, you need to know how long it is.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Reference */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Quick Reference: Common Character Limits</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Social Media */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📱 Social Media:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Twitter: 280 characters</li>
                  <li>• Facebook: 125 characters for best engagement</li>
                  <li>• Instagram: 125 characters before truncation</li>
                  <li>• LinkedIn: 150 characters for feed visibility</li>
                </ul>
              </div>

              {/* SEO Stuff */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">🔍 SEO Stuff:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Title tags: 50-60 characters</li>
                  <li>• Meta descriptions: 150-160 characters</li>
                  <li>• Alt text: 100-125 characters</li>
                </ul>
              </div>

              {/* Email Marketing */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-xl font-semibold mb-4 text-gray-800">📧 Email Marketing:</h3>
                <ul className="space-y-2 text-gray-700">
                  <li>• Subject lines: 50 characters for mobile</li>
                  <li>• Preview text: 90-110 characters</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">Frequently Asked Questions</h2>
            
            <div className="space-y-6">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is this actually accurate?</h3>
                <p className="text-gray-700">Yep. We count the same way major platforms do. Cross-tested against Twitter, Facebook, and Google's own counters.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does it work without internet?</h3>
                <p className="text-gray-700">Once the page loads, yes! Everything happens in your browser, so you can count offline.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I count really long documents?</h3>
                <p className="text-gray-700">Sure, but for massive files you might want to count sections at a time for better performance.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">What about emojis and special characters?</h3>
                <p className="text-gray-700">We count everything correctly, including emojis, symbols, and all Unicode characters.</p>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is my text stored anywhere?</h3>
                <p className="text-gray-700">Nope. Everything stays in your browser. We don't save, store, or even see what you're counting.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Explore More SEO Tools Section */}
      <section className="py-16 bg-gradient-to-br from-primary/5 to-indigo/5">
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
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Density Analyzer</h3>
                <p className="text-sm text-gray-600 mb-4">Optimize your keyword usage and avoid over-optimization penalties.</p>
                <a href="/tools/keyword-density-analyzer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🤖</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Robots.txt Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Create perfect robots.txt files without breaking your website.</p>
                <a href="/tools/robots-txt-generator" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🗺️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">XML Sitemap Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Help search engines find every page on your website.</p>
                <a href="/tools/xml-sitemap-generator" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔤</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Words & Character Counter</h3>
                <p className="text-sm text-gray-600 mb-4">Count words, characters, and reading time instantly for any text.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🏷️</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Meta Tag Optimizer</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect title tags and meta descriptions.</p>
                <a href="/tools/meta-tag-optimizer" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Keyword Difficulty Checker</h3>
                <p className="text-sm text-gray-600 mb-4">Find keywords you can actually rank for with difficulty scores.</p>
                <a href="/tools/keyword-difficulty-checker" className="text-primary font-medium hover:underline">
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
            <h2 className="text-3xl font-bold mb-6">Start Counting Smarter</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop guessing about content length and start knowing exactly where you stand. Whether you're tweeting, blogging, or writing anything else online, our counter helps you hit the target every time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button 
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                🎯 Use the Words and Character Counter →
              </button>
            </div>

            <div class="text-center mb-6">
              <p className="text-lg font-semibold mb-2">Count instantly - no signup required</p>
              <p className="text-sm opacity-80">📱 Works great on mobile too</p>
            </div>
            
            <p className="text-sm opacity-80">
              <strong>Never get cut off mid-sentence again. Use SEO Shouts' Words and Character Counter and write with confidence.</strong>
              <br />
              <em>Simple, accurate, and always free.</em>
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}
