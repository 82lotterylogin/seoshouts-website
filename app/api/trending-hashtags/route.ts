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

// Real-time trending hashtags database for hashtag-supported platforms (simulated with current trends)
const trendingHashtags: Record<string, Record<string, { tags: string[], trending: boolean }>> = {
  instagram: {
    general: {
      tags: ['reels', 'explore', 'viral', 'trending', 'aesthetic', 'mood', 'vibes', 'content', 'creator', 'daily'],
      trending: true
    },
    lifestyle: {
      tags: ['mindfulness', 'selfcare', 'wellness', 'minimalism', 'sustainable', 'slowliving', 'intentional', 'gratitude', 'balance', 'growth'],
      trending: true
    },
    fitness: {
      tags: ['strongnotskinny', 'fitnessjourney', 'workoutmotivation', 'gains', 'transformation', 'gymlife', 'strength', 'cardio', 'yoga', 'pilates'],
      trending: true
    },
    food: {
      tags: ['plantbased', 'healthyeating', 'mealprep', 'foodie', 'homecooking', 'nutrition', 'wholesome', 'organic', 'fresh', 'delicious'],
      trending: true
    },
    travel: {
      tags: ['wanderlust', 'adventure', 'explore', 'digitalnomad', 'backpacking', 'roadtrip', 'nature', 'culture', 'authentic', 'hidden'],
      trending: true
    },
    fashion: {
      tags: ['sustainablefashion', 'vintage', 'thrifted', 'ootd', 'style', 'trendy', 'aesthetic', 'minimalist', 'boho', 'classic'],
      trending: true
    },
    tech: {
      tags: ['ai', 'machinelearning', 'blockchain', 'nft', 'crypto', 'innovation', 'startup', 'coding', 'programming', 'tech'],
      trending: true
    },
    business: {
      tags: ['entrepreneur', 'hustle', 'mindset', 'success', 'leadership', 'growth', 'marketing', 'branding', 'strategy', 'networking'],
      trending: true
    }
  },
  tiktok: {
    general: {
      tags: ['fyp', 'foryou', 'viral', 'trending', 'comedy', 'dance', 'music', 'creative', 'fun', 'entertainment'],
      trending: true
    },
    lifestyle: {
      tags: ['dayinmylife', 'lifehacks', 'aesthetic', 'selfcare', 'morning', 'routine', 'productivity', 'organization', 'motivation', 'mindset'],
      trending: true
    },
    fitness: {
      tags: ['fitnessjourney', 'workoutmotivation', 'gymtok', 'transformation', 'gains', 'strength', 'cardio', 'yoga', 'pilates', 'fitnesstips'],
      trending: true
    },
    food: {
      tags: ['foodtok', 'recipe', 'cooking', 'baking', 'foodhacks', 'easycooking', 'healthy', 'delicious', 'yummy', 'foodprep'],
      trending: true
    },
    fashion: {
      tags: ['fashion', 'ootd', 'style', 'thrift', 'outfit', 'grwm', 'aesthetic', 'trendy', 'vintage', 'fashiontips'],
      trending: true
    },
    tech: {
      tags: ['techtok', 'ai', 'coding', 'programming', 'gadgets', 'innovation', 'startup', 'digital', 'technology', 'future'],
      trending: true
    },
    business: {
      tags: ['businesstok', 'entrepreneur', 'marketing', 'success', 'mindset', 'productivity', 'girlboss', 'hustle', 'growth', 'tips'],
      trending: true
    }
  },
  twitter: {
    general: {
      tags: ['breaking', 'news', 'trending', 'viral', 'discussion', 'opinion', 'thoughts', 'community', 'update', 'share'],
      trending: true
    },
    tech: {
      tags: ['ai', 'machinelearning', 'coding', 'programming', 'startup', 'innovation', 'blockchain', 'crypto', 'tech', 'digital'],
      trending: true
    },
    business: {
      tags: ['entrepreneur', 'marketing', 'sales', 'leadership', 'growth', 'strategy', 'networking', 'success', 'business', 'productivity'],
      trending: true
    }
  },
  linkedin: {
    business: {
      tags: ['leadership', 'career', 'networking', 'growth', 'success', 'entrepreneurship', 'marketing', 'strategy', 'innovation', 'professional'],
      trending: true
    },
    tech: {
      tags: ['ai', 'machinelearning', 'innovation', 'digital', 'startup', 'techleadership', 'programming', 'coding', 'development', 'future'],
      trending: true
    }
  }
};

