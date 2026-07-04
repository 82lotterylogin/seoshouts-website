'use client';

import React, { useState, useEffect } from 'react';
import ShapeGrid from '../../components/ShapeGrid';

interface HashtagResult {
  tag: string;
  posts: number;
  engagement: string;
  trend: 'rising' | 'stable' | 'falling';
  category: string;
}

interface Platform {
  id: string;
  name: string;
  icon: string;
  maxHashtags: number;
  popularity: number;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: '📷', maxHashtags: 30, popularity: 95 },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', maxHashtags: 10, popularity: 85 },
  { id: 'youtube', name: 'YouTube', icon: '📺', maxHashtags: 15, popularity: 90 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', maxHashtags: 5, popularity: 75 },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', maxHashtags: 20, popularity: 70 },
  { id: 'threads', name: 'Threads', icon: '🧵', maxHashtags: 10, popularity: 60 },
];

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Spanish', flag: '🇪🇸' },
  { code: 'fr', name: 'French', flag: '🇫🇷' },
  { code: 'de', name: 'German', flag: '🇩🇪' },
  { code: 'it', name: 'Italian', flag: '🇮🇹' },
  { code: 'pt', name: 'Portuguese', flag: '🇧🇷' },
  { code: 'ru', name: 'Russian', flag: '🇷🇺' },
  { code: 'ja', name: 'Japanese', flag: '🇯🇵' },
  { code: 'ko', name: 'Korean', flag: '🇰🇷' },
  { code: 'zh', name: 'Chinese', flag: '🇨🇳' },
  { code: 'ar', name: 'Arabic', flag: '🇸🇦' },
  { code: 'hi', name: 'Hindi', flag: '🇮🇳' },
];

const categories = [
  { id: 'general', name: 'General', icon: '🌟' },
  { id: 'business', name: 'Business', icon: '💼' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '✨' },
  { id: 'fitness', name: 'Fitness', icon: '💪' },
  { id: 'food', name: 'Food', icon: '🍕' },
  { id: 'travel', name: 'Travel', icon: '✈️' },
  { id: 'fashion', name: 'Fashion', icon: '👗' },
  { id: 'tech', name: 'Technology', icon: '💻' },
  { id: 'gaming', name: 'Gaming', icon: '🎮' },
  { id: 'art', name: 'Art & Design', icon: '🎨' },
  { id: 'music', name: 'Music', icon: '🎵' },
  { id: 'education', name: 'Education', icon: '📚' },
  { id: 'health', name: 'Health', icon: '🏥' },
  { id: 'beauty', name: 'Beauty', icon: '💄' },
  { id: 'pets', name: 'Pets', icon: '🐕' },
];

const timePeriods = [
  { id: '1h', name: 'Last Hour', icon: '⚡' },
  { id: '6h', name: 'Last 6 Hours', icon: '🔥' },
  { id: '24h', name: 'Last 24 Hours', icon: '📈' },
  { id: '7d', name: 'Last 7 Days', icon: '📊' },
  { id: '30d', name: 'Last 30 Days', icon: '📅' },
];

