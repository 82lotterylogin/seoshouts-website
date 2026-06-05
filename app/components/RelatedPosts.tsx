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
    <section className="ba-related-section">
      <div className="ba-related-inner">
        <div className="ba-related-head">
          <div>
            <div className="ba-related-eyebrow">More {category} Articles</div>
            <h2>Continue exploring our latest insights</h2>
            <p>Hand-picked reads on {category.toLowerCase()} and the future of search.</p>
          </div>
          <Link href={`/categories/${categorySlug}`} className="ba-related-cta">
            View All {category} Articles
            <svg width={14} height={14} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
          </Link>
        </div>

        <div className="ba-related-grid">
          {relatedPosts.map((post: any) => (
            <article key={post.id} className="ba-related-card">
              <div className="ba-related-img">
                <Image
                  src={post.featured_image || '/placeholder-blog.jpg'}
                  alt={post.featured_image_alt || post.title}
                  fill
                  className="object-cover"
                  style={{ objectFit: 'cover' }}
                />
              </div>
              <div className="ba-related-body">
                <div><span className="ba-related-cat">{post.category_name}</span></div>
                <h3><Link href={`/blog/${post.slug}`}>{post.title}</Link></h3>
                <p>{(() => { const t = post.excerpt || 'Discover proven SEO strategies and insights that drive real results.'; return t.length > 150 ? t.slice(0, 150).trimEnd() + '…' : t; })()}</p>
                <div className="ba-related-footer">
                  <span className="ba-related-av">{post.author_name.charAt(0)}</span>
                  <span className="ba-related-nm">{post.author_name}</span>
                  <span className="ba-related-dt">
                    {new Date(post.published_at || post.created_at).toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' })}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RelatedPosts;
