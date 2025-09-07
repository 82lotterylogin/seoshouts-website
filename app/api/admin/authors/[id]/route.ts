import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/app/lib/database';
import { requireAuth } from '@/app/lib/auth';
import { UpdateAuthor } from '@/app/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAuth();
    const { id } = await params;
    const db = getDatabase();
    
    const author = db.prepare(`
      SELECT 
        a.*,
        COUNT(ar.id) as article_count,
        COUNT(CASE WHEN ar.status = 'published' THEN 1 END) as published_article_count
      FROM authors a
      LEFT JOIN articles ar ON a.id = ar.author_id
      WHERE a.id = ?
      GROUP BY a.id
    `).get(id) as any;
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: author });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    console.error('Error fetching author:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch author' 
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
    const body = await request.json();
    
    // Remove id from body if it exists (shouldn't be in update data)
    if ('id' in body) {
      delete body.id;
    }
    
    // Handle slug generation/validation
    if (body.slug !== undefined) {
      let slug = body.slug?.trim();
      if (!slug && body.name) {
        // Auto-generate slug from name if slug is empty but name is provided
        slug = body.name.toLowerCase()
          .replace(/[^a-z0-9 -]/g, '') // Remove special characters
          .replace(/\s+/g, '-') // Replace spaces with hyphens
          .replace(/-+/g, '-') // Replace multiple hyphens with single
          .trim('-'); // Remove leading/trailing hyphens
      }
      
      if (slug) {
        // Check if slug conflicts with other authors
        const slugConflict = db.prepare('SELECT id FROM authors WHERE slug = ? AND id != ?').get(slug, id);
        if (slugConflict) {
          return NextResponse.json({ 
            success: false, 
            error: 'Another author with this slug already exists. Please choose a different slug.' 
          }, { status: 400 });
        }
        body.slug = slug;
      }
    }
    
    // Check if author exists
    const existingAuthor = db.prepare('SELECT * FROM authors WHERE id = ?').get(id) as any;
    if (!existingAuthor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    // Validate email if provided
    if (body.email) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(body.email)) {
        return NextResponse.json({ 
          success: false, 
          error: 'Invalid email format' 
        }, { status: 400 });
      }
      
      // Check if email conflicts with other authors
      const emailConflict = db.prepare('SELECT id FROM authors WHERE email = ? AND id != ?').get(body.email.toLowerCase(), id);
      if (emailConflict) {
        return NextResponse.json({ 
          success: false, 
          error: 'Another author with this email already exists' 
        }, { status: 400 });
      }
    }
    
    // Validate URLs if provided - be more lenient
    const urlFields = ['avatar_url', 'website_url', 'linkedin_url', 'twitter_url'];
    for (const field of urlFields) {
      if (body[field as keyof typeof body] && typeof body[field as keyof typeof body] === 'string') {
        const url = body[field as keyof typeof body] as string;
        // Only validate non-empty URLs and allow empty strings
        if (url.trim() && url.trim() !== '' && !url.match(/^https?:\/\//) && !url.startsWith('/')) {
          return NextResponse.json({ 
            success: false, 
            error: `Invalid ${field.replace('_', ' ')}: Must be a valid URL starting with http://, https://, or /` 
          }, { status: 400 });
        }
      }
    }
    
    const now = new Date().toISOString();
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === 'email' && typeof value === 'string') {
          updateFields.push(`${key} = ?`);
          updateValues.push(value.toLowerCase());
        } else if (key === 'expertise' || key === 'career_highlights') {
          // Handle JSON fields
          updateFields.push(`${key} = ?`);
          let processedValue = value;
          if (typeof value === 'string') {
            try {
              // Validate JSON string
              JSON.parse(value);
              processedValue = value;
            } catch {
              // If not valid JSON, treat as empty array
              processedValue = JSON.stringify([]);
            }
          } else if (Array.isArray(value)) {
            processedValue = JSON.stringify(value);
          } else {
            processedValue = JSON.stringify([]);
          }
          updateValues.push(processedValue);
        } else if (key === 'seo_noindex' || key === 'seo_nofollow') {
          // Handle boolean fields - convert to integers for SQLite
          updateFields.push(`${key} = ?`);
          updateValues.push(value ? 1 : 0);
        } else {
          updateFields.push(`${key} = ?`);
          updateValues.push(value);
        }
      }
    });
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(now);
    updateValues.push(id);
    
    if (updateFields.length > 1) { // More than just updated_at
      const updateQuery = `UPDATE authors SET ${updateFields.join(', ')} WHERE id = ?`;
      
      try {
        const result = db.prepare(updateQuery).run(updateValues);
      } catch (dbError) {
        console.error('Database update error:', dbError);
        throw new Error(`Database update failed: ${dbError}`);
      }
    }
    
    // Fetch updated author
    try {
      const updatedAuthor = db.prepare(`
        SELECT 
          a.*,
          COUNT(ar.id) as article_count,
          COUNT(CASE WHEN ar.status = 'published' THEN 1 END) as published_article_count
        FROM authors a
        LEFT JOIN articles ar ON a.id = ar.author_id
        WHERE a.id = ?
        GROUP BY a.id
      `).get(id) as any;
      
      if (!updatedAuthor) {
        throw new Error('Author not found after update');
      }
      
      return NextResponse.json({ 
        success: true, 
        data: updatedAuthor,
        message: 'Author updated successfully'
      });
    } catch (fetchError) {
      console.error('Error fetching updated author:', fetchError);
      throw new Error(`Failed to fetch updated author: ${fetchError}`);
    }
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    console.error('Error updating author:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Failed to update author: ${error instanceof Error ? error.message : 'Unknown error'}` 
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
    
    console.log(`DELETE author attempt - ID: ${id}, Timestamp: ${new Date().toISOString()}`);
    
    // Check if author exists
    const author = db.prepare('SELECT id FROM authors WHERE id = ?').get(id);
    console.log(`Author existence check - ID: ${id}, Found: ${!!author}`);
    
    if (!author) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author not found' 
      }, { status: 404 });
    }
    
    // Check if author has articles
    const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles WHERE author_id = ?').get(id) as { count: number };
    console.log(`Article count check - Author ID: ${id}, Count: ${articleCount.count}`);
    
    if (articleCount.count > 0) {
      console.log(`DELETE blocked - Author ${id} has ${articleCount.count} articles`);
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete author. They have ${articleCount.count} article(s) assigned to them.` 
      }, { status: 400 });
    }
    
    // Delete author
    console.log(`Attempting to delete author ${id}`);
    const deleteResult = db.prepare('DELETE FROM authors WHERE id = ?').run(id);
    console.log(`Delete result:`, deleteResult);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Author deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Authentication required') {
      return NextResponse.json({ 
        success: false, 
        error: 'Authentication required' 
      }, { status: 401 });
    }
    console.error('Error deleting author - Full error details:', {
      error: error instanceof Error ? error.message : error,
      stack: error instanceof Error ? error.stack : undefined,
      authorId: id,
      timestamp: new Date().toISOString()
    });
    return NextResponse.json({ 
      success: false, 
      error: `Failed to delete author: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}