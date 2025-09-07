// Security utilities and configurations
import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';

// Rate limiting storage (in production, use Redis or database)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export interface RateLimitConfig {
  windowMs: number; // Time window in milliseconds
  maxRequests: number; // Max requests per window
  message?: string;
}

// Rate limiting function
export async function rateLimit(
  request: NextRequest, 
  config: RateLimitConfig
): Promise<{ success: boolean; error?: string; remainingRequests?: number }> {
  const ip = request.ip || 
    request.headers.get('x-forwarded-for') || 
    request.headers.get('x-real-ip') || 
    'unknown';
  
  const key = `${ip}:${request.url}`;
  const now = Date.now();
  const windowStart = now - config.windowMs;
  
  // Get or create rate limit entry
  let entry = rateLimitMap.get(key);
  if (!entry || entry.resetTime < windowStart) {
    entry = { count: 0, resetTime: now + config.windowMs };
    rateLimitMap.set(key, entry);
  }
  
  // Check if limit exceeded
  if (entry.count >= config.maxRequests) {
    return {
      success: false,
      error: config.message || 'Too many requests. Please try again later.',
      remainingRequests: 0
    };
  }
  
  // Increment count
  entry.count++;
  
  return {
    success: true,
    remainingRequests: config.maxRequests - entry.count
  };
}

// Security headers
export function getSecurityHeaders(): Record<string, string> {
  return {
    // Prevent XSS attacks
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    
    // Content Security Policy
    'Content-Security-Policy': [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' *.google.com *.gstatic.com *.googleapis.com cdn.tiny.cloud *.tiny.cloud",
      "style-src 'self' 'unsafe-inline' *.googleapis.com *.gstatic.com cdn.tiny.cloud *.tiny.cloud",
      "img-src 'self' data: blob: *.google.com *.gstatic.com *.storyblok.com cdn.tiny.cloud *.tiny.cloud",
      "font-src 'self' *.googleapis.com *.gstatic.com cdn.tiny.cloud *.tiny.cloud",
      "connect-src 'self' *.google.com *.googleapis.com *.storyblok.com *.sendinblue.com *.brevo.com api.brevo.com cdn.tiny.cloud *.tiny.cloud",
      "frame-src 'self' *.google.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'"
    ].join('; '),
    
    // HSTS (force HTTPS)
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload',
    
    // Referrer policy
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    
    // Permissions policy
    'Permissions-Policy': [
      'camera=()',
      'microphone=()',
      'geolocation=()',
      'interest-cohort=()'
    ].join(', ')
  };
}

// Input validation and sanitization - Deprecated, use sanitizeFormInput instead
export function sanitizeInput(input: string): string {
  return sanitizeFormInput(input);
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
}

export function validateUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// File validation for uploads
export interface FileValidationConfig {
  allowedTypes: string[];
  maxSize: number; // in bytes
  allowedExtensions: string[];
}

export function validateUploadedFile(
  file: File, 
  config: FileValidationConfig
): { valid: boolean; error?: string } {
  // Check file type
  if (!config.allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${config.allowedTypes.join(', ')}`
    };
  }
  
  // Check file size
  if (file.size > config.maxSize) {
    return {
      valid: false,
      error: `File size ${Math.round(file.size / 1024 / 1024 * 100) / 100}MB exceeds maximum allowed size of ${Math.round(config.maxSize / 1024 / 1024)}MB`
    };
  }
  
  // Check file extension
  const extension = file.name.split('.').pop()?.toLowerCase();
  if (!extension || !config.allowedExtensions.includes(extension)) {
    return {
      valid: false,
      error: `File extension .${extension} is not allowed. Allowed extensions: ${config.allowedExtensions.join(', ')}`
    };
  }
  
  return { valid: true };
}

// Audit logging
export function logSecurityEvent(event: string, details: any, request?: NextRequest) {
  const timestamp = new Date().toISOString();
  const ip = request?.ip || request?.headers.get('x-forwarded-for') || 'unknown';
  const userAgent = request?.headers.get('user-agent') || 'unknown';
  
  const logEntry = {
    timestamp,
    event,
    ip,
    userAgent,
    details
  };
  
  // In production, send to proper logging service
  console.warn('🛡️ SECURITY EVENT:', JSON.stringify(logEntry, null, 2));
}

// HTML Sanitization for XSS Prevention (Edge Runtime Compatible)
export function sanitizeHTML(html: string): string {
  if (!html || typeof html !== 'string') return '';
  
  // Basic HTML sanitization without DOM dependencies
  // This is a fallback for environments without DOM access
  let cleanHTML = html;
  
  // Remove dangerous scripts and elements
  cleanHTML = cleanHTML.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
  cleanHTML = cleanHTML.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '');
  cleanHTML = cleanHTML.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '');
  cleanHTML = cleanHTML.replace(/<embed\b[^<]*>/gi, '');
  cleanHTML = cleanHTML.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, '');
  cleanHTML = cleanHTML.replace(/<input\b[^<]*>/gi, '');
  cleanHTML = cleanHTML.replace(/<textarea\b[^<]*(?:(?!<\/textarea>)<[^<]*)*<\/textarea>/gi, '');
  cleanHTML = cleanHTML.replace(/<select\b[^<]*(?:(?!<\/select>)<[^<]*)*<\/select>/gi, '');
  
  // Remove dangerous protocols
  cleanHTML = cleanHTML.replace(/javascript:/gi, '');
  cleanHTML = cleanHTML.replace(/vbscript:/gi, '');
  cleanHTML = cleanHTML.replace(/data:/gi, '');
  cleanHTML = cleanHTML.replace(/on\w+\s*=/gi, ''); // Remove event handlers
  
  // Remove dangerous attributes
  cleanHTML = cleanHTML.replace(/\s(on\w+|style|srcdoc)\s*=\s*["'][^"']*["']/gi, '');
  
  return cleanHTML;
}

// Enhanced input sanitization for forms
export function sanitizeFormInput(input: string): string {
  if (!input || typeof input !== 'string') return '';
  
  return input
    .trim()
    .replace(/[<>]/g, '') // Basic XSS protection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/data:/gi, '') // Remove data: protocol
    .replace(/vbscript:/gi, '') // Remove vbscript: protocol
    .slice(0, 2000); // Limit length
}

// CSRF token utilities with enhanced security
export function generateCSRFToken(): string {
  // Use crypto.randomUUID if available, fallback to secure random bytes
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID() + '-' + Date.now();
  }
  
  return Array.from(crypto.getRandomValues(new Uint8Array(32)))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('') + '-' + Date.now();
}

export async function validateCSRFToken(token: string, sessionToken: string): Promise<boolean> {
  // Enhanced CSRF validation
  if (!token || !sessionToken) return false;
  if (token === sessionToken) return true;
  
  // Check if token is not too old (24 hours max)
  const tokenParts = token.split('-');
  const sessionParts = sessionToken.split('-');
  
  if (tokenParts.length === 2 && sessionParts.length === 2) {
    const tokenTime = parseInt(tokenParts[1]);
    const sessionTime = parseInt(sessionParts[1]);
    const now = Date.now();
    
    // Token shouldn't be older than 24 hours
    if (now - tokenTime > 24 * 60 * 60 * 1000) return false;
    if (now - sessionTime > 24 * 60 * 60 * 1000) return false;
    
    return tokenParts[0] === sessionParts[0];
  }
  
  return false;
}

// Clean up old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of rateLimitMap.entries()) {
    if (entry.resetTime < now) {
      rateLimitMap.delete(key);
    }
  }
}, 60000); // Clean up every minute