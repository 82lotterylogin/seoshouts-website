// app/components/RelatedPosts.tsx
import { getDatabase } from '../lib/database';
import Link from 'next/link';
import Image from 'next/image';

async function fetchRelatedArticles(categoryId: number, currentSlug: string, limit = 3) {
  try {
    const db = getDatabase();
    
    const relatedArticles = db.prepare(`
      SELECT 
        a.id, a.title, a.slug, a.excerpt, a.featured_image, a.featured_image_alt,
        a.published_at, a.created_at,
        auth.name as author_name,
        c.name as category_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ? AND a.slug != ? AND a.status = 'published'
      ORDER BY a.published_at DESC, a.created_at DESC
      LIMIT ?
    `).all(categoryId, currentSlug, limit) as any[];
    
    return relatedArticles;
  } catch (error) {
    console.error('Error fetching related articles:', error);
    return [];
  }
}

const RelatedPosts = async ({ currentSlug, category, categorySlug, categoryId }: { currentSlug: string, category: string, categorySlug: string, categoryId: number }) => {
  const relatedPosts = await fetchRelatedArticles(categoryId, currentSlug, 3);

  if (relatedPosts.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">More {category} Articles</h2>
          <p className="text-gray-600">
            Continue exploring our latest insights
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {relatedPosts.map((post: any) => (
            <article key={post.id} className="group bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100">
              <div className="relative h-40 overflow-hidden">
                <Link href={`/blog/${post.slug}`}>
                  <Image
                    src={post.featured_image || '/placeholder-blog.jpg'}
                    alt={post.featured_image_alt || post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </Link>
                <div className="absolute top-3 left-3">
                  <span className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-medium">
                    {post.category_name}
                  </span>
                </div>
              </div>

              <div className="p-4">
                <Link href={`/blog/${post.slug}`}>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors line-clamp-2">
                    {post.title}
                  </h3>
                </Link>
                
                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                  {post.excerpt || 'Discover proven SEO strategies and insights that drive real results...'}
                </p>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-xs font-semibold text-blue-600">{post.author_name.charAt(0)}</span>
                    </div>
                    <span>{post.author_name}</span>
                  </div>
                  <span>{new Date(post.published_at || post.created_at).toLocaleDateString()}</span>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link 
            href={`/categories/${categorySlug}`}
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm hover:shadow-md no-underline"
          >
            <span>View All {category} Articles</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
