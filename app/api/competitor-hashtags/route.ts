import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface HashtagResult {
  tag: string;
  difficulty: number;
  viralPotential: number;
  posts: number;
  engagement: string;
  trend: 'rising' | 'stable' | 'falling';
  category: string;
}

// Simulated competitor hashtag database
const competitorHashtags: Record<string, Record<string, string[]>> = {
  nike: {
    fitness: ['justdoit', 'nike', 'training', 'running', 'swoosh', 'nikeathletes', 'performance', 'sport', 'athlete', 'motivation'],
    lifestyle: ['lifestyle', 'streetwear', 'fashion', 'urban', 'style', 'sneakers', 'culture', 'community', 'inspire', 'movement']
  },
  adidas: {
    fitness: ['adidas', 'impossible', 'sport', 'performance', 'training', 'football', 'running', 'basketball', 'fitness', 'athlete'],
    lifestyle: ['originals', 'threelines', 'streetstyle', 'vintage', 'retro', 'sneakerhead', 'fashion', 'urban', 'culture', 'style']
  },
  apple: {
    tech: ['apple', 'iphone', 'innovation', 'design', 'technology', 'ios', 'mac', 'ipad', 'photography', 'creativity'],
    lifestyle: ['apple', 'design', 'minimalist', 'premium', 'lifestyle', 'photography', 'creative', 'innovation', 'quality', 'elegant']
  },
  samsung: {
    tech: ['samsung', 'galaxy', 'innovation', 'technology', 'android', 'smartphone', 'camera', 'display', 'performance', 'future'],
    lifestyle: ['samsung', 'lifestyle', 'innovation', 'design', 'technology', 'smart', 'connected', 'modern', 'premium', 'experience']
  },
  starbucks: {
    food: ['starbucks', 'coffee', 'latte', 'frappuccino', 'coffeelover', 'caffeine', 'barista', 'espresso', 'handcrafted', 'coffeeshop'],
    lifestyle: ['starbucks', 'coffeetime', 'moment', 'community', 'connection', 'comfort', 'ritual', 'experience', 'gathering', 'warmth']
  },
  mcdonald: {
    food: ['mcdonalds', 'bigmac', 'fries', 'fastfood', 'quick', 'tasty', 'golden', 'classic', 'convenient', 'satisfying'],
    lifestyle: ['mcdonalds', 'family', 'moments', 'together', 'fun', 'quick', 'convenient', 'affordable', 'community', 'memories']
  }
};

// Industry hashtag patterns
const industryPatterns: Record<string, string[]> = {
  fitness: ['workout', 'gym', 'training', 'fitness', 'health', 'strong', 'muscle', 'cardio', 'strength', 'gains'],
  tech: ['technology', 'innovation', 'digital', 'future', 'smart', 'ai', 'machine', 'code', 'data', 'cloud'],
  food: ['food', 'delicious', 'tasty', 'fresh', 'cooking', 'recipe', 'flavor', 'nutrition', 'healthy', 'yummy'],
  fashion: ['fashion', 'style', 'trendy', 'outfit', 'designer', 'chic', 'elegant', 'modern', 'classic', 'luxury'],
  travel: ['travel', 'adventure', 'explore', 'journey', 'destination', 'wanderlust', 'vacation', 'discover', 'culture', 'nature'],
  business: ['business', 'success', 'growth', 'leadership', 'strategy', 'innovation', 'entrepreneur', 'professional', 'corporate', 'development']
};

// Generate competitor analysis
function analyzeCompetitorHashtags(handle: string, platform: string): string[] {
  const lowerHandle = handle.toLowerCase();

  // Check if we have specific data for this competitor
  const competitorData = competitorHashtags[lowerHandle];
  if (competitorData) {
    // Return hashtags from all categories for this competitor
    const allTags: string[] = [];
    Object.values(competitorData).forEach(categoryTags => {
      allTags.push(...categoryTags);
    });
    return [...new Set(allTags)]; // Remove duplicates
  }

  // Generate hashtags based on handle and industry patterns
  const tags: string[] = [];

  // Add brand-specific hashtags
  tags.push(lowerHandle);
  tags.push(`team${lowerHandle}`);
  tags.push(`${lowerHandle}style`);
  tags.push(`${lowerHandle}life`);
  tags.push(`${lowerHandle}family`);

  // Determine likely industry based on handle characteristics
  let likelyIndustry = 'business'; // default

  if (['fit', 'gym', 'sport', 'health', 'strong'].some(word => lowerHandle.includes(word))) {
    likelyIndustry = 'fitness';
  } else if (['tech', 'digital', 'app', 'soft', 'code', 'data'].some(word => lowerHandle.includes(word))) {
    likelyIndustry = 'tech';
  } else if (['food', 'cook', 'eat', 'cafe', 'restaurant', 'kitchen'].some(word => lowerHandle.includes(word))) {
    likelyIndustry = 'food';
  } else if (['fashion', 'style', 'cloth', 'wear', 'design'].some(word => lowerHandle.includes(word))) {
    likelyIndustry = 'fashion';
  } else if (['travel', 'tour', 'trip', 'hotel', 'vacation'].some(word => lowerHandle.includes(word))) {
    likelyIndustry = 'travel';
  }

  // Add industry-specific hashtags
  const industryTags = industryPatterns[likelyIndustry] || industryPatterns.business;
  tags.push(...industryTags.slice(0, 10));

  // Add platform-specific competitor hashtags
  if (platform === 'instagram') {
    tags.push('instagood', 'photooftheday', 'instadaily', 'follow', 'like4like');
  } else if (platform === 'tiktok') {
    tags.push('fyp', 'foryou', 'viral', 'trending', 'creative');
  } else if (platform === 'twitter') {
    tags.push('trending', 'news', 'update', 'community', 'discussion');
  } else if (platform === 'linkedin') {
    tags.push('professional', 'career', 'networking', 'leadership', 'growth');
  }

  return [...new Set(tags)].slice(0, 20); // Remove duplicates and limit
}

