'use client';

import React, { useState, useEffect } from 'react';
import ToolBreadcrumb from '@/app/components/ToolBreadcrumb';

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
  color: string;
  maxHashtags: number;
  popularity: number;
}

const platforms: Platform[] = [
  { id: 'instagram', name: 'Instagram', icon: '📷', color: 'from-pink-500 to-purple-600', maxHashtags: 30, popularity: 95 },
  { id: 'twitter', name: 'Twitter/X', icon: '🐦', color: 'from-blue-400 to-blue-600', maxHashtags: 10, popularity: 85 },
  { id: 'youtube', name: 'YouTube', icon: '📺', color: 'from-red-500 to-red-600', maxHashtags: 15, popularity: 90 },
  { id: 'linkedin', name: 'LinkedIn', icon: '💼', color: 'from-blue-600 to-blue-800', maxHashtags: 5, popularity: 75 },
  { id: 'pinterest', name: 'Pinterest', icon: '📌', color: 'from-red-400 to-pink-500', maxHashtags: 20, popularity: 70 },
  { id: 'threads', name: 'Threads', icon: '🧵', color: 'from-gray-800 to-black', maxHashtags: 10, popularity: 60 },
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

  return (
    <>
      {/* Tool Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-7xl mx-auto">

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Input Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-blue-600 text-lg">#️⃣</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Generate Hashtags</h2>
                </div>

                {/* Free Tool Notice */}
                <div className="mb-6 bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <div>
                      <span className="text-sm font-medium text-blue-900">100% Free • No Registration Required</span>
                      <p className="text-xs text-blue-700 mt-1">Generate unlimited hashtags for all platforms</p>
                    </div>
                  </div>
                </div>

                {/* Settings Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {/* Platform Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Platform</label>
                    <select
                      value={selectedPlatform.id}
                      onChange={(e) => setSelectedPlatform(platforms.find(p => p.id === e.target.value) || platforms[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {platforms.map((platform) => (
                        <option key={platform.id} value={platform.id}>
                          {platform.icon} {platform.name} (Max: {platform.maxHashtags})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Language Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select
                      value={selectedLanguage.code}
                      onChange={(e) => setSelectedLanguage(languages.find(l => l.code === e.target.value) || languages[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {languages.map((lang) => (
                        <option key={lang.code} value={lang.code}>
                          {lang.flag} {lang.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Category Selector */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                    <select
                      value={selectedCategory.id}
                      onChange={(e) => setSelectedCategory(categories.find(c => c.id === e.target.value) || categories[0])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      {categories.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.icon} {cat.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Time Period */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Time Period</label>
                    <select
                      value={selectedTimePeriod.id}
                      onChange={(e) => setSelectedTimePeriod(timePeriods.find(t => t.id === e.target.value) || timePeriods[2])}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                <div className="grid grid-cols-2 gap-2 mb-6">
                  {[
                    { id: 'generate', name: 'AI Generate', icon: '🤖' },
                    { id: 'trending', name: 'Trending Now', icon: '🔥' },
                    ...(selectedPlatform.id !== 'linkedin' ? [{ id: 'competitor', name: 'Competitor Analysis', icon: '🕵️' }] : []),
                    { id: 'bulk', name: 'Bulk Generate', icon: '📦' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 text-center min-h-[48px] flex items-center justify-center ${
                        activeTab === tab.id
                          ? 'bg-blue-600 text-white shadow-md'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      <span className="mr-1">{tab.icon}</span>
                      <span className="whitespace-nowrap">{tab.name}</span>
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                {activeTab === 'generate' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Describe Your Content
                      </label>
                      <textarea
                        value={contentDescription}
                        onChange={(e) => setContentDescription(e.target.value)}
                        placeholder="Describe what your post is about... (e.g., 'sunset photography at the beach', 'healthy breakfast recipe', 'workout motivation')"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={4}
                      />
                    </div>

                    <button
                      onClick={generateHashtags}
                      disabled={!contentDescription.trim() || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin inline-block w-4 h-4 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Generating AI Hashtags...
                        </>
                      ) : (
                        '🤖 Generate AI Hashtags'
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'trending' && (
                  <div className="text-center">
                    <p className="text-gray-600 mb-4">
                      Discover what's trending right now on {selectedPlatform.name} in {selectedCategory.name}
                    </p>
                    <button
                      onClick={findTrendingHashtags}
                      disabled={isLoading}
                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin inline-block w-4 h-4 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Finding Trending Hashtags...
                        </>
                      ) : (
                        '🔥 Find Trending Hashtags'
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'competitor' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Competitor Username/Handle
                      </label>
                      <input
                        type="text"
                        value={competitorHandle}
                        onChange={(e) => setCompetitorHandle(e.target.value)}
                        placeholder="Enter competitor's username (without @)"
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>

                    <button
                      onClick={analyzeCompetitor}
                      disabled={!competitorHandle.trim() || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin inline-block w-4 h-4 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Analyzing...
                        </>
                      ) : (
                        '🕵️ Analyze Competitor'
                      )}
                    </button>
                  </div>
                )}

                {activeTab === 'bulk' && (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Bulk Content Descriptions (One per line, max 50)
                      </label>
                      <textarea
                        value={bulkContent}
                        onChange={(e) => setBulkContent(e.target.value)}
                        placeholder={`Enter multiple content descriptions, one per line:\n\nSunset beach photography\nHealthy breakfast recipe\nMorning workout routine\nTravel tips for Europe\nFashion outfit inspiration`}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                        rows={6}
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        {bulkContent.split('\n').filter(line => line.trim()).length}/50 posts
                      </p>
                    </div>

                    <button
                      onClick={generateBulkHashtags}
                      disabled={!bulkContent.trim() || isLoading}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isLoading ? (
                        <>
                          <div className="animate-spin inline-block w-4 h-4 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                          Generating...
                        </>
                      ) : (
                        '📦 Generate Bulk Hashtags'
                      )}
                    </button>
                  </div>
                )}
              </div>

              {/* Results Preview Section */}
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
                <div className="flex items-center mb-6">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-green-600 text-lg">📊</span>
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Generated Hashtags</h2>
                </div>

                {results.length > 0 ? (
                  <div className="space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Found {results.length} hashtags for {selectedPlatform.name}</span>
                      <button
                        onClick={() => copyHashtags(results.map(r => r.tag))}
                        className={`px-4 py-2 text-sm rounded-lg font-semibold transition-all duration-200 ${
                          copiedIndex === -1
                            ? 'bg-green-600 text-white'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                      >
                        📋 {copiedIndex === -1 ? 'Copied!' : 'Copy All'}
                      </button>
                    </div>

                    <div className="grid grid-cols-1 gap-3 max-h-96 overflow-y-auto">
                      {results.slice(0, 10).map((result, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-3 flex justify-between items-center">
                          <div className="flex-1">
                            <span className="font-semibold text-purple-600">#{result.tag}</span>
                            <div className="text-xs text-gray-500 mt-1">
                              {result.posts.toLocaleString()} posts • {result.engagement} engagement {getTrendIcon(result.trend)}
                            </div>
                          </div>
                          <button
                            onClick={() => copyHashtags([result.tag], index)}
                            className={`px-3 py-1 text-xs rounded font-medium transition-all duration-200 ${
                              copiedIndex === index
                                ? 'bg-green-600 text-white'
                                : 'bg-blue-600 text-white hover:bg-blue-700'
                            }`}
                          >
                            {copiedIndex === index ? '✓' : 'Copy'}
                          </button>
                        </div>
                      ))}
                    </div>

                    {results.length > 10 && (
                      <p className="text-xs text-gray-500 text-center">
                        Showing first 10 results. Use "Copy All" to get all {results.length} hashtags.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-12">
                    <span className="text-4xl mb-4 block">🎯</span>
                    <p className="text-lg font-medium mb-2">No hashtags generated yet</p>
                    <p className="text-sm">Use the options on the left to generate hashtags for your content</p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Tool Breadcrumb */}
      <ToolBreadcrumb toolName="Trending Hashtag Finder" toolSlug="trending-hashtag-finder" />

      {/* Header Section */}
      <section className="bg-gradient-to-br from-blue-50 via-indigo-50 to-gray-50 py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center px-4 py-2 bg-primary/10 text-primary rounded-full font-medium mb-6">
              <span className="w-2 h-2 bg-primary rounded-full mr-2"></span>
              Free Social Media Tool
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6 leading-tight">
              <span className="bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                Advanced Hashtag Discovery Tool
              </span>
              <br />
              <span className="text-primary">6+ Platforms with Real-Time Trending Analysis</span>
            </h1>

            <div className="max-w-3xl mx-auto space-y-4 text-lg leading-relaxed text-gray-600">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">The Most Comprehensive Free Hashtag Tool Online</h2>
              <p>
                Discover viral hashtags across 6+ social media platforms with real-time trending analysis, AI-powered generation, competitor insights, and strategic optimization for maximum reach and engagement.
              </p>
              <p>
                <strong>Built for content creators, social media managers, and marketers</strong> who want to maximize their reach with data-driven hashtag strategies that actually work.
              </p>
            </div>

            <div className="flex flex-wrap justify-center gap-4 text-sm text-gray-600 mt-8">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                6+ Social Platforms
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                AI-Powered Generation
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Real-Time Trending Data
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                Competitor Analysis
              </div>
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                100% Free
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What are Hashtags Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-800">What are Hashtags (And Why Your Content Needs Them)</h2>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
              <p className="text-lg text-gray-700 leading-relaxed mb-6">
                Hashtags are like digital billboards for your content. They help categorize your posts, make them discoverable to new audiences, and connect you with communities interested in your niche. The right hashtags can dramatically increase your reach, engagement, and follower growth.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-blue-900 mb-3">🎯 Discoverability</h3>
                  <p className="text-blue-800">Help new audiences find your content through hashtag searches and feeds, expanding your reach beyond your current followers.</p>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-green-900 mb-3">📈 Engagement</h3>
                  <p className="text-green-800">Relevant hashtags can increase likes, comments, and shares by connecting your content with interested communities.</p>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-purple-900 mb-3">🏷️ Categorization</h3>
                  <p className="text-purple-800">Organize your content into topics and themes, making it easier for users to find related posts in your profile.</p>
                </div>

                <div className="bg-orange-50 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-orange-900 mb-3">🌐 Community</h3>
                  <p className="text-orange-800">Join conversations and communities around specific topics, building connections with like-minded creators and audiences.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                Revolutionary Features That Make Our Tool Stand Out
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlike other hashtag tools that give you basic suggestions, our advanced analyzer provides comprehensive insights to help you dominate social media.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  icon: "🚀",
                  title: "6+ Platform Support",
                  description: "Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads with platform-specific optimization strategies."
                },
                {
                  icon: "🔥",
                  title: "Real-Time Trending Data",
                  description: "Live trending hashtags updated continuously with time-period analysis and geographic insights for maximum relevance."
                },
                {
                  icon: "🤖",
                  title: "AI-Powered Generation",
                  description: "Advanced AI analyzes your content description to suggest the most relevant and effective hashtags for your specific niche."
                },
                {
                  icon: "🕵️",
                  title: "Competitor Intelligence",
                  description: "Analyze any competitor's hashtag strategy and discover opportunities they're missing in your industry."
                },
                {
                  icon: "🌍",
                  title: "12+ Languages",
                  description: "Multi-language support with cultural context awareness for global reach and regional trending insights."
                },
                {
                  icon: "📊",
                  title: "Engagement Analytics",
                  description: "See post counts, engagement rates, and trending patterns to choose hashtags that actually drive results."
                }
              ].map((feature, index) => (
                <div key={index} className="bg-white rounded-2xl p-8 hover:shadow-lg transition-shadow border border-gray-100">
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6">
                How to Use Our Hashtag Finder
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Follow these simple steps to discover trending hashtags and boost your social media performance
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  step: "1",
                  title: "Choose Platform",
                  description: "Select your target social media platform from Instagram, Twitter, YouTube, LinkedIn, Pinterest, or Threads.",
                  color: "blue"
                },
                {
                  step: "2",
                  title: "Set Parameters",
                  description: "Choose your language, content category, and time period for the most relevant hashtag suggestions.",
                  color: "green"
                },
                {
                  step: "3",
                  title: "Generate Hashtags",
                  description: "Use AI generation, trending discovery, competitor analysis, or bulk generation based on your needs.",
                  color: "purple"
                },
                {
                  step: "4",
                  title: "Copy & Use",
                  description: "Copy individual hashtags or the entire set and paste them into your social media posts for maximum reach.",
                  color: "orange"
                }
              ].map((step, index) => (
                <div key={index} className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-6 rounded-full bg-${step.color}-100 flex items-center justify-center`}>
                    <span className={`text-2xl font-bold text-${step.color}-600`}>{step.step}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{step.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              ))}
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
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How many platforms does this tool support?</h3>
                <p className="text-gray-600">Our hashtag finder currently supports 6+ popular social media platforms including Instagram, Twitter/X, YouTube, LinkedIn, Pinterest, and Threads, with platform-specific optimization strategies.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Are the hashtags real trending data?</h3>
                <p className="text-gray-600">Yes! For supported platforms like Twitter and LinkedIn, we use real API data. For others, we provide strategically curated hashtags based on current trends and platform best practices.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Can I analyze competitor hashtags?</h3>
                <p className="text-gray-600">Absolutely! Our competitor analysis feature lets you analyze any competitor's hashtag strategy and discover opportunities they're missing in your industry (available for most platforms).</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">How do I use the generated hashtags?</h3>
                <p className="text-gray-600">Simply copy the hashtags using our copy buttons and paste them into your social media posts. We provide both individual hashtag copying and bulk copy for all hashtags.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Does this tool help increase engagement?</h3>
                <p className="text-gray-600">Yes! Our tool provides engagement analytics and trending patterns to help you choose hashtags that actually drive results and increase your content visibility.</p>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
                <h3 className="text-lg font-semibold mb-3 text-gray-800">Is there a limit on usage?</h3>
                <p className="text-gray-600">The tool is completely free with reasonable rate limits to ensure quality service for all users. Simply refresh if you need to generate more hashtags after extensive use.</p>
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
                <div className="text-3xl mb-3">#️⃣</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Trending Hashtag Finder</h3>
                <p className="text-sm text-gray-600 mb-4">Find viral hashtags across 6+ social media platforms with AI analysis.</p>
                <span className="text-green-600 font-medium">✓ Current Tool</span>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔧</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Schema Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Generate perfect JSON-LD schema markup for any website type.</p>
                <a href="/tools/schema-generator/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>

              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-300">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="text-lg font-semibold mb-2 text-gray-800">Long Tail Keyword Generator</h3>
                <p className="text-sm text-gray-600 mb-4">Find hidden keywords that actually convert and drive traffic.</p>
                <a href="/tools/long-tail-keyword-generator/" className="text-primary font-medium hover:underline">
                  Try Tool →
                </a>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center">
              <a
                href="/tools/"
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
            <h2 className="text-3xl font-bold mb-6">Start Discovering Trending Hashtags Today</h2>
            <p className="text-lg mb-8 opacity-90">
              Stop guessing which hashtags to use. Discover trending hashtags that actually drive engagement, reach new audiences, and grow your social media presence with data-driven insights.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
              <button
                onClick={() => window.scrollTo({ top: 200, behavior: 'smooth' })}
                className="bg-white text-primary px-8 py-3 rounded-xl font-semibold hover:bg-gray-50 transition-all duration-300"
              >
                #️⃣ Use the Hashtag Finder →
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm opacity-90">
              <div className="flex items-center justify-center space-x-2">
                <span>🚀</span>
                <span>Find trending hashtags in seconds - no signup required</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>✅</span>
                <span>Real-time data from multiple social platforms</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <span>📊</span>
                <span>Increase your reach and engagement with strategic hashtags</span>
              </div>
            </div>

            <p className="text-sm mt-6 opacity-80">
              <strong>Discover viral hashtags with SEO Shouts' advanced Hashtag Finder!</strong>
              <br />
              <em>Trusted by thousands of content creators, social media managers, and marketers worldwide for effective hashtag strategies.</em>
            </p>
          </div>
        </div>
      </section>
    </>
  );
}