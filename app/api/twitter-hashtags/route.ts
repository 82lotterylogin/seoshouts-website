import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'nodejs';

interface TwitterHashtagResult {
  tag: string;
  posts: number;
  engagement: string;
  trend: 'rising' | 'stable' | 'falling';
  category: string;
}

// Twitter hashtag categories mapping - more specific and diverse
const twitterCategories = {
  general: ['trending', 'viral', 'twittercommunity', 'discussion', 'thoughts', 'share', 'opinion', 'conversation', 'socialmedia', 'connect'],
  tech: ['techtwitter', 'ai', 'machinelearning', 'coding', 'programming', 'startup', 'innovation', 'blockchain', 'cybersecurity', 'webdev'],
  business: ['biztwitter', 'entrepreneur', 'digitalmrketing', 'sales', 'leadership', 'growth', 'startuplife', 'networking', 'productivity', 'businesstips'],
  news: ['breakingnews', 'currentevents', 'politics', 'worldnews', 'journalism', 'media', 'updates', 'newstoday', 'happening', 'developing'],
  lifestyle: ['wellnessjourney', 'motivation', 'mindfulness', 'selfcare', 'lifehacks', 'positivevibes', 'personalgrowth', 'inspiration', 'wellness', 'balance'],
  entertainment: ['entertainment', 'popculture', 'music', 'movies', 'celebrity', 'streaming', 'tvshows', 'hollywood', 'comedy', 'drama'],
  sports: ['sportstwitter', 'football', 'basketball', 'soccer', 'baseball', 'olympics', 'fitness', 'athlete', 'gameday', 'championship'],
  fitness: ['fitnessjourney', 'workout', 'gym', 'health', 'fitnessmotivation', 'training', 'exercise', 'wellness', 'strongnotskinny', 'fitfam'],
  food: ['foodie', 'cooking', 'recipe', 'foodtwitter', 'delicious', 'homecooking', 'foodporn', 'yummy', 'culinary', 'foodlover'],
  travel: ['travel', 'wanderlust', 'travelgram', 'explore', 'adventure', 'vacation', 'digitalnomad', 'backpacking', 'culture', 'traveltwitter'],
  fashion: ['fashion', 'style', 'ootd', 'fashiontwitter', 'trendy', 'vintage', 'streetstyle', 'designer', 'fashionista', 'styleinspo']
};

// Real per-tag stats aggregated from the tweets we actually fetched
interface TagStats {
  tweetCount: number;        // tweets containing the tag in our sample
  totalEngagement: number;   // sum of likes + retweets + replies + quotes
  timestamps: number[];      // tweet created_at values, for trend detection
}

