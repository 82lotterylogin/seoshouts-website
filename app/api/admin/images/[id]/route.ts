import { NextRequest, NextResponse } from 'next/server';
export const runtime = 'nodejs';
import { getDatabase } from '@/app/lib/database';
import { deleteUploadedFile } from '@/app/lib/upload';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const db = getDatabase();
    
    const image = db.prepare('SELECT * FROM images WHERE id = ?').get(id);
    
    if (!image) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found' 
      }, { status: 404 });
    }
    
    return NextResponse.json({ success: true, data: image });
  } catch (error) {
    console.error('Error fetching image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch image' 
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
    const body = await request.json();
    
    // Check if image exists
    const existingImage = db.prepare('SELECT * FROM images WHERE id = ?').get(id) as any;
    if (!existingImage) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found' 
      }, { status: 404 });
    }
    
    // Only allow updating alt_text for now
    if (body.alt_text !== undefined) {
      db.prepare('UPDATE images SET alt_text = ? WHERE id = ?').run(body.alt_text, id);
    }
    
    // Fetch updated image
    const updatedImage = db.prepare('SELECT * FROM images WHERE id = ?').get(id);
    
    return NextResponse.json({ 
      success: true, 
      data: updatedImage,
      message: 'Image updated successfully'
    });
  } catch (error) {
    console.error('Error updating image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to update image' 
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
    
    // Get image info before deleting
    const image = db.prepare('SELECT * FROM images WHERE id = ?').get(id) as any;
    if (!image) {
      return NextResponse.json({ 
        success: false, 
        error: 'Image not found' 
      }, { status: 404 });
    }
    
    // Delete from database first
    db.prepare('DELETE FROM images WHERE id = ?').run(id);
    
    // Try to delete physical file
    try {
      await deleteUploadedFile(image.filename);
    } catch (error) {
      console.warn('Could not delete physical file:', error);
      // Continue anyway since the database record is deleted
    }
    
    return NextResponse.json({ 
      success: true, 
      message: 'Image deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to delete image' 
    }, { status: 500 });
  }
}