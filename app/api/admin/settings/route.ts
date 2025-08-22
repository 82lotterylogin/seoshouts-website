import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { getDatabase } from '@/app/lib/database';
import { getCurrentAdmin } from '@/app/lib/auth';

export const runtime = 'nodejs';

export async function PUT(request: NextRequest) {
  try {
    // Verify authentication
    const currentAdmin = await getCurrentAdmin();
    if (!currentAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Authentication required'
      }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newUsername, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json({
        success: false,
        error: 'Current password is required'
      }, { status: 400 });
    }

    const db = getDatabase();

    // Get current admin user from database
    const dbAdmin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(currentAdmin.id) as any;
    if (!dbAdmin) {
      return NextResponse.json({
        success: false,
        error: 'Admin user not found'
      }, { status: 404 });
    }

    // Verify current password
    const isValidPassword = await bcrypt.compare(currentPassword, dbAdmin.password_hash);
    if (!isValidPassword) {
      return NextResponse.json({
        success: false,
        error: 'Current password is incorrect'
      }, { status: 400 });
    }

    // Validate new email if provided (using as username)
    if (newUsername && newUsername.trim().length < 3) {
      return NextResponse.json({
        success: false,
        error: 'Email must be at least 3 characters long'
      }, { status: 400 });
    }

    // Validate new password if provided
    if (newPassword && newPassword.length < 8) {
      return NextResponse.json({
        success: false,
        error: 'Password must be at least 8 characters long'
      }, { status: 400 });
    }

    // Update admin user in database
    let updateQuery = 'UPDATE admin_users SET updated_at = ?';
    let updateParams: any[] = [new Date().toISOString()];

    if (newUsername?.trim()) {
      updateQuery += ', email = ?';
      updateParams.push(newUsername.trim());
    }

    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      updateQuery += ', password_hash = ?';
      updateParams.push(hashedPassword);
    }

    updateQuery += ' WHERE id = ?';
    updateParams.push(currentAdmin.id);

    db.prepare(updateQuery).run(...updateParams);

    return NextResponse.json({
      success: true,
      message: 'Admin settings updated successfully'
    });

  } catch (error) {
    console.error('Error updating admin settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to update admin settings'
    }, { status: 500 });
  }
}

export async function GET() {
  try {
    const currentAdmin = getAdminUser();
    
    return NextResponse.json({
      success: true,
      data: {
        username: currentAdmin.username
      }
    });
  } catch (error) {
    console.error('Error fetching admin settings:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch admin settings'
    }, { status: 500 });
  }
}