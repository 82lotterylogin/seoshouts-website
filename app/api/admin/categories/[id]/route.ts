import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/app/lib/database';
import { UpdateCategory } from '@/app/lib/types';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    
    const category = db.prepare(`
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(id) as any;
    
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch category' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    const body: Partial<UpdateCategory> = await request.json();
    
    // Check if category exists
    const existingCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(id) as any;
    if (!existingCategory) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }
    
    // Check for name/slug conflicts with other categories
    if (body.name || body.slug) {
      const checkName = body.name || existingCategory.name;
      const checkSlug = body.slug || existingCategory.slug;
      
      const conflict = db.prepare(
        'SELECT id FROM categories WHERE (name = ? OR slug = ?) AND id != ?'
      ).get(checkName, checkSlug, id);
      
      if (conflict) {
        return NextResponse.json({ 
          success: false, 
          error: 'Category with this name or slug already exists' 
        }, { status: 400 });
      }
    }
    
    const now = new Date().toISOString();
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    Object.entries(body).forEach(([key, value]) => {
      if (value !== undefined) {
        updateFields.push(`${key} = ?`);
        // Convert boolean values to integers for SQLite
        if (key === 'noindex' || key === 'nofollow') {
          updateValues.push(value ? 1 : 0);
        } else {
          updateValues.push(value);
        }
      }
    });
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(now);
    updateValues.push(id);
    
    if (updateFields.length > 1) { // More than just updated_at
      const updateQuery = `UPDATE categories SET ${updateFields.join(', ')} WHERE id = ?`;
      db.prepare(updateQuery).run(updateValues);
    }
    
    // Fetch updated category
    const updatedCategory = db.prepare(`
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id
      WHERE c.id = ?
      GROUP BY c.id
    `).get(id) as any;
    
    return NextResponse.json({ 
      success: true, 
      data: updatedCategory,
      message: 'Category updated successfully'
    });
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update category' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    
    // Check if category exists
    const category = db.prepare('SELECT id FROM categories WHERE id = ?').get(id);
    if (!category) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category not found' 
      }, { status: 404 });
    }
    
    // Check if category has articles
    const articleCount = db.prepare('SELECT COUNT(*) as count FROM articles WHERE category_id = ?').get(id) as { count: number };
    if (articleCount.count > 0) {
      return NextResponse.json({ 
        success: false, 
        error: `Cannot delete category. It has ${articleCount.count} article(s) assigned to it.` 
      }, { status: 400 });
    }
    
    // Delete category
    db.prepare('DELETE FROM categories WHERE id = ?').run(id);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete category' 
    }, { status: 500 });
  }
}