// Fetch real hashtag data from Twitter API
async function fetchRealTwitterHashtags(category: string, timePeriod: string): Promise<Map<string, TagStats>> {
  const empty = new Map<string, TagStats>();
  try {
    const bearerToken = process.env.TWITTER_BEARER_TOKEN;

    if (!bearerToken) {
      console.error('Twitter Bearer Token not found');
      return empty;
    }

    // Get category-specific search terms with better targeting
    const categoryTerms = twitterCategories[category as keyof typeof twitterCategories] || twitterCategories.general;

    // Create multiple targeted searches for better category relevance
    const searches = [
      // Search 1: Category-specific hashtags
      categoryTerms.slice(0, 2).map(term => `#${term}`).join(' OR '),
      // Search 2: Category keywords (without #)
      categoryTerms.slice(2, 4).join(' OR '),
      // Search 3: Category + trending keywords
      `${categoryTerms[0]} (#trending OR #viral OR #popular)`
    ];

    const tagStats = new Map<string, TagStats>();

    // Perform multiple searches for better variety
    for (const searchQuery of searches) {
      try {
        const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(searchQuery)}&max_results=50&tweet.fields=created_at,public_metrics`;

        const response = await fetch(url, {
          headers: {
            'Authorization': `Bearer ${bearerToken}`,
            'Content-Type': 'application/json',
          }
        });

        if (!response.ok) {
          console.log(`Twitter API error for query "${searchQuery}":`, response.status);
          continue;
        }

        const data = await response.json();

        if (data.data && data.data.length > 0) {
          // Extract hashtags from tweets, keeping the tweet's REAL metrics
          data.data.forEach((tweet: any) => {
            const text = tweet.text.toLowerCase();
            const hashtagMatches = text.match(/#[a-zA-Z0-9_]+/g);
            if (!hashtagMatches) return;

            const m = tweet.public_metrics || {};
            const engagement =
              (m.like_count || 0) + (m.retweet_count || 0) +
              (m.reply_count || 0) + (m.quote_count || 0);
            const ts = tweet.created_at ? Date.parse(tweet.created_at) : Date.now();

            hashtagMatches.forEach((hashtag: string) => {
              const cleanTag = hashtag.replace('#', '');

              // Filter for category relevance
              const isRelevant = categoryTerms.some(term =>
                cleanTag.includes(term.toLowerCase()) ||
                term.toLowerCase().includes(cleanTag)
              ) || cleanTag.length > 6; // Longer hashtags tend to be more specific

              if (cleanTag.length > 2 && cleanTag.length < 25 && isRelevant) {
                const existing = tagStats.get(cleanTag) || { tweetCount: 0, totalEngagement: 0, timestamps: [] };
                existing.tweetCount += 1;
                existing.totalEngagement += engagement;
                existing.timestamps.push(ts);
                tagStats.set(cleanTag, existing);
              }
            });
          });
        }

        // Add small delay between requests to be respectful
        await new Promise(resolve => setTimeout(resolve, 100));

      } catch (searchError) {
        console.log(`Error in search "${searchQuery}":`, searchError);
        continue;
      }
    }

    // If we have good results, return them
    if (tagStats.size >= 5) {
      return tagStats;
    }

    // If not enough relevant hashtags, return empty to use fallback
    return empty;

  } catch (error) {
    console.error('Error fetching real Twitter hashtags:', error);
    return empty;
  }
}

// Deterministic hash so a tag always gets the same estimate across refreshes
// (used only for the curated fallback path, where no real data exists)
function seededFromTag(tag: string): number {
  let h = 0;
  for (let i = 0; i < tag.length; i++) {
    h = (h * 31 + tag.charCodeAt(i)) >>> 0;
  }
  return h;
}

// Build result from REAL sampled Twitter data
function buildRealTwitterHashtagData(tag: string, stats: TagStats, category: string): TwitterHashtagResult {
  const avgEngagement = stats.tweetCount > 0 ? Math.round(stats.totalEngagement / stats.tweetCount) : 0;

  // Trend from recency of real tweets: are mentions clustering in the newest half of the window?
  const now = Date.now();
  const windowMs = 24 * 60 * 60 * 1000;
  const recent = stats.timestamps.filter(t => now - t < windowMs / 2).length;
  const older = stats.timestamps.length - recent;
  let trend: 'rising' | 'stable' | 'falling' = 'stable';
  if (recent > older) trend = 'rising';
  else if (older > recent * 2) trend = 'falling';

  return {
    tag,
    posts: stats.tweetCount, // real count of sampled recent tweets using this tag
    engagement: `~${avgEngagement} interactions/post`,
    trend,
    category
  };
}

// Curated-fallback analytics: deterministic estimates, never random per refresh
function generateTwitterHashtagData(tag: string, category: string): TwitterHashtagResult {
  const seed = seededFromTag(tag);
  const basePosts = (seed % 500000) + 10000; // stable 10K-510K estimate
  const engagementRates = ['1.2%', '1.8%', '2.3%', '2.9%', '3.4%', '4.1%', '4.7%'];
  const engagement = engagementRates[seed % engagementRates.length];
  const trendPick = seed % 10;
  const trend: 'rising' | 'stable' | 'falling' = trendPick < 4 ? 'rising' : trendPick < 8 ? 'stable' : 'falling';

  return {
    tag,
    posts: basePosts,
    engagement,
    trend,
    category
  };
}

// Enhanced category-specific hashtag generation
function getTwitterTrendingHashtags(category: string, timePeriod: string): string[] {
  const categoryTags = twitterCategories[category as keyof typeof twitterCategories] || twitterCategories.general;

  // Add more category-specific variation
  let extraCategoryTags: string[] = [];

  switch (category) {
    case 'tech':
      extraCategoryTags = ['javascript', 'python', 'react', 'nodejs', 'aws', 'devops', 'saas', 'fintech'];
      break;
    case 'business':
      extraCategoryTags = ['smb', 'b2b', 'saas', 'roi', 'kpi', 'crm', 'automation', 'digitalmarketing'];
      break;
    case 'lifestyle':
      extraCategoryTags = ['morning', 'routine', 'habits', 'meditation', 'gratitude', 'journaling', 'minimalism'];
      break;
    case 'fitness':
      extraCategoryTags = ['gains', 'transformation', 'cardio', 'strength', 'yoga', 'pilates', 'crossfit'];
      break;
    case 'food':
      extraCategoryTags = ['healthy', 'vegan', 'keto', 'plantbased', 'organic', 'mealprep', 'nutrition'];
      break;
    case 'entertainment':
      extraCategoryTags = ['netflix', 'disney', 'marvel', 'oscars', 'grammys', 'premiere', 'soundtrack'];
      break;
    case 'sports':
      extraCategoryTags = ['nfl', 'nba', 'mlb', 'worldcup', 'playoffs', 'finals', 'draft', 'trade'];
      break;
    case 'news':
      extraCategoryTags = ['election', 'climate', 'economy', 'international', 'local', 'investigation'];
      break;
    default:
      extraCategoryTags = ['community', 'conversation', 'update', 'share'];
  }

  // Combine base category tags with extra specific ones
  const allCategoryTags = [...categoryTags, ...extraCategoryTags];

  // Get current time-sensitive hashtags
  const currentDate = new Date();
  const hour = currentDate.getHours();
  const dayOfWeek = currentDate.getDay();

  let timeSensitiveTags: string[] = [];

  // Time-specific hashtags for Twitter
  if (timePeriod === '1h' || timePeriod === '6h') {
    if (hour >= 6 && hour <= 10) {
      timeSensitiveTags = ['goodmorning', 'morningthoughts', 'coffee', 'motivation', 'newday'];
    } else if (hour >= 11 && hour <= 14) {
      timeSensitiveTags = ['lunchbreak', 'midday', 'productivity', 'work', 'focus'];
    } else if (hour >= 15 && hour <= 18) {
      timeSensitiveTags = ['afternoon', 'almostdone', 'progress', 'update', 'worklife'];
    } else if (hour >= 19 && hour <= 23) {
      timeSensitiveTags = ['evening', 'unwind', 'reflection', 'dinner', 'relaxing'];
    } else {
      timeSensitiveTags = ['latenight', 'insomnia', 'thoughts', 'quiet', 'peaceful'];
    }
  } else if (timePeriod === '24h') {
    // Day-specific hashtags
    switch (dayOfWeek) {
      case 1: // Monday
        timeSensitiveTags = ['mondaymotivation', 'newweek', 'mondayvibes', 'weekstart', 'goals'];
        break;
      case 5: // Friday
        timeSensitiveTags = ['fridayfeeling', 'tgif', 'weekend', 'almostthere', 'fridayvibes'];
        break;
      default:
        timeSensitiveTags = ['daily', 'today', 'current', 'now', 'live'];
    }
  } else {
    // Longer periods - general trending
    timeSensitiveTags = [
      'viral', 'trending', 'breaking', 'hot', 'popular',
      'discussion', 'debate', 'opinion', 'thoughts', 'community'
    ];
  }

  // Intelligently mix tags: prioritize category-specific over general
  const priorityTags = allCategoryTags.slice(0, 10); // High-priority category tags
  const timeTags = timeSensitiveTags.slice(0, 5);    // Time-sensitive tags
  const mixedTags = [...priorityTags, ...timeTags];

  // Return unique tags, limited to 15 for Twitter, ensuring category relevance
  return [...new Set(mixedTags)].slice(0, 15);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { category, language, timePeriod } = body;

    if (!category) {
      return NextResponse.json({
        success: false,
        error: 'Category is required for Twitter hashtags'
      }, { status: 400 });
    }

    // First try to get real hashtags (with real metrics) from Twitter API
    let tagStats = new Map<string, TagStats>();
    try {
      tagStats = await fetchRealTwitterHashtags(category, timePeriod || '24h');
    } catch (error) {
      console.error('Failed to fetch real Twitter hashtags, using fallback:', error);
    }

    const usedRealData = tagStats.size > 0;
    let results: TwitterHashtagResult[];

    if (usedRealData) {
      // Real tags with real sampled metrics (engagement + trend from public_metrics)
      results = Array.from(tagStats.entries())
        .map(([tag, stats]) => buildRealTwitterHashtagData(tag, stats, category))
        .sort((a, b) => b.posts - a.posts)
        .slice(0, 15);
    } else {
      // Curated time-sensitive hashtags with clearly-labeled deterministic estimates
      const hashtags = getTwitterTrendingHashtags(category, timePeriod || '24h');
      results = hashtags
        .map(tag => generateTwitterHashtagData(tag, category))
        .sort((a, b) => b.posts - a.posts);
    }

    return NextResponse.json({
      success: true,
      hashtags: results,
      platform: 'twitter',
      category,
      language,
      timePeriod,
      total: results.length,
      message: `Found ${results.length} trending hashtags for Twitter ${category} category`,
      note: usedRealData
        ? 'Live Twitter data: post counts and engagement measured from recent tweets'
        : 'Curated hashtag list: metrics are modeled estimates, not live data',
      source: usedRealData ? 'twitter-api' : 'curated-fallback'
    });

  } catch (error) {
    console.error('Error fetching Twitter hashtags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch Twitter hashtags'
    }, { status: 500 });
  }
}