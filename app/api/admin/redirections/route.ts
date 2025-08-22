import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/app/lib/database';
import { CreateRedirection } from '@/app/lib/types';
import { updateRedirectionsCache } from '@/app/lib/redirect-cache';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = (page - 1) * limit;
    
    const redirections = db.prepare(`
      SELECT * FROM redirections 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const { total } = db.prepare('SELECT COUNT(*) as total FROM redirections').get() as { total: number };
    
    return NextResponse.json({
      success: true,
      data: {
        redirections,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching redirections:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch redirections' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const body: CreateRedirection = await request.json();
    
    if (!body.from_path || body.from_path.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'From path is required' 
      }, { status: 400 });
    }
    
    if (!body.to_path || body.to_path.trim() === '') {
      return NextResponse.json({ 
        success: false, 
        error: 'To path is required' 
      }, { status: 400 });
    }
    
    // Normalize paths
    const fromPath = body.from_path.trim().startsWith('/') ? body.from_path.trim() : `/${body.from_path.trim()}`;
    const toPath = body.to_path.trim();
    
    // Validate status code
    const statusCode = body.status_code || 301;
    if (![301, 302, 307, 308].includes(statusCode)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status code must be 301, 302, 307, or 308' 
      }, { status: 400 });
    }
    
    // Check if from_path already exists
    const existingRedirection = db.prepare('SELECT id FROM redirections WHERE from_path = ?').get(fromPath);
    if (existingRedirection) {
      return NextResponse.json({ 
        success: false, 
        error: 'A redirection for this path already exists' 
      }, { status: 400 });
    }
    
    // Prevent circular redirects (basic check)
    if (fromPath === toPath) {
      return NextResponse.json({ 
        success: false, 
        error: 'From path and to path cannot be the same' 
      }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    // Insert redirection
    const result = db.prepare(`
      INSERT INTO redirections (from_path, to_path, status_code, updated_at) 
      VALUES (?, ?, ?, ?)
    `).run([fromPath, toPath, statusCode, now]);
    
    const redirectionId = result.lastInsertRowid as number;
    
    // Fetch the created redirection
    const createdRedirection = db.prepare('SELECT * FROM redirections WHERE id = ?').get(redirectionId);
    
    // Update redirections cache
    await updateRedirectionsCache();
    
    // Sync redirections to middleware
    try {
      const { exec } = require('child_process');
      exec('node scripts/sync-redirects.js', (error, stdout, stderr) => {
        if (error) {
          console.error('Error syncing redirects:', error);
        } else {
          console.log('Redirects synced to middleware');
        }
      });
    } catch (error) {
      console.error('Error executing sync script:', error);
    }
    
    return NextResponse.json({ 
      success: true, 
      data: createdRedirection,
      message: 'Redirection created successfully'
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating redirection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to create redirection' 
    }, { status: 500 });
  }
}