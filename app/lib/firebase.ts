// app/lib/firebase.ts (Working version - no external dependencies)

// Simulate realistic view counts for development
const simulateViewCount = (slug: string): number => {
  // Create consistent "fake" view counts based on slug
  let hash = 0;
  for (let i = 0; i < slug.length; i++) {
    const char = slug.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Return a number between 100 and 2000
  return Math.abs(hash % 1900) + 100;
};

export async function incrementViewCount(articleSlug: string): Promise<number> {
  // For now, just return a simulated count
  const count = simulateViewCount(articleSlug);
  console.log(`📊 View tracked for: ${articleSlug} (${count} total views)`);
  return count;
}

export async function getViewCount(articleSlug: string): Promise<number> {
  // Return consistent simulated view count
  return simulateViewCount(articleSlug);
}

export async function getMultipleViewCounts(slugs: string[]): Promise<Record<string, number>> {
  const viewCounts: Record<string, number> = {};
  
  slugs.forEach(slug => {
    viewCounts[slug] = simulateViewCount(slug);
  });
  
  console.log(`📊 Retrieved view counts for ${slugs.length} articles`);
  return viewCounts;
}
