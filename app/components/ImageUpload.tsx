'use client';

import { useState, useEffect } from 'react';
import MediaLibraryModal from './MediaLibraryModal';

interface ImageUploadProps {
  onImageUploaded: (imageUrl: string) => void;
  currentImage?: string;
  label?: string;
  placeholder?: string;
}

export default function ImageUpload({ onImageUploaded, currentImage, label = "Image", placeholder = "Upload an image or enter URL" }: ImageUploadProps) {
  const [uploading, setUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState(currentImage || '');
  const [uploadError, setUploadError] = useState('');
  const [originalFileName, setOriginalFileName] = useState('');
  const [showMediaLibrary, setShowMediaLibrary] = useState(false);

  // Fetch original filename for existing images
  const fetchOriginalFilename = async (imageUrl: string) => {
    if (!imageUrl || !imageUrl.includes('/uploads/')) return;
    
    try {
      // Extract filename from URL
      const filename = imageUrl.split('/').pop();
      if (!filename) return;
      
      const response = await fetch('/api/admin/images');
      const data = await response.json();
      
      if (data.success) {
        const image = data.data.images.find((img: any) => img.filename === filename);
        if (image) {
          setOriginalFileName(image.original_name);
        }
      }
    } catch (error) {
      console.error('Error fetching image details:', error);
    }
  };

  // Load original filename on mount if currentImage exists
  useEffect(() => {
    if (currentImage) {
      fetchOriginalFilename(currentImage);
    }
  }, [currentImage]);

  const handleFileUpload = async (file: File) => {
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select a valid image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image size must be less than 5MB');
      return;
    }

    setUploading(true);
    setUploadError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('alt_text', file.name.replace(/\.[^/.]+$/, '')); // Use filename as alt text

      const response = await fetch('/api/admin/images/', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        const uploadedUrl = data.data.url;
        setImageUrl(uploadedUrl);
        setOriginalFileName(data.data.original_name);
        onImageUploaded(uploadedUrl);
      } else {
        setUploadError(data.error || 'Upload failed');
      }
    } catch (error) {
      setUploadError('Network error occurred');
    } finally {
      setUploading(false);
    }
  };

  const handleUrlChange = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
  };

  const handleMediaLibrarySelect = (url: string) => {
    setImageUrl(url);
    onImageUploaded(url);
    fetchOriginalFilename(url); // Fetch filename for library images
    setShowMediaLibrary(false);
  };

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      
      {/* URL Input */}
      <div className="mb-4">
        <input
          type="text"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={imageUrl}
          onChange={(e) => handleUrlChange(e.target.value)}
          placeholder={placeholder}
        />
        {originalFileName && (
          <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded-md">
            <p className="text-sm text-blue-800 font-medium">
              📎 Uploaded file: {originalFileName}
            </p>
            <p className="text-xs text-blue-600 mt-1">
              Storage path: {imageUrl}
            </p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mb-4 flex space-x-3">
        <button
          type="button"
          onClick={() => setShowMediaLibrary(true)}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Select from Library
        </button>
        <span className="text-gray-400 self-center">or</span>
      </div>

      {/* File Upload Area */}
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
        <input
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleFileUpload(file);
          }}
          className="hidden"
          id="image-upload"
          disabled={uploading}
        />
        
        <label
          htmlFor="image-upload"
          className={`cursor-pointer inline-flex flex-col items-center ${uploading ? 'opacity-50' : 'hover:text-blue-600'}`}
        >
          {uploading ? (
            <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mb-2"></div>
          ) : (
            <svg className="w-8 h-8 text-gray-400 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
          )}
          <span className="text-sm text-gray-600">
            {uploading ? 'Uploading...' : 'Click to upload or drag and drop'}
          </span>
          <span className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</span>
        </label>
      </div>

      {/* Upload Error */}
      {uploadError && (
        <div className="mt-2 text-sm text-red-600">
          {uploadError}
        </div>
      )}

      {/* Image Preview */}
      {imageUrl && (
        <div className="mt-4">
          <p className="text-sm text-gray-600 mb-2">Preview:</p>
          <div className="relative inline-block">
            <img
              src={imageUrl}
              alt="Preview"
              className="max-w-xs h-32 object-cover rounded-lg border border-gray-200"
              onError={() => setUploadError('Failed to load image')}
            />
            <button
              type="button"
              onClick={() => {
                setImageUrl('');
                setOriginalFileName('');
                onImageUploaded('');
              }}
              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Media Library Modal */}
      <MediaLibraryModal
        isOpen={showMediaLibrary}
        onClose={() => setShowMediaLibrary(false)}
        onSelectImage={handleMediaLibrarySelect}
      />
    </div>
  );
}