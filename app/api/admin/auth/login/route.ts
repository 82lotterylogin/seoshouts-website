import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createAuthToken, setAuthCookie } from '@/app/lib/auth';

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json({
        success: false,
        error: 'Email and password are required'
      }, { status: 400 });
    }

    // Validate credentials
    const admin = await validateAdminCredentials(email, password);
    
    if (!admin) {
      // Add a small delay to prevent brute force attacks
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      return NextResponse.json({
        success: false,
        error: 'Invalid email or password'
      }, { status: 401 });
    }

    // Create JWT token
    const token = await createAuthToken(admin);
    
    // Set HTTP-only cookie
    await setAuthCookie(token);

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({
      success: false,
      error: 'Login failed'
    }, { status: 500 });
  }
}