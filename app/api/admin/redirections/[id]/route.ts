import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/app/lib/database';
import { UpdateRedirection } from '@/app/lib/types';
import { updateRedirectionsCache } from '@/app/lib/redirect-cache';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    
    const redirection = db.prepare('SELECT * FROM redirections WHERE id = ?').get(id);
    
    if (!redirection) {
      return NextResponse.json({ 
        success: false, 
        error: 'Redirection not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: redirection });
  } catch (error) {
    console.error('Error fetching redirection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch redirection' 
    }, { status: 500 });
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    const body: Partial<UpdateRedirection> = await request.json();
    
    // Check if redirection exists
    const existingRedirection = db.prepare('SELECT * FROM redirections WHERE id = ?').get(id) as any;
    if (!existingRedirection) {
      return NextResponse.json({ 
        success: false, 
        error: 'Redirection not found' 
      }, { status: 404 });
    }
    
    let fromPath = body.from_path;
    const toPath = body.to_path;
    
    // Normalize from_path if provided
    if (fromPath) {
      fromPath = fromPath.trim().startsWith('/') ? fromPath.trim() : `/${fromPath.trim()}`;
      
      // Check if from_path conflicts with other redirections
      const pathConflict = db.prepare('SELECT id FROM redirections WHERE from_path = ? AND id != ?').get(fromPath, id);
      if (pathConflict) {
        return NextResponse.json({ 
          success: false, 
          error: 'A redirection for this path already exists' 
        }, { status: 400 });
      }
    }
    
    // Validate status code if provided
    if (body.status_code && ![301, 302, 307, 308].includes(body.status_code)) {
      return NextResponse.json({ 
        success: false, 
        error: 'Status code must be 301, 302, 307, or 308' 
      }, { status: 400 });
    }
    
    // Prevent circular redirects
    const finalFromPath = fromPath || existingRedirection.from_path;
    const finalToPath = toPath || existingRedirection.to_path;
    if (finalFromPath === finalToPath) {
      return NextResponse.json({ 
        success: false, 
        error: 'From path and to path cannot be the same' 
      }, { status: 400 });
    }
    
    const now = new Date().toISOString();
    
    // Build update query dynamically
    const updateFields: string[] = [];
    const updateValues: any[] = [];
    
    if (fromPath !== undefined) {
      updateFields.push('from_path = ?');
      updateValues.push(fromPath);
    }
    
    if (toPath !== undefined) {
      updateFields.push('to_path = ?');
      updateValues.push(toPath);
    }
    
    if (body.status_code !== undefined) {
      updateFields.push('status_code = ?');
      updateValues.push(body.status_code);
    }
    
    // Always update the updated_at timestamp
    updateFields.push('updated_at = ?');
    updateValues.push(now);
    updateValues.push(id);
    
    if (updateFields.length > 1) { // More than just updated_at
      const updateQuery = `UPDATE redirections SET ${updateFields.join(', ')} WHERE id = ?`;
      db.prepare(updateQuery).run(updateValues);
    }
    
    // Fetch updated redirection
    const updatedRedirection = db.prepare('SELECT * FROM redirections WHERE id = ?').get(id);
    
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
      data: updatedRedirection,
      message: 'Redirection updated successfully'
    });
  } catch (error) {
    console.error('Error updating redirection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update redirection' 
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    
    // Check if redirection exists
    const redirection = db.prepare('SELECT id FROM redirections WHERE id = ?').get(id);
    if (!redirection) {
      return NextResponse.json({ 
        success: false, 
        error: 'Redirection not found' 
      }, { status: 404 });
    }
    
    // Delete redirection
    db.prepare('DELETE FROM redirections WHERE id = ?').run(id);
    
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
      message: 'Redirection deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting redirection:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete redirection' 
    }, { status: 500 });
  }
}