export default function TrendingHashtagFinderClient() {
  const [selectedPlatform, setSelectedPlatform] = useState<Platform>(platforms[0]);
  const [selectedLanguage, setSelectedLanguage] = useState(languages[0]);
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [selectedTimePeriod, setSelectedTimePeriod] = useState(timePeriods[2]);
  const [contentDescription, setContentDescription] = useState('');
  const [competitorHandle, setCompetitorHandle] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [results, setResults] = useState<HashtagResult[]>([]);
  const [activeTab, setActiveTab] = useState<'generate' | 'trending' | 'competitor' | 'bulk'>('trending');

  // Auto-switch away from competitor tab when LinkedIn is selected
  useEffect(() => {
    if (selectedPlatform.id === 'linkedin' && activeTab === 'competitor') {
      setActiveTab('trending');
    }
  }, [selectedPlatform.id, activeTab]);

  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [bulkContent, setBulkContent] = useState('');

  const generateHashtags = async () => {
    if (!contentDescription.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/generate-hashtags/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          language: selectedLanguage.code,
          category: selectedCategory.id,
          timePeriod: selectedTimePeriod.id,
          description: contentDescription,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.hashtags);
      }
    } catch (error) {
      console.error('Error generating hashtags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const findTrendingHashtags = async () => {
    setIsLoading(true);
    try {
      // Use platform-specific APIs for real data
      let apiEndpoint = '/api/trending-hashtags/'; // Default fallback

      if (selectedPlatform.id === 'linkedin') {
        apiEndpoint = '/api/linkedin-hashtags/';
      } else if (selectedPlatform.id === 'twitter') {
        apiEndpoint = '/api/twitter-hashtags/';
      } else if (selectedPlatform.id === 'youtube') {
        apiEndpoint = '/api/youtube-hashtags/';
      } else if (selectedPlatform.id === 'instagram') {
        apiEndpoint = '/api/instagram-hashtags/';
      } else if (selectedPlatform.id === 'pinterest') {
        apiEndpoint = '/api/pinterest-hashtags/';
      }

      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          language: selectedLanguage.code,
          category: selectedCategory.id,
          timePeriod: selectedTimePeriod.id,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.hashtags);
      }
    } catch (error) {
      console.error('Error finding trending hashtags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeCompetitor = async () => {
    if (!competitorHandle.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/competitor-hashtags/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          handle: competitorHandle,
          language: selectedLanguage.code,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setResults(data.hashtags);
      }
    } catch (error) {
      console.error('Error analyzing competitor:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const generateBulkHashtags = async () => {
    if (!bulkContent.trim()) return;

    const posts = bulkContent.split('\n').filter(line => line.trim());
    if (posts.length === 0) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/bulk-hashtags/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform: selectedPlatform.id,
          language: selectedLanguage.code,
          category: selectedCategory.id,
          posts,
        }),
      });

      const data = await response.json();
      if (data.success) {
        // Flatten results for display
        const allHashtags: HashtagResult[] = [];
        data.results.forEach((result: any) => {
          result.hashtags.forEach((hashtag: HashtagResult) => {
            allHashtags.push(hashtag);
          });
        });
        setResults(allHashtags);
      }
    } catch (error) {
      console.error('Error generating bulk hashtags:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const copyHashtags = async (hashtags: string[], index?: number) => {
    try {
      const text = hashtags.map(tag => `#${tag}`).join(' ');
      await navigator.clipboard.writeText(text);

      if (typeof index === 'number') {
        setCopiedIndex(index);
        setTimeout(() => setCopiedIndex(null), 2000);
      } else {
        setCopiedIndex(-1);
        setTimeout(() => setCopiedIndex(null), 2000);
      }
    } catch (error) {
      console.error('Failed to copy hashtags:', error);
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'rising': return '📈';
      case 'falling': return '📉';
      default: return '➡️';
    }
  };

  const tabDefs = [
    { id: 'generate', name: 'AI Generate', icon: '🤖' },
    { id: 'trending', name: 'Trending Now', icon: '🔥' },
    ...(selectedPlatform.id !== 'linkedin' ? [{ id: 'competitor', name: 'Competitor Analysis', icon: '🕵️' }] : []),
    { id: 'bulk', name: 'Bulk Generate', icon: '📦' },
  ];

  const selectStyle: React.CSSProperties = {
    width: '100%', border: '1px solid var(--gray-3)', padding: '11px 14px',
    fontFamily: 'Inter, sans-serif', fontSize: '0.85rem', color: 'var(--ink)',
    outline: 'none', background: 'var(--white)', cursor: 'pointer',
  };

  return (
    <>
      {/* --- TOOL HERO --- */}
      <div id="top" className="tool-hero">
        <div style={{ position: 'absolute', inset: 0, overflow: 'hidden', pointerEvents: 'all' }}>
          <ShapeGrid direction="diagonal" speed={0.4} borderColor="rgba(37,99,235,0.22)" squareSize={52} hoverFillColor="rgba(37,99,235,0.2)" hoverTrailAmount={6} />
        </div>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse 80% 60% at 50% 0%, transparent 30%, rgba(8,9,10,0.9) 100%)', pointerEvents: 'none' }} />
        <div className="tool-hero-inner">
          <nav className="breadcrumb" aria-label="Breadcrumb">
            <a href="/">Home</a>
            <span className="breadcrumb-sep">/</span>
            <a href="/tools/">SEO Tools</a>
            <span className="breadcrumb-sep">/</span>
            <span style={{ color: 'rgba(255,255,255,0.5)' }}>Trending Hashtag Finder</span>
          </nav>
          <div className="tool-hero-badge">#️⃣ Social Media Tool — Free Forever</div>
          <h1 className="tool-hero-h1">
            Free Trending Hashtag Finder: <span>AI Generation</span>, Trending Discovery &amp; Competitor Analysis
          </h1>
          <p className="tool-hero-sub">
            A trending hashtag finder analyzes what is actually gaining engagement right now across a platform, so you are not guessing between #love and #entrepreneur. SEOShouts&apos; free tool covers{' '}
            <strong style={{ color: 'rgba(255,255,255,0.85)' }}>6+ platforms</strong>{' '}
            with AI-powered generation from your content description, live trending discovery, competitor hashtag analysis, and bulk generation for up to 50 posts at once.
          </p>
        </div>
      </div>

      {/* --- TOOL INPUT SECTION --- */}
      <div className="tool-input-section">
        <div className="tool-input-inner" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', alignItems: 'start' }}>

          {/* LEFT BOX: Controls */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Generate Hashtags</h2>
            <p className="tool-box-sub">100% free, no registration required. Generate unlimited hashtags for all platforms.</p>

            {/* Settings Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem' }}>
              <div>
                <label className="tool-box-label">Platform</label>
                <select
                  value={selectedPlatform.id}
                  onChange={(e) => setSelectedPlatform(platforms.find(p => p.id === e.target.value) || platforms[0])}
                  style={selectStyle}
                >
                  {platforms.map((platform) => (
                    <option key={platform.id} value={platform.id}>
                      {platform.icon} {platform.name} (Max: {platform.maxHashtags})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tool-box-label">Language</label>
                <select
                  value={selectedLanguage.code}
                  onChange={(e) => setSelectedLanguage(languages.find(l => l.code === e.target.value) || languages[0])}
                  style={selectStyle}
                >
                  {languages.map((lang) => (
                    <option key={lang.code} value={lang.code}>
                      {lang.flag} {lang.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tool-box-label">Category</label>
                <select
                  value={selectedCategory.id}
                  onChange={(e) => setSelectedCategory(categories.find(c => c.id === e.target.value) || categories[0])}
                  style={selectStyle}
                >
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.icon} {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="tool-box-label">Time Period</label>
                <select
                  value={selectedTimePeriod.id}
                  onChange={(e) => setSelectedTimePeriod(timePeriods.find(t => t.id === e.target.value) || timePeriods[2])}
                  style={selectStyle}
                >
                  {timePeriods.map((period) => (
                    <option key={period.id} value={period.id}>
                      {period.icon} {period.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Tab Navigation */}
            <div className="filter-chips" style={{ marginBottom: '1.5rem' }}>
              {tabDefs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`fchip${activeTab === tab.id ? ' active' : ''}`}
                  style={{ cursor: 'pointer' }}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.name}</span>
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'generate' && (
              <div>
                <label className="tool-box-label" htmlFor="content-desc">Describe Your Content</label>
                <textarea
                  id="content-desc"
                  value={contentDescription}
                  onChange={(e) => setContentDescription(e.target.value)}
                  placeholder="Describe what your post is about... (e.g., 'sunset photography at the beach', 'healthy breakfast recipe', 'workout motivation')"
                  rows={4}
                  style={{
                    width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                    resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                    color: 'var(--ink)', outline: 'none', lineHeight: 1.6, marginBottom: '1.25rem'
                  }}
                />
                <button onClick={generateHashtags} disabled={!contentDescription.trim() || isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: (!contentDescription.trim() || isLoading) ? 0.5 : 1, cursor: (!contentDescription.trim() || isLoading) ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Generating AI Hashtags…' : '🤖 Generate AI Hashtags'}
                </button>
              </div>
            )}

            {activeTab === 'trending' && (
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', color: 'var(--gray-5)', marginBottom: '1.25rem' }}>
                  Discover what&apos;s trending right now on {selectedPlatform.name} in {selectedCategory.name}
                </p>
                <button onClick={findTrendingHashtags} disabled={isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: isLoading ? 0.5 : 1, cursor: isLoading ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Finding Trending Hashtags…' : '🔥 Find Trending Hashtags'}
                </button>
              </div>
            )}

            {activeTab === 'competitor' && (
              <div>
                <label className="tool-box-label" htmlFor="competitor-handle">Competitor Username/Handle</label>
                <input
                  type="text"
                  id="competitor-handle"
                  className="tool-url-input"
                  value={competitorHandle}
                  onChange={(e) => setCompetitorHandle(e.target.value)}
                  placeholder="Enter competitor's username (without @)"
                  style={{ marginBottom: '1.25rem' }}
                />
                <button onClick={analyzeCompetitor} disabled={!competitorHandle.trim() || isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: (!competitorHandle.trim() || isLoading) ? 0.5 : 1, cursor: (!competitorHandle.trim() || isLoading) ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Analyzing…' : '🕵️ Analyze Competitor'}
                </button>
              </div>
            )}

            {activeTab === 'bulk' && (
              <div>
                <label className="tool-box-label" htmlFor="bulk-content">Bulk Content Descriptions (one per line, max 50)</label>
                <textarea
                  id="bulk-content"
                  value={bulkContent}
                  onChange={(e) => setBulkContent(e.target.value)}
                  placeholder={`Enter multiple content descriptions, one per line:\n\nSunset beach photography\nHealthy breakfast recipe\nMorning workout routine\nTravel tips for Europe\nFashion outfit inspiration`}
                  rows={6}
                  style={{
                    width: '100%', border: '1px solid var(--gray-3)', padding: '13px 16px',
                    resize: 'none', fontFamily: 'Inter, sans-serif', fontSize: '0.9rem',
                    color: 'var(--ink)', outline: 'none', lineHeight: 1.6, marginBottom: '0.35rem'
                  }}
                />
                <p style={{ fontSize: '0.78rem', color: 'var(--gray-4)', marginBottom: '1.25rem' }}>
                  {bulkContent.split('\n').filter(line => line.trim()).length}/50 posts
                </p>
                <button onClick={generateBulkHashtags} disabled={!bulkContent.trim() || isLoading} className="btn-primary" style={{ width: '100%', justifyContent: 'center', opacity: (!bulkContent.trim() || isLoading) ? 0.5 : 1, cursor: (!bulkContent.trim() || isLoading) ? 'not-allowed' : 'pointer' }}>
                  {isLoading ? 'Generating…' : '📦 Generate Bulk Hashtags'}
                </button>
              </div>
            )}
          </div>

          {/* RIGHT BOX: Results */}
          <div className="tool-box" style={{ maxWidth: 'none' }}>
            <h2 className="tool-box-heading">Generated Hashtags</h2>

            {results.length > 0 ? (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--gray-4)' }}>Found {results.length} hashtags for {selectedPlatform.name}</span>
                  <button
                    onClick={() => copyHashtags(results.map(r => r.tag))}
                    style={{
                      padding: '6px 14px', background: copiedIndex === -1 ? 'var(--green)' : 'var(--blue)', color: '#fff',
                      border: 'none', fontSize: '0.75rem', fontWeight: 600,
                      cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0
                    }}
                  >
                    📋 {copiedIndex === -1 ? 'Copied!' : 'Copy All'}
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: 380, overflowY: 'auto' }}>
                  {results.slice(0, 10).map((result, index) => (
                    <div key={index} style={{ background: 'var(--gray-1)', border: '1px solid var(--line)', padding: '0.75rem 1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ fontWeight: 700, color: 'var(--blue)', fontFamily: 'Space Grotesk, sans-serif' }}>#{result.tag}</span>
                        <div style={{ fontSize: '0.72rem', color: 'var(--gray-4)', marginTop: '0.2rem' }}>
                          {result.posts.toLocaleString()} posts • {result.engagement} engagement {getTrendIcon(result.trend)}
                        </div>
                      </div>
                      <button
                        onClick={() => copyHashtags([result.tag], index)}
                        style={{
                          padding: '5px 12px', background: copiedIndex === index ? 'var(--green)' : 'var(--blue)', color: '#fff',
                          border: 'none', fontSize: '0.72rem', fontWeight: 600, cursor: 'pointer', fontFamily: 'Space Grotesk, sans-serif', flexShrink: 0
                        }}
                      >
                        {copiedIndex === index ? '✓' : 'Copy'}
                      </button>
                    </div>
                  ))}
                </div>

                {results.length > 10 && (
                  <p style={{ fontSize: '0.72rem', color: 'var(--gray-4)', textAlign: 'center', marginTop: '0.75rem' }}>
                    Showing first 10 results. Use &ldquo;Copy All&rdquo; to get all {results.length} hashtags.
                  </p>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: 'var(--gray-4)' }}>
                <span style={{ fontSize: '2.5rem', display: 'block', marginBottom: '1rem' }}>🎯</span>
                <p style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--gray-5)', marginBottom: '0.4rem' }}>No hashtags generated yet</p>
                <p style={{ fontSize: '0.85rem' }}>Use the options on the left to generate hashtags for your content</p>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* --- FOUNDER QUOTE --- */}
      <section className="section founder-section" style={{ padding: '3rem 2rem' }}>
        <div className="section-container">
          <div className="founder-inner">
            <div className="founder-avatar">RS</div>
            <div>
              <div className="founder-name">Built by Rohit Sharma — 13+ Years in SEO</div>
              <p className="founder-quote-text">
                &ldquo;Hashtags are the last place most creators still guess instead of check. I built this to remove the guessing: real trending data where the platform exposes it, AI-matched suggestions from your actual content everywhere else, so every post gets tags that fit the platform&apos;s current algorithm, not last year&apos;s advice.&rdquo;
              </p>
              <div className="founder-role">
                — Rohit Sharma, Founder of SEOShouts ·{' '}
                <a href="/meet-the-experts/" style={{ color: 'var(--blue-light)' }}>Meet Our Experts</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* --- OVERVIEW --- */}
      <section className="section prose-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Overview</div>
            <h2 className="s-title">What is a trending hashtag finder <span className="blue">and why does it beat guessing?</span></h2>
          </div>
          <div className="prose-content">
            <p>A trending hashtag finder analyzes what tags are actively driving reach and engagement on a platform right now, then matches them to your content, instead of you picking between #love, #instagood, and a competitor&apos;s hashtag list and hoping. This tool covers Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads with platform-specific optimization: Instagram supports up to 30 hashtags, LinkedIn performs best with 3 to 5, and treating them the same wastes reach on both.</p>
            <p>Four modes cover the situations creators actually face: <strong>AI Generate</strong> turns a content description into relevant hashtags, <strong>Trending Now</strong> surfaces what is gaining traction on your chosen platform and category, <strong>Competitor Analysis</strong> reveals what tags a rival account is using successfully, and <strong>Bulk Generate</strong> processes up to 50 post descriptions in one pass for content calendars.</p>
            <p>Hashtags are discovery infrastructure, not decoration. They categorize your post, expose it to searches and feeds beyond your existing followers, and connect you to the community around a topic. Getting them right measurably changes reach; getting them wrong (irrelevant, banned, or oversaturated tags) can suppress a post&apos;s distribution entirely on some platforms.</p>
            <p>Once your hashtag strategy is set, keep the rest of your content SEO-tight with the <a href="/tools/ai-copywriter/" style={{ color: 'var(--blue)' }}>AI copywriter</a> for captions and the <a href="/tools/blog-ideas-generator/" style={{ color: 'var(--blue)' }}>blog ideas generator</a> for longer-form topics that pair with your social push.</p>
          </div>
        </div>
      </section>

      {/* --- FEATURES --- */}
      <section className="section features-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Features</div>
            <h2 className="s-title">Why this hashtag tool <span className="blue">beats a static list</span></h2>
          </div>
          <div className="features-grid">
            {[
              { iconPaths: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'], title: '6+ Platform Support', desc: 'Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads, each with its own tag-count limit and optimization strategy.' },
              { iconPaths: ['M13 2L3 14h9l-1 8 10-12h-9l1-8z'], title: 'Real-Time Trending Data', desc: 'Live trending hashtags with time-period filters (last hour to last 30 days) for maximum relevance to the current moment.' },
              { iconPaths: ['M12 8V4H8', 'M4 8h16', 'M4 16h16', 'M8 20h8'], title: 'AI-Powered Generation', desc: 'Describe your content in a sentence and get hashtags matched to your actual topic, not a generic niche list.' },
              { iconPaths: ['M11 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11a2 2 0 0 1 2 2v4', 'M15 15l5 5m-5 0 5-5'], title: 'Competitor Intelligence', desc: 'Analyze any competitor\'s hashtag strategy and find the tags they are winning with that you are not using yet.' },
              { iconPaths: ['M2 12h20', 'M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z'], title: '12+ Languages', desc: 'Multi-language support with cultural context, so hashtag suggestions match regional trends, not just English defaults.' },
              { iconPaths: ['M3 3v18h18', 'M18.7 8l-5.1 5.2-2.8-2.7L7 14.3'], title: 'Engagement Analytics', desc: 'Post counts, engagement level, and trend direction (rising, stable, falling) per hashtag so you pick tags with real traction.' },
            ].map((f) => (
              <div key={f.title} className="feature-card">
                <div className="feature-icon">
                  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {f.iconPaths.map((d, j) => <path key={j} d={d} />)}
                  </svg>
                </div>
                <div className="feature-title">{f.title}</div>
                <p style={{ fontSize: '0.85rem', color: 'var(--gray-4)', lineHeight: 1.6, margin: '0.75rem 0 0' }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- HOW TO USE --- */}
      <section className="section howto-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">How To Use</div>
            <h2 className="s-title">How to find trending hashtags <span className="blue">in under a minute</span></h2>
          </div>
          <div className="steps-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
            {[
              { n: '01', title: 'Choose Your Platform', desc: 'Select Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, or Threads. Each platform gets its own tag-count limit and strategy applied automatically.' },
              { n: '02', title: 'Set Language, Category & Time', desc: 'Narrow results to your niche, language, and how recent the trend needs to be, from the last hour to the last 30 days.' },
              { n: '03', title: 'Pick a Generation Mode', desc: 'AI Generate from a content description, pull live Trending Now data, run a Competitor Analysis, or Bulk Generate for up to 50 posts at once.' },
              { n: '04', title: 'Copy & Publish', desc: 'Copy individual hashtags or the full set with one click, then paste into your post. No signup, no rate-limited paywall.' },
            ].map((s, i, arr) => (
              <div key={s.n} className="step-card">
                {i < arr.length - 1 && (
                  <div className="step-connector">
                    <svg width={10} height={10} viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14 M12 5l7 7-7 7" /></svg>
                  </div>
                )}
                <div className="step-num-big">{s.n}</div>
                <div className="step-title">{s.title}</div>
                <div className="step-desc">{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- PLATFORM LIMITS --- */}
      <section className="section why-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Platform Guide</div>
            <h2 className="s-title">Hashtag count and strategy <span className="blue">by platform</span></h2>
            <p className="s-sub">The same 10 hashtags that help on Instagram can look like spam on LinkedIn. Match the count to the platform.</p>
          </div>
          <div className="why-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginTop: '3rem' }}>
            {[
              { title: 'Instagram: up to 30', color: 'var(--blue)', body: 'Mix 2-3 broad tags (100K+ posts), 5-7 medium tags (10K-100K), and the rest niche-specific tags under 10K posts to avoid getting buried by top creators.' },
              { title: 'Twitter/X: 1-2 max', color: 'var(--blue)', body: 'More than two hashtags measurably hurts engagement on Twitter. Pick the single most relevant trending tag and let the rest of the tweet carry the reach.' },
              { title: 'LinkedIn: 3-5', color: 'var(--blue)', body: 'Professional, specific tags outperform broad ones. Industry and role-specific tags (#B2BMarketing) beat generic ones (#business) for a professional audience.' },
              { title: 'YouTube: 3-15 in description', color: 'var(--blue)', body: 'The first 3 tags appear above the title. Put your most important keyword-matching tags first; the rest support search and suggested-video placement.' },
              { title: 'Pinterest: 2-5 per pin', color: 'var(--blue)', body: 'Pinterest treats hashtags as a minor signal behind keyword-rich titles and descriptions. Use a handful of specific, searchable tags rather than a long list.' },
              { title: 'Threads: emerging norms', color: 'var(--blue)', body: 'Threads hashtag support and impact are still evolving. Use 1-3 relevant tags and prioritize the caption text, which currently carries more discovery weight.' },
            ].map((card) => (
              <div key={card.title} className="why-card" style={{ borderTop: `3px solid ${card.color}` }}>
                <div className="why-card-title">{card.title}</div>
                <div className="why-card-body">{card.body}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- MISTAKES --- */}
      <section className="section mistakes-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Common Mistakes</div>
            <h2 className="s-title">5 hashtag mistakes that <span className="blue">quietly kill reach</span></h2>
          </div>
          <div className="mistakes-grid">
            {[
              { n: '01', title: 'Using Only Oversaturated Tags', body: 'A tag with 50 million posts buries yours within seconds. Mix broad tags with medium and niche ones so your post has a realistic window of visibility.', bad: '#love #instagood #photooftheday #happy (all 100M+ posts)', good: '2 broad + 5 medium (10K-500K) + rest niche-specific' },
              { n: '02', title: 'Copying a Competitor\'s Full List Verbatim', body: 'Their audience, posting time, and account authority differ from yours. Use competitor analysis to find candidate tags, then test a subset against your own engagement data.', bad: 'Pasting a competitor\'s exact 30 hashtags unchanged', good: 'Borrowing 5-8 relevant tags, adding your own niche-specific set' },
              { n: '03', title: 'Same Hashtag Set on Every Post', body: 'Platforms increasingly flag identical hashtag blocks reused across posts as spam-like behavior, which can suppress reach. Rotate and tailor tags per post.', bad: 'The same 30-tag block pasted under every single post', good: 'A core set of 5-8 rotated with 10-15 post-specific tags' },
              { n: '04', title: 'Ignoring Platform-Specific Tag Counts', body: 'Thirty hashtags on LinkedIn reads as spam; two hashtags on Instagram leaves reach on the table. Match the count to the platform, not a one-size rule.', bad: '15 hashtags on a LinkedIn post', good: '3-5 specific, professional tags on LinkedIn' },
              { n: '05', title: 'Never Checking Trend Direction', body: 'A hashtag with huge historical volume but a falling trend is riding a wave that already broke. Rising and stable tags at your size bracket outperform dying broad tags.', bad: 'Picking tags purely by total post count', good: 'Checking the rising/stable/falling indicator before selecting' },
            ].map(m => (
              <div key={m.n} className="mistake-card">
                <div className="mistake-card-top">
                  <div className="mistake-num">Mistake {m.n}</div>
                  <div className="mistake-title">{m.title}</div>
                  <div className="mistake-body-text">{m.body}</div>
                </div>
                <div className="code-example">
                  <div className="code-bad"><span className="code-label">✗</span><span className="code-text">{m.bad}</span></div>
                  <div className="code-good"><span className="code-label">✓</span><span className="code-text">{m.good}</span></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- CHECKLIST --- */}
      <section className="section checklist-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Pre-Publish Checklist</div>
            <h2 className="s-title">Hashtag checklist <span className="blue">before every post</span></h2>
          </div>
          <div className="checklist-grid">
            {[
              { title: '📊 Relevance', items: ['Every tag actually matches the post content', 'No banned or shadowbanned tags included', 'Mix of broad, medium, and niche-specific tags', 'Language matches your target audience'] },
              { title: '🎯 Platform Fit', items: ['Tag count matches the platform norm', 'Trend direction checked (rising or stable preferred)', 'Not identical to your last 5 posts', 'Placement correct (caption vs first comment vs description)'] },
              { title: '🔧 Strategy', items: ['At least one tag under 10K posts for visibility', 'Competitor-informed tags added where relevant', 'Category and time period matched the campaign', 'Results copied and tested, not guessed'] },
            ].map(cat => (
              <div key={cat.title} className="checklist-card">
                <div className="checklist-head">{cat.title}</div>
                <div className="checklist-items">
                  {cat.items.map((item, i) => (
                    <div key={i} className="checklist-item">
                      <input type="checkbox" id={`${cat.title}-${i}`} />
                      <label htmlFor={`${cat.title}-${i}`} className="checklist-text">{item}</label>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="section faq-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">FAQ</div>
            <h2 className="s-title">Frequently Asked <span className="blue">Questions</span></h2>
          </div>
          <div className="faq-list">
            {[
              { q: 'How many platforms does this hashtag finder support?', a: 'Six-plus popular social platforms: Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads, each with its own optimization strategy and recommended hashtag count.' },
              { q: 'Are the hashtags real trending data?', a: 'For supported platforms like Twitter and LinkedIn, the tool uses real API data. For others, it provides strategically curated hashtags based on current trends and platform best practices.' },
              { q: 'Can I analyze a competitor\'s hashtags?', a: 'Yes. The competitor analysis mode lets you enter any public handle and see the hashtag strategy behind their posts, so you can find tags they use successfully that you have missed.' },
              { q: 'How do I use the generated hashtags?', a: 'Copy individual hashtags with the per-tag copy button, or use Copy All to grab the entire generated set, then paste directly into your post caption or description.' },
              { q: 'Does this tool help increase engagement?', a: 'It gives you the data needed to choose better: post counts, engagement level, and trend direction per hashtag, so you pick tags with real current traction instead of guessing from memory.' },
              { q: 'Is this hashtag finder free?', a: 'Yes, completely free with reasonable rate limits to keep the service fast for everyone. No signup, no watermark, no hashtag-count paywall.' },
            ].map(faq => (
              <details key={faq.q} className="faq-item">
                <summary>{faq.q}</summary>
                <div className="faq-answer">{faq.a}</div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* --- RELATED TOOLS --- */}
      <section className="section related-section">
        <div className="section-container">
          <div className="s-header">
            <div className="eyebrow">Free Tools</div>
            <h2 className="s-title">More Tools in the <span className="blue">SEOShouts Suite</span></h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.95rem', maxWidth: 560, marginTop: '0.75rem', lineHeight: 1.6 }}>
              Discover our complete suite of free SEO and content tools designed to help you optimize, rank, and create better content.
            </p>
          </div>
          <div className="related-tools-grid">
            {[
              { name: 'Trending Hashtag Finder', desc: 'Find viral hashtags across 6+ social media platforms with AI analysis.', current: true, href: '/tools/trending-hashtag-finder/', paths: ['M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z', 'm12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z'] },
              { name: 'AI Copywriter', desc: 'Generate high-converting copy for ads, captions, and marketing content with AI.', href: '/tools/ai-copywriter/', paths: ['M12 20h9', 'M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z'] },
              { name: 'Blog Ideas Generator', desc: 'Never run out of blog topics with AI-powered idea generation.', href: '/tools/blog-ideas-generator/', paths: ['M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'] },
              { name: 'SEO Meta Writer', desc: 'Generate compelling meta titles and descriptions with AI.', href: '/tools/seo-meta-writer/', paths: ['M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z', 'M7 7h.01'] },
              { name: 'Schema Generator', desc: 'Build structured data markup for 39+ schema types, no coding required.', href: '/tools/schema-generator/', paths: ['M12 2L2 7l10 5 10-5-10-5', 'M2 17l10 5 10-5', 'M2 12l10 5 10-5'] },
            ].map(t => (
              <div key={t.name} className={`related-card${t.current ? ' current' : ''}`}>
                <div className="related-card-icon">
                  <svg viewBox="0 0 24 24" fill="none">
                    {t.paths.map((d, i) => <path key={i} d={d} />)}
                  </svg>
                </div>
                <div className="related-card-name"><a href={t.href}>{t.name}</a></div>
                <div className="related-card-desc">{t.desc}</div>
                <div className="related-card-status">
                  <div className="related-card-status-dot" />
                  {t.current ? 'Current tool' : 'Free — no login'}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- FINAL CTA --- */}
      <div className="final-cta">
        <div className="final-cta-bg" />
        <div className="final-cta-inner">
          <h2 className="final-cta-title">Start Finding <span>Trending Hashtags Today</span></h2>
          <p className="final-cta-sub">
            Stop guessing which hashtags to use. Discover trending hashtags that actually drive engagement, reach new audiences, and grow your social presence with data-driven insights.
          </p>
          <div className="final-cta-row">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="btn-primary"
            >
              #️⃣ Use the Hashtag Finder
            </button>
            <a href="/contact/" className="btn-outline">Get Expert Help</a>
          </div>
          <div className="final-cta-pills">
            {[
              'Real-Time Data — Trending hashtags updated across 6+ platforms',
              'AI Matched — Suggestions generated from your actual content',
              'Completely Free — No signup, no rate-limited paywall',
            ].map(p => (
              <div key={p} className="final-pill">{p}</div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}
