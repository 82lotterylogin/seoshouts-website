import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { requireAuth } from '@/app/lib/auth';
import { UpdateArticle, Article } from '@/app/lib/types';

export const runtime = 'nodejs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = getDatabase();
    
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
      WHERE a.id = ?
    `).get(id) as any;
    
    if (!article) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 });
    }
    
    // Get tags for the article
    const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(id) as { tag: string }[];
    
    const articleResponse: Article = {
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt,
      content: article.content,
      featured_image: article.featured_image,
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
    };
    
    return NextResponse.json({ success: true, data: articleResponse });
  } catch (error) {
    console.error('Error fetching article:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch article' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = getDatabase();
    const body: Partial<UpdateArticle> = await request.json();
    
    // Check if article exists
    const existingArticle = db.prepare('SELECT * FROM articles WHERE id = ?').get(id);
    if (!existingArticle) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 });
    }
    
    // If slug is being updated, check for conflicts
    if (body.slug && body.slug !== (existingArticle as any).slug) {
      const slugConflict = db.prepare('SELECT id FROM articles WHERE slug = ? AND id != ?').get(body.slug, id);
      if (slugConflict) {
        return NextResponse.json({ 
          success: false, 
          error: 'Article with this slug already exists' 
        }, { status: 400 });
      }
    }
    
    // Validate author and category if provided
    if (body.author_id) {
      const author = db.prepare('SELECT id FROM authors WHERE id = ?').get(body.author_id);
      if (!author) {
        return NextResponse.json({ 
          success: false, 
          error: 'Author not found' 
        }, { status: 400 });
      }
    }
    
    if (body.category_id) {
      const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(body.category_id);
      if (!category) {
        return NextResponse.json({ 
          success: false, 
          error: 'Category not found' 
        }, { status: 400 });
      }
    }
    
    const now = new Date().toISOString();
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    Object.entries(body).forEach(([key, value]) => {
      if (key !== 'tags' && value !== undefined) {
        updateFields.push(`${key} = ?`);
        updateValues.push(value);
      }
    });
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(now);
    
    // Handle published_at logic
    if (body.status === 'published' && !(existingArticle as any).published_at) {
      updateFields.push('published_at = ?');
      updateValues.push(body.published_at || now);
    } else if (body.status === 'draft') {
      updateFields.push('published_at = ?');
      updateValues.push(null);
    }
    
    updateValues.push(id);
    
    if (updateFields.length > 1) { // More than just updated_at
      const updateQuery = `UPDATE articles SET ${updateFields.join(', ')} WHERE id = ?`;
      db.prepare(updateQuery).run(updateValues);
    }
    
    // Update tags if provided
    if (body.tags !== undefined) {
      // Delete existing tags
      db.prepare('DELETE FROM article_tags WHERE article_id = ?').run(id);
      
      // Insert new tags
      if (body.tags.length > 0) {
        const tagInsert = db.prepare('INSERT INTO article_tags (article_id, tag) VALUES (?, ?)');
        for (const tag of body.tags) {
          tagInsert.run(id, tag.trim());
        }
      }
    }
    
    // Fetch updated article with relations
    const updatedArticle = db.prepare(`
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
      WHERE a.id = ?
    `).get(id) as any;
    
    const tags = db.prepare('SELECT tag FROM article_tags WHERE article_id = ?').all(id) as { tag: string }[];
    
    const articleResponse: Article = {
      id: updatedArticle.id,
      title: updatedArticle.title,
      slug: updatedArticle.slug,
      excerpt: updatedArticle.excerpt,
      content: updatedArticle.content,
      featured_image: updatedArticle.featured_image,
      meta_title: updatedArticle.meta_title,
      meta_description: updatedArticle.meta_description,
      author_id: updatedArticle.author_id,
      category_id: updatedArticle.category_id,
      status: updatedArticle.status,
      published_at: updatedArticle.published_at,
      created_at: updatedArticle.created_at,
      updated_at: updatedArticle.updated_at,
      author: {
        id: updatedArticle.author_id,
        name: updatedArticle.author_name,
        email: updatedArticle.author_email,
        bio: updatedArticle.author_bio,
        avatar_url: updatedArticle.author_avatar_url,
        created_at: '',
        updated_at: ''
      },
      category: {
        id: updatedArticle.category_id,
        name: updatedArticle.category_name,
        slug: updatedArticle.category_slug,
        description: updatedArticle.category_description,
        created_at: '',
        updated_at: ''
      },
      tags: tags.map(t => t.tag)
    };
    
    return NextResponse.json({ 
      success: true, 
      data: articleResponse,
      message: 'Article updated successfully'
    });
  } catch (error) {
    console.error('Error updating article:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update article' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = getDatabase();
    
    // Check if article exists
    const article = db.prepare('SELECT id FROM articles WHERE id = ?').get(id);
    if (!article) {
      return NextResponse.json({ 
        success: false, 
        error: 'Article not found' 
      }, { status: 404 });
    }
    
    // Delete article (tags will be deleted automatically due to foreign key constraints)
    db.prepare('DELETE FROM articles WHERE id = ?').run(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Article deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting article:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete article' 
    }, { status: 500 });
  }
}