// Time-sensitive trending hashtags based on current events and seasons
const getTimeSensitiveTrending = (timePeriod: string): string[] => {
  const currentDate = new Date();
  const month = currentDate.getMonth();
  const trends: string[] = [];

  // Seasonal trends
  if (month >= 2 && month <= 4) { // Spring
    trends.push('spring', 'renewal', 'fresh', 'bloom', 'nature', 'outdoor', 'active');
  } else if (month >= 5 && month <= 7) { // Summer
    trends.push('summer', 'vacation', 'beach', 'travel', 'adventure', 'festival', 'outdoor');
  } else if (month >= 8 && month <= 10) { // Fall
    trends.push('fall', 'autumn', 'cozy', 'pumpkin', 'thanksgiving', 'harvest', 'warm');
  } else { // Winter
    trends.push('winter', 'holiday', 'cozy', 'warm', 'indoor', 'reflection', 'new');
  }

  // Time period specific
  if (timePeriod === '1h' || timePeriod === '6h') {
    trends.push('live', 'now', 'current', 'breaking', 'instant', 'realtime');
  } else if (timePeriod === '24h') {
    trends.push('today', 'daily', 'fresh', 'new', 'latest', 'current');
  } else if (timePeriod === '7d') {
    trends.push('weekly', 'trending', 'popular', 'viral', 'hot', 'rising');
  } else if (timePeriod === '30d') {
    trends.push('monthly', 'established', 'consistent', 'proven', 'stable', 'reliable');
  }

  return trends;
};

// Generate hashtag analytics data
function generateTrendingData(tag: string, platform: string, category: string, timePeriod: string): HashtagResult {
  // Trending hashtags generally have lower difficulty and higher viral potential
  const difficulty = Math.floor(Math.random() * 50) + 10; // 10-60 range
  const viralPotential = Math.floor(Math.random() * 40) + 60; // 60-100 range

  // Posts count varies by platform and time period
  const platformMultipliers = {
    instagram: 2000000,
    tiktok: 1500000,
    twitter: 500000,
    linkedin: 100000,
    youtube: 800000,
    pinterest: 600000,
    facebook: 1000000
  };

  const timePeriodMultipliers = {
    '1h': 0.1,
    '6h': 0.3,
    '24h': 0.7,
    '7d': 1.0,
    '30d': 1.5
  };

  const baseMultiplier = platformMultipliers[platform as keyof typeof platformMultipliers] || 500000;
  const timeMultiplier = timePeriodMultipliers[timePeriod as keyof typeof timePeriodMultipliers] || 1.0;

  const posts = Math.floor(baseMultiplier * timeMultiplier * (0.5 + Math.random()));

  // Higher engagement for trending hashtags
  const engagementRates = ['4.2%', '5.8%', '6.7%', '7.9%', '8.5%', '9.2%', '10.1%'];
  const engagement = engagementRates[Math.floor(Math.random() * engagementRates.length)];

  // Trending hashtags are more likely to be rising
  const trends: ('rising' | 'stable' | 'falling')[] = ['rising', 'stable', 'falling'];
  const rand = Math.random();
  let trend: 'rising' | 'stable' | 'falling' = 'rising';
  if (rand < 0.7) trend = 'rising';
  else if (rand < 0.9) trend = 'stable';
  else trend = 'falling';

  return {
    tag,
    difficulty,
    viralPotential,
    posts,
    engagement,
    trend,
    category
  };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, language, category, timePeriod } = body;

    if (!platform || !category) {
      return NextResponse.json({
        success: false,
        error: 'Platform and category are required'
      }, { status: 400 });
    }

    // Get base trending hashtags for platform and category
    const platformTrends = trendingHashtags[platform];
    if (!platformTrends) {
      return NextResponse.json({
        success: false,
        error: 'Platform not supported'
      }, { status: 400 });
    }

    const categoryTrends = platformTrends[category] || platformTrends.general;
    const baseTags = [...categoryTrends.tags];

    // Add time-sensitive trending hashtags
    const timeSensitive = getTimeSensitiveTrending(timePeriod);
    baseTags.push(...timeSensitive);

    // Add some cross-category trending tags for variety
    const otherCategories = Object.keys(platformTrends).filter(cat => cat !== category);
    if (otherCategories.length > 0) {
      const randomCategory = otherCategories[Math.floor(Math.random() * otherCategories.length)];
      const crossTags = platformTrends[randomCategory].tags.slice(0, 3);
      baseTags.push(...crossTags);
    }

    // Remove duplicates and limit
    const uniqueTags = [...new Set(baseTags)];
    const maxTags = platform === 'instagram' ? 25 : platform === 'tiktok' ? 20 : 15;
    const selectedTags = uniqueTags.slice(0, maxTags);

    // Generate analytics data for each hashtag
    const results: HashtagResult[] = selectedTags.map(tag =>
      generateTrendingData(tag, platform, category, timePeriod)
    );

    // Sort by viral potential (trending = high viral potential)
    results.sort((a, b) => b.viralPotential - a.viralPotential);

    return NextResponse.json({
      success: true,
      hashtags: results,
      platform,
      category,
      language,
      timePeriod,
      total: results.length,
      message: `Found ${results.length} trending hashtags for ${platform} in ${category} category`
    });

  } catch (error) {
    console.error('Error finding trending hashtags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to find trending hashtags'
    }, { status: 500 });
  }
}