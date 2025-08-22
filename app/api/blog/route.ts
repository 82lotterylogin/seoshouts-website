import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { BlogListResponse } from '@/app/lib/types';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause - only published articles
    let whereClause = 'WHERE a.status = ?';
    const params: any[] = ['published'];
    
    if (category) {
      whereClause += ' AND c.name = ?';
      params.push(category);
    }
    
    if (search) {
      whereClause += ' AND (a.title LIKE ? OR a.excerpt LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern);
    }
    
    // Get published articles with relations
    const articlesQuery = `
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.excerpt,
        a.featured_image,
        a.meta_title,
        a.meta_description,
        a.published_at,
        a.created_at,
        auth.name as author_name,
        auth.bio as author_bio,
        auth.avatar_url as author_avatar_url,
        c.name as category_name,
        c.slug as category_slug
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
      ORDER BY a.published_at DESC
      LIMIT ? OFFSET ?
    `;
    
    const articles = db.prepare(articlesQuery).all([...params, limit, offset]) as any[];
    
    // Get total count
    const countQuery = `
      SELECT COUNT(*) as total
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      ${whereClause}
    `;
    
    const { total } = db.prepare(countQuery).get(params) as { total: number };
    
    // Get tags for each article
    const articlesWithTags = articles.map(article => {
      const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(article.id) as { tag: string }[];
      
      return {
        id: article.id,
        title: article.title,
        slug: article.slug,
        excerpt: article.excerpt,
        featured_image: article.featured_image,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        published_at: article.published_at,
        created_at: article.created_at,
        author: {
          name: article.author_name,
          bio: article.author_bio,
          avatar_url: article.author_avatar_url,
        },
        category: {
          name: article.category_name,
          slug: article.category_slug,
        },
        tags: tags.map(t => t.tag)
      };
    });
    
    const response: BlogListResponse = {
      articles: articlesWithTags as any,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch blog posts' 
    }, { status: 500 });
  }
}