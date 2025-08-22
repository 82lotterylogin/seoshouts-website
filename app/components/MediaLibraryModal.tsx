'use client';

import { useState, useEffect } from 'react';

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

interface MediaLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectImage: (imageUrl: string) => void;
  allowMultiple?: boolean;
}

export default function MediaLibraryModal({ isOpen, onClose, onSelectImage, allowMultiple = false }: MediaLibraryModalProps) {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);

  useEffect(() => {
    if (isOpen) {
      fetchImages();
    }
  }, [isOpen]);

  const fetchImages = async () => {
    setLoading(true);
    try {
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

  const handleImageSelect = (imageUrl: string) => {
    if (allowMultiple) {
      setSelectedImages(prev => 
        prev.includes(imageUrl) 
          ? prev.filter(url => url !== imageUrl)
          : [...prev, imageUrl]
      );
    } else {
      onSelectImage(imageUrl);
      onClose();
    }
  };

  const handleMultipleSelect = () => {
    if (selectedImages.length > 0) {
      onSelectImage(selectedImages.join(','));
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
      <div className="relative top-8 mx-auto p-6 border max-w-6xl shadow-lg rounded-md bg-white">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-900">Select from Media Library</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl font-bold"
          >
            ×
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4">
            <div className="text-sm text-red-700">{error}</div>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="ml-4 text-gray-600">Loading media library...</p>
          </div>
        ) : (
          <>
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
                <p className="mt-1 text-sm text-gray-500">Upload images first to select from library.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 max-h-96 overflow-y-auto">
                {images.map((image) => (
                  <div 
                    key={image.id} 
                    className={`bg-white rounded-lg border-2 overflow-hidden cursor-pointer hover:shadow-md transition-all ${
                      selectedImages.includes(image.url) ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-blue-300'
                    }`}
                    onClick={() => handleImageSelect(image.url)}
                  >
                    <div className="aspect-w-1 aspect-h-1">
                      <img
                        src={image.url}
                        alt={image.alt_text || image.original_name}
                        className="w-full h-32 object-cover"
                      />
                    </div>
                    <div className="p-2">
                      <h4 className="text-xs font-medium text-gray-900 truncate">
                        {image.original_name}
                      </h4>
                      <p className="text-xs text-gray-500 mt-1">
                        {formatFileSize(image.size)}
                      </p>
                      {selectedImages.includes(image.url) && (
                        <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                          <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {allowMultiple && selectedImages.length > 0 && (
              <div className="mt-6 flex justify-between items-center border-t pt-4">
                <p className="text-sm text-gray-600">
                  {selectedImages.length} image(s) selected
                </p>
                <div className="flex space-x-3">
                  <button
                    onClick={() => setSelectedImages([])}
                    className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                  >
                    Clear Selection
                  </button>
                  <button
                    onClick={handleMultipleSelect}
                    className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  >
                    Select Images
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}