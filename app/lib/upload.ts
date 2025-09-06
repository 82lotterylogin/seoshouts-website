import { NextRequest } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { validateUploadedFile, FileValidationConfig, logSecurityEvent } from './security';

export interface UploadedFile {
  filename: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
}

// Enhanced security configuration for file uploads
const UPLOAD_CONFIG: FileValidationConfig = {
  allowedTypes: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/webp',
    'image/gif',
  ],
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif'],
};

// Storage mode: 'filesystem' (short URLs like /uploads/filename) or 'data-url' (base64 in DB)
const STORAGE_MODE = process.env.UPLOAD_STORAGE_MODE || (process.env.VERCEL ? 'data-url' : 'filesystem');

export async function saveUploadedFile(
  file: File,
  request?: NextRequest
): Promise<UploadedFile> {
  // Enhanced file validation using security utility
  const validation = validateUploadedFile(file, UPLOAD_CONFIG);
  if (!validation.valid) {
    // Log security event for invalid file uploads
    logSecurityEvent(
      'INVALID_FILE_UPLOAD',
      {
        filename: file.name,
        type: file.type,
        size: file.size,
        error: validation.error,
      },
      request
    );

    throw new Error(validation.error);
  }

  // Additional security checks
  await performFileSecurityScan(file, request);

  // Generate unique, safe filename
  const filename = generateSafeFilename(file.name);

  // Read file buffer
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  if (STORAGE_MODE === 'filesystem') {
    // Save to /public/uploads and return a relative URL
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, filename);
    await fs.writeFile(filePath, buffer);

    const url = `/uploads/${filename}`;

    return {
      filename,
      originalName: file.name,
      mimeType: file.type,
      size: file.size,
      url,
    };
  }

  // Default: serverless data URL storage (base64)
  const base64Data = buffer.toString('base64');
  const dataUrl = `data:${file.type};base64,${base64Data}`;

  return {
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: dataUrl,
  };
}

// Helper function to generate unique, safe filename
function generateSafeFilename(originalName: string): string {
  // Sanitize filename - remove special characters and normalize
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens

  const fileExtension = path.extname(sanitized);
  const baseName = path.basename(sanitized, fileExtension);

  // Add timestamp and random ID to ensure uniqueness
  const timestamp = Date.now();
  const randomId = uuidv4().split('-')[0];

  return `${baseName}-${timestamp}-${randomId}${fileExtension}`;
}

// Security scan for uploaded files
async function performFileSecurityScan(
  file: File,
  request?: NextRequest
): Promise<void> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);

  // Check for executable file signatures (magic numbers)
  const dangerousSignatures = [
    [0x4d, 0x5a], // PE/EXE
    [0x7f, 0x45, 0x4c, 0x46], // ELF
    [0xce, 0xfa, 0xed, 0xfe], // Mach-O
    [0x50, 0x4b, 0x03, 0x04], // ZIP (could contain executables)
    [0x52, 0x61, 0x72, 0x21], // RAR
  ];

  for (const signature of dangerousSignatures) {
    if (bytes.length >= signature.length) {
      const match = signature.every((byte, index) => bytes[index] === byte);
      if (match) {
        logSecurityEvent(
          'MALICIOUS_FILE_UPLOAD_ATTEMPT',
          {
            filename: file.name,
            signature: signature.map((b) => b.toString(16)).join(' '),
          },
          request
        );
        throw new Error('File contains potentially dangerous content');
      }
    }
  }

  // Check for embedded scripts in image metadata (basic check)
  const fileContent = new TextDecoder('utf-8', { fatal: false }).decode(bytes);
  const scriptPatterns = [
    /<script/i,
    /javascript:/i,
    /vbscript:/i,
    /<iframe/i,
    /<object/i,
    /<embed/i,
  ];

  for (const pattern of scriptPatterns) {
    if (pattern.test(fileContent)) {
      logSecurityEvent(
        'SCRIPT_IN_FILE_UPLOAD',
        {
          filename: file.name,
          pattern: pattern.toString(),
        },
        request
      );
      throw new Error('File contains embedded scripts or malicious content');
    }
  }
}

export async function deleteUploadedFile(filename: string): Promise<void> {
  if (STORAGE_MODE === 'filesystem') {
    try {
      const filePath = path.join(process.cwd(), 'public', 'uploads', filename);
      await fs.unlink(filePath);
      return;
    } catch (err) {
      // File might not exist; swallow error to keep API idempotent
      console.warn('deleteUploadedFile warning:', (err as Error).message);
      return;
    }
  }
  // Data URL storage: nothing to delete
  console.log('File deletion requested for:', filename, '(data-url mode - no action needed)');
}
