import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Get all redirections for testing
    const redirections = db.prepare('SELECT * FROM redirections ORDER BY created_at DESC LIMIT 10').all();
    
    return NextResponse.json({
      success: true,
      data: redirections,
      message: 'Redirections test endpoint'
    });
  } catch (error) {
    console.error('Error in test redirections:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to test redirections'
    }, { status: 500 });
  }
}