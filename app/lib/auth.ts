import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDatabase } from './database';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || (() => {
    throw new Error('JWT_SECRET environment variable is required for security');
  })()
);

// Admin credentials from environment variables
const DEFAULT_ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const DEFAULT_ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const DEFAULT_ADMIN_NAME = process.env.ADMIN_NAME || 'Administrator';

// Validate required environment variables
if (!DEFAULT_ADMIN_EMAIL || !DEFAULT_ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL and ADMIN_PASSWORD environment variables are required');
}

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  created_at: string;
}

export async function initializeAdminUser() {
  const db = getDatabase();
  
  // Create admin users table if it doesn't exist
  db.exec(`
    CREATE TABLE IF NOT EXISTS admin_users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      name TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);
  
  // Check if admin user exists
  const existingAdmin = db.prepare('SELECT id FROM admin_users WHERE email = ?').get(DEFAULT_ADMIN_EMAIL);
  
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_PASSWORD, 12);
    db.prepare(`
      INSERT INTO admin_users (email, password_hash, name) 
      VALUES (?, ?, ?)
    `).run(DEFAULT_ADMIN_EMAIL, hashedPassword, DEFAULT_ADMIN_NAME);
    
    // Only log non-sensitive information in production
    if (process.env.NODE_ENV !== 'production') {
      console.log('✅ Admin user initialized successfully');
      console.log('📧 Email:', DEFAULT_ADMIN_EMAIL);
      console.log('🔒 Use your environment ADMIN_PASSWORD to login');
    } else {
      console.log('✅ Admin user initialized for production');
    }
  }
}

export async function validateAdminCredentials(email: string, password: string): Promise<AdminUser | null> {
  const db = getDatabase();
  
  const admin = db.prepare('SELECT * FROM admin_users WHERE email = ?').get(email) as any;
  
  if (!admin) {
    return null;
  }
  
  const isValid = await bcrypt.compare(password, admin.password_hash);
  
  if (!isValid) {
    return null;
  }
  
  return {
    id: admin.id,
    email: admin.email,
    name: admin.name,
    created_at: admin.created_at
  };
}

export async function createAuthToken(user: AdminUser): Promise<string> {
  const token = await new SignJWT({ 
    userId: user.id, 
    email: user.email, 
    name: user.name 
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('24h')
    .sign(JWT_SECRET);
  
  return token;
}

export async function verifyAuthToken(token: string): Promise<AdminUser | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    
    return {
      id: payload.userId as number,
      email: payload.email as string,
      name: payload.name as string,
      created_at: ''
    };
  } catch (error) {
    return null;
  }
}

export async function setAuthCookie(token: string) {
  const cookieStore = await cookies();
  cookieStore.set('admin-auth', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  });
}

export async function getAuthCookie(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get('admin-auth')?.value || null;
}

export async function removeAuthCookie() {
  const cookieStore = await cookies();
  cookieStore.delete('admin-auth');
}

export async function getCurrentAdmin(): Promise<AdminUser | null> {
  const token = await getAuthCookie();
  
  if (!token) {
    return null;
  }
  
  return await verifyAuthToken(token);
}

export async function requireAuth(): Promise<AdminUser> {
  const admin = await getCurrentAdmin();
  
  if (!admin) {
    throw new Error('Authentication required');
  }
  
  return admin;
}

// Password strength validation
export function validatePassword(password: string): { isValid: boolean; message: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long' };
  }
  
  if (!/[A-Z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one uppercase letter' };
  }
  
  if (!/[a-z]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one lowercase letter' };
  }
  
  if (!/\d/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number' };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one special character' };
  }
  
  return { isValid: true, message: 'Password is strong' };
}

// Change admin password
export async function changeAdminPassword(adminId: number, currentPassword: string, newPassword: string): Promise<{ success: boolean; message: string }> {
  const db = getDatabase();
  
  // Validate new password
  const validation = validatePassword(newPassword);
  if (!validation.isValid) {
    return { success: false, message: validation.message };
  }
  
  // Get current admin
  const admin = db.prepare('SELECT * FROM admin_users WHERE id = ?').get(adminId) as any;
  if (!admin) {
    return { success: false, message: 'Admin user not found' };
  }
  
  // Verify current password
  const isCurrentPasswordValid = await bcrypt.compare(currentPassword, admin.password_hash);
  if (!isCurrentPasswordValid) {
    return { success: false, message: 'Current password is incorrect' };
  }
  
  // Hash new password
  const newHashedPassword = await bcrypt.hash(newPassword, 12);
  
  // Update password
  db.prepare('UPDATE admin_users SET password_hash = ?, updated_at = ? WHERE id = ?')
    .run(newHashedPassword, new Date().toISOString(), adminId);
  
  return { success: true, message: 'Password changed successfully' };
}