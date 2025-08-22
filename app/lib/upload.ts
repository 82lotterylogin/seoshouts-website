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
    'image/gif'
  ],
  maxSize: 5 * 1024 * 1024, // 5MB
  allowedExtensions: ['jpg', 'jpeg', 'png', 'webp', 'gif']
};

export async function saveUploadedFile(file: File, request?: NextRequest): Promise<UploadedFile> {
  // Enhanced file validation using security utility
  const validation = validateUploadedFile(file, UPLOAD_CONFIG);
  if (!validation.valid) {
    // Log security event for invalid file uploads
    logSecurityEvent('INVALID_FILE_UPLOAD', {
      filename: file.name,
      type: file.type,
      size: file.size,
      error: validation.error
    }, request);
    
    throw new Error(validation.error);
  }
  
  // Additional security checks
  await performFileSecurityScan(file, request);
  
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  
  // Ensure upload directory exists
  try {
    await fs.access(uploadDir);
  } catch {
    await fs.mkdir(uploadDir, { recursive: true });
  }
  
  // Generate filename preserving original name with duplicate handling
  const filename = await generateUniqueFilename(file.name, uploadDir);
  const filePath = path.join(uploadDir, filename);
  
  // Save file
  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);
  await fs.writeFile(filePath, buffer);
  
  return {
    filename,
    originalName: file.name,
    mimeType: file.type,
    size: file.size,
    url: `/uploads/${filename}`
  };
}

// Helper function to generate unique filename with auto-numbering
async function generateUniqueFilename(originalName: string, uploadDir: string): Promise<string> {
  // Sanitize filename - remove special characters and normalize
  const sanitized = originalName
    .toLowerCase()
    .replace(/[^a-z0-9.\-_]/g, '-') // Replace special chars with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  
  const fileExtension = path.extname(sanitized);
  const baseName = path.basename(sanitized, fileExtension);
  
  let filename = sanitized;
  let counter = 1;
  
  // Check if file exists and add numbering if needed
  while (await fileExists(path.join(uploadDir, filename))) {
    filename = `${baseName}-${counter}${fileExtension}`;
    counter++;
  }
  
  return filename;
}

// Helper function to check if file exists
async function fileExists(filePath: string): Promise<boolean> {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

// Security scan for uploaded files
async function performFileSecurityScan(file: File, request?: NextRequest): Promise<void> {
  const buffer = await file.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  
  // Check for executable file signatures (magic numbers)
  const dangerousSignatures = [
    [0x4D, 0x5A], // PE/EXE
    [0x7F, 0x45, 0x4C, 0x46], // ELF
    [0xCE, 0xFA, 0xED, 0xFE], // Mach-O
    [0x50, 0x4B, 0x03, 0x04], // ZIP (could contain executables)
    [0x52, 0x61, 0x72, 0x21], // RAR
  ];
  
  for (const signature of dangerousSignatures) {
    if (bytes.length >= signature.length) {
      const match = signature.every((byte, index) => bytes[index] === byte);
      if (match) {
        logSecurityEvent('MALICIOUS_FILE_UPLOAD_ATTEMPT', {
          filename: file.name,
          signature: signature.map(b => b.toString(16)).join(' ')
        }, request);
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
    /<embed/i
  ];
  
  for (const pattern of scriptPatterns) {
    if (pattern.test(fileContent)) {
      logSecurityEvent('SCRIPT_IN_FILE_UPLOAD', {
        filename: file.name,
        pattern: pattern.toString()
      }, request);
      throw new Error('File contains embedded scripts or malicious content');
    }
  }
}

export async function deleteUploadedFile(filename: string): Promise<void> {
  // Security: validate filename to prevent directory traversal
  const sanitizedFilename = path.basename(filename);
  if (sanitizedFilename !== filename) {
    logSecurityEvent('DIRECTORY_TRAVERSAL_ATTEMPT', {
      originalFilename: filename,
      sanitizedFilename
    });
    throw new Error('Invalid filename');
  }
  
  const filePath = path.join(process.cwd(), 'public', 'uploads', sanitizedFilename);
  
  try {
    await fs.unlink(filePath);
  } catch (error) {
    // File might not exist, which is fine for deletion
    console.warn('Could not delete file:', filename, error);
  }
}