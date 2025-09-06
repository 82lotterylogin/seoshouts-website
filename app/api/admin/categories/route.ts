import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { CreateCategory, Category } from '@/app/lib/types';
import { requireAuth } from '@/app/lib/auth';

export const runtime = 'nodejs';

function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)+/g, '');
}

export async function GET() {
  try {
    await requireAuth();
    const db = getDatabase();
    
    const categories = db.prepare(`
      SELECT 
        c.*,
        COUNT(a.id) as article_count
      FROM categories c
      LEFT JOIN articles a ON c.id = a.category_id AND a.status = 'published'
      GROUP BY c.id
      ORDER BY c.name ASC
    `).all() as any[];
    
    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch categories' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();
    const db = getDatabase();
    const body: CreateCategory = await request.json();
    
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Category name is required' 
      }, { status: 400 });
    }
    
    // Generate slug if not provided
    if (!body.slug) {
      body.slug = generateSlug(body.name);
    }
    
    // Check if name or slug already exists
    const existingCategory = db.prepare('SELECT id FROM categories WHERE name = ? OR slug = ?').get(body.name, body.slug);
    if (existingCategory) {
      return NextResponse.json({ 
        success: false, 
        error: 'Category with this name or slug already exists' 
      }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    // Insert category
    const result = db.prepare(`
      INSERT INTO categories (name, slug, description, meta_title, meta_description, noindex, nofollow, updated_at) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run([
      body.name.trim(),
      body.slug,
      body.description || null,
      body.meta_title || null,
      body.meta_description || null,
      body.noindex ? 1 : 0,
      body.nofollow ? 1 : 0,
      now
    ]);
    
    const categoryId = result.lastInsertRowid as number;
    
    // Fetch the created category
    const createdCategory = db.prepare('SELECT * FROM categories WHERE id = ?').get(categoryId) as Category;
    
    return NextResponse.json({ 
      success: true, 
      data: createdCategory,
      message: 'Category created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create category' 
    }, { status: 500 });
  }
}