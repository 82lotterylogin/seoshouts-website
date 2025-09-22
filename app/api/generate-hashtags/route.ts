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

// Sample hashtag database for platforms that support hashtags
const hashtagDatabase: Record<string, Record<string, string[]>> = {
  instagram: {
    general: ['instagood', 'photooftheday', 'instadaily', 'picoftheday', 'instamood', 'beautiful', 'happy', 'love', 'follow', 'like4like'],
    lifestyle: ['lifestyle', 'lifeisgood', 'blessed', 'goodvibes', 'inspiration', 'motivated', 'mindfulness', 'wellness', 'selfcare', 'positivity'],
    fitness: ['fitness', 'workout', 'gym', 'fitnessmotivation', 'training', 'muscle', 'strength', 'cardio', 'healthylifestyle', 'gains'],
    food: ['food', 'foodie', 'delicious', 'yummy', 'foodporn', 'instafood', 'cooking', 'recipe', 'healthy', 'tasty'],
    travel: ['travel', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelgram', 'instatravel', 'nature', 'beautiful', 'journey'],
    fashion: ['fashion', 'style', 'ootd', 'fashionista', 'trendy', 'outfit', 'stylish', 'fashionblogger', 'designer', 'chic'],
    tech: ['technology', 'tech', 'innovation', 'digital', 'startup', 'coding', 'programming', 'ai', 'machinelearning', 'techreview'],
    business: ['business', 'entrepreneur', 'success', 'motivation', 'leadership', 'marketing', 'growth', 'startup', 'hustle', 'networking']
  },
  twitter: {
    general: ['twitter', 'socialmedia', 'trending', 'news', 'thoughts', 'opinion', 'discussion', 'community', 'update', 'share'],
    tech: ['tech', 'programming', 'coding', 'developer', 'startup', 'ai', 'machinelearning', 'innovation', 'digital', 'blockchain'],
    business: ['business', 'entrepreneur', 'marketing', 'sales', 'leadership', 'growth', 'strategy', 'networking', 'success', 'productivity'],
    news: ['breaking', 'news', 'update', 'current', 'politics', 'world', 'local', 'happening', 'live', 'report']
  },
  youtube: {
    general: ['youtube', 'video', 'content', 'creator', 'subscribe', 'viral', 'trending', 'entertainment', 'education', 'tutorial'],
    tech: ['tech', 'technology', 'review', 'unboxing', 'gadgets', 'coding', 'programming', 'ai', 'innovation', 'tutorial'],
    business: ['business', 'entrepreneur', 'marketing', 'success', 'productivity', 'leadership', 'growth', 'strategy', 'startup', 'networking'],
    lifestyle: ['lifestyle', 'vlog', 'daily', 'motivation', 'inspiration', 'wellness', 'selfcare', 'positivity', 'mindfulness', 'growth'],
    fitness: ['fitness', 'workout', 'training', 'exercise', 'health', 'motivation', 'transformation', 'gym', 'yoga', 'nutrition'],
    food: ['food', 'cooking', 'recipe', 'baking', 'kitchen', 'chef', 'delicious', 'healthy', 'foodie', 'tutorial']
  },
  linkedin: {
    business: ['business', 'professional', 'career', 'networking', 'leadership', 'growth', 'success', 'entrepreneurship', 'marketing', 'strategy'],
    tech: ['technology', 'innovation', 'digital', 'ai', 'machinelearning', 'programming', 'startup', 'techleadership', 'coding', 'development'],
    education: ['learning', 'education', 'skills', 'development', 'training', 'knowledge', 'growth', 'mentorship', 'career', 'professional']
  },
  pinterest: {
    general: ['pinterest', 'inspiration', 'ideas', 'diy', 'creative', 'design', 'home', 'decor', 'style', 'beautiful'],
    lifestyle: ['lifestyle', 'home', 'decor', 'design', 'inspiration', 'style', 'beautiful', 'aesthetic', 'cozy', 'minimal'],
    food: ['food', 'recipe', 'cooking', 'baking', 'healthy', 'delicious', 'foodie', 'kitchen', 'homemade', 'yummy'],
    fashion: ['fashion', 'style', 'outfit', 'ootd', 'trendy', 'chic', 'vintage', 'aesthetic', 'closet', 'wardrobe'],
    travel: ['travel', 'wanderlust', 'adventure', 'vacation', 'explore', 'nature', 'beautiful', 'destination', 'trip', 'journey'],
    fitness: ['fitness', 'workout', 'health', 'wellness', 'exercise', 'motivation', 'healthy', 'strong', 'fit', 'training']
  },
  threads: {
    general: ['threads', 'discussion', 'thoughts', 'conversation', 'community', 'social', 'trending', 'update', 'share', 'connect'],
    tech: ['tech', 'technology', 'innovation', 'digital', 'ai', 'programming', 'coding', 'startup', 'development', 'future'],
    business: ['business', 'entrepreneur', 'marketing', 'success', 'leadership', 'growth', 'strategy', 'networking', 'productivity', 'mindset'],
    lifestyle: ['lifestyle', 'motivation', 'inspiration', 'wellness', 'selfcare', 'positivity', 'growth', 'mindfulness', 'balance', 'goals']
  }
};

// Generate realistic hashtag data
function generateHashtagData(tag: string, platform: string, category: string): HashtagResult {
  // Simulate difficulty based on tag popularity
  const baseWords = ['love', 'life', 'happy', 'photo', 'day', 'good', 'best', 'new', 'time', 'work'];
  const isCommon = baseWords.some(word => tag.toLowerCase().includes(word));

  let difficulty = Math.floor(Math.random() * 100);
  if (isCommon) difficulty = Math.max(70, difficulty); // Common words are harder
  if (tag.length > 15) difficulty = Math.max(20, difficulty - 30); // Longer tags are easier

  // Viral potential inverse to difficulty
  const viralPotential = Math.max(10, 100 - difficulty + Math.floor(Math.random() * 30));

  // Posts count based on difficulty
  const postsMultiplier = platform === 'instagram' ? 1000000 : platform === 'tiktok' ? 500000 : 100000;
  const posts = Math.floor((100 - difficulty) * postsMultiplier * (0.5 + Math.random()));

  // Engagement rate
  const engagementRates = ['2.1%', '3.5%', '4.2%', '5.8%', '6.1%', '7.3%', '8.9%'];
  const engagement = engagementRates[Math.floor(Math.random() * engagementRates.length)];

  // Trend
  const trends: ('rising' | 'stable' | 'falling')[] = ['rising', 'stable', 'falling'];
  const trendWeights = difficulty < 40 ? [0.5, 0.4, 0.1] : [0.2, 0.6, 0.2];
  const rand = Math.random();
  let trend: 'rising' | 'stable' | 'falling' = 'stable';
  if (rand < trendWeights[0]) trend = 'rising';
  else if (rand < trendWeights[0] + trendWeights[1]) trend = 'stable';
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

// AI-powered hashtag generation using context
function generateContextualHashtags(description: string, platform: string, category: string, language: string): string[] {
  const words = description.toLowerCase().split(/\s+/);
  const baseHashtags = hashtagDatabase[platform]?.[category] || hashtagDatabase[platform]?.general || [];

  // Extract keywords from description
  const keywords = words.filter(word =>
    word.length > 3 &&
    !['this', 'that', 'with', 'from', 'they', 'have', 'been', 'were', 'said', 'each', 'which', 'their', 'time', 'will', 'about', 'would', 'there', 'could', 'other', 'more', 'very', 'what', 'know', 'just', 'first', 'into', 'over', 'think', 'also', 'your', 'work', 'life', 'only', 'can', 'still', 'should', 'after', 'being', 'now', 'made', 'before', 'here', 'through', 'when', 'where', 'much', 'some', 'how', 'may', 'most', 'might', 'see', 'him', 'her', 'you', 'me', 'we', 'they', 'them'].includes(word)
  );

  // Generate contextual hashtags
  const contextualTags: string[] = [];

  // Add cleaned keywords as hashtags
  keywords.forEach(keyword => {
    const cleaned = keyword.replace(/[^a-zA-Z0-9]/g, '');
    if (cleaned.length > 2) {
      contextualTags.push(cleaned);
    }
  });

  // Add compound hashtags
  if (keywords.length >= 2) {
    for (let i = 0; i < Math.min(3, keywords.length - 1); i++) {
      const compound = keywords[i].replace(/[^a-zA-Z0-9]/g, '') + keywords[i + 1].replace(/[^a-zA-Z0-9]/g, '');
      if (compound.length <= 20) {
        contextualTags.push(compound);
      }
    }
  }

  // Add platform-specific base hashtags
  const platformTags = [...baseHashtags];

  // Combine and deduplicate
  const allTags = [...new Set([...contextualTags, ...platformTags])];

  // Return appropriate number based on platform
  const maxTags = platform === 'instagram' ? 20 : platform === 'tiktok' ? 15 : 8;
  return allTags.slice(0, maxTags);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, language, category, timePeriod, description } = body;

    if (!platform || !description) {
      return NextResponse.json({
        success: false,
        error: 'Platform and description are required'
      }, { status: 400 });
    }

    // Generate hashtags based on description
    const hashtags = generateContextualHashtags(description, platform, category, language);

    // Convert to HashtagResult format with analytics
    const results: HashtagResult[] = hashtags.map(tag =>
      generateHashtagData(tag, platform, category)
    );

    // Sort by viral potential and difficulty (prioritize high potential, low difficulty)
    results.sort((a, b) => {
      const scoreA = a.viralPotential - a.difficulty;
      const scoreB = b.viralPotential - b.difficulty;
      return scoreB - scoreA;
    });

    return NextResponse.json({
      success: true,
      hashtags: results,
      platform,
      category,
      language,
      total: results.length
    });

  } catch (error) {
    console.error('Error generating hashtags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate hashtags'
    }, { status: 500 });
  }
}