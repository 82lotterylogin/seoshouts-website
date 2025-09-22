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

interface BulkResult {
  postDescription: string;
  hashtags: HashtagResult[];
}

// Hashtag database for bulk generation
const hashtagDatabase: Record<string, Record<string, string[]>> = {
  instagram: {
    general: ['instagood', 'photooftheday', 'instadaily', 'picoftheday', 'instamood', 'beautiful', 'happy', 'love', 'follow', 'like4like'],
    lifestyle: ['lifestyle', 'lifeisgood', 'blessed', 'goodvibes', 'inspiration', 'motivated', 'mindfulness', 'wellness', 'selfcare', 'positivity'],
    fitness: ['fitness', 'workout', 'gym', 'fitnessmotivation', 'training', 'muscle', 'strength', 'cardio', 'healthylifestyle', 'gains'],
    food: ['food', 'foodie', 'delicious', 'yummy', 'foodporn', 'instafood', 'cooking', 'recipe', 'healthy', 'tasty'],
    travel: ['travel', 'wanderlust', 'adventure', 'explore', 'vacation', 'travelgram', 'instatravel', 'nature', 'beautiful', 'journey'],
    fashion: ['fashion', 'style', 'ootd', 'fashionista', 'trendy', 'outfit', 'stylish', 'fashionblogger', 'designer', 'chic'],
    tech: ['technology', 'tech', 'innovation', 'digital', 'startup', 'coding', 'programming', 'ai', 'machinelearning', 'techreview'],
    business: ['business', 'entrepreneur', 'success', 'motivation', 'leadership', 'marketing', 'growth', 'startup', 'hustle', 'networking'],
    art: ['art', 'artist', 'creative', 'artwork', 'design', 'drawing', 'painting', 'illustration', 'artistic', 'creativity'],
    music: ['music', 'musician', 'song', 'singer', 'guitar', 'piano', 'concert', 'band', 'melody', 'rhythm'],
    education: ['education', 'learning', 'student', 'study', 'knowledge', 'school', 'university', 'teacher', 'academic', 'research'],
    health: ['health', 'wellness', 'medical', 'healthcare', 'doctor', 'medicine', 'healing', 'therapy', 'prevention', 'recovery'],
    beauty: ['beauty', 'makeup', 'skincare', 'cosmetics', 'beautiful', 'glam', 'makeover', 'lipstick', 'foundation', 'skincareroutine'],
    pets: ['pets', 'dog', 'cat', 'puppy', 'kitten', 'animal', 'cute', 'petlover', 'furry', 'adorable']
  }
};

// Keywords to category mapping for automatic categorization
const keywordToCategory: Record<string, string> = {
  // Fitness keywords
  'workout': 'fitness', 'gym': 'fitness', 'exercise': 'fitness', 'training': 'fitness', 'fitness': 'fitness',
  'muscle': 'fitness', 'strength': 'fitness', 'cardio': 'fitness', 'yoga': 'fitness', 'pilates': 'fitness',
  'running': 'fitness', 'cycling': 'fitness', 'swimming': 'fitness', 'marathon': 'fitness', 'crossfit': 'fitness',

  // Food keywords
  'food': 'food', 'recipe': 'food', 'cooking': 'food', 'baking': 'food', 'meal': 'food', 'dinner': 'food',
  'lunch': 'food', 'breakfast': 'food', 'restaurant': 'food', 'cuisine': 'food', 'chef': 'food', 'kitchen': 'food',
  'ingredients': 'food', 'delicious': 'food', 'tasty': 'food', 'yummy': 'food', 'nutrition': 'food',

  // Travel keywords
  'travel': 'travel', 'vacation': 'travel', 'trip': 'travel', 'journey': 'travel', 'adventure': 'travel',
  'explore': 'travel', 'destination': 'travel', 'hotel': 'travel', 'flight': 'travel', 'backpack': 'travel',
  'beach': 'travel', 'mountain': 'travel', 'city': 'travel', 'country': 'travel', 'culture': 'travel',

  // Fashion keywords
  'fashion': 'fashion', 'style': 'fashion', 'outfit': 'fashion', 'clothing': 'fashion', 'dress': 'fashion',
  'shoes': 'fashion', 'accessories': 'fashion', 'designer': 'fashion', 'trendy': 'fashion', 'chic': 'fashion',
  'casual': 'fashion', 'formal': 'fashion', 'vintage': 'fashion', 'modern': 'fashion',

  // Tech keywords
  'technology': 'tech', 'tech': 'tech', 'computer': 'tech', 'software': 'tech', 'app': 'tech', 'digital': 'tech',
  'coding': 'tech', 'programming': 'tech', 'developer': 'tech', 'startup': 'tech', 'innovation': 'tech',
  'ai': 'tech', 'artificial': 'tech', 'machine': 'tech', 'data': 'tech', 'internet': 'tech',

  // Business keywords
  'business': 'business', 'entrepreneur': 'business', 'marketing': 'business', 'sales': 'business',
  'leadership': 'business', 'management': 'business', 'strategy': 'business', 'growth': 'business',
  'success': 'business', 'professional': 'business', 'corporate': 'business', 'finance': 'business',

  // Art keywords
  'art': 'art', 'artist': 'art', 'painting': 'art', 'drawing': 'art', 'sculpture': 'art', 'creative': 'art',
  'design': 'art', 'illustration': 'art', 'gallery': 'art', 'museum': 'art', 'canvas': 'art',

  // Music keywords
  'music': 'music', 'song': 'music', 'singer': 'music', 'musician': 'music', 'band': 'music', 'concert': 'music',
  'guitar': 'music', 'piano': 'music', 'drums': 'music', 'album': 'music', 'melody': 'music',

  // Health keywords
  'health': 'health', 'medical': 'health', 'doctor': 'health', 'medicine': 'health', 'wellness': 'health',
  'therapy': 'health', 'treatment': 'health', 'healing': 'health', 'prevention': 'health',

  // Beauty keywords
  'beauty': 'beauty', 'makeup': 'beauty', 'skincare': 'beauty', 'cosmetics': 'beauty', 'facial': 'beauty',
  'lipstick': 'beauty', 'foundation': 'beauty', 'mascara': 'beauty', 'nail': 'beauty',

  // Pet keywords
  'dog': 'pets', 'cat': 'pets', 'pet': 'pets', 'puppy': 'pets', 'kitten': 'pets', 'animal': 'pets',
  'bird': 'pets', 'fish': 'pets', 'rabbit': 'pets', 'hamster': 'pets'
};

