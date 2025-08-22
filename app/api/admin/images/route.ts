import { NextRequest, NextResponse } from 'next/server';
import { getDatabase } from '@/app/lib/database';
import { saveUploadedFile, deleteUploadedFile } from '@/app/lib/upload';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const db = getDatabase();
    const { searchParams } = new URL(request.url);
    
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const offset = (page - 1) * limit;
    
    const images = db.prepare(`
      SELECT * FROM images 
      ORDER BY created_at DESC 
      LIMIT ? OFFSET ?
    `).all(limit, offset);
    
    const { total } = db.prepare('SELECT COUNT(*) as total FROM images').get() as { total: number };
    
    return NextResponse.json({
      success: true,
      data: {
        images,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching images:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch images' 
    }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const db = getDatabase();
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const altText = formData.get('alt_text') as string;
    
    if (!file) {
      return NextResponse.json({ 
        success: false, 
        error: 'No file provided' 
      }, { status: 400 });
    }
    
    try {
      const uploadedFile = await saveUploadedFile(file);
      
      // Save to database
      const result = db.prepare(`
        INSERT INTO images (filename, original_name, mime_type, size, alt_text, url) 
        VALUES (?, ?, ?, ?, ?, ?)
      `).run([
        uploadedFile.filename,
        uploadedFile.originalName,
        uploadedFile.mimeType,
        uploadedFile.size,
        altText || null,
        uploadedFile.url
      ]);
      
      const imageId = result.lastInsertRowid as number;
      
      // Fetch the created image record
      const createdImage = db.prepare('SELECT * FROM images WHERE id = ?').get(imageId);
      
      return NextResponse.json({ 
        success: true, 
        data: createdImage,
        message: 'Image uploaded successfully'
      }, { status: 201 });
    } catch (uploadError: any) {
      return NextResponse.json({ 
        success: false, 
        error: uploadError.message || 'Failed to upload image' 
      }, { status: 400 });
    }
  } catch (error) {
    console.error('Error uploading image:', error);
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to upload image' 
    }, { status: 500 });
  }
}