// Generate hashtag analytics for competitor analysis
function generateCompetitorData(tag: string, platform: string, isCompetitorTag: boolean): HashtagResult {
  // Competitor hashtags tend to have higher difficulty but proven engagement
  let difficulty: number;
  let viralPotential: number;

  if (isCompetitorTag) {
    // Branded hashtags are typically harder but have loyal audiences
    difficulty = Math.floor(Math.random() * 30) + 50; // 50-80 range
    viralPotential = Math.floor(Math.random() * 40) + 40; // 40-80 range
  } else {
    // Industry hashtags vary more
    difficulty = Math.floor(Math.random() * 60) + 20; // 20-80 range
    viralPotential = Math.floor(Math.random() * 60) + 20; // 20-80 range
  }

  // Posts count based on hashtag type
  const platformMultipliers = {
    instagram: 1500000,
    tiktok: 1000000,
    twitter: 300000,
    linkedin: 80000,
    youtube: 600000,
    pinterest: 400000,
    facebook: 800000
  };

  const baseMultiplier = platformMultipliers[platform as keyof typeof platformMultipliers] || 300000;
  const competitorMultiplier = isCompetitorTag ? 2.0 : 1.0; // Competitor tags get more usage

  const posts = Math.floor(baseMultiplier * competitorMultiplier * (0.3 + Math.random() * 0.7));

  // Engagement rates for competitor hashtags tend to be more consistent
  const engagementRates = isCompetitorTag
    ? ['3.2%', '4.1%', '4.8%', '5.2%', '5.9%', '6.3%', '6.8%']
    : ['2.1%', '3.5%', '4.2%', '5.8%', '6.1%', '7.3%', '8.9%'];

  const engagement = engagementRates[Math.floor(Math.random() * engagementRates.length)];

  // Competitor hashtags tend to be more stable
  const trends: ('rising' | 'stable' | 'falling')[] = ['rising', 'stable', 'falling'];
  const stableWeight = isCompetitorTag ? 0.6 : 0.4;
  const rand = Math.random();

  let trend: 'rising' | 'stable' | 'falling' = 'stable';
  if (rand < 0.2) trend = 'rising';
  else if (rand < 0.2 + stableWeight) trend = 'stable';
  else trend = 'falling';

  return {
    tag,
    difficulty,
    viralPotential,
    posts,
    engagement,
    trend,
    category: 'competitor-analysis'
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, handle, language } = body;

    if (!platform || !handle) {
      return NextResponse.json({
        success: false,
        error: 'Platform and handle are required'
      }, { status: 400 });
    }

    // Clean the handle (remove @ symbol if present)
    const cleanHandle = handle.replace('@', '').toLowerCase().trim();

    if (!cleanHandle) {
      return NextResponse.json({
        success: false,
        error: 'Invalid handle provided'
      }, { status: 400 });
    }

    // Analyze competitor hashtags
    const hashtags = analyzeCompetitorHashtags(cleanHandle, platform);

    // Generate analytics for each hashtag
    const results: HashtagResult[] = hashtags.map((tag, index) => {
      const isCompetitorTag = index < 5; // First 5 are considered competitor-specific
      return generateCompetitorData(tag, platform, isCompetitorTag);
    });

    // Sort by a combination of viral potential and inverse difficulty
    results.sort((a, b) => {
      const scoreA = a.viralPotential - (a.difficulty * 0.5);
      const scoreB = b.viralPotential - (b.difficulty * 0.5);
      return scoreB - scoreA;
    });

    return NextResponse.json({
      success: true,
      hashtags: results,
      competitor: cleanHandle,
      platform,
      language,
      total: results.length,
      analysis: {
        brandedHashtags: results.filter(r => r.tag.includes(cleanHandle)).length,
        industryHashtags: results.filter(r => !r.tag.includes(cleanHandle)).length,
        averageDifficulty: Math.round(results.reduce((sum, r) => sum + r.difficulty, 0) / results.length),
        averageViralPotential: Math.round(results.reduce((sum, r) => sum + r.viralPotential, 0) / results.length)
      }
    });

  } catch (error) {
    console.error('Error analyzing competitor hashtags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to analyze competitor hashtags'
    }, { status: 500 });
  }
}