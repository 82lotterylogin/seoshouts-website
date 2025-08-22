import { NextResponse } from 'next/server';
import { removeAuthCookie } from '@/app/lib/auth';

export const runtime = 'nodejs';

export async function POST() {
  try {
    await removeAuthCookie();
    
    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json({
      success: false,
      error: 'Logout failed'
    }, { status: 500 });
  }
}