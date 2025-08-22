'use client';

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import TipTapEditor from '@/app/components/TipTapEditor';
import ImageUpload from '@/app/components/ImageUpload';

interface Author {
  id: number;
  name: string;
  email: string;
}

interface Category {
  id: number;
  name: string;
  slug: string;
}

interface Article {
  id: number;
  title: string;
  slug: string;
  excerpt?: string;
  content: string;
  featured_image?: string;
  featured_image_alt?: string;
  meta_title?: string;
  meta_description?: string;
  author_id: number;
  category_id: number;
  status: string;
  tags?: string[];
}

export default function EditArticle() {
  const router = useRouter();
  const params = useParams();
  const articleId = params.id as string;
  
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [authors, setAuthors] = useState<Author[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [article, setArticle] = useState<Article | null>(null);

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    meta_title: '',
    meta_description: '',
    author_id: '',
    category_id: '',
    status: 'draft',
    tags: '',
    featured_image: '',
    featured_image_alt: ''
  });

  useEffect(() => {
    fetchArticle();
    fetchAuthors();
    fetchCategories();
  }, [articleId]);

  const fetchArticle = async () => {
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/`);
      const data = await response.json();
      
      if (data.success) {
        const article = data.data;
        setArticle(article);
        setFormData({
          title: article.title || '',
          slug: article.slug || '',
          excerpt: article.excerpt || '',
          content: article.content || '',
          meta_title: article.meta_title || '',
          meta_description: article.meta_description || '',
          author_id: article.author_id?.toString() || '',
          category_id: article.category_id?.toString() || '',
          status: article.status || 'draft',
          tags: article.tags?.join(', ') || '',
          featured_image: article.featured_image || '',
          featured_image_alt: article.featured_image_alt || ''
        });
      } else {
        setError('Article not found');
      }
    } catch (error) {
      setError('Failed to fetch article');
    } finally {
      setPageLoading(false);
    }
  };

  const fetchAuthors = async () => {
    try {
      const response = await fetch('/api/admin/authors/');
      const data = await response.json();
      if (data.success) {
        setAuthors(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch authors:', error);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/admin/categories/');
      const data = await response.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');
  };

  const handleTitleChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      title: value,
      slug: generateSlug(value)
    }));
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent, status: string = formData.status) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const tagsArray = formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag);
      
      const payload = {
        ...formData,
        status,
        author_id: parseInt(formData.author_id),
        category_id: parseInt(formData.category_id),
        tags: tagsArray,
        featured_image: formData.featured_image || null,
        meta_title: formData.meta_title || null,
        meta_description: formData.meta_description || null,
        excerpt: formData.excerpt || null
      };

      const response = await fetch(`/api/admin/articles/${articleId}/`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(`Article ${status === 'published' ? 'published' : 'updated'} successfully!`);
        setTimeout(() => {
          router.push('/admin/articles/');
        }, 1500);
      } else {
        setError(data.error || 'Failed to update article');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(`/api/admin/articles/${articleId}/`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Article deleted successfully!');
        setTimeout(() => {
          router.push('/admin/articles/');
        }, 1500);
      } else {
        setError(data.error || 'Failed to delete article');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading article...</p>
        </div>
      </div>
    );
  }

  if (!article) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Article Not Found</h1>
          <button
            onClick={() => router.push('/admin/articles/')}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Back to Articles
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
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
              <li>
                <a href="/admin/articles/" className="text-gray-400 hover:text-gray-500">
                  Articles
                </a>
              </li>
              <li>
                <svg className="flex-shrink-0 h-5 w-5 text-gray-300" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </li>
              <li className="text-gray-700">Edit: {article.title}</li>
            </ol>
          </nav>
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900">Edit Article</h1>
            <div className="flex space-x-3">
              <span className={`px-3 py-1 rounded-full text-sm ${
                article.status === 'published' 
                  ? 'bg-green-100 text-green-800' 
                  : article.status === 'draft'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-gray-100 text-gray-800'
              }`}>
                {article.status}
              </span>
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

        <form onSubmit={(e) => handleSubmit(e)} className="space-y-8">
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Article Details</h2>
            
            <div className="grid grid-cols-1 gap-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="Enter article title"
                />
              </div>

              {/* Slug */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Slug
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.slug}
                  onChange={(e) => handleInputChange('slug', e.target.value)}
                  placeholder="article-url-slug"
                />
              </div>

              {/* Excerpt */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Excerpt
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.excerpt}
                  onChange={(e) => handleInputChange('excerpt', e.target.value)}
                  placeholder="Brief description of the article"
                />
              </div>

              {/* Content */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <TipTapEditor
                  value={formData.content}
                  onChange={(value) => handleInputChange('content', value)}
                  placeholder="Write your article content here..."
                />
              </div>

              {/* Author and Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Author *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.author_id}
                    onChange={(e) => handleInputChange('author_id', e.target.value)}
                  >
                    {authors.map(author => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category *
                  </label>
                  <select
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={formData.category_id}
                    onChange={(e) => handleInputChange('category_id', e.target.value)}
                  >
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Tags */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tags
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.tags}
                  onChange={(e) => handleInputChange('tags', e.target.value)}
                  placeholder="tag1, tag2, tag3"
                />
                <p className="mt-1 text-sm text-gray-500">Separate tags with commas</p>
              </div>
            </div>
          </div>

          {/* SEO Settings */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">SEO Settings</h2>
            
            <div className="grid grid-cols-1 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Title
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.meta_title}
                  onChange={(e) => handleInputChange('meta_title', e.target.value)}
                  placeholder="SEO optimized title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Meta Description
                </label>
                <textarea
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.meta_description}
                  onChange={(e) => handleInputChange('meta_description', e.target.value)}
                  placeholder="SEO meta description"
                />
              </div>

              <div>
                <ImageUpload
                  onImageUploaded={(imageUrl) => handleInputChange('featured_image', imageUrl)}
                  currentImage={formData.featured_image}
                  label="Featured Image"
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Featured Image Alt Text
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={formData.featured_image_alt}
                  onChange={(e) => handleInputChange('featured_image_alt', e.target.value)}
                  placeholder="Describe the featured image for accessibility"
                />
                <p className="mt-1 text-sm text-gray-500">Important for SEO and accessibility</p>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-between items-center bg-white shadow rounded-lg p-6">
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 text-white bg-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 disabled:opacity-50"
              >
                Delete
              </button>
            </div>

            <div className="flex space-x-3">
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'draft')}
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 disabled:opacity-50"
              >
                {loading ? 'Saving...' : 'Save Draft'}
              </button>
              
              <button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                disabled={loading}
                className="px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {loading ? 'Publishing...' : 'Update & Publish'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}