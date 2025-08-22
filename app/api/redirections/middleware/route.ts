import { NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';

export const runtime = 'nodejs';

export async function GET() {
  try {
    const db = getDatabase();
    
    // Get all redirections from database
    const redirections = db.prepare('SELECT from_path, to_path, status_code FROM redirections').all() as Array<{
      from_path: string;
      to_path: string;
      status_code: number;
    }>;
    
    // Build response object
    const redirectMap: { [key: string]: { to: string; statusCode: number } } = {};
    redirections.forEach(redirect => {
      redirectMap[redirect.from_path] = {
        to: redirect.to_path,
        statusCode: redirect.status_code
      };
    });
    
    return NextResponse.json({
      success: true,
      redirections: redirectMap
    });
  } catch (error) {
    console.error('Error fetching redirections for middleware:', error);
    return NextResponse.json({
      success: false,
      redirections: {}
    }, { status: 500 });
  }
}