'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import AdminNav from '@/app/components/AdminNav';

interface Stats {
  articles: {
    total: number;
    published: number;
  };
  categories: number;
  authors: number;
  images: number;
  redirections: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats>({
    articles: { total: 0, published: 0 },
    categories: 0,
    authors: 0,
    images: 0,
    redirections: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNav />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Blog Admin Dashboard</h1>
          <p className="mt-2 text-gray-600">Manage your blog content, authors, and settings</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  📝
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Articles</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.articles.total}
                </p>
                <p className="text-xs text-gray-400">
                  {loading ? '' : `${stats.articles.published} published`}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  🏷️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Categories</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.categories}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  👤
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Authors</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.authors}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                  🖼️
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Images</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.images}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center">
                  🔄
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Redirections</p>
                <p className="text-2xl font-bold text-gray-900">
                  {loading ? '...' : stats.redirections}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link
            href="/admin/articles"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-blue-600">
                  Manage Articles
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Create, edit, and publish blog posts
                </p>
              </div>
              <div className="text-blue-600 group-hover:text-blue-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/categories"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-green-600">
                  Manage Categories
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Organize content with categories
                </p>
              </div>
              <div className="text-green-600 group-hover:text-green-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/authors"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-purple-600">
                  Manage Authors
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Add and edit author profiles
                </p>
              </div>
              <div className="text-purple-600 group-hover:text-purple-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/images"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-yellow-600">
                  Media Library
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Upload and manage images
                </p>
              </div>
              <div className="text-yellow-600 group-hover:text-yellow-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/admin/redirections"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600">
                  Redirections
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Manage URL redirects
                </p>
              </div>
              <div className="text-red-600 group-hover:text-red-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </div>
            </div>
          </Link>

          <Link
            href="/"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow group"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  View Website
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Go to the main website
                </p>
              </div>
              <div className="text-indigo-600 group-hover:text-indigo-700">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Getting Started</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-600">
                1
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">Set up Authors</h4>
                <p className="text-sm text-gray-600">Add author profiles before creating articles</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-sm font-semibold text-green-600">
                2
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">Create Categories</h4>
                <p className="text-sm text-gray-600">Organize your content with relevant categories</p>
              </div>
            </div>
            <div className="flex items-start">
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-sm font-semibold text-purple-600">
                3
              </div>
              <div className="ml-4">
                <h4 className="text-sm font-semibold text-gray-900">Write Your First Article</h4>
                <p className="text-sm text-gray-600">Start creating engaging blog content</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}