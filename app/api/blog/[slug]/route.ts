import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const db = getDatabase();
    
    // Get published article by slug
    const article = db.prepare(`
      SELECT 
        a.*,
        auth.name as author_name,
        auth.email as author_email,
        auth.bio as author_bio,
        auth.avatar_url as author_avatar_url,
        c.name as category_name,
        c.slug as category_slug,
        c.description as category_description
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.slug = ? AND a.status = 'published'
    `).get(slug) as any;
    
    if (!article) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 });
    }
    
    // Get tags for the article
    const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(article.id) as { tag: string }[];
    
    // Get related articles from the same category (exclude current article)
    const relatedArticles = db.prepare(`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.published_at,
        auth.name as author_name,
        c.name as category_name
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.category_id = ? AND a.id != ? AND a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT 3
    `).all(article.category_id, article.id) as any[];
    
    const articleResponse = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featured_image,
      meta_title: article.meta_title,
      meta_description: article.meta_description,
      published_at: article.published_at,
      created_at: article.created_at,
      author: {
        id: article.author_id,
        name: article.author_name,
        email: article.author_email,
        bio: article.author_bio,
        avatar_url: article.author_avatar_url,
      },
      category: {
        id: article.category_id,
        name: article.category_name,
        slug: article.category_slug,
        description: article.category_description,
      },
      tags: tags.map(t => t.tag),
      related_articles: relatedArticles.map(ra => ({
        id: ra.id,
        title: ra.title,
        slug: ra.slug,
        excerpt: ra.excerpt,
        featured_image: ra.featured_image,
        published_at: ra.published_at,
        author: {
          name: ra.author_name
        },
        category: {
          name: ra.category_name
        }
      }))
    };
    
    return NextResponse.json({ success: true, data: articleResponse });
  } catch (error) {
    console.error('Error fetching blog post:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch blog post' 
    }, { status: 500 });
  }
}