// Detect category from content description
function detectCategory(description: string): string {
  const words = description.toLowerCase().split(/\s+/);

  for (const word of words) {
    if (keywordToCategory[word]) {
      return keywordToCategory[word];
    }
  }

  return 'general'; // default category
}

// Generate contextual hashtags for a single post
function generateContextualHashtags(description: string, platform: string, category: string): string[] {
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
    for (let i = 0; i < Math.min(2, keywords.length - 1); i++) {
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
  const maxTags = platform === 'instagram' ? 15 : platform === 'tiktok' ? 12 : 8;
  return allTags.slice(0, maxTags);
}

// Generate hashtag analytics data
function generateHashtagData(tag: string, platform: string, category: string): HashtagResult {
  // Generate realistic difficulty and viral potential
  const baseWords = ['love', 'life', 'happy', 'photo', 'day', 'good', 'best', 'new', 'time', 'work'];
  const isCommon = baseWords.some(word => tag.toLowerCase().includes(word));

  let difficulty = Math.floor(Math.random() * 100);
  if (isCommon) difficulty = Math.max(70, difficulty);
  if (tag.length > 15) difficulty = Math.max(20, difficulty - 30);

  const viralPotential = Math.max(10, 100 - difficulty + Math.floor(Math.random() * 30));

  // Platform-specific metrics
  const platformMultipliers = {
    instagram: 1000000,
    tiktok: 800000,
    twitter: 200000,
    linkedin: 50000,
    youtube: 600000,
    pinterest: 400000,
    facebook: 700000
  };

  const baseMultiplier = platformMultipliers[platform as keyof typeof platformMultipliers] || 500000;
  const posts = Math.floor((100 - difficulty) * baseMultiplier * (0.3 + Math.random() * 0.7));

  const engagementRates = ['2.1%', '3.2%', '4.1%', '4.8%', '5.5%', '6.2%', '7.1%', '8.3%'];
  const engagement = engagementRates[Math.floor(Math.random() * engagementRates.length)];

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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { platform, language, category, posts } = body;

    if (!platform || !posts || !Array.isArray(posts)) {
      return NextResponse.json({
        success: false,
        error: 'Platform and posts array are required'
      }, { status: 400 });
    }

    if (posts.length === 0 || posts.length > 50) {
      return NextResponse.json({
        success: false,
        error: 'Posts array must contain 1-50 items'
      }, { status: 400 });
    }

    const bulkResults: BulkResult[] = [];

    // Process each post description
    for (const postDescription of posts) {
      if (typeof postDescription !== 'string' || !postDescription.trim()) {
        continue; // Skip invalid descriptions
      }

      // Auto-detect category if not provided or use provided category
      const detectedCategory = category === 'general' ? detectCategory(postDescription) : category;

      // Generate hashtags for this specific post
      const hashtags = generateContextualHashtags(postDescription.trim(), platform, detectedCategory);

      // Generate analytics for each hashtag
      const hashtagResults: HashtagResult[] = hashtags.map(tag =>
        generateHashtagData(tag, platform, detectedCategory)
      );

      // Sort by best potential (high viral potential, low difficulty)
      hashtagResults.sort((a, b) => {
        const scoreA = a.viralPotential - (a.difficulty * 0.5);
        const scoreB = b.viralPotential - (b.difficulty * 0.5);
        return scoreB - scoreA;
      });

      bulkResults.push({
        postDescription: postDescription.trim(),
        hashtags: hashtagResults
      });
    }

    // Calculate overall statistics
    const allHashtags = bulkResults.flatMap(result => result.hashtags);
    const totalHashtags = allHashtags.length;
    const averageDifficulty = Math.round(allHashtags.reduce((sum, h) => sum + h.difficulty, 0) / totalHashtags);
    const averageViralPotential = Math.round(allHashtags.reduce((sum, h) => sum + h.viralPotential, 0) / totalHashtags);

    return NextResponse.json({
      success: true,
      results: bulkResults,
      platform,
      language,
      category,
      statistics: {
        totalPosts: bulkResults.length,
        totalHashtags,
        averageHashtagsPerPost: Math.round(totalHashtags / bulkResults.length),
        averageDifficulty,
        averageViralPotential,
        distributionByCategory: bulkResults.reduce((acc, result) => {
          const categories = [...new Set(result.hashtags.map(h => h.category))];
          categories.forEach(cat => {
            acc[cat] = (acc[cat] || 0) + 1;
          });
          return acc;
        }, {} as Record<string, number>)
      }
    });

  } catch (error) {
    console.error('Error generating bulk hashtags:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to generate bulk hashtags'
    }, { status: 500 });
  }
}