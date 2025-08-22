'use client';

import { useState, useEffect, useRef } from 'react';
import AdminNav from '@/app/components/AdminNav';

interface Image {
  id: number;
  filename: string;
  original_name: string;
  mime_type: string;
  size: number;
  alt_text?: string;
  url: string;
  created_at: string;
}

export default function MediaLibrary() {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/images/');
      const data = await response.json();
      
      if (data.success) {
        setImages(data.data.images);
      } else {
        setError('Failed to fetch images');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    setError('');
    setSuccess('');

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append('file', file);

        const response = await fetch('/api/admin/images/', {
          method: 'POST',
          body: formData,
        });

        const data = await response.json();

        if (!data.success) {
          throw new Error(data.error || `Failed to upload ${file.name}`);
        }
      }

      setSuccess(`Successfully uploaded ${files.length} file(s)`);
      await fetchImages();
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Upload failed');
      setTimeout(() => setError(''), 5000);
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const openImageModal = (image: Image) => {
    setSelectedImage(image);
    setAltText(image.alt_text || '');
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedImage(null);
    setAltText('');
    setError('');
    setSuccess('');
  };

  const updateAltText = async () => {
    if (!selectedImage) return;

    try {
      const response = await fetch(`/api/admin/images/${selectedImage.id}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alt_text: altText })
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Alt text updated successfully!');
        await fetchImages();
        setTimeout(() => {
          closeModal();
        }, 1500);
      } else {
        setError(data.error || 'Failed to update alt text');
      }
    } catch (error) {
      setError('Network error occurred');
    }
  };

  const copyImageUrl = (url: string) => {
    const fullUrl = `${window.location.origin}${url}`;
    navigator.clipboard.writeText(fullUrl);
    setSuccess('Image URL copied to clipboard!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const deleteImage = async (image: Image) => {
    if (!confirm(`Are you sure you want to delete "${image.original_name}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/images/${image.id}/`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Image deleted successfully!');
        await fetchImages();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(data.error || 'Failed to delete image');
        setTimeout(() => setError(''), 3000);
      }
    } catch (error) {
      setError('Network error occurred');
      setTimeout(() => setError(''), 3000);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading media library...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <nav className="flex mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <a href="/admin/" className="text-gray-400 hover:text-gray-500">
                  Dashboard
                </a>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-700">Media Library</li>
            </ol>
          </nav>
          
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Media Library</h1>
            <div className="flex space-x-3">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileUpload}
                multiple
                accept="image/*"
                className="hidden"
              />
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {uploading ? 'Uploading...' : 'Upload Images'}
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {error && (
          <div className="mb-6 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-md bg-green-50 p-4">
            <div className="text-sm text-green-700">{success}</div>
          </div>
        )}

        {/* Upload Area */}
        <div className="mb-8 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-white">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            stroke="currentColor"
            fill="none"
            viewBox="0 0 48 48"
          >
            <path
              d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <div className="mt-4">
            <p className="text-sm text-gray-600">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Click to upload
              </button>{' '}
              or drag and drop
            </p>
            <p className="text-xs text-gray-500">PNG, JPG, WebP, GIF up to 5MB</p>
          </div>
        </div>

        {/* Images Grid */}
        {images.length === 0 ? (
          <div className="text-center py-12">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">Get started by uploading your first image.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {images.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="aspect-w-1 aspect-h-1 w-full">
                  <img
                    src={image.url}
                    alt={image.alt_text || image.original_name}
                    className="w-full h-48 object-cover cursor-pointer hover:opacity-75 transition-opacity"
                    onClick={() => openImageModal(image)}
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-sm font-medium text-gray-900 truncate">
                    {image.original_name}
                  </h3>
                  <div className="mt-1 text-xs text-gray-500">
                    <p>{formatFileSize(image.size)}</p>
                    <p>{new Date(image.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <button
                      onClick={() => copyImageUrl(image.url)}
                      className="flex-1 text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded hover:bg-blue-100"
                    >
                      Copy URL
                    </button>
                    <button
                      onClick={() => deleteImage(image)}
                      className="flex-1 text-xs bg-red-50 text-red-700 px-2 py-1 rounded hover:bg-red-100"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Image Detail Modal */}
        {showModal && selectedImage && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
            <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
              <div className="mt-3">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  Image Details
                </h3>
                
                {/* Modal Messages */}
                {error && (
                  <div className="mb-4 rounded-md bg-red-50 p-3">
                    <div className="text-sm text-red-700">{error}</div>
                  </div>
                )}

                {success && (
                  <div className="mb-4 rounded-md bg-green-50 p-3">
                    <div className="text-sm text-green-700">{success}</div>
                  </div>
                )}

                <div className="space-y-4">
                  <div>
                    <img
                      src={selectedImage.url}
                      alt={selectedImage.alt_text || selectedImage.original_name}
                      className="w-full h-48 object-cover rounded-md"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Filename:</p>
                    <p className="text-sm text-gray-600">{selectedImage.original_name}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Size:</p>
                    <p className="text-sm text-gray-600">{formatFileSize(selectedImage.size)}</p>
                  </div>

                  <div>
                    <p className="text-sm font-medium text-gray-700">Type:</p>
                    <p className="text-sm text-gray-600">{selectedImage.mime_type}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Alt Text
                    </label>
                    <textarea
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={altText}
                      onChange={(e) => setAltText(e.target.value)}
                      placeholder="Describe this image for accessibility"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <button
                      type="button"
                      onClick={closeModal}
                      className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={updateAltText}
                      className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      Update Alt Text
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}