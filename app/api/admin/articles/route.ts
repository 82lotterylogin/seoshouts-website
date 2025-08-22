import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { requireAuth } from '@/app/lib/auth';
import { CreateArticle, Article, ApiResponse, BlogListResponse } from '@/app/lib/types';

export const runtime = 'nodejs';

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET(request: NextRequest) {
  try {
    await requireAuth();
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const category = searchParams.get('category');
    const author = searchParams.get('author');
    const search = searchParams.get('search');
    
    const offset = (page - 1) * limit;
    
    // Build WHERE clause
    let whereClause = 'WHERE 1=1';
    const params: any[] = [];
    
    if (status) {
      whereClause += ' AND a.status = ?';
      params.push(status);
    }
    
    if (category) {
      whereClause += ' AND c.slug = ?';
      params.push(category);
    }
    
    if (author) {
      whereClause += ' AND auth.id = ?';
      params.push(parseInt(author));
    }
    
    if (search) {
      whereClause += ' AND (a.title LIKE ? OR a.content LIKE ? OR a.excerpt LIKE ?)';
      const searchPattern = `%${search}%`;
      params.push(searchPattern, searchPattern, searchPattern);
    }
    
    // Get articles with relations
    const articlesQuery = `
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
      ${whereClause}
      ORDER BY a.created_at DESC
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
        content: article.content,
        featured_image: article.featured_image,
        featured_image_alt: article.featured_image_alt,
        meta_title: article.meta_title,
        meta_description: article.meta_description,
        author_id: article.author_id,
        category_id: article.category_id,
        status: article.status,
        published_at: article.published_at,
        created_at: article.created_at,
        updated_at: article.updated_at,
        author: {
          id: article.author_id,
          name: article.author_name,
          email: article.author_email,
          bio: article.author_bio,
          avatar_url: article.author_avatar_url,
          created_at: '',
          updated_at: ''
        },
        category: {
          id: article.category_id,
          name: article.category_name,
          slug: article.category_slug,
          description: article.category_description,
          created_at: '',
          updated_at: ''
        },
        tags: tags.map(t => t.tag)
      } as Article;
    });
    
    const response: BlogListResponse = {
      articles: articlesWithTags,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit)
    };
    
    return NextResponse.json({ success: true, data: response });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch articles' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const db = getDatabase();
    const body: CreateArticle = await request.json();
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.title);
    }
    
    // Check if slug already exists
    const existingArticle = db.prepare('SELECT id FROM articles WHERE slug = ?').get(body.slug);
    if (existingArticle) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article with this slug already exists' 
      }, { status: 400 });
    }
    
    // Validate author and category exist
    const author = db.prepare('SELECT id FROM authors WHERE id = ?').get(body.author_id);
    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(body.category_id);
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 400 });
    }
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    const publishedAt = body.status === 'published' ? (body.published_at || now) : null;
    
    // Insert article
    const result = db.prepare(`
      INSERT INTO articles (
        title, slug, excerpt, content, featured_image, featured_image_alt, meta_title, meta_description,
        author_id, category_id, status, published_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run([
      body.title,
      body.slug,
      body.excerpt || null,
      body.content,
      body.featured_image || null,
      body.featured_image_alt || null,
      body.meta_title || null,
      body.meta_description || null,
      body.author_id,
      body.category_id,
      body.status || 'draft',
      publishedAt,
      now
    ]);
    
    const articleId = result.lastInsertRowid as number;
    
    // Insert tags if provided
    if (body.tags && body.tags.length > 0) {
      const tagInsert = db.prepare('INSERT INTO article_tags (article_id, tag) VALUES (?, ?)');
      for (const tag of body.tags) {
        tagInsert.run(articleId, tag.trim());
      }
    }
    
    // Fetch the created article with relations
    const createdArticle = db.prepare(`
      SELECT 
        a.*,
        auth.name as author_name,
        auth.email as author_email,
        c.name as category_name,
        c.slug as category_slug
      FROM articles a
      JOIN authors auth ON a.author_id = auth.id
      JOIN categories c ON a.category_id = c.id
      WHERE a.id = ?
    `).get(articleId) as any;
    
    const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(articleId) as { tag: string }[];
    
    const articleResponse = {
      ...createdArticle,
      author: {
        id: createdArticle.author_id,
        name: createdArticle.author_name,
        email: createdArticle.author_email
      },
      category: {
        id: createdArticle.category_id,
        name: createdArticle.category_name,
        slug: createdArticle.category_slug
      },
      tags: tags.map(t => t.tag)
    };
    
    return NextResponse.json({ 
      success: true, 
      data: articleResponse,
      message: 'Article created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create article' 
    }, { status: 500 });
  }
}