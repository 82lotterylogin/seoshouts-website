import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';

export const runtime = 'nodejs';

export async function GET() {
  try {
    console.log('Test endpoint called');
    const db = getDatabase();
    
    // Test basic database connection
    const authors = db.prepare('SELECT * FROM authors LIMIT 1').all();
    console.log('Authors found:', authors);
    
    return NextResponse.json({ 
      success: true, 
      message: 'Test endpoint working',
      data: authors
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    return NextResponse.json({ 
      success: false, 
      error: `Test failed: ${error}` 
    }, { status: 500 });
  }
}