import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { CreateAuthor } from '@/app/lib/types';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();
    
    const authors = db.prepare(`
      SELECT 
        a.*,
        COUNT(ar.id) as article_count,
        COUNT(CASE WHEN ar.status = 'published' THEN 1 END) as published_article_count
      FROM authors a
      LEFT JOIN articles ar ON a.id = ar.author_id
      GROUP BY a.id
      ORDER BY a.name ASC
    `).all() as any[];
    
    return NextResponse.json({ success: true, data: authors });
  } catch (error) {
    console.error('Error fetching authors:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch authors' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const body: CreateAuthor = await request.json();
    
    if (!body.name || body.name.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Author name is required' 
      }, { status: 400 });
    }
    
    if (!body.email || body.email.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'Author email is required' 
      }, { status: 400 });
    }
    
    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Invalid email format' 
      }, { status: 400 });
    }
    
    // Check if email already exists
    const existingAuthor = db.prepare('SELECT id FROM authors WHERE email = ?').get(body.email);
    if (existingAuthor) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author with this email already exists' 
      }, { status: 400 });
    }
    
    // Validate URLs if provided
    const urlFields = ['avatar_url', 'website_url', 'linkedin_url', 'twitter_url'];
    for (const field of urlFields) {
      if (body[field as keyof typeof body] && typeof body[field as keyof typeof body] === 'string') {
        const url = body[field as keyof typeof body] as string;
        if (url.trim() && !url.match(/^https?:\/\//) && !url.startsWith('/')) {
          return NextResponse.json({ 
            success: false, 
            error: `Invalid ${field.replace('_', ' ')}: Must be a valid URL starting with http://, https://, or /` 
          }, { status: 400 });
        }
      }
    }
    
    const now = new Date().toISOString();
    
    // Generate slug if not provided
    let slug = body.slug?.trim();
    if (!slug) {
      slug = body.name.toLowerCase()
        .replace(/[^a-z0-9 -]/g, '') // Remove special characters
        .replace(/\s+/g, '-') // Replace spaces with hyphens
        .replace(/-+/g, '-') // Replace multiple hyphens with single
        .trim('-'); // Remove leading/trailing hyphens
    }
    
    // Check if slug already exists
    const existingSlug = db.prepare('SELECT id FROM authors WHERE slug = ?').get(slug);
    if (existingSlug) {
      return NextResponse.json({ 
        success: false, 
        error: 'Author with this slug already exists. Please choose a different slug.' 
      }, { status: 400 });
    }
    
    // Insert author
    const result = db.prepare(`
      INSERT INTO authors (
        name, slug, email, bio, avatar_url, avatar_alt_text, job_title, location, phone, 
        linkedin_url, twitter_url, website_url, company, expertise, 
        career_highlights, education, meta_title, meta_description, 
        custom_schema, seo_noindex, seo_nofollow, updated_at
      ) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run([
      body.name.trim(),
      slug,
      body.email.trim().toLowerCase(),
      body.bio || null,
      body.avatar_url || null,
      body.avatar_alt_text || null,
      body.job_title || null,
      body.location || null,
      body.phone || null,
      body.linkedin_url || null,
      body.twitter_url || null,
      body.website_url || null,
      body.company || null,
      body.expertise ? (Array.isArray(body.expertise) ? JSON.stringify(body.expertise) : body.expertise) : null,
      body.career_highlights ? (Array.isArray(body.career_highlights) ? JSON.stringify(body.career_highlights) : body.career_highlights) : null,
      body.education || null,
      body.meta_title || null,
      body.meta_description || null,
      body.custom_schema || null,
      body.seo_noindex ? 1 : 0,
      body.seo_nofollow ? 1 : 0,
      now
    ]);
    
    const authorId = result.lastInsertRowid as number;
    
    // Fetch the created author
    const createdAuthor = db.prepare('SELECT * FROM authors WHERE id = ?').get(authorId);
    
    return NextResponse.json({ 
      success: true, 
      data: createdAuthor,
      message: 'Author created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating author:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create author' 
    }, { status: 500 });
  }
}