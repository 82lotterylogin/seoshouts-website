import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const path = searchParams.get('path');
    
    if (!path) {
      return NextResponse.json({
        success: false,
        redirect: false,
        error: 'Path parameter is required'
      });
    }
    
    const db = getDatabase();
    
    // Check for exact match
    const redirection = db.prepare('SELECT * FROM redirections WHERE from_path = ?').get(path);
    
    if (redirection) {
      return NextResponse.json({
        success: true,
        redirect: true,
        to: redirection.to_path,
        statusCode: redirection.status_code,
        from: redirection.from_path
      });
    }
    
    return NextResponse.json({
      success: true,
      redirect: false
    });
    
  } catch (error) {
    console.error('Error checking redirection:', error);
    return NextResponse.json({
      success: false,
      redirect: false,
      error: 'Internal server error'
    }, { status: 500 });
  }
}