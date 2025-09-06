import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { requireAuth } from '@/app/lib/auth';

export const runtime = 'nodejs';

export async function GET() {
  try {
    await requireAuth();
    const db = getDatabase();
    
    // Get all stats in parallel
    const [
      articlesResult,
      publishedArticlesResult,
      categoriesResult,
      authorsResult,
      imagesResult,
      redirectionsResult
    ] = await Promise.all([
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM articles').get())),
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM articles WHERE status = ?').get('published'))),
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM categories').get())),
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM authors').get())),
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM images').get())),
      new Promise(resolve => resolve(db.prepare('SELECT COUNT(*) as count FROM redirections').get()))
    ]);

    const stats = {
      articles: {
        total: (articlesResult as { count: number }).count,
        published: (publishedArticlesResult as { count: number }).count
      },
      categories: (categoriesResult as { count: number }).count,
      authors: (authorsResult as { count: number }).count,
      images: (imagesResult as { count: number }).count,
      redirections: (redirectionsResult as { count: number }).count
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    }, { status: 500 });